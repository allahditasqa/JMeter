#!/usr/bin/env node
/*
 * Runs each JMeter plan (= module) in non-GUI mode and writes module-wise reports from the REAL .jtl results.
 * One test case = one sampler (its name starts with the case ID); it passes when the sampler had no error.
 *
 *   node tools/run-jmeter.js            smoke + load (short profile)
 *   node tools/run-jmeter.js smoke
 * The JMeter binary is taken from the JMETER environment variable, or "jmeter" from the PATH.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { parseDocs, parseCsv, ROOT } = require('./docs');
const { writeRun } = require('./report-lib');

const JMETER = process.env.JMETER || 'jmeter';
const PLANS = {
  smoke: { module: 'Smoke', props: [] },
  load: { module: 'Load', props: ['-Jthreads=3', '-Jrampup=3', '-Jduration=20', '-Jthinktime=1000'] },
};
const wanted = process.argv.slice(2);
const plans = Object.keys(PLANS).filter((p) => !wanted.length || wanted.includes(p));
const docCases = parseDocs().flatMap((d) => d.cases);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jmeter-'));
const started = new Date();
const modules = [];
const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];

for (const plan of plans) {
  const { module, props } = PLANS[plan];
  const jtl = path.join(tmp, `${plan}.jtl`);
  const t0 = Date.now();
  const run = spawnSync(JMETER, ['-n', '-t', `test-plans/${plan}.jmx`, ...props, '-l', jtl, '-j', path.join(tmp, `${plan}.log`)], { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });
  const seconds = (Date.now() - t0) / 1000;
  if (!fs.existsSync(jtl)) throw new Error(`JMeter produced no results for ${plan}:\n${run.stdout}\n${run.stderr}`);
  const [head, ...rows] = parseCsv(fs.readFileSync(jtl, 'utf8'));
  const samples = rows.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
  const profile = props.length ? props.join(' ') : 'default (1 thread, 1 loop)';
  const cases = docCases.filter((c) => c.module === module).map((c) => {
    const mine = samples.filter((s) => s.label.startsWith(c.id + ' '));
    const errors = mine.filter((s) => s.success !== 'true');
    const times = mine.map((s) => Number(s.elapsed)).sort((a, b) => a - b);
    const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const lines = mine.length
      ? [`${mine.length} samples, ${errors.length} errors`, `response time: avg ${avg.toFixed(0)} ms, 95th percentile ${pct(times, 95)} ms, max ${times[times.length - 1]} ms`, `HTTP codes: ${[...new Set(mine.map((s) => s.responseCode))].join(', ')}`, `profile ${profile}`]
      : ['No samples were recorded for this sampler'];
    errors.slice(0, 3).forEach((e) => lines.push(`FAIL ${e.label}: ${e.failureMessage || e.responseMessage}`));
    return {
      id: c.id, title: c.title, priority: c.priority, type: c.type, pre: c.pre, data: c.data, steps: c.steps, expected: c.expected,
      actual: lines.join('\n'), status: !mine.length || errors.length ? 'failed' : 'passed', duration: avg / 1000, testFile: c.testFile, testName: c.testName,
    };
  });
  cases.sort((a, b) => a.id.localeCompare(b.id));
  modules.push({ name: module, durationSeconds: seconds, cases });
  console.log(`${module}: ${cases.filter((c) => c.status === 'passed').length}/${cases.length} samplers without errors`);
}

const ver = /Version (\S+)|(\d+\.\d+(\.\d+)?)/.exec(spawnSync(JMETER, ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' }).stdout + '')?.[0] || '';
const entry = writeRun({
  reportsDir: path.join(ROOT, 'reports'), title: 'JMeter', started, durationSeconds: (Date.now() - started) / 1000,
  environment: `Apache JMeter ${ver}, short profile - https://jsonplaceholder.typicode.com`, modules,
});
const failed = entry.Modules.reduce((a, m) => a + m.Failed, 0);
console.log(`Reports: reports/index.html (${failed} failed case(s))`);
process.exit(failed ? 1 : 0);
