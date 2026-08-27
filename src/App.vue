<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BotaoWhatsapp from '@/components/BotaoWhatsapp.vue'
</script>

<template>
  <v-app>
    <AppHeader />

    <v-main>
      <!-- Sem <transition mode="out-in"> entre rotas: ela depende de
           requestAnimationFrame, e numa aba que não compõe frames o elemento
           trava em leave-from — a página fica em branco sem erro no console.
           A troca de rota já é instantânea; o movimento do site está na
           entrada dos blocos, não na navegação. -->
      <div id="conteudo">
        <RouterView />
      </div>
    </v-main>

    <AppFooter />
    <BotaoWhatsapp />
  </v-app>
</template>

<style>
/* Sem scoped: precisa alcançar o .v-application que o Vuetify cria. */
.v-application {
  background: var(--c-grafite);
}
/* O v-main não pode impor padding-top: o header é próprio e sticky, e um
   respiro aqui abriria costura entre a barra e o hero. */
.v-main {
  --v-layout-top: 0px;
  padding-top: 0 !important;
}
</style>
