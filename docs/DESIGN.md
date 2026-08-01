# Design rationale

This document explains the pedagogical model behind The Mastery Commons —
what it's actually trying to measure, and why it's built to resist the
usual failure mode of gamified learning tools (where "level 99" means
"clicked a lot," not "knows a lot").

## The problem with most points-and-levels systems

Duolingo-style streak/XP systems are good at building a habit, but they
mostly reward *repetition of low-effort actions*. You can hit a huge
streak and a high level by doing the easiest possible task every day
forever, while never actually deepening your understanding. That's fine
for "don't forget your vocabulary," but it's the wrong shape for
"become the world's foremost expert on something," which requires real
breadth and real depth, not just volume.

So this system separates two things that are usually conflated:
**how much you've done** (XP) and **how well-rounded and deep what
you've done is** (tier). XP is necessary but not sufficient to advance.

## The seven "ways of knowing" (dimensions)

Based on your brief — context, geography, history, cultural impact,
cultural significance — expanded to seven dimensions that together
cover how an actual expert relates to a subject:

| Dimension | What it captures |
|---|---|
| Formal & Technical | How the thing is actually built/made: structure, craft, theory |
| Historical | Where it sits in time; what it broke from, what followed |
| Geographic & Cultural Origin | Where it comes from, how place shaped it |
| Cultural Impact | What it changed — measurable influence on other things |
| Cultural Significance | Why it matters — its critical/philosophical weight |
| Comparative Fluency | Connecting it to other things you know, including other subjects |
| Personal & Experiential | Your own developed response — the part that can't be looked up |

Every logged activity is tagged with the dimension(s) it engages. This
is the main lever against min-maxing: **advancing past the fourth tier
(Adept) requires every dimension to hold at least a minimum share of
your total XP.** You cannot get there by only ever doing the easiest
activity in your favorite dimension.

## Bloom's Taxonomy as a depth signal

Each activity type is capped at how cognitively deep it can plausibly
be, per Bloom's Taxonomy:

- **Quizzes** → Remember / Understand (Bloom 1–2). Fast, useful for
  retention, but capped — you can't reach deep tiers on quizzes alone.
- **Streak check-ins** → Remember (Bloom 1). Pure consistency signal.
- **Social posts** → Apply (Bloom 3). Publicly asserting a claim about
  a subject requires more commitment than answering a multiple-choice
  question, but it's not the same as sustained argument.
- **Journaling / free-writing** → Apply / Analyze (Bloom 3–4).
- **Academic writing / essays (500+ words)** → Analyze / Evaluate /
  Create (Bloom 4–6). The only activity type that can reach the top of
  the taxonomy, and the only one that can earn the *synthesis bonus*
  (writing that deliberately connects 2+ dimensions in one piece).

This means the point *value* of an activity type roughly tracks its
Bloom ceiling — essays are worth more than quiz answers not because of
an arbitrary game-balance decision, but because they can demonstrate
categorically deeper engagement.

## Mastery tiers (loosely: the Dreyfus model, extended)

The eight tiers are loosely based on the Dreyfus model of skill
acquisition (novice → advanced beginner → competent → proficient →
expert), with two capstone tiers added for this project's actual goal:

`Novice → Apprentice → Journeyman → Adept → Scholar → Expert →
Authority → World's Foremost Expert`

Each tier past Adept adds a **gate**, not just an XP threshold:

- a minimum dimension balance (breadth),
- a minimum count of essay-length writing (depth),
- a minimum historical streak (sustained engagement),
- a minimum count of interdisciplinary connections (synthesis),
- and, from Expert upward, at least one public social post — because
  "world's foremost expert" implies *recognized* expertise, not just
  private study. Reputation-building was explicitly part of your
  brief, and it's the one dimension that requires other people, not
  just more study.

The `js/leveling.test.js` and `interaction_test.js` files in this repo
demonstrate this directly: a simulated learner who answers 2,000 quiz
questions racks up more raw XP than a well-rounded learner who writes a
handful of essays and journal entries across different dimensions — but
the quiz-grinder tops out around "Apprentice," while the well-rounded
learner reaches "Journeyman" with a fraction of the total XP.

## Interdisciplinary mode

A "connection" is a specific, arguable claim linking two or more
subjects (the UI explicitly asks for this, not just "these are both
cool"). Connections:

1. Award **comparative**-dimension XP in every subject they touch —
   because relating a subject to something outside itself is itself a
   way of knowing it better.
2. Feed a separate cross-cutting **Polymath track**
   (`Observer → Connector → Synthesist → Renaissance Mind → Polymath`)
   that requires connections to span multiple *distinct* subjects, not
   just repeated pairings of the same two.

This is deliberately a second, parallel progression system — it's
possible to be a Scholar in one subject and a Polymath overall, or vice
versa, and both are worth displaying.

## Why this is a static site with no backend

Points systems built to run indefinitely tend to accumulate server
costs and login friction that outlive the person's actual interest in
maintaining them. This is meant to be something you can fork, deploy to
GitHub Pages for free, and own the data for (it's just a JSON file you
can export). If you outgrow single-browser `localStorage` — for
example, wanting the same progress on your phone and laptop — the
Export/Import buttons are the intended bridge; a real sync backend is a
reasonable v2 but deliberately not v1.
