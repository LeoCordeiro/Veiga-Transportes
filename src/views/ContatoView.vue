<script setup>
import CabecalhoPagina from '@/components/CabecalhoPagina.vue'
import MarcaV from '@/components/MarcaV.vue'
import { empresa, redes } from '@/config/site'
import { linkWhatsApp, abrirWhatsApp } from '@/utils/whatsapp'

/**
 * Contato direto, sem formulário genérico de "mensagem".
 *
 * Os dois funis reais já têm formulário próprio, com os campos que a central
 * precisa. Um terceiro campo livre aqui só produziria mensagem sem contexto —
 * então esta página manda direto para a conversa, e separa os dois públicos
 * já no primeiro toque.
 */
const canais = [
  {
    id: 'negocio',
    rotulo: 'Tenho um negócio',
    titulo: 'Quero contratar entregas',
    desc: 'Entrega avulsa ou rota fixa para o seu comércio.',
    texto: 'Olá! Tenho um comércio e quero contratar entregas com a Veiga.',
    principal: true,
  },
  {
    id: 'entregador',
    rotulo: 'Sou entregador',
    titulo: 'Quero entrar na rede',
    desc: 'Moto, bike ou carro — corrida avulsa ou rota fixa.',
    texto: 'Olá! Sou entregador e quero entrar na rede da Veiga.',
    principal: false,
  },
]

function abrir(texto) {
  abrirWhatsApp(linkWhatsApp(texto))
}
</script>

<template>
  <CabecalhoPagina
    parada="Contato · Resposta na hora"
    titulo="Fale com a central."
    :descricao="`Atendimento ${empresa.atendimento.toLowerCase()}, em toda a Grande São Paulo. Diga de que lado você está e a conversa já começa no lugar certo — quem responde é gente, na hora.`"
  />

  <section class="secao">
    <div class="container">
      <div class="canais">
        <article
          v-for="(c, i) in canais"
          :key="c.id"
          class="canal corte-v"
          :class="{ 'canal--principal': c.principal }"
          v-revela="i * 90"
        >
          <MarcaV
            variante="mono"
            :tamanho="16"
            class="canal-v"
            :class="c.principal ? 'canal-v--escuro' : 'canal-v--ambar'"
          />
          <span class="rotulo" :class="c.principal ? 'rot-escuro' : 'rot-ambar'">
            {{ c.rotulo }}
          </span>
          <h2 class="h3 canal-titulo">{{ c.titulo }}</h2>
          <p class="corpo canal-desc" :class="{ 'canal-desc--escuro': c.principal }">
            {{ c.desc }}
          </p>
          <v-btn
            class="canal-btn"
            :class="{ 'canal-btn--escuro': c.principal }"
            :color="c.principal ? undefined : 'primary'"
            :variant="c.principal ? 'outlined' : 'flat'"
            @click="abrir(c.texto)"
          >
            Abrir no WhatsApp
          </v-btn>
        </article>
      </div>

      <div class="dados">
        <div class="dado-item">
          <span class="rotulo texto-2">E-mail</span>
          <a :href="`mailto:${empresa.email}`" class="dado dado-link">{{ empresa.email }}</a>
        </div>
        <div class="dado-item">
          <span class="rotulo texto-2">Atendimento</span>
          <span class="dado">{{ empresa.atendimento }}</span>
        </div>
        <div class="dado-item">
          <span class="rotulo texto-2">Sede</span>
          <span class="dado">
            {{ empresa.bairro }}, {{ empresa.baseRegiao }} — {{ empresa.cidade }}/{{ empresa.uf }}
          </span>
        </div>
        <div class="dado-item">
          <span class="rotulo texto-2">CNPJ</span>
          <span class="dado">{{ empresa.cnpj }}</span>
        </div>
      </div>

      <div class="redes">
        <span class="rotulo texto-2 redes-tit">Onde nos achar</span>
        <div class="redes-lista">
          <a
            v-for="r in redes"
            :key="r.id"
            class="rede corte-v"
            :href="r.url"
            target="_blank"
            rel="noopener"
          >
            <MarcaV variante="mono" :tamanho="11" class="rede-v" />
            <span class="rede-nome">{{ r.nome }}</span>
            <span class="rede-conta">{{ r.rotulo }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.canais {
  display: grid;
  gap: 20px;
}
.canal {
  padding: 28px 24px 26px;
  display: grid;
  gap: 10px;
  justify-items: start;
  background: var(--c-sup1);
  border: 1px solid var(--c-fio);
}
/* O bloco do negócio é âmbar cheio — público prioritário. Texto por cima é
   sempre grafite: branco sobre âmbar mede 1,6:1. */
.canal--principal {
  background: var(--c-ambar);
  border-color: var(--c-ambar);
  color: var(--on-ambar);
}
.canal-v--escuro {
  color: var(--c-grafite);
  opacity: 0.5;
}
.canal-v--ambar {
  color: var(--c-ambar);
}
.rot-escuro {
  color: var(--c-grafite);
  opacity: 0.72;
}
.rot-ambar {
  color: var(--c-ambar);
}
.canal-desc {
  color: var(--c-cinza);
  max-width: 34ch;
}
.canal-desc--escuro {
  color: var(--c-grafite);
  opacity: 0.82;
}
.canal-btn.v-btn {
  margin-top: 8px;
  padding-inline: 24px;
}
.canal-btn--escuro.v-btn {
  border-color: var(--c-grafite);
  color: var(--c-grafite);
}

.dados {
  display: grid;
  gap: 20px;
  margin-top: 36px;
  padding-top: 26px;
  border-top: 1px solid var(--c-fio);
}
.dado-item {
  display: grid;
  gap: 8px;
}
.dado-link {
  color: var(--c-branco);
  text-decoration: none;
  border-bottom: 1px solid var(--c-fio);
  width: fit-content;
  transition: border-color 160ms var(--t-swift-out);
}
.dado-link:hover {
  border-bottom-color: var(--c-ambar);
}

.redes {
  margin-top: 32px;
  padding-top: 26px;
  border-top: 1px solid var(--c-fio);
}
.redes-tit {
  display: block;
  margin-bottom: 14px;
}
.redes-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.rede {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px 13px 13px;
  background: var(--c-sup1);
  border: 1px solid var(--c-fio);
  color: var(--c-branco);
  text-decoration: none;
  transition: border-color 200ms var(--t-swift-out);
}
.rede:hover {
  border-color: var(--c-ambar);
}
.rede-v {
  color: var(--c-ambar);
}
.rede-nome {
  font-weight: 700;
  font-size: 14px;
}
.rede-conta {
  font-family: var(--f-dado);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--c-cinza);
  padding-left: 10px;
  border-left: 1px solid var(--c-fio);
}

@media (min-width: 760px) {
  .canais {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .dados {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}
</style>
