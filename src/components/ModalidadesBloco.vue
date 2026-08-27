<script setup>
import MarcaV from './MarcaV.vue'

/**
 * Avulsa contra rota fixa — o diferencial comercial da Veiga.
 *
 * São dois blocos, não três cards: o negócio tem duas modalidades, e inventar
 * uma terceira coluna só para "ficar simétrico" seria decoração fingindo
 * oferta. Os dois têm altura desigual porque o conteúdo é desigual.
 */
const modalidades = [
  {
    id: 'avulsa',
    nome: 'Entrega avulsa',
    linha: 'Para quem precisa hoje',
    desc: 'Você pede quando aparece a demanda e paga por entrega. Sem contrato, sem mensalidade, sem volume mínimo.',
    itens: [
      'Aciona pelo WhatsApp na hora',
      'Preço por corrida, conforme distância e veículo',
      'Taxa de urgência para o que não pode esperar',
    ],
  },
  {
    id: 'rota',
    nome: 'Rota fixa recorrente',
    linha: 'Para quem entrega todo dia',
    desc: 'Um pacote de entregas por mês, em horário combinado, com desconto por volume. O entregador já sabe o caminho e a sua operação para de improvisar.',
    itens: [
      'Volume contratado por mês, com desconto na faixa',
      'Horário e janela combinados de antemão',
      'Mesma rede, entregador acostumado com o seu tipo de carga',
      'Faturamento fechado no mês, não por corrida',
    ],
  },
]
</script>

<template>
  <v-theme-provider theme="veigaClaro" with-background>
    <section class="secao modalidades">
      <div class="container">
        <div class="secao-cab">
          <h2 class="h2">Duas formas de trabalhar</h2>
          <span class="rotulo texto-2">Avulsa ou rota fixa</span>
        </div>

        <div class="grade">
          <article
            v-for="(m, i) in modalidades"
            :key="m.id"
            class="modo corte-v"
            :class="`modo--${m.id}`"
            v-revela="i * 90"
          >
            <span class="rotulo texto-2">{{ m.linha }}</span>
            <h3 class="h3 modo-nome">{{ m.nome }}</h3>
            <p class="corpo texto-2 modo-desc">{{ m.desc }}</p>
            <ul class="itens">
              <li v-for="t in m.itens" :key="t">
                <MarcaV variante="mono" :tamanho="10" class="item-v" />
                <span>{{ t }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  </v-theme-provider>
</template>

<style scoped>
.modalidades {
  background: var(--c-claro);
  color: var(--c-grafite);
}
.grade {
  display: grid;
  gap: 20px;
}
.modo {
  background: var(--c-branco);
  border: 1px solid var(--l-sobre-claro);
  padding: 26px 22px 24px;
}
/* Sombra dura e direcional, sem blur — o Material padrão é uma nuvem suave,
   e nuvem suave contradiz uma marca que vende velocidade e aresta. */
.modo--rota {
  box-shadow: 5px 5px 0 var(--l-sobre-claro);
}
.modo-nome {
  margin-block: 8px 10px;
}
.modo-desc {
  max-width: 46ch;
}
.itens {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.itens li {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  font-size: 14px;
  line-height: 1.45;
}
.item-v {
  color: var(--c-ambar);
  margin-top: 3px;
}

@media (min-width: 860px) {
  /* Assimétrico de propósito: a rota fixa é a oferta que a Veiga quer vender
     (previsível, recorrente) e ocupa mais espaço por isso. Duas colunas
     iguais dariam o mesmo peso a ofertas de peso diferente. */
  .grade {
    grid-template-columns: 1fr 1.25fr;
    gap: 26px;
    align-items: start;
  }
  .modo {
    padding: 32px 28px 30px;
  }
}
</style>
