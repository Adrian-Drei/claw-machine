import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'file:///C:/Users/mark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
const root = path.resolve('.output/public')
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]))
  try {
    const data = fs.readFileSync(file)
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.mp3':'audio/mpeg'})[path.extname(file)] || 'application/octet-stream')
    res.end(data)
  } catch { res.writeHead(404); res.end() }
})
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve))


let browser
try {
  browser = await chromium.launch({ headless: true, channel: 'msedge' })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  await page.goto('http://127.0.0.1:4173')
  await page.waitForTimeout(500)
  assert.equal(await page.locator('main > div[aria-hidden=true]').evaluate(node => getComputedStyle(node).pointerEvents), 'none')
  await page.screenshot({ path: 'desktop-preview.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth))
  await page.screenshot({ path: 'mobile-preview.png', fullPage: true })
  await page.getByRole('button', { name: 'Drop claw', exact: true }).click()
  await page.locator('p[role=status]').filter({ hasText: 'Hooray!' }).waitFor()
  console.log('PASS desktop/mobile layout, no horizontal overflow, decorative layer ignores pointer input, and successful catch')
} finally { await browser?.close(); server.close() }
