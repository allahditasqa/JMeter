# Load - Test Cases

**Module:** Load
**Automation:** `test-plans/load.jmx`  |  **Report:** `reports/load/Load test <DD-MM-YYYY>_<HH-mm-ss>.html` (all reports: `reports/index.html`)
**Service:** https://jsonplaceholder.typicode.com (public fake API)

## Overview
Several virtual users repeat the same three requests with a think time of 1 second. The plan is parameterised with `-Jthreads`, `-Jrampup`, `-Jduration`, `-Jthinktime`.

## Scope and notes
- A test case is one **sampler**; it passes when every sample of that sampler passed its assertions (0 errors). The report also shows samples, average, 95th percentile and maximum response time.
- Be polite: the service is shared. The committed report uses the short profile above.

## A. Samplers

| ID | Title | Priority | Type | Preconditions | Test data | Steps | Expected result | Automated in |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_LOAD_01 | GET /posts under load returns status 200 in under 3 seconds with no error | High | Performance | The demo service https://jsonplaceholder.typicode.com is reachable | Default: 5 threads, 10 s ramp-up, 60 s (`scripts/run.sh load`). Report run: 3 threads, 3 s ramp-up, 20 s (`-Jthreads=3 -Jrampup=3 -Jduration=20`) | 1. Run the plan `load.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_LOAD_01 - GET /posts". | Every sample of the sampler passes its assertions (status 200, duration under 3000 ms): 0 errors. | `test-plans/load.jmx::TC_LOAD_01 - GET /posts` |
| TC_LOAD_02 | GET /posts/1 under load returns status 200 and post id 1 with no error | High | Performance | The demo service https://jsonplaceholder.typicode.com is reachable | Default: 5 threads, 10 s ramp-up, 60 s (`scripts/run.sh load`). Report run: 3 threads, 3 s ramp-up, 20 s (`-Jthreads=3 -Jrampup=3 -Jduration=20`) | 1. Run the plan `load.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_LOAD_02 - GET /posts/1". | Every sample passes its assertions (status 200, JSON path $.id equals 1): 0 errors. | `test-plans/load.jmx::TC_LOAD_02 - GET /posts/1` |
| TC_LOAD_03 | POST /posts under load returns status 201 with no error | Medium | Performance | The demo service https://jsonplaceholder.typicode.com is reachable | Default: 5 threads, 10 s ramp-up, 60 s (`scripts/run.sh load`). Report run: 3 threads, 3 s ramp-up, 20 s (`-Jthreads=3 -Jrampup=3 -Jduration=20`) | 1. Run the plan `load.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_LOAD_03 - POST /posts". | Every sample passes its assertion (status 201): 0 errors. | `test-plans/load.jmx::TC_LOAD_03 - POST /posts` |

## Summary

| Cases | High priority | Automated |
| --- | --- | --- |
| 3 | 2 | 3 |
