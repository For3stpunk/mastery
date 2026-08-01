/**
 * js/storage.js
 * -----------------------------------------------------------------------
 * Thin persistence layer over localStorage. This is a static site with
 * no backend, so all progress lives in the browser it was earned in.
 * Export/Import lets a learner move their progress between browsers or
 * back it up (see the Export button in the UI).
 * -----------------------------------------------------------------------
 */
(function (root) {
  const STORAGE_KEY = "mastery:v1";
  const LEGACY_STORAGE_KEYS = ["mastery-commons:v1"]; // older key names, for migration only

  function emptyState() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      // subjectId -> { activities: [...], streak: { current, longest, lastCheckin } }
      subjects: {},
      // custom subjects a learner has added beyond the defaults
      customSubjects: {},
      // interdisciplinary connections: { id, subjects: [ids], title, note, timestamp }
      connections: [],
    };
  }

  function load() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);

      // Migration: if nothing's under the current key yet, check older key
      // names before giving up and returning a blank slate. This matters
      // because renaming the storage key (e.g. for a rebrand) would
      // otherwise silently orphan everything someone had already logged.
      if (!raw) {
        for (const legacyKey of LEGACY_STORAGE_KEYS) {
          const legacyRaw = localStorage.getItem(legacyKey);
          if (legacyRaw) {
            raw = legacyRaw;
            localStorage.setItem(STORAGE_KEY, legacyRaw); // migrate forward
            break;
          }
        }
      }

      if (!raw) return emptyState();
      const parsed = JSON.parse(raw);
      return Object.assign(emptyState(), parsed);
    } catch (e) {
      console.error("Could not read saved progress, starting fresh.", e);
      return emptyState();
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function ensureSubject(state, subjectId) {
    if (!state.subjects[subjectId]) {
      state.subjects[subjectId] = {
        activities: [],
        streak: { current: 0, longest: 0, lastCheckin: null },
      };
    }
    return state.subjects[subjectId];
  }

  function exportJSON(state) {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    save(parsed);
    return parsed;
  }

  const api = { load, save, emptyState, ensureSubject, exportJSON, importJSON, STORAGE_KEY };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.MASTERY_STORAGE = api;
  }
})(typeof window !== "undefined" ? window : global);
