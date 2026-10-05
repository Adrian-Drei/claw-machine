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
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173')
  const scene = page.locator('svg[role=img]')
  const balls = scene.locator('image[y="194"]')
  const count = () => balls.count()
  const success = () => page.locator('p[role=status]').filter({ hasText: 'Hooray!' }).waitFor()
  const center = async () => assert.match(await scene.locator('g[transform*="scale(0.8)"]').getAttribute('transform'), /translate\(300, 110\)/)
  async function aimAt(x) {
    const box = await scene.boundingBox()
    await page.mouse.click(box.x + box.width * x / 600, box.y + box.height * 0.5)
    await page.waitForTimeout(700)
  }
  assert.equal(await count(), 3)
  await page.getByRole('button', { name: 'Drop claw', exact: true }).click()
  await success()
  await center()
  assert.equal(await count(), 2)
  await page.keyboard.press('Space')
  assert.equal(await count(), 2)
  console.log('PASS successful delivery returns to center; Space preserves two remaining balls')
  await page.keyboard.press('Space')
  await page.locator('p[role=status]').filter({ hasText: 'Try again!' }).waitFor()
  assert.equal(await count(), 2)
  console.log('PASS removed center ball cannot be caught again; miss preserves inventory')
  await aimAt(155)
  await page.keyboard.press('Space')
  await success()
  await center()
  assert.equal(await count(), 1)
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  assert.equal(await count(), 1)
  console.log('PASS replay button preserves last ball')
  await aimAt(445)
  await page.keyboard.press('Space')
  await success()
  await center()
  assert.equal(await count(), 0)
  await page.getByRole('button', { name: 'Play again with Space', exact: true }).click()
  assert.equal(await count(), 3)
  console.log('PASS final delivery empties machine; retry refills all three')
  assert.equal(errors.length, 0)
  console.log('Browser errors', errors)
} finally { await browser?.close(); server.close() }
