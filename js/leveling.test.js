/**
 * Quick sanity tests for the leveling engine. Run with: node js/leveling.test.js
 * Not a full test suite — just enough to catch logic errors during development.
 */
const { summarizeActivities, computeTier, computePolymathTier } = require("./leveling.js");

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("PASS:", msg);
  }
}

// Test 1: pure quiz-grinding should NOT reach high tiers even with huge XP
const quizOnly = [];
for (let i = 0; i < 2000; i++) {
  quizOnly.push({
    type: "quiz_correct",
    dimensions: ["formal"],
    bloomLevel: 2,
    timestamp: new Date(2025, 0, 1 + i).toISOString(),
    streakDayAtLogging: 0,
  });
}
const quizSummary = summarizeActivities(quizOnly);
const quizTier = computeTier(quizSummary, 0);
assert(quizSummary.totalXP >= 9000, `quiz grinding produced enough raw XP (${Math.round(quizSummary.totalXP)})`);
assert(
  quizTier.tier.id !== "foremost" && quizTier.tier.rank <= 4,
  `quiz-only grinding is capped well below the top (landed at: ${quizTier.tier.id})`
);

// Test 2: a well-rounded learner should progress further with far less raw XP
const rounded = [
  { type: "essay", dimensions: ["formal", "historical"], bloomLevel: 6, timestamp: "2025-01-01", streakDayAtLogging: 5 },
  { type: "essay", dimensions: ["geographic", "impact"], bloomLevel: 5, timestamp: "2025-01-08", streakDayAtLogging: 12 },
  { type: "essay", dimensions: ["significance", "comparative"], bloomLevel: 5, timestamp: "2025-01-15", streakDayAtLogging: 20 },
  { type: "journal", dimensions: ["experiential"], bloomLevel: 3, timestamp: "2025-01-02", streakDayAtLogging: 6 },
  { type: "journal", dimensions: ["experiential", "formal"], bloomLevel: 4, timestamp: "2025-01-03", streakDayAtLogging: 7 },
  { type: "social_post", dimensions: ["impact"], bloomLevel: 3, timestamp: "2025-01-04", streakDayAtLogging: 8 },
  { type: "streak_checkin", dimensions: ["historical"], bloomLevel: 1, timestamp: "2025-01-05", streakDayAtLogging: 9 },
  { type: "essay", dimensions: ["formal", "comparative"], bloomLevel: 6, timestamp: "2025-01-20", streakDayAtLogging: 25 },
  { type: "journal", dimensions: ["geographic"], bloomLevel: 3, timestamp: "2025-01-06", streakDayAtLogging: 10 },
  { type: "journal", dimensions: ["significance"], bloomLevel: 3, timestamp: "2025-01-07", streakDayAtLogging: 11 },
];
const roundedSummary = summarizeActivities(rounded);
const roundedTier = computeTier(roundedSummary, 1);
assert(
  roundedTier.tier.rank >= 3,
  `well-rounded (but lower-XP) learner reaches at least Journeyman (landed at: ${roundedTier.tier.id}, ${Math.round(roundedSummary.totalXP)} XP)`
);

// Test 3: weekly social post cap actually caps
const spam = [];
for (let i = 0; i < 10; i++) {
  spam.push({
    type: "social_post",
    dimensions: ["impact"],
    bloomLevel: 3,
    timestamp: new Date(2025, 0, 1).toISOString(), // all same week
    streakDayAtLogging: 0,
  });
}
const spamSummary = summarizeActivities(spam);
assert(spamSummary.socialPostCount === 3, `weekly social post cap enforced (counted: ${spamSummary.socialPostCount})`);

// Test 4: polymath tier requires spanning multiple subjects, not just volume
const singleSubjectConnections = Array.from({ length: 20 }, () => ({ subjects: ["music", "music"] }));
const poly1 = computePolymathTier(singleSubjectConnections);
assert(poly1.tier.rank <= 2, `connections within one 'subject pair' repeated don't unlock top polymath tiers (landed: ${poly1.tier.id})`);

const spanningConnections = [
  { subjects: ["music", "architecture"] },
  { subjects: ["books", "art"] },
  { subjects: ["architecture", "books"] },
  { subjects: ["music", "art"] },
];
const poly2 = computePolymathTier(spanningConnections);
assert(poly2.subjectsSpanned === 4, `polymath tracker correctly counts distinct subjects spanned (${poly2.subjectsSpanned})`);

console.log("\nDone.");
