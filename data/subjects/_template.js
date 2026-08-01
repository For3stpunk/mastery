/**
 * TEMPLATE — copy this file to add a new subject.
 *
 * 1. Rename the file: data/subjects/your-subject.js
 * 2. Change every "template" below to your subject's id (lowercase, no spaces).
 * 3. Add a <script> tag for it in index.html, right after the other subject files.
 * 4. That's it — it'll appear on the dashboard automatically.
 *
 * You do NOT need to fill in every quiz question or prompt to get started;
 * an empty quizzes/prompts array is valid. But the richer this file is,
 * the more the system can actually help someone learn the subject.
 */
window.MASTERY_SUBJECTS = window.MASTERY_SUBJECTS || {};
window.MASTERY_SUBJECTS.template = {
  id: "template", // must match the object key above and be URL-safe
  label: "Your Subject Name",
  glyph: "★", // a single emoji or character shown as the subject's icon
  tagline: "A one-line description of the journey from novice to expert here.",
  accent: "#5B4A72", // a hex color used as this subject's accent throughout the UI

  // Quiz questions test Remember/Understand (Bloom levels 1-2 typically).
  // Tag each with the ONE dimension it best tests. See data/model.js for
  // the full list of valid dimension ids:
  //   formal | historical | geographic | impact | significance | comparative | experiential
  quizzes: [
    {
      id: "template-q1",
      question: "Your question here?",
      choices: ["Correct answer", "Wrong answer", "Wrong answer", "Wrong answer"],
      answerIndex: 0, // index into choices[] of the correct answer
      dimension: "formal",
      bloomLevel: 1, // 1 or 2 — quizzes are capped at "Understand"
    },
    // ...add as many as you like
  ],

  // Prompts are shown to guide journaling/essay writing for each dimension.
  // Each dimension can have any number of prompts; the UI shows one at random.
  prompts: {
    formal: ["A prompt about how the thing is made or built."],
    historical: ["A prompt about where it sits in time."],
    geographic: ["A prompt about where it comes from."],
    impact: ["A prompt about what it changed."],
    significance: ["A prompt about why it matters."],
    comparative: ["A prompt connecting it to something else."],
    experiential: ["A prompt about the learner's own personal reaction."],
  },
};
