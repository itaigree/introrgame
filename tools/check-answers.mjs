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
 *   - checks that the last `output` step of the explanation is exactly what R prints
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
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
    .replace(/\s+/g, ' ')
    .trim();

const exact = (text) =>
  String(text)
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .trim();

const problems = [];
const report = (q, message) => problems.push(`[${q.id || '?'}] ${message}`);

const stationIds = new Set(config.stations.map((s) => s.id));
const seenIds = new Set();
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

    const file = join(dir, `${q.id}.R`);
    writeFileSync(file, q.code + '\n');
    let out;
    try {
      out = execFileSync(rscript, ['--vanilla', file], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      report(q, `R error:\n${err.stderr || err.message}`);
      continue;
    }

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
