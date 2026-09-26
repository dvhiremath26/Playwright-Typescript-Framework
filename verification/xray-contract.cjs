const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

test('Xray annotations and standalone latest custom report survive pass/fail/skip', async () => {
  const root = path.resolve(__dirname, '..')
  const dir = await fs.mkdtemp(path.join(root, '.xray-contract-'))
  assert.equal(path.dirname(dir), root)
  try {
    await fs.writeFile(path.join(dir, 'playwright.config.ts'), `
      import base from '../playwright.config'
      import { resolve } from 'node:path'
      export default { ...base, testDir: '.', workers: 1, reporter: base.reporter.map(entry =>
        Array.isArray(entry) && entry[0] === './src/utils/custom-report'
          ? [resolve(__dirname, '../src/utils/custom-report'), entry[1]] : entry
      ) }
    `)
    await fs.writeFile(path.join(dir, 'contract.spec.ts'), `
      import { test, expect } from '@playwright/test'
      import { xray } from '../src/utils/xray'
      test('contract pass', xray('CHECK-1'), async ({}, info) => {
        await info.attach('evidence', { body: Buffer.from('evidence'), contentType: 'image/png' })
        expect(1).toBe(1)
      })
      test('contract failure', xray('CHECK-2'), async () => { expect(1).toBe(2) })
      test.skip('contract skip', xray('CHECK-3'), async () => {})
    `)
    const args = [path.join(root, 'node_modules/@playwright/test/cli.js'), 'test', '--project=chromium']
    const options = { cwd: dir, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, env: {
      ...process.env, CI: 'true', XRAY_RUN: 'true', ENV: 'qa',
    } }
    const list = spawnSync(process.execPath, [...args, '--list', '--reporter=json'], options)
    assert.equal(list.status, 0, list.stderr)
    const discovered = JSON.parse(list.stdout)
    assert.equal(discovered.config.projects[0].retries, 0)
    const specs = discovered.suites.flatMap(s => s.specs ?? [])
    assert.equal(specs.length, 3)
    for (const spec of specs) {
      const key = spec.tags[0].replace(/^@/, '')
      assert.ok(spec.tests[0].annotations.some(a => a.type === 'test_key' && a.description === key))
    }
    const run = spawnSync(process.execPath, args, options)
    assert.equal(run.status, 1, 'Intentional failure must fail the process')
    const xml = await fs.readFile(path.join(dir, 'results/xray-results.xml'), 'utf8')
    for (const key of ['CHECK-1', 'CHECK-2', 'CHECK-3']) assert.ok(xml.includes(`name="test_key" value="${key}"`))
    assert.equal((xml.match(/<testcase\s/g) ?? []).length, 3)
    assert.ok(xml.includes('<failure'))
    assert.ok(xml.includes('<skipped'))
    const reportDir = path.join(dir, 'TCOE-Report')
    const html = await fs.readFile(path.join(reportDir, 'index.html'), 'utf8')
    assert.ok(html.includes('contract pass'))
    assert.ok(html.includes('contract failure'))
    assert.ok(html.includes('data:image/png;base64,ZXZpZGVuY2U='))
    assert.ok(!/<meta[^>]+http-equiv=["']refresh/i.test(html))
    const archive = (await fs.readdir(reportDir)).find(name => /^report_.*\.html$/.test(name))
    assert.ok(archive)
    assert.equal(html, await fs.readFile(path.join(reportDir, archive), 'utf8'))
    assert.ok((await fs.readFile(path.join(reportDir, 'history.html'), 'utf8')).includes(archive))
  } finally {
    // Only remove this generated, checked child directory.
    await fs.rm(dir, { recursive: true, force: true })
  }
})
