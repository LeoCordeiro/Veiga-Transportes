<script setup>
import { ref } from 'vue'
import { linkWhatsApp, abrirWhatsApp } from '@/utils/whatsapp'
import { obrigatorio, nome, telefone, aceite, formatarTelefone } from '@/utils/validadores'
import { opcoes, prefixos } from '@/config/site'

/**
 * "Solicitar entregas" — o lado do negócio, que é o público prioritário.
 *
 * Termina em WhatsApp com o prefixo [NEGÓCIO] para triagem. Sem backend: o
 * que a central precisa é a conversa começando com os dados na mão.
 */
const formulario = ref(null)
const valido = ref(false)
const enviando = ref(false)

const d = ref({
  responsavel: '',
  negocio: '',
  tipo: null,
  necessidade: null,
  volume: null,
  bairro: '',
  telefone: '',
  consentimento: false,
})

async function enviar() {
  const { valid } = await formulario.value.validate()
  if (!valid) return

  enviando.value = true
  const url = linkWhatsApp(prefixos.negocio, [
    ['Responsável', d.value.responsavel],
    ['Negócio', d.value.negocio],
    ['Tipo', d.value.tipo],
    ['Necessidade', d.value.necessidade],
    ['Volume', d.value.volume],
    ['Bairro', d.value.bairro],
    ['Telefone', formatarTelefone(d.value.telefone)],
  ])
  abrirWhatsApp(url)
  // Solta o botão: se a aba do WhatsApp for bloqueada por popup, a pessoa
  // precisa poder tentar de novo em vez de ficar com o botão travado.
  setTimeout(() => (enviando.value = false), 900)
}
</script>

<template>
  <v-theme-provider theme="veigaClaro" with-background>
    <div class="bloco-form">
      <div class="form-cab">
        <h2 class="h2">Solicitar entregas</h2>
        <p class="corpo texto-2 form-sub">
          Preencha e a conversa abre no WhatsApp já com os dados. Sem cadastro,
          sem mensalidade obrigatória.
        </p>
      </div>

      <v-form ref="formulario" v-model="valido" @submit.prevent="enviar">
        <div class="campos">
          <v-text-field
            v-model="d.responsavel"
            label="Seu nome"
            :rules="[obrigatorio('O nome'), nome]"
            autocomplete="name"
          />
          <v-text-field
            v-model="d.negocio"
            label="Nome do negócio"
            :rules="[obrigatorio('O nome do negócio')]"
            autocomplete="organization"
          />
          <v-select
            v-model="d.tipo"
            :items="opcoes.tipoNegocio"
            label="Tipo de negócio"
            :rules="[obrigatorio('O tipo')]"
          />
          <v-select
            v-model="d.necessidade"
            :items="opcoes.necessidade"
            label="O que você precisa"
            :rules="[obrigatorio('A necessidade')]"
          />
          <v-select
            v-model="d.volume"
            :items="opcoes.volume"
            label="Volume médio"
            :rules="[obrigatorio('O volume')]"
          />
          <v-text-field
            v-model="d.bairro"
            label="Bairro de coleta"
            :rules="[obrigatorio('O bairro')]"
            autocomplete="address-level3"
          />
          <!-- Sem máscara no v-model: máscara reescreve o valor a cada tecla,
               o v-form revalida com o valor intermediário e o campo trava. A
               formatação bonita acontece só na mensagem. -->
          <v-text-field
            v-model="d.telefone"
            label="WhatsApp com DDD"
            :rules="[obrigatorio('O telefone'), telefone]"
            inputmode="numeric"
            autocomplete="tel"
            class="campo-largo"
          />
        </div>

        <v-checkbox
          v-model="d.consentimento"
          :rules="[aceite]"
          density="comfortable"
          class="consent"
        >
          <template #label>
            <span class="corpo-p">
              Autorizo a Veiga Transportes a usar estes dados para me responder sobre
              esta solicitação. Veja a
              <RouterLink to="/privacidade" class="consent-link">política de privacidade</RouterLink>.
            </span>
          </template>
        </v-checkbox>

        <!-- Âmbar e não o primary do tema claro (que é grafite): o botão de
             envio é o CTA principal do site e usa a mesma cor de ação de
             todas as outras chamadas. O rótulo vai em grafite — branco sobre
             âmbar mede 1,6:1 e some. -->
        <v-btn
          type="submit"
          color="ambar"
          variant="flat"
          size="large"
          :loading="enviando"
          class="btn-enviar"
        >
          Enviar pelo WhatsApp
        </v-btn>
      </v-form>
    </div>
  </v-theme-provider>
</template>

<style scoped>
.bloco-form {
  background: var(--c-branco);
  border: 1px solid var(--l-sobre-claro);
  border-radius: var(--r-card);
  padding: 28px 22px 26px;
}
.form-cab {
  margin-bottom: 24px;
}
.form-sub {
  margin-top: 10px;
  max-width: 46ch;
}
.campos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px 18px;
}
.consent {
  margin-block: 4px 12px;
}
.consent-link {
  color: var(--c-grafite);
  text-underline-offset: 2px;
}
.btn-enviar.v-btn {
  width: 100%;
  color: var(--on-ambar);
}

@media (min-width: 700px) {
  .bloco-form {
    padding: 34px 30px 30px;
  }
  .campos {
    grid-template-columns: 1fr 1fr;
  }
  .campo-largo {
    grid-column: 1 / -1;
  }
  .btn-enviar.v-btn {
    width: auto;
    padding-inline: 34px;
  }
}
</style>
