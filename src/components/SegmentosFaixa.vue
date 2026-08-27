<script setup>
import MarcaV from './MarcaV.vue'
import { segmentos } from '@/config/site'

/**
 * Faixa de reconhecimento — "eu sou um desses".
 *
 * Segmento de cliente não tem ordem, então não cabe numa lista numerada. Aqui
 * a função é outra: o lojista bate o olho, se encontra e segue. Basta nome e
 * caso de uso em meia linha.
 *
 * Sem grid de cards iguais: é uma faixa que quebra em linhas conforme a
 * largura, e cada item ocupa o espaço do próprio nome.
 */
</script>

<template>
  <v-theme-provider theme="veigaClaro" with-background>
    <section class="secao faixa-seg">
      <div class="container">
        <div class="secao-cab">
          <h2 class="h2">Quem entrega com a gente</h2>
          <span class="rotulo texto-2">Comércio sem frota própria</span>
        </div>

        <ul class="segs">
          <li v-for="(s, i) in segmentos" :key="s.id" class="seg" v-revela="i * 50">
            <MarcaV variante="mono" :tamanho="11" class="seg-v" />
            <span class="seg-nome">{{ s.nome }}</span>
            <span class="seg-tag">{{ s.tag }}</span>
          </li>
        </ul>

        <p class="corpo texto-2 seg-nota" v-revela="320">
          Não está na lista? A rede leva praticamente tudo que cabe numa moto,
          numa bike ou num carro. Pergunte na central.
        </p>
      </div>
    </section>
  </v-theme-provider>
</template>

<style scoped>
.faixa-seg {
  background: var(--c-claro);
  color: var(--c-grafite);
}
.segs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.seg {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 12px 13px;
  background: var(--c-branco);
  border: 1px solid var(--l-sobre-claro);
  /* Canto cortado a 30° — o ângulo do V. Sem arredondado: a marca é reta. */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 8px) 100%, 0 100%);
  transition: border-color 200ms var(--t-swift-out);
}
.seg:hover {
  border-color: var(--c-ambar);
}
.seg-v {
  color: var(--c-ambar);
}
.seg-nome {
  font-weight: 700;
  font-size: 15px;
  line-height: 1;
}
.seg-tag {
  font-family: var(--f-dado);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-cinza-escuro);
  padding-left: 10px;
  border-left: 1px solid var(--l-sobre-claro);
}
.seg-nota {
  margin-top: 22px;
  max-width: 52ch;
}
</style>
