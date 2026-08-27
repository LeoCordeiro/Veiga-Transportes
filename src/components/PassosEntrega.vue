<script setup>
import RotaTraco from './RotaTraco.vue'
import MarcaV from './MarcaV.vue'
import { passos } from '@/config/site'

/**
 * Os três passos, como continuação da rota.
 *
 * Não usa v-timeline, e o motivo é de layout. O v-timeline vertical monta um
 * grid de três colunas (`minmax(0,1fr) auto minmax(0,1fr)`) e reserva a coluna
 * do lado oposto mesmo com side="end": sobra metade da largura vazia e o texto
 * fica espremido. Colapsar essa coluna por CSS resolve só em parte.
 *
 * A estrutura abaixo usa o vocabulário que o site já tem — RotaTraco mais nó,
 * o mesmo de ParadasSegmentos. Além de resolver a largura, fica coerente: a
 * linha dos passos é a MESMA linha que costura a página, não uma segunda
 * linha com desenho de outro componente.
 */
</script>

<template>
  <section class="secao passos-secao">
    <div class="container">
      <div class="secao-cab">
        <h2 class="h2">Como funciona</h2>
        <span class="rotulo texto-2">Três passos</span>
      </div>

      <div class="passos">
        <RotaTraco class="rota-passos" d="M2 0 L2 1000" :largura="4" :altura="1000" modo="vertical" />

        <div v-for="(p, i) in passos" :key="p.n" class="passo" v-revela="i * 80">
          <span class="passo-marca">
            <MarcaV variante="mono" :tamanho="15" class="passo-v" />
          </span>
          <div class="passo-corpo">
            <span class="dado passo-n">{{ p.n }}</span>
            <h3 class="h3 passo-titulo">{{ p.titulo }}</h3>
            <p class="corpo texto-2 passo-desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.passos-secao {
  background: var(--c-grafite);
}
.passos {
  position: relative;
  padding-left: 34px;
}
.rota-passos {
  position: absolute;
  left: -2px;
  top: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.passo {
  position: relative;
  z-index: 2;
  padding-block: 16px 22px;
}
.passo-marca {
  position: absolute;
  left: -41px;
  top: 20px;
  display: flex;
  justify-content: center;
  width: 20px;
  /* O V tapa a linha atrás dele: sem o fundo, o traço atravessa o glifo e o
     nó deixa de ler como parada. */
  background: var(--c-grafite);
  padding-block: 4px;
}
.passo-v {
  color: var(--c-ambar);
}
.passo-n {
  display: block;
  color: var(--c-ambar);
  font-size: 12px;
  letter-spacing: 0.16em;
  margin-bottom: 6px;
}
.passo-titulo {
  margin-bottom: 6px;
}
.passo-desc {
  max-width: 56ch;
}

@media (min-width: 960px) {
  .passo {
    padding-block: 20px 28px;
  }
}
</style>
