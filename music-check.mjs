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
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173')
  await page.waitForTimeout(500)
  assert(await page.locator('audio').evaluate(audio => audio.paused && audio.loop))
  await page.getByRole('button', { name: 'Turn sound off', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  await page.waitForFunction(() => { const audio = document.querySelector('audio'); return !audio.paused && audio.currentTime > 0 })
  assert.equal(await page.locator('audio').evaluate(audio => audio.volume), 0.35)
  console.log('PASS supplied MP3 plays at background volume and starts enabled on first game button interaction')
  await page.getByRole('button', { name: 'Turn sound off', exact: true }).click()
  const pausedAt = await page.locator('audio').evaluate(audio => audio.currentTime)
  await page.waitForTimeout(300)
  assert(await page.locator('audio').evaluate(audio => audio.paused))
  assert.equal(await page.locator('audio').evaluate(audio => audio.currentTime), pausedAt)
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  assert(await page.locator('audio').evaluate(audio => audio.paused))
  await page.getByRole('button', { name: 'Turn sound on', exact: true }).click()
  await page.waitForFunction(time => document.querySelector('audio').currentTime > time, pausedAt)
  console.log('PASS sound toggle pauses and resumes the track')
  await page.getByRole('button', { name: 'Play again', exact: true }).click()
  assert(await page.locator('audio').evaluate(audio => !audio.paused))
  await page.locator('audio').evaluate(audio => { audio.currentTime = audio.duration - 0.2 })
  await page.waitForFunction(() => document.querySelector('audio').currentTime < 2)
  console.log('PASS music survives replay and loops at the end')
  assert.equal(errors.length, 0)
  console.log('Browser errors', errors)
} finally { await browser?.close(); server.close() }

