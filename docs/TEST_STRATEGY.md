# Test strategy: JMeter performance checks on JSONPlaceholder

**Version:** 1.0  |  **Prepared by:** QA (SDET)

## 1. Objective
Show how a JMeter plan is built, parameterised, run in non-GUI mode and reported: a functional smoke plan and a short load plan against a public fake API.

## 2. Application under test
JSONPlaceholder, https://jsonplaceholder.typicode.com (public, shared, fake writes).

## 3. Scope

| Module (plan) | Document | Cases | Type |
| --- | --- | --- | --- |
| Smoke (`smoke.jmx`) | [smoke.md](test-cases/smoke.md) | 5 | Functional, Negative |
| Load (`load.jmx`) | [load.md](test-cases/load.md) | 3 | Performance |

**Out of scope:** stress and soak tests, distributed testing, very high load (the service is shared and not ours). For k6 stress, spike and soak scenarios see my k6 repository.

## 4. Approach
- One **sampler** with its **assertions** is one test case (response code, duration, JSON path).
- Plans are parameterised with `-Jthreads`, `-Jrampup`, `-Jduration`, `-Jthinktime`; runs are always non-GUI (`jmeter -n`).
- Pass rule: a sampler passes when all its samples pass their assertions. The report also shows samples, average, 95th percentile and maximum.
- The committed reports use a **short, polite profile** (3 threads, 20 s). They show that the plan works, not the capacity of the service.

## 5. Risks
| Risk | Mitigation |
| --- | --- |
| The first request of a run is slow (connection and TLS set-up) and can break a strict duration assertion | Seen once in a real run (5.2 s against a 3 s limit); kept in the report history, not hidden |
| Shared public service | Small profiles only |

## 6. Deliverables
Documents and master CSVs, the two plans, module-wise reports of real runs (`reports/`), a traceability check (`node tools/docs.js check`), run scripts and CI.
