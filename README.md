# JMeter

**Automation Framework:** Apache JMeter 5.6 load / stress test plan (`.jmx`) with assertions and HTML dashboard report, against the public fake API [JSONPlaceholder](https://jsonplaceholder.typicode.com).

## What the plan does
`test-plans/load.jmx` - one thread group, each virtual user loops over:
1. `GET /posts` - response-code assertion (200) + duration assertion (< 3 s)
2. `GET /posts/1` - 200 assertion + JSON Path assertion (`$.id == 1`)
3. `POST /posts` - JSON body, 201 assertion
4. constant think-time timer

Everything is parameterised through JMeter properties (`-J`): `threads`, `rampup`, `duration` (seconds), `thinktime` (ms), `host`. Defaults are small (5 users, 30 s).

| Profile | Threads | Ramp-up | Duration |
|---------|---------|---------|----------|
| `load`   | 5  | 10 s | 60 s  |
| `stress` | 30 | 30 s | 120 s |

> Be polite - this is a shared public service. Keep the numbers small.

## Structure
```
JMeter/
├── test-plans/load.jmx
├── scripts/run.sh  run.bat       # profiles + HTML report generation
└── .github/workflows/jmeter.yml  # manual / push smoke run
```

## Prerequisites
[Apache JMeter 5.6+](https://jmeter.apache.org/download_jmeter.cgi) (needs Java 8+) with `jmeter` on the PATH.

## Run (non-GUI)
```bash
./scripts/run.sh load            # or: scripts\run.bat load   on Windows
./scripts/run.sh stress
```
Equivalent raw command:
```bash
jmeter -n -t test-plans/load.jmx -Jthreads=5 -Jrampup=10 -Jduration=60 \
       -l results/load.jtl -e -o reports/load
```
Open `reports/load/index.html` for the HTML dashboard (APDEX, response-time percentiles, throughput, errors). Open the `.jmx` in the JMeter GUI to edit it (use GUI only for editing, not for load).

## Verified
Run locally with JMeter 5.6.3 (`-Jthreads=3 -Jrampup=3 -Jduration=20`): 50 samples, 0 errors, HTML dashboard generated. The GitHub Actions workflow installs JMeter 5.6.3 and runs the same small profile.

## Test cases
Every sampler is a documented test case (the sampler name starts with the case ID), in the standard of [docs/TEST_CASE_STANDARD.md](docs/TEST_CASE_STANDARD.md) (strategy: [docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md)). Plans: `test-plans/smoke.jmx` (1 user, each endpoint once) and `test-plans/load.jmx` (the load profile described above).

| Module | Document | Cases |
|--------|----------|-------|
| Smoke | [smoke.md](docs/test-cases/smoke.md) | 5 |
| Load | [load.md](docs/test-cases/load.md) | 3 |
| **Total** | | **8** |

`node tools/docs.js csv` regenerates the master CSVs; `node tools/docs.js check` is the traceability check.

## Reports
`JMETER=<path to jmeter> node tools/run-jmeter.js` runs both plans (load with a short profile: 3 threads, 20 s) and writes module-wise reports of the real results to `reports/` (`index.html`, `history.json`, one folder per plan; HTML + CSV per run). Open [reports/index.html](reports/index.html) after cloning.

Two runs are committed. In the **first** run TC_SMOKE_01 failed honestly: the first request (cold connection) took 5.2 s against the 3 s duration assertion. The second run passed 8 of 8. Both stay in the history.
