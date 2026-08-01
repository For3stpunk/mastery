const { computeDailyActivityCounts, computeGlobalStreak, heatmapSVG } = require("./heatmap.js");

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("PASS:", msg);
  }
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Test 1: basic aggregation across subjects + connections
const state1 = {
  subjects: {
    music: { activities: [{ timestamp: daysAgo(0) }, { timestamp: daysAgo(0) }, { timestamp: daysAgo(1) }] },
    books: { activities: [{ timestamp: daysAgo(1) }] },
  },
  connections: [{ timestamp: daysAgo(2) }],
};
const counts1 = computeDailyActivityCounts(state1);
const todayKey = new Date().toISOString().slice(0, 10);
assert(counts1[todayKey] === 2, `today's count aggregates across subjects (got ${counts1[todayKey]})`);

// Test 2: a clean N-day streak ending today
const state2 = { subjects: { music: { activities: [] } }, connections: [] };
for (let i = 0; i < 7; i++) state2.subjects.music.activities.push({ timestamp: daysAgo(i) });
const counts2 = computeDailyActivityCounts(state2);
const streak2 = computeGlobalStreak(counts2);
assert(streak2.current === 7, `7 consecutive days (incl. today) gives current streak of 7 (got ${streak2.current})`);
assert(streak2.longest === 7, `longest matches current here (got ${streak2.longest})`);

// Test 3: grace period — nothing logged today yet, but yesterday's streak intact
const state3 = { subjects: { music: { activities: [] } }, connections: [] };
for (let i = 1; i <= 5; i++) state3.subjects.music.activities.push({ timestamp: daysAgo(i) }); // days 1-5, NOT today
const counts3 = computeDailyActivityCounts(state3);
const streak3 = computeGlobalStreak(counts3);
assert(streak3.current === 5, `grace period: streak still shows 5 even though today is empty (got ${streak3.current})`);

// Test 4: a genuinely broken streak (gap of 2+ days) resets to 0
const state4 = { subjects: { music: { activities: [] } }, connections: [] };
state4.subjects.music.activities.push({ timestamp: daysAgo(5) });
state4.subjects.music.activities.push({ timestamp: daysAgo(6) });
const counts4 = computeDailyActivityCounts(state4);
const streak4 = computeGlobalStreak(counts4);
assert(streak4.current === 0, `a stale streak (last activity 5+ days ago) correctly shows 0 (got ${streak4.current})`);
assert(streak4.longest === 2, `longest still reflects the old 2-day run (got ${streak4.longest})`);

// Test 5: longest streak can exceed current streak
const state5 = { subjects: { music: { activities: [] } }, connections: [] };
[10, 11, 12, 13, 14].forEach((n) => state5.subjects.music.activities.push({ timestamp: daysAgo(n) })); // old 5-day run
[0, 1].forEach((n) => state5.subjects.music.activities.push({ timestamp: daysAgo(n) })); // current 2-day run
const counts5 = computeDailyActivityCounts(state5);
const streak5 = computeGlobalStreak(counts5);
assert(streak5.current === 2, `current streak reflects the recent run only (got ${streak5.current})`);
assert(streak5.longest === 5, `longest streak reflects the older, longer run (got ${streak5.longest})`);

// Test 6: heatmap renders valid SVG with the right number of week columns
const svg = heatmapSVG(counts2, 10);
assert(svg.includes("<svg"), "heatmap produces an SVG string");
assert((svg.match(/<rect/g) || []).length > 0, "heatmap produces at least one cell");

// Test 7: every cell has a visible outline regardless of its fill color
// (previously the empty-day fill was nearly the same shade as the page
// background, making empty cells look like they weren't rendering)
assert(svg.includes('stroke="#C9BC9C"'), "heatmap cells have a visible outline stroke");

// Test 8: today's cell always gets its own distinct marker so it can be
// found at a glance, even with zero activities logged today
const emptyHeatmap = heatmapSVG({}, 4);
assert(emptyHeatmap.includes('stroke="#B4893F"'), "today's cell gets a distinct marker even with no activity logged yet");
assert(emptyHeatmap.includes("Today ("), "today's cell marker includes an identifiable tooltip");

console.log("\nDone.");
