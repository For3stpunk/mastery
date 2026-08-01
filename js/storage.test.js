/**
 * Regression tests for two real bugs found after initial ship:
 * 1. Renaming the localStorage key silently orphaned existing progress.
 * 2. dayKey() round-tripped through UTC and shifted dates for anyone
 *    not near UTC+0 (app.js's separate todayKey() had the same class
 *    of bug, in the opposite direction).
 *
 * Run with: node js/storage.test.js
 */

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("PASS:", msg);
  }
}

// --- Test 1: migration from the old storage key name ---
(function testMigration() {
  const store = {};
  global.localStorage = {
    getItem: (k) => (store.hasOwnProperty(k) ? store[k] : null),
    setItem: (k, v) => (store[k] = String(v)),
  };
  delete require.cache[require.resolve("./storage.js")];
  const STORAGE = require("./storage.js");

  store["mastery-commons:v1"] = JSON.stringify({
    version: 1,
    subjects: { music: { activities: [{ type: "quiz_correct", timestamp: new Date().toISOString() }], streak: { current: 3, longest: 3, lastCheckin: null } } },
    customSubjects: {},
    connections: [],
  });

  const loaded = STORAGE.load();
  assert(Object.keys(loaded.subjects).includes("music"), "progress under the old storage key is found and loaded");
  assert(!!store["mastery:v1"], "old-key progress gets migrated forward to the new key");

  // second load, no old key present at all — should NOT throw, should return empty state
  delete store["mastery-commons:v1"];
  delete store["mastery:v1"];
  delete require.cache[require.resolve("./storage.js")];
  const STORAGE2 = require("./storage.js");
  const freshLoad = STORAGE2.load();
  assert(Object.keys(freshLoad.subjects).length === 0, "a brand new user with no saved data at all gets a clean empty state");
})();

// --- Test 2: dayKey correctness across timezones ---
// These run the SAME logical assertion under different TZ environment
// variables via child processes, since Node reads TZ at Date-construction
// time, not at process start.
const { execFileSync } = require("child_process");
const path = require("path");

function dayKeyUnderTZ(tz, dateArgs) {
  const script = `
    const HEATMAP = require(${JSON.stringify(path.join(__dirname, "heatmap.js"))});
    const d = new Date(${dateArgs});
    console.log(HEATMAP.dayKey(d));
  `;
  return execFileSync(process.execPath, ["-e", script], {
    env: Object.assign({}, process.env, { TZ: tz }),
    encoding: "utf8",
  }).trim();
}

// A moment just after local midnight in Tokyo (UTC+9) should still be
// counted as THAT local day, not the day before (the old bug shifted it
// back a day for any positive UTC offset).
assert(
  dayKeyUnderTZ("Asia/Tokyo", "2026, 7, 1, 0, 30, 0") === "2026-08-01",
  "Tokyo (UTC+9), 00:30 local on Aug 1 correctly logs as 2026-08-01"
);

// An evening check-in in Chicago (UTC-5/-6) should stay on the correct
// local day, not roll forward to tomorrow (the old app.js todayKey bug).
assert(
  dayKeyUnderTZ("America/Chicago", "2026, 6, 31, 20, 0, 0") === "2026-07-31",
  "Chicago (UTC-5), 20:00 local on Jul 31 correctly logs as 2026-07-31, not Aug 1"
);

console.log("\nDone.");
