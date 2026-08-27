<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Um trecho da rota que costura a página.
 *
 * GEOMETRIA: o SVG tem tamanho FIXO em px e viewBox 1:1 com esse tamanho.
 * Nada de preserveAspectRatio="none" em trecho com cotovelo: esticar o viewBox
 * achata o ângulo de 30° e a linha perde a relação com a marca. Trecho reto
 * pode esticar — ver `modo` abaixo.
 *
 * A linha se desenha por stroke-dashoffset, disparado por IntersectionObserver
 * — acompanha a leitura em vez de rodar num timer que já terminou quando a
 * pessoa chega ali.
 */

/**
 * `modo` decide o que estica, e isso não é detalhe:
 *
 *   fixo        largura e altura em px, viewBox 1:1. Para trecho COM COTOVELO.
 *   horizontal  estica a largura, altura fixa. Para a régua da faixa de fatos.
 *   vertical    estica a altura, largura fixa. Para o trecho reto das paradas.
 *
 * Usar 'horizontal' num trecho vertical faz o SVG receber width 100% ancorado em left 50%, o que estoura a
 * página no desktop sem aparecer em telas estreitas.
 */
const props = defineProps({
  d: { type: String, required: true },
  largura: { type: [Number, String], default: 120 },
  altura: { type: [Number, String], default: 460 },
  modo: { type: String, default: 'fixo' }, // fixo | horizontal | vertical
  classe: { type: String, default: '' },
})

const estica = () => props.modo !== 'fixo'

const svg = ref(null)
const caminho = ref(null)
let obs
let relogio

function revelar() {
  svg.value?.classList.add('tracada')
}

onMounted(() => {
  // O comprimento tem que ser medido no elemento real: calcular à mão erra
  // em qualquer path com mais de um segmento.
  if (caminho.value) {
    const len = caminho.value.getTotalLength()
    caminho.value.style.setProperty('--len', len)
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revelar()
    return
  }

  obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return
        revelar()
        obs.unobserve(e.target)
      })
    },
    // threshold 0: um trecho mais alto que a viewport nunca atingiria um
    // threshold maior, e a linha ficaria pela metade para sempre.
    { threshold: 0, rootMargin: '0px 0px -40px 0px' },
  )
  if (svg.value) obs.observe(svg.value)

  // Rede de segurança. A linha carrega informação de posição no percurso:
  // melhor aparecer sem animação do que não aparecer.
  relogio = setTimeout(revelar, 3000)
})

onBeforeUnmount(() => {
  obs?.disconnect()
  clearTimeout(relogio)
})
</script>

<template>
  <!-- aria-hidden: "seguir a linha" não é conceito que leitor de tela use. A
       ordem do DOM das paradas já lê como lista linear, independente de qual
       lado cada uma senta visualmente. -->
  <svg
    ref="svg"
    class="rota"
    :class="classe"
    :width="modo === 'horizontal' ? '100%' : largura"
    :height="modo === 'vertical' ? '100%' : altura"
    :viewBox="`0 0 ${largura} ${altura}`"
    :preserveAspectRatio="estica() ? 'none' : 'xMidYMid meet'"
    aria-hidden="true"
    focusable="false"
  >
    <!-- non-scaling-stroke: sem ele o traço engorda junto com a escala e a
         linha de 2px vira uma barra grossa no trecho esticado. -->
    <path ref="caminho" :d="d" :vector-effect="estica() ? 'non-scaling-stroke' : undefined" />
  </svg>
</template>
