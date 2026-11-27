/*
 * התפרצות (Outbreak): an R exam-practice game.
 *
 * All game logic and rendering. The content comes from two data files:
 *   js/config.js     window.GAME_CONFIG     settings and lab stations
 *   js/questions.js  window.GAME_QUESTIONS  the question bank
 *
 * Every screen is rendered into <main id="app">; sheets (dialogs) into #sheet-root.
 * Clicks are handled by one delegated listener that reads data-action attributes.
 */
(function () {
  'use strict';

  /* ================================================================
   * Small helpers
   * ================================================================ */

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ESC[c]);
  }

  // Question text formatting: `code` → LTR <code>, **bold** → <b>. Everything is escaped first.
  function fmt(text) {
    return String(text == null ? '' : text)
      .split('`')
      .map((part, i) => (i % 2
        ? `<code dir="ltr">${esc(part)}</code>`
        : esc(part).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')))
      .join('');
  }

  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const thousands = (n) => Math.round(n).toLocaleString('en-US');
  const LETTERS = ['a', 'b', 'c', 'd'];
  const LEVELS = { 1: 'קל', 2: 'בינוני', 3: 'קשה' };

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function clock(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${pad2(s % 60)}`;
  }

  /* ================================================================
   * Icons (inline SVG, stroke style, colour from CSS currentColor)
   * ================================================================ */

  const ICONS = {
    clipboard: '<path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M9 11.5h6M9 15.5h4"/>',
    tube: '<path d="M8 3h8"/><path d="M9.5 3v14.5a2.5 2.5 0 0 0 5 0V3"/><path d="M9.5 12h5"/>',
    microscope: '<path d="M5 21h14"/><path d="M7 18h7"/><path d="M15 18a5 5 0 0 0 1-9"/><path d="m9 3 3-1.5 4 7.5-3 1.5z"/><path d="M11.5 11.5 10 14h4"/>',
    robot: '<rect x="4.5" y="8" width="15" height="12" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="3.6" r="1.2"/><path d="M9.5 12.5v1.5M14.5 12.5v1.5M10 17h4M2.5 12.5v3M21.5 12.5v3"/>',
    machine: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M7 14.5h4M15 14.5h2"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    loop: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 15h9"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.5"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    chevronFwd: '<path d="m15 6-6 6 6 6"/>',
    chevronBack: '<path d="m9 6 6 6-6 6"/>',
    arrowFwd: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowBack: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    warning: '<path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    virus: '<circle cx="12" cy="12" r="5"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/>',
    soundOn: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    soundOff: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
    play: '<path d="M7 5v14l11-7z"/>',
    trophy: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>'
  };

  function icon(name, size, strokeWidth) {
    return `<svg class="ico" width="${size || 20}" height="${size || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor"` +
      ` stroke-width="${strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
  }

  const BOLT = '<svg class="ico bolt" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>';

  // A test tube = one sample (life). Empty tubes are dashed.
  function tube(full, dark) {
    if (!full) {
      return '<svg class="tube tube--empty" width="15" height="22" viewBox="0 0 16 24" aria-hidden="true" focusable="false">' +
        '<path d="M3 2h10" stroke-width="2" stroke-linecap="round"/><path d="M4.5 2v15.5a3.5 3.5 0 0 0 7 0V2" fill="none" stroke-width="2" stroke-dasharray="3 2"/></svg>';
    }
    return `<svg class="tube${dark ? ' tube--dark' : ''}" width="15" height="22" viewBox="0 0 16 24" aria-hidden="true" focusable="false">` +
      '<path d="M3 2h10" stroke-width="2" stroke-linecap="round"/><path class="tube-glass" d="M4.5 2v15.5a3.5 3.5 0 0 0 7 0V2" stroke-width="2"/>' +
      '<path class="tube-fill" d="M5.5 10h5v7.5a2.5 2.5 0 0 1-5 0z"/></svg>';
  }

  function lives(left, total, dark) {
    let html = '';
    for (let i = 0; i < total; i++) html += tube(i < left, dark);
    return `<div class="lives" role="img" aria-label="${left === 1 ? 'נשארה' : 'נשארו'} ${left} מתוך ${total} דגימות">${html}</div>`;
  }

  /* ================================================================
   * Config and question bank (validated, never trusted blindly)
   * ================================================================ */

  const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
  const RAW = window.GAME_CONFIG || {};
  const rawTimer = RAW.timer || {};
  const rawExam = RAW.exam || {};
  const rawOutbreak = RAW.outbreak || {};

  function posInt(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
  }
  function range(v, fallback) {
    if (!Array.isArray(v) || v.length !== 2) return fallback;
    const a = Number(v[0]);
    const b = Number(v[1]);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) return fallback;
    return [Math.round(Math.min(a, b)), Math.round(Math.max(a, b))];
  }

  // How many questions of each level a station run draws (missing = all of them).
  function perLevel(v) {
    const raw = isObj(v) ? v : {};
    return { 1: posInt(raw[1], Infinity), 2: posInt(raw[2], Infinity), 3: posInt(raw[3], Infinity) };
  }

  const CFG = {
    lockStations: RAW.lockStations !== false,
    livesPerRun: posInt(RAW.livesPerRun, 3),
    timeModeDefault: rawTimer.defaultOn === true,
    examTimedDefault: rawExam.timedByDefault !== false,
    secondsByLevel: rawTimer.secondsByLevel || {},
    perRun: perLevel(RAW.questionsPerRun),
    examMax: posInt(rawExam.maxQuestions, 20),
    examSecondsPerQuestion: posInt(rawExam.secondsPerQuestion, 90),
    startCases: Number(rawOutbreak.startCases) >= 0 ? Math.round(Number(rawOutbreak.startCases)) : 1200,
    casesPerWrong: range(rawOutbreak.casesPerWrong, [60, 120]),
    casesPerRight: range(rawOutbreak.casesPerRight, [20, 60])
  };
  const secondsFor = (level) => posInt(CFG.secondsByLevel[level], 90);

  const STATIONS = [];
  (Array.isArray(RAW.stations) ? RAW.stations : []).forEach((s, i) => {
    if (!s || typeof s.id !== 'string' || !s.id || STATIONS.some((x) => x.id === s.id)) {
      console.warn(`[outbreak] skipping station #${i + 1}: missing or duplicate id`);
      return;
    }
    STATIONS.push({
      id: s.id,
      name: String(s.name || s.id),
      topic: String(s.topic || ''),
      topicCode: String(s.topicCode || ''),
      icon: ICONS[s.icon] ? s.icon : 'flask' // unknown icon names get the lab flask
    });
  });

  function questionProblem(q, seen) {
    if (!q || typeof q !== 'object') return 'not an object';
    if (typeof q.id !== 'string' || !q.id) return 'missing id';
    if (seen.has(q.id)) return 'duplicate id';
    if (!STATIONS.some((s) => s.id === q.station)) return `unknown station "${q.station}"`;
    if (typeof q.code !== 'string' || !q.code.trim()) return 'missing code';
    if (!Array.isArray(q.options) || q.options.length !== 4) return 'needs exactly 4 options';
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) return 'answer must be 0, 1, 2 or 3';
    if (![1, 2, 3].includes(q.level)) return 'level must be 1, 2 or 3';
    return '';
  }

  const DEFAULT_PROMPT = 'מה יהיה הפלט?';
  const QUESTIONS = [];
  const Q_BY_ID = new Map();
  (Array.isArray(window.GAME_QUESTIONS) ? window.GAME_QUESTIONS : []).forEach((q, i) => {
    const problem = questionProblem(q, Q_BY_ID);
    if (problem) {
      console.warn(`[outbreak] skipping question ${q && q.id ? `"${q.id}"` : `#${i + 1}`}: ${problem}`);
      return;
    }
    const clean = {
      id: q.id,
      station: q.station,
      level: q.level,
      prompt: typeof q.prompt === 'string' && q.prompt.trim() ? q.prompt.trim() : DEFAULT_PROMPT,
      context: typeof q.context === 'string' ? q.context : '',
      code: q.code.replace(/\s+$/, ''),
      options: q.options.map((o) => String(o)),
      answer: q.answer,
      hint: typeof q.hint === 'string' ? q.hint : '',
      explanation: (Array.isArray(q.explanation) ? q.explanation : []).filter((s) => s && typeof s === 'object'),
      whyWrong: q.whyWrong && typeof q.whyWrong === 'object' ? q.whyWrong : {}
    };
    QUESTIONS.push(clean);
    Q_BY_ID.set(clean.id, clean);
  });

  // Questions of a station: by level, then file order (Array#sort is stable).
  const STATION_QS = {};
  STATIONS.forEach((s) => {
    STATION_QS[s.id] = QUESTIONS.filter((q) => q.station === s.id).sort((a, b) => a.level - b.level);
  });

  /* ================================================================
   * Saved state (localStorage, always wrapped in try/catch)
   * ================================================================ */

  const STORAGE_KEY = 'outbreak-r-v1';
  const count = (v, fallback) => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : fallback);

  function defaultState() {
    return {
      version: 1,
      mastered: {},
      mistakes: [],
      attempts: {},
      stationsCleared: {},
      // A round = one pass through all the stations. "מתחילים מחדש עם שאלות חדשות" starts the next one.
      round: 1,
      roundRight: {}, // ids answered right in this round (the cure % counts them)
      cases: CFG.startCases,
      casesToday: { date: todayKey(), delta: 0 },
      daysPlayed: [],
      streak: 0,
      bestStreak: 0,
      examBest: null,
      victoryShown: false,
      sound: true,
      timeMode: CFG.timeModeDefault, // "מצב זמן": a countdown on every station question
      examTimed: CFG.examTimedDefault // "מבחן הדמה על זמן": one clock for the mock exam
    };
  }

  function loadState() {
    const s = defaultState();
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (e) {
      saved = null;
    }
    if (!isObj(saved) || saved.version !== 1) return s;

    // Copy field by field with type checks; unknown question ids are ignored.
    if (isObj(saved.mastered)) {
      Object.keys(saved.mastered).forEach((id) => { if (saved.mastered[id] === true) s.mastered[id] = true; });
    }
    if (Array.isArray(saved.mistakes)) {
      s.mistakes = saved.mistakes.filter((id, i, all) => Q_BY_ID.has(id) && all.indexOf(id) === i);
    }
    if (isObj(saved.attempts)) {
      Object.keys(saved.attempts).forEach((id) => {
        const a = saved.attempts[id];
        if (isObj(a)) s.attempts[id] = { right: count(a.right, 0), wrong: count(a.wrong, 0) };
      });
    }
    if (isObj(saved.stationsCleared)) {
      Object.keys(saved.stationsCleared).forEach((id) => { if (saved.stationsCleared[id] === true) s.stationsCleared[id] = true; });
    }
    s.round = Math.max(1, count(saved.round, 1));
    if (isObj(saved.roundRight)) {
      Object.keys(saved.roundRight).forEach((id) => { if (saved.roundRight[id] === true) s.roundRight[id] = true; });
    } else if (s.round === 1) {
      s.roundRight = Object.assign({}, s.mastered); // saved before rounds existed: this is still round 1
    }
    s.cases = count(saved.cases, s.cases);
    if (isObj(saved.casesToday) && typeof saved.casesToday.date === 'string' && Number.isFinite(saved.casesToday.delta)) {
      s.casesToday = { date: saved.casesToday.date, delta: Math.round(saved.casesToday.delta) };
    }
    if (Array.isArray(saved.daysPlayed)) {
      s.daysPlayed = saved.daysPlayed.filter((d, i, all) => typeof d === 'string' && /^\d{4}-\d\d-\d\d$/.test(d) && all.indexOf(d) === i);
    }
    s.streak = count(saved.streak, 0);
    s.bestStreak = Math.max(count(saved.bestStreak, 0), s.streak);
    s.examBest = Number.isFinite(saved.examBest) ? clamp(Math.round(saved.examBest), 0, 100) : null;
    s.victoryShown = saved.victoryShown === true;
    s.sound = saved.sound !== false;
    if (typeof saved.timeMode === 'boolean') s.timeMode = saved.timeMode;
    if (typeof saved.examTimed === 'boolean') s.examTimed = saved.examTimed;
    return s;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Storage unavailable (private mode, blocked): keep playing without saving.
    }
  }

  // Count today as a played day and start a new "today" counter for the cases.
  function touchToday() {
    const today = todayKey();
    if (!state.daysPlayed.includes(today)) state.daysPlayed.push(today);
    if (state.casesToday.date !== today) state.casesToday = { date: today, delta: 0 };
  }

  let state = loadState();
  touchToday();
  save();

  /* ================================================================
   * Derived progress
   * ================================================================ */

  const stationQuestions = (sid) => STATION_QS[sid] || [];
  const masteredIn = (list) => list.filter((q) => state.mastered[q.id]).length;
  const playableStations = () => STATIONS.filter((s) => stationQuestions(s.id).length > 0);
  const allCleared = () => {
    const playable = playableStations();
    return playable.length > 0 && playable.every((s) => state.stationsCleared[s.id]);
  };
  const unseenCount = () => QUESTIONS.filter((q) => !state.attempts[q.id]).length;

  // How many questions one run of this station draws.
  const runSize = (qs) => [1, 2, 3].reduce((n, level) => n + Math.min(CFG.perRun[level], qs.filter((q) => q.level === level).length), 0);

  // The cure: every station is an equal share, full once the station is cleared in this round. Before that,
  // each right answer in this round adds a little, but never the whole share: clearing the station does.
  function stationShare(st) {
    if (state.stationsCleared[st.id]) return 1;
    const qs = stationQuestions(st.id);
    const size = runSize(qs);
    if (!size) return 0;
    const right = qs.filter((q) => state.roundRight[q.id]).length;
    return Math.min(right, size - 1) / size;
  }
  // Rounded for display, but 100% only once every station is cleared.
  function curePct() {
    const playable = playableStations();
    if (!playable.length) return 0;
    const pct = Math.round((100 * playable.reduce((sum, st) => sum + stationShare(st), 0)) / playable.length);
    return pct === 100 && !allCleared() ? 99 : pct;
  }

  // 'empty' | 'cleared' | 'locked' | 'open'
  function stationStatus(index) {
    const st = STATIONS[index];
    if (!stationQuestions(st.id).length) return 'empty';
    if (state.stationsCleared[st.id]) return 'cleared';
    if (CFG.lockStations) {
      const prev = previousPlayable(index);
      if (prev && !state.stationsCleared[prev.id]) return 'locked';
    }
    return 'open';
  }

  function previousPlayable(index) {
    for (let j = index - 1; j >= 0; j--) {
      if (stationQuestions(STATIONS[j].id).length) return STATIONS[j];
    }
    return null;
  }

  function currentStationIndex() {
    return STATIONS.findIndex((s, i) => stationStatus(i) === 'open');
  }

  function examUnlocked() {
    if (!QUESTIONS.length) return false;
    return !CFG.lockStations || state.round > 1 || allCleared();
  }

  const examSize = () => Math.min(CFG.examMax, QUESTIONS.length);

  /* ================================================================
   * Recording answers
   * ================================================================ */

  // A deterministic-looking amount inside [min, max], driven by how many answers were given so far.
  function amountIn(bounds) {
    let answered = 0;
    Object.keys(state.attempts).forEach((id) => { answered += state.attempts[id].right + state.attempts[id].wrong; });
    return bounds[0] + ((answered * 7919 + 13) % (bounds[1] - bounds[0] + 1));
  }

  // Changes the case count (never below 0) and returns the real change.
  function changeCases(delta) {
    touchToday();
    const before = state.cases;
    state.cases = Math.max(0, Math.round(before + delta));
    const real = state.cases - before;
    state.casesToday.delta += real;
    return real;
  }

  function recordAnswer(q, right, countStreak) {
    const cureBefore = curePct();
    const amount = amountIn(right ? CFG.casesPerRight : CFG.casesPerWrong);
    const a = state.attempts[q.id] || (state.attempts[q.id] = { right: 0, wrong: 0 });
    if (right) {
      a.right++;
      state.mastered[q.id] = true;
      state.roundRight[q.id] = true;
      if (countStreak) {
        state.streak++;
        state.bestStreak = Math.max(state.bestStreak, state.streak);
      }
    } else {
      a.wrong++;
      if (countStreak) state.streak = 0;
      if (!state.mistakes.includes(q.id)) state.mistakes.push(q.id);
    }
    const cases = changeCases(right ? -amount : amount);
    save();
    return { cureBefore, cureAfter: curePct(), cases };
  }

  function removeMistake(id) {
    state.mistakes = state.mistakes.filter((m) => m !== id);
    save();
  }

  /* ================================================================
   * Sounds: tiny WebAudio blips, created after the first user gesture
   * ================================================================ */

  let audio = null;

  function ensureAudio() {
    if (audio || !state.sound) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      audio = new Ctx();
    } catch (e) {
      audio = null;
    }
  }

  function tone(freq, at, dur, type, gain, slideTo) {
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    const t = audio.currentTime + at;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function play(name) {
    if (!state.sound || !audio) return;
    try {
      if (audio.state === 'suspended') audio.resume();
      if (name === 'select') tone(660, 0, 0.06, 'triangle', 0.06);
      if (name === 'success') [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.16, 'triangle', 0.09));
      if (name === 'fail') tone(150, 0, 0.32, 'sawtooth', 0.05, 90);
      if (name === 'victory') [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, 'triangle', 0.09));
    } catch (e) {
      // Audio is only decoration.
    }
  }

  ['pointerdown', 'keydown'].forEach((type) => document.addEventListener(type, ensureAudio, true));

  /* ================================================================
   * Screen plumbing: render, focus, announce, toast, history
   * ================================================================ */

  const app = document.getElementById('app');
  const sheetRoot = document.getElementById('sheet-root');
  const live = document.getElementById('live');
  const toastEl = document.getElementById('toast');

  let screen = '';
  let run = null; // the active station run / review / exam

  // Double-tap guard: a new screen (or sheet) often puts its main button exactly where the finger
  // just was (the sticky bottom bar), so clicks right after a render are ignored. See the click handlers.
  const TAP_GUARD_MS = 400;
  let screenShownAt = -Infinity; // #app re-rendered, or a sheet over it closed
  let sheetShownAt = -Infinity; // a sheet opened, or its content changed in place

  function show(name, html, focus) {
    if (sheet) closeSheet();
    toastEl.classList.remove('is-on');
    document.querySelectorAll('.confetti').forEach((c) => c.remove());
    screen = name;
    app.dataset.screen = name;
    app.innerHTML = html;
    screenShownAt = performance.now();
    window.scrollTo(0, 0);
    if (name !== 'home') guardHistory();
    if (focus !== false) {
      const h = app.querySelector('h1');
      if (h) {
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    }
  }

  function announce(text) {
    live.textContent = '';
    window.setTimeout(() => { live.textContent = text; }, 60);
  }

  let toastTimer = 0;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  }

  // Back button: we keep one extra history entry while away from home (or while a sheet is open),
  // so Android's back gesture lands back here instead of leaving the game.
  let guarded = false;
  function guardHistory() {
    if (guarded) return;
    try {
      history.pushState({ outbreak: true }, '');
      guarded = true;
    } catch (e) {
      guarded = false;
    }
  }

  window.addEventListener('popstate', () => {
    guarded = false;
    if (sheet) {
      closeSheet();
      if (screen !== 'home') guardHistory();
      return;
    }
    if (screen === 'home') return;
    requestExit();
    if (sheet) guardHistory();
  });

  // `focus` is false only for the very first render, so page load does not move focus.
  function goHome(focus) {
    if (run && run.timer) run.timer.stop();
    run = null;
    if (allCleared() && !state.victoryShown) {
      state.victoryShown = true;
      save();
      renderVictory(focus);
      return;
    }
    renderHome(focus);
  }

  // Leaving a run: station runs and the exam ask first; everything else just goes home.
  function requestExit() {
    if (run && !run.ended && (run.mode === 'station' || run.mode === 'exam')) {
      openExitConfirm();
      return;
    }
    goHome();
  }

  /* ================================================================
   * Timer (pausable, based on real elapsed time)
   * ================================================================ */

  function createTimer(seconds, onTick, onEnd) {
    let remaining = seconds * 1000;
    let last = 0;
    let loop = 0;
    let finished = false;
    const holds = new Set();

    function tick() {
      const now = performance.now();
      remaining -= now - last;
      last = now;
      if (remaining <= 0) {
        remaining = 0;
        finished = true;
        window.clearInterval(loop);
        loop = 0;
        onTick(0);
        onEnd();
        return;
      }
      onTick(remaining / 1000);
    }
    function startLoop() {
      if (loop || finished || holds.size) return;
      last = performance.now();
      loop = window.setInterval(tick, 250);
    }
    function stopLoop() {
      if (!loop) return;
      remaining = Math.max(1, remaining - (performance.now() - last));
      window.clearInterval(loop);
      loop = 0;
    }
    return {
      total: seconds,
      start() { onTick(remaining / 1000); startLoop(); },
      hold(reason) { holds.add(reason); stopLoop(); },
      release(reason) { holds.delete(reason); startLoop(); },
      stop() { stopLoop(); finished = true; },
      left() { return remaining / 1000; }
    };
  }

  // Station timers pause while the page is hidden. The mock exam keeps running, like the real exam.
  document.addEventListener('visibilitychange', () => {
    if (!run || !run.timer || run.mode !== 'station') return;
    if (document.hidden) run.timer.hold('hidden');
    else run.timer.release('hidden');
  });

  /* ================================================================
   * Shared building blocks
   * ================================================================ */

  const CONSTANTS = new Set(['TRUE', 'FALSE', 'T', 'F', 'NA', 'NULL', 'Inf', 'NaN', 'NA_integer_', 'NA_real_', 'NA_character_']);
  const KEYWORDS = new Set(['function', 'for', 'in', 'if', 'else', 'while', 'repeat', 'break', 'next']);
  // comment | string | number | word
  const TOKEN = /(#.*)|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)|(\d+\.?\d*(?:[eE][+-]?\d+)?L?|\.\d+(?:[eE][+-]?\d+)?L?)|([A-Za-z.][A-Za-z0-9._]*)/g;

  // A small, safe R highlighter: every token is escaped, only class names are added.
  function highlight(code) {
    let html = '';
    let last = 0;
    let m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code))) {
      html += esc(code.slice(last, m.index));
      last = TOKEN.lastIndex;
      const word = m[0];
      let cls = '';
      if (m[1]) cls = 'com';
      else if (m[2]) cls = 'str';
      else if (m[3] || CONSTANTS.has(word)) cls = 'num';
      else if (KEYWORDS.has(word)) cls = 'kw';
      else if (/^\s*\(/.test(code.slice(last))) cls = 'fn';
      html += cls ? `<span class="tk-${cls}">${esc(word)}</span>` : esc(word);
    }
    return html + esc(code.slice(last));
  }

  function codeBlock(code) {
    return `<pre class="code" dir="ltr" tabindex="0" aria-label="קוד R"><code>${highlight(code)}</code></pre>`;
  }

  // The start of the code's last top-level statement (a block like `if (...) {` gets " …").
  function lastCodeLine(q) {
    const lines = q.code.split('\n').map((l) => l.trim());
    const prompts = consolePrompts(q.code);
    let tail = false;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i] || lines[i].startsWith('#')) continue;
      if (prompts[i] === '>') return lines[i] + (tail ? ' …' : '');
      tail = true;
    }
    return lines.filter(Boolean).pop() || '';
  }

  // Options with Hebrew letters ("שגיאה (Error), כי ...") are sentences: shown right to left as
  // formatted text (`code` stays LTR). All other options are R values: LTR monospace.
  const isTextOption = (opt) => /[\u0590-\u05FF]/.test(opt);
  const optionDir = (opt) => (isTextOption(opt) ? 'rtl' : 'ltr');
  const optionMarkup = (opt) => (isTextOption(opt) ? fmt(opt) : esc(opt));

  // What R prints: the last output step of the explanation, else the right option
  // ('' when that option is a Hebrew sentence, which R never prints).
  function printedOutput(q) {
    const outputs = q.explanation.filter((s) => typeof s.output === 'string');
    if (outputs.length) return outputs[outputs.length - 1].output;
    const right = q.options[q.answer];
    return isTextOption(right) ? '' : `[1] ${right}`;
  }

  const isErrorOutput = (output) => /^\s*Error\b/.test(output);

  // The prompt R shows before each code line: '+' only while the expression above is still open
  // (an unclosed bracket or string, or a line that ends with an operator or comma), else '>'.
  function consolePrompts(code) {
    let depth = 0;
    let str = null;
    let cont = false;
    return code.split('\n').map((line) => {
      const prompt = depth > 0 || str || cont ? '+' : '>';
      let bare = '';
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (str) {
          if (ch === '\\') i++;
          else if (ch === str) str = null;
          continue;
        }
        if (ch === '#') break;
        if (ch === '"' || ch === "'" || ch === '`') str = ch;
        else if ('([{'.includes(ch)) depth++;
        else if (')]}'.includes(ch)) depth = Math.max(0, depth - 1);
        bare += ch;
      }
      // Still open: a trailing operator or comma, `else`, or an `if (...)`/`for (...)`/`while (...)` header with no body yet.
      cont = /([-+*/^=&|~,<>!]|%[^%\s]*%|\belse)\s*$/.test(bare) || (depth === 0 && bareHeader(bare));
      return prompt;
    });
  }

  // `if (...)`, `for (...)` or `while (...)` with nothing after the closing bracket.
  function bareHeader(line) {
    const m = /^\s*(?:\}\s*)?(?:else\s+)?(?:if|for|while)\s*\(/.exec(line);
    if (!m) return false;
    let depth = 1;
    let i = m[0].length;
    for (; i < line.length && depth > 0; i++) {
      if (line[i] === '(') depth++;
      else if (line[i] === ')') depth--;
    }
    return depth === 0 && !line.slice(i).trim();
  }

  const hasVector = (s) => !!(s.vector && Array.isArray(s.vector.values));
  const hasTable = (s) => !!(s.table && Array.isArray(s.table.columns) && Array.isArray(s.table.rows));

  const MARK_WORDS = { on: 'מסומן', off: 'לא נבחר', drop: 'נמחק' };
  // Vector marks come from the data, so only these known values may become a class name.
  const markOf = (m) => (m === 'on' || m === 'off' || m === 'drop' ? m : 'plain');

  function vectorViz(v, dark) {
    const marks = Array.isArray(v.marks) ? v.marks : [];
    const labels = Array.isArray(v.labels) ? v.labels : [];
    const described = v.values.map((val, i) => {
      const mark = markOf(marks[i]);
      return `${val}${mark !== 'plain' ? ` (${MARK_WORDS[mark]})` : ''}${labels[i] ? `: ${labels[i]}` : ''}`;
    });
    const cols = v.values.map((val, i) => {
      const mark = markOf(marks[i]);
      return '<span class="vcol">' +
        (v.showIndex ? `<span class="vidx">${i + 1}</span>` : '') +
        `<span class="vcell m-${mark}">${esc(val)}</span>` +
        (labels.length ? `<span class="vlab m-${mark}">${esc(labels[i] == null ? '' : labels[i])}</span>` : '') +
        '</span>';
    }).join('');
    return `<div class="vec${dark ? ' vec--dark' : ''}" dir="ltr" role="img" aria-label="${esc(`וקטור: ${described.join(', ')}`)}">${cols}</div>`;
  }

  function tableViz(t, dark) {
    const rowNames = Array.isArray(t.rowNames) ? t.rowNames : [];
    const hl = Array.isArray(t.highlightRows) ? t.highlightRows : [];
    const head = `<tr>${rowNames.length ? '<th scope="col"><span class="sr-only">שורה</span></th>' : ''}${t.columns.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr>`;
    const body = t.rows.map((row, r) => {
      const cells = (Array.isArray(row) ? row : []).map((c) => `<td>${esc(c)}</td>`).join('');
      const on = hl.includes(r);
      return `<tr${on ? ' class="hl"' : ''}>${rowNames.length ? `<th scope="row">${esc(rowNames[r] == null ? '' : rowNames[r])}</th>` : ''}${cells}</tr>`;
    }).join('');
    return `<div class="tbl-wrap${dark ? ' tbl-wrap--dark' : ''}" dir="ltr" tabindex="0"><table class="tbl"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }

  function consoleChip(output) {
    return `<code class="console-chip${isErrorOutput(output) ? ' is-err' : ''}" dir="ltr">${esc(output)}</code>`;
  }

  function stepVisual(step, dark) {
    if (hasVector(step)) return vectorViz(step.vector, dark);
    if (hasTable(step)) return tableViz(step.table, dark);
    if (typeof step.output === 'string') return consoleChip(step.output);
    return '';
  }

  // Full explanation: numbered steps with their visuals.
  function stepsFull(q) {
    if (!q.explanation.length) return '';
    const items = q.explanation.map((s, i) => `<li class="step">
        <span class="step-num" aria-hidden="true">${i + 1}</span>
        <div class="step-body"><p class="step-text">${fmt(s.text)}</p>${stepVisual(s, false)}</div>
      </li>`).join('');
    return `<section class="card steps-card" aria-labelledby="steps-title">
        <h2 class="card-title" id="steps-title">מה R עשה, צעד אחר צעד</h2>
        <ol class="steps">${items}</ol>
      </section>`;
  }

  // Compact explanation (success screen). The visual already shown in the hero is skipped.
  function stepsCompact(q, skip) {
    return q.explanation.map((s, i) => {
      let extra = '';
      if (i !== skip) {
        if (hasVector(s)) {
          const marks = Array.isArray(s.vector.marks) ? s.vector.marks : [];
          extra = `<bdi dir="ltr" class="inline-vec">${s.vector.values.map((v, j) => `<span class="iv m-${markOf(marks[j])}">${esc(v)}</span>`).join(' ')}</bdi>`;
        } else if (hasTable(s)) {
          extra = tableViz(s.table, false);
        } else if (typeof s.output === 'string') {
          extra = consoleChip(s.output);
        }
      }
      return `<li><span>${fmt(s.text)}</span>${extra}</li>`;
    }).join('');
  }

  function levelChip(level) {
    return `<span class="chip chip--level lv-${level}">${LEVELS[level]}</span>`;
  }

  function segments(total, currentIndex, isDone) {
    let html = '';
    for (let i = 0; i < total; i++) {
      const cls = i === currentIndex ? 'is-current' : isDone(i) ? 'is-done' : '';
      html += `<span class="${cls}"></span>`;
    }
    return `<div class="segments${total > 20 ? ' segments--dense' : ''}" aria-hidden="true" style="grid-template-columns: repeat(${total}, minmax(0, 1fr))">${html}</div>`;
  }

  function timerStrip(text, label) {
    return `<div class="strip" id="strip">
        <span class="strip-icon">${icon('flask', 24)}</span>
        <div class="strip-mid">
          <span class="strip-text" id="strip-text">${esc(text)}</span>
          <span class="bar"><span class="bar-fill" id="timer-bar"></span></span>
        </div>
        <div class="strip-time">
          <span class="strip-label">${esc(label)}</span>
          <span class="strip-clock" id="timer-clock" dir="ltr" role="timer">0:00</span>
        </div>
      </div>`;
  }

  // The exam without time mode: a calm strip with how many questions are answered, no clock.
  function progressStrip(answered, total) {
    return `<div class="strip strip--calm" id="strip">
        <span class="strip-icon">${icon('flask', 24)}</span>
        <div class="strip-mid">
          <span class="strip-text" id="strip-text">עניתם על ${answered} מתוך ${total}</span>
          <span class="bar"><span class="bar-fill" id="answered-bar" style="width:${(100 * answered) / total}%"></span></span>
        </div>
      </div>`;
  }

  function updateStrip(secondsLeft) {
    if (!run || !run.timer) return;
    const bar = document.getElementById('timer-bar');
    const clockEl = document.getElementById('timer-clock');
    const strip = document.getElementById('strip');
    if (!bar || !clockEl) return;
    const urgentAt = run.mode === 'exam' ? 60 : 10;
    bar.style.width = `${clamp((100 * secondsLeft) / run.timer.total, 0, 100)}%`;
    clockEl.textContent = clock(secondsLeft);
    strip.classList.toggle('is-urgent', secondsLeft <= urgentAt);
    if (secondsLeft <= urgentAt && secondsLeft > 0 && !run.warned) {
      run.warned = true;
      announce(run.mode === 'exam' ? 'נשארה דקה אחת למבחן' : 'נשארו 10 שניות');
    }
  }

  function optionsList(q, selected) {
    return `<ul class="options" role="list">${q.options.map((opt, i) => `<li>
        <button type="button" class="option${isTextOption(opt) ? ' option--text' : opt.length > 18 ? ' option--long' : ''}" data-action="pick" data-index="${i}" aria-pressed="${selected === i}">
          <span class="option-letter">${LETTERS[i]}</span>
          <span class="option-value" dir="${optionDir(opt)}">${optionMarkup(opt)}</span>
          <svg class="option-check" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </li>`).join('')}</ul>`;
  }

  function questionCard(q, logLabel, chips) {
    return `<section class="card qcard">
        <div class="qcard-head">
          <span class="qcard-log">${esc(logLabel)}</span>
          <span class="qcard-chips">${chips}</span>
        </div>
        <h1 class="qtitle${q.prompt.length > 20 ? ' qtitle--long' : ''}">${fmt(q.prompt)}</h1>
        ${q.context ? `<p class="qcontext">${fmt(q.context)}</p>` : ''}
        ${codeBlock(q.code)}
      </section>`;
  }

  function topbar(kicker, title, closeIcon, closeLabel, end) {
    return `<header class="topbar">
        <button type="button" class="icon-btn" data-action="exit" aria-label="${esc(closeLabel)}">${icon(closeIcon, 20, 2.4)}</button>
        <div class="topbar-title"><span class="kicker">${esc(kicker)}</span><span class="topbar-main">${esc(title)}</span></div>
        <div class="topbar-end">${end || ''}</div>
      </header>`;
  }

  function sizeClass(text) {
    if (isTextOption(text)) return ' is-text';
    return text.length > 16 ? ' is-xlong' : text.length > 9 ? ' is-long' : '';
  }

  function cmpValue(q, index, struck) {
    const opt = q.options[index];
    return `<span class="cmp-value${struck ? ' is-struck' : ''}${sizeClass(opt)}" dir="${optionDir(opt)}"><span class="sr-only">${LETTERS[index]}: </span>${optionMarkup(opt)}</span>`;
  }

  // "Your answer" vs "right answer" boxes (stacked when an answer is a sentence or long).
  function compareBoxes(q, chosen) {
    const right = q.options[q.answer];
    const mine = chosen == null ? '<span class="cmp-none">לא נבחרה תשובה</span>' : cmpValue(q, chosen, true);
    const wide = [right, chosen == null ? '' : q.options[chosen]].some((o) => isTextOption(o) || o.length > 22);
    return `<div class="compare${wide ? ' compare--stack' : ''}">
        <div class="cmp cmp--wrong">
          <span class="cmp-label">${icon('close', 13, 3)}התשובה שלכם</span>
          ${mine}
        </div>
        <div class="cmp cmp--right">
          <span class="cmp-label">${icon('check', 13, 3)}התשובה הנכונה</span>
          ${cmpValue(q, q.answer, false)}
        </div>
      </div>`;
  }

  function whyWrongCard(q, chosen) {
    const text = chosen == null ? '' : q.whyWrong[chosen];
    if (!text) return '';
    return `<section class="why-wrong">
        <span class="why-icon">${icon('bulb', 22)}</span>
        <div><h2 class="why-title">למה קל להתבלבל כאן?</h2><p>${fmt(text)}</p></div>
      </section>`;
  }

  // An option inside a Hebrew sentence: an isolated LTR value, or RTL text for a Hebrew option.
  function answerInline(opt) {
    return `<bdi dir="${optionDir(opt)}" class="${isTextOption(opt) ? 'opt-text' : 'mono'}">${optionMarkup(opt)}</bdi>`;
  }

  function resultRow(r, i) {
    const q = r.q;
    const status = r.right
      ? `<span class="rr-icon is-right">${icon('checkCircle', 22, 2.2)}<span class="sr-only">נכון</span></span>`
      : `<span class="rr-icon is-wrong">${icon('xCircle', 22, 2.2)}<span class="sr-only">${r.chosen == null ? 'בלי תשובה' : 'שגוי'}</span></span>`;
    return `<li><button type="button" class="result-row" data-action="explain" data-index="${i}">
        ${status}
        <span class="rr-main">
          ${q.context ? `<span class="rr-context">${fmt(q.context.replace(/[:：]\s*$/, ''))}</span>` : ''}
          <code class="rr-code" dir="ltr">${esc(lastCodeLine(q))}</code>
          <span class="rr-answer">התשובה הנכונה: ${answerInline(q.options[q.answer])}</span>
        </span>
        <span class="rr-go">${icon('chevronFwd', 18, 2.2)}</span>
      </button></li>`;
  }

  function resultList(results, title) {
    return `<section class="card list-card" aria-labelledby="results-title">
        <h2 class="card-title" id="results-title">${esc(title)}</h2>
        <ul class="results" role="list">${results.map(resultRow).join('')}</ul>
      </section>`;
  }

  function mapSvg(scale, cured) {
    const r = (v) => (v * scale).toFixed(1);
    const hot = cured ? 'url(#map-cure)' : 'url(#map-hot)';
    const warm = cured ? 'url(#map-cure)' : 'url(#map-warm)';
    return `<svg class="map" viewBox="0 0 326 92" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="map-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.4" fill="#2B3A4C"/></pattern>
          <radialGradient id="map-hot"><stop offset="0" stop-color="#FF5A5F" stop-opacity="0.95"/><stop offset="0.55" stop-color="#FF5A5F" stop-opacity="0.35"/><stop offset="1" stop-color="#FF5A5F" stop-opacity="0"/></radialGradient>
          <radialGradient id="map-warm"><stop offset="0" stop-color="#FFC93C" stop-opacity="0.85"/><stop offset="1" stop-color="#FFC93C" stop-opacity="0"/></radialGradient>
          <radialGradient id="map-cure"><stop offset="0" stop-color="#3BE07F" stop-opacity="0.8"/><stop offset="1" stop-color="#3BE07F" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="326" height="92" fill="url(#map-dots)"/>
        <circle cx="238" cy="42" r="${r(40)}" fill="${hot}"/>
        <circle cx="180" cy="64" r="${r(24)}" fill="${hot}"/>
        <circle cx="94" cy="26" r="${r(17)}" fill="${warm}"/>
        <circle cx="36" cy="68" r="${r(12)}" fill="${warm}"/>
        <circle cx="130" cy="56" r="7" fill="#7C5CE6" stroke="#FFFFFF" stroke-width="2"/>
        <text x="119" y="60" text-anchor="end" font-family="Rubik, sans-serif" font-size="11" font-weight="600" fill="#D9CFFF">המעבדה שלכם</text>
      </svg>`;
  }

  function confetti() {
    if (reducedMotion()) return;
    const layer = document.createElement('div');
    layer.className = 'confetti';
    layer.setAttribute('aria-hidden', 'true');
    const colors = ['#5B3CC4', '#3BE07F', '#FFC93C', '#7C5CE6', '#FF8A8D', '#7CC7FF'];
    for (let i = 0; i < 34; i++) {
      const piece = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 34 + Math.random() * 0.4;
      const dist = 90 + Math.random() * 130;
      piece.style.setProperty('--x', `${Math.round(Math.cos(angle) * dist)}px`);
      piece.style.setProperty('--y', `${Math.round(Math.sin(angle) * dist * 0.8 + 120)}px`);
      piece.style.setProperty('--r', `${Math.round(Math.random() * 720 - 360)}deg`);
      piece.style.animationDelay = `${Math.round(Math.random() * 120)}ms`;
      piece.style.background = colors[i % colors.length];
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 2000);
  }

  /* ================================================================
   * Home
   * ================================================================ */

  function soundButton() {
    return `<button type="button" class="icon-btn" data-action="sound" aria-pressed="${state.sound}" aria-label="צלילים">${icon(state.sound ? 'soundOn' : 'soundOff', 20)}</button>`;
  }

  function stationRow(st, index, isCurrent) {
    const status = stationStatus(index);
    const qs = stationQuestions(st.id);
    const done = masteredIn(qs);
    const topic = `${esc(st.topic)}${st.topicCode ? ` · <code dir="ltr">${esc(st.topicCode)}</code>` : ''}`;
    const text = `<span class="st-text"><span class="st-name">${esc(st.name)}</span><span class="st-topic">${topic}</span></span>`;

    if (status === 'empty') {
      return `<li><div class="station is-empty" aria-disabled="true">
          <span class="st-icon">${icon(st.icon, 20)}</span>${text}
          <span class="pill">בקרוב</span>
        </div></li>`;
    }
    if (status === 'locked') {
      const prev = previousPlayable(index);
      return `<li><button type="button" class="station is-locked" aria-disabled="true" data-action="locked" data-message="${esc(`סיימו קודם את ${prev.name}`)}">
          <span class="st-icon">${icon(st.icon, 20)}</span>${text}
          <span class="st-end">${icon('lock', 18)}<span class="sr-only">נעולה</span></span>
        </button></li>`;
    }
    // A cleared station keeps its count until every question in it was answered right:
    // a run only draws some of the station's questions, so there is more to practise.
    const count = `<span class="st-count" dir="ltr"><span class="sr-only">נפתרו </span>${done}/${qs.length}</span>`;
    const end = status === 'cleared'
      ? `<span class="st-end is-cleared">${done < qs.length ? count : ''}${icon('checkCircle', 20, 2.2)}<span class="sr-only">הושלמה</span></span>`
      : `<span class="st-end">${count}${icon('chevronFwd', 18, 2.4)}</span>`;
    return `<li><button type="button" class="station${isCurrent ? ' is-current' : ''}${status === 'cleared' ? ' is-cleared' : ''}" data-action="station" data-id="${esc(st.id)}">
        <span class="st-icon">${icon(st.icon, 20)}</span>${text}${end}
      </button></li>`;
  }

  function examSub(n) {
    if (!n) return 'מבחן דמה · בקרוב';
    return `מבחן דמה · ${n} שאלות${state.examTimed ? ' · על זמן' : ''}`;
  }

  function examRow() {
    const unlocked = examUnlocked();
    const n = examSize();
    const sub = examSub(n);
    const end = unlocked
      ? (state.examBest != null
        ? `<span class="st-end"><span class="st-best" dir="ltr"><span class="sr-only">השיא שלכם </span>${state.examBest}%</span>${icon('chevronFwd', 18, 2.4)}</span>`
        : `<span class="st-end">${icon('chevronFwd', 18, 2.4)}</span>`)
      : `<span class="st-end">${icon('lock', 18)}<span class="sr-only">נעול</span></span>`;
    return `<li><button type="button" class="station station--exam${unlocked ? '' : ' is-locked'}" ${unlocked ? 'data-action="exam"' : 'aria-disabled="true" data-action="locked" data-message="סיימו קודם את כל התחנות"'}>
        <span class="st-icon">${icon('flask', 20, 2.2)}</span>
        <span class="st-text"><span class="st-name">מכינים את התרופה</span><span class="st-topic">${sub}</span></span>
        ${end}
      </button></li>`;
  }

  function homeCta() {
    const current = currentStationIndex();
    if (current >= 0) {
      return `<button type="button" class="btn btn--primary btn--big" data-action="station" data-id="${esc(STATIONS[current].id)}">ממשיכים ב${esc(STATIONS[current].name)}${icon('arrowFwd', 20, 2.4)}</button>`;
    }
    if (!examUnlocked()) return '';
    if (state.examBest != null && state.mistakes.length) {
      return `<button type="button" class="btn btn--primary btn--big" data-action="review">ניקוי דגימות${icon('arrowFwd', 20, 2.4)}</button>`;
    }
    return `<button type="button" class="btn btn--primary btn--big" data-action="exam">למבחן הדמה${icon('arrowFwd', 20, 2.4)}</button>`;
  }

  function newRoundSub() {
    const unseen = unseenCount();
    if (!unseen) return 'כבר ראיתם את כל השאלות. הן יחזרו בסדר חדש.';
    return unseen === 1 ? 'עוד שאלה אחת שעוד לא ראיתם מחכה בתחנות' : `עוד ${unseen} שאלות שעוד לא ראיתם מחכות בתחנות`;
  }

  function newRoundCard() {
    return `<button type="button" class="new-round" data-action="new-round-ask">
        <span class="new-round-icon">${icon('loop', 20, 2.2)}</span>
        <span class="new-round-text">
          <span class="new-round-title">מתחילים מחדש עם שאלות חדשות</span>
          <span class="new-round-sub">${newRoundSub()}</span>
        </span>
        ${icon('chevronFwd', 18, 2.2)}
      </button>`;
  }

  function askNewRound() {
    openSheet({
      title: 'מתחילים סבב חדש?',
      body: `<p class="sheet-text">התחנות והתרופה יתחילו שוב מאפס, ובכל תחנה יגיעו קודם שאלות שעוד לא ראיתם. השאלות שכבר פתרתם, הדגימות המזוהמות והשיא במבחן הדמה נשמרים.</p>
        <div class="sheet-actions">
          <button type="button" class="btn btn--primary btn--grow" data-action="new-round">כן, מתחילים</button>
          <button type="button" class="btn btn--ghost btn--grow" data-action="sheet-close">ביטול</button>
        </div>`
    });
  }

  // A new round: the stations' checkmarks and the outbreak start over. What was learned stays (mastered
  // questions, mistakes to fix, the exam record). With lockStations on, the stations lock again from the
  // first one, but the mock exam stays open.
  function newRound() {
    if (run && run.timer) run.timer.stop();
    run = null;
    state.round += 1;
    state.stationsCleared = {};
    state.roundRight = {};
    state.victoryShown = false;
    state.cases = CFG.startCases;
    state.casesToday = { date: todayKey(), delta: 0 };
    touchToday();
    save();
    if (sheet) closeSheet(true);
    renderHome();
    toast(`סבב ${state.round} התחיל`);
  }

  function renderHome(focus) {
    run = null;
    const cure = curePct();
    const day = Math.max(1, state.daysPlayed.length);
    const delta = state.casesToday.date === todayKey() ? state.casesToday.delta : 0;
    const scale = clamp(CFG.startCases ? state.cases / CFG.startCases : 1, 0.6, 1.3);
    const current = currentStationIndex();
    const playable = playableStations();
    const cleared = playable.filter((s) => state.stationsCleared[s.id]).length;
    const mistakes = state.mistakes.length;
    const meta = `${state.round > 1 ? `סבב ${state.round} · ` : ''}${cleared} מתוך ${playable.length} הושלמו`;

    const deltaHtml = delta === 0 ? '' : delta > 0
      ? `<span class="cases-delta is-up"><span aria-hidden="true">▲</span> <bdi dir="ltr">${thousands(delta)}</bdi> היום</span>`
      : `<span class="cases-delta is-down"><span aria-hidden="true">▼</span> <bdi dir="ltr">${thousands(-delta)}</bdi> היום</span>`;

    const mistakesCard = mistakes ? `<button type="button" class="mistakes" data-action="review">
        <span class="mistakes-icon">${icon('warning', 20)}</span>
        <span class="mistakes-text">
          <span class="mistakes-title">${mistakes === 1 ? 'דגימה מזוהמת אחת' : `${mistakes} דגימות מזוהמות`}</span>
          <span class="mistakes-sub">השאלות שטעיתם בהן מחכות לתיקון</span>
        </span>
        ${icon('chevronFwd', 18, 2.2)}
      </button>` : '';

    const cta = homeCta();
    show('home', `<div class="screen screen--home">
        <header class="home-head">
          <div class="brand">
            <span class="logo">${icon('virus', 26)}</span>
            <span class="brand-text"><h1 class="brand-name">התפרצות</h1><span class="brand-sub">מתאמנים ל-R לקראת המבחן</span></span>
          </div>
          <div class="home-tools">
            ${soundButton()}
            <button type="button" class="icon-btn" data-action="about" aria-label="איך משחקים והגדרות">${icon('more', 20, 2.6)}</button>
          </div>
        </header>

        <section class="tracker" aria-label="מצב ההתפרצות">
          <div class="tracker-top">
            <span class="tracker-alert"><span class="pulse-dot" aria-hidden="true"></span>נגיף מסתורי מתפשט!</span>
            <span class="tracker-day">יום ${day}</span>
          </div>
          ${mapSvg(scale, false)}
          <div class="tracker-stats">
            <div class="stat">
              <span class="stat-label">חולים</span>
              <span class="stat-row"><span class="cases" dir="ltr">${thousands(state.cases)}</span>${deltaHtml}</span>
            </div>
            <div class="stat stat--cure">
              <span class="stat-row stat-row--between"><span class="stat-label">התרופה מוכנה</span><span class="cure-pct" dir="ltr">${cure}%</span></span>
              <span class="cure-bar" role="progressbar" aria-label="התרופה מוכנה" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${cure}"><span style="width:${cure}%"></span></span>
            </div>
          </div>
        </section>

        ${mistakesCard}

        <section class="stations" aria-labelledby="stations-title">
          <div class="section-head">
            <h2 id="stations-title">תחנות במעבדה</h2>
            <span class="section-meta">${meta}</span>
          </div>
          <ul class="station-list" role="list">
            ${STATIONS.map((st, i) => stationRow(st, i, i === current)).join('')}
            ${examRow()}
          </ul>
          ${allCleared() ? newRoundCard() : ''}
          ${QUESTIONS.length ? '' : '<p class="empty-note">עוד אין שאלות במאגר. הן יתווספו בקרוב.</p>'}
        </section>

        ${cta ? `<div class="actions">${cta}</div>` : ''}
      </div>`, focus);
  }

  /* ================================================================
   * Station run and review mode
   * ================================================================ */

  function startStation(id) {
    const st = STATIONS.find((s) => s.id === id);
    const qs = st ? stationQuestions(id) : [];
    if (!qs.length) return;
    run = { mode: 'station', station: st, questions: runQuestions(qs), index: 0, lives: CFG.livesPerRun, results: [] };
    showQuestion();
  }

  // A station run: per level (easy → hard) up to questionsPerRun questions, in random order, but questions
  // never seen before come first, then ones not answered right yet, so a replay (or a new round) brings new ones.
  function runQuestions(qs) {
    const freshness = (q) => (state.mastered[q.id] ? 2 : state.attempts[q.id] ? 1 : 0);
    return [1, 2, 3].flatMap((level) => shuffle(qs.filter((q) => q.level === level))
      .sort((a, b) => freshness(a) - freshness(b))
      .slice(0, CFG.perRun[level]));
  }

  function startReview() {
    const qs = state.mistakes.map((id) => Q_BY_ID.get(id)).filter(Boolean);
    if (!qs.length) return;
    run = { mode: 'review', questions: qs, index: 0, results: [] };
    showQuestion();
  }

  function runHeader(closeIcon, closeLabel) {
    const total = run.questions.length;
    if (run.mode === 'review') {
      return topbar('ניקוי דגימות', `${run.index + 1} מתוך ${total}`, closeIcon, closeLabel, '');
    }
    return topbar(run.station.name, `ניסוי ${run.index + 1} מתוך ${total}`, closeIcon, closeLabel, lives(run.lives, CFG.livesPerRun));
  }

  function showQuestion() {
    const q = run.questions[run.index];
    run.selected = null;
    run.hintUsed = false;
    run.warned = false;
    run.timer = null;
    const useTimer = run.mode === 'station' && state.timeMode;
    const chips = levelChip(q.level) + (state.streak >= 2 ? `<span class="chip chip--streak">${BOLT}${state.streak} ברצף</span>` : '');
    const logLabel = run.mode === 'review' ? `ניקוי דגימות · ${pad2(run.index + 1)}` : `יומן מעבדה · ניסוי ${pad2(run.index + 1)}`;
    const closeLabel = run.mode === 'review' ? 'חזרה למעבדה' : 'יציאה מהתחנה';

    show('question', `<div class="screen screen--question">
        ${runHeader('chevronBack', closeLabel)}
        ${segments(run.questions.length, run.index, (i) => i < run.index)}
        ${useTimer ? timerStrip('הניסוי מחכה לתשובה שלכם', 'הדגימה מתקלקלת') : ''}
        ${questionCard(q, logLabel, chips)}
        ${optionsList(q, null)}
        <div class="actions actions--row">
          ${q.hint ? `<button type="button" class="btn btn--ghost" data-action="hint">${icon('bulb', 20)}רמז</button>` : ''}
          <button type="button" class="btn btn--primary btn--grow" data-action="submit" disabled>הריצו את הניסוי</button>
        </div>
      </div>`);

    if (useTimer) {
      run.timer = createTimer(secondsFor(q.level), updateStrip, () => submitAnswer(true));
      if (document.hidden) run.timer.hold('hidden');
      run.timer.start();
    }
  }

  function pickOption(index) {
    if (!run || screen !== 'question') return;
    if (run.mode === 'exam') run.answers[run.index] = index;
    else run.selected = index;
    app.querySelectorAll('.option').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.index) === index)));
    const submit = app.querySelector('[data-action="submit"]');
    if (submit) submit.disabled = false;
    if (run.mode === 'exam') updateExamProgress();
    play('select');
  }

  function submitAnswer(timeout) {
    if (!run || screen !== 'question' || run.mode === 'exam') return;
    const chosen = timeout ? null : run.selected;
    if (chosen == null && !timeout) return;
    if (run.timer) run.timer.stop();
    if (sheet) closeSheet();
    const q = run.questions[run.index];
    const right = chosen === q.answer;
    const rec = recordAnswer(q, right, true);
    if (run.mode === 'station' && !right) run.lives--;
    if (run.mode === 'review' && right) removeMistake(q.id);
    run.results.push({ q, chosen, right });
    run.feedback = Object.assign({ q, chosen, right, timeout: !!timeout, hint: run.hintUsed }, rec);
    if (right) {
      renderSuccess();
      play('success');
      confetti();
      announce(`תשובה נכונה: ${LETTERS[q.answer]}. ${run.mode === 'review' ? 'הדגימה נוקתה.' : 'הניסוי הצליח!'}`);
    } else {
      renderFail();
      play('fail');
      announce(timeout
        ? `הזמן נגמר. התשובה הנכונה: ${LETTERS[q.answer]}`
        : `טעות. התשובה הנכונה: ${LETTERS[q.answer]}${run.mode === 'station' ? `. ${samplesLeftText(run.lives)}` : ''}`);
    }
  }

  function samplesLeftText(n) {
    if (n === 1) return 'נשארה דגימה אחת';
    if (n === 0) return 'לא נשארו דגימות';
    return `נשארו ${n} דגימות`;
  }

  function isRunOver() {
    return run.index + 1 >= run.questions.length || (run.mode === 'station' && run.lives <= 0);
  }

  function nextButton() {
    const label = isRunOver() ? (run.mode === 'review' ? 'לסיכום הניקוי' : 'לסיכום התחנה') : 'לניסוי הבא';
    return `<button type="button" class="btn btn--primary btn--grow" data-action="next">${label}${icon('arrowFwd', 20, 2.4)}</button>`;
  }

  function consoleLines(code) {
    const prompts = consolePrompts(code);
    return code.split('\n').map((l, i) => `<span class="rc-prompt">${esc(prompts[i])}</span> ${highlight(l)}`).join('\n');
  }

  function renderSuccess() {
    const f = run.feedback;
    const q = f.q;
    const heroIndex = q.explanation.findIndex((s) => hasVector(s) || hasTable(s));
    const output = printedOutput(q);
    const right = q.options[q.answer];
    const caption = !output
      ? `<p class="hero-caption">התשובה הנכונה: <span class="hero-answer">${answerInline(right)}</span></p>`
      : `<p class="hero-caption">${isErrorOutput(output) ? 'ולכן R עוצר עם שגיאה:' : 'ולכן הפלט הוא'} ${consoleChip(output)}</p>`;
    const consoleOut = output ? `\n<span class="rc-out${isErrorOutput(output) ? ' is-err' : ''}">${esc(output)}</span>` : '';
    const heroVisual = heroIndex >= 0
      ? `<div class="hero-visual">${stepVisual(q.explanation[heroIndex], true)}</div>${caption}`
      : `<pre class="rconsole" dir="ltr" aria-label="קונסולת R">${consoleLines(q.code)}${consoleOut}</pre>${output ? '' : caption}`;

    const gained = f.cureAfter - f.cureBefore;
    const slowed = -f.cases;
    const label = `תשובה נכונה · ${LETTERS[q.answer]}${f.hint ? ' · עם רמז' : ''}`;
    const title = run.mode === 'review' ? 'הדגימה נוקתה!' : 'הניסוי הצליח!';

    show('feedback', `<div class="screen screen--success">
        ${runHeader('close', run.mode === 'review' ? 'חזרה למעבדה' : 'יציאה מהתחנה')}
        <section class="hero hero--success">
          <div class="hero-top">
            <div class="hero-titles"><span class="hero-label">${esc(label)}</span><h1 class="hero-title">${title}</h1></div>
            <span class="hero-badge">${icon('check', 26, 3)}</span>
          </div>
          ${heroVisual}
        </section>

        <div class="tiles">
          <div class="tile">
            <span class="tile-label">התרופה מוכנה</span>
            <span class="tile-row"><span class="tile-num" dir="ltr">${f.cureAfter}%</span>${gained > 0 ? `<span class="gain" dir="ltr">+${gained}</span>` : ''}</span>
            <span class="cure-bar cure-bar--light" role="progressbar" aria-label="התרופה מוכנה" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${f.cureAfter}"><span style="width:${f.cureBefore}%"></span><span class="is-new" style="width:${Math.max(0, gained)}%"></span></span>
          </div>
          <div class="tile">
            <span class="tile-label">ברצף</span>
            <span class="tile-row"><span class="streak-bolt">${BOLT}</span><span class="tile-num" dir="ltr">${state.streak}</span></span>
            <span class="tile-note">השיא שלכם: ${state.bestStreak}</span>
          </div>
        </div>

        <div class="slowdown">
          <svg width="74" height="30" viewBox="0 0 74 30" fill="none" aria-hidden="true" focusable="false"><path d="M72 22 60 14l-10 4-12-10-10 3-10 8-14 6" stroke="#127A3E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="27" r="2.6" fill="#127A3E"/></svg>
          <span class="slowdown-text">
            <span class="slowdown-title">ההתפשטות מאטה</span>
            <span class="slowdown-sub">${slowed > 0 ? `${thousands(slowed)} חולים חדשים פחות, בזכותכם` : 'אין חולים חדשים, בזכותכם'}</span>
          </span>
        </div>

        <section class="card why-right" aria-labelledby="why-right-title">
          <div class="why-right-head">
            <h2 class="card-title" id="why-right-title">למה זה נכון?</h2>
            <button type="button" class="link-btn" data-action="try-r">${icon('terminal', 18)}נסו ב-R</button>
          </div>
          <ul class="why-right-list" role="list">${stepsCompact(q, heroIndex)}</ul>
        </section>

        <div class="actions">${nextButton().replace('btn--grow', 'btn--big')}</div>
      </div>`);
  }

  function renderFail() {
    const f = run.feedback;
    const q = f.q;
    const chips = (run.mode === 'station' ? '<span class="hchip"><bdi dir="ltr">−1</bdi> דגימה</span>' : '') +
      (f.cases > 0 ? `<span class="hchip hchip--red"><bdi dir="ltr">+${thousands(f.cases)}</bdi> חולים</span>` : '');

    show('feedback', `<div class="screen screen--fail">
        ${runHeader('close', run.mode === 'review' ? 'חזרה למעבדה' : 'יציאה מהתחנה')}
        <section class="hero hero--fail${reducedMotion() ? '' : ' shake'}">
          <div class="hazard" aria-hidden="true"></div>
          <div class="hero-fail-body">
            <span class="hazard-icon">${icon(f.timeout ? 'flask' : 'virus', 28)}</span>
            <div class="hero-titles">
              <span class="hero-label hero-label--hazard">${f.timeout ? 'הזמן נגמר' : 'אוי, הדגימה זוהמה!'}</span>
              <h1 class="hero-title">${f.timeout ? 'הדגימה התקלקלה' : 'הניסוי נכשל'}</h1>
              ${chips ? `<span class="hchips">${chips}</span>` : ''}
            </div>
          </div>
        </section>

        ${compareBoxes(q, f.chosen)}
        ${stepsFull(q)}
        ${f.timeout ? '' : whyWrongCard(q, f.chosen)}

        <div class="actions actions--row">
          <button type="button" class="btn btn--ghost" data-action="try-r">${icon('terminal', 20)}נסו ב-R</button>
          ${nextButton()}
        </div>
      </div>`);
  }

  function nextAfterFeedback() {
    if (!run) return goHome();
    if (isRunOver()) return finishRun();
    run.index++;
    showQuestion();
  }

  function finishRun() {
    run.ended = true;
    if (run.mode === 'review') return renderReviewSummary();
    if (run.lives > 0) {
      // Which stations were locked before this clear, so the summary can say whether one just opened.
      run.lockedBefore = STATIONS.map((s, i) => stationStatus(i) === 'locked');
      state.stationsCleared[run.station.id] = true;
      save();
      renderStationSummary();
      play('success');
      confetti();
    } else {
      renderRunFailed();
    }
  }

  function nextStationAfter(id) {
    const from = STATIONS.findIndex((s) => s.id === id);
    for (let i = from + 1; i < STATIONS.length; i++) {
      if (stationStatus(i) === 'open' || stationStatus(i) === 'cleared') return STATIONS[i];
    }
    return null;
  }

  function renderStationSummary() {
    const right = run.results.filter((r) => r.right).length;
    const next = nextStationAfter(run.station.id);
    const primary = next
      ? `<button type="button" class="btn btn--primary btn--grow" data-action="station" data-id="${esc(next.id)}">לתחנה הבאה${icon('arrowFwd', 20, 2.4)}</button>`
      : examUnlocked()
        ? `<button type="button" class="btn btn--primary btn--grow" data-action="exam">למבחן הדמה${icon('arrowFwd', 20, 2.4)}</button>`
        : '';
    show('summary', `<div class="screen screen--summary">
        ${topbar(run.station.name, 'סיכום התחנה', 'close', 'חזרה לתחנות', '')}
        <section class="hero hero--success">
          <div class="hero-top">
            <div class="hero-titles"><span class="hero-label">${esc(run.station.name)}</span><h1 class="hero-title">התחנה הושלמה!</h1></div>
            <span class="hero-badge">${icon('check', 26, 3)}</span>
          </div>
          <div class="hero-stats">
            <div><span class="hs-num" dir="ltr">${right}/${run.results.length}</span><span class="hs-label">תשובות נכונות</span></div>
            <div>${lives(run.lives, CFG.livesPerRun, true)}<span class="hs-label">${samplesLeftText(run.lives)}</span></div>
          </div>
          ${next ? `<p class="hero-caption">${run.lockedBefore[STATIONS.indexOf(next)] ? 'נפתחה תחנה חדשה' : 'התחנה הבאה'}: <b>${esc(next.name)}</b></p>` : ''}
        </section>
        ${resultList(run.results, 'הניסויים בתחנה')}
        <div class="actions actions--row">
          <button type="button" class="btn btn--ghost${primary ? '' : ' btn--grow'}" data-action="home">לתחנות</button>
          ${primary}
        </div>
      </div>`);
    announce(`התחנה הושלמה! ${right} מתוך ${run.results.length} נכונות`);
  }

  function renderRunFailed() {
    const right = run.results.filter((r) => r.right).length;
    const wrong = run.results.length - right;
    show('summary', `<div class="screen screen--summary">
        ${topbar(run.station.name, 'סיכום התחנה', 'close', 'חזרה לתחנות', '')}
        <section class="hero hero--fail">
          <div class="hazard" aria-hidden="true"></div>
          <div class="hero-fail-body">
            <span class="hazard-icon">${icon('flask', 28)}</span>
            <div class="hero-titles">
              <span class="hero-label hero-label--hazard">${esc(run.station.name)}</span>
              <h1 class="hero-title">כל הדגימות התקלקלו</h1>
              <span class="hero-sub">התחנה עוד לא הושלמה. קראו את ההסברים ונסו שוב.</span>
            </div>
          </div>
          <div class="hero-stats hero-stats--fail">
            <div><span class="hs-num" dir="ltr">${right}</span><span class="hs-label">נכונות</span></div>
            <div><span class="hs-num hs-num--red" dir="ltr">${wrong}</span><span class="hs-label">טעויות</span></div>
          </div>
        </section>
        ${resultList(run.results, 'מה עניתם')}
        <div class="actions actions--row">
          <button type="button" class="btn btn--ghost" data-action="home">לתחנות</button>
          <button type="button" class="btn btn--primary btn--grow" data-action="station" data-id="${esc(run.station.id)}">${icon('loop', 20, 2.4)}נסו שוב את התחנה</button>
        </div>
      </div>`);
    announce('כל הדגימות התקלקלו. נסו שוב את התחנה.');
  }

  function renderReviewSummary() {
    const cleaned = run.results.filter((r) => r.right).length;
    const left = state.mistakes.length;
    show('summary', `<div class="screen screen--summary">
        ${topbar('ניקוי דגימות', 'סיכום', 'close', 'חזרה למעבדה', '')}
        <section class="hero hero--success">
          <div class="hero-top">
            <div class="hero-titles"><span class="hero-label">ניקוי דגימות</span><h1 class="hero-title">${cleaned ? 'הניקוי הסתיים' : 'עוד לא נוקו'}</h1></div>
            <span class="hero-badge">${icon(cleaned ? 'check' : 'loop', 26, 3)}</span>
          </div>
          <div class="hero-stats">
            <div><span class="hs-num" dir="ltr">${cleaned}/${run.results.length}</span><span class="hs-label">דגימות נוקו</span></div>
            <div><span class="hs-num${left ? ' hs-num--yellow' : ''}" dir="ltr">${left}</span><span class="hs-label">עוד מחכות לתיקון</span></div>
          </div>
        </section>
        ${resultList(run.results, 'הדגימות שבדקתם')}
        <div class="actions actions--row">
          ${left ? '<button type="button" class="btn btn--ghost" data-action="review">עוד סבב</button>' : ''}
          <button type="button" class="btn btn--primary btn--grow" data-action="home">חזרה למעבדה</button>
        </div>
      </div>`);
    announce(`נוקו ${cleaned} מתוך ${run.results.length} דגימות`);
  }

  /* ================================================================
   * Mock exam
   * ================================================================ */

  function startExam() {
    if (!examUnlocked()) return;
    const qs = examQuestions();
    run = { mode: 'exam', questions: qs, index: 0, answers: qs.map(() => null), results: [], timer: null };
    // The exam clock is on unless the student turned "מבחן הדמה על זמן" off.
    if (state.examTimed) run.timer = createTimer(qs.length * CFG.examSecondsPerQuestion, updateStrip, () => submitExam(true));
    renderExamQuestion();
    if (run.timer) run.timer.start();
  }

  // Like the real exam: questions from every station, in station (lesson) order, easy → hard
  // within a station. Stations take turns (in random order) so all of them are represented, and
  // each station's turns go round its levels, so it gives an easy, a medium and a hard one.
  function examQuestions() {
    const pools = shuffle(playableStations().map((st) => {
      const byLevel = shuffle([1, 2, 3].map((level) => shuffle(stationQuestions(st.id).filter((q) => q.level === level))));
      const pool = [];
      while (byLevel.some((l) => l.length)) byLevel.forEach((l) => { if (l.length) pool.push(l.pop()); });
      return pool;
    }));
    const picked = [];
    for (let turn = 0; picked.length < examSize() && pools.some((p) => p.length); turn++) {
      const pool = pools[turn % pools.length];
      if (pool.length) picked.push(pool.shift());
    }
    const stationOrder = (q) => STATIONS.findIndex((st) => st.id === q.station);
    return picked.sort((a, b) => stationOrder(a) - stationOrder(b) || a.level - b.level);
  }

  function answeredCount() {
    return run.answers.filter((a) => a != null).length;
  }

  function renderExamQuestion() {
    const q = run.questions[run.index];
    const n = run.questions.length;
    const last = run.index === n - 1;
    const submitSmall = '<button type="button" class="btn btn--small" data-action="exam-submit">הגשה</button>';
    show('question', `<div class="screen screen--question screen--exam">
        ${topbar('מכינים את התרופה', `שאלה ${run.index + 1} מתוך ${n}`, 'close', 'יציאה מהמבחן', submitSmall)}
        <div id="exam-segments">${segments(n, run.index, (i) => run.answers[i] != null)}</div>
        ${run.timer ? timerStrip(`עניתם על ${answeredCount()} מתוך ${n}`, 'זמן למבחן') : progressStrip(answeredCount(), n)}
        ${questionCard(q, `מבחן דמה · שאלה ${pad2(run.index + 1)}`, levelChip(q.level))}
        ${optionsList(q, run.answers[run.index])}
        <div class="actions actions--row">
          <button type="button" class="btn btn--ghost" data-action="exam-prev" ${run.index === 0 ? 'disabled' : ''}>${icon('arrowBack', 20, 2.4)}הקודמת</button>
          ${last
            ? `<button type="button" class="btn btn--primary btn--grow" data-action="exam-submit">הגשת המבחן${icon('send', 20, 2.4)}</button>`
            : `<button type="button" class="btn btn--primary btn--grow" data-action="exam-next">הבאה${icon('arrowFwd', 20, 2.4)}</button>`}
        </div>
      </div>`);
    if (run.timer) updateStrip(run.timer.left());
  }

  function updateExamProgress() {
    const n = run.questions.length;
    const text = document.getElementById('strip-text');
    if (text) text.textContent = `עניתם על ${answeredCount()} מתוך ${n}`;
    const bar = document.getElementById('answered-bar');
    if (bar) bar.style.width = `${(100 * answeredCount()) / n}%`;
    const seg = document.getElementById('exam-segments');
    if (seg) seg.innerHTML = segments(n, run.index, (i) => run.answers[i] != null);
  }

  function examMove(step) {
    const target = run.index + step;
    if (target < 0 || target >= run.questions.length) return;
    run.index = target;
    renderExamQuestion();
  }

  function askSubmitExam() {
    const missing = run.questions.length - answeredCount();
    if (!missing) {
      submitExam(false);
      return;
    }
    openSheet({
      title: 'להגיש את המבחן?',
      body: `<p class="sheet-text">${missing === 1 ? 'נשארה שאלה אחת בלי תשובה.' : `נשארו ${missing} שאלות בלי תשובה.`} שאלה בלי תשובה נחשבת טעות.</p>
        <div class="sheet-actions">
          <button type="button" class="btn btn--primary btn--grow" data-action="exam-confirm">הגשה</button>
          <button type="button" class="btn btn--ghost btn--grow" data-action="sheet-close">חזרה למבחן</button>
        </div>`
    });
  }

  function submitExam(auto) {
    if (!run || run.mode !== 'exam' || run.ended) return;
    if (run.timer) run.timer.stop();
    if (sheet) closeSheet();
    run.ended = true;
    run.results = run.questions.map((q, i) => ({ q, chosen: run.answers[i], right: run.answers[i] === q.answer }));
    run.results.forEach((r) => recordAnswer(r.q, r.right, false));
    const right = run.results.filter((r) => r.right).length;
    const score = Math.round((100 * right) / run.results.length);
    const prevBest = state.examBest;
    state.examBest = prevBest == null ? score : Math.max(prevBest, score);
    save();
    run.exam = { right, score, prevBest, auto };
    renderExamResult();
    play(score >= 60 ? 'success' : 'fail');
    if (score >= 60) confetti();
  }

  function renderExamResult() {
    const e = run.exam;
    const total = run.results.length;
    const newBest = e.prevBest == null || e.score > e.prevBest;
    show('summary', `<div class="screen screen--summary">
        ${topbar('מכינים את התרופה', 'תוצאות המבחן', 'close', 'חזרה למעבדה', '')}
        <section class="hero hero--exam">
          ${e.auto ? '<span class="hero-label hero-label--hazard">הזמן נגמר, המבחן הוגש</span>' : '<span class="hero-label">המבחן הוגש</span>'}
          <h1 class="sr-only">תוצאות המבחן: ${e.score}%</h1>
          <span class="score" dir="ltr" aria-hidden="true">${e.score}%</span>
          <span class="score-sub">${e.right} מתוך ${total} נכונות</span>
          <span class="best-chip${newBest ? ' is-new' : ''}">${newBest ? `${icon('trophy', 16)}שיא חדש!` : `השיא שלכם: <bdi dir="ltr">${state.examBest}%</bdi>`}</span>
        </section>
        ${resultList(run.results, 'כל השאלות')}
        <div class="actions actions--row">
          <button type="button" class="btn btn--ghost" data-action="exam">מבחן חדש</button>
          <button type="button" class="btn btn--primary btn--grow" data-action="home">חזרה למעבדה</button>
        </div>
      </div>`);
    announce(`${e.auto ? 'הזמן נגמר. ' : ''}ציון: ${e.score}%. ${e.right} מתוך ${total} נכונות.`);
  }

  /* ================================================================
   * Victory
   * ================================================================ */

  function renderVictory(focus) {
    show('victory', `<div class="screen screen--victory">
        <section class="victory">
          <span class="victory-badge">${icon('flask', 40, 2)}</span>
          <h1 class="victory-title">עצרתם את ההתפרצות!</h1>
          <p class="victory-sub">${state.round > 1 ? `סיימתם את סבב ${state.round}. ` : ''}התרופה מוכנה. כל הכבוד!</p>
          ${mapSvg(0.6, true)}
          <div class="victory-stats">
            <div><span class="vs-num" dir="ltr">${masteredIn(QUESTIONS)}</span><span class="vs-label">שאלות נפתרו</span></div>
            <div><span class="vs-num" dir="ltr">${state.bestStreak}</span><span class="vs-label">השיא ברצף</span></div>
            <div><span class="vs-num" dir="ltr">${Math.max(1, state.daysPlayed.length)}</span><span class="vs-label">ימים</span></div>
          </div>
        </section>
        <p class="victory-next">${newRoundSub()}</p>
        <div class="actions">
          <button type="button" class="btn btn--primary btn--big" data-action="new-round">${icon('loop', 20, 2.4)}מתחילים מחדש עם שאלות חדשות</button>
          <button type="button" class="btn btn--ghost btn--big" data-action="home">חזרה למעבדה</button>
        </div>
      </div>`, focus);
    play('victory');
    confetti();
    window.setTimeout(confetti, 450);
  }

  /* ================================================================
   * Sheets (bottom dialogs)
   * ================================================================ */

  let sheet = null; // { el, onClose, returnFocus }

  function openSheet(opts) {
    const returnFocus = sheet ? sheet.returnFocus : document.activeElement;
    if (sheet) closeSheet(true);
    const el = document.createElement('div');
    el.className = 'sheet-backdrop';
    el.innerHTML = `<div class="sheet${opts.wide ? ' sheet--wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div class="sheet-grip" aria-hidden="true"></div>
        <div class="sheet-head">
          <h2 class="sheet-title" id="sheet-title" tabindex="-1">${esc(opts.title)}</h2>
          <button type="button" class="icon-btn icon-btn--small" data-action="sheet-close" aria-label="סגירה">${icon('close', 18, 2.4)}</button>
        </div>
        <div class="sheet-body">${opts.body}</div>
      </div>`;
    el.addEventListener('click', (e) => { if (e.target === el) closeSheet(); });
    sheetRoot.appendChild(el);
    sheetShownAt = performance.now();
    app.inert = true;
    sheet = { el, onClose: opts.onClose, returnFocus };
    guardHistory();
    const first = el.querySelector(opts.focus || '#sheet-title');
    if (first) first.focus({ preventScroll: true });
  }

  // `replacing`: another sheet opens right away, so focus is not returned yet.
  function closeSheet(replacing) {
    if (!sheet) return;
    const s = sheet;
    sheet = null;
    s.el.remove();
    screenShownAt = performance.now();
    app.inert = false;
    if (s.onClose) s.onClose();
    if (!replacing && s.returnFocus && document.contains(s.returnFocus)) s.returnFocus.focus({ preventScroll: true });
  }

  // Keep keyboard focus inside the open sheet; Escape closes it.
  document.addEventListener('keydown', (e) => {
    if (!sheet) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = Array.from(sheet.el.querySelectorAll('button:not([disabled]), textarea, [href], [tabindex="0"]'));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    // Focus on the title (tabindex -1) or on <body> is not in the list: wrap from there too.
    const inside = items.includes(document.activeElement);
    if (e.shiftKey && (document.activeElement === first || !inside)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
      e.preventDefault();
      first.focus();
    }
  });

  function openHint() {
    const q = run.questions[run.index];
    run.hintUsed = true;
    const btn = app.querySelector('[data-action="hint"]');
    if (btn) btn.classList.add('is-used');
    openSheet({
      title: 'רמז',
      body: `<div class="hint-box"><span class="why-icon">${icon('bulb', 22)}</span><p>${fmt(q.hint)}</p></div>
        <div class="sheet-actions"><button type="button" class="btn btn--primary btn--grow" data-action="sheet-close">הבנתי, חוזרים לניסוי</button></div>`
    });
  }

  function openExitConfirm() {
    const exam = run.mode === 'exam';
    const current = run;
    // The station clock pauses while deciding; the exam clock keeps running.
    if (!exam && current.timer) current.timer.hold('confirm');
    openSheet({
      title: exam ? 'לצאת מהמבחן?' : 'לצאת מהניסוי?',
      body: `<p class="sheet-text">${exam ? 'התשובות שסימנתם לא יישמרו.' : 'ההתקדמות בתחנה תאבד.'}</p>
        <div class="sheet-actions">
          <button type="button" class="btn btn--danger btn--grow" data-action="confirm-exit">${exam ? 'יציאה מהמבחן' : 'יציאה מהתחנה'}</button>
          <button type="button" class="btn btn--primary btn--grow" data-action="sheet-close">${exam ? 'חזרה למבחן' : 'ממשיכים בניסוי'}</button>
        </div>`,
      onClose: () => { if (!exam && current.timer) current.timer.release('confirm'); }
    });
  }

  function openExplain(index) {
    const r = run && run.results[index];
    if (!r) return;
    const q = r.q;
    const verdict = r.right
      ? `<p class="verdict is-right">${icon('checkCircle', 18, 2.2)}<span>עניתם נכון: ${answerInline(q.options[q.answer])}</span></p>`
      : compareBoxes(q, r.chosen);
    openSheet({
      title: `${run.mode === 'exam' ? 'שאלה' : 'ניסוי'} ${pad2(index + 1)}`,
      wide: true,
      body: `<p class="explain-prompt">${fmt(q.prompt)}</p>
        ${q.context ? `<p class="qcontext">${fmt(q.context)}</p>` : ''}
        ${codeBlock(q.code)}
        ${verdict}
        ${stepsFull(q)}
        ${r.right ? '' : whyWrongCard(q, r.chosen)}
        <div class="sheet-actions">
          <button type="button" class="btn btn--ghost btn--grow" data-action="try-r" data-qid="${esc(q.id)}">${icon('terminal', 20)}נסו ב-R</button>
          <button type="button" class="btn btn--primary btn--grow" data-action="sheet-close">סגירה</button>
        </div>`
    });
  }

  function openAbout() {
    openSheet({
      title: 'איך משחקים?',
      body: `<ul class="bullets" role="list">
          <li>כל ניסוי במעבדה הוא שאלה בסגנון המבחן: קוד R קצר, ואתם בוחרים מה יהיה הפלט.</li>
          <li>תשובה נכונה מקדמת את התרופה ומאטה את ההתפשטות. טעות עולה בדגימה, ובכל תחנה יש ${CFG.livesPerRun} דגימות.</li>
          <li>אחרי כל תשובה יש הסבר צעד אחר צעד, ואפשר לנסות את הקוד ב-R.</li>
          <li>כל התחנות פתוחות: מתרגלים מה שרוצים, באיזה סדר שרוצים. השאלות שטעיתם בהן מחכות ב"ניקוי דגימות".</li>
          <li>מבחן הדמה כולל שאלות מכל התחנות, והוא על זמן כמו המבחן האמיתי (אפשר לכבות את השעון כאן למטה).</li>
          <li>כשכל התחנות הושלמו, התרופה מוכנה. אחר כך אפשר להתחיל מחדש עם שאלות חדשות: בכל תחנה יש הרבה יותר שאלות ממה שמופיע בסבב אחד.</li>
          <li>רוצים שעון גם בתחנות? הפעילו את "מצב זמן בתחנות": לכל שאלה יש שעון, ושאלה שהזמן שלה נגמר נחשבת טעות.</li>
        </ul>
        <div class="setting">
          <span class="setting-text"><span class="setting-name" id="exam-timed-name">מבחן הדמה על זמן</span><span class="setting-sub" id="exam-timed-sub">${examMinutes()} דקות ל-${examSize()} שאלות, כמו במבחן</span></span>
          <button type="button" class="switch" role="switch" aria-checked="${state.examTimed}" aria-labelledby="exam-timed-name" aria-describedby="exam-timed-sub" data-action="exam-timed"><span class="switch-knob"></span></button>
        </div>
        <div class="setting">
          <span class="setting-text"><span class="setting-name" id="time-mode-name">מצב זמן בתחנות</span><span class="setting-sub" id="time-mode-sub">שעון לכל שאלה בתחנות</span></span>
          <button type="button" class="switch" role="switch" aria-checked="${state.timeMode}" aria-labelledby="time-mode-name" aria-describedby="time-mode-sub" data-action="time-mode"><span class="switch-knob"></span></button>
        </div>
        <div class="setting">
          <span class="setting-text"><span class="setting-name">צלילים</span><span class="setting-sub">צפצופים קטנים בתשובות</span></span>
          <button type="button" class="switch" role="switch" aria-checked="${state.sound}" aria-label="צלילים" data-action="sound"><span class="switch-knob"></span></button>
        </div>
        <div class="setting setting--reset" id="reset-area">
          <span class="setting-text"><span class="setting-name">איפוס ההתקדמות</span><span class="setting-sub">מוחק את כל מה ששמרנו במכשיר הזה</span></span>
          <button type="button" class="btn btn--danger btn--small" data-action="reset-ask">איפוס</button>
        </div>
        <p class="credit">השאלות מבוססות על חומר התרגולים של שבועות <bdi dir="ltr">1–7</bdi>.</p>`
    });
  }

  function askReset() {
    const area = document.getElementById('reset-area');
    if (!area) return;
    area.classList.add('is-confirming');
    sheetShownAt = performance.now(); // "כן, לאפס" appears where "איפוס" was
    area.innerHTML = `<p class="setting-warn">${icon('warning', 18)}בטוחים? כל ההתקדמות תימחק, ואי אפשר לבטל.</p>
      <div class="sheet-actions">
        <button type="button" class="btn btn--ghost btn--grow" data-action="reset-cancel">ביטול</button>
        <button type="button" class="btn btn--danger btn--grow" data-action="reset-confirm">כן, לאפס</button>
      </div>`;
    area.querySelector('[data-action="reset-cancel"]').focus();
  }

  function resetProgress() {
    const { sound, timeMode, examTimed } = state; // settings survive a reset
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Nothing saved anyway.
    }
    if (run && run.timer) run.timer.stop();
    run = null;
    state = defaultState();
    state.sound = sound;
    state.timeMode = timeMode;
    state.examTimed = examTimed;
    touchToday();
    save();
    if (sheet) closeSheet(true);
    renderHome();
    toast('ההתקדמות אופסה');
  }

  function toggleSound() {
    state.sound = !state.sound;
    save();
    ensureAudio();
    document.querySelectorAll('[data-action="sound"]').forEach((b) => {
      if (b.getAttribute('role') === 'switch') {
        b.setAttribute('aria-checked', String(state.sound));
      } else {
        b.setAttribute('aria-pressed', String(state.sound));
        b.innerHTML = icon(state.sound ? 'soundOn' : 'soundOff', 20);
      }
    });
    play('select');
    announce(state.sound ? 'הצלילים פועלים' : 'הצלילים כבויים');
  }

  // "מצב זמן בתחנות". It applies from the next question (the switch lives on the home screen's sheet).
  function toggleTimeMode() {
    state.timeMode = !state.timeMode;
    save();
    document.querySelectorAll('[data-action="time-mode"]').forEach((b) => b.setAttribute('aria-checked', String(state.timeMode)));
    play('select');
    announce(state.timeMode ? 'מצב זמן בתחנות פועל: לכל שאלה יש שעון.' : 'מצב זמן בתחנות כבוי: אין שעון בתחנות.');
  }

  const examMinutes = () => Math.round((examSize() * CFG.examSecondsPerQuestion) / 60);

  // "מבחן הדמה על זמן". It applies from the next exam.
  function toggleExamTimed() {
    state.examTimed = !state.examTimed;
    save();
    document.querySelectorAll('[data-action="exam-timed"]').forEach((b) => b.setAttribute('aria-checked', String(state.examTimed)));
    const sub = app.querySelector('.station--exam .st-topic');
    if (sub) sub.textContent = examSub(examSize());
    play('select');
    announce(state.examTimed ? `מבחן הדמה על זמן: ${examMinutes()} דקות.` : 'מבחן הדמה בלי שעון.');
  }

  /* ================================================================
   * "נסו ב-R": run the code with webR (loaded lazily), or copy it
   * ================================================================ */

  let webRPromise = null;

  function loadWebR() {
    if (!webRPromise) {
      const load = (async () => {
        let mod;
        try {
          mod = await import('https://webr.r-wasm.org/v0.4.2/webr.mjs');
        } catch (e) {
          mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
        }
        const webR = new mod.WebR();
        await webR.init();
        return webR;
      })();
      const timeout = new Promise((resolve, reject) => window.setTimeout(() => reject(new Error('timeout')), 60000));
      webRPromise = Promise.race([load, timeout]).catch((err) => {
        webRPromise = null; // allow another try later
        throw err;
      });
    }
    return webRPromise;
  }

  function openTryR(q) {
    const rows = clamp(q.code.split('\n').length + 1, 4, 12);
    openSheet({
      title: 'נסו ב-R',
      wide: true,
      body: `<p class="sheet-text">אפשר לשנות את הקוד ולהריץ שוב. מה R מדפיס?</p>
        <label class="sr-only" for="r-code">קוד R</label>
        <textarea id="r-code" class="r-code" dir="ltr" rows="${rows}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(q.code)}</textarea>
        <div class="sheet-actions">
          <button type="button" class="btn btn--primary btn--grow" data-action="r-run">${icon('play', 18, 2.4)}הרצה</button>
          <button type="button" class="btn btn--ghost btn--grow" data-action="r-copy">${icon('copy', 18)}העתקת הקוד</button>
        </div>
        <div class="r-status" id="r-status" role="status" aria-live="polite"></div>
        <pre class="r-out" id="r-out" dir="ltr" hidden></pre>`
    });
  }

  function setRStatus(html, kind, box) {
    const el = (box || document).querySelector('#r-status');
    if (!el) return;
    el.className = `r-status${kind ? ` is-${kind}` : ''}`;
    el.innerHTML = html;
  }

  const focusLost = () => !document.activeElement || document.activeElement === document.body;

  async function runR() {
    // Everything is tied to this sheet: if it closes while R loads, a later sheet is left alone.
    const box = sheet && sheet.el;
    const codeEl = box && box.querySelector('#r-code');
    const btn = box && box.querySelector('[data-action="r-run"]');
    const out = box && box.querySelector('#r-out');
    if (!codeEl || !btn || !out) return;
    const code = codeEl.value;
    btn.disabled = true;
    setRStatus('<span class="spinner" aria-hidden="true"></span>טוענים את R… (בפעם הראשונה זה לוקח כמה שניות)', 'loading', box);

    let webR;
    try {
      webR = await loadWebR();
    } catch (e) {
      if (!box.isConnected) return;
      btn.disabled = false;
      setRStatus(`${icon('warning', 18)}<span>לא הצלחנו לטעון את R כאן (אולי אין חיבור לאינטרנט). העתיקו את הקוד והריצו אותו ב-RStudio.</span>`, 'error', box);
      // Copying is now the main way forward: swap the button styles.
      const copy = box.querySelector('[data-action="r-copy"]');
      if (copy) copy.classList.replace('btn--ghost', 'btn--primary');
      btn.classList.replace('btn--primary', 'btn--ghost');
      // Disabling the focused button dropped focus to <body>: put it on the next step.
      if (copy && focusLost()) copy.focus();
      return;
    }

    let lines = [];
    let shelter = null;
    try {
      shelter = await new webR.Shelter();
      const res = await shelter.captureR(code, { withAutoprint: true, captureStreams: true, captureConditions: false });
      lines = res.output.filter((o) => o.type === 'stdout' || o.type === 'stderr');
    } catch (err) {
      lines = [{ type: 'stderr', data: `Error: ${err && err.message ? err.message : err}` }];
    } finally {
      if (shelter) shelter.purge();
    }
    if (!box.isConnected) return; // the sheet was closed meanwhile
    btn.disabled = false;
    if (focusLost()) btn.focus();
    setRStatus('', '', box);
    out.hidden = false;
    out.innerHTML = lines.length
      ? lines.map((l) => `<span class="${l.type === 'stderr' ? 'r-err' : ''}">${esc(l.data)}</span>`).join('\n')
      : '<span class="r-dim"># אין פלט</span>';
    announce('הקוד רץ. הפלט מוצג למטה.');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback for file:// pages and older browsers.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.className = 'copy-helper';
      (sheet ? sheet.el : document.body).appendChild(ta);
      const prev = document.activeElement;
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e2) {
        ok = false;
      }
      ta.remove();
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true });
      return ok;
    }
  }

  async function copyCode(btn) {
    const codeEl = document.getElementById('r-code');
    if (!codeEl) return;
    const ok = await copyText(codeEl.value);
    if (ok) {
      btn.innerHTML = `${icon('check', 18, 2.6)}הקוד הועתק`;
      announce('הקוד הועתק. הדביקו אותו ב-RStudio.');
      window.setTimeout(() => { if (document.contains(btn)) btn.innerHTML = `${icon('copy', 18)}העתקת הקוד`; }, 2200);
    } else if (document.contains(codeEl)) {
      codeEl.focus();
      codeEl.select();
      setRStatus('לא הצלחנו להעתיק אוטומטית. הקוד מסומן: העתיקו אותו ידנית.', 'error');
    }
  }

  /* ================================================================
   * Click handling (one delegated listener for the app and sheets)
   * ================================================================ */

  const ACTIONS = {
    station: (el) => startStation(el.dataset.id),
    locked: (el) => toast(el.dataset.message),
    review: () => startReview(),
    exam: () => startExam(),
    home: () => goHome(true),
    about: () => openAbout(),
    sound: () => toggleSound(),
    'time-mode': () => toggleTimeMode(),
    'exam-timed': () => toggleExamTimed(),
    exit: () => requestExit(),
    pick: (el) => pickOption(Number(el.dataset.index)),
    hint: () => openHint(),
    submit: () => submitAnswer(false),
    next: () => nextAfterFeedback(),
    'exam-prev': () => examMove(-1),
    'exam-next': () => examMove(1),
    'exam-submit': () => askSubmitExam(),
    'exam-confirm': () => submitExam(false),
    explain: (el) => openExplain(Number(el.dataset.index)),
    'try-r': (el) => {
      const q = el.dataset.qid ? Q_BY_ID.get(el.dataset.qid) : run && run.feedback && run.feedback.q;
      if (q) openTryR(q);
    },
    'r-run': () => runR(),
    'r-copy': (el) => copyCode(el),
    'sheet-close': () => closeSheet(),
    'confirm-exit': () => {
      closeSheet(true);
      goHome();
    },
    'new-round-ask': () => askNewRound(),
    'new-round': () => newRound(),
    'reset-ask': () => askReset(),
    'reset-cancel': () => openAbout(),
    'reset-confirm': () => resetProgress()
  };

  // Capture phase, so it also stops the sheet backdrop's own click handler.
  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target || !(target.closest('[data-action]') || target.classList.contains('sheet-backdrop'))) return;
    const now = performance.now();
    const fresh = (app.contains(target) && now - screenShownAt < TAP_GUARD_MS) ||
      (sheetRoot.contains(target) && now - sheetShownAt < TAP_GUARD_MS);
    // e.detail > 1: the 2nd click of a double click/tap, never a deliberate new action.
    if (fresh || e.detail > 1) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const action = ACTIONS[el.dataset.action];
    if (action) action(el, e);
  });

  /* ================================================================
   * Start
   * ================================================================ */

  // Hooks for automated tests.
  window.__outbreak = {
    reset() {
      resetProgress();
    },
    state() {
      return JSON.parse(JSON.stringify(state));
    }
  };

  goHome(false);
}());
