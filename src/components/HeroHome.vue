<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import RotaTraco from './RotaTraco.vue'
import posterHero from '@/assets/fotos/hero-video-poster.jpg'

/**
 * Hero da home — a parada 00, de onde a rota nasce.
 *
 * O vídeo aéreo é FUNDO da seção inteira, com o conteúdo por cima.
 *
 * ── SOBRE O ÁUDIO ─────────────────────────────────────────────────────────
 * O vídeo NÃO pode começar com som, e isso não é escolha de projeto: Chrome,
 * Safari e Firefox bloqueiam autoplay com áudio. Um `play()` com som antes de
 * qualquer gesto é rejeitado e o vídeo simplesmente não começa. O fluxo é:
 *
 *   1. toca mudo — autoplay permitido, o fundo se mexe desde o primeiro quadro
 *   2. no primeiro gesto do usuário em qualquer lugar da página, o som entra
 *   3. o botão de som fica sempre visível, para ligar ou desligar na mão
 *
 * Volume 0,12: som ambiente de verdade. Acima disso o vídeo compete com quem
 * está lendo, e o primeiro reflexo de quem chega vira procurar o botão de
 * desligar.
 *
 * ── O TRECHO ──────────────────────────────────────────────────────────────
 * O arquivo já vem cortado a partir do segundo 5 do original, então o loop
 * volta para o segundo 5 — não para o começo do vídeo bruto.
 */
const VOLUME_AMBIENTE = 0.12

const video = ref(null)
const pronto = ref(false)
const tocando = ref(false)
const comSom = ref(false)

// O vídeo mora em public/ e o caminho é montado em runtime, com :src. Escrito
// direto no atributo, o Rollup tenta resolvê-lo como import e o build quebra.
const videoMp4 = `${import.meta.env.BASE_URL}video/hero-veiga.mp4`

// O cotovelo desce 104 e anda 60: 60/104 = 0,577 — os 30° do V.
const CAMINHO_HERO = 'M8 10 L8 150 L68 254 L68 460'

const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function tocar() {
  const p = video.value?.play()
  if (p?.catch) p.catch(() => {})
}

function aoCarregar() {
  pronto.value = true
  video.value.volume = VOLUME_AMBIENTE
  // Aba oculta pausa vídeo por conta própria: dar play nela gasta banda e não
  // aparece para ninguém.
  if (!reduzido() && !document.hidden) {
    tocar()
    tocando.value = true
  }
}

const EVENTOS = ['pointerdown', 'keydown', 'touchstart']

function removerGestos() {
  EVENTOS.forEach((e) => document.removeEventListener(e, ligarSomNoPrimeiroGesto))
}

/**
 * Liga o som no primeiro gesto — qualquer clique, toque ou tecla na página.
 * Antes disso o navegador recusa, e insistir só enche o console de erro.
 *
 * Quem pediu menos movimento não recebe som: som ambiente inesperado é o
 * mesmo tipo de incômodo que a preferência existe para evitar.
 */
function ligarSomNoPrimeiroGesto() {
  if (!video.value || comSom.value || reduzido()) return
  video.value.muted = false
  video.value.volume = VOLUME_AMBIENTE
  comSom.value = true
  if (video.value.paused) tocar()
  removerGestos()
}

function alternarSom() {
  if (!video.value) return
  comSom.value = !comSom.value
  video.value.muted = !comSom.value
  video.value.volume = VOLUME_AMBIENTE
  // Decisão manual manda: depois de desligar na mão, nenhum gesto religa.
  removerGestos()
}

function alternarPausa() {
  if (!video.value) return
  if (video.value.paused) {
    tocar()
    tocando.value = true
  } else {
    video.value.pause()
    tocando.value = false
  }
}

onMounted(() => {
  video.value?.addEventListener('loadeddata', aoCarregar)
  EVENTOS.forEach((e) =>
    document.addEventListener(e, ligarSomNoPrimeiroGesto, { passive: true }),
  )
})

onBeforeUnmount(() => {
  video.value?.removeEventListener('loadeddata', aoCarregar)
  removerGestos()
})
</script>

<template>
  <section class="hero" id="hero">
    <!-- Fundo: vídeo mais as duas camadas de tratamento. aria-hidden e sem
         controles nativos — é cenário, não conteúdo. -->
    <div class="hero-fundo" aria-hidden="true">
      <video
        ref="video"
        :poster="posterHero"
        muted
        loop
        playsinline
        preload="auto"
        disablepictureinpicture
      >
        <source :src="videoMp4" type="video/mp4" />
      </video>
      <!-- Fallback de quem pediu menos movimento: o vídeo some e este fica.
           O poster é atributo do <video> e sumiria junto com ele. -->
      <img class="hero-parado" :src="posterHero" alt="" />
      <span class="hero-tinta"></span>
      <span class="hero-veu"></span>
    </div>

    <div class="container hero-in">
      <RotaTraco class="rota-hero" :d="CAMINHO_HERO" :largura="120" :altura="460" />

      <div class="hero-txt">
        <div class="hero-inicio" v-revela>
          <span class="no-parada"></span>
          <span class="dado hero-tag">Grande São Paulo · capital e região</span>
        </div>

        <h1 class="h1" v-revela="60">Todo pedido tem um caminho.<br />Nós traçamos.</h1>

        <p class="corpo hero-desc" v-revela="120">
          Rede de entregadores sob demanda em toda a Grande São Paulo. Você chama
          e alguém responde na hora — a central aciona quem já está mais perto da
          sua porta.
        </p>

        <div class="hero-ctas" v-revela="180">
          <v-btn to="/para-negocios" color="primary" class="btn-rota" variant="flat">
            <span class="no" aria-hidden="true"></span>Solicitar entregas
          </v-btn>
          <v-btn to="/seja-entregador" class="btn-rota btn-linha" variant="outlined">
            <span class="no" aria-hidden="true"></span>Seja um entregador
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Movimento e som automáticos precisam de mecanismo de parada
         (WCAG 2.2.2 e 1.4.2). Só aparecem quando há vídeo de fato carregado —
         controle que não controla nada confunde mais do que ajuda. -->
    <div v-if="pronto" class="hero-controles">
      <button class="ctrl" type="button" :aria-pressed="comSom" @click="alternarSom">
        <span
          class="ctrl-icone"
          :class="comSom ? 'ctrl-icone--som' : 'ctrl-icone--mudo'"
          aria-hidden="true"
        ></span>
        {{ comSom ? 'Som ligado' : 'Som' }}
      </button>
      <button class="ctrl" type="button" @click="alternarPausa">
        <span
          class="ctrl-icone"
          :class="tocando ? 'ctrl-icone--pausa' : 'ctrl-icone--play'"
          aria-hidden="true"
        ></span>
        {{ tocando ? 'Pausar' : 'Tocar' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--c-grafite);
  min-height: 78vh;
  display: flex;
  align-items: center;
  padding-block: 56px 72px;
}

/* ── Fundo ───────────────────────────────────────────────────────────────*/
.hero-fundo {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--c-grafite);
}
.hero-fundo video,
.hero-fundo .hero-parado {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-parado {
  position: absolute;
  inset: 0;
  display: none;
}
/**
 * Duotone por filtro CSS, e não pelo filtro SVG que trata as fotos.
 *
 * `filter: url(#duotone-veiga)` num vídeo de tela cheia a 24 fps obriga o
 * navegador a rodar o filtro SVG quadro a quadro, fora do caminho rápido de
 * composição — e engasga em Android de entrada, que é justamente o celular do
 * público. Dessaturar e escurecer é caminho de GPU; a cor da marca vem da
 * camada de tinta, que é só blend.
 */
.hero-fundo video,
.hero-fundo .hero-parado {
  filter: grayscale(1) contrast(1.06) brightness(0.62);
}
/* Âmbar em blend de cor: tinge sem clarear, ao contrário de overlay. */
.hero-tinta {
  position: absolute;
  inset: 0;
  background: var(--c-ambar);
  mix-blend-mode: color;
  opacity: 0.42;
}
/**
 * O véu que garante a leitura. É gradiente e não cor chapada porque o texto
 * fica à esquerda: ali precisa de grafite quase sólido, e à direita a imagem
 * pode respirar. Os valores saem da medição de contraste: o fundo varia de luminância a
 * cada quadro, e o pior quadro é que manda.
 */
.hero-veu {
  position: absolute;
  inset: 0;
  /**
   * No mobile o texto ocupa a largura inteira, então o gradiente horizontal
   * não protege nada: o véu tem que ser quase sólido. Sem isso o corpo fica abaixo do mínimo de 4,5:1.
   */
  background:
    linear-gradient(
      90deg,
      rgba(26, 26, 26, 0.86) 0%,
      rgba(26, 26, 26, 0.74) 55%,
      rgba(26, 26, 26, 0.52) 100%
    ),
    linear-gradient(
      180deg,
      rgba(26, 26, 26, 0.62) 0%,
      rgba(26, 26, 26, 0.3) 42%,
      rgba(26, 26, 26, 0.78) 100%
    );
}

/* ── Conteúdo ────────────────────────────────────────────────────────────*/
.hero-in {
  position: relative;
  z-index: 2;
  width: 100%;
}
.rota-hero {
  position: absolute;
  left: -2px;
  top: -30px;
  z-index: 1;
  pointer-events: none;
}
.hero-txt {
  padding-left: 34px;
  max-width: 640px;
}
/**
 * O rótulo âmbar precisa de fundo PRÓPRIO.
 *
 * Sobre o vídeo o âmbar fica entre 2,3:1 e 3,4:1 e reprova: a cor não
 * sobrevive a fundo variável. Com grafite sólido atrás, o par volta a ser
 * âmbar/grafite, que mede 10,7:1 em qualquer quadro.
 */
.hero-inicio {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  margin-left: -34px;
  padding: 8px 14px 8px 10px;
  background: var(--c-grafite);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 7px) 100%, 0 100%);
}
.hero-inicio .no-parada {
  margin-left: 6px;
}
.hero-tag {
  color: var(--c-ambar);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hero .h1 {
  font-size: clamp(2.4rem, 1.5rem + 3.4vw, 4.75rem);
}
/* Sobre vídeo o secundário sobe para branco quase puro: o #9A9A9A que serve
   em fundo estático não sobrevive à variação de luminância de um fundo que
   se mexe. */
.hero-desc {
  max-width: 38ch;
  margin-block: 20px 28px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-rota.v-btn {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 26px));
  padding-inline: 26px;
}
.btn-rota .no {
  width: 7px;
  height: 7px;
  background: currentColor;
  flex: none;
  margin-right: 12px;
  transition: transform 400ms var(--t-snap-in);
}
.btn-rota:hover .no {
  transform: scale(1.45);
}
/* O secundário ganha fundo próprio: sobre vídeo, botão de contorno vazado
   perde a borda quando passa uma área clara atrás. */
.btn-linha.v-btn {
  border-color: var(--c-ambar);
  color: var(--c-branco);
  background: rgba(26, 26, 26, 0.6);
}

/* ── Controles do fundo ──────────────────────────────────────────────────*/
/**
 * Controles no canto inferior ESQUERDO, não no direito.
 *
 * O botão flutuante do WhatsApp é `fixed` no canto inferior direito, e o hero
 * ocupa quase a tela inteira — os dois disputavam o mesmo canto e chegavam a
 * encostar. O lado esquerdo está livre, e ainda fica junto da rota, que é
 * onde o vocabulário da página já vive.
 */
.hero-controles {
  position: absolute;
  left: var(--m-gutter);
  bottom: 16px;
  z-index: 3;
  display: flex;
  gap: 8px;
}
.ctrl {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--l-sobre-escuro-forte);
  background: rgba(26, 26, 26, 0.8);
  color: var(--c-branco);
  border-radius: var(--r-botao);
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color 160ms var(--t-swift-out),
    border-color 160ms var(--t-swift-out);
}
.ctrl:hover {
  background: var(--c-grafite);
  border-color: var(--c-ambar);
}
.ctrl[aria-pressed='true'] {
  border-color: var(--c-ambar);
}
.ctrl-icone {
  width: 9px;
  height: 10px;
  background: currentColor;
  flex: none;
}
.ctrl-icone--pausa {
  clip-path: polygon(0 0, 35% 0, 35% 100%, 0 100%, 0 0, 65% 0, 100% 0, 100% 100%, 65% 100%);
}
.ctrl-icone--play {
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
/* Alto-falante: um trapézio. O mudo perde o bico, no corte de 30° da marca. */
.ctrl-icone--som {
  clip-path: polygon(0 30%, 40% 30%, 100% 0, 100% 100%, 40% 70%, 0 70%);
}
.ctrl-icone--mudo {
  clip-path: polygon(0 30%, 40% 30%, 100% 0, 100% 42%, 52% 100%, 40% 70%, 0 70%);
  opacity: 0.62;
}

@media (min-width: 960px) {
  .hero {
    min-height: 86vh;
    padding-block: 80px 96px;
  }
  .hero-txt {
    max-width: 680px;
  }
  /* No desktop sobra largura à direita, então o véu pode abrir mais e deixar
     a cidade aparecer — o texto continua sobre a faixa densa da esquerda. */
  .hero-veu {
    background:
      linear-gradient(
        90deg,
        rgba(26, 26, 26, 0.88) 0%,
        rgba(26, 26, 26, 0.62) 48%,
        rgba(26, 26, 26, 0.2) 100%
      ),
      linear-gradient(
        180deg,
        rgba(26, 26, 26, 0.42) 0%,
        rgba(26, 26, 26, 0.14) 45%,
        rgba(26, 26, 26, 0.6) 100%
      );
  }
}

/* Sem movimento: o vídeo não toca. Fica o poster, com o mesmo tratamento. */
@media (prefers-reduced-motion: reduce) {
  .hero-fundo video {
    display: none;
  }
  .hero-fundo .hero-parado {
    display: block;
  }
}
</style>
