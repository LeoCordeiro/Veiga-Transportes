<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Count-up sem dependência.
 *
 * O elemento nasce com o VALOR FINAL no HTML. Quem está sem JS, com
 * prefers-reduced-motion ou usando leitor de tela recebe o número verdadeiro —
 * nunca um zero. A animação só substitui um valor que já estava certo.
 *
 * A curva é easeOutExpo, a expressão em JS da `swift-out` do projeto: as duas
 * desaceleram forte no fim, como odômetro parando. Implementar um solver de
 * cubic-bezier para diferença invisível seria trabalho sem retorno.
 *
 * Duração 620ms é o teto — acima disso o contador vira espetáculo, e a marca
 * vende velocidade.
 */
const props = defineProps({
  valor: { type: Number, required: true },
  prefixo: { type: String, default: '' },
  sufixo: { type: String, default: '' },
  decimais: { type: Number, default: 0 },
  duracao: { type: Number, default: 620 },
})

const formatar = (n) =>
  props.prefixo +
  n.toLocaleString('pt-BR', {
    minimumFractionDigits: props.decimais,
    maximumFractionDigits: props.decimais,
  }) +
  props.sufixo

const alvo = ref(null)
const texto = ref(formatar(props.valor)) // já nasce pronto
let obs
let quadro

/**
 * Salto para o valor final. Existe por um motivo específico:
 *
 * requestAnimationFrame PARA quando a aba fica oculta. Se isso acontecer no
 * meio da contagem, o número congela num valor intermediário — e aí a faixa
 * de fatos passa a exibir "1 modalidade" e "2 veículos" quando a verdade é 2
 * e 3. Não é uma animação truncada: é um número ERRADO na tela, apresentado
 * como fato.
 *
 * Fato na tela não pode depender de o navegador ter animado até o fim.
 */
function concluir() {
  if (quadro) cancelAnimationFrame(quadro)
  quadro = null
  texto.value = formatar(props.valor)
}

function aoTrocarVisibilidade() {
  if (document.hidden) concluir()
}

onMounted(() => {
  document.addEventListener('visibilitychange', aoTrocarVisibilidade)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return
        obs.unobserve(e.target)
        const inicio = performance.now()
        const passo = (agora) => {
          const p = Math.min((agora - inicio) / props.duracao, 1)
          const eased = 1 - Math.pow(2, -10 * p)
          texto.value = formatar(props.valor * (p === 1 ? 1 : eased))
          if (p < 1) quadro = requestAnimationFrame(passo)
          else texto.value = formatar(props.valor)
        }
        texto.value = formatar(0)
        quadro = requestAnimationFrame(passo)
        // Rede: se o rAF morrer no caminho, o valor certo entra assim mesmo.
        // O dobro da duração é folga suficiente e imperceptível.
        setTimeout(concluir, props.duracao * 2)
      })
    },
    // 0.35 e não 0.6: um número dentro de célula alta pode não chegar a 60%
    // de visibilidade em tela pequena e nunca contar.
    { threshold: 0.35 },
  )
  if (alvo.value) obs.observe(alvo.value)
})

onBeforeUnmount(() => {
  obs?.disconnect()
  document.removeEventListener('visibilitychange', aoTrocarVisibilidade)
  if (quadro) cancelAnimationFrame(quadro)
})
</script>

<template>
  <!-- tabular-nums vem da classe .numero: sem ele o número treme a cada
       quadro, porque os dígitos têm larguras diferentes. -->
  <span ref="alvo" class="numero">{{ texto }}</span>
</template>
