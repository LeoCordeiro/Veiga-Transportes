/**
 * Mede uma página de verdade, via CDP, sem dependência nenhuma.
 *
 * Por que não o Browser pane: ele roda a aba oculta e sem composição.
 * Nesse estado `clientWidth` volta 0, `getBoundingClientRect` mente e
 * rAF/WAAPI congelam — as medições saem lixo COM CARA DE RESULTADO VÁLIDO.
 *
 *
 * Por que não `--dump-dom`: despeja o HTML no evento load, antes de
 * qualquer script assíncrono terminar.
 *
 * Aqui o Chrome sobe headless de verdade, com viewport real, e a medição
 * roda no contexto da página depois que a fonte carregou.
 *
 * Uso:  node scripts/medir.mjs <url> [largura] [altura]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
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
const url = process.argv[2]
const largura = Number(process.argv[3] || 1440)
const altura = Number(process.argv[4] || 900)
if (!url) {
  console.error('uso: node scripts/medir.mjs <url> [largura] [altura]')
  process.exit(1)
}

const perfil = await mkdtemp(path.join(tmpdir(), 'veiga-cdp-'))
const porta = 9222 + (largura % 300)

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${porta}`,
  `--user-data-dir=${perfil}`,
  `--window-size=${largura},${altura}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
], { stdio: 'ignore' })

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

async function alvo() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${porta}/json/list`)
      const abas = await r.json()
      const pagina = abas.find((a) => a.type === 'page')
      if (pagina?.webSocketDebuggerUrl) return pagina.webSocketDebuggerUrl
    } catch { /* ainda subindo */ }
    await esperar(150)
  }
  throw new Error('Chrome nao abriu a porta de debug')
}

const ws = new WebSocket(await alvo())
await new Promise((r) => (ws.onopen = r))

let id = 0
const pendentes = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pendentes.has(m.id)) {
    pendentes.get(m.id)(m)
    pendentes.delete(m.id)
  }
}
const cdp = (method, params = {}) =>
  new Promise((res) => {
    const meu = ++id
    pendentes.set(meu, res)
    ws.send(JSON.stringify({ id: meu, method, params }))
  })

await cdp('Page.enable')
await cdp('Runtime.enable')
// Viewport de layout de verdade — --window-size sozinho não controla a
// largura de layout em telas estreitas, a página diagrama larga e o
// screenshot só recorta.
await cdp('Emulation.setDeviceMetricsOverride', {
  width: largura, height: altura, deviceScaleFactor: 1, mobile: largura < 768,
})
await cdp('Page.navigate', { url })
await esperar(2600)

const MEDIDA = `(async () => {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const raiz = document.documentElement;

  // ── Overflow horizontal ────────────────────────────────────────────
  const larguraViewport = raiz.clientWidth;
  const estouros = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const excede = Math.round(r.right - larguraViewport);
    if (excede > 1) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.pointerEvents === 'none') continue;
      estouros.push({
        tag: el.tagName.toLowerCase(),
        classe: (el.className && el.className.baseVal !== undefined
                  ? el.className.baseVal : String(el.className || '')).slice(0, 46),
        excede,
        texto: (el.textContent || '').trim().slice(0, 32),
      });
    }
  }
  estouros.sort((a, b) => b.excede - a.excede);

  // ── Famílias de fonte realmente renderizadas ───────────────────────
  const fontes = new Set();
  for (const el of document.querySelectorAll('h1,h2,h3,p,span,a,button,div,li')) {
    if (!el.textContent || !el.textContent.trim()) continue;
    fontes.add(getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim());
  }

  // ── Varredura de padrão visual genérico ────────────────────────────
  //
  // EXCEÇÕES DECLARADAS — cada uma precisa de motivo, e o motivo fica aqui.
  // Exceção sem registro é o mesmo que defeito escondido.
  //
  //   .zap  o botão flutuante do WhatsApp é redondo por convenção universal:
  //         é assim em todo site, e é o formato que faz a pessoa reconhecer
  //         o botão sem ler. Quadrado de 2px seguiria o contrato da marca e
  //         perderia a função. Cor e forma aqui são de terceiro, de propósito.
  const EXCECOES_RAIO = ['zap'];
  const isento = (el) => EXCECOES_RAIO.some((c) => el.classList.contains(c));

  const generico = { raioGrande: [], vidro: [], glow: [], textoGradiente: [] };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.borderTopLeftRadius) > 2 && el.offsetWidth > 40 && !isento(el)) {
      generico.raioGrande.push(el.tagName.toLowerCase() + '.' +
        String(el.className || '').slice(0, 28) + ' = ' + cs.borderTopLeftRadius);
    }
    if (cs.backdropFilter && cs.backdropFilter !== 'none') generico.vidro.push(el.tagName.toLowerCase());
    if (cs.backgroundImage.includes('radial-gradient')) generico.glow.push(el.tagName.toLowerCase());
    if (cs.webkitBackgroundClip === 'text') generico.textoGradiente.push(el.tagName.toLowerCase());
  }
  for (const k in generico) generico[k] = [...new Set(generico[k])].slice(0, 6);

  // ── Contraste real de cada texto contra o fundo que ele tem ────────
  const lum = (c) => {
    const [r, g, b] = c.match(/\\d+(\\.\\d+)?/g).slice(0, 3).map(Number).map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const fundoDe = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && !bg.includes('rgba(0, 0, 0, 0)') && bg !== 'transparent') return bg;
      n = n.parentElement;
    }
    return 'rgb(255,255,255)';
  };
  const reprovas = [];
  for (const el of document.querySelectorAll('h1,h2,h3,p,span,a,button,li,figcaption')) {
    const txt = (el.textContent || '').trim();
    if (!txt || el.children.length > 0) continue;
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    const peso = Number(cs.fontWeight) || 400;
    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
    const minimo = grande ? 3 : 4.5;
    const lf = lum(cs.color), lb = lum(fundoDe(el));
    const razao = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
    if (razao < minimo) {
      reprovas.push({
        texto: txt.slice(0, 34), px: Math.round(px), peso,
        razao: Math.round(razao * 100) / 100, minimo,
        cor: cs.color, fundo: fundoDe(el),
      });
    }
  }

  return JSON.stringify({
    viewport: larguraViewport,
    scrollWidth: raiz.scrollWidth,
    overflow: raiz.scrollWidth - larguraViewport,
    estouros: estouros.slice(0, 12),
    fontes: [...fontes],
    generico,
    reprovasContraste: reprovas.slice(0, 14),
    totalReprovas: reprovas.length,
  }, null, 2);
})()`

const r = await cdp('Runtime.evaluate', {
  expression: MEDIDA, awaitPromise: true, returnByValue: true,
})

console.log(r.result?.result?.value ?? JSON.stringify(r, null, 2))

ws.close()
chrome.kill()
await rm(perfil, { recursive: true, force: true }).catch(() => {})
