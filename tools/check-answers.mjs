#!/usr/bin/env node
/*
 * Checks the question bank against real R.
 *
 *   node tools/check-answers.mjs                 (checks js/questions.js)
 *   node tools/check-answers.mjs other-file.js   (checks another file in the same format)
 *
 * Needs Node 18+ and R (Rscript on the PATH, or set RSCRIPT=/path/to/Rscript; see README.md).
 *
 * For every question it:
 *   - checks the fields the same way the game does (a question the game would skip is reported here):
 *     id is a string, station exists, 4 options that are non-empty strings, answer 0-3, an explanation
 *     for every wrong option, explanation steps and their pictures are well formed, `backticks` are paired...
 *   - runs the code in R (at most 20 seconds) and checks that the right option matches what R prints
 *   - checks that no wrong option also matches what R prints
 *   - reports any R warning or message (students would see it too), unless the question allows it with `warning`
 *   - checks that what the game shows as R's output is exactly what R prints: the last `output` step of the
 *     explanation or, when there is no output step, "[1] " + the right option (the game's fallback)
 *
 * If the right answer is an error, write the option with the word Error, for example 'שגיאה (Error)'
 * (or set `expectError: true`). The check then passes when R stops with an error, and the question needs an
 * `output` step with R's exact error message, so a typo in the code can't pass as the intended error.
 * A syntax error ("Error: unexpected ...") is reported unless that output step shows it.
 *
 * Optional fields the checker reads:
 *   manual: true       the code is run but the options are not compared to R (only when the right option is
 *                      Hebrew text that can't be compared to R's output)
 *   warning: true      R may print a warning or message for this question (students will see it too)
 *   warning: 'text'    the same, but only a warning or message that contains this text is accepted
 *   expectError: true  the right answer is an R error (needed only if the option doesn't contain the word Error)
 *   expectError: false the right answer is not an error, even though the option contains the word Error
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
const questionsFile = process.argv[2] || join(root, 'js/questions.js');
vm.runInContext(readFileSync(join(root, 'js/config.js'), 'utf8'), sandbox, { filename: 'js/config.js' });
vm.runInContext(readFileSync(questionsFile, 'utf8'), sandbox, { filename: questionsFile });
const config = sandbox.window.GAME_CONFIG;
const questions = sandbox.window.GAME_QUESTIONS;
const rscript = process.env.RSCRIPT || 'Rscript';
const TIMEOUT_SECONDS = 20;

if (!Array.isArray(questions)) {
  console.error(`${questionsFile} must set window.GAME_QUESTIONS = [ ... ];`);
  process.exit(1);
}

const normalize = (text) =>
  String(text)
    .split('\n')
    .map((line) => line.replace(/^\s*\[\d+\]\s?/, ''))
    .join(' ')
    .replace(/("(?:[^"\\]|\\.)*")|\s+/g, (m, str) => str ?? ' ')
    .trim();

const exact = (text) =>
  String(text)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');

const isObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const isText = (x) => typeof x === 'string' && x.trim() !== '';
// Same as js/app.js: an option with Hebrew letters is text, not R output.
const isTextOption = (opt) => /[\u0590-\u05FF]/.test(opt);
// Same as printedOutput() in js/app.js: what the game shows as R's output.
const appOutput = (q) => {
  const outputs = q.explanation.filter((s) => isObject(s) && typeof s.output === 'string');
  if (outputs.length) return { text: outputs[outputs.length - 1].output, fromStep: true };
  const right = q.options[q.answer];
  return { text: isTextOption(right) ? '' : `[1] ${right}`, fromStep: false };
};
const backticksOdd = (text) => typeof text === 'string' && (text.match(/`/g) || []).length % 2 === 1;

const problems = [];
const stationIds = new Set(config.stations.map((s) => s.id));
const seenIds = new Set();
// Without a UTF-8 locale R escapes non-English letters in strings (\303\251 instead of é).
// Windows R is UTF-8 already; on Linux and macOS pick a UTF-8 locale if the shell has none.
const isUtf8 = /utf-?8/i.test(process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG || '');
const utf8Locale = { linux: 'C.UTF-8', darwin: 'en_US.UTF-8' }[process.platform];
const rEnv = isUtf8 || !utf8Locale ? process.env : { ...process.env, LC_ALL: utf8Locale };

const version = spawnSync(rscript, ['--version'], { encoding: 'utf8', env: rEnv, timeout: 60000 });
if (version.error || version.status !== 0) {
  console.error(`Could not run R with "${rscript}"${version.error ? ` (${version.error.message})` : ''}.\n` +
    'Install R, then either add its bin folder to the PATH or set RSCRIPT to the full path of Rscript, for example\n' +
    '  Windows (cmd):         set RSCRIPT=C:\\Program Files\\R\\R-4.4.1\\bin\\Rscript.exe\n' +
    '  Windows (PowerShell):  $env:RSCRIPT = "C:\\Program Files\\R\\R-4.4.1\\bin\\Rscript.exe"\n' +
    '  macOS / Linux:         RSCRIPT=/usr/local/bin/Rscript node tools/check-answers.mjs');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'r-check-'));

try {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const label = isObject(q) && isText(q.id) ? q.id : `#${i + 1}`;
    const before = problems.length;
    const report = (message) => problems.push(`[${label}] ${message}`);
    const line = (tag, text) => console.log(`${problems.length > before ? 'FAIL' : tag} ${label}: ${text}`);

    if (!isObject(q)) {
      report('not a question object (an empty slot ",," or a stray value in the list?)');
      line('FAIL', 'skipped');
      continue;
    }
    if (typeof q.id !== 'string' || !q.id.trim()) report('id must be a non-empty string in quotes');
    else if (seenIds.has(q.id)) report('duplicate id');
    seenIds.add(q.id);
    if (!stationIds.has(q.station)) report(`unknown station "${q.station}"`);
    if (![1, 2, 3].includes(q.level)) report('level must be 1, 2 or 3');
    if (!isText(q.code)) report('missing code (it must be a string)');
    const optionsOk = Array.isArray(q.options) && q.options.length === 4;
    if (!optionsOk) report('needs exactly 4 options');
    else if (!q.options.every(isText)) report('every option must be a non-empty string in quotes');
    const answerOk = Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3;
    if (!answerOk) report('answer must be 0, 1, 2 or 3');
    if (!isText(q.hint)) report('missing hint');
    if (q.prompt !== undefined && !isText(q.prompt)) report('prompt must be a non-empty string');
    if (q.context !== undefined && typeof q.context !== 'string') report('context must be a string');
    if (q.warning !== undefined && q.warning !== true && !isText(q.warning)) report('warning must be true or a piece of the warning text');
    if (q.expectError !== undefined && typeof q.expectError !== 'boolean') report('expectError must be true or false');
    if (!Array.isArray(q.explanation) || q.explanation.length === 0) report('missing explanation steps');
    const steps = Array.isArray(q.explanation) ? q.explanation : [];
    if (optionsOk) q.options.forEach((_, k) => {
      if (k !== q.answer && !(q.whyWrong && typeof q.whyWrong === 'object' && isText(q.whyWrong[k]))) report(`missing whyWrong for option ${'abcd'[k]}`);
    });
    if (optionsOk && q.options.every(isText)) {
      const norm = q.options.map(normalize);
      if (new Set(norm).size !== norm.length) report('two options are the same');
    }

    // Unpaired backticks break the code formatting of the text.
    const texts = [['hint', q.hint], ['prompt', q.prompt], ['context', q.context]];
    steps.forEach((s, k) => { if (isObject(s)) texts.push([`explanation step ${k + 1}`, s.text]); });
    if (q.whyWrong && typeof q.whyWrong === 'object') Object.entries(q.whyWrong).forEach(([k, w]) => texts.push([`whyWrong ${'abcd'[k] || k}`, w]));
    if (optionsOk) q.options.forEach((o, k) => { if (typeof o === 'string' && isTextOption(o)) texts.push([`option ${'abcd'[k]}`, o]); });
    texts.forEach(([where, text]) => { if (backticksOdd(text)) report(`${where} has an odd number of backticks (\`)`); });

    steps.forEach((s, k) => {
      const at = `explanation step ${k + 1}`;
      if (!isObject(s)) { report(`${at} is not a { text } object`); return; }
      if (!isText(s.text)) report(`${at} has no text`);
      const visuals = ['vector', 'table', 'output'].filter((v) => s[v] !== undefined);
      if (visuals.length > 1) report(`${at} has more than one visual`);
      if (s.output !== undefined && typeof s.output !== 'string') report(`${at}: output must be a string`);
      const v = s.vector;
      if (v !== undefined) {
        if (!isObject(v) || !Array.isArray(v.values)) report(`${at}: vector needs a values list`);
        else for (const f of ['marks', 'labels']) {
          if (v[f] === undefined) continue;
          if (!Array.isArray(v[f])) report(`${at}: vector ${f} must be a list`);
          else if (v[f].length !== v.values.length) report(`${at}: vector ${f} has ${v[f].length} items but values has ${v.values.length}`);
        }
      }
      const t = s.table;
      if (t !== undefined) {
        if (!isObject(t) || !Array.isArray(t.columns) || !Array.isArray(t.rows)) report(`${at}: table needs a columns list and a rows list`);
        else {
          if (t.rows.some((r) => !Array.isArray(r) || r.length !== t.columns.length)) report(`${at}: a table row does not have ${t.columns.length} cells`);
          if (t.rowNames !== undefined && (!Array.isArray(t.rowNames) || t.rowNames.length !== t.rows.length)) report(`${at}: rowNames and rows differ in length`);
          if (t.highlightRows !== undefined && (!Array.isArray(t.highlightRows) || t.highlightRows.some((r) => !(Number.isInteger(r) && r >= 0 && r < t.rows.length)))) report(`${at}: highlightRows out of range`);
        }
      }
    });

    if (!isText(q.code) || !optionsOk || !q.options.every(isText) || !answerOk) {
      line('FAIL', 'not run in R (fix the problems listed at the end first)');
      continue;
    }

    const file = join(dir, `q${i + 1}.R`);
    writeFileSync(file, q.code + '\n');
    const res = spawnSync(rscript, ['--vanilla', file], {
      encoding: 'utf8', env: rEnv, cwd: dir, timeout: TIMEOUT_SECONDS * 1000, killSignal: 'SIGKILL'
    });
    if ((res.error && res.error.code === 'ETIMEDOUT') || res.signal) {
      report(`R did not finish in ${TIMEOUT_SECONDS} seconds (an endless loop?)`);
      line('FAIL', 'timeout');
      continue;
    }
    if (res.error) { report(`could not run R: ${res.error.message}`); line('FAIL', 'R did not run'); continue; }
    const stdout = res.stdout.replace(/\r\n/g, '\n');
    const stderr = res.stderr.replace(/\r\n/g, '\n');
    const right = q.options[q.answer];
    const shown = appOutput({ ...q, explanation: steps });

    const expectsError = typeof q.expectError === 'boolean'
      ? q.expectError
      : !/^\s*"/.test(right) && /(^|[^A-Za-z])Error\b/.test(right);
    if (expectsError) {
      const errorLine = stderr.split('\n').find((l) => /^Error\b/.test(l)) || stderr.trim().split('\n')[0] || '';
      if (res.status === 0) {
        report(`the right option is an error, but R ran without one and printed:\n${stdout}`);
      } else {
        const rText = exact((stdout + stderr).replace(/\n?Execution halted\s*$/, ''));
        if (!shown.fromStep) {
          report(`the right answer is an error, so add an explanation step with output: R's exact message. R prints\n${rText}`);
        } else if (exact(shown.text) !== rText) {
          report(`explanation output is\n${exact(shown.text)}\nbut R prints\n${rText}`);
        }
        if (/^Error: unexpected /m.test(stderr) && !/unexpected /.test(shown.text)) {
          report(`R stopped on a syntax error (a typo in the code?):\n${errorLine}`);
        }
      }
      line('ok  ', `(error) ${errorLine}`);
      continue;
    }
    if (res.status !== 0) { report(`R error:\n${stderr}`); line('FAIL', '(R error)'); continue; }

    const warningText = stderr.trim();
    if (warningText && isText(q.warning) && !warningText.includes(q.warning)) {
      report(`R printed a warning or message without the text "${q.warning}" (the question's warning field):\n${warningText}`);
    } else if (warningText && q.warning === undefined) {
      report(`R also printed a warning or message (students see it too):\n${warningText}\n` +
        '(if that is intended, add warning: true to the question)');
    }
    if (q.warning !== undefined && !warningText) report('warning is set, but R printed no warning or message');

    // The console the game shows must be what R prints (the warning lines may be included).
    const printedForms = [exact(stdout)];
    if (warningText) printedForms.push(exact(exact(stdout) + '\n' + stderr));
    if (shown.text !== '' && !printedForms.includes(exact(shown.text))) {
      report(shown.fromStep
        ? `explanation output is\n${exact(shown.text)}\nbut R prints\n${exact(stdout)}`
        : `there is no explanation output step, so the game shows\n${exact(shown.text)}\nbut R prints\n${exact(stdout)}\n(add a step with output: exactly what R prints)`);
    }

    const printed = normalize(stdout);
    if (q.manual) {
      line('man ', `R printed: ${printed}  |  right option: ${right}`);
      continue;
    }
    if (printed !== normalize(right)) report(`R prints "${printed}" but the right option is "${normalize(right)}"`);
    q.options.forEach((opt, k) => {
      if (k !== q.answer && normalize(opt) === printed) report(`wrong option ${'abcd'[k]} is also what R prints`);
    });
    line('ok  ', printed);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log(`\nAll ${questions.length} questions match R.`);
