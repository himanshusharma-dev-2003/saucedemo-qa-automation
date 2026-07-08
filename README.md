# SauceDemo QA Automation

[![Playwright Tests](https://github.com/himanshusharma-dev-2003/saucedemo-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/himanshusharma-dev-2003/saucedemo-qa-automation/actions/workflows/playwright.yml)
[![Live HTML Report](https://img.shields.io/badge/Live_Report-View_on_GitHub_Pages-success)](https://himanshusharma-dev-2003.github.io/saucedemo-qa-automation/)

Automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com), built with **Playwright + TypeScript** using the **Page Object Model (POM)** pattern.

Built as a QA portfolio project to demonstrate: test design, automation architecture, API testing, visual regression, environment configuration, cross-browser execution, and CI/CD with automated reporting.

---

## 📊 Live Test Report
Every push triggers a full cross-browser test run on GitHub Actions. The HTML report is automatically deployed to GitHub Pages.

👉 **[View the Live Test Report Here](https://himanshusharma-dev-2003.github.io/saucedemo-qa-automation/)**

---

## 📸 Screenshots
Here is an example of the UI being tested via Playwright's built-in Visual Regression (golden snapshots):

<p align="center">
  <img src="tests/visual.spec.ts-snapshots/inventory-standard-user-chromium-win32.png" alt="Inventory Page" width="700"/>
</p>

---

## 🧪 What's Covered

| Suite | File | What it tests |
|---|---|---|
| **Login** | `tests/login.spec.ts` | Valid login, locked-out user, wrong password, empty fields, unregistered user |
| **Login (Data-Driven)** | `tests/login.data-driven.spec.ts` | Edge cases (SQL-injection-style input, whitespace, case sensitivity), defined in `test-data/login-cases.json` |
| **Inventory** | `tests/inventory.spec.ts` | Product listing, sort by price/name (asc & desc), add/remove cart items, cart badge accuracy |
| **Checkout** | `tests/checkout.spec.ts` | Full purchase flow, required-field validation, order total math verification |
| **Known Bugs** | `tests/known-bugs.spec.ts` | Two real, documented SauceDemo defects, written as automated regression checks with reproduction steps |
| **API Testing** | `tests/api.spec.ts` | 6 tests hitting REST endpoints (JSONPlaceholder). Validates GET, POST, filtering, 404 paths, and nested relational data |
| **Visual Regression** | `tests/visual.spec.ts` | Pixel-perfect snapshot testing of core pages, including capturing the broken-image bug visually |

## 🏗️ Architecture & Best Practices

- **Page Object Model (`/pages`)** — Selectors and actions live in one place per page, making tests read like plain English and ensuring easy maintenance.
- **Environment Configuration (`.env`)** — Hardcoded URLs and credentials are removed. Driven by `dotenv` locally and GitHub Secrets in CI, allowing seamless swapping between staging and production.
- **Custom Fixtures (`pages/fixtures.ts`)** — Page objects and test data are injected automatically into every test, removing setup boilerplate.
- **Negative Testing** — Every "happy path" has matching negative tests (locked accounts, empty fields).
- **Data-Driven Testing** — Test scenarios are defined as JSON data (`test-data/login-cases.json`). Adding edge cases scales infinitely without writing new test functions.
- **Bug Documentation as Tests** — `known-bugs.spec.ts` demonstrates how a QA engineer turns a manually found bug into an automated regression check. It includes soft annotations describing expected vs. actual behavior and repro steps.
- **CI/CD Integration** — GitHub Actions runs the full suite across Chromium, Firefox, WebKit, and Mobile Chrome emulation automatically, deploying the report to GitHub Pages.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
npx playwright install --with-deps
```

### 2. Set up environment
Copy the template file to create your local environment config:
```bash
cp .env.example .env
```
*(No need to edit `.env` for the default SauceDemo site, but you can point it anywhere!)*

### 3. Run tests
```bash
npm test                  # run all tests, all browsers, headless
npm run test:api          # run only the API tests
npm run test:visual       # run only visual regression tests
npm run test:headed       # watch the browser while tests run
npm run test:ui           # Playwright's interactive UI mode (best for debugging)
npm run report            # open the last HTML report
```

## 📁 Project Structure

```text
saucedemo-qa-automation/
├── pages/                  # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CheckoutPage.ts
│   └── fixtures.ts         # Shared test fixtures & credentials
├── test-data/
│   └── login-cases.json    # Data-driven test scenarios
├── tests/
│   ├── api.spec.ts         # Direct API testing
│   ├── visual.spec.ts      # Visual regression snapshots
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   ├── checkout.spec.ts
│   └── known-bugs.spec.ts
├── .github/workflows/
│   └── playwright.yml      # CI/CD pipeline & GitHub Pages deploy
├── .env.example            # Environment template
├── playwright.config.ts
└── package.json
```

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** - E2E UI automation, API testing, Visual Regression
- **TypeScript** - Strongly typed automation code
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Hosted test reporting
