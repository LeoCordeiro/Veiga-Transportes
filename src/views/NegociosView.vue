<script setup>
import PaginaFormulario from '@/components/PaginaFormulario.vue'
import FormNegocio from '@/components/FormNegocio.vue'
import MarcaV from '@/components/MarcaV.vue'

/**
 * Página de conversão do lado do negócio.
 *
 * Enxuta de propósito: o formulário na primeira tela e, abaixo dele, só o que
 * a pessoa precisa saber para preencher com confiança. Argumento longo é
 * trabalho da home — quem chegou aqui já clicou em "solicitar entregas".
 */
const resumo = [
  'Avulsa: paga por entrega, sem contrato nem volume mínimo',
  'Rota fixa: pacote mensal com desconto por volume',
  'Moto, bike ou carro, conforme o tamanho da carga',
  'Confirmação com foto e assinatura em toda entrega',
]
</script>

<template>
  <PaginaFormulario
    rotulo="Para negócios"
    titulo="Peça uma entrega."
    descricao="Preencha e a conversa abre no WhatsApp já com os dados. A central responde na hora e fecha o valor antes de qualquer corrida sair."
  >
    <FormNegocio />

    <template #apoio>
      <ul class="resumo">
        <li v-for="(r, i) in resumo" :key="r" v-revela="160 + i * 50">
          <MarcaV variante="mono" :tamanho="11" class="r-v" />
          <span>{{ r }}</span>
        </li>
      </ul>
    </template>
  </PaginaFormulario>
</template>

<style scoped>
.resumo {
  list-style: none;
  margin: 26px 0 0;
  padding: 22px 0 0;
  border-top: 1px solid var(--c-fio);
  display: grid;
  gap: 12px;
}
.resumo li {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--c-cinza);
}
.r-v {
  color: var(--c-ambar);
  margin-top: 4px;
}
</style>
