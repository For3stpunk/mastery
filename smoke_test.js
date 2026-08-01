const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
});

// localStorage polyfill (jsdom's own can be flaky in some versions)
const store = {};
Object.defineProperty(dom.window, "localStorage", {
  value: {
    getItem: (k) => (store.hasOwnProperty(k) ? store[k] : null),
    setItem: (k, v) => (store[k] = String(v)),
    removeItem: (k) => delete store[k],
  },
});

// Manually load each script in order since jsdom doesn't fetch local file:// scripts
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

let failed = false;

scripts.forEach((rel) => {
  const code = fs.readFileSync(path.join(__dirname, rel), "utf8");
  try {
    dom.window.eval(code);
    console.log("Loaded OK:", rel);
  } catch (e) {
    failed = true;
    console.error("ERROR loading", rel, "\n", e);
  }
});

// Fire DOMContentLoaded to trigger initial render
dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

const appHTML = dom.window.document.getElementById("app").innerHTML;
if (!appHTML || appHTML.length < 100) {
  failed = true;
  console.error("ERROR: #app did not render meaningful content");
} else {
  console.log("\n#app rendered", appHTML.length, "chars. Dashboard render: OK");
}

// Check all 4 default subjects appear
["Music", "Books", "Visual Art", "Architecture"].forEach((label) => {
  if (!appHTML.includes(label)) {
    failed = true;
    console.error("ERROR: subject card missing for", label);
  } else {
    console.log("Found subject card:", label);
  }
});

// Check the streak/heatmap panel rendered as a REAL <svg> element
const realHeatmap = dom.window.document.getElementById("app").querySelectorAll("svg.heatmap");
if (!appHTML.includes("Study streak") || realHeatmap.length !== 1) {
  failed = true;
  console.error(`ERROR: streak panel or real <svg class="heatmap"> element missing (found ${realHeatmap.length} heatmap svgs)`);
} else {
  console.log("Study streak panel with a real <svg class=\"heatmap\"> rendered: OK");
}

// Navigate to a subject page and check it renders without throwing
dom.window.location.hash = "#subject/music";
dom.window.dispatchEvent(new dom.window.Event("hashchange"));
const appEl = dom.window.document.getElementById("app");
const subjectHTML = appEl.innerHTML;

// Check for REAL rendered <svg> elements (not just the substring "radar"
// appearing somewhere, e.g. in a broken attribute) — this is what
// actually caught the innerHTML-as-attribute bug during development.
const realSVGs = appEl.querySelectorAll("svg.tier-seal, svg.radar");
if (realSVGs.length < 2) {
  failed = true;
  console.error(`ERROR: expected a real <svg class="tier-seal"> and <svg class="radar"> element, found ${realSVGs.length}`);
} else {
  console.log("Subject detail page (music) rendered real tier-seal + radar <svg> elements: OK");
}

// Navigate to connections page
dom.window.location.hash = "#connections";
dom.window.dispatchEvent(new dom.window.Event("hashchange"));
const connHTML = dom.window.document.getElementById("app").innerHTML;
if (!connHTML.includes("Interdisciplinary mode")) {
  failed = true;
  console.error("ERROR: connections page did not render");
} else {
  console.log("Connections page rendered: OK");
}

console.log(failed ? "\nSMOKE TEST FAILED" : "\nSMOKE TEST PASSED");
process.exit(failed ? 1 : 0);
