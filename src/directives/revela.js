/**
 * Diretiva v-revela — entrada por bloco, com stagger.
 *
 *   <div v-revela>        entra ao aparecer
 *   <div v-revela="120">  entra 120ms depois
 *
 * Adaptada do padrão da casa (edvassessoria/Promotime). O que mudou para a
 * Veiga: o deslocamento é menor e a duração mais curta — a marca vende
 * velocidade, e um reveal lento contradiz o texto que ele está revelando.
 *
 * Quem pediu menos movimento recebe o estado final direto. Isso não é só
 * acessibilidade: é o que faz a validação com --force-prefers-reduced-motion
 * mostrar o layout pronto em vez de congelar a transição no meio e mentir
 * sobre posição e cor.
 *
 * O CSS de .revela / .dentro vive em styles/global.css, dentro de
 * @media (prefers-reduced-motion: no-preference) — assim quem está sem JS
 * também vê o conteúdo.
 */
const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Rede de segurança global — a parte mais importante deste arquivo.
 *
 * O fallback por elemento (mais abaixo) só cobre quem já estava na tela quando
 * o componente montou. Se o IntersectionObserver não disparar por qualquer
 * motivo — aba que nunca compõe frames, extensão que o intercepta, navegador
 * exótico — todo bloco abaixo da dobra fica invisível para sempre, e o site
 * perde conteúdo sem um erro sequer no console.
 *
 * Na primeira rolagem, se houver bloco visível ainda oculto, o mecanismo é
 * declarado quebrado e tudo é revelado de uma vez. Perde-se a animação; nunca
 * se perde o conteúdo.
 */
let redeArmada = false
function armarRede() {
  if (redeArmada) return
  redeArmada = true
  const conferir = () => {
    window.removeEventListener('scroll', conferir)
    setTimeout(() => {
      const presos = Array.from(document.querySelectorAll('.revela:not(.dentro)')).filter((el) => {
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight && r.bottom > 0
      })
      if (!presos.length) return
      document.querySelectorAll('.revela').forEach((el) => el.classList.add('dentro'))
    }, 400)
  }
  window.addEventListener('scroll', conferir, { passive: true, once: true })
}

let observador
function pegarObservador() {
  if (!observador) {
    observador = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('dentro')
          observador.unobserve(e.target)
        }),
      /**
       * threshold 0 e margem em px, não em %.
       *
       * Com `threshold: .12` um bloco mais alto que a viewport nunca chega a
       * 12% de visibilidade e fica invisível para sempre. E com margem em %
       * o rodapé cai numa zona morta no fim do scroll — blocos deixam de revelar.
       */
      { threshold: 0, rootMargin: '0px 0px -40px 0px' },
    )
  }
  return observador
}

export default {
  mounted(el, binding) {
    el.classList.add('revela')
    if (semMovimento()) {
      el.classList.add('dentro')
      return
    }
    if (binding.value) el.style.setProperty('--atraso', `${binding.value}ms`)
    pegarObservador().observe(el)
    armarRede()

    // Rede por elemento: se em 3s o bloco não entrou e já está na tela,
    // revela na mão. Nada pode ficar invisível por falha de observação.
    setTimeout(() => {
      if (el.classList.contains('dentro')) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('dentro')
    }, 3000)
  },
  unmounted(el) {
    observador?.unobserve(el)
  },
}
