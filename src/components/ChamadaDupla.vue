<script setup>
import MarcaV from './MarcaV.vue'

/**
 * Os dois destinos da rota — o fim do percurso da home.
 *
 * O mercado é de dois lados e o site precisa fechar nos dois, mas não com o
 * mesmo peso: o negócio é o público prioritário e fica no bloco âmbar; o
 * entregador fica no grafite. Ambos são CTA de verdade, nenhum é rodapé.
 */
</script>

<template>
  <section class="secao chamada">
    <div class="container">
      <div class="destinos">
        <article class="destino destino--negocio corte-v" v-revela>
          <MarcaV variante="mono" :tamanho="18" class="destino-v destino-v--escuro" />
          <span class="rotulo destino-rotulo--escuro">Para o seu negócio</span>
          <h2 class="h2 destino-titulo">Você tem o que entregar.</h2>
          <p class="corpo destino-desc destino-desc--escuro">
            Peça uma entrega avulsa ou contrate uma rota fixa com desconto por volume.
            Sem manter frota, sem entregador na folha.
          </p>
          <v-btn to="/para-negocios" class="destino-btn destino-btn--escuro" variant="outlined">
            Solicitar entregas
          </v-btn>
        </article>

        <article class="destino destino--entregador corte-v" v-revela="90">
          <MarcaV variante="mono" :tamanho="18" class="destino-v destino-v--ambar" />
          <span class="rotulo destino-rotulo--ambar">Para quem entrega</span>
          <h2 class="h2 destino-titulo">Você tem moto, bike ou carro.</h2>
          <p class="corpo texto-2 destino-desc">
            Receba por corrida ou por rota, com horário flexível, sem precisar
            captar cliente sozinho.
          </p>
          <v-btn to="/seja-entregador" color="primary" variant="flat" class="destino-btn">
            Quero me cadastrar
          </v-btn>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chamada {
  background: var(--c-grafite);
}
.destinos {
  display: grid;
  gap: 20px;
}
.destino {
  padding: 30px 24px 28px;
  display: grid;
  gap: 12px;
  justify-items: start;
  align-content: start;
}
/* O bloco do negócio é âmbar cheio: é o público prioritário e leva o único
   preenchimento grande de acento do site. Todo texto por cima é GRAFITE —
   branco sobre âmbar mede 1,6:1 e some. */
.destino--negocio {
  background: var(--c-ambar);
  color: var(--on-ambar);
}
.destino--entregador {
  background: var(--c-sup1);
  border: 1px solid var(--c-fio);
}
.destino-v--escuro {
  color: var(--c-grafite);
  opacity: 0.55;
}
.destino-v--ambar {
  color: var(--c-ambar);
}
.destino-rotulo--escuro {
  color: var(--c-grafite);
  opacity: 0.7;
}
.destino-rotulo--ambar {
  color: var(--c-ambar);
}
.destino-titulo {
  max-width: 16ch;
}
.destino-desc {
  max-width: 42ch;
}
.destino-desc--escuro {
  color: var(--c-grafite);
  opacity: 0.82;
}
.destino-btn.v-btn {
  margin-top: 8px;
  padding-inline: 26px;
}
.destino-btn--escuro.v-btn {
  border-color: var(--c-grafite);
  color: var(--c-grafite);
}

@media (min-width: 860px) {
  .destinos {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .destino {
    padding: 40px 32px 36px;
  }
}
</style>
