window.MASTERY_SUBJECTS = window.MASTERY_SUBJECTS || {};
window.MASTERY_SUBJECTS.books = {
  id: "books",
  label: "Books & Literature",
  glyph: "📖",
  tagline: "From close reading a sentence to reading a whole culture.",
  accent: "#3B4C5E",
  quizzes: [
    {
      id: "books-q1",
      question: "What is 'free indirect discourse' in fiction?",
      choices: [
        "A narrative technique blending a character's voice into third-person narration",
        "Dialogue written without quotation marks",
        "A story told entirely through letters",
        "A plot structure with no clear resolution",
      ],
      answerIndex: 0,
      dimension: "formal",
      bloomLevel: 1,
    },
    {
      id: "books-q2",
      question: "The Harlem Renaissance was centered in which decade and neighborhood?",
      choices: ["1920s Harlem, New York City", "1950s South Side Chicago", "1930s Greenwich Village", "1960s Watts, Los Angeles"],
      answerIndex: 0,
      dimension: "geographic",
      bloomLevel: 1,
    },
    {
      id: "books-q3",
      question:
        "Modernist fiction's turn toward stream-of-consciousness narration is most often read as a response to:",
      choices: [
        "New psychological theories about the fragmented, associative nature of thought",
        "A shortage of paper during wartime",
        "The invention of the printing press",
        "Government censorship of dialogue",
      ],
      answerIndex: 0,
      dimension: "historical",
      bloomLevel: 2,
    },
    {
      id: "books-q4",
      question: "Why is a novel's reception history (how it was read differently across decades) worth studying?",
      choices: [
        "It reveals how changing social values reshape what a text is taken to mean",
        "It has no real scholarly value compared to the author's original intent",
        "It only matters for banned books",
        "It's identical across all time periods",
      ],
      answerIndex: 0,
      dimension: "significance",
      bloomLevel: 3,
    },
    {
      id: "books-q5",
      question: "A novel that gets adapted repeatedly across film, stage, and other media is a useful case study for:",
      choices: [
        "How a story's cultural impact outgrows its original form",
        "Proving the original text was flawed",
        "Showing that adaptation always improves on the source",
        "Nothing beyond marketing trends",
      ],
      answerIndex: 0,
      dimension: "impact",
      bloomLevel: 3,
    },
    {
      id: "books-q6",
      question:
        "Comparing the unreliable narrators of 'Lolita' and 'The Remains of the Day', the sharpest shared technique is:",
      choices: [
        "Both narrators reveal the truth through what they leave out or rationalize, not what they state",
        "Both novels are written in strict third person",
        "Both narrators are children",
        "Neither novel has a narrator at all",
      ],
      answerIndex: 0,
      dimension: "comparative",
      bloomLevel: 4,
    },
  ],
  prompts: {
    formal: [
      "Pick a paragraph you admire and rewrite it in a different point of view. What's lost or gained?",
      "Diagram the structure of a book's plot (not the events, the shape: flashback, frame story, etc).",
    ],
    historical: [
      "Place a book you've read into the literary movement it belongs to. What was that movement reacting against?",
      "Research the publishing history of one book: was it rejected, censored, or ignored before being recognized?",
    ],
    geographic: [
      "How does a book's setting function as more than backdrop — does place shape its moral logic?",
      "Compare two literary traditions from different countries writing about a similar theme.",
    ],
    impact: [
      "Trace one book's influence on a later book, film, or cultural movement you can point to directly.",
      "Has a book ever changed a policy, a public conversation, or an entire genre? Make the case for one.",
    ],
    significance: [
      "Argue for or against a book's place in 'the canon.' Who decided it belonged there, and why?",
      "What does a book's banning or censorship history reveal about the anxieties of its time?",
    ],
    comparative: [
      "Put two books from different eras in conversation. What would their authors argue about?",
      "Connect a technique from literature to something you've learned in another subject.",
    ],
    experiential: [
      "Journal about a book that changed how you saw something in your own life.",
      "What book have you outgrown, and what does your changed reaction tell you about yourself?",
    ],
  },
};
