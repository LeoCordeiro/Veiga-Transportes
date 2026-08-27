import { createRouter, createWebHashHistory } from 'vue-router'
import { posicionamento } from '@/config/site'

/**
 * Hash history — padrão da casa. O site é estático em Netlify e o hash evita
 * depender de rewrite do servidor para rota interna funcionar em link direto.
 */
const rotas = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { titulo: `Veiga Transportes — ${posicionamento.chamada}` },
  },
  {
    path: '/para-negocios',
    name: 'negocios',
    component: () => import('@/views/NegociosView.vue'),
    meta: { titulo: 'Para negócios — Veiga Transportes' },
  },
  {
    path: '/seja-entregador',
    name: 'entregador',
    component: () => import('@/views/EntregadorView.vue'),
    meta: { titulo: 'Seja um entregador — Veiga Transportes' },
  },
  {
    path: '/area-de-atuacao',
    name: 'area',
    component: () => import('@/views/AreaView.vue'),
    meta: { titulo: 'Área de atuação — Veiga Transportes' },
  },
  {
    path: '/contato',
    name: 'contato',
    component: () => import('@/views/ContatoView.vue'),
    meta: { titulo: 'Contato — Veiga Transportes' },
  },
  {
    path: '/privacidade',
    name: 'privacidade',
    component: () => import('@/views/legal/PrivacidadeView.vue'),
    meta: { titulo: 'Política de privacidade — Veiga Transportes' },
  },
  {
    path: '/termos',
    name: 'termos',
    component: () => import('@/views/legal/TermosView.vue'),
    meta: { titulo: 'Termos de uso — Veiga Transportes' },
  },
  // Rota desconhecida volta para a home em vez de tela branca.
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: rotas,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    // 80 = altura do header (64) + respiro. Sem isto a âncora encosta
    // debaixo da barra fixa e o título fica escondido.
    if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta?.titulo) document.title = to.meta.titulo
})

export default router
