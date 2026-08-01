/**
 * js/heatmap.js
 * -----------------------------------------------------------------------
 * Computes a GitHub-style "how many days have you logged in" heatmap and
 * streak across ALL subjects combined (any logged activity — quiz,
 * check-in, journal, essay, social post, or interdisciplinary connection
 * — counts as "showed up" that day). Pure functions, no DOM, so this can
 * be unit tested the same way js/leveling.js is.
 * -----------------------------------------------------------------------
 */
(function (root) {
  function dayKey(date) {
    // Use LOCAL calendar date components directly — never round-trip
    // through toISOString(), which reports the UTC date and silently
    // shifts the "day" by one for anyone not near UTC+0 (a day earlier
    // for timezones ahead of UTC, a day later for timezones behind it).
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  /**
   * Returns { "YYYY-MM-DD": count, ... } across every subject's activity
   * log plus every interdisciplinary connection.
   */
  function computeDailyActivityCounts(state) {
    const counts = {};
    Object.values(state.subjects || {}).forEach((subj) => {
      (subj.activities || []).forEach((a) => {
        const key = dayKey(a.timestamp);
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    (state.connections || []).forEach((c) => {
      const key = dayKey(c.timestamp);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  /**
   * Current streak has a one-day grace period: if you haven't logged
   * anything YET today, the streak doesn't reset until today actually
   * passes with nothing logged. Longest streak scans the full history.
   */
  function computeGlobalStreak(counts) {
    const hasDay = (d) => (counts[dayKey(d)] || 0) > 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let current = 0;
    let cursor = new Date(today);

    if (!hasDay(cursor)) {
      const yesterday = new Date(cursor);
      yesterday.setDate(yesterday.getDate() - 1);
      if (hasDay(yesterday)) cursor = yesterday;
      else return { current: 0, longest: computeLongest(counts) };
    }
    while (hasDay(cursor)) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { current, longest: Math.max(current, computeLongest(counts)) };
  }

  function computeLongest(counts) {
    const days = Object.keys(counts)
      .filter((k) => counts[k] > 0)
      .sort();
    let longest = 0,
      run = 0,
      prevDate = null;
    days.forEach((key) => {
      const d = new Date(key);
      if (prevDate) {
        const diff = Math.round((d - prevDate) / 86400000);
        run = diff === 1 ? run + 1 : 1;
      } else {
        run = 1;
      }
      longest = Math.max(longest, run);
      prevDate = d;
    });
    return longest;
  }

  /**
   * Builds a GitHub-style contribution grid as an SVG string: `weeks`
   * columns (Sunday-aligned) of 7 rows, most recent week on the right,
   * ending today. Each cell gets an <title> for a native hover tooltip.
   */
  function heatmapSVG(counts, days) {
    days = days || 91; // 13 exact weeks of 7 — a clean grid, no partial trailing column
    const cellSize = 13,
      gap = 3,
      step = cellSize + gap,
      topPad = 16; // room for month labels

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const COLORS = ["#eeece7", "#a9c2b3", "#6a9a80", "#3f6e58"];
    const levelFor = (count) => (count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3);
    const todayKeyStr = dayKey(today);
    const weeks = Math.ceil(days / 7);

    let cellsSVG = "";
    let todayMarkerSVG = "";
    let monthLabelsSVG = "";
    let lastMonth = -1;

    // A calendar grid — 7 rows per column, columns left-to-right — but
    // anchored at TODAY instead of a calendar week boundary: cell (0,0)
    // is today, and every other cell counts forward from there, filling
    // each column top-to-bottom before moving to the next column right.
    // Today is always the very first cell, so it's visible with zero
    // scrolling, and cells fill in with color as each day actually
    // happens (future days render as empty placeholders until then).
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const i = w * 7 + d;
        if (i >= days) continue;
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const key = dayKey(date);
        const count = counts[key] || 0;
        const x = w * step;
        const y = topPad + d * step;

        cellsSVG += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${COLORS[levelFor(count)]}" stroke="#C9BC9C" stroke-width="0.75"><title>${key}: ${count} activit${count === 1 ? "y" : "ies"}</title></rect>`;

        if (key === todayKeyStr) {
          // A distinct brass-colored ring marks today's cell specifically,
          // on top of whatever fill color it already has.
          todayMarkerSVG = `<rect x="${x - 1.5}" y="${y - 1.5}" width="${cellSize + 3}" height="${cellSize + 3}" rx="3" fill="none" stroke="#B4893F" stroke-width="1.75"><title>Today (${key})</title></rect>`;
        }

        if (d === 0 && date.getMonth() !== lastMonth) {
          lastMonth = date.getMonth();
          monthLabelsSVG += `<text x="${x}" y="${topPad - 5}" font-size="9" fill="#4A4437" font-family="var(--font-mono)">${date.toLocaleString("default", { month: "short" })}</text>`;
        }
      }
    }

    const width = weeks * step;
    const height = topPad + 7 * step;

    return `<svg viewBox="0 0 ${width} ${height}" class="heatmap" role="img" aria-label="Activity heatmap">
      ${monthLabelsSVG}
      ${cellsSVG}
      ${todayMarkerSVG}
    </svg>`;
  }

  const api = { dayKey, computeDailyActivityCounts, computeGlobalStreak, heatmapSVG };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.MASTERY_HEATMAP = api;
  }
})(typeof window !== "undefined" ? window : global);
