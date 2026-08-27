<script setup>
import RotaTraco from './RotaTraco.vue'

/**
 * Lista numerada em zigue-zague, costurada pela linha da rota.
 *
 * Só serve para conteúdo que tem ordem. Numerar de 01 a 06 promete uma
 * progressão, e se os itens não têm nenhuma o leitor fica procurando a
 * sequência que não existe. Por isso aqui vão os diferenciais, que funcionam
 * como lista de razões — segmento de cliente vive em SegmentosFaixa.
 *
 * O espaçamento vertical é DESIGUAL de propósito: com todos os itens à mesma
 * distância vira escada mecânica, uma lista de cards com enfeite de linha.
 */
defineProps({
  titulo: { type: String, required: true },
  rotulo: { type: String, default: '' },
  itens: { type: Array, required: true },
})
</script>

<template>
  <section class="secao">
    <div class="container">
      <div class="secao-cab">
        <h2 class="h2">{{ titulo }}</h2>
        <span v-if="rotulo" class="rotulo texto-2">{{ rotulo }}</span>
      </div>

      <div class="lista">
        <RotaTraco class="rota-lista" d="M2 0 L2 1000" :largura="4" :altura="1000" modo="vertical" />

        <article v-for="(it, i) in itens" :key="it.id" class="item" v-revela="i * 70">
          <span class="item-marca"><span class="no-parada"></span></span>
          <span class="parada-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="item-corpo">
            <h3 class="item-nome">{{ it.nome }}</h3>
            <p class="item-desc texto-2">{{ it.desc }}</p>
            <span v-if="it.tag" class="item-tag">{{ it.tag }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lista {
  position: relative;
  padding-left: 34px;
}
.rota-lista {
  position: absolute;
  left: -2px;
  top: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.item {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
  padding-block: 18px;
}
.item:nth-child(3) {
  padding-block: 26px;
}
.item:nth-child(5) {
  padding-block: 30px;
}
.item:last-child {
  padding-bottom: 6px;
}
.item-marca {
  position: absolute;
  left: -34px;
  top: 24px;
  display: flex;
  width: var(--m-no);
  justify-content: center;
}
.item-corpo {
  display: grid;
  gap: 5px;
}
.item-nome {
  margin: 0;
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 18px;
  line-height: 1.25;
}
.item-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  max-width: 44ch;
}
.item-tag {
  font-family: var(--f-dado);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-cinza-2);
}
.item .parada-num {
  color: var(--c-ambar);
  opacity: 0.9;
  padding-top: 2px;
}

@media (min-width: 960px) {
  /* No desktop a linha desce pelo MEIO e os itens alternam os dois lados —
     o zigue-zague de verdade. Em 390px não cabe: lá ela fica na lateral. */
  .lista {
    padding-left: 0;
  }
  .rota-lista {
    left: 50%;
    transform: translateX(-1px);
  }
  .item {
    width: calc(50% - 40px);
  }
  .item:nth-child(odd) {
    text-align: right;
    direction: rtl;
  }
  .item:nth-child(odd) .item-corpo {
    direction: ltr;
    text-align: right;
  }
  .item:nth-child(odd) .item-desc {
    margin-left: auto;
  }
  .item:nth-child(odd) .item-marca {
    left: auto;
    right: -46px;
  }
  .item:nth-child(even) {
    margin-left: calc(50% + 40px);
    margin-top: -38px;
  }
  .item:nth-child(even) .item-marca {
    left: -46px;
  }
}
</style>
