/**
 * js/leveling.js
 * -----------------------------------------------------------------------
 * Pure functions for turning a log of activities into XP, dimension
 * balance, and a mastery tier. No DOM access here on purpose — this file
 * can be unit tested with plain Node (see /js/leveling.test.js).
 * -----------------------------------------------------------------------
 */
(function (root) {
  const MODEL = typeof module !== "undefined" && module.exports
    ? require("../data/model.js")
    : root.MASTERY_MODEL;

  const { ACTIVITY_TYPES, DIMENSION_ORDER, TIERS, streakMultiplier } = MODEL;

  /**
   * Compute total XP per dimension, total XP, essay count, and longest
   * streak from a flat list of logged activities for ONE subject.
   *
   * activity shape:
   * {
   *   type: "quiz_correct" | "quiz_incorrect" | "streak_checkin" |
   *         "social_post" | "journal" | "essay",
   *   dimensions: ["formal", "historical"],  // 1+ dimension tags
   *   bloomLevel: 1-6,                        // capped by activity type
   *   timestamp: ISO string,
   *   streakDayAtLogging: number,             // streak length that day
   *   note: string (optional),
   * }
   */
  function summarizeActivities(activities) {
    const dimensionXP = {};
    DIMENSION_ORDER.forEach((d) => (dimensionXP[d] = 0));

    let totalXP = 0;
    let essayCount = 0;
    let longestStreak = 0;
    let socialPostCount = 0;
    const weeklySocialCounts = {}; // ISO week -> count, for the weekly cap

    activities.forEach((a) => {
      const def = ACTIVITY_TYPES[a.type];
      if (!def) return;

      // Respect the weekly cap on social posts (anti reputation-farming)
      if (def.weeklyCap) {
        const week = isoWeekKey(a.timestamp);
        weeklySocialCounts[week] = (weeklySocialCounts[week] || 0) + 1;
        if (weeklySocialCounts[week] > def.weeklyCap) return; // over cap, no credit
      }

      const mult = streakMultiplier(a.streakDayAtLogging || 0);
      let points = def.basePoints * mult;

      const dims = a.dimensions && a.dimensions.length ? a.dimensions : ["experiential"];

      if (def.countsAsEssay) {
        essayCount += 1;
        if (dims.length >= 2) points += def.synthesisBonus; // reward synthesis across ways of knowing
      }
      if (a.type === "social_post") socialPostCount += 1;

      // Split points evenly across all tagged dimensions
      const share = points / dims.length;
      dims.forEach((d) => {
        if (dimensionXP.hasOwnProperty(d)) dimensionXP[d] += share;
      });

      totalXP += points;
      longestStreak = Math.max(longestStreak, a.streakDayAtLogging || 0);
    });

    return { dimensionXP, totalXP, essayCount, longestStreak, socialPostCount };
  }

  function isoWeekKey(timestamp) {
    const d = new Date(timestamp);
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
  }

  /**
   * Given a subject's activity summary and its connection count (from
   * the interdisciplinary log), determine the current tier and how far
   * off the NEXT tier is — including which specific gate is blocking it.
   * This is the anti-min-maxing logic: breadth, essays, streak, and
   * (at higher tiers) public reputation are all required, not just XP.
   */
  function computeTier(summary, connectionCount) {
    const { dimensionXP, totalXP, essayCount, longestStreak, socialPostCount } = summary;

    let achieved = TIERS[0];
    let blockedBy = null;

    for (const tier of TIERS) {
      const minShareOK = DIMENSION_ORDER.every((d) => {
        if (totalXP === 0) return tier.minDimensionShare === 0;
        return dimensionXP[d] / totalXP >= tier.minDimensionShare;
      });
      const gates = [
        { ok: totalXP >= tier.xpRequired, label: `Reach ${tier.xpRequired} total XP` },
        {
          ok: minShareOK,
          label: `Bring every dimension to at least ${Math.round(tier.minDimensionShare * 100)}% of your total XP (don't neglect any way of knowing)`,
        },
        { ok: essayCount >= tier.minEssays, label: `Write ${tier.minEssays} academic-length essay(s)` },
        { ok: longestStreak >= tier.minLongestStreak, label: `Reach a ${tier.minLongestStreak}-day study streak` },
        { ok: connectionCount >= tier.minConnections, label: `Log ${tier.minConnections} interdisciplinary connection(s)` },
        {
          ok: !tier.requiresSocialPost || socialPostCount > 0,
          label: "Establish public reputation with at least one social post",
        },
      ];

      const failing = gates.filter((g) => !g.ok);
      if (failing.length === 0) {
        achieved = tier;
        blockedBy = null;
      } else if (achieved.rank === tier.rank - 1) {
        // this is the very next tier up from what's been achieved
        blockedBy = failing;
        break;
      }
    }

    const nextTier = TIERS.find((t) => t.rank === achieved.rank + 1) || null;

    return { tier: achieved, nextTier, blockedBy, totalXP, dimensionXP, essayCount, longestStreak };
  }

  function computePolymathTier(connections) {
    const subjectsSpanned = new Set();
    connections.forEach((c) => c.subjects.forEach((s) => subjectsSpanned.add(s)));
    const count = connections.length;
    const spanned = subjectsSpanned.size;

    let achieved = MODEL.POLYMATH_TIERS[0];
    MODEL.POLYMATH_TIERS.forEach((t) => {
      if (count >= t.connectionsRequired && spanned >= t.subjectsSpanned) achieved = t;
    });
    return { tier: achieved, connectionCount: count, subjectsSpanned: spanned };
  }

  const api = { summarizeActivities, computeTier, computePolymathTier, isoWeekKey };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.MASTERY_LEVELING = api;
  }
})(typeof window !== "undefined" ? window : global);
