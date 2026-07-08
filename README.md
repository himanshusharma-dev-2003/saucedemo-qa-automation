# saucedemo-qa-automation

Automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com), built with **Playwright + TypeScript** using the **Page Object Model (POM)** pattern.

Built as a QA portfolio project to demonstrate: test design, automation architecture, negative/edge-case testing, cross-browser execution, CI integration, and bug documentation.

## What's covered

| Suite | File | What it tests |
|---|---|---|
| Login | `tests/login.spec.ts` | Valid login, locked-out user, wrong password, empty fields, unregistered user |
| Login (data-driven) | `tests/login.data-driven.spec.ts` | Same login scenarios plus edge cases (SQL-injection-style input, whitespace, case sensitivity), all defined in `test-data/login-cases.json` instead of hardcoded |
| Inventory | `tests/inventory.spec.ts` | Product listing, sort by price/name (asc & desc), add/remove cart items, cart badge accuracy |
| Checkout | `tests/checkout.spec.ts` | Full purchase flow, required-field validation, order total math verification |
| Known bugs | `tests/known-bugs.spec.ts` | Two real, documented SauceDemo defects, written as automated regression checks with reproduction steps |

**37 test cases total**, each independent and able to run in parallel.

## Why this project is structured this way

- **Page Object Model** (`/pages`) — selectors and actions live in one place per page, so tests read like plain English and a UI change only requires updating the page object, not every test.
- **Custom fixtures** (`pages/fixtures.ts`) — page objects are injected automatically into every test, removing boilerplate.
- **Negative testing** — every "happy path" test has 2-3 matching negative tests (locked accounts, empty required fields, invalid data), which is the difference between checking a feature works and actually testing it.
- **Bug documentation as tests** — `known-bugs.spec.ts` shows how a QA engineer turns a manually found bug into a permanent automated regression check, with an annotation documenting expected vs. actual behavior and repro steps, exactly how you'd write it in a bug tracker.
- **Data-driven testing** (`test-data/login-cases.json` + `login.data-driven.spec.ts`) — test scenarios are defined as data, not code. Adding a new edge case means adding one JSON object with a case ID, not writing a new test function. This scales far better than hardcoding scenarios and separates "what to test" (data) from "how to test it" (logic) — the same principle behind the Page Object Model, applied one layer up.
- **Cross-browser + mobile viewport** — the same suite runs against Chromium, Firefox, WebKit, and a mobile Chrome emulation profile with one command.
- **CI on every push** — GitHub Actions runs the full suite automatically and uploads the HTML report as a build artifact.

## Getting started

```bash
npm install
npx playwright install --with-deps
```

## Running tests

```bash
npm test                  # run all tests, all browsers, headless
npm run test:headed       # watch the browser while tests run
npm run test:ui           # Playwright's interactive UI mode (best for debugging)
npm run test:chromium     # run against Chromium only
npm run report             # open the last HTML report
```

## Test report

After a run, view the interactive HTML report (screenshots + video on failure, trace viewer for step-by-step debugging):

```bash
npm run report
```

## Project structure

```
saucedemo-playwright/
├── pages/                  # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── fixtures.ts          # shared test fixtures
├── test-data/
│   ├── login-cases.json     # data-driven test scenarios
│   └── types.ts              # shape of a test case
├── tests/
│   ├── login.spec.ts
│   ├── login.data-driven.spec.ts
│   ├── inventory.spec.ts
│   ├── checkout.spec.ts
│   └── known-bugs.spec.ts
├── .github/workflows/
│   └── playwright.yml       # CI pipeline
├── playwright.config.ts
└── package.json
```

## Tech stack

- [Playwright](https://playwright.dev/) - browser automation
- TypeScript
- GitHub Actions - CI/CD

## Notes for reviewers

This targets [SauceDemo](https://www.saucedemo.com), a site purpose-built by Sauce Labs for QA practice, including intentionally broken states (`problem_user`) used to demonstrate bug-catching, not just happy-path automation.
