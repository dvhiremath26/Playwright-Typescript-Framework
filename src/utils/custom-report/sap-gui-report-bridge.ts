import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join, resolve } from 'path'

interface SapGuiStep {
  stepNo: number
  stepName: string
  className: string
  methodName: string
  status: 'PASS' | 'FAIL'
  timestamp: string
  duration: number
  message: string
  exception: string
  thread: string
  screenshotName: string
  screenshotBase64: string
}

interface SapGuiReport {
  suiteName: string
  startTime: string
  endTime: string
  status: 'PASS' | 'FAIL'
  duration: number
  steps: SapGuiStep[]
}

interface CustomReportStep {
  title: string
  category: string
  duration: number
  status: 'passed' | 'failed' | 'skipped'
  screenshots?: string[]
  error?: string
  stackTrace?: string
  startTime: string
  children?: CustomReportStep[]
}

interface CustomReportTestData {
  id: string
  title: string
  fullTitle: string
  file: string
  describePath: string[]
  location: string
  duration: number
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'flaky'
  retry: number
  screenshots: { name: string; path: string }[]
  steps: CustomReportStep[]
  logs: string[]
  video?: string
  trace?: string
  error?: string
  errorStack?: string
  tags: string[]
}

interface CustomReportPayload {
  title: string
  file: string
  tests: CustomReportTestData[]
  stats: {
    total: number
    passed: number
    failed: number
    skipped: number
  }
}

function readSapReport(reportPath: string): SapGuiReport {
  const raw = readFileSync(reportPath, 'utf-8')
  return JSON.parse(raw) as SapGuiReport
}

function toDataUri(base64: string): string {
  return `data:image/png;base64,${base64}`
}

function mapStatus(status: SapGuiStep['status']): 'passed' | 'failed' {
  return status === 'PASS' ? 'passed' : 'failed'
}

function buildCustomPayload(report: SapGuiReport, reportPath: string): CustomReportPayload {
  const steps: CustomReportStep[] = report.steps.map((step, index) => ({
    title: `${String(step.stepNo).padStart(3, '0')} ${step.stepName}`,
    category: 'sap.step',
    duration: Math.round(step.duration * 1000),
    status: mapStatus(step.status),
    screenshots: step.screenshotBase64 ? [toDataUri(step.screenshotBase64)] : [],
    error: step.exception || undefined,
    stackTrace: step.exception || undefined,
    startTime: step.timestamp,
  }))

  const failureCount = report.steps.filter((step) => step.status !== 'PASS').length
  const tests: CustomReportTestData[] = [
    {
      id: 'sap-gui-report',
      title: report.suiteName,
      fullTitle: report.suiteName,
      file: reportPath,
      describePath: ['SAP-GUI'],
      location: reportPath,
      duration: Math.round(report.duration * 1000),
      status: failureCount > 0 ? 'failed' : 'passed',
      retry: 0,
      screenshots: report.steps
        .filter((step) => !!step.screenshotBase64)
        .map((step) => ({
          name: step.screenshotName || `Step ${step.stepNo}`,
          path: toDataUri(step.screenshotBase64),
        })),
      steps,
      logs: report.steps.map((step) => `${step.timestamp} ${step.status} ${step.stepName}`),
      error: failureCount > 0 ? 'One or more SAP GUI steps failed.' : undefined,
      errorStack: undefined,
      tags: ['SAP-GUI'],
    },
  ]

  return {
    title: 'SAP-GUI',
    file: reportPath,
    tests,
    stats: {
      total: 1,
      passed: failureCount === 0 ? 1 : 0,
      failed: failureCount > 0 ? 1 : 0,
      skipped: 0,
    },
  }
}

function generateHtml(payload: CustomReportPayload): string {
  const test = payload.tests[0]
  const screenshotHtml = test.screenshots.length
    ? test.screenshots
        .map(
          (shot) => `
            <div class="screenshot-item">
              <a href="${shot.path}" target="_blank" class="screenshot-link">
                <img src="${shot.path}" alt="${shot.name}" class="screenshot-preview" />
              </a>
              <div class="screenshot-name">${shot.name}</div>
            </div>`,
        )
        .join('')
    : '<div class="empty-state">No screenshots were captured.</div>'

  const stepHtml = test.steps
    .map(
      (step) => `
        <div class="step-card ${step.status}">
          <div class="step-title">${step.title}</div>
          <div class="step-meta">${step.status.toUpperCase()} | ${step.duration} ms | ${step.startTime}</div>
          ${step.error ? `<div class="step-error">${step.error}</div>` : ''}
          ${step.screenshots?.length ? `<img class="step-image" src="${step.screenshots[0]}" alt="${step.title}" />` : ''}
        </div>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SAP-GUI Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f6f8fb; color: #1f2937; }
    .header { background: #0f172a; color: white; padding: 24px 32px; }
    .header h1 { margin: 0 0 6px; font-size: 28px; }
    .header p { margin: 0; opacity: .85; }
    .container { padding: 24px 32px 40px; }
    .folder { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 8px 30px rgba(15, 23, 42, .08); margin-bottom: 20px; }
    .folder-title { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
    .stat { background: #eef2ff; border-radius: 12px; padding: 14px; }
    .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; }
    .stat-value { font-size: 24px; font-weight: 700; margin-top: 6px; }
    .steps { display: grid; gap: 12px; }
    .step-card { background: #f8fafc; border-left: 5px solid #94a3b8; border-radius: 12px; padding: 16px; }
    .step-card.passed { border-left-color: #16a34a; }
    .step-card.failed { border-left-color: #dc2626; }
    .step-title { font-weight: 700; margin-bottom: 6px; }
    .step-meta { font-size: 12px; color: #64748b; margin-bottom: 10px; }
    .step-error { color: #b91c1c; font-size: 14px; margin-bottom: 10px; }
    .step-image { max-width: 100%; border-radius: 10px; border: 1px solid #e5e7eb; }
    .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .screenshot-item { background: #f8fafc; border-radius: 12px; padding: 12px; }
    .screenshot-preview { width: 100%; height: auto; display: block; border-radius: 10px; border: 1px solid #e5e7eb; }
    .screenshot-name { margin-top: 8px; font-size: 13px; color: #334155; word-break: break-word; }
    .empty-state { color: #64748b; padding: 12px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SAP-GUI Standalone HTML Report</h1>
    <p>Generated from SAP GUI report.json</p>
  </div>
  <div class="container">
    <div class="folder">
      <div class="folder-title">SAP-GUI</div>
      <div class="stats">
        <div class="stat"><div class="stat-label">Total</div><div class="stat-value">${payload.stats.total}</div></div>
        <div class="stat"><div class="stat-label">Passed</div><div class="stat-value">${payload.stats.passed}</div></div>
        <div class="stat"><div class="stat-label">Failed</div><div class="stat-value">${payload.stats.failed}</div></div>
        <div class="stat"><div class="stat-label">Duration</div><div class="stat-value">${payload.tests[0].duration} ms</div></div>
      </div>
      <div class="steps">${stepHtml}</div>
    </div>
    <div class="folder">
      <div class="folder-title">Screenshots</div>
      <div class="screenshot-grid">${screenshotHtml}</div>
    </div>
  </div>
</body>
</html>`
}

function main(): void {
  const reportPath = process.argv[2]
  const outputPath = process.argv[3]

  if (!reportPath || !outputPath) {
    console.error('Usage: ts-node sap-gui-report-bridge.ts <report.json> <output.html>')
    process.exit(1)
  }

  const resolvedReport = resolve(reportPath)
  const resolvedOutput = resolve(outputPath)

  if (!existsSync(resolvedReport)) {
    throw new Error(`Report not found: ${resolvedReport}`)
  }

  const report = readSapReport(resolvedReport)
  const payload = buildCustomPayload(report, resolvedReport)
  const html = generateHtml(payload)
  mkdirSync(dirname(resolvedOutput), { recursive: true })
  writeFileSync(resolvedOutput, html, 'utf-8')
  console.log(`SAP-GUI report written to ${resolvedOutput}`)
}

main()
