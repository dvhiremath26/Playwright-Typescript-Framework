# Xray integration with playwright-ci-runner

This repository has been integrated directly; do not copy the runner's source-repo
example over it. Existing page objects, test data, custom reporter, standard HTML
reporter and installed dependencies are retained.

## Tests

The three existing tests use these Xray Test keys:

| Test | Key |
| --- | --- |
| Login Test | TPA-5 |
| Logout Test | TPA-6 |
| Environment check | TPA-7 |

Make sure those are existing Generic Tests in your Xray Cloud project and add the
ones you want to your Test Plan. No Jira records have been created by these edits.
For new tests, import xray from @src/utils/xray and use xray('YOUR-KEY') as the
test's details argument. It supplies both the @ tag and a static test_key annotation.

## Runner setup

In playwright-ci-runner, set the Actions variable SOURCE_REPOSITORY to
dvhiremath26/Playwright-Typescript-Framework and SOURCE_REF to the branch or commit
containing these changes. Give CROSS_REPO_PAT Contents read access to this repository.
Configure the remaining Jira/Xray secrets in the runner, not this source repository.

The runner sets XRAY_RUN=true during discovery and execution. This disables retries
for Xray runs; other CI runs keep their existing retry behavior. ENV defaults to qa
consistently for both configuration and DataLoader; an explicit ENV still overrides it.
Make sure your CI has the required environment's test data and application access.

## Reports

- results/xray-results.xml: imported into the requested Test Execution.
- TCOE-Report/index.html: uploaded alone to Jira, without a ZIP.
- TCOE-Report/report_*.html and history.html: local report history is retained.
- reports/playwright-report/: the existing standard Playwright report is retained.

index.html now contains the latest custom report instead of redirecting to another
file. The custom reporter already embeds supported screenshots, video and trace
attachments as data URIs. Large embedded media can exceed Jira's attachment limit.

## Validation

Run node node_modules/typescript/bin/tsc --noEmit for type checking.
Run node --test verification/xray-contract.cjs for a browser-free regression check
of passing/failing/skipped results, annotations and the standalone custom report.
The check uses temporary synthetic cases and does not contact Jira or the application.
