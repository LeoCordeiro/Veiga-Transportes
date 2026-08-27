<script setup>
/**
 * Casca das páginas legais. Fundo claro e coluna estreita: texto corrido longo
 * sobre grafite cansa, e medida acima de ~70 caracteres faz o olho perder a
 * linha na volta.
 */
defineProps({
  titulo: { type: String, required: true },
  atualizado: { type: String, required: true },
})
</script>

<template>
  <v-theme-provider theme="veigaClaro" with-background>
    <article class="legal">
      <div class="container estreito">
        <header class="legal-cab">
          <h1 class="h2">{{ titulo }}</h1>
          <p class="dado texto-2 legal-data">Atualizado em {{ atualizado }}</p>
        </header>

        <div class="legal-corpo">
          <slot />
        </div>
      </div>
    </article>
  </v-theme-provider>
</template>

<style scoped>
.legal {
  display: block;
  background: var(--c-claro);
  color: var(--c-grafite);
  padding-block: 44px 56px;
}
.estreito {
  max-width: 720px;
}
.legal-cab {
  padding-bottom: 22px;
  border-bottom: 1px solid var(--l-sobre-claro);
  margin-bottom: 30px;
}
.legal-data {
  margin-top: 12px;
  font-size: 12px;
}

.legal-corpo :deep(h2) {
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 1.0625rem;
  line-height: 1.3;
  margin: 32px 0 10px;
}
.legal-corpo :deep(p),
.legal-corpo :deep(li) {
  font-size: 15px;
  line-height: 1.65;
  color: var(--c-cinza-escuro);
}
.legal-corpo :deep(p) {
  margin: 0 0 14px;
}
.legal-corpo :deep(ul) {
  margin: 0 0 14px;
  padding-left: 20px;
  display: grid;
  gap: 7px;
}
.legal-corpo :deep(strong) {
  color: var(--c-grafite);
}
.legal-corpo :deep(a) {
  color: var(--c-grafite);
  text-underline-offset: 2px;
}

@media (min-width: 960px) {
  .legal {
    padding-block: 64px 80px;
  }
}
</style>
