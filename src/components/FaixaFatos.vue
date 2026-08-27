<script setup>
import RotaTraco from './RotaTraco.vue'
import NumeroVivo from './NumeroVivo.vue'
import MarcaV from './MarcaV.vue'
import { fatos, confirmacao } from '@/config/site'
</script>

<template>
  <!-- Trecho claro do percurso. O v-theme-provider não é enfeite: sem ele
       qualquer campo ou componente Vuetify aqui dentro herda o tema escuro e
       renderiza texto claro sobre fundo claro — some sem erro no console. -->
  <v-theme-provider theme="veigaClaro" with-background>
    <section class="secao faixa">
      <div class="container">
        <div class="secao-cab">
          <h2 class="h2">O que já é certo</h2>
          <span class="rotulo texto-2">Sem número inventado</span>
        </div>

        <div class="regua">
          <!-- Único momento em que a rota vira horizontal. A troca de eixo é
               de propósito: o padrão vertical cansaria se durasse a página
               inteira. Trecho reto, então pode esticar. -->
          <RotaTraco
            class="rota-regua"
            d="M2 4 L998 4"
            :largura="1000"
            :altura="24"
            modo="horizontal"
          />

          <div class="marcos">
            <div v-for="(f, i) in fatos" :key="f.rotulo" class="marco" v-revela="i * 70">
              <!-- Número vai em mono (tabular-nums impede o dígito de tremer no
                   count-up). Texto vai em Archivo: mono dá largura fixa a cada
                   caractere, e "Grande SP" sai com o espaço esticado, parecendo
                   erro de digitação. -->
              <span v-if="f.valor !== undefined" class="marco-val marco-val--num">
                <NumeroVivo :valor="f.valor" />
              </span>
              <span v-else class="marco-val marco-val--txt">{{ f.texto }}</span>
              <span class="rotulo texto-2">{{ f.rotulo }}</span>
              <span class="corpo-p texto-2">{{ f.desc }}</span>
            </div>

            <!-- A confirmação não é "mais uma célula": é o fato de maior peso
                 de confiança que a empresa tem hoje, então ganha linha própria
                 e inverte o fundo. -->
            <div class="marco-conf corte-v" v-revela="280">
              <MarcaV variante="mono" :tamanho="15" class="conf-v" />
              <span class="rotulo conf-rotulo">Confirmação</span>
              <p class="conf-txt">{{ confirmacao }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </v-theme-provider>
</template>

<style scoped>
.faixa {
  background: var(--c-claro);
  color: var(--c-grafite);
}
.regua {
  position: relative;
  padding-top: 30px;
}
/* A linha corre ACIMA dos marcos. Centralizada, ela cruzaria o texto — foi
   o que aconteceu na primeira versão do preview. */
.rota-regua {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 24px;
  pointer-events: none;
}
.marcos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px 12px;
}
.marco {
  display: grid;
  gap: 7px;
  justify-items: start;
}
.marco-val {
  font-weight: 700;
  font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem);
  line-height: 1;
}
.marco-val--num {
  font-family: var(--f-dado);
}
.marco-val--txt {
  font-family: var(--f-display);
  font-weight: var(--p-display);
  letter-spacing: -0.01em;
}
.marco-conf {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  padding: 18px 22px;
  background: var(--c-grafite);
  color: var(--c-branco);
}
.conf-v {
  color: var(--c-ambar);
}
.conf-rotulo {
  color: var(--c-ambar);
}
.conf-txt {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

@media (min-width: 700px) {
  .marcos {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
