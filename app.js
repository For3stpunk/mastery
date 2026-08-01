/**
 * js/app.js
 * -----------------------------------------------------------------------
 * DOM rendering and event wiring. This file assumes data/model.js,
 * js/storage.js, js/leveling.js, and all data/subjects/*.js have already
 * loaded (see index.html for script order).
 * -----------------------------------------------------------------------
 */
(function () {
  const MODEL = window.MASTERY_MODEL;
  const STORAGE = window.MASTERY_STORAGE;
  const LEVELING = window.MASTERY_LEVELING;
  const HEATMAP = window.MASTERY_HEATMAP;

  let state = STORAGE.load();

  function allSubjects() {
    return Object.assign({}, window.MASTERY_SUBJECTS, state.customSubjects);
  }

  function todayKey(date) {
    const d = date ? new Date(date) : new Date();
    return d.toISOString().slice(0, 10);
  }

  function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  // -----------------------------------------------------------------
  // STREAK HANDLING
  // -----------------------------------------------------------------
  function checkIn(subjectId) {
    const subj = STORAGE.ensureSubject(state, subjectId);
    const today = todayKey();
    if (subj.streak.lastCheckin === today) return subj.streak.current; // already checked in today

    if (subj.streak.lastCheckin && daysBetween(subj.streak.lastCheckin, today) === 1) {
      subj.streak.current += 1;
    } else {
      subj.streak.current = 1; // streak broken or first ever check-in
    }
    subj.streak.lastCheckin = today;
    subj.streak.longest = Math.max(subj.streak.longest, subj.streak.current);

    logActivity(subjectId, {
      type: "streak_checkin",
      dimensions: ["experiential"],
      bloomLevel: 1,
      note: "Daily check-in",
    });

    return subj.streak.current;
  }

  // -----------------------------------------------------------------
  // ACTIVITY LOGGING
  // -----------------------------------------------------------------
  function logActivity(subjectId, partial) {
    const subj = STORAGE.ensureSubject(state, subjectId);
    const activity = Object.assign(
      {
        timestamp: new Date().toISOString(),
        streakDayAtLogging: subj.streak.current,
      },
      partial
    );
    subj.activities.push(activity);
    STORAGE.save(state);
  }

  function logConnection(subjectIds, title, note) {
    state.connections.push({
      id: "conn-" + Date.now(),
      subjects: subjectIds,
      title,
      note,
      timestamp: new Date().toISOString(),
    });
    // Each connection also awards comparative-dimension XP to every subject it spans
    subjectIds.forEach((sid) => {
      logActivity(sid, {
        type: "journal",
        dimensions: ["comparative"],
        bloomLevel: 4,
        note: `Interdisciplinary connection: ${title}`,
      });
    });
    STORAGE.save(state);
  }

  // -----------------------------------------------------------------
  // RENDERING HELPERS
  // -----------------------------------------------------------------
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "innerHTML") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    children.flat().forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function tierBadgeSVG(tierRank, accent) {
    // Ornamentation scales with rank: a plain ring at rank 1, up to a full
    // rosette with laurel ticks at rank 8 ("World's Foremost Expert").
    const ticks = [];
    const tickCount = (tierRank - 1) * 4;
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2;
      const x1 = 50 + Math.cos(angle) * 34;
      const y1 = 50 + Math.sin(angle) * 34;
      const x2 = 50 + Math.cos(angle) * 40;
      const y2 = 50 + Math.sin(angle) * 40;
      ticks.push(
        `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${accent}" stroke-width="1.5"/>`
      );
    }
    const innerRings = [];
    for (let r = 0; r < Math.min(tierRank - 1, 3); r++) {
      innerRings.push(`<circle cx="50" cy="50" r="${14 + r * 5}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.5"/>`);
    }
    return `<svg viewBox="0 0 100 100" class="tier-seal" role="img" aria-label="Tier ${tierRank} seal">
      <circle cx="50" cy="50" r="30" fill="none" stroke="${accent}" stroke-width="2.5"/>
      ${innerRings.join("")}
      ${ticks.join("")}
      <text x="50" y="56" text-anchor="middle" font-size="20" fill="${accent}" font-family="var(--font-display)">${tierRank}</text>
    </svg>`;
  }

  function radarSVG(dimensionXP, accent) {
    const dims = MODEL.DIMENSION_ORDER;
    const max = Math.max(1, ...dims.map((d) => dimensionXP[d] || 0));
    const cx = 110,
      cy = 110,
      r = 85;
    const points = dims.map((d, i) => {
      const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
      const value = (dimensionXP[d] || 0) / max;
      const x = cx + Math.cos(angle) * r * value;
      const y = cy + Math.sin(angle) * r * value;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const gridRings = [0.25, 0.5, 0.75, 1].map((frac) => {
      const ringPts = dims
        .map((d, i) => {
          const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * r * frac;
          const y = cy + Math.sin(angle) * r * frac;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
      return `<polygon points="${ringPts}" fill="none" stroke="#C9BC9C" stroke-width="1" opacity="0.6"/>`;
    });
    const labels = dims.map((d, i) => {
      const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * (r + 20);
      const y = cy + Math.sin(angle) * (r + 20);
      const label = MODEL.DIMENSIONS[d].label.split(" ")[0];
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-size="9" fill="#4A4437" font-family="var(--font-mono)">${label}</text>`;
    });
    return `<svg viewBox="0 0 220 220" class="radar">
      ${gridRings.join("")}
      <polygon points="${points.join(" ")}" fill="${accent}" fill-opacity="0.35" stroke="${accent}" stroke-width="2"/>
      ${labels.join("")}
    </svg>`;
  }

  // -----------------------------------------------------------------
  // VIEWS
  // -----------------------------------------------------------------
  const root = document.getElementById("app");

  function render() {
    const hash = location.hash || "#dashboard";
    root.innerHTML = "";
    if (hash === "#dashboard") root.appendChild(renderDashboard());
    else if (hash === "#connections") root.appendChild(renderConnections());
    else if (hash === "#add-subject") root.appendChild(renderAddSubject());
    else if (hash.startsWith("#subject/")) root.appendChild(renderSubject(hash.split("/")[1]));
    else root.appendChild(renderDashboard());
  }

  function renderNav(active) {
    const items = [
      ["#dashboard", "Ledger"],
      ["#connections", "Interdisciplinary"],
      ["#add-subject", "+ New subject"],
    ];
    return el(
      "nav",
      { class: "top-nav" },
      items.map(([href, label]) =>
        el("a", { href, class: active === href ? "active" : "" }, label)
      )
    );
  }

  function renderDashboard() {
    const subjects = allSubjects();
    const cards = Object.values(subjects).map((subj) => {
      const subjState = STORAGE.ensureSubject(state, subj.id);
      const summary = LEVELING.summarizeActivities(subjState.activities);
      const connCount = state.connections.filter((c) => c.subjects.includes(subj.id)).length;
      const result = LEVELING.computeTier(summary, connCount);

      return el(
        "a",
        { href: `#subject/${subj.id}`, class: "subject-card", style: `--accent:${subj.accent || "#7C5C3E"}` },
        el("div", { class: "subject-card-glyph" }, subj.glyph || "◆"),
        el("div", { class: "subject-card-body" },
          el("h3", {}, subj.label),
          el("p", { class: "tagline" }, subj.tagline || ""),
          el("div", { class: "subject-card-meta" },
            el("span", { class: "tier-chip" }, result.tier.label),
            el("span", { class: "xp-chip" }, `${Math.round(result.totalXP)} XP`)
          )
        )
      );
    });

    const polymath = LEVELING.computePolymathTier(state.connections);

    return el(
      "div",
      {},
      renderHeader(),
      renderNav("#dashboard"),
      renderStreakPanel(),
      el("section", { class: "panel" },
        el("h2", {}, "Your subjects"),
        el("div", { class: "subject-grid" }, cards.length ? cards : el("p", { class: "empty" }, "No subjects yet — add one above."))
      ),
      el("section", { class: "panel polymath-panel" },
        el("h2", {}, "Interdisciplinary standing"),
        el("p", {}, `${polymath.tier.label} · ${polymath.connectionCount} connections logged across ${polymath.subjectsSpanned} subject(s)`),
        el("a", { href: "#connections", class: "button" }, "Log a connection")
      ),
      renderExportImport()
    );
  }

  function renderStreakPanel() {
    const counts = HEATMAP.computeDailyActivityCounts(state);
    const streak = HEATMAP.computeGlobalStreak(counts);
    const totalDaysActive = Object.keys(counts).filter((k) => counts[k] > 0).length;

    return el(
      "section",
      { class: "panel streak-panel" },
      el("h2", {}, "Study streak"),
      el(
        "div",
        { class: "streak-stats" },
        el("div", { class: "streak-stat" }, el("span", { class: "streak-number" }, String(streak.current)), el("span", { class: "streak-label" }, "current streak")),
        el("div", { class: "streak-stat" }, el("span", { class: "streak-number" }, String(streak.longest)), el("span", { class: "streak-label" }, "longest streak")),
        el("div", { class: "streak-stat" }, el("span", { class: "streak-number" }, String(totalDaysActive)), el("span", { class: "streak-label" }, "days logged, all time"))
      ),
      el("div", { class: "heatmap-wrap", innerHTML: HEATMAP.heatmapSVG(counts, 53) }),
      el("p", { class: "heatmap-caption" }, "Every subject counts toward this — quizzes, check-ins, journaling, essays, and connections all fill in a day. Hover a square for the date.")
    );
  }

  function renderHeader() {
    return el(
      "header",
      { class: "site-header" },
      el("h1", {}, "The Mastery Commons"),
      el("p", { class: "site-tagline" }, "A ledger for the long walk from knowing nothing to knowing more than almost anyone.")
    );
  }

  function renderExportImport() {
    const exportBtn = el("button", { class: "button secondary" }, "Export progress (.json)");
    exportBtn.addEventListener("click", () => {
      const blob = new Blob([STORAGE.exportJSON(state)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mastery-commons-progress.json";
      a.click();
    });

    const importInput = el("input", { type: "file", accept: "application/json", class: "hidden" });
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        state = STORAGE.importJSON(reader.result);
        render();
      };
      reader.readAsText(file);
    });
    const importBtn = el("button", { class: "button secondary" }, "Import progress");
    importBtn.addEventListener("click", () => importInput.click());

    return el("section", { class: "panel export-panel" },
      el("h2", {}, "Backup"),
      el("p", {}, "Progress is stored only in this browser. Export it to move devices or keep a backup."),
      el("div", { class: "button-row" }, exportBtn, importBtn, importInput)
    );
  }

  function renderSubject(subjectId) {
    const subjects = allSubjects();
    const subj = subjects[subjectId];
    if (!subj) return el("div", {}, renderHeader(), renderNav(), el("p", {}, "Unknown subject."));

    const subjState = STORAGE.ensureSubject(state, subjectId);
    const summary = LEVELING.summarizeActivities(subjState.activities);
    const connCount = state.connections.filter((c) => c.subjects.includes(subjectId)).length;
    const result = LEVELING.computeTier(summary, connCount);
    const accent = subj.accent || "#7C5C3E";

    const gatesList = result.blockedBy
      ? el(
          "div", { class: "gates" },
          el("h3", {}, `To reach ${result.nextTier.label}:`),
          el("ul", {}, result.blockedBy.map((g) => el("li", {}, g.label)))
        )
      : el("p", { class: "gates-complete" }, "Maximum tier reached. Keep going for its own sake.");

    return el(
      "div",
      {},
      renderHeader(),
      renderNav(),
      el("section", { class: "panel subject-header", style: `--accent:${accent}` },
        el("div", { class: "subject-header-top" },
          el("div", { class: "subject-glyph-big" }, subj.glyph || "◆"),
          el("div", {},
            el("h2", {}, subj.label),
            el("p", { class: "tagline" }, subj.tagline || "")
          )
        ),
        el("div", { class: "subject-header-stats" },
          el("div", { class: "seal-wrap", innerHTML: tierBadgeSVG(result.tier.rank, accent) }),
          el("div", {},
            el("p", { class: "tier-name" }, result.tier.label),
            el("p", { class: "tier-motto" }, `"${result.tier.motto}"`),
            el("p", { class: "xp-total" }, `${Math.round(result.totalXP)} total XP · streak ${subjState.streak.current} (longest ${subjState.streak.longest})`)
          )
        )
      ),
      el("section", { class: "panel two-col" },
        el("div", {}, el("h2", {}, "Balance across the ways of knowing"), el("div", { innerHTML: radarSVG(result.dimensionXP, accent), class: "radar-wrap" })),
        el("div", {}, gatesList)
      ),
      el("section", { class: "panel" },
        el("h2", {}, "Log progress"),
        renderActivityControls(subj)
      ),
      el("section", { class: "panel" },
        el("h2", {}, "Recent activity"),
        renderActivityLog(subjState.activities)
      )
    );
  }

  function randomPrompt(subj, dimension) {
    const list = (subj.prompts && subj.prompts[dimension]) || [];
    if (!list.length) return `Reflect on ${MODEL.DIMENSIONS[dimension].label.toLowerCase()} for ${subj.label}.`;
    return list[Math.floor(Math.random() * list.length)];
  }

  function renderActivityControls(subj) {
    const wrap = el("div", { class: "activity-controls" });

    // --- Check in ---
    const checkinBtn = el("button", { class: "button" }, "Check in for today (streak)");
    checkinBtn.addEventListener("click", () => {
      checkIn(subj.id);
      render();
    });
    wrap.appendChild(el("div", { class: "control-row" }, checkinBtn));

    // --- Quiz ---
    if (subj.quizzes && subj.quizzes.length) {
      const quizBtn = el("button", { class: "button" }, "Answer a question");
      quizBtn.addEventListener("click", () => openQuizModal(subj));
      wrap.appendChild(el("div", { class: "control-row" }, quizBtn));
    }

    // --- Social post ---
    const socialBtn = el("button", { class: "button" }, "Log a social post");
    socialBtn.addEventListener("click", () => openLogModal(subj, "social_post", ["impact", "comparative"], 3));
    wrap.appendChild(el("div", { class: "control-row" }, socialBtn));

    // --- Journal ---
    const journalBtn = el("button", { class: "button" }, "Free-write / journal entry");
    journalBtn.addEventListener("click", () => openLogModal(subj, "journal", MODEL.DIMENSION_ORDER, 4));
    wrap.appendChild(el("div", { class: "control-row" }, journalBtn));

    // --- Essay ---
    const essayBtn = el("button", { class: "button primary" }, "Write an essay (500+ words)");
    essayBtn.addEventListener("click", () => openLogModal(subj, "essay", MODEL.DIMENSION_ORDER, 6));
    wrap.appendChild(el("div", { class: "control-row" }, essayBtn));

    return wrap;
  }

  function renderActivityLog(activities) {
    if (!activities.length) return el("p", { class: "empty" }, "Nothing logged yet.");
    const recent = activities.slice(-15).reverse();
    return el(
      "ul",
      { class: "activity-log" },
      recent.map((a) => {
        const def = MODEL.ACTIVITY_TYPES[a.type];
        const date = new Date(a.timestamp).toLocaleDateString();
        const dims = (a.dimensions || []).map((d) => MODEL.DIMENSIONS[d].label).join(", ");
        return el("li", {},
          el("span", { class: "log-date" }, date),
          el("span", { class: "log-label" }, def ? def.label : a.type),
          el("span", { class: "log-dims" }, dims),
          a.note ? el("span", { class: "log-note" }, `— ${a.note}`) : null
        );
      })
    );
  }

  // -----------------------------------------------------------------
  // MODALS
  // -----------------------------------------------------------------
  function openModal(contentNode) {
    const overlay = el("div", { class: "modal-overlay" });
    const closeBtn = el("button", { class: "modal-close", "aria-label": "Close" }, "×");
    closeBtn.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    const box = el("div", { class: "modal" }, closeBtn, contentNode);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    return overlay;
  }

  function openQuizModal(subj) {
    const q = subj.quizzes[Math.floor(Math.random() * subj.quizzes.length)];
    const feedback = el("p", { class: "quiz-feedback" });
    const choiceButtons = q.choices.map((choice, i) =>
      el("button", { class: "choice-button" }, choice)
    );
    choiceButtons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        const correct = i === q.answerIndex;
        logActivity(subj.id, {
          type: correct ? "quiz_correct" : "quiz_incorrect",
          dimensions: [q.dimension],
          bloomLevel: q.bloomLevel,
          note: q.question,
        });
        feedback.textContent = correct
          ? "Correct."
          : `Not quite — the answer was: ${q.choices[q.answerIndex]}`;
        choiceButtons.forEach((b) => (b.disabled = true));
        setTimeout(() => {
          document.querySelector(".modal-overlay")?.remove();
          render();
        }, 1100);
      });
    });
    const content = el(
      "div",
      {},
      el("h3", {}, `${subj.label} — ${MODEL.DIMENSIONS[q.dimension].label}`),
      el("p", { class: "quiz-question" }, q.question),
      el("div", { class: "choice-list" }, choiceButtons),
      feedback
    );
    openModal(content);
  }

  function openLogModal(subj, activityType, allowedDimensions, defaultBloom) {
    const def = MODEL.ACTIVITY_TYPES[activityType];
    const dimCheckboxes = allowedDimensions.map((d) => {
      const cb = el("input", { type: "checkbox", value: d, id: `dim-${d}` });
      return el("label", { class: "dim-checkbox" }, cb, MODEL.DIMENSIONS[d].label);
    });
    const promptText = el("p", { class: "prompt-suggestion" });
    const dimSelect = el(
      "select",
      { id: "prompt-dim" },
      allowedDimensions.map((d) => el("option", { value: d }, MODEL.DIMENSIONS[d].label))
    );
    const refreshPromptBtn = el("button", { class: "button tiny" }, "Suggest a prompt");
    refreshPromptBtn.addEventListener("click", () => {
      promptText.textContent = randomPrompt(subj, dimSelect.value);
    });

    const noteInput = el("textarea", { rows: 4, placeholder: "What did you write about / post / think through?" });
    const submitBtn = el("button", { class: "button primary" }, "Log it");
    submitBtn.addEventListener("click", () => {
      const checked = Array.from(document.querySelectorAll(".dim-checkbox input:checked")).map((c) => c.value);
      logActivity(subj.id, {
        type: activityType,
        dimensions: checked.length ? checked : [allowedDimensions[0]],
        bloomLevel: defaultBloom,
        note: noteInput.value.trim() || undefined,
      });
      document.querySelector(".modal-overlay")?.remove();
      render();
    });

    const content = el(
      "div",
      {},
      el("h3", {}, `${def.label} — ${subj.label}`),
      el("p", {}, "Which ways of knowing does this touch? (Essays that tag 2+ get a synthesis bonus.)"),
      el("div", { class: "dim-checkbox-list" }, dimCheckboxes),
      el("div", { class: "prompt-row" }, dimSelect, refreshPromptBtn),
      promptText,
      noteInput,
      submitBtn
    );
    openModal(content);
  }

  // -----------------------------------------------------------------
  // CONNECTIONS (interdisciplinary mode)
  // -----------------------------------------------------------------
  function renderConnections() {
    const subjects = allSubjects();
    const polymath = LEVELING.computePolymathTier(state.connections);

    const checkboxes = Object.values(subjects).map((s) => {
      const cb = el("input", { type: "checkbox", value: s.id, id: `conn-subj-${s.id}` });
      return el("label", { class: "dim-checkbox" }, cb, s.label);
    });
    const titleInput = el("input", { type: "text", placeholder: "e.g. 'Bauhaus form-follows-function in Kraftwerk's stage design'" });
    const noteInput = el("textarea", { rows: 3, placeholder: "What's the actual connection? Be specific." });
    const submitBtn = el("button", { class: "button primary" }, "Log connection");
    submitBtn.addEventListener("click", () => {
      const checked = Array.from(document.querySelectorAll('[id^="conn-subj-"]:checked')).map((c) => c.value);
      if (checked.length < 2) {
        alert("An interdisciplinary connection needs at least two subjects.");
        return;
      }
      if (!titleInput.value.trim()) {
        alert("Give the connection a title.");
        return;
      }
      logConnection(checked, titleInput.value.trim(), noteInput.value.trim());
      render();
    });

    const history = state.connections
      .slice()
      .reverse()
      .map((c) =>
        el("li", {},
          el("strong", {}, c.title),
          el("span", { class: "log-dims" }, ` — ${c.subjects.map((id) => (subjects[id] || {}).label || id).join(" × ")}`),
          c.note ? el("p", { class: "log-note" }, c.note) : null
        )
      );

    return el(
      "div",
      {},
      renderHeader(),
      renderNav("#connections"),
      el("section", { class: "panel" },
        el("h2", {}, "Interdisciplinary mode"),
        el("p", {}, `${polymath.tier.label} · ${polymath.connectionCount} connections across ${polymath.subjectsSpanned} subject(s)`),
        el("p", {}, "A connection is a specific, arguable claim that links two or more subjects — not just 'these are both cool.' It earns comparative-dimension XP in every subject it touches, and only these count toward the Polymath track."),
        el("div", { class: "dim-checkbox-list" }, checkboxes),
        titleInput,
        noteInput,
        submitBtn
      ),
      el("section", { class: "panel" },
        el("h2", {}, "Connection history"),
        history.length ? el("ul", { class: "activity-log connections-log" }, history) : el("p", { class: "empty" }, "None logged yet.")
      )
    );
  }

  // -----------------------------------------------------------------
  // ADD SUBJECT
  // -----------------------------------------------------------------
  function renderAddSubject() {
    const idInput = el("input", { type: "text", placeholder: "id, e.g. 'film' (lowercase, no spaces)" });
    const labelInput = el("input", { type: "text", placeholder: "Display name, e.g. 'Film'" });
    const glyphInput = el("input", { type: "text", placeholder: "A single emoji or glyph, e.g. 🎬", maxlength: "2" });
    const taglineInput = el("input", { type: "text", placeholder: "A one-line tagline" });
    const accentInput = el("input", { type: "color", value: "#7C5C3E" });
    const submitBtn = el("button", { class: "button primary" }, "Add subject");

    submitBtn.addEventListener("click", () => {
      const id = idInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (!id) return alert("Give the subject a valid id.");
      if (allSubjects()[id]) return alert("That id already exists.");
      state.customSubjects[id] = {
        id,
        label: labelInput.value.trim() || id,
        glyph: glyphInput.value.trim() || "◆",
        tagline: taglineInput.value.trim(),
        accent: accentInput.value,
        quizzes: [],
        prompts: {},
      };
      STORAGE.save(state);
      location.hash = `#subject/${id}`;
    });

    return el(
      "div",
      {},
      renderHeader(),
      renderNav("#add-subject"),
      el("section", { class: "panel" },
        el("h2", {}, "Add a new subject"),
        el("p", {}, "Custom subjects work fully in the leveling system — you just won't get pre-built quiz questions or prompts. For those, copy data/subjects/_template.js in the repo instead and it'll appear here automatically."),
        el("div", { class: "form-grid" },
          el("label", {}, "Subject id", idInput),
          el("label", {}, "Display name", labelInput),
          el("label", {}, "Glyph", glyphInput),
          el("label", {}, "Tagline", taglineInput),
          el("label", {}, "Accent color", accentInput)
        ),
        submitBtn
      )
    );
  }

  window.addEventListener("hashchange", render);

  // DOMContentLoaded fires on `document`, not `window` — and if this
  // script is loaded at the end of <body> (as it is here), the event may
  // have already fired by the time we attach the listener. Handle both.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
