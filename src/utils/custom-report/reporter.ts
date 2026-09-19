/**
 * Custom SE Reporter for Playwright
 * @author Deepak Hiremath
 * @version 1.1.0
 * @description Custom HTML Reporter for Playwright Test Automation Framework.
 *
 * Screenshots, videos and traces are embedded as base64 data URIs directly
 * inside the generated report HTML file, so the report is fully
 * self-contained (no external "screenshots/videos/traces" folders to ship
 * alongside it).
 *
 * Configure which media types get embedded from playwright.config.ts:
 *
 * reporter: [
 *   ['./customReporter.ts', {
 *     attach: {
 *       screenshot: 'on',  // 'on' | 'off' (default: 'on')
 *       video: 'on',       // 'on' | 'off' (default: 'on')
 *       trace: 'on',       // 'on' | 'off' (default: 'on')
 *     },
 *   }],
 * ],
 *
 * Note: this only controls whether the reporter *embeds* attachments that
 * Playwright already captured. Playwright itself must still be configured to
 * capture them, e.g. `use: { screenshot: 'on', video: 'on', trace: 'on' }`.
 * Turning video/trace 'off' is recommended for very large suites, since
 * embedding large videos/traces as base64 increases report file size
 * (~33% larger than the original binary) and memory usage while the report
 * is being generated.
 */

import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter'
import * as fs from 'fs'
import * as path from 'path'
import { getReportHtml } from './html'
import { reportLogoDataUri } from './logo'
import { reportScripts } from './scripts'
import { reportStyles } from './styles'

interface StepData {
  title: string
  category: string
  duration: number
  status: 'passed' | 'failed' | 'skipped'
  screenshots?: string[]
  error?: string
  stackTrace?: string
  startTime: string
  consoleLogs?: string[]
  stepIndex?: number
  videoStartTime?: number
  videoEndTime?: number
  children?: StepData[]
}

interface TestData {
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
  steps: StepData[]
  logs: string[]
  video?: string
  trace?: string
  error?: string
  errorStack?: string
  tags: string[]
}

interface FileGroup {
  file: string
  describes: Map<string, TestData[]>
  stats: { passed: number; failed: number; skipped: number; total: number }
}

interface TestTreeNode {
  id: string
  name: string
  type: 'root' | 'folder' | 'describe' | 'test'
  children: TestTreeNode[]
  data?: TestData
}

interface ReporterAttachOptions {
  /** Embed screenshots into the HTML report as base64. Default: 'on'. */
  screenshot?: 'on' | 'off'
  /** Embed test videos into the HTML report as base64. Default: 'on'. */
  video?: 'on' | 'off'
  /** Embed Playwright trace .zip files into the HTML report as base64. Default: 'on'. */
  trace?: 'on' | 'off'
}

interface ReporterOptions {
  /** Controls which attachment types get embedded into the single generated report HTML. */
  attach?: ReporterAttachOptions
  /** Branding overrides supplied from playwright.config.ts. */
  branding?: {
    name?: string
    subtitle?: string
  }
  /** Report output folder supplied from playwright.config.ts. */
  outputFolder?: string
  /** Optional path to an SAP GUI report.json file or its parent output folder. */
  sapReportPath?: string
}

interface ReportBrandingConfig {
  NAME: string
  SUBTITLE: string
  FOLDER_PATH: string
}

interface SuiteStats {
  total: number
  passed: number
  failed: number
  skipped: number
  flaky: number
}

class CustomSEReporter implements Reporter {
  private testResults: TestData[] = []
  private fileGroups: Map<string, FileGroup> = new Map()
  private suiteStats: SuiteStats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
  }
  private config!: FullConfig
  private startTime: Date = new Date()
  private endTime: Date = new Date()
  private outputFile: string = 'se-report/index.html'
  private runId: string = ''
  private testStepsMap: Map<string, StepData[]> = new Map()
  private testActionStepsMap: Map<string, StepData[]> = new Map()
  private testStartTimeMap: Map<string, number> = new Map()
  private testStepCounterMap: Map<string, number> = new Map()
  private testCounter: number = 0
  private runningTests: Map<string, TestData> = new Map()
  private completedTestIds: Set<string> = new Set()
  private testTreeCache: TestTreeNode | null = null
  private testTreeCacheKey: string = ''
  private attachOptions: Required<ReporterAttachOptions>
  private options: ReporterOptions
  private sapReportLoaded: boolean = false
  private branding: ReportBrandingConfig = {
    NAME: 'SE Automation Report',
    SUBTITLE: 'SE - Playwright Framework',
    FOLDER_PATH: 'se-report',
  }

  constructor(options: ReporterOptions = {}) {
    this.options = options
    this.attachOptions = {
      screenshot: options.attach?.screenshot ?? 'on',
      video: options.attach?.video ?? 'on',
      trace: options.attach?.trace ?? 'on',
    }
    this.branding = this.loadBrandingConfig()
  }

  onBegin(config: FullConfig, suite: Suite): void {
    const now = new Date()
    this.runId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
    const reportDir = this.resolveReportDir(this.branding.FOLDER_PATH)
    this.outputFile = path.join(reportDir, `report_${this.runId}.html`)
    this.config = config
    this.startTime = new Date()
    this.loadSapGuiReportIfConfigured()
    const totalTests = suite.allTests().length

    console.log('\n==============================================================')
    console.log('PLAYWRIGHT AUTOMATION - REAL-TIME REPORT')
    console.log('--------------------------------------------------------------')
    console.log(`Started: ${this.startTime.toLocaleString()}`)
    console.log(`Total Tests: ${String(totalTests)}`)
    console.log(`Environment: ${process.env.TEST_ENV || process.env.ENV || 'QA'}`)
    console.log('==============================================================\n')

    this.initializeLiveReport()
  }

  private initializeLiveReport(): void {
    const reportDir = path.dirname(this.outputFile)
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }
    this.updateReportRealTime()
    console.log(`Real-time report: ${this.outputFile}`)
  }

  onTestBegin(test: TestCase): void {
    this.testStepsMap.set(test.id, [])
    this.testActionStepsMap.set(test.id, [])
    this.testStartTimeMap.set(test.id, Date.now())
    this.testStepCounterMap.set(test.id, 0)
    this.testCounter++

    const testFile = test.location.file.split('/').pop() || ''
    console.log(`\nSTARTING: ${test.title}`)
    console.log(`File: ${testFile}`)
    console.log(`Suite: ${test.parent.title}`)
    console.log('--------------------------------------------------------------')

    const describePath: string[] = []
    let parent: { title: string; parent?: unknown } | undefined = test.parent
    while (parent && parent.title) {
      describePath.unshift(parent.title)
      parent = parent.parent as { title: string; parent?: unknown } | undefined
    }

    this.runningTests.set(test.id, {
      id: `running-${test.id}`,
      title: test.title,
      fullTitle: [...describePath, test.title].join(' â€º '),
      file: test.location.file,
      describePath: describePath,
      location: `${test.location.file}:${test.location.line}`,
      duration: 0,
      status: 'passed',
      retry: 0,
      screenshots: [],
      steps: [],
      logs: [],
      tags: test.tags || [],
    })

    this.updateReportRealTime()
  }

  /**
   * Only show test.step() blocks declared in the spec file as top-level
   * entries. Nested actions are captured under those top-level steps and
   * rendered inside their detail panels.
   */
  private isSpecTopLevelStep(step: TestStep): boolean {
    if (step.category !== 'test.step') {
      return false
    }

    const stepParentCategory = step.parent?.category
    return !step.parent || stepParentCategory !== 'test.step'
  }

  onStepBegin(_test: TestCase, _result: TestResult, step: TestStep): void {
    if (step.category === 'test.step' && !step.parent) {
      console.log(`   [RUNNING] ${step.title}...`)
    }
  }

  onStepEnd(test: TestCase, _result: TestResult, step: TestStep): void {
    if (step.category === 'pw:api' || step.category === 'expect') {
      const testStartTime = this.testStartTimeMap.get(test.id) || Date.now()
      const actionSteps = this.testActionStepsMap.get(test.id) || []
      actionSteps.push(this.convertStepTree(step, testStartTime, actionSteps.length))
      this.testActionStepsMap.set(test.id, actionSteps)
    }

    if (this.isSpecTopLevelStep(step)) {
      const duration = step.duration ? `(${step.duration}ms)` : ''
      const status = step.error ? '[FAIL]' : '[PASS]'
      console.log(`   ${status} ${step.title} ${duration}`)
      const testStartTime = this.testStartTimeMap.get(test.id) || Date.now()
      const stepCounter = this.testStepCounterMap.get(test.id) || 0
      const testSteps = this.testStepsMap.get(test.id) || []

      const stepData = this.convertStepTree(step, testStartTime, stepCounter)
      testSteps.push(stepData)
      this.testStepsMap.set(test.id, testSteps)
      this.testStepCounterMap.set(test.id, stepCounter + 1)

      const runningTest = this.runningTests.get(test.id)
      if (runningTest) {
        runningTest.steps = [...testSteps]
        this.runningTests.set(test.id, runningTest)
      }

      this.updateReportRealTime()
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.suiteStats.total++

    let status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'flaky' = 'passed'
    let statusIcon = '[PASS]'
    if (result.status === 'passed') {
      if (result.retry > 0) {
        this.suiteStats.flaky++
        status = 'flaky'
        statusIcon = '[FLAKY]'
      } else {
        this.suiteStats.passed++
        status = 'passed'
        statusIcon = '[PASS]'
      }
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.suiteStats.failed++
      status = result.status === 'timedOut' ? 'timedOut' : 'failed'
      statusIcon = '[FAIL]'
    } else {
      this.suiteStats.skipped++
      status = 'skipped'
      statusIcon = '[SKIP]'
    }

    const testTime = this.formatDuration(result.duration)

    console.log('--------------------------------------------------------------')
    console.log(`   RESULT: ${status.toUpperCase()} | Duration: ${testTime}`)
    if (result.error) {
      console.log(`   Error: ${result.error.message?.substring(0, 80)}...`)
    }
    console.log(
      `\n   Running Total: Passed ${this.suiteStats.passed} | Failed ${this.suiteStats.failed} | Skipped ${this.suiteStats.skipped} | Flaky ${this.suiteStats.flaky}`,
    )

    const currentTestSteps = this.testStepsMap.get(test.id) || []
    if (currentTestSteps.length === 0) {
      currentTestSteps.push(
        ...this.buildSpecCallSteps(test, result, this.testActionStepsMap.get(test.id) || []),
      )
    }
    const testLogs = this.collectTestLogs(result)
    this.associateLogsWithSteps(test, result, currentTestSteps, testLogs)

    const screenshots: { name: string; path: string }[] = []
    let videoPath: string | undefined
    let tracePath: string | undefined

    for (const attachment of result.attachments) {
      if (attachment.contentType === 'image/png') {
        if (this.attachOptions.screenshot === 'off') {
          continue
        }
        const dataUri = this.attachmentToDataUri(attachment, 'image/png')
        if (dataUri) {
          screenshots.push({
            name: attachment.name || `Screenshot ${screenshots.length + 1}`,
            path: dataUri,
          })
        } else {
          console.warn(`Failed to embed screenshot: ${attachment.name}`)
        }
      }

      if (attachment.contentType === 'video/webm' && attachment.path) {
        if (this.attachOptions.video === 'off') {
          continue
        }
        const dataUri = this.attachmentToDataUri(attachment, 'video/webm')
        if (dataUri) {
          videoPath = dataUri
        } else {
          console.warn(`Failed to embed video: ${attachment.path}`)
        }
      }

      if (attachment.name === 'trace' && attachment.path) {
        if (this.attachOptions.trace === 'off') {
          continue
        }
        const dataUri = this.attachmentToDataUri(attachment, 'application/zip')
        if (dataUri) {
          tracePath = dataUri
        } else {
          console.warn(`Failed to embed trace: ${attachment.path}`)
        }
      }
    }

    // Each step already carries its own attachments (captured directly
    // in onStepEnd via step.attachments), which reliably ties a
    // screenshot to the exact step it came from. As a fallback, if the
    // test failed and Playwright's automatic failure screenshot wasn't
    // already attached to a step (it's a test-level attachment, not a
    // step-level one), pin it onto the step that actually failed so it's
    // visible the moment that step is expanded.
    if (this.attachOptions.screenshot !== 'off' && screenshots.length > 0) {
      const failedStep = currentTestSteps.find((s) => s.status === 'failed')
      if (failedStep && (!failedStep.screenshots || failedStep.screenshots.length === 0)) {
        failedStep.screenshots = [screenshots[screenshots.length - 1].path]
      }
    }

    const describePath: string[] = []
    let parent: Suite | undefined = test.parent
    while (parent) {
      if (parent.title) {
        describePath.unshift(parent.title)
      }
      parent = parent.parent
    }

    const tagMatches = test.title.match(/@\w+/g) || []

    const testData: TestData = {
      id: `test-${test.id}`,
      title: test.title,
      fullTitle: [...describePath, test.title].join(' â€º '),
      file: test.location.file,
      describePath: describePath,
      location: `${test.location.file.split('/').pop()}:${test.location.line}`,
      duration: result.duration,
      status: status,
      retry: result.retry,
      screenshots: screenshots,
      steps: [...currentTestSteps],
      logs: testLogs,
      video: videoPath,
      trace: tracePath,
      error: result.error?.message,
      errorStack: result.error?.stack,
      tags: tagMatches,
    }

    this.testResults.push(testData)

    const fileName = test.location.file
    if (!this.fileGroups.has(fileName)) {
      this.fileGroups.set(fileName, {
        file: fileName,
        describes: new Map(),
        stats: { passed: 0, failed: 0, skipped: 0, total: 0 },
      })
    }
    const fileGroup = this.fileGroups.get(fileName)!
    fileGroup.stats.total++
    if (status === 'passed') fileGroup.stats.passed++
    else if (status === 'flaky') fileGroup.stats.passed++
    else if (status === 'failed' || status === 'timedOut') fileGroup.stats.failed++
    else fileGroup.stats.skipped++

    const describeKey = describePath.join(' â€º ')
    if (!fileGroup.describes.has(describeKey)) {
      fileGroup.describes.set(describeKey, [])
    }
    fileGroup.describes.get(describeKey)!.push(testData)

    this.runningTests.delete(test.id)
    this.testActionStepsMap.delete(test.id)
    this.completedTestIds.add(test.id)

    this.updateReportRealTime()
  }

  private updateReportRealTime(): void {
    try {
      const reportDir = path.dirname(this.outputFile)
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true })
      }
      const html = this.generateHTMLRealTime()
      fs.writeFileSync(this.outputFile, html)
    } catch (error) {
      console.error('Real-time report update failed:', error)
    }
  }

  private loadSapGuiReportIfConfigured(): void {
    if (this.sapReportLoaded) {
      return
    }

    const sapReportPath = this.options.sapReportPath?.trim()
    if (!sapReportPath) {
      return
    }

    const resolvedPath = this.resolveSapReportFilePath(sapReportPath)
    if (!resolvedPath) {
      console.warn(`SAP GUI report not found: ${sapReportPath}`)
      return
    }

    try {
      const raw = fs.readFileSync(resolvedPath, 'utf-8')
      const sapReport = JSON.parse(raw) as {
        suiteName: string
        startTime: string
        endTime: string
        status: string
        duration: number
        steps: Array<{
          stepNo: number
          stepName: string
          className: string
          methodName: string
          status: string
          timestamp: string
          duration: number
          message: string
          exception: string
          thread: string
          screenshotName: string
          screenshotBase64: string
        }>
      }

      const hasFailure = sapReport.steps.some((step) => step.status !== 'PASS')
      const screenshots = sapReport.steps
        .filter((step) => step.screenshotBase64)
        .map((step) => ({
          name: step.screenshotName || `Step ${step.stepNo}`,
          path: `data:image/png;base64,${step.screenshotBase64}`,
        }))

      const stepData = sapReport.steps.map((step) => ({
        title: `${String(step.stepNo).padStart(3, '0')} ${step.stepName}`,
        category: 'sap.step',
        duration: Math.round((step.duration || 0) * 1000),
        status: step.status === 'PASS' ? 'passed' : 'failed',
        screenshots: step.screenshotBase64
          ? [`data:image/png;base64,${step.screenshotBase64}`]
          : [],
        error: step.exception || undefined,
        stackTrace: step.exception || undefined,
        startTime: step.timestamp,
      }))

      const sapTestData = {
        id: `sap-${Date.now()}`,
        title: sapReport.suiteName || 'SAP GUI',
        fullTitle: `SAP-GUI â€º ${sapReport.suiteName || 'SAP GUI'}`,
        file: resolvedPath,
        describePath: ['SAP-GUI'],
        location: resolvedPath,
        duration: Math.round((sapReport.duration || 0) * 1000),
        status: hasFailure ? 'failed' : 'passed',
        retry: 0,
        screenshots,
        steps: stepData,
        logs: sapReport.steps.map((step) => `${step.timestamp} ${step.status} ${step.stepName}`),
        error: hasFailure ? 'SAP GUI execution contains failed steps.' : undefined,
        errorStack: hasFailure ? `Source report: ${path.basename(resolvedPath)}` : undefined,
        tags: ['SAP-GUI'],
      }

      this.testResults.unshift(sapTestData as TestData)
      this.sapReportLoaded = true
    } catch (error) {
      console.warn('Failed to load SAP GUI report into Playwright HTML report:', error)
    }
  }

  private resolveSapReportFilePath(inputPath: string): string | undefined {
    const resolvedInput = path.isAbsolute(inputPath)
      ? inputPath
      : path.resolve(process.cwd(), inputPath)

    if (fs.existsSync(resolvedInput)) {
      const stat = fs.statSync(resolvedInput)
      if (stat.isFile()) {
        return resolvedInput
      }

      if (stat.isDirectory()) {
        const candidates = fs
          .readdirSync(resolvedInput, { withFileTypes: true })
          .filter((entry) => entry.isDirectory() && entry.name.startsWith('report_'))
          .map((entry) => {
            const reportDir = path.join(resolvedInput, entry.name)
            const reportFile = path.join(reportDir, 'report.json')
            return fs.existsSync(reportFile)
              ? { reportDir, reportFile, mtimeMs: fs.statSync(reportDir).mtimeMs }
              : undefined
          })
          .filter(
            (entry): entry is { reportDir: string; reportFile: string; mtimeMs: number } => !!entry,
          )
          .sort((a, b) => b.mtimeMs - a.mtimeMs)

        return candidates[0]?.reportFile
      }
    }

    const parentDir = path.dirname(resolvedInput)
    const targetName = path.basename(resolvedInput)
    if (fs.existsSync(parentDir) && fs.statSync(parentDir).isDirectory()) {
      const candidate = path.join(parentDir, targetName)
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        const reportFile = path.join(candidate, 'report.json')
        if (fs.existsSync(reportFile)) {
          return reportFile
        }
      }
    }

    return undefined
  }

  private generateHTMLRealTime(): string {
    const inProgressTests = Array.from(this.runningTests.values())
    const originalResults = this.testResults
    this.testResults = [...originalResults, ...inProgressTests]

    let html = this.generateHTML()

    this.testResults = originalResults

    html = html.replace(
      '<meta charset="UTF-8">',
      '<meta charset="UTF-8">\n    <meta http-equiv="refresh" content="5">',
    )

    return html
  }

  async onEnd(_result: FullResult): Promise<void> {
    this.endTime = new Date()
    const duration = this.formatDuration(this.endTime.getTime() - this.startTime.getTime())
    const passRate =
      this.suiteStats.total > 0
        ? ((this.suiteStats.passed / this.suiteStats.total) * 100).toFixed(1)
        : '0'

    console.log('\nFINAL TEST SUMMARY')
    console.log('--------------------------------------------------------------')
    console.log(`Passed:  ${String(this.suiteStats.passed)}`)
    console.log(`Failed:  ${String(this.suiteStats.failed)}`)
    console.log(`Flaky:   ${String(this.suiteStats.flaky)}`)
    console.log(`Skipped: ${String(this.suiteStats.skipped)}`)
    console.log(`Total:   ${String(this.suiteStats.total)}`)
    console.log(`Duration: ${duration}`)
    console.log(`Pass Rate: ${passRate}%`)
    console.log('--------------------------------------------------------------')
    console.log('\nGenerating SE HTML Report...')

    await this.generateReport()
    console.log(`Report generated: ${this.outputFile}`)
  }

  private formatTime(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  private formatVideoTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  /**
   * Reads an attachment's content (from its in-memory body, or from disk
   * if only a path is available) and returns a base64 data URI so it can
   * be embedded directly inside the report HTML instead of being copied
   * to a separate file/folder.
   */
  private attachmentToDataUri(
    attachment: { body?: Buffer; path?: string },
    mimeType: string,
  ): string | undefined {
    try {
      let buffer: Buffer | undefined
      if (attachment.body) {
        buffer = Buffer.isBuffer(attachment.body) ? attachment.body : Buffer.from(attachment.body)
      } else if (attachment.path && fs.existsSync(attachment.path)) {
        buffer = fs.readFileSync(attachment.path)
      }
      if (!buffer) {
        return undefined
      }
      return `data:${mimeType};base64,${buffer.toString('base64')}`
    } catch {
      return undefined
    }
  }

  private collectTestLogs(result: TestResult): string[] {
    const allLogs: string[] = []

    const appendChunks = (chunks: (string | Buffer)[], prefix = ''): void => {
      for (const chunk of chunks) {
        const text = typeof chunk === 'string' ? chunk : chunk.toString()
        allLogs.push(
          ...text
            .split('\n')
            .map((line) => this.stripAnsi(line).trim())
            .filter(Boolean)
            .map((line) => `${prefix}${line}`),
        )
      }
    }

    appendChunks(result.stdout || [])
    appendChunks(result.stderr || [], '[stderr] ')

    return allLogs
  }

  private stripAnsi(value: string): string {
    const escapeCharacter = String.fromCharCode(27)
    return value.replace(new RegExp(`${escapeCharacter}\\[[0-?]*[ -/]*[@-~]`, 'g'), '')
  }

  private associateLogsWithSteps(
    _test: TestCase,
    result: TestResult,
    testSteps: StepData[],
    allLogs: string[],
  ): void {
    if (testSteps.length === 0) {
      return
    }

    // Initialize consoleLogs array for all steps
    for (const step of testSteps) {
      if (!step.consoleLogs) {
        step.consoleLogs = []
      }
    }

    // Process attachments that might contain step logs
    for (const attachment of result.attachments) {
      const logMatch = attachment.name.match(/^step-(\d+)-logs$/)
      if (logMatch && attachment.contentType === 'text/plain') {
        const stepIndex = parseInt(logMatch[1], 10)
        if (stepIndex >= 0 && stepIndex < testSteps.length) {
          let logContent = ''
          if (attachment.body) {
            logContent = Buffer.isBuffer(attachment.body)
              ? attachment.body.toString()
              : String(attachment.body)
          } else if (attachment.path) {
            try {
              logContent = fs.readFileSync(attachment.path, 'utf-8')
            } catch {
              // Ignore read errors
            }
          }

          if (logContent) {
            const logs = logContent.split('\n').filter((line) => line.trim())
            if (logs.length > 0) {
              testSteps[stepIndex].consoleLogs = logs
            }
          }
        }
      }
    }

    if (allLogs.length === 0) {
      return
    }

    // IMPORTANT: stdout from test code does NOT include our reporter's â³/âœ… markers
    // Those go directly to terminal, not into test stdout.
    // So we need to distribute logs among steps based on step count.

    // Strategy: If we have N steps and M logs, try to match logs to steps by:
    // 1. Looking for patterns in the logs that might indicate step boundaries
    // 2. Or distribute evenly if logs appear sequential

    // Build step title patterns for potential matching
    const stepTitlePatterns: RegExp[] = testSteps.map((step) => {
      // Create a pattern from the step title (escape special chars)
      const escaped = step.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(escaped, 'i')
    })

    // Track which logs have been assigned
    const assignedLogs: boolean[] = new Array(allLogs.length).fill(false)

    // First pass: Try to match logs to steps by step title content
    for (let logIndex = 0; logIndex < allLogs.length; logIndex++) {
      const log = allLogs[logIndex]

      // Check if this log mentions any step title
      for (let stepIndex = 0; stepIndex < testSteps.length; stepIndex++) {
        if (stepTitlePatterns[stepIndex].test(log)) {
          testSteps[stepIndex].consoleLogs!.push(log)
          assignedLogs[logIndex] = true
          break
        }
      }
    }

    // Second pass: Distribute remaining logs sequentially
    // Assume logs appear in the same order as steps execute
    const unassignedLogs = allLogs.filter((_, idx) => !assignedLogs[idx])

    if (unassignedLogs.length > 0 && testSteps.length > 0) {
      // If we have steps with no logs yet, distribute unassigned logs
      const stepsNeedingLogs = testSteps.filter((s) => s.consoleLogs!.length === 0)

      if (stepsNeedingLogs.length > 0) {
        // Distribute logs evenly among steps that need them
        const logsPerStep = Math.ceil(unassignedLogs.length / testSteps.length)
        let logIdx = 0

        for (
          let stepIdx = 0;
          stepIdx < testSteps.length && logIdx < unassignedLogs.length;
          stepIdx++
        ) {
          const step = testSteps[stepIdx]
          // Add logs to this step (either until we hit logsPerStep or run out of logs)
          const logsForThisStep = Math.min(logsPerStep, unassignedLogs.length - logIdx)

          // Only add if step doesn't already have logs
          if (step.consoleLogs!.length === 0) {
            for (let i = 0; i < logsForThisStep; i++) {
              step.consoleLogs!.push(unassignedLogs[logIdx++])
            }
          }
        }
      } else {
        // All steps have some logs, add remaining to first step
        testSteps[0].consoleLogs!.push(...unassignedLogs)
      }
    }
  }

  private convertStepTree(step: TestStep, testStartTime: number, stepIndex: number): StepData {
    const stepStartTime = new Date(step.startTime).getTime()
    const videoStartTime = stepStartTime - testStartTime
    const videoEndTime = videoStartTime + (step.duration || 0)
    const stepScreenshots: string[] = []

    if (this.attachOptions.screenshot !== 'off') {
      for (const attachment of step.attachments || []) {
        if (attachment.contentType === 'image/png') {
          const dataUri = this.attachmentToDataUri(attachment, 'image/png')
          if (dataUri) {
            stepScreenshots.push(dataUri)
          }
        }
      }
    }

    const childSteps = ((step as unknown as { steps?: TestStep[] }).steps || []).map(
      (child, childIndex) => this.convertStepTree(child, testStartTime, childIndex),
    )

    return {
      title: step.title,
      category: step.category,
      duration: step.duration || 0,
      status: step.error ? 'failed' : 'passed',
      startTime: new Date(step.startTime).toLocaleTimeString(),
      error: step.error?.message,
      stackTrace: step.error?.stack,
      consoleLogs: [],
      stepIndex,
      videoStartTime: Math.max(0, videoStartTime),
      videoEndTime: Math.max(0, videoEndTime),
      screenshots: stepScreenshots,
      children: childSteps,
    }
  }

  private buildSpecCallSteps(
    test: TestCase,
    result: TestResult,
    actionSteps: StepData[],
  ): StepData[] {
    const specCalls = this.extractAwaitedCallsFromSpec(test.location.file, test.location.line)
    if (specCalls.length === 0) {
      return actionSteps
    }

    const groupedDetails = this.groupActionSteps(actionSteps, specCalls.length)

    return specCalls.map((callTitle, index) => {
      const children = groupedDetails[index] || []
      const duration = children.reduce((total, child) => total + child.duration, 0)
      const hasFailedChild = children.some((child) => child.status === 'failed')
      const isFailedTestLastStep =
        result.status !== 'passed' && index === specCalls.length - 1 && !hasFailedChild

      return {
        title: callTitle,
        category: 'spec',
        duration,
        status:
          result.status === 'skipped'
            ? 'skipped'
            : hasFailedChild || isFailedTestLastStep
              ? 'failed'
              : 'passed',
        startTime: children[0]?.startTime || 'N/A',
        consoleLogs: [],
        stepIndex: index,
        videoStartTime: children[0]?.videoStartTime ?? 0,
        videoEndTime: children[children.length - 1]?.videoEndTime ?? 0,
        children,
      }
    })
  }

  private extractAwaitedCallsFromSpec(filePath: string, testLine: number): string[] {
    try {
      const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)
      const bodyLines: string[] = []
      let braceDepth = 0
      let started = false

      for (let index = Math.max(0, testLine - 1); index < lines.length; index++) {
        const line = lines[index]
        if (!started && line.includes('{')) {
          started = true
        }

        if (started) {
          bodyLines.push(line)
          braceDepth += (line.match(/{/g) || []).length
          braceDepth -= (line.match(/}/g) || []).length

          if (braceDepth <= 0 && index > testLine - 1) {
            break
          }
        }
      }

      return bodyLines
        .map((line) => line.trim())
        .filter((line) => line.startsWith('await ') || line.includes('= await '))
        .map((line) => {
          const match = line.match(/(?:const\s+\w+\s*=\s*)?await\s+(.+?)(?:;)?$/)
          return match ? match[1].trim() : ''
        })
        .filter(Boolean)
        .map((call) => call.replace(/;$/, ''))
    } catch {
      return []
    }
  }

  private groupActionSteps(actionSteps: StepData[], groupCount: number): StepData[][] {
    const groups: StepData[][] = Array.from({ length: groupCount }, () => [])
    if (actionSteps.length === 0 || groupCount === 0) {
      return groups
    }

    const groupSize = Math.ceil(actionSteps.length / groupCount)
    for (let index = 0; index < actionSteps.length; index++) {
      const groupIndex = Math.min(Math.floor(index / groupSize), groupCount - 1)
      groups[groupIndex].push(actionSteps[index])
    }

    return groups
  }

  private async generateReport(): Promise<void> {
    const reportDir = path.dirname(this.outputFile)
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }

    const html = this.generateHTML()
    fs.writeFileSync(this.outputFile, html)

    const indexPath = path.join(reportDir, 'index.html')
    const latestRedirect = `<!DOCTYPE html>
<html><head><meta http-equiv="refresh" content="0;url=${path.basename(this.outputFile)}">
<title>SE Report - Latest</title></head>
<body><p>Redirecting to <a href="${path.basename(this.outputFile)}">latest report</a>...</p></body></html>`
    fs.writeFileSync(indexPath, latestRedirect)

    this.generateHistoryPage(reportDir)
  }

  private generateHistoryPage(reportDir: string): void {
    const files = fs
      .readdirSync(reportDir)
      .filter((f) => f.startsWith('report_') && f.endsWith('.html'))
      .sort()
      .reverse()

    const historyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Playwright Report History</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
        .report-list { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .report-item { padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .report-item:hover { background: #eff6ff; }
        .report-link { color: #1d4ed8; text-decoration: none; font-weight: 500; }
        .report-link:hover { text-decoration: underline; }
        .report-date { color: #666; font-size: 12px; }
        .latest-badge { background: #2563eb; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 10px; }
    </style>
</head>
<body>
    <div class="header"><h1>&#128202; Playwright Report History</h1><p>${this.escapeHtml(this.branding.SUBTITLE)}</p></div>
    <div class="report-list">
        ${files
          .map((f, i) => {
            const match = f.match(/report_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.html/)
            const dateStr = match
              ? `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`
              : f
            const latestBadge = i === 0 ? '<span class="latest-badge">LATEST</span>' : ''
            return `<div class="report-item">
                <a href="${f}" class="report-link">${f}${latestBadge}</a>
                <span class="report-date">${dateStr}</span>
            </div>`
          })
          .join('\n')}
    </div>
</body>
</html>`
    fs.writeFileSync(path.join(reportDir, 'history.html'), historyHtml)
  }

  private generateHTML(): string {
    const browserName = this.config.projects[0]?.name || 'chrome'
    const platform =
      process.platform === 'darwin' ? 'Mac' : process.platform === 'win32' ? 'Windows' : 'Linux'
    return getReportHtml(browserName, platform, {
      styles: this.getStyles(),
      scripts: this.getScripts(),
      logoDataUri: reportLogoDataUri,
      statsSection: this.generateMetaSection(browserName, platform),
      metaSection: '',
      runStatusSection: this.generateRunStatus(),
      filtersSection: this.generateFilters(),
      testTableSection: this.generateTestTable(),
      reportName: this.escapeHtml(this.branding.NAME),
      reportSubtitle: this.escapeHtml(this.branding.SUBTITLE),
    })
  }

  private generateMetaSection(browserName: string, platform: string): string {
    const env = process.env.TEST_ENV || process.env.ENV || 'QA'
    const totalDuration = this.endTime.getTime() - this.startTime.getTime()
    const passRate =
      this.suiteStats.total > 0
        ? ((this.suiteStats.passed / this.suiteStats.total) * 100).toFixed(1)
        : '0'

    return `
        <!-- Stats Dashboard -->
        <div class="stats-dashboard">
            <div class="stat-card">
                <div class="stat-value">${this.suiteStats.total}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card passed">
                <div class="stat-value">${this.suiteStats.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-value">${this.suiteStats.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card flaky">
                <div class="stat-value">${this.suiteStats.flaky}</div>
                <div class="stat-label">Flaky</div>
            </div>
            <div class="stat-card skipped">
                <div class="stat-value">${this.suiteStats.skipped}</div>
                <div class="stat-label">Skipped</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${passRate}%</div>
                <div class="stat-label">Pass Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.formatDuration(totalDuration)}</div>
                <div class="stat-label">Duration</div>
            </div>
        </div>

        <!-- Meta Info Bar -->
        <div class="meta-section">
            <div class="meta-item">
                <span class="meta-label">Environment</span>
                <span class="env-badge">&#127760; ${env.toUpperCase()}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Browser</span>
                <span class="browser-badge">&#127757; ${browserName}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Platform</span>
                <span class="meta-value">${platform}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Workers</span>
                <span class="meta-value">${this.config.workers || 1}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Run ID</span>
                <span class="meta-value" style="font-family: 'JetBrains Mono', monospace; font-size: 12px;">${this.runId}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Started</span>
                <span class="meta-value">${this.formatTime(this.startTime)}</span>
            </div>
        </div>`
  }

  private generateSuiteStatus(): string {
    // Combined into meta section - return empty
    return ''
  }

  private generateRunStatus(): string {
    // Combined into meta section - return empty
    return ''
  }

  private generateFilters(): string {
    return `
        <div class="filters">
            <div class="filter-search">
                <strong class="search-label">&#128269; Search:</strong>
                <div class="search-input-wrap">
                    <input
                        id="testSearchInput"
                        type="text"
                        class="test-search-input"
                        placeholder="Search by test name, suite, file, tag, status..."
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button id="searchClearButton" class="search-clear-btn" type="button" onclick="clearSearch()" aria-label="Clear search">&times;</button>
                </div>
            </div>
            <div class="filter-group">
                <strong>&#128202; Status:</strong>
                <label><input type="checkbox" class="status-filter" value="all" checked onchange="filterByStatus(this)"><span>All</span></label>
                <label><input type="checkbox" class="status-filter" value="passed" onchange="filterByStatus(this)"><span>&#9989; Passed</span></label>
                <label><input type="checkbox" class="status-filter" value="failed" onchange="filterByStatus(this)"><span>&#10060; Failed</span></label>
                <label><input type="checkbox" class="status-filter" value="flaky" onchange="filterByStatus(this)"><span>&#128294; Flaky</span></label>
                <label><input type="checkbox" class="status-filter" value="skipped" onchange="filterByStatus(this)"><span>&#9193; Skipped</span></label>
            </div>
        </div>`
  }

  private generateTestTable(): string {
    let html = '<div class="test-browser">'
    const treeRoot = this.getTestTree(this.testResults)
    html += `
        <div class="test-browser-left">
            <div id="noResultsMessage" class="no-results-message">No tests match your current search and filters.</div>
            <div class="test-list-header">
                <div class="test-list-title">Test Cases</div>
                <div class="test-list-count">${this.testResults.length} tests</div>
            </div>
            <div class="test-list tree-list" id="testTreeList">
                ${this.renderTestTreeChildren(treeRoot.children, 0)}
            </div>
        </div>
        <div class="test-browser-right">
            <div id="activeTestDetails" class="test-detail"></div>
        </div>`

    return html
  }

  private getTestTree(results: TestData[]): TestTreeNode {
    const excludedTreeSegments = this.getExcludedTreeSegments()
    const signature = results
      .map((test) =>
        [
          test.id,
          test.file,
          test.describePath.join('>'),
          test.title,
          test.status,
          test.duration,
        ].join('|'),
      )
      .join('||')

    if (this.testTreeCache && this.testTreeCacheKey === signature) {
      return this.testTreeCache
    }

    const root: TestTreeNode = {
      id: 'root',
      name: 'root',
      type: 'root',
      children: [],
    }

    for (const test of results) {
      const relativeFile = path.relative(this.config.rootDir || process.cwd(), test.file)
      const parts = relativeFile.split(/[\\/]+/).filter(Boolean)
      const testsIndex = parts.indexOf('tests')
      const relativeParts = (testsIndex >= 0 ? parts.slice(testsIndex + 1) : parts).filter(
        (part) => !excludedTreeSegments.has(part.toLowerCase()),
      )
      const folderParts = relativeParts.slice(0, -1)
      const specFile = relativeParts[relativeParts.length - 1] || path.basename(test.file)

      let currentNode = root
      let currentPath = 'root'

      for (const folder of folderParts) {
        currentPath = `${currentPath}/folder:${folder}`
        currentNode = this.getOrCreateTreeChild(currentNode, {
          id: currentPath,
          name: folder,
          type: 'folder',
          children: [],
        })
      }

      const describeChain = this.getTreeDescribeChain(test.describePath, specFile)

      for (const describeName of describeChain) {
        currentPath = `${currentPath}/describe:${describeName}`
        currentNode = this.getOrCreateTreeChild(currentNode, {
          id: currentPath,
          name: describeName,
          type: 'describe',
          children: [],
        })
      }

      currentNode.children.push({
        id: `test:${test.id}`,
        name: test.title,
        type: 'test',
        children: [],
        data: test,
      })
    }

    this.testTreeCache = root
    this.testTreeCacheKey = signature
    return root
  }

  private getExcludedTreeSegments(): Set<string> {
    const segmentSet = new Set<string>()
    for (const project of this.config.projects || []) {
      if (project.name) {
        segmentSet.add(project.name.toLowerCase())
      }
    }

    ;['chromium', 'firefox', 'webkit', 'chrome', 'edge', 'safari'].forEach((segment) =>
      segmentSet.add(segment),
    )
    return segmentSet
  }

  private getOrCreateTreeChild(parent: TestTreeNode, candidate: TestTreeNode): TestTreeNode {
    const existing = parent.children.find((child) => child.id === candidate.id)
    if (existing) {
      return existing
    }
    parent.children.push(candidate)
    return candidate
  }

  private stripSpecExtension(fileName: string): string {
    return fileName.replace(path.extname(fileName), '')
  }

  private getTreeDescribeChain(describePath: string[], specFile: string): string[] {
    const specBaseName = this.stripSpecExtension(path.basename(specFile)).toLowerCase()
    const specFileName = path.basename(specFile).toLowerCase()

    const cleaned = describePath
      .map((title) => title.trim())
      .filter((title) => {
        if (!title) {
          return false
        }

        const normalized = title.replace(/[\\/]+/g, '/').toLowerCase()
        const looksLikeSpecFile =
          normalized.endsWith('.spec.ts') ||
          normalized.endsWith('.spec.js') ||
          normalized.endsWith('.spec.tsx') ||
          normalized.endsWith('.spec.mjs') ||
          normalized.endsWith('.spec.cjs') ||
          normalized.includes('.spec.')

        if (looksLikeSpecFile) {
          return false
        }

        if (normalized === specFileName || normalized === specBaseName) {
          return false
        }

        if (
          normalized === 'chromium' ||
          normalized === 'firefox' ||
          normalized === 'webkit' ||
          normalized === 'chrome' ||
          normalized === 'edge' ||
          normalized === 'safari'
        ) {
          return false
        }

        return true
      })

    return cleaned.length > 0 ? cleaned : [this.stripSpecExtension(specFile)]
  }

  private renderTestTreeChildren(children: TestTreeNode[], depth: number): string {
    return children
      .map((child, index) => this.renderTestTreeNode(child, depth, depth === 0 && index === 0))
      .join('')
  }

  private renderTestTreeNode(node: TestTreeNode, depth: number, expandedByDefault = false): string {
    if (node.type === 'test') {
      return this.renderTestLeaf(node.data!)
    }

    const isExpandedByDefault = expandedByDefault
    const nodeClass =
      node.type === 'folder'
        ? 'folder-node'
        : node.type === 'describe'
          ? 'describe-node'
          : 'root-node'
    const icon = node.type === 'folder' ? '&#128193;' : '&#129514;'
    const childHtml = this.renderTestTreeChildren(node.children, depth + 1)

    return `
            <div class="tree-node ${nodeClass}${isExpandedByDefault ? '' : ' collapsed'}" data-tree-node-id="${node.id}" data-tree-node-type="${node.type}">
                <div class="tree-node-header" onclick="toggleTreeNode(this)">
                    <span class="tree-node-toggle">&#9662;</span>
                    <span class="tree-node-icon">${icon}</span>
                    <span class="tree-node-title">${this.escapeHtml(node.name)}</span>
                </div>
                <div class="tree-node-children">
                    ${childHtml}
                </div>
            </div>`
  }

  private renderTestLeaf(test: TestData): string {
    const statusClass =
      test.status === 'passed'
        ? 'passed'
        : test.status === 'failed' || test.status === 'timedOut'
          ? 'failed'
          : test.status === 'flaky'
            ? 'flaky'
            : 'skipped'
    const statusText =
      test.status === 'passed'
        ? 'Passed'
        : test.status === 'failed' || test.status === 'timedOut'
          ? 'Failed'
          : test.status === 'flaky'
            ? 'Flaky'
            : 'Skipped'
    const tagsData = test.tags.join(',').toLowerCase()
    const testGroup =
      test.tags.find((t) => t.includes('P0') || t.includes('P1') || t.includes('P2')) ||
      test.describePath[0] ||
      'E2E'
    const author = process.env.TEST_AUTHOR || 'SE-QA'
    const searchableText = [
      test.title,
      test.fullTitle,
      test.file,
      test.location,
      test.describePath.join(' '),
      test.tags.join(' '),
      testGroup,
      author,
      statusText,
      statusClass,
    ]
      .join(' ')
      .toLowerCase()

    return `
            <div class="tree-leaf">
                <div class="test-list-item ${statusClass}" data-test-id="${test.id}" data-tags="${tagsData}" data-search="${this.escapeHtml(searchableText)}" onclick="selectTest('${test.id}')">
                    <div class="test-list-item-top">
                        <div class="test-list-name">
                            <span class="test-name-link">${this.escapeHtml(test.title)}</span>
                        </div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="detail-template" id="detail-template-${test.id}">
                    ${this.generateTestDetailPanel(test)}
                </div>
            </div>`
  }

  private generateTestDetailPanel(test: TestData): string {
    let html = '<div class="detail-panel">'

    if (test.steps.length > 0) {
      html += `
            <div class="detail-section steps-section">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Test Steps
                </div>
                <div class="section-content">
                    <div class="steps-list">`

      for (let stepIndex = 0; stepIndex < test.steps.length; stepIndex++) {
        html += this.renderStepNode(test.steps[stepIndex], `step-${test.id}-${stepIndex}`, 0)
      }

      html += `
                    </div>
                </div>
            </div>`
    }

    if (test.logs.length > 0) {
      html += `
            <div class="detail-section logs-section section-collapsed">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Test Logs (${test.logs.length} lines)
                </div>
                <div class="section-content">
                    <div class="step-console-content">`

      for (const log of test.logs) {
        html += `<div class="console-line">${this.escapeHtml(log)}</div>`
      }

      html += `
                    </div>
                </div>
            </div>`
    }

    const relativeTestPath = path.relative(process.cwd(), test.file).split(path.sep).join('/')

    html += `
            <div class="detail-section path-section section-collapsed">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Test Path
                </div>
                <div class="section-content">
                    <div class="test-path-value">${this.escapeHtml(relativeTestPath)}</div>
                </div>
            </div>`

    if (test.screenshots.length > 0) {
      html += `
            <div class="detail-section screenshots-section section-collapsed">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Screenshots
                </div>
                <div class="section-content">
                    <div class="screenshots-grid">`

      for (const screenshot of test.screenshots) {
        html += `
                    <div class="screenshot-item">
                        <a href="${screenshot.path}" target="_blank" class="screenshot-link">
                            <img src="${screenshot.path}" alt="${screenshot.name}" class="screenshot-preview"/>
                        </a>
                        <div class="screenshot-name">&#128206; ${this.escapeHtml(screenshot.name)}</div>
                    </div>`
      }

      html += `
                    </div>
                </div>
            </div>`
    }

    if (test.trace) {
      html += `
            <div class="detail-section traces-section section-collapsed">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Traces
                </div>
                <div class="section-content">
                    <a href="${test.trace}" download="${test.id}-trace.zip" class="trace-download">&#128193; Download trace.zip</a>
                </div>
            </div>`
    }

    if (test.video) {
      html += `
            <div class="detail-section videos-section section-collapsed">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Videos
                </div>
                <div class="section-content">
                    <video controls class="test-video" src="${test.video}"></video>
                    <div class="video-link"><a href="${test.video}" download="${test.id}-video.webm">&#128229; Download video</a></div>
                </div>
            </div>`
    }

    if (test.error) {
      html += `
            <div class="detail-section error-section section-collapsed">
                <div class="section-header" onclick="toggleSection(this)">
                    <span class="section-arrow">&#9660;</span> Errors
                </div>
                <div class="section-content">
                    <div class="error-box">
                        <pre class="error-message">${this.escapeHtml(test.error)}</pre>
                        ${test.errorStack ? `<details class="stack-details"><summary>Call Stack</summary><pre class="stack-trace-content">${this.escapeHtml(test.errorStack)}</pre></details>` : ''}
                    </div>
                </div>
            </div>`
    }

    html += '</div>'
    return html
  }

  private renderStepNode(step: StepData, stepId: string, depth: number): string {
    const hasChildren = !!(step.children && step.children.length > 0)
    const screenshots = step.screenshots || []
    const hasScreenshots = screenshots.length > 0
    const hasError = !!step.error
    const isExpandable = hasChildren || hasScreenshots || hasError
    const stepIcon = step.status === 'passed' ? '&#10003;' : '&#10007;'
    const stepClass = step.status
    const indent = Math.min(depth * 18, 54)

    let html = `
            <div class="step-item-container ${hasChildren ? 'has-children' : ''}">
                <div class="step-item ${isExpandable ? 'expandable' : 'leaf'} ${stepClass}" ${isExpandable ? `onclick="toggleStepDetails(this, '${stepId}')"` : ''} style="padding-left: ${16 + indent}px;">
                    ${isExpandable ? '<span class="step-expand-icon">&#9654;</span>' : '<span class="step-expand-placeholder"></span>'}
                    <span class="step-icon ${stepClass}">${stepIcon}</span>
                    <span class="step-name">${this.escapeHtml(step.title)}</span>
                </div>`

    if (!isExpandable) {
      html += `
            </div>`
      return html
    }

    html += `
                <div class="step-details" id="${stepId}" style="display: none;">`

    if (hasScreenshots) {
      html += `
                    <div class="step-screenshot">
                        <div class="step-screenshot-header">&#128247; Screenshot${screenshots.length > 1 ? 's' : ''}</div>`
      for (const screenshot of screenshots) {
        html += `
                        <a href="${screenshot}" target="_blank" class="screenshot-link">
                            <img src="${screenshot}" alt="Step Screenshot" class="step-screenshot-img"/>
                        </a>`
      }
      html += `
                    </div>`
    }

    if (step.error) {
      html += `
                    <div class="step-error">
                        <div class="step-error-header">&#10060; Error</div>
                        <div class="step-error-message">${this.escapeHtml(step.error)}</div>
                    </div>`
      if (step.stackTrace) {
        html += `
                    <div class="step-stack-trace">
                        <div class="step-stack-header">&#128203; Stack Trace</div>
                        <pre class="step-stack-content">${this.escapeHtml(step.stackTrace)}</pre>
                    </div>`
      }
    }

    if (hasChildren) {
      html += `
                    <div class="step-children">`
      for (let childIndex = 0; childIndex < step.children!.length; childIndex++) {
        html += this.renderStepNode(
          step.children![childIndex],
          `${stepId}-child-${childIndex}`,
          depth + 1,
        )
      }
      html += `
                    </div>`
    }

    html += `
                </div>
            </div>`
    return html
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  private loadBrandingConfig(): ReportBrandingConfig {
    const defaults: ReportBrandingConfig = {
      NAME: 'SE Automation Report',
      SUBTITLE: 'SE - Playwright Framework',
      FOLDER_PATH: 'se-report',
    }

    if (
      this.options.branding?.name ||
      this.options.branding?.subtitle ||
      this.options.outputFolder
    ) {
      return {
        NAME: this.options.branding?.name?.trim() || defaults.NAME,
        SUBTITLE: this.options.branding?.subtitle?.trim() || defaults.SUBTITLE,
        FOLDER_PATH: this.options.outputFolder?.trim() || defaults.FOLDER_PATH,
      }
    }

    return defaults
  }

  private resolveReportDir(folderPath: string): string {
    if (path.isAbsolute(folderPath)) {
      return folderPath
    }
    return path.resolve(process.cwd(), folderPath)
  }

  private getStyles(): string {
    return reportStyles
  }

  private getScripts(): string {
    return reportScripts
  }
}
export default CustomSEReporter
