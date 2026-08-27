/** Avalia uma expressão JS no contexto real da página, via CDP. Depuração pontual.
 *  uso: node scripts/avaliar.mjs <url> "<expressao>" [largura] */
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
const CHROME =
  process.env.CHROME_BIN ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : 'google-chrome')

const [url, expr, larg = '1440'] = process.argv.slice(2)
const perfil = await mkdtemp(path.join(tmpdir(), 'veiga-cdp-'))
const porta = 9500 + (Number(larg) % 200)
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`,
  `--window-size=${larg},900`, '--disable-gpu', '--no-first-run', '--hide-scrollbars',
], { stdio: 'ignore' })
const dorme = (ms) => new Promise((r) => setTimeout(r, ms))
let wsUrl
for (let i = 0; i < 40 && !wsUrl; i++) {
  try {
    const abas = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json()
    wsUrl = abas.find((a) => a.type === 'page')?.webSocketDebuggerUrl
  } catch {}
  if (!wsUrl) await dorme(150)
}
const ws = new WebSocket(wsUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0; const p = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } }
const cdp = (method, params = {}) => new Promise((res) => { const i = ++id; p.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
await cdp('Page.enable'); await cdp('Runtime.enable')
await cdp('Page.navigate', { url }); await dorme(2600)
const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
console.log(JSON.stringify(r.result?.result?.value ?? r.result, null, 2))
ws.close(); chrome.kill(); await rm(perfil, { recursive: true, force: true }).catch(() => {})
