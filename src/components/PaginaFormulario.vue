<script setup>
import RotaTraco from './RotaTraco.vue'

/**
 * Layout das páginas que existem para converter.
 *
 * O formulário aparece na PRIMEIRA TELA, ao lado do título — não depois de
 * três seções de argumento. Quem clica em "Solicitar entregas" já decidiu
 * pedir; obrigar essa pessoa a rolar até o fim para achar o campo é cobrar
 * leitura de quem só quer falar com alguém.
 *
 * O texto ao redor fica no mínimo pelo mesmo motivo. Argumento longo é papel
 * da home; aqui o trabalho é uma frase de contexto e o campo aberto.
 */
defineProps({
  rotulo: { type: String, required: true },
  titulo: { type: String, required: true },
  descricao: { type: String, default: '' },
})

const CAMINHO = 'M8 6 L8 92 L56 175 L56 300'
</script>

<template>
  <section class="topo-form">
    <div class="container topo-in">
      <RotaTraco class="rota-form" :d="CAMINHO" :largura="90" :altura="300" />

      <div class="grade">
        <div class="lado-txt">
          <div class="marca-inicio" v-revela>
            <span class="no-parada"></span>
            <span class="dado inicio-tag">{{ rotulo }}</span>
          </div>

          <h1 class="h1 form-titulo" v-revela="60">{{ titulo }}</h1>

          <p v-if="descricao" class="corpo texto-2 form-desc" v-revela="120">
            {{ descricao }}
          </p>
        </div>

        <div class="lado-form" v-revela="100">
          <slot />
        </div>

        <!-- Bloco de apoio separado do texto de topo de propósito: no celular
             ele precisa vir DEPOIS do formulário. Junto do título, empurrava o
             primeiro campo para baixo da dobra . -->
        <div class="lado-apoio">
          <slot name="apoio" />
        </div>
      </div>
    </div>
  </section>

  <slot name="depois" />
</template>

<style scoped>
.topo-form {
  position: relative;
  overflow: hidden;
  background: var(--c-grafite);
  padding-block: 36px 48px;
}
.topo-in {
  position: relative;
}
.rota-form {
  position: absolute;
  left: -2px;
  top: 8px;
  z-index: 1;
  pointer-events: none;
}
/**
 * Mobile: título → formulário → apoio, nessa ordem.
 * Desktop: texto e apoio empilhados à esquerda, formulário à direita.
 */
.grade {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 26px;
  grid-template-areas: 'txt' 'form' 'apoio';
}
.lado-txt {
  grid-area: txt;
}
.lado-form {
  grid-area: form;
}
.lado-apoio {
  grid-area: apoio;
}
.lado-txt {
  padding-left: 34px;
}
.marca-inicio {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  margin-left: -34px;
}
.marca-inicio .no-parada {
  margin-left: 6px;
}
.inicio-tag {
  color: var(--c-ambar);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
/* Menor que o H1 da home: aqui a atenção pertence ao formulário, não à
   manchete. Título grande demais empurraria o campo para fora da tela. */
.form-titulo {
  font-size: clamp(2rem, 1.4rem + 2.4vw, 3.5rem);
}
.form-desc {
  margin-top: 14px;
  max-width: 40ch;
  font-size: 15px;
  line-height: 1.5;
}
@media (min-width: 960px) {
  .form-desc {
    font-size: 16px;
  }
}

@media (min-width: 960px) {
  .topo-form {
    padding-block: 56px 72px;
  }
  .grade {
    grid-template-columns: 0.9fr 1.1fr;
    grid-template-areas:
      'txt   form'
      'apoio form';
    column-gap: 56px;
    row-gap: 0;
    align-items: start;
  }
  /* O formulário é a coluna maior — é o que a página veio fazer. */
  .lado-form {
    position: sticky;
    top: 88px;
  }
}
</style>
