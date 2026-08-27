<script setup>
import PaginaFormulario from '@/components/PaginaFormulario.vue'
import FormEntregador from '@/components/FormEntregador.vue'
import MarcaV from '@/components/MarcaV.vue'

/**
 * Página de cadastro da rede.
 *
 * Mesmo raciocínio da página de negócios: o campo aberto na primeira tela e o
 * mínimo de leitura em volta. Quem preenche isto costuma estar na rua, no
 * celular, entre uma corrida e outra.
 */
const requisitos = [
  'Maior de 18 anos',
  'CNH válida na categoria do veículo (moto e carro)',
  'Veículo próprio em condição de rodar',
  'Celular com WhatsApp para receber os chamados',
]
</script>

<template>
  <PaginaFormulario
    rotulo="Para entregador"
    titulo="Entre na rede."
    descricao="Preencha e a conversa abre no WhatsApp. A central chama quando tiver corrida ou rota na sua região — você recebe por corrida ou por rota, sem precisar captar cliente."
  >
    <FormEntregador />

    <template #apoio>
      <div class="req">
        <span class="rotulo texto-2 req-tit">O que precisa ter</span>
        <ul>
          <li v-for="(r, i) in requisitos" :key="r" v-revela="160 + i * 50">
            <MarcaV variante="mono" :tamanho="11" class="r-v" />
            <span>{{ r }}</span>
          </li>
        </ul>
      </div>
    </template>
  </PaginaFormulario>
</template>

<style scoped>
.req {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--c-fio);
}
.req-tit {
  display: block;
  margin-bottom: 14px;
}
.req ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.req li {
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
