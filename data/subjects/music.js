window.MASTERY_SUBJECTS = window.MASTERY_SUBJECTS || {};
window.MASTERY_SUBJECTS.music = {
  id: "music",
  label: "Music",
  glyph: "♪",
  tagline: "From a single interval to the whole history of sound.",
  accent: "#7C5C3E",
  quizzes: [
    {
      id: "music-q1",
      question: "What are the two most common musical modes (scales) in Western tonal music?",
      choices: ["Major and minor", "Dorian and Phrygian", "Pentatonic and chromatic", "Whole-tone and octatonic"],
      answerIndex: 0,
      dimension: "formal",
      bloomLevel: 1,
    },
    {
      id: "music-q2",
      question: "The Delta blues, an ancestor of rock and roll, developed primarily in which region?",
      choices: ["The Mississippi Delta", "The Appalachian Mountains", "New Orleans' French Quarter", "The Texas Panhandle"],
      answerIndex: 0,
      dimension: "geographic",
      bloomLevel: 1,
    },
    {
      id: "music-q3",
      question: "Which shift in recording technology most directly enabled the concept-album format of the late 1960s?",
      choices: [
        "The move from mono to multi-track tape recording",
        "The invention of the compact cassette",
        "The introduction of digital sampling",
        "The rise of streaming platforms",
      ],
      answerIndex: 0,
      dimension: "historical",
      bloomLevel: 2,
    },
    {
      id: "music-q4",
      question:
        "Sampling in hip-hop is best understood, technically and culturally, as:",
      choices: [
        "A form of collage that recontextualizes a prior recording as new material",
        "A purely legal loophole with no compositional intent",
        "A technique with no precedent before digital audio workstations",
        "A style limited to a single genre and decade",
      ],
      answerIndex: 0,
      dimension: "impact",
      bloomLevel: 3,
    },
    {
      id: "music-q5",
      question:
        "Why do many musicologists treat the Beatles' 'Sgt. Pepper's' as culturally significant beyond its sales figures?",
      choices: [
        "It's widely credited with legitimizing the album (not just the single) as a serious artistic unit",
        "It was the first album ever recorded in stereo",
        "It was the best-selling album of the 1960s",
        "It was the first album to include a lyric sheet",
      ],
      answerIndex: 0,
      dimension: "significance",
      bloomLevel: 2,
    },
    {
      id: "music-q6",
      question:
        "Comparing Bach's fugues to modern minimalism (e.g. Steve Reich), the clearest shared formal principle is:",
      choices: [
        "Both build large structures from the strict, gradual transformation of a small motif",
        "Both rely primarily on improvisation over fixed chord changes",
        "Both were written for solo piano exclusively",
        "Both avoid any form of repetition",
      ],
      answerIndex: 0,
      dimension: "comparative",
      bloomLevel: 4,
    },
  ],
  prompts: {
    formal: [
      "Transcribe or diagram the chord progression of a song you know well. What makes it feel resolved or unresolved?",
      "Pick one production choice (reverb, panning, tempo) in a track and explain, technically, what it's doing.",
    ],
    historical: [
      "Trace one musical technique back to its earliest clear ancestor. What changed about it along the way?",
      "Pick a decade and describe the technological shift that most changed how that decade's music was made.",
    ],
    geographic: [
      "Pick a genre and describe how its place of origin shaped its instrumentation or rhythm.",
      "Compare two regional scenes (cities, countries) that produced very different sounds from similar starting points.",
    ],
    impact: [
      "Name one artist you can trace a direct influence from to at least two later, very different artists.",
      "Describe a moment when a piece of music changed how an audience behaved, dressed, or organized.",
    ],
    significance: [
      "Make the case for why a song you love deserves to be taken seriously by people who don't already love it.",
      "What does a genre's critical reputation (or lack of one) say about who gets to define 'serious' art?",
    ],
    comparative: [
      "Put two artists from different genres or eras side by side. What formal technique do they secretly share?",
      "How does something you've learned in another subject (architecture, literature) help you hear music differently?",
    ],
    experiential: [
      "Free-write for 10 minutes on a piece of music that changed how you listen. Don't edit, just follow it.",
      "Describe, in detail, what changed in your ear between the first and the tenth time you heard a favorite album.",
    ],
  },
};
