/**
 * Extrai os assets da marca a partir da geometria oficial do V.
 *
 * A geometria é a oficial da marca: dois paths num viewBox 130x148, copiados
 * do arquivo original do logotipo. Não redesenhar — qualquer ajuste aqui
 * desalinha o site do material impresso e do adesivo de frota.
 *
 * Só o V vira arquivo. O lockup com "VEIGA / TRANSPORTES" é montado em Vue
 * (MarcaLockup.vue), não em SVG: <text> dentro de um SVG carregado por <img>
 * ignora a webfont da página e cai numa fonte do sistema — o wordmark sairia
 * errado justamente onde a marca é mais reconhecível.
 *
 * Rodar uma vez: npm run icones
 */
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const GRAFITE = '#1A1A1A'
const AMBAR = '#FFC107'
const BRANCO = '#FFFFFF'

// Geometria oficial — viewBox "0 0 130 148"
const CORPO = 'M0 0 H36 L65 50 L94 0 H130 L74.8 95 L77.5 108 L54.6 94 Z'
const LASCA = 'M54.6 94 L77.5 108 L86 148 Z' // a ponta âmbar
const W = 130
const H = 148

/** O V solto, em duas cores. `mono` usa currentColor nos dois paths. */
const vSvg = ({ corpo, lasca }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">` +
  `<path d="${CORPO}" fill="${corpo}"/><path d="${LASCA}" fill="${lasca}"/></svg>`

/**
 * O V dentro de um quadrado — favicon e app icon.
 *
 * `ocupacao` .52 é o que o canvas usa nas pranchas de 96/48/32/16: o V ocupa
 * pouco mais da metade da largura e sobra respiro nos quatro lados. Abaixo
 * disso o V some no 16px; acima, encosta na borda.
 */
const quadradoSvg = ({ lado, raio, fundo, corpo, lasca, ocupacao = 0.52 }) => {
  const escala = (lado * ocupacao) / W
  const x = (lado - W * escala) / 2
  const y = (lado - H * escala) / 2
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">` +
    `<rect width="${lado}" height="${lado}" rx="${raio}" fill="${fundo}"/>` +
    `<g transform="translate(${x} ${y}) scale(${escala})">` +
    `<path d="${CORPO}" fill="${corpo}"/><path d="${LASCA}" fill="${lasca}"/></g></svg>`
  )
}

const circuloSvg = ({ lado, fundo, corpo, lasca, ocupacao = 0.52 }) => {
  const escala = (lado * ocupacao) / W
  const x = (lado - W * escala) / 2
  const y = (lado - H * escala) / 2
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">` +
    `<circle cx="${lado / 2}" cy="${lado / 2}" r="${lado / 2}" fill="${fundo}"/>` +
    `<g transform="translate(${x} ${y}) scale(${escala})">` +
    `<path d="${CORPO}" fill="${corpo}"/><path d="${LASCA}" fill="${lasca}"/></g></svg>`
  )
}

const png = (svg, arquivo) =>
  sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(arquivo)

const pngBuffer = (svg, lado) =>
  sharp(Buffer.from(svg)).resize(lado, lado).png({ compressionLevel: 9 }).toBuffer()

/**
 * Monta um .ico de verdade, com vários tamanhos dentro.
 *
 * Ainda é necessário: navegador e agregador de link pedem /favicon.ico na raiz
 * por conta própria, antes de ler qualquer <link> do HTML. Sem o arquivo, a
 * requisição volta 404 e alguns caem no ícone genérico mesmo com o SVG
 * declarado corretamente.
 *
 * O formato é simples: cabeçalho de 6 bytes, uma entrada de 16 bytes por
 * tamanho, e os PNGs concatenados no fim. Largura 0 significaria 256.
 */
function montarIco(imagens) {
  const cabecalho = Buffer.alloc(6)
  cabecalho.writeUInt16LE(0, 0) // reservado
  cabecalho.writeUInt16LE(1, 2) // 1 = ícone
  cabecalho.writeUInt16LE(imagens.length, 4)

  let deslocamento = 6 + imagens.length * 16
  const entradas = imagens.map(({ lado, dados }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(lado >= 256 ? 0 : lado, 0)
    e.writeUInt8(lado >= 256 ? 0 : lado, 1)
    e.writeUInt8(0, 2) // paleta
    e.writeUInt8(0, 3) // reservado
    e.writeUInt16LE(1, 4) // planos
    e.writeUInt16LE(32, 6) // bits por pixel
    e.writeUInt32LE(dados.length, 8)
    e.writeUInt32LE(deslocamento, 12)
    deslocamento += dados.length
    return e
  })

  return Buffer.concat([cabecalho, ...entradas, ...imagens.map((i) => i.dados)])
}

await mkdir('src/assets/marca', { recursive: true })
await mkdir('public', { recursive: true })

// ── SVGs da marca, para uso dentro do site ────────────────────────────────
await writeFile('src/assets/marca/v-duo.svg', vSvg({ corpo: GRAFITE, lasca: AMBAR }))
await writeFile('src/assets/marca/v-inv.svg', vSvg({ corpo: BRANCO, lasca: AMBAR }))
await writeFile('src/assets/marca/v-mono.svg', vSvg({ corpo: 'currentColor', lasca: 'currentColor' }))

// ── Favicon ───────────────────────────────────────────────────────────────
// O SVG é o favicon principal (todo navegador atual lê). Os PNGs existem para
// quem não lê SVG e para a aba em telas comuns.
const raioProporcional = (lado) => Math.round(lado * 0.15)

/**
 * O V ocupa mais espaço nos tamanhos pequenos.
 *
 * Em 16 px a proporção de 0,52 deixa o glifo com 8 px de largura e ele vira um
 * borrão na aba. O arquivo original da marca já previa isso: a prancha de 16 px
 * desenha o V com 9 px, ou seja 0,56. Abaixo de 32 px vale abrir mão do respiro
 * em volta para manter a forma reconhecível.
 */
const ocupacaoPara = (lado) => (lado <= 32 ? 0.6 : 0.52)
const marcaQuadrada = (lado) =>
  quadradoSvg({
    lado,
    raio: raioProporcional(lado),
    fundo: GRAFITE,
    corpo: BRANCO,
    lasca: AMBAR,
    ocupacao: ocupacaoPara(lado),
  })

await writeFile('public/favicon.svg', marcaQuadrada(100))
for (const lado of [16, 32, 48, 96]) {
  await png(marcaQuadrada(lado), `public/favicon-${lado}.png`)
}

// favicon.ico com 16, 32 e 48 dentro do mesmo arquivo.
const dentroDoIco = []
for (const lado of [16, 32, 48]) {
  dentroDoIco.push({ lado, dados: await pngBuffer(marcaQuadrada(lado), lado) })
}
await writeFile('public/favicon.ico', montarIco(dentroDoIco))

// iOS aplica a própria máscara de canto: fundo cheio, raio 0. Com raio o ícone
// ganha uma borda escura dentro do arredondado do sistema.
await png(
  quadradoSvg({ lado: 180, raio: 0, fundo: GRAFITE, corpo: BRANCO, lasca: AMBAR, ocupacao: 0.56 }),
  'public/apple-touch-icon.png',
)

// Avatar de perfil — fundo âmbar, V grafite (o par de 10,7:1 da tabela).
await png(
  circuloSvg({ lado: 512, fundo: AMBAR, corpo: GRAFITE, lasca: GRAFITE }),
  'public/avatar-veiga.png',
)

// Card de compartilhamento (WhatsApp, link no grupo). 1200x630.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${GRAFITE}"/>
<g transform="translate(497 175) scale(1.55)">
<path d="${CORPO}" fill="${BRANCO}"/><path d="${LASCA}" fill="${AMBAR}"/></g></svg>`
await png(og, 'public/og-veiga.png')

console.log('marca gerada: 3 svg + 7 png + favicon.ico (16/32/48)')
