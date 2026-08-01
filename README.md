# Mastery

A leveling system for going from knowing nothing about a subject to
genuine, recognized expertise in it — built for music, books, art, and
architecture out of the box, and extensible to any subject you want.

**[See the full design rationale →](docs/DESIGN.md)** for why the system
is built the way it is (short version: it's built to resist the usual
failure mode of gamified learning, where "level 99" just means "clicked
a lot"). Advancing past the early tiers requires genuine *breadth*
across seven "ways of knowing" and genuine *depth* (real writing, not
just quizzes) — not just raw points.

## Quick start

This is a static site with no build step and no backend. Progress is
saved in your browser's `localStorage`.

1. Just open `index.html` directly in a browser — it works with zero
   setup, no server required.
2. Or deploy it for free on **GitHub Pages**:
   - Push this repo to GitHub.
   - Go to **Settings → Pages** → set the source to the `main` branch,
     root folder.
   - Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## How it works, briefly

- Pick a subject (Music, Books, Art, Architecture, or one you add).
- Log activities against it: answer quiz questions, check in daily
  (builds a streak), post publicly about it, free-write/journal, or
  write a full essay. Each activity is tagged with which of the **seven
  ways of knowing** it engages (formal/technical, historical,
  geographic, cultural impact, cultural significance, comparative,
  personal/experiential).
- The dashboard shows a **GitHub-style activity heatmap** across *all*
  subjects combined — any logged activity fills in a day — plus your
  current and longest streaks. It has a one-day grace period: if you
  haven't logged anything yet today, your streak doesn't reset until
  today actually passes with nothing logged.
- Your tier in that subject — Novice through **World's Foremost
  Expert** — depends on total XP, *and* on having real breadth across
  all seven dimensions, *and* on having done some real depth (essays),
  *and* (at the higher tiers) on having built some public reputation
  and made connections to other subjects.
- **Interdisciplinary Mode** lets you log a specific connection between
  two or more subjects (e.g. "Bauhaus form-follows-function in
  Kraftwerk's stage design"). This feeds a separate cross-cutting
  Polymath track.

## Adding a new subject

1. Copy `data/subjects/_template.js` to `data/subjects/your-subject.js`.
2. Fill in the id, label, glyph, tagline, accent color, quiz questions,
   and writing prompts. (You don't have to fill in everything to start
   — an empty `quizzes` array is valid.)
3. Add a `<script src="data/subjects/your-subject.js"></script>` tag in
   `index.html`, right after the other subject scripts.
4. Reload — it appears on the dashboard automatically.

You can also add a subject entirely from the UI (the **+ New subject**
tab), but subjects added that way start with no quiz questions or
prompts, since those need to be written by a human who actually knows
the subject.

## Project structure

```
index.html                   Site shell — loads everything else
css/style.css                 The whole visual design ("Guild Ledger")
data/model.js                 The shared rules: dimensions, Bloom's
                               levels, activity point values, tiers.
                               Subject-agnostic — don't need to touch
                               this to add a subject.
data/subjects/*.js            Content for each subject: quiz questions
                               and writing prompts, tagged by dimension.
data/subjects/_template.js    Copy this to add a new subject.
js/leveling.js                Pure functions: activities in, XP/tier
                               out. No DOM code — unit testable.
js/leveling.test.js           `node js/leveling.test.js` — sanity tests
                               proving the breadth-gating actually works
                               (e.g. that quiz-grinding alone can't
                               reach the top tiers).
js/heatmap.js                 Pure functions: turns activity timestamps
                               into a GitHub-style daily heatmap and a
                               current/longest streak (with a one-day
                               grace period). No DOM code.
js/heatmap.test.js             `node js/heatmap.test.js` — streak edge
                               cases (grace period, broken streaks,
                               longest-vs-current).
js/storage.js                 localStorage persistence + export/import.
                               Migrates progress forward automatically
                               if the storage key name ever changes.
js/storage.test.js            `node js/storage.test.js` — storage
                               migration + cross-timezone date handling
                               (both caught real bugs during development).
js/app.js                     All DOM rendering and event handling.
docs/DESIGN.md                Why the system is shaped this way.
smoke_test.js                 Loads the whole app in a simulated
                               browser (jsdom) and checks it renders.
interaction_test.js           Simulates real clicks — check-ins, quiz
                               answers, essays, connections, adding a
                               subject — end to end.
```

## Running the tests

The test files aren't needed to run the site itself — they're for
verifying changes to the leveling logic don't break anything. They need
Node and `jsdom`:

```bash
npm install jsdom
node js/leveling.test.js     # pure logic tests, no browser needed
node js/heatmap.test.js      # streak edge cases, no browser needed
node js/storage.test.js      # storage migration + timezone correctness
node smoke_test.js           # does the app render at all?
node interaction_test.js     # do clicks/forms actually work end to end?
```

## Design choices worth knowing about

- **No backend, no accounts.** Progress lives in your browser via
  `localStorage`. Use the **Export progress** button regularly if you
  care about not losing it (e.g. before clearing browser data), and
  **Import progress** to move it to another browser or device.
- **Weekly cap on social posts.** Public posting is capped at 3 counted
  posts per week per subject, so reputation-building can't be farmed by
  spamming — it has to reflect actual, spaced-out public engagement.
- **The synthesis bonus.** An essay tagged with 2+ dimensions at once
  earns a bonus, because writing that genuinely connects, say, the
  *formal* and *historical* dimensions in one piece demonstrates more
  than two separate single-dimension pieces would.
- **Colors, glyphs, and copy are all yours to change.** Nothing about
  the visual design or subject content is hardcoded elsewhere in the
  logic — `data/model.js` and `js/leveling.js` don't know or care what
  subjects exist.

## License

MIT — see `LICENSE`. Do whatever you want with it.
