<script setup>
import RotaTraco from './RotaTraco.vue'

/**
 * Topo das páginas internas. A rota continua aqui: cada página é uma parada
 * numerada do mesmo percurso que começa na home, não uma tela solta.
 */
defineProps({
  parada: { type: String, required: true },
  titulo: { type: String, required: true },
  descricao: { type: String, default: '' },
})

const CAMINHO = 'M8 6 L8 96 L56 179 L56 260'
</script>

<template>
  <section class="cabecalho">
    <div class="container cabecalho-in">
      <RotaTraco class="rota-cab" :d="CAMINHO" :largura="90" :altura="260" />

      <div class="cabecalho-txt">
        <div class="cabecalho-parada" v-revela>
          <span class="no-parada"></span>
          <span class="dado cabecalho-tag">{{ parada }}</span>
        </div>
        <h1 class="h1 cabecalho-titulo" v-revela="60">{{ titulo }}</h1>
        <p v-if="descricao" class="corpo texto-2 cabecalho-desc" v-revela="120">
          {{ descricao }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cabecalho {
  position: relative;
  overflow: hidden;
  background: var(--c-grafite);
  padding-block: 40px 44px;
}
.cabecalho-in {
  position: relative;
}
.rota-cab {
  position: absolute;
  left: -2px;
  top: 10px;
  z-index: 1;
  pointer-events: none;
}
.cabecalho-txt {
  position: relative;
  z-index: 2;
  padding-left: 34px;
}
.cabecalho-parada {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  margin-left: -34px;
}
.cabecalho-parada .no-parada {
  margin-left: 6px;
}
.cabecalho-tag {
  color: var(--c-ambar);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
/* Um degrau abaixo do H1 da home: a home é a entrada do percurso e precisa
   ser a maior. Página interna com o mesmo tamanho achataria a hierarquia. */
.cabecalho-titulo {
  font-size: clamp(2.2rem, 1.5rem + 3.2vw, 4.5rem);
  max-width: 18ch;
}
.cabecalho-desc {
  margin-top: 20px;
  max-width: 48ch;
  font-size: 16px;
}

@media (min-width: 960px) {
  .cabecalho {
    padding-block: 64px 68px;
  }
}
</style>
