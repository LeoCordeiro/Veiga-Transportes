/**
 * Contraste de texto sobre VÍDEO — medido no pixel, não na folha de estilo.
 *
 * Um medidor de contraste comum lê `backgroundColor` do ancestral e compara.
 * Sobre vídeo isso não vale nada: o CSS diz `background: grafite`, mas o que
 * está atrás do texto é um quadro de vídeo que muda de luminância 24 vezes por
 * segundo. O texto pode passar folgado num quadro e sumir no seguinte.
 *
 * Aqui o vídeo é avançado para N instantes, o hero é capturado em cada um, e a
 * luminância real da faixa atrás do texto é medida. O PIOR quadro é o que
 * manda — é ele que define se a headline é legível ou não.
 *
 * Uso: node scripts/contraste-video.mjs <url> [largura]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

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
const [url, larg = '1440'] = process.argv.slice(2)
const largura = Number(larg)
const altura = largura < 768 ? 780 : 900

const perfil = await mkdtemp(path.join(tmpdir(), 'veiga-ctr-'))
const porta = 9900 + (largura % 90)
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`,
  '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required',
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
  if (pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) }
}
const cdp = (m, p = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })) })

await cdp('Page.enable')
await cdp('Emulation.setDeviceMetricsOverride', {
  width: largura, height: altura, deviceScaleFactor: 1, mobile: largura < 768,
})
await cdp('Page.navigate', { url })
await dorme(3200)

/**
 * Força o estado final da revelação por scroll ANTES de medir.
 *
 * Sem isto o bloco do hero ainda está em opacity 0 quando a captura acontece,
 * e o que se mede é o vídeo cru — não o fundo que o texto realmente vai ter.
 */
await cdp('Runtime.evaluate', {
  expression: `document.querySelectorAll('.revela').forEach(e => e.classList.add('dentro'))`,
})
await dorme(500)

// Onde o texto de fato está, em coordenadas de página.
const caixas = await cdp('Runtime.evaluate', {
  expression: `JSON.stringify([...document.querySelectorAll('.hero .h1, .hero-desc, .hero-tag')]
    .map(el => { const r = el.getBoundingClientRect()
      return { alvo: el.className.split(' ')[0], x: Math.round(r.x), y: Math.round(r.y),
               w: Math.round(r.width), h: Math.round(r.height),
               cor: getComputedStyle(el).color } }))`,
  returnByValue: true,
})
const regioes = JSON.parse(caixas.result.result.value)

const lumCanal = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
const lumRGB = (r, g, b) => 0.2126 * lumCanal(r) + 0.7152 * lumCanal(g) + 0.0722 * lumCanal(b)
const lumDeCor = (css) => {
  const n = css.match(/[\d.]+/g).map(Number)
  return lumRGB(n[0], n[1], n[2])
}

const duracao = (await cdp('Runtime.evaluate', {
  expression: 'document.querySelector(".hero video")?.duration || 0', returnByValue: true,
})).result.result.value

const INSTANTES = 10
const pior = {}

for (let i = 0; i < INSTANTES; i++) {
  const t = (duracao / INSTANTES) * i
  await cdp('Runtime.evaluate', {
    expression: `(async()=>{const v=document.querySelector('.hero video');
      if(!v) return; v.pause(); v.currentTime=${t};
      await new Promise(r=>{v.onseeked=r; setTimeout(r,900)});
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))})()`,
    awaitPromise: true,
  })
  // Esconde o texto ANTES de capturar. Sem isso o recorte inclui os próprios
  // glifos brancos, o "claro" da região sobe e a medição fica pessimista —
  // acusa reprovação onde o fundo está bom. visibility mantém o layout, então
  // as coordenadas medidas continuam válidas.
  await cdp('Runtime.evaluate', {
    expression: `document.querySelectorAll('.hero .h1,.hero-desc,.hero-tag,.hero-ctas')
      .forEach(e => e.style.visibility = 'hidden')`,
  })
  const shot = await cdp('Page.captureScreenshot', { format: 'png' })
  const buf = Buffer.from(shot.result.data, 'base64')
  if (process.env.SALVAR) await writeFile(`${process.env.SALVAR}/ctr-${largura}-${i}.png`, buf)
  await cdp('Runtime.evaluate', {
    expression: `document.querySelectorAll('.hero .h1,.hero-desc,.hero-tag,.hero-ctas')
      .forEach(e => e.style.visibility = '')`,
  })

  for (const reg of regioes) {
    if (reg.y < 0 || reg.y + reg.h > altura || reg.w < 4) continue
    // Estatística do fundo puro (o texto foi escondido acima). Interessa o
    // extremo claro, não a média: é a área mais clara que engole texto branco.
    /**
     * O recorte precisa ser materializado com toBuffer() ANTES de stats().
     *
     * `sharp(buf).extract(...).stats()` NÃO mede o recorte: stats() lê a
     * imagem de origem e ignora as transformações pendentes do pipeline.
     * Silenciosamente devolve a estatística da PÁGINA INTEIRA — aqui isso
     * incluía o rodapé claro e a faixa branca, e três regiões completamente
     * diferentes retornavam números idênticos.
     */
    const recorte = await sharp(buf)
      .extract({ left: Math.max(0, reg.x), top: Math.max(0, reg.y), width: Math.min(reg.w, largura - reg.x), height: reg.h })
      .toBuffer()
    const { channels } = await sharp(recorte).stats()
    // Percentil alto do fundo ≈ média + desvio: aproxima a região clara.
    const claro = channels.map((c) => Math.min(255, c.mean + c.stdev))
    const lFundo = lumRGB(claro[0], claro[1], claro[2])
    const lTexto = lumDeCor(reg.cor)
    const razao = (Math.max(lFundo, lTexto) + 0.05) / (Math.min(lFundo, lTexto) + 0.05)
    if (!pior[reg.alvo] || razao < pior[reg.alvo].razao) {
      pior[reg.alvo] = { razao: Math.round(razao * 100) / 100, t: Math.round(t * 10) / 10, cor: reg.cor }
    }
  }
}

console.log(`viewport ${largura}px · ${INSTANTES} instantes do vídeo · pior caso por elemento:\n`)
for (const [alvo, v] of Object.entries(pior)) {
  const min = alvo === 'h1' ? 3 : 4.5 // h1 é texto grande
  const ok = v.razao >= min ? 'PASSA ' : 'REPROVA'
  console.log(`  ${ok} ${alvo.padEnd(10)} ${String(v.razao).padStart(6)}:1  (mínimo ${min})  pior quadro em ${v.t}s`)
}

ws.close(); chrome.kill()
await rm(perfil, { recursive: true, force: true }).catch(() => {})
