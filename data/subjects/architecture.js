window.MASTERY_SUBJECTS = window.MASTERY_SUBJECTS || {};
window.MASTERY_SUBJECTS.architecture = {
  id: "architecture",
  label: "Architecture",
  glyph: "🏛",
  tagline: "From load-bearing walls to the skylines they made possible.",
  accent: "#4A5A45",
  quizzes: [
    {
      id: "arch-q1",
      question: "What structural innovation made the modern skyscraper possible?",
      choices: [
        "The steel frame, which shifted load-bearing away from exterior walls",
        "Reinforced glass alone",
        "The elevator, with no structural change required",
        "Poured concrete foundations",
      ],
      answerIndex: 0,
      dimension: "formal",
      bloomLevel: 1,
    },
    {
      id: "arch-q2",
      question: "The Chicago School of architecture emerged directly in response to which event?",
      choices: ["The Great Chicago Fire of 1871", "The 1933 World's Fair", "The Great Depression", "World War II rebuilding"],
      answerIndex: 0,
      dimension: "historical",
      bloomLevel: 1,
    },
    {
      id: "arch-q3",
      question: "Why does climate and geography shape vernacular architecture (e.g. adobe in the Southwest, steep roofs in snowy regions)?",
      choices: [
        "Because buildings evolve to manage local material availability and environmental stress",
        "Climate has no measurable effect on building design",
        "All vernacular buildings look identical worldwide",
        "Because of government mandates only",
      ],
      answerIndex: 0,
      dimension: "geographic",
      bloomLevel: 2,
    },
    {
      id: "arch-q4",
      question: "Bauhaus design principles are considered influential beyond architecture because they:",
      choices: [
        "Shaped modern graphic design, furniture, and product design through 'form follows function'",
        "Were limited exclusively to German government buildings",
        "Rejected the use of any right angles",
        "Had no lasting influence outside 1920s Germany",
      ],
      answerIndex: 0,
      dimension: "impact",
      bloomLevel: 3,
    },
    {
      id: "arch-q5",
      question: "Why do preservationists often fight to save buildings that aren't conventionally 'beautiful'?",
      choices: [
        "Because a building's historical and social significance can outweigh purely aesthetic judgment",
        "Preservationists only care about famous architects' buildings",
        "Ugly buildings are always more structurally sound",
        "It's purely a financial decision with no cultural component",
      ],
      answerIndex: 0,
      dimension: "significance",
      bloomLevel: 3,
    },
    {
      id: "arch-q6",
      question: "Comparing Gothic cathedrals to Mies van der Rohe's glass towers, a shared formal ambition is:",
      choices: [
        "Both push structural technology to its limit to dissolve heavy walls into light and openness",
        "Both were built primarily from wood",
        "Neither uses vertical emphasis in its design",
        "Both reject any use of symmetry",
      ],
      answerIndex: 0,
      dimension: "comparative",
      bloomLevel: 4,
    },
  ],
  prompts: {
    formal: [
      "Sketch or describe the load path of a building you know well, from roof to foundation.",
      "Explain how a building's floor plan shapes how people actually move and gather in it.",
    ],
    historical: [
      "Trace one architectural style back to the material or technological shift that made it possible.",
      "What did a specific building style intentionally break away from, and why?",
    ],
    geographic: [
      "How does the climate of your region show up in local vernacular building traditions?",
      "Compare two cities' skylines and explain what regulation, geology, or culture produced the difference.",
    ],
    impact: [
      "Name one building that changed how later architects designed, and explain the mechanism of influence.",
      "How has a piece of architecture changed the daily behavior of the people who live or work around it?",
    ],
    significance: [
      "Make the case for preserving (or demolishing) a specific real building. What values are in tension?",
      "What does a city's most-photographed building say about what that city wants to be seen as?",
    ],
    comparative: [
      "Put two buildings from different eras side by side. What structural problem did they both have to solve?",
      "Connect a principle from architecture to something you've learned in music or visual art.",
    ],
    experiential: [
      "Journal about a space that physically changed your mood the moment you entered it.",
      "Describe a building you pass often — what do you actually notice about it now versus a year ago?",
    ],
  },
};
