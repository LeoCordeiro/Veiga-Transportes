/**
 * Fonte única do visual. Transcrição direta de
 * design-previews/direcao-aprovada.html — direção 3, "Traçado da Rota".
 *
 * Alimenta duas coisas, e nenhuma outra pode declarar cor:
 *   1. o tema do Vuetify (src/plugins/vuetify.js)
 *   2. as CSS custom properties do documento (aplicarTokens(), no main.js)
 *
 * Hex dentro de um .vue é bug.
 *
 * ── O QUE A DIREÇÃO 3 DECIDE ──────────────────────────────────────────────
 * Uma linha nasce na ponta âmbar do V e desce costurando a página. Cada seção
 * é uma parada, cada parada tem um nó, e a linha se desenha conforme o scroll.
 * O fundo alterna com ela: grafite e claro se revezam, e o conjunto fecha em
 * ~50/50. A linha troca de cor ao cruzar — âmbar sobre grafite, grafite sobre
 * claro — porque âmbar sobre claro mede 1,5:1 e some.
 *
 * ── CONTRASTE MEDIDO (WCAG 2.1) — não é estética, é leitura ────────────────
 *
 *   branco   #FFFFFF / grafite #1A1A1A ....  17,4:1  AAA  texto no escuro
 *   âmbar    #FFC107 / grafite ............  10,7:1  AAA  rótulo e destaque
 *   grafite            / âmbar cheio .......  10,7:1  AAA  o rótulo do CTA
 *   grafite  / claro   #F4F4F4 ............  15,8:1  AAA  texto no claro
 *   cinza    #9A9A9A / grafite ............   6,2:1  AA   secundário escuro
 *   cinzaEsc #5E5E5E / branco .............   6,5:1  AA   secundário claro
 *   cinza2   #8A8A8A / grafite ............   5,0:1  AA   legenda escura
 *   cinza    #9A9A9A / sup2 #2A2A2A .......   5,1:1  AA   rótulo desativado
 *   cinza    #9A9A9A / branco .............   2,8:1  REPROVA
 *   âmbar              / branco ............   1,6:1  REPROVA
 *   âmbar              / claro .............   1,5:1  REPROVA
 *   cinza    #9A9A9A / #333333 ............   4,49:1 REPROVA por 0,01
 *   cinza2   #8A8A8A / #DEDEDE ............   2,6:1  REPROVA
 *
 * Três regras fixas saem daí:
 *   1. Âmbar é preenchimento e ornamento — nunca texto sobre fundo claro.
 *   2. O CTA âmbar leva rótulo GRAFITE, nunca branco.
 *   3. O cinza do secundário muda com o fundo — é o que `textoSobre` resolve.
 *      Consultar sempre, em vez de escolher a cada componente.
 */

export const cores = {
  // Estrutura
  grafite: '#1A1A1A',
  claro: '#F4F4F4',
  branco: '#FFFFFF',

  // Acento — a linha, os nós, o CTA
  ambar: '#FFC107',
  ambarVivo: '#FFCB2B', // só o hover do CTA primário

  // Texto secundário: dois, porque um só não sobrevive aos dois fundos
  cinza: '#9A9A9A', //  6,2:1 sobre grafite ·  2,8:1 sobre branco (reprova lá)
  cinza2: '#8A8A8A', //  5,0:1 sobre grafite — legenda
  cinzaEscuro: '#5E5E5E', //  6,5:1 sobre branco — o secundário do trecho claro

  // Degraus de elevação. São tons derivados do grafite, não matizes novos:
  // resolve hover e pressed sem backdrop-filter, que empobrece o resultado.
  sup1: '#212121', // parada elevada
  sup2: '#2A2A2A', // hover, e o fundo do desativado
  sup3: '#333333', // pressed
  fio: '#2E2E2E', // borda e divisor no escuro

  papel2: '#EAEAEA', // hover no claro
  papel3: '#DEDEDE', // pressed no claro

  // Estado. O erro precisa de duas versões: #B3261E sobre grafite dá 1,8:1
  // (invisível) e #FFB4B4 sobre branco dá 2,1:1. Cada um no seu fundo.
  erro: '#B3261E', // sobre claro — 6,0:1
  erroClaro: '#FFB4B4', // sobre grafite — 8,1:1
  sucesso: '#2E7D46', // sobre claro
  sucessoClaro: '#7BD69B', // sobre grafite
}

/**
 * Cor de texto que sobrevive em cada fundo. Alimenta os tokens `on-*` do
 * Vuetify e o CSS. Quem for pintar texto por cima de uma cor cheia consulta
 * aqui — não decide na hora.
 */
export const textoSobre = {
  grafite: cores.branco,
  ambar: cores.grafite, // 10,7:1. Branco sobre âmbar dá 1,6:1 e some
  claro: cores.grafite,
  branco: cores.grafite,
  sup1: cores.branco,
  sup2: cores.branco,
}

/** Fio translúcido — borda de parada, divisor, remate. */
export const linhas = {
  sobreEscuro: 'rgba(255,255,255,.14)',
  sobreEscuroForte: 'rgba(255,255,255,.30)',
  sobreClaro: 'rgba(26,26,26,.16)',
  sobreClaroForte: 'rgba(26,26,26,.30)',
}

/**
 * A marca é toda aresta reta — o V não tem uma curva sequer. 2px é o limite
 * do que ainda lê como reto numa tela; zero fica áspero nas bordas de campo.
 *
 * O raio NÃO vai na prop `rounded` do Vuetify: ela gera
 * `border-radius: Npx !important` e o contrato de 2px nunca chega. Vai no
 * global.css, com o seletor dobrado.
 */
export const raios = {
  card: '2px',
  botao: '2px',
  campo: '2px',
}

export const medidas = {
  larguraConteudo: '1160px',
  gutter: 'clamp(20px, 5vw, 56px)',
  secaoY: '48px',
  alturaHeader: '64px',
  alturaBotao: '52px',
  no: '11px', // o nó da rota
}

/**
 * Archivo é a fonte da própria logo — a wordmark é Archivo Black Italic 900.
 * Usar outra no display seria desenhar a marca de novo, errado.
 *
 * IBM Plex Mono é só para dado com FUNÇÃO real: bairro, faixa de volume,
 * horário, CNPJ, número de parada. Mono decorativo é enfeite fingindo dado.
 */
export const fontes = {
  display: "'Archivo', system-ui, sans-serif",
  corpo: "'IBM Plex Sans', system-ui, sans-serif",
  dado: "'IBM Plex Mono', ui-monospace, monospace",
}

export const pesos = {
  corpo: 400,
  rotulo: 700,
  forte: 700,
  display: 900, // salto de 500 contra o corpo
}

/**
 * O ângulo da marca: 30° da vertical, razão 0,577 : 1.
 *
 * Derivado das arestas do próprio V:
 *   aresta interna esquerda  36,0 → 65,50   = 29 / 50   = 0,580
 *   lasca âmbar           54.6,94 → 86,148  = 31,4 / 54 = 0,582
 *
 * Todo recorte, wipe e cotovelo de rota usa este ângulo. Nunca 45° — 45° é a
 * diagonal de qualquer marca; 30° é a desta.
 */
export const angulo = {
  tg: 0.577,
  grausDaVertical: 30,
}

/**
 * Movimento. O tom é de rota expressa: rápido, direto, sem hesitação.
 */
export const movimento = {
  swiftOut: 'cubic-bezier(.16,1,.3,1)', // o que chega
  snapIn: 'cubic-bezier(.34,1.56,.64,1)', // overshoot leve, só CTA e nó
  cut: 'cubic-bezier(.65,0,.35,1)', // saída e troca de estado, nunca entrada
  micro: '150ms',
  rapido: '200ms',
  entrada: '280ms',
  assinatura: '300ms',
  rota: '1100ms', // a linha se desenhando é a exceção: precisa de tempo
  stagger: '70ms',
  revelaDesloc: '20px',
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Injeta os tokens como <style id="tokens"> no INÍCIO do <head>.
 *
 * Não usar element.style.setProperty(): style inline vence qualquer folha,
 * inclusive media query. Um token redefinido no mobile passaria a ser ignorado
 * em silêncio — sem erro, sem aviso, só o layout errado.
 */
export function aplicarTokens(doc = document) {
  const par = []
  const add = (k, v) => par.push(`${k}:${v};`)

  Object.entries(cores).forEach(([k, v]) => add(`--c-${kebab(k)}`, v))
  Object.entries(textoSobre).forEach(([k, v]) => add(`--on-${kebab(k)}`, v))
  Object.entries(linhas).forEach(([k, v]) => add(`--l-${kebab(k)}`, v))
  Object.entries(raios).forEach(([k, v]) => add(`--r-${kebab(k)}`, v))
  Object.entries(medidas).forEach(([k, v]) => add(`--m-${kebab(k)}`, v))
  Object.entries(fontes).forEach(([k, v]) => add(`--f-${kebab(k)}`, v))
  Object.entries(pesos).forEach(([k, v]) => add(`--p-${kebab(k)}`, v))
  Object.entries(movimento).forEach(([k, v]) => add(`--t-${kebab(k)}`, v))
  add('--ang-tg', angulo.tg)

  const el = doc.getElementById('tokens') || doc.createElement('style')
  el.id = 'tokens'
  el.textContent = `:root{${par.join('')}}`
  if (!el.isConnected) doc.head.prepend(el)
}
