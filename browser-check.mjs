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
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'})[path.extname(file)] || 'application/octet-stream')
    res.end(data)
  } catch { res.writeHead(404); res.end() }
})
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve))
let browser
try {
  browser = await chromium.launch({ headless: true, channel: 'msedge' })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173')
  await page.waitForTimeout(1000)
  await page.evaluate(() => {
    window.clawTrace = []
    const scene = document.querySelector('svg[role="img"]')
    function sample() {
      const transform = scene.querySelector('g[transform*="scale(0.8)"]').getAttribute('transform')
      const values = transform.match(/translate\(([^,]+),\s*([^)]+)\)/)
      window.clawTrace.push({ x: Number(values[1]), y: Number(values[2]) })
      if (!document.querySelector('p[role="status"]').textContent.includes('Hooray!')) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  await page.getByRole('button', { name: 'Drop claw', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Hooray!' }).waitFor({ timeout: 9000 })
  const trace = await page.evaluate(() => window.clawTrace)
  assert(Math.max(...trace.map(point => point.y)) <= 179.01, 'Claw must stop at ball height')
  assert(Math.max(...trace.map((point, index) => index ? Math.abs(point.y - trace[index - 1].y) : 0)) < 15, 'Claw must lift without jumping')
  assert(Math.abs(trace.at(-1).x - 521) < 0.1, 'Delivery must align with opening center')
  await page.screenshot({ path: 'delivery-preview.png', fullPage: true })
  console.log('PASS grab height, continuous lifting, centered chute delivery, and collected prize')
  await page.keyboard.press('Space')
  assert.equal(await page.locator('p[role=status]').textContent(), 'Your little friends are waiting!')
  console.log('PASS Space retries after successful catch')
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  const svg = page.getByRole('img', { name: 'Mint claw machine with three soccer ball friends and a prize chute on the right', exact: true })
  const box = await svg.boundingBox()
  await page.mouse.click(box.x + box.width * 0.13, box.y + box.height * 0.5)
  await page.waitForTimeout(1100)
  console.log('Before drop', await page.locator('svg g').first().getAttribute('transform'), await page.evaluate(() => document.activeElement.tagName)); await page.keyboard.press('Space'); console.log('Status', await page.locator('p[role=status]').textContent())
  await page.getByRole('status').filter({ hasText: 'Try again!' }).waitFor({ timeout: 6000 })
  console.log('PASS tap aiming, keyboard drop, and miss')
  await page.keyboard.down('ArrowRight')
  await page.waitForTimeout(450)
  await page.keyboard.up('ArrowRight')
  console.log('Before drop', await page.locator('svg g').first().getAttribute('transform'), await page.evaluate(() => document.activeElement.tagName)); await page.keyboard.press('Space'); console.log('Status', await page.locator('p[role=status]').textContent())
  await page.getByRole('status').filter({ hasText: 'Hooray!' }).waitFor({ timeout: 9000 })
  console.log('PASS held arrow movement and catch')
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  const left = await page.getByRole('button', { name: 'Move claw left' }).boundingBox()
  await page.mouse.move(left.x + left.width / 2, left.y + left.height / 2)
  assert.match(await page.getByRole('button', { name: 'Move claw left' }).locator('img').getAttribute('src'), /left-button-pressed/)
  await page.mouse.down()
  assert.match(await page.getByRole('button', { name: 'Move claw left' }).locator('img').getAttribute('src'), /left-button-normal/)
  await page.waitForTimeout(450)
  await page.mouse.up()
  await page.getByRole('button', { name: 'Drop claw', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Hooray!' }).waitFor({ timeout: 9000 })
  console.log('PASS held pointer movement')
  await page.getByRole('button', { name: 'Play again with Space', exact: true }).click()
  assert.equal(await page.locator('p[role=status]').textContent(), 'Your little friends are waiting!')
  console.log('PASS clickable Space badge retries')
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  await page.screenshot({ path: 'desktop-preview.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'mobile-preview.png', fullPage: true })
  console.log('Mobile dimensions', await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })))
  assert.equal(errors.length, 0)
  console.log('Browser errors', errors)
} finally { await browser?.close(); server.close() }










