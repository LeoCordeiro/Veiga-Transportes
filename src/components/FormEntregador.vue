<script setup>
import { ref } from 'vue'
import { linkWhatsApp, abrirWhatsApp } from '@/utils/whatsapp'
import { obrigatorio, nome, telefone, aceite, formatarTelefone } from '@/utils/validadores'
import { opcoes, prefixos } from '@/config/site'

/**
 * "Seja um entregador" — o lado da rede.
 *
 * Prefixo [ENTREGADOR] para a central separar de cara do outro funil. O tom
 * da copy aqui é direto e prático: quem preenche está procurando trabalho, não
 * avaliando fornecedor.
 *
 * O veículo entra como v-chip-group e não como select: são três opções, e
 * chip é alvo maior de toque para quem preenche na rua, no celular.
 */
const formulario = ref(null)
const valido = ref(false)
const enviando = ref(false)

const d = ref({
  nome: '',
  veiculo: null,
  regiao: '',
  periodo: null,
  dias: null,
  telefone: '',
  consentimento: false,
})

async function enviar() {
  const { valid } = await formulario.value.validate()
  if (!valid) return

  enviando.value = true
  const url = linkWhatsApp(prefixos.entregador, [
    ['Nome', d.value.nome],
    ['Veículo', d.value.veiculo],
    ['Região de atuação', d.value.regiao],
    ['Período', d.value.periodo],
    ['Dias', d.value.dias],
    ['Telefone', formatarTelefone(d.value.telefone)],
  ])
  abrirWhatsApp(url)
  setTimeout(() => (enviando.value = false), 900)
}
</script>

<template>
  <v-theme-provider theme="veigaClaro" with-background>
    <div class="bloco-form">
      <div class="form-cab">
        <h2 class="h2">Cadastro de entregador</h2>
        <p class="corpo texto-2 form-sub">
          Preencha e a conversa abre no WhatsApp. A central chama quando tiver
          corrida ou rota na sua região.
        </p>
      </div>

      <v-form ref="formulario" v-model="valido" @submit.prevent="enviar">
        <v-text-field
          v-model="d.nome"
          label="Nome completo"
          :rules="[obrigatorio('O nome'), nome]"
          autocomplete="name"
        />

        <fieldset class="grupo">
          <legend class="rotulo texto-2 grupo-titulo">Qual é o seu veículo</legend>
          <v-chip-group v-model="d.veiculo" mandatory selected-class="chip-on" column>
            <v-chip
              v-for="v in opcoes.veiculo"
              :key="v"
              :value="v"
              variant="outlined"
              size="large"
              filter
            >
              {{ v }}
            </v-chip>
          </v-chip-group>
        </fieldset>

        <div class="campos">
          <v-text-field
            v-model="d.regiao"
            label="Bairros onde você roda"
            :rules="[obrigatorio('A região')]"
            class="campo-largo"
          />
          <v-select
            v-model="d.periodo"
            :items="opcoes.periodo"
            label="Período do dia"
            :rules="[obrigatorio('O período')]"
          />
          <v-select
            v-model="d.dias"
            :items="opcoes.diasSemana"
            label="Dias da semana"
            :rules="[obrigatorio('Os dias')]"
          />
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
              Autorizo a Veiga Transportes a usar estes dados para me chamar para
              corridas e rotas. Veja a
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
.grupo {
  border: 0;
  padding: 0;
  margin: 6px 0 14px;
}
.grupo-titulo {
  display: block;
  margin-bottom: 8px;
}
/* Alvo de toque de 48px: quem preenche isto está na rua, no celular, às
   vezes de luva. O tamanho padrão do chip não dá conta. */
.grupo :deep(.v-chip.v-chip) {
  min-height: 48px;
  padding-inline: 20px;
  border-color: var(--l-sobre-claro-forte);
}
.grupo :deep(.chip-on.v-chip) {
  background: var(--c-ambar);
  color: var(--on-ambar);
  border-color: var(--c-ambar);
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
