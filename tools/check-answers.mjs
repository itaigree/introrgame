#!/usr/bin/env node
/*
 * Checks the question bank against real R.
 *
 *   node tools/check-answers.mjs
 *
 * Needs Node 18+ and R (Rscript on the PATH, or set RSCRIPT=/path/to/Rscript).
 *
 * For every question it:
 *   - checks the fields (station exists, 4 options, valid answer, an explanation for every wrong option...)
 *   - runs the code in R and checks that the right option matches what R prints
 *   - checks that no wrong option also matches what R prints
 *   - reports any R warning or message (students would see it too)
 *   - checks that the last `output` step of the explanation is exactly what R prints
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
for (const file of ['js/config.js', 'js/questions.js']) {
  vm.runInContext(readFileSync(join(root, file), 'utf8'), sandbox, { filename: file });
}
const config = sandbox.window.GAME_CONFIG;
const questions = sandbox.window.GAME_QUESTIONS;
const rscript = process.env.RSCRIPT || 'Rscript';

const normalize = (text) =>
  String(text)
    .split('\n')
    .map((line) => line.replace(/^\s*\[\d+\]\s?/, ''))
    .join(' ')
    .replace(/("(?:[^"\\]|\\.)*")|\s+/g, (m, str) => str ?? ' ')
    .trim();

const exact = (text) =>
  String(text)
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');

const problems = [];
const report = (q, message) => problems.push(`[${q.id || '?'}] ${message}`);

const stationIds = new Set(config.stations.map((s) => s.id));
const seenIds = new Set();
// Without a UTF-8 locale R escapes non-English letters in strings (\303\251 instead of é).
// Windows R is UTF-8 already; on Linux and macOS pick a UTF-8 locale if the shell has none.
const isUtf8 = /utf-?8/i.test(process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG || '');
const utf8Locale = { linux: 'C.UTF-8', darwin: 'en_US.UTF-8' }[process.platform];
const rEnv = isUtf8 || !utf8Locale ? process.env : { ...process.env, LC_ALL: utf8Locale };
const dir = mkdtempSync(join(tmpdir(), 'r-check-'));

try {
  for (const q of questions) {
    if (!q.id) report(q, 'missing id');
    if (seenIds.has(q.id)) report(q, 'duplicate id');
    seenIds.add(q.id);
    if (!stationIds.has(q.station)) report(q, `unknown station "${q.station}"`);
    if (![1, 2, 3].includes(q.level)) report(q, 'level must be 1, 2 or 3');
    if (!Array.isArray(q.options) || q.options.length !== 4) report(q, 'needs exactly 4 options');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) report(q, 'answer is not a valid option index');
    if (!q.hint) report(q, 'missing hint');
    if (!Array.isArray(q.explanation) || q.explanation.length === 0) report(q, 'missing explanation steps');
    (q.options || []).forEach((_, i) => {
      if (i !== q.answer && !(q.whyWrong && q.whyWrong[i])) report(q, `missing whyWrong for option ${'abcd'[i]}`);
    });

    if (!q.code) report(q, 'missing code');
    if (Array.isArray(q.options)) {
      const norm = q.options.map(normalize);
      if (new Set(norm).size !== norm.length) report(q, 'two options are the same');
    }
    (q.explanation || []).forEach((s, k) => {
      const visuals = ['vector', 'table', 'output'].filter((v) => s[v]);
      if (visuals.length > 1) report(q, `explanation step ${k + 1} has more than one visual`);
      const v = s.vector;
      if (v) for (const f of ['marks', 'labels']) {
        if (v[f] && v[f].length !== v.values.length) report(q, `explanation step ${k + 1}: vector ${f} has ${v[f].length} items but values has ${v.values.length}`);
      }
      const t = s.table;
      if (t) {
        if (t.rows.some((r) => r.length !== t.columns.length)) report(q, `explanation step ${k + 1}: a table row does not have ${t.columns.length} cells`);
        if (t.rowNames && t.rowNames.length !== t.rows.length) report(q, `explanation step ${k + 1}: rowNames and rows differ in length`);
        if ((t.highlightRows || []).some((i) => !(i >= 0 && i < t.rows.length))) report(q, `explanation step ${k + 1}: highlightRows out of range`);
      }
    });
    if (!Array.isArray(q.options) || typeof q.options[q.answer] !== 'string' || !q.code) continue;

    const file = join(dir, `${q.id}.R`);
    writeFileSync(file, q.code + '\n');
    const res = spawnSync(rscript, ['--vanilla', file], { encoding: 'utf8', env: rEnv });
    if (res.error) { report(q, `could not run R: ${res.error.message}`); continue; }
    if (res.status !== 0) { report(q, `R error:\n${res.stderr}`); continue; }
    if (res.stderr.trim()) report(q, `R also printed a warning or message (students see it too):\n${res.stderr.trim()}`);
    const out = res.stdout;

    const printed = normalize(out);
    const right = normalize(q.options[q.answer]);
    if (printed !== right) report(q, `R prints "${printed}" but the right option is "${right}"`);
    q.options.forEach((opt, i) => {
      if (i !== q.answer && normalize(opt) === printed) report(q, `wrong option ${'abcd'[i]} is also what R prints`);
    });

    const outputs = (q.explanation || []).filter((s) => s.output);
    const last = outputs[outputs.length - 1];
    if (last && exact(last.output) !== exact(out)) {
      report(q, `explanation output is\n${exact(last.output)}\nbut R prints\n${exact(out)}`);
    }

    console.log(`${printed === right ? 'ok  ' : 'FAIL'} ${q.id}: ${printed}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log(`\nAll ${questions.length} questions match R.`);
