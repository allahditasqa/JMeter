# JMeter

**Automation Framework:** Apache JMeter 5.6 load / stress test plan (`.jmx`) with assertions and HTML dashboard report, against the public fake API [JSONPlaceholder](https://jsonplaceholder.typicode.com).

## What the plan does
`test-plans/jsonplaceholder-load.jmx` - one thread group, each virtual user loops over:
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
├── test-plans/jsonplaceholder-load.jmx
├── scripts/run.sh  run.bat       # profiles + HTML report generation
└── .github/workflows/jmeter.yml  # manual / push smoke run via Docker
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
jmeter -n -t test-plans/jsonplaceholder-load.jmx -Jthreads=5 -Jrampup=10 -Jduration=60 \
       -l results/load.jtl -e -o reports/load
```
Open `reports/load/index.html` for the HTML dashboard (APDEX, response-time percentiles, throughput, errors). Open the `.jmx` in the JMeter GUI to edit it (use GUI only for editing, not for load).

## Verified
Run locally with JMeter 5.6.3 (`-Jthreads=3 -Jrampup=3 -Jduration=20`): 50 samples, 0 errors, HTML dashboard generated. The Docker-based GitHub Actions job has not been verified.
