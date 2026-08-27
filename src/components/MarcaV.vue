<script setup>
/**
 * O V da marca. Geometria copiada literalmente do arquivo oficial da logo
 * (Veiga Transportes Logo.dc.html) — viewBox 130×148, dois paths. Não
 * redesenhar: qualquer ajuste "para melhorar" desalinha a marca do material
 * impresso, do adesivo de baú e do favicon.
 *
 * Três variantes:
 *   duo   grafite + ponta âmbar — sobre fundo claro
 *   inv   branco  + ponta âmbar — sobre grafite
 *   mono  herda currentColor    — marcador, etapa, marca-d'água
 */
const props = defineProps({
  variante: { type: String, default: 'mono' }, // duo | inv | mono
  tamanho: { type: [Number, String], default: 14 },
})

const RAZAO = 148 / 130
const largura = () => Number(props.tamanho)
const altura = () => Math.round(Number(props.tamanho) * RAZAO * 100) / 100

const CORPO = 'M0 0 H36 L65 50 L94 0 H130 L74.8 95 L77.5 108 L54.6 94 Z'
const LASCA = 'M54.6 94 L77.5 108 L86 148 Z'

/**
 * A GEOMETRIA acima é literal de propósito — é a marca, não um valor de tema.
 * A COR não: sai dos tokens.
 *
 * `fill` é propriedade de apresentação do SVG e aceita var() normalmente
 * quando o SVG é inline no documento (que é o caso aqui). Hex solto num
 * componente seria um segundo lugar declarando a paleta.
 */
const cores = {
  duo: { corpo: 'var(--c-grafite)', lasca: 'var(--c-ambar)' },
  inv: { corpo: 'var(--c-branco)', lasca: 'var(--c-ambar)' },
  mono: { corpo: 'currentColor', lasca: 'currentColor' },
}
</script>

<template>
  <!-- aria-hidden porque o V nunca carrega informação sozinho: onde ele
       identifica a marca, quem nomeia é o texto ao lado. -->
  <svg
    class="marca-v"
    :width="largura()"
    :height="altura()"
    viewBox="0 0 130 148"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="CORPO" :fill="(cores[props.variante] || cores.mono).corpo" />
    <path :d="LASCA" :fill="(cores[props.variante] || cores.mono).lasca" />
  </svg>
</template>

<style scoped>
.marca-v {
  display: inline-block;
  flex: none;
  vertical-align: -0.12em;
}
</style>
