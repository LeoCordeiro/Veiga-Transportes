<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import MarcaLockup from './MarcaLockup.vue'

/**
 * Header próprio, não <v-app-bar>.
 *
 * O v-app-bar empurra um padding-top no v-main e isso abre uma costura visível
 * entre a barra e o hero — o grafite do header e o do hero deixam de encostar.
 * Com header próprio o hero começa colado.
 *
 * Transparente sobre o hero e sólido ao rolar: é o gesto da direção aprovada,
 * a página "começa" no percurso e a barra só materializa quando você sai dele.
 */
const router = useRouter()
const solido = ref(false)
const aberto = ref(false)

const links = [
  { nome: 'Para negócios', to: '/para-negocios' },
  { nome: 'Para entregador', to: '/seja-entregador' },
  { nome: 'Área de atuação', to: '/area-de-atuacao' },
  { nome: 'Contato', to: '/contato' },
]

const aoRolar = () => {
  solido.value = window.scrollY > 8
}

/**
 * Pular para o conteúdo precisa ser programático.
 *
 * Com hash history, href="#conteudo" é interpretado como ROTA pelo router —
 * o link levaria para uma rota inexistente em vez de mover o foco.
 */
function pularParaConteudo(e) {
  e.preventDefault()
  const alvo = document.getElementById('conteudo')
  if (!alvo) return
  alvo.setAttribute('tabindex', '-1')
  alvo.focus()
  alvo.scrollIntoView({ behavior: 'smooth' })
}

function irPara(to) {
  aberto.value = false
  router.push(to)
}

onMounted(() => {
  aoRolar()
  window.addEventListener('scroll', aoRolar, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', aoRolar))
</script>

<template>
  <header class="topo" :class="{ 'topo--solido': solido || aberto }">
    <a class="pular" href="#conteudo" @click="pularParaConteudo">Pular para o conteúdo</a>

    <div class="container topo-in">
      <RouterLink to="/" class="topo-marca" aria-label="Veiga Transportes — início">
        <MarcaLockup :tamanho="26" />
      </RouterLink>

      <nav class="nav" aria-label="Principal">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="nav-link">
          {{ l.nome }}
        </RouterLink>
      </nav>

      <button
        class="menu-botao"
        type="button"
        :aria-expanded="aberto"
        aria-controls="menu-movel"
        @click="aberto = !aberto"
      >
        <span class="menu-traco" :class="{ 'menu-traco--x': aberto }" aria-hidden="true"></span>
        {{ aberto ? 'Fechar' : 'Menu' }}
      </button>
    </div>

    <div v-show="aberto" id="menu-movel" class="menu-movel">
      <div class="container">
        <button v-for="l in links" :key="l.to" class="menu-item" type="button" @click="irPara(l.to)">
          {{ l.nome }}
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topo {
  position: sticky;
  top: 0;
  z-index: 30;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background-color 220ms var(--t-swift-out),
    border-color 220ms var(--t-swift-out);
}
.topo--solido {
  background: var(--c-grafite);
  border-bottom-color: var(--c-fio);
}
.topo-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--m-altura-header);
}
.topo-marca {
  text-decoration: none;
}

.nav {
  display: none;
  gap: 24px;
}
.nav-link {
  text-decoration: none;
  color: var(--c-cinza);
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 6px 0;
  position: relative;
  transition: color 160ms var(--t-swift-out);
}
.nav-link:hover {
  color: var(--c-branco);
}
/* A rota ativa ganha um traço âmbar — o mesmo vocabulário da linha que
   costura a página, não um sublinhado genérico. */
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--c-ambar);
}
.nav-link.router-link-active {
  color: var(--c-branco);
}

.menu-botao {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 4px;
  background: none;
  border: 0;
  color: var(--c-branco);
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
}
.menu-traco {
  width: 18px;
  height: 2px;
  background: var(--c-ambar);
  position: relative;
  transition: transform 200ms var(--t-swift-out);
}
.menu-traco::before,
.menu-traco::after {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: var(--c-ambar);
  transition: transform 200ms var(--t-swift-out);
}
.menu-traco::before {
  top: -6px;
}
.menu-traco::after {
  top: 6px;
}
.menu-traco--x {
  transform: rotate(30deg);
}
.menu-traco--x::before,
.menu-traco--x::after {
  transform: translateY(0);
  top: 0;
}
.menu-traco--x::after {
  transform: rotate(-60deg);
}

.menu-movel {
  background: var(--c-grafite);
  border-top: 1px solid var(--c-fio);
  padding-block: 8px 16px;
}
.menu-item {
  display: block;
  width: 100%;
  min-height: 48px;
  padding: 12px 0;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--c-fio);
  color: var(--c-branco);
  font-family: var(--f-corpo);
  font-weight: 700;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}

@media (min-width: 860px) {
  .nav {
    display: flex;
  }
  .menu-botao,
  .menu-movel {
    display: none;
  }
}
</style>
