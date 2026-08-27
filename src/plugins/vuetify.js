// Não remover: com autoImport o plugin traz o CSS de cada componente, mas não
// os estilos base. Sem esta linha o v-select ganha uma caixa interna espúria —
// e há v-select nos dois formulários. Economiza ~244 KB e quebra a tela.
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { cores, textoSobre } from '@/config/tokens'

/**
 * Dois temas, porque a direção aprovada ALTERNA fundo seção a seção.
 *
 * `veiga` é o tema escuro e é o padrão — o grafite não é "modo escuro", é a
 * cor da marca. `veigaClaro` cobre os trechos claros do percurso.
 *
 * Sem `dark: true` o Vuetify assume superfície clara e pinta os campos de
 * formulário com texto escuro sobre fundo escuro. E sem trocar o tema no
 * bloco claro acontece o inverso: rótulo off-white sobre fundo off-white,
 * que some SEM ERRO NENHUM no console.
 *
 * Uso: <v-theme-provider theme="veigaClaro"> em volta do trecho claro.
 *
 * Zero hex aqui. Tudo vem de config/tokens.js, que é a transcrição do
 * preview aprovado.
 */
const veiga = {
  dark: true,
  colors: {
    // O CTA primário é âmbar cheio com rótulo GRAFITE (10,7:1). Rótulo branco
    // sobre âmbar dá 1,6:1 e some — por isso on-primary é o grafite.
    primary: cores.ambar,
    'on-primary': textoSobre.ambar,

    secondary: cores.branco,
    'on-secondary': cores.grafite,

    background: cores.grafite,
    'on-background': cores.branco,

    // A parada elevada desce um grau em relação ao fundo.
    surface: cores.sup1,
    'on-surface': cores.branco,

    error: cores.erroClaro, // 8,1:1 sobre grafite. O #B3261E daria 1,8:1
    'on-error': cores.grafite,
    success: cores.sucessoClaro,
    'on-success': cores.grafite,

    /**
     * Cor de foco e de rótulo ativo dos campos.
     *
     * NÃO usar primary aqui. Primary é o âmbar, e um rótulo de campo tem
     * ~12px: âmbar passa de sobra em contraste, mas num formulário de sete
     * campos colocaria sete acentos de marca na mesma tela e o CTA perderia
     * a primazia. Branco resolve com 17,4:1 e devolve o âmbar ao botão.
     */
    campo: cores.branco,

    // Nomeadas, para uso pontual em prop de componente.
    ambar: cores.ambar,
    grafite: cores.grafite,
    claro: cores.claro,
    cinza: cores.cinza,
    'cinza-escuro': cores.cinzaEscuro,
  },
}

/** Trechos claros do percurso: faixa de fatos, formulários, páginas legais. */
const veigaClaro = {
  dark: false,
  colors: {
    // No claro o primário é o grafite: âmbar sobre claro mede 1,5:1 e some.
    // O âmbar continua existindo, mas como preenchimento — nunca como texto.
    primary: cores.grafite,
    'on-primary': cores.branco,

    secondary: cores.cinzaEscuro,
    'on-secondary': cores.branco,

    background: cores.claro,
    'on-background': cores.grafite,

    surface: cores.branco,
    'on-surface': cores.grafite,

    error: cores.erro, // 6,0:1 sobre claro
    'on-error': cores.branco,
    success: cores.sucesso,
    'on-success': cores.branco,

    campo: cores.grafite, // 15,8:1 sobre o claro
    ambar: cores.ambar,
    grafite: cores.grafite,
    'cinza-escuro': cores.cinzaEscuro,
  },
}

export default createVuetify({
  theme: { defaultTheme: 'veiga', themes: { veiga, veigaClaro } },
  // mdi-svg e não @mdi/font: ícone inexistente quebra o build em vez de sumir
  // calado da tela, e não carrega uma fonte inteira para meia dúzia de glifos.
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  defaults: {
    // Sem `rounded` em lugar nenhum: a classe do Vuetify traz
    // border-radius !important e venceria o contrato de 2px. O raio vai no
    // global.css, com o seletor dobrado para ganhar a especificidade.
    VBtn: { elevation: 0, height: 52, class: 'text-none' },
    VCard: { elevation: 0 },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'campo' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'campo' },
    VTextarea: { variant: 'outlined', density: 'comfortable', color: 'campo' },
    VCheckbox: { color: 'campo', density: 'comfortable' },
    VChip: { size: 'small' },
  },
})
