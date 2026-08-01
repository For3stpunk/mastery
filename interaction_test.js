const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true });

const store = {};
Object.defineProperty(dom.window, "localStorage", {
  value: {
    getItem: (k) => (store.hasOwnProperty(k) ? store[k] : null),
    setItem: (k, v) => (store[k] = String(v)),
    removeItem: (k) => delete store[k],
  },
});

const scripts = [
  "data/model.js",
  "data/subjects/music.js",
  "data/subjects/books.js",
  "data/subjects/art.js",
  "data/subjects/architecture.js",
  "js/leveling.js",
  "js/heatmap.js",
  "js/storage.js",
  "js/app.js",
];
scripts.forEach((rel) => dom.window.eval(fs.readFileSync(path.join(__dirname, rel), "utf8")));

const { window } = dom;
const { document } = window;
let failed = false;
function check(cond, msg) {
  if (cond) console.log("PASS:", msg);
  else {
    failed = true;
    console.error("FAIL:", msg);
  }
}

function goto(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}

// 1. Go to music subject, click "Check in"
goto("#subject/music");
let buttons = Array.from(document.querySelectorAll("button"));
let checkinBtn = buttons.find((b) => b.textContent.includes("Check in"));
check(!!checkinBtn, "Check-in button exists on subject page");
checkinBtn.click();
goto("#subject/music"); // re-render to read fresh state
let streakText = document.querySelector(".xp-total").textContent;
check(streakText.includes("streak 1"), `streak incremented after check-in (got: "${streakText}")`);

// 2. Answer a quiz question (click first choice, whichever it is, then confirm activity logged)
goto("#subject/music");
buttons = Array.from(document.querySelectorAll("button"));
let quizBtn = buttons.find((b) => b.textContent.includes("Answer a question"));
check(!!quizBtn, "Quiz button exists");
quizBtn.click();
let modalChoice = document.querySelector(".choice-button");
check(!!modalChoice, "Quiz modal opened with choice buttons");
modalChoice.click();
// the app auto-closes the modal + re-renders after ~1.1s; force it immediately for the test
goto("#subject/music");
let logItems = document.querySelectorAll(".activity-log li");
check(logItems.length >= 2, `activity log has entries after check-in + quiz (count: ${logItems.length})`);

// 3. Log an essay tagged with 2 dimensions and confirm synthesis bonus lands (XP jumps by 80, not 60)
goto("#subject/music");
buttons = Array.from(document.querySelectorAll("button"));
let essayBtn = buttons.find((b) => b.textContent.includes("Write an essay"));
essayBtn.click();
let checkboxes = Array.from(document.querySelectorAll(".dim-checkbox input"));
checkboxes[0].checked = true; // formal
checkboxes[1].checked = true; // historical
let textarea = document.querySelector(".modal textarea");
textarea.value = "A test essay connecting formal technique to historical context.";
let submitBtn = Array.from(document.querySelectorAll(".modal button")).find((b) => b.textContent === "Log it");
let xpBefore = parseFloat(document.querySelector(".xp-total").textContent.match(/([\d.]+) total XP/)[1]);
submitBtn.click();
goto("#subject/music");
let xpAfter = parseFloat(document.querySelector(".xp-total").textContent.match(/([\d.]+) total XP/)[1]);
check(xpAfter - xpBefore >= 79, `essay with 2 dimensions awarded synthesis bonus (delta: ${xpAfter - xpBefore})`);

// 4. Log an interdisciplinary connection across music + architecture
goto("#connections");
let subjCheckboxes = Array.from(document.querySelectorAll('[id^="conn-subj-"]'));
let musicCb = subjCheckboxes.find((c) => c.id === "conn-subj-music");
let archCb = subjCheckboxes.find((c) => c.id === "conn-subj-architecture");
musicCb.checked = true;
archCb.checked = true;
document.querySelector('input[type="text"]').value = "Minimalist repetition in Reich and Miesian modular grids";
let connSubmit = Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Log connection");
connSubmit.click();
goto("#connections");
let polymathText = document.querySelector(".panel p").textContent;
check(polymathText.includes("1 connections across 2 subject"), `connection logged and polymath tracker updated (text: "${polymathText}")`);

// 5. Add a custom subject end-to-end
goto("#add-subject");
document.querySelector('input[placeholder*="film"]').value = "film";
document.querySelectorAll('input[type="text"]')[1].value = "Film";
let addSubmit = Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Add subject");
addSubmit.click();
goto("#dashboard");
check(document.getElementById("app").innerHTML.includes("Film"), "custom subject appears on dashboard after being added");

console.log(failed ? "\nINTERACTION TEST FAILED" : "\nINTERACTION TEST PASSED");
process.exit(failed ? 1 : 0);
