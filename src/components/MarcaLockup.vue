<script setup>
import MarcaV from './MarcaV.vue'

/**
 * O V mais a wordmark.
 *
 * O texto é HTML de verdade, não SVG: um <text> dentro de SVG carregado por
 * <img> ignora a webfont da página e cai numa fonte do sistema — o wordmark
 * sairia errado justamente onde a marca é mais reconhecível. Em HTML o
 * Archivo Black Italic chega normalmente.
 *
 * Os valores tipográficos são os do arquivo oficial da logo: "VEIGA" em
 * Archivo 900 itálico com letter-spacing -0.015em e line-height 0.9;
 * "TRANSPORTES" em 700 com letter-spacing 0.4em.
 */
defineProps({
  escuro: { type: Boolean, default: false }, // true = sobre fundo claro
  tamanho: { type: Number, default: 26 },
})
</script>

<template>
  <span class="lockup" :class="{ 'lockup--escuro': escuro }">
    <MarcaV :variante="escuro ? 'duo' : 'inv'" :tamanho="tamanho" />
    <span class="lockup-txt">
      <span class="lockup-nome">VEIGA</span>
      <span class="lockup-desc">TRANSPORTES</span>
    </span>
  </span>
</template>

<style scoped>
.lockup {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.lockup-txt {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lockup-nome {
  font-family: var(--f-display);
  font-weight: 900;
  font-style: italic;
  font-size: 19px;
  line-height: 0.9;
  letter-spacing: -0.015em;
  color: var(--c-branco);
}
/* O descritor em âmbar sobre grafite mede 10,7:1. Sobre fundo claro cairia
   para 1,6:1 e sumiria — por isso a variante escura o troca por grafite. */
.lockup-desc {
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 8px;
  line-height: 1;
  letter-spacing: 0.4em;
  color: var(--c-ambar);
}
.lockup--escuro .lockup-nome {
  color: var(--c-grafite);
}
.lockup--escuro .lockup-desc {
  color: var(--c-cinza-escuro);
}
</style>
