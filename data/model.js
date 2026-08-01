/**
 * data/model.js
 * -----------------------------------------------------------------------
 * The shared rules of the system: the seven "ways of knowing" (dimensions),
 * Bloom's Taxonomy levels, activity types and their point values, and the
 * mastery tiers a learner climbs through. Subjects (music.js, books.js,
 * etc.) plug into this model — this file defines the *rules*, subjects
 * define the *content*.
 *
 * Nothing in here is subject-specific. If you're adding a new subject,
 * you should not need to touch this file.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------
// DIMENSIONS — the "ways of knowing" something. A person who can only
// answer trivia about a subject (dates, names) knows it in one dimension.
// Real expertise is knowing it from all seven angles at once.
// ---------------------------------------------------------------------
const DIMENSIONS = {
  formal: {
    id: "formal",
    label: "Formal & Technical",
    description:
      "How the thing is actually made or built: structure, technique, craft, theory. The 'grammar' of the subject.",
  },
  historical: {
    id: "historical",
    label: "Historical",
    description:
      "Where it sits in time: what came before it, what it broke from, what followed because of it.",
  },
  geographic: {
    id: "geographic",
    label: "Geographic & Cultural Origin",
    description:
      "Where it comes from and how place shaped it: regional traditions, migration, local material and custom.",
  },
  impact: {
    id: "impact",
    label: "Cultural Impact",
    description:
      "What it changed: the other works, artists, movements, or audiences it measurably influenced.",
  },
  significance: {
    id: "significance",
    label: "Cultural Significance",
    description:
      "Why it matters: its critical and philosophical weight, its claim on the canon, what it says about us.",
  },
  comparative: {
    id: "comparative",
    label: "Comparative Fluency",
    description:
      "How it connects to everything else you know: put two works, artists, or even two subjects side by side and say something true about both.",
  },
  experiential: {
    id: "experiential",
    label: "Personal & Experiential",
    description:
      "Your own developed response: taste, reaction, application, the parts of understanding that only come from sustained personal contact.",
  },
};

const DIMENSION_ORDER = [
  "formal",
  "historical",
  "geographic",
  "impact",
  "significance",
  "comparative",
  "experiential",
];

// ---------------------------------------------------------------------
// BLOOM'S TAXONOMY — the cognitive depth of a given piece of engagement.
// Every logged activity is tagged with the highest Bloom level it
// actually demonstrates, not just the activity type. A quiz answer is
// almost always Remember or Understand; a well-argued essay can reach
// Evaluate or Create.
// ---------------------------------------------------------------------
const BLOOM_LEVELS = [
  { level: 1, id: "remember", label: "Remember", verb: "recall facts" },
  { level: 2, id: "understand", label: "Understand", verb: "explain in your own words" },
  { level: 3, id: "apply", label: "Apply", verb: "use it in a new context" },
  { level: 4, id: "analyze", label: "Analyze", verb: "break it into parts and see how they relate" },
  { level: 5, id: "evaluate", label: "Evaluate", verb: "judge it against a standard, with reasons" },
  { level: 6, id: "create", label: "Create", verb: "produce something new built on it" },
];

// ---------------------------------------------------------------------
// ACTIVITY TYPES — the actions that earn points, per your brief:
// answering questions, streaks, social posting, journaling, and
// intensive/academic writing.
// ---------------------------------------------------------------------
const ACTIVITY_TYPES = {
  quiz_correct: {
    id: "quiz_correct",
    label: "Answered a question correctly",
    basePoints: 5,
    bloomCeiling: 2, // quizzes test Remember/Understand at best
    countsAsEssay: false,
  },
  quiz_incorrect: {
    id: "quiz_incorrect",
    label: "Attempted a question (missed it)",
    basePoints: 1,
    bloomCeiling: 1,
    countsAsEssay: false,
  },
  streak_checkin: {
    id: "streak_checkin",
    label: "Daily study check-in",
    basePoints: 3,
    bloomCeiling: 1,
    countsAsEssay: false,
  },
  social_post: {
    id: "social_post",
    label: "Posted publicly about the subject",
    basePoints: 15,
    bloomCeiling: 3, // asserting a public claim is at least "Apply"
    countsAsEssay: false,
    weeklyCap: 3, // prevents farming reputation points by spamming
  },
  journal: {
    id: "journal",
    label: "Free-write / journal entry",
    basePoints: 20,
    bloomCeiling: 4,
    countsAsEssay: false,
  },
  essay: {
    id: "essay",
    label: "Academic writing / essay (500+ words)",
    basePoints: 60,
    bloomCeiling: 6,
    countsAsEssay: true,
    synthesisBonus: 20, // bonus if tagged with 2+ dimensions at once
  },
};

// ---------------------------------------------------------------------
// STREAK MULTIPLIER — rewards consistency (attendance) without letting
// it dominate the system. Caps at 2x around a 50-day streak.
// ---------------------------------------------------------------------
function streakMultiplier(streakDays) {
  return Math.min(1 + streakDays * 0.02, 2.0);
}

// ---------------------------------------------------------------------
// MASTERY TIERS — loosely modeled on the Dreyfus model of skill
// acquisition (novice -> advanced beginner -> competent -> proficient
// -> expert), extended with two capstone tiers. Advancing past
// "Adept" requires BREADTH, not just volume: every dimension must
// carry a minimum share of total XP, so nobody reaches the top by
// grinding quizzes alone.
// ---------------------------------------------------------------------
const TIERS = [
  {
    id: "novice",
    rank: 1,
    label: "Novice",
    motto: "You know that you know nothing.",
    xpRequired: 0,
    minDimensionShare: 0, // no breadth requirement yet
    minEssays: 0,
    minLongestStreak: 0,
    minConnections: 0,
    requiresSocialPost: false,
  },
  {
    id: "apprentice",
    rank: 2,
    label: "Apprentice",
    motto: "You've started asking better questions than you can yet answer.",
    xpRequired: 150,
    minDimensionShare: 0,
    minEssays: 0,
    minLongestStreak: 0,
    minConnections: 0,
    requiresSocialPost: false,
  },
  {
    id: "journeyman",
    rank: 3,
    label: "Journeyman",
    motto: "You can follow the conversation. Now you can join it.",
    xpRequired: 500,
    minDimensionShare: 0,
    minEssays: 1,
    minLongestStreak: 3,
    minConnections: 0,
    requiresSocialPost: false,
  },
  {
    id: "adept",
    rank: 4,
    label: "Adept",
    motto: "You are starting to see the whole shape of the thing, not just its parts.",
    xpRequired: 1200,
    minDimensionShare: 0.08, // every dimension must hold at least 8% of XP
    minEssays: 2,
    minLongestStreak: 7,
    minConnections: 0,
    requiresSocialPost: false,
  },
  {
    id: "scholar",
    rank: 5,
    label: "Scholar",
    motto: "You could teach an introductory course and be trusted to do it well.",
    xpRequired: 2500,
    minDimensionShare: 0.1,
    minEssays: 3,
    minLongestStreak: 10,
    minConnections: 1,
    requiresSocialPost: false,
  },
  {
    id: "expert",
    rank: 6,
    label: "Expert",
    motto: "People bring you their hardest questions about this first.",
    xpRequired: 5000,
    minDimensionShare: 0.12,
    minEssays: 4,
    minLongestStreak: 14,
    minConnections: 2,
    requiresSocialPost: true,
  },
  {
    id: "authority",
    rank: 7,
    label: "Authority",
    motto: "Your take on it changes how other people think about it.",
    xpRequired: 9000,
    minDimensionShare: 0.11,
    minEssays: 6,
    minLongestStreak: 21,
    minConnections: 3,
    requiresSocialPost: true,
  },
  {
    id: "foremost",
    rank: 8,
    label: "World's Foremost Expert",
    motto: "When people say the name of this subject, some part of them thinks of you.",
    xpRequired: 15000,
    minDimensionShare: 0.1,
    minEssays: 10,
    minLongestStreak: 30,
    minConnections: 5,
    requiresSocialPost: true,
  },
];

// ---------------------------------------------------------------------
// POLYMATH TRACK — the cross-cutting "interdisciplinary mode" ladder.
// Separate from any single subject; tracks connections that span two
// or more subjects.
// ---------------------------------------------------------------------
const POLYMATH_TIERS = [
  { id: "observer", rank: 1, label: "Observer", connectionsRequired: 0, subjectsSpanned: 0 },
  { id: "connector", rank: 2, label: "Connector", connectionsRequired: 3, subjectsSpanned: 2 },
  { id: "synthesist", rank: 3, label: "Synthesist", connectionsRequired: 8, subjectsSpanned: 3 },
  { id: "renaissance", rank: 4, label: "Renaissance Mind", connectionsRequired: 15, subjectsSpanned: 3 },
  { id: "polymath", rank: 5, label: "Polymath", connectionsRequired: 25, subjectsSpanned: 4 },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DIMENSIONS,
    DIMENSION_ORDER,
    BLOOM_LEVELS,
    ACTIVITY_TYPES,
    TIERS,
    POLYMATH_TIERS,
    streakMultiplier,
  };
} else {
  window.MASTERY_MODEL = {
    DIMENSIONS,
    DIMENSION_ORDER,
    BLOOM_LEVELS,
    ACTIVITY_TYPES,
    TIERS,
    POLYMATH_TIERS,
    streakMultiplier,
  };
}
