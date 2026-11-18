# Smoke - Test Cases

**Module:** Smoke
**Automation:** `test-plans/smoke.jmx`  |  **Report:** `reports/smoke/Smoke test <DD-MM-YYYY>_<HH-mm-ss>.html` (all reports: `reports/index.html`)
**Service:** https://jsonplaceholder.typicode.com (public fake API)

## Overview
One virtual user calls each endpoint once and checks the answer with JMeter assertions. It proves the plan and the service work before load is applied.

## Scope and notes
- A test case is one **sampler** with its assertions; the sampler name starts with the case ID.
- A case passes when its sampler has no error (all assertions passed).

## A. Samplers

| ID | Title | Priority | Type | Preconditions | Test data | Steps | Expected result | Automated in |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_SMOKE_01 | GET /posts returns status 200 in under 3 seconds | High | Functional | The demo service https://jsonplaceholder.typicode.com is reachable | 1 thread, 1 loop | 1. Run the plan `smoke.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_SMOKE_01 - GET /posts". | Sampler "TC_SMOKE_01 - GET /posts" gets status 200 (response assertion) and answers in under 3000 ms (duration assertion). | `test-plans/smoke.jmx::TC_SMOKE_01 - GET /posts` |
| TC_SMOKE_02 | GET /posts/1 returns status 200 and post id 1 | High | Functional | The demo service https://jsonplaceholder.typicode.com is reachable | 1 thread, 1 loop | 1. Run the plan `smoke.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_SMOKE_02 - GET /posts/1". | Status 200 and the JSON path $.id equals 1. | `test-plans/smoke.jmx::TC_SMOKE_02 - GET /posts/1` |
| TC_SMOKE_03 | POST /posts with a JSON body returns status 201 | High | Functional | The demo service https://jsonplaceholder.typicode.com is reachable | 1 thread, 1 loop | 1. Run the plan `smoke.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_SMOKE_03 - POST /posts". | Status 201 (the header Content-Type is application/json, body {"title":"jmeter","body":"load test","userId":1}). | `test-plans/smoke.jmx::TC_SMOKE_03 - POST /posts` |
| TC_SMOKE_04 | GET /users/1 returns status 200 and the username Bret | Medium | Functional | The demo service https://jsonplaceholder.typicode.com is reachable | 1 thread, 1 loop | 1. Run the plan `smoke.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_SMOKE_04 - GET /users/1". | Status 200 and the JSON path $.username equals Bret. | `test-plans/smoke.jmx::TC_SMOKE_04 - GET /users/1` |
| TC_SMOKE_05 | GET /posts/9999 returns status 404 | Medium | Negative | The demo service https://jsonplaceholder.typicode.com is reachable | 1 thread, 1 loop | 1. Run the plan `smoke.jmx` in non-GUI mode. 2. Read the results of the sampler "TC_SMOKE_05 - GET /posts/9999". | Status 404 (the 404 is the expected answer, so the response assertion expects it). | `test-plans/smoke.jmx::TC_SMOKE_05 - GET /posts/9999` |

## Summary

| Cases | High priority | Automated |
| --- | --- | --- |
| 5 | 3 | 5 |
