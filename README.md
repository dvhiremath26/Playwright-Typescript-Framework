# Playwright TypeScript Automation Framework

This project is a Playwright-based UI automation framework built with TypeScript, designed for scalable end-to-end testing with a page object model, reusable actions, decorators, and custom reporting.

## Features

- Playwright with TypeScript
- Page Object Model structure
- Reusable action helpers and utility layer
- Environment-based configuration via `ENV`
- JSON-driven test data loading
- Custom HTML reporting and Playwright HTML report generation
- Browser automation with screenshot, video, and trace capture

## Prerequisites

Make sure the following are installed on your machine:

- Node.js 18+
- npm
- A modern browser such as Chrome/Chromium

## Installation

```bash
npm install
```

## Configuration

The framework loads the environment name from the `ENV` variable. Supported values are typically based on the test data folders and environment-specific configs, such as:

- `dev`
- `qa`
- `stage`
- `prod`

Example:

```bash
ENV=qa npx playwright test
```

## Run Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/example.spec.ts
```

Run in headed mode:

```bash
npx playwright test --headed
```

Run with a specific browser project (currently configured for Chromium):

```bash
npx playwright test --project=chromium
```

## Reports

This project generates three report outputs:

- Custom HTML report: `TCOE-Report/index.html` (complete latest report for Jira)
- Xray JUnit results: `results/xray-results.xml`
- Playwright standard HTML report: `reports/playwright-report/`

Open the Playwright HTML report:

```bash
npx playwright show-report reports/playwright-report
```

## Project Structure

```text
.
├── docs/                       # Documentation and usage guides
├── pages/                      # Page objects and locators
├── src/
│   ├── config/                 # Config and teardown setup
│   ├── helper/                 # Reusable actions, decorators, utilities
│   ├── utils/                  # Custom report generation and test-data utilities
│   └── ...
├── test-data/                  # JSON test data by environment
├── tests/                      # Test specifications
├── reports/                    # Generated reports and logs
├── package.json                # Project scripts and dependencies
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mts           # ESLint configuration
└── README.md                   # Project documentation
```

## Useful Scripts

```bash
npm run lint
npm run format
```

## Notes

- The default Playwright configuration sets `baseURL` to `https://www.testmuai.com/`.
- Screenshots, videos, and traces are enabled for each test run.
- The reporting setup is configured in `playwright.config.ts`.

## Jira / Xray integration

The existing Tests retain their keys `TPA-5`, `TPA-6`, and `TPA-7`. Use the shared
`xray()` helper for new tests to keep tags and static JUnit annotations in sync.
See [Xray setup](docs/xray-integration.md) for runner configuration and validation.

## Contributing

Create feature branches for changes and keep test cases and page objects organized under the existing framework structure.
