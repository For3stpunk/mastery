window.MASTERY_SUBJECTS = window.MASTERY_SUBJECTS || {};
window.MASTERY_SUBJECTS.art = {
  id: "art",
  label: "Visual Art",
  glyph: "🎨",
  tagline: "From the brushstroke to the movement it belonged to.",
  accent: "#7A3E3E",
  quizzes: [
    {
      id: "art-q1",
      question: "What does 'chiaroscuro' refer to in painting?",
      choices: [
        "The strong contrast between light and dark to create volume",
        "A technique of painting only in monochrome",
        "A method of mixing paint with egg yolk",
        "A style of abstract geometric composition",
      ],
      answerIndex: 0,
      dimension: "formal",
      bloomLevel: 1,
    },
    {
      id: "art-q2",
      question: "Mexican muralism (Rivera, Orozco, Siqueiros) emerged directly out of which historical moment?",
      choices: ["The aftermath of the Mexican Revolution", "The Spanish colonial period", "World War II", "The Cold War space race"],
      answerIndex: 0,
      dimension: "historical",
      bloomLevel: 1,
    },
    {
      id: "art-q3",
      question: "Why is Cabrini-Green's public housing history relevant to understanding certain Chicago public art projects?",
      choices: [
        "Because place and its social history shape what artists working there choose to depict and why",
        "It isn't relevant to art at all",
        "Because all public art must depict housing",
        "Because artists are legally required to reference local history",
      ],
      answerIndex: 0,
      dimension: "geographic",
      bloomLevel: 2,
    },
    {
      id: "art-q4",
      question: "The Armory Show of 1913 is considered significant in American art history because it:",
      choices: [
        "Introduced European modernism (Cubism, Fauvism) to a wide American audience for the first time",
        "Was the first all-digital art exhibition",
        "Banned abstract art from American museums",
        "Was held entirely outdoors",
      ],
      answerIndex: 0,
      dimension: "impact",
      bloomLevel: 2,
    },
    {
      id: "art-q5",
      question: "Why do art historians still debate whether Duchamp's 'Fountain' (a urinal) counts as art?",
      choices: [
        "Because it forced a lasting redefinition of what qualifies as an art object versus a readymade object",
        "Because it was destroyed shortly after being shown",
        "Because it was the only sculpture Duchamp ever made",
        "Because museums refused to display any conceptual art afterward",
      ],
      answerIndex: 0,
      dimension: "significance",
      bloomLevel: 3,
    },
    {
      id: "art-q6",
      question: "Comparing Rothko's color fields to Gothic stained glass, the shared formal intent is often described as:",
      choices: [
        "Using color and scale to produce an immersive, almost devotional emotional effect on the viewer",
        "Both use identical pigments",
        "Both were created for outdoor public plazas",
        "Neither uses color as a primary element",
      ],
      answerIndex: 0,
      dimension: "comparative",
      bloomLevel: 4,
    },
  ],
  prompts: {
    formal: [
      "Describe a work's composition using only formal terms (line, color, balance) — no subject matter allowed.",
      "Pick a technique (impasto, glazing, collage) and explain what it physically does to the surface.",
    ],
    historical: [
      "Place a movement into the decade it responded to. What was it reacting against or building on?",
      "Trace how one material (bronze, oil paint, photography) changed what artists could attempt.",
    ],
    geographic: [
      "How did a specific city's art scene shape a movement (Chicago Imagists, the New York School)?",
      "Compare how two different cultures depict the same subject (the body, the landscape, power).",
    ],
    impact: [
      "Name a single artwork that changed how a later generation of artists worked, and explain the mechanism.",
      "How has a piece of art shaped public opinion or policy, not just taste?",
    ],
    significance: [
      "Make the case for or against a controversial work's inclusion in a museum's permanent collection.",
      "What does an artwork's price at auction actually measure — and what does it not measure?",
    ],
    comparative: [
      "Put two artists from different centuries side by side. What formal problem were they both solving?",
      "Connect a visual art technique to something you've studied in music or architecture.",
    ],
    experiential: [
      "Journal about a work of art you didn't understand until you stood in front of it in person.",
      "Describe your physical, pre-verbal reaction to a piece before you thought about what it 'means.'",
    ],
  },
};
