/**
 * Captura de tela com viewport de layout DE VERDADE.
 *
 * Por que não `chrome --headless --screenshot --window-size=390,2000`:
 * `--window-size` não controla o viewport de LAYOUT em largura estreita. A
 * página continua sendo diagramada larga e o PNG apenas recorta — o resultado
 * parece um site quebrado, com tudo cortado à direita, quando na verdade o
 * layout está correto — o screenshot mostra conteúdo cortado enquanto a
 * medição via CDP reporta overflow = 0, e é a medição que está certa.
 *
 * `Emulation.setDeviceMetricsOverride` aplica o viewport real, e
 * `captureBeyondViewport` pega a página inteira sem precisar rolar.
 *
 * Uso: node scripts/captura.mjs <url> <arquivo.png> [largura] [altura]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

/**
 * Caminho do Chrome. Sobrescreva com a variável CHROME_BIN quando o binário
 * estiver em outro lugar (Linux, macOS ou instalação fora do padrão).
 */
const CHROME =
  process.env.CHROME_BIN ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : 'google-chrome')
const [url, saida, larg = '1440', alt = '2400'] = process.argv.slice(2)
if (!url || !saida) {
  console.error('uso: node scripts/captura.mjs <url> <arquivo.png> [largura] [altura]')
  process.exit(1)
}

const largura = Number(larg)
const altura = Number(alt)
const perfil = await mkdtemp(path.join(tmpdir(), 'veiga-shot-'))
const porta = 9700 + (largura % 200)

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${porta}`,
  `--user-data-dir=${perfil}`,
  '--disable-gpu',
  '--no-first-run',
  '--hide-scrollbars',
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
let id = 0
const pend = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (pend.has(m.id)) {
    pend.get(m.id)(m)
    pend.delete(m.id)
  }
}
const cdp = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id
    pend.set(i, res)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await cdp('Page.enable')
// mobile: true junto com a largura — sem isso as media queries de ponteiro
// grosso não entram e o layout testado não é o que o celular recebe.
await cdp('Emulation.setDeviceMetricsOverride', {
  width: largura,
  height: altura,
  deviceScaleFactor: 1,
  mobile: largura < 768,
})
await cdp('Page.navigate', { url })
await dorme(3000)

// Rola até o fim e volta: acorda todo IntersectionObserver, senão a captura
// pega a metade de baixo da página ainda invisível, com opacity 0.
await cdp('Runtime.evaluate', {
  expression: `(async()=>{const h=document.body.scrollHeight;
    for(let y=0;y<h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}
    window.scrollTo(0,0);await new Promise(r=>setTimeout(r,400))})()`,
  awaitPromise: true,
})

const r = await cdp('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
})

await writeFile(saida, Buffer.from(r.result.data, 'base64'))
console.log(`${saida} — ${largura}x${altura} (viewport real)`)

ws.close()
chrome.kill()
await rm(perfil, { recursive: true, force: true }).catch(() => {})
