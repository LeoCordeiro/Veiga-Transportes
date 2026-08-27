<script setup>
import MarcaLockup from './MarcaLockup.vue'
import MarcaV from './MarcaV.vue'
import { empresa, redes } from '@/config/site'
</script>

<template>
  <footer class="rodape">
    <div class="container">
      <div class="rodape-topo">
        <div class="rodape-marca">
          <MarcaLockup :tamanho="30" />
          <!-- Chegada: o V fecha o percurso que começou no hero. -->
          <p class="corpo texto-2 rodape-frase">
            Rede de entregadores sob demanda para o comércio de toda a
            {{ empresa.cobertura }}.
          </p>
        </div>

        <nav class="rodape-nav" aria-label="Rodapé">
          <div class="rodape-col">
            <span class="rotulo texto-2">Serviço</span>
            <RouterLink to="/para-negocios">Para negócios</RouterLink>
            <RouterLink to="/seja-entregador">Seja um entregador</RouterLink>
            <RouterLink to="/area-de-atuacao">Área de atuação</RouterLink>
          </div>
          <div class="rodape-col">
            <span class="rotulo texto-2">Contato</span>
            <RouterLink to="/contato">Fale com a central</RouterLink>
            <a :href="`https://wa.me/${empresa.whatsapp}`" target="_blank" rel="noopener">
              {{ empresa.whatsappExibicao }}
            </a>
            <a :href="`mailto:${empresa.email}`">{{ empresa.email }}</a>
            <span class="corpo-p texto-2 rodape-hora">{{ empresa.atendimento }}</span>
          </div>

          <div class="rodape-col">
            <span class="rotulo texto-2">Onde nos achar</span>
            <a
              v-for="r in redes"
              :key="r.id"
              :href="r.url"
              target="_blank"
              rel="noopener"
            >
              {{ r.nome }}
              <span class="rede-alvo">{{ r.rotulo }}</span>
            </a>
          </div>
          <div class="rodape-col">
            <span class="rotulo texto-2">Legal</span>
            <RouterLink to="/privacidade">Política de privacidade</RouterLink>
            <RouterLink to="/termos">Termos de uso</RouterLink>
          </div>
        </nav>
      </div>

      <div class="rodape-base">
        <span class="dado texto-2">
          {{ empresa.razaoSocial }} · CNPJ {{ empresa.cnpj }}
        </span>
        <span class="dado texto-2">
          Base: {{ empresa.bairro }}, {{ empresa.baseRegiao }} — {{ empresa.cidade }}/{{ empresa.uf }}
        </span>
      </div>
    </div>

    <!-- Bookend do percurso: ecoa o V do hero, a 3% e cortado pela borda.
         É a única marca-d'água do site — instância única, não decoração de
         canto repetida a cada seção. -->
    <MarcaV class="rodape-eco" variante="mono" :tamanho="360" />
  </footer>
</template>

<style scoped>
.rodape {
  position: relative;
  overflow: hidden;
  background: var(--c-grafite);
  color: var(--c-branco);
  border-top: 1px solid var(--c-fio);
  padding-block: 44px 26px;
}
.rodape-topo {
  display: grid;
  gap: 34px;
  position: relative;
  z-index: 2;
}
.rodape-frase {
  margin-top: 14px;
  max-width: 34ch;
}
.rodape-nav {
  display: grid;
  gap: 26px;
}
.rodape-col {
  display: grid;
  gap: 10px;
  align-content: start;
}
.rodape-col a {
  color: var(--c-branco);
  text-decoration: none;
  font-size: 14px;
  width: fit-content;
  border-bottom: 1px solid transparent;
  transition: border-color 160ms var(--t-swift-out);
}
.rodape-col a:hover {
  border-bottom-color: var(--c-ambar);
}
.rodape-col .rotulo {
  margin-bottom: 2px;
}
.rede-alvo {
  display: block;
  font-family: var(--f-dado);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--c-cinza-2);
  margin-top: 2px;
}
/* Horário em fonte de corpo, não em mono: mono dá largura fixa a cada
   caractere e uma frase inteira sai esticada, parecendo erro. */
.rodape-hora {
  max-width: 22ch;
}

.rodape-base {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 34px;
  padding-top: 18px;
  border-top: 1px solid var(--c-fio);
}
.rodape-base .dado {
  font-size: 11px;
  letter-spacing: 0.06em;
}

.rodape-eco {
  position: absolute;
  right: -60px;
  bottom: -90px;
  opacity: 0.03;
  color: var(--c-branco);
  pointer-events: none;
  z-index: 1;
}

@media (min-width: 760px) {
  .rodape-nav {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 960px) {
  .rodape-topo {
    grid-template-columns: 1fr 1.6fr;
    gap: 48px;
  }
  .rodape-nav {
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
  }
  .rodape-base {
    justify-content: space-between;
  }
}
</style>
