# Veiga Transportes — site institucional

Rede de entregadores sob demanda na Grande São Paulo. O site tem duas pontas:
capta **negócio** (comércio sem frota própria) e **entregador parceiro**. Não há
backend — os dois formulários montam a mensagem e abrem o WhatsApp da central.

```bash
npm install
npm run dev        # http://localhost:5186
npm run build
npm run preview
npm run icones     # regenera favicon e avatar a partir da geometria do logotipo
```

## Stack

Vue 3.5 · Vuetify 3.13 · Vite 6 · Vue Router com `createWebHashHistory`.
Node 24. Deploy no Netlify.

Sem PWA: o site é institucional, não precisa de offline, e o plugin não
acompanha o Node 24.

## Estrutura

```
public/            favicon, og image, vídeo do hero
scripts/           utilitários de build e verificação (não vão para o bundle)
design-previews/   as direções visuais estudadas e a aprovada
src/
  assets/          marca (SVG) e fotos tratadas
  components/      componentes de UI
  config/          tokens.js e site.js — a fonte única de estilo e conteúdo
  directives/      v-revela (entrada por scroll)
  plugins/         tema do Vuetify
  router/          rotas
  styles/          global.css
  utils/           whatsapp.js e validadores.js
  views/           páginas
```

**Duas fontes únicas, e nada fora delas:**

- `src/config/tokens.js` — cor, tipografia, raio, medida, movimento. Alimenta o
  tema do Vuetify e as CSS custom properties. **Hex dentro de um `.vue` é bug.**
- `src/config/site.js` — dados da empresa, textos institucionais, opções dos
  formulários. Nenhuma view repete telefone, e-mail ou texto de posicionamento.

## Identidade

- **Paleta:** grafite `#1A1A1A`, âmbar `#FFC107`, cinzas, `#F4F4F4`, branco
- **Tipografia:** Archivo 900 no display (é a fonte do logotipo), IBM Plex Sans
  no corpo, IBM Plex Mono só em dado com função real
- **Raio 2px** em tudo — a marca é toda aresta reta
- **Ângulo de 30° da vertical** (razão 0,577) em todo corte diagonal, derivado
  das arestas do próprio V. Nunca 45°

**Três regras de cor que não se negocia:**

1. Âmbar é preenchimento e ornamento — nunca texto sobre fundo claro
   (1,6:1 sobre branco, reprova em contraste)
2. O CTA âmbar leva rótulo grafite, nunca branco
3. O cinza do texto secundário muda com o fundo: `#9A9A9A` no escuro,
   `#5E5E5E` no claro. Resolvido por token, não escolhido a cada componente

A tabela completa de contraste, com os pares que reprovam, está no cabeçalho de
`src/config/tokens.js`.

## Verificação

Quatro utilitários sem dependência, sobre o protocolo de depuração do Chrome.

```bash
node scripts/medir.mjs           <url> [largura] [altura]   # overflow, fontes, contraste
node scripts/captura.mjs         <url> <saida.png> [l] [a]  # screenshot com viewport real
node scripts/avaliar.mjs         <url> "<expressao js>"     # inspeção pontual
node scripts/contraste-video.mjs <url> [largura]            # contraste sobre vídeo
```

O `captura.mjs` existe porque `chrome --headless --screenshot --window-size=390`
não aplica viewport de layout: a página é diagramada larga e o PNG apenas
recorta, o que parece um site quebrado quando o layout está correto.

O `contraste-video.mjs` existe porque medidor de contraste comum lê a cor de
fundo declarada no CSS — e sobre vídeo isso não diz nada, já que atrás do texto
passa um quadro que muda de luminância 24 vezes por segundo. Ele avança o vídeo
em dez instantes, esconde o texto, mede o fundo puro e reporta o pior quadro.

Estado atual, em 390px e 1440px, em todas as páginas:

```
overflow horizontal ........ 0
famílias renderizadas ...... 3 (Archivo, IBM Plex Sans, IBM Plex Mono)
raio maior que 2px ......... nenhum, exceto o botão flutuante (exceção declarada)
backdrop-filter / glow ..... nenhum
contraste .................. sem reprovação
texto sobre o vídeo ........ pior quadro 9,7:1 (H1) · 11,6:1 (corpo) · 10,7:1 (rótulo)
formulários ................ enviam com prefixo de triagem e telefone formatado
consentimento .............. bloqueia o envio quando desmarcado
```

## O hero

Vídeo aéreo da cidade como fundo da seção inteira, tratado com dessaturação
mais uma camada âmbar em blend de cor. Som ambiente em volume 0,12 que entra no
primeiro gesto do usuário — autoplay com áudio é bloqueado por todos os
navegadores, então mudo é o único começo possível. Controles de som e pausa
sempre visíveis (WCAG 2.2.2 e 1.4.2).

O tratamento do vídeo usa filtro CSS e não o filtro SVG que trata as fotos:
`filter: url(#duotone)` num vídeo de tela cheia roda quadro a quadro fora do
caminho rápido de composição e engasga em aparelho de entrada. Detalhes em
`public/video/LEIA-ME.md`.

## Armadilhas desta stack

- **O CSS do Vuetify entra depois do global** e vence o empate de
  especificidade. Contra-medida: dobrar a classe (`.v-card.v-card`)
- **Nunca a prop `rounded`** — gera `border-radius !important` e o contrato de
  2px não chega
- **Manter `import 'vuetify/styles'`** — removê-lo economiza ~244KB e quebra o
  `v-select`, que existe nos dois formulários
- **`<img>` sempre, nunca `v-img`.** Sem `v-app-bar` (abre costura no hero).
  Sem `<transition mode="out-in">` (trava em aba sem composição)
- **`v-select` renderiza `input[type=text]`** — teste que pega input por índice
  acerta o campo errado
- **Sem máscara no `v-model`** de telefone: trava o `v-form`. A formatação
  acontece na mensagem de saída
- **IntersectionObserver com `threshold: 0`** e margem em px. Com threshold
  alto, bloco mais alto que a viewport nunca revela
- **Rota SVG com cotovelo não pode esticar** — `preserveAspectRatio="none"`
  achata o ângulo de 30°. Ver a prop `modo` em `RotaTraco.vue`

## Deploy

`netlify.toml` versionado, com `NODE_VERSION` fixado e `.nvmrc` casando.
Conectar o repositório no Netlify: build `npm run build`, publicação em `dist`.

## Pendências

| O quê | Onde |
|---|---|
| Confirmar a lista de municípios da região metropolitana | `src/views/AreaView.vue` |
| Revisão jurídica da política de privacidade e dos termos | `src/views/legal/` |

Nenhum número de operação foi publicado sem lastro: a faixa da home traz fatos
verificáveis (modalidades, veículos, cobertura, atendimento), não métricas
estimadas. E nenhum prazo em número — prazo fechado em site de serviço vira
obrigação contratual exigível.

## Fotos

Doze imagens em `src/assets/fotos/`, com autor e licença em `_creditos.json`.
Todas entram com duotone grafite → âmbar (filtro `#duotone-veiga`, declarado no
`index.html`) e recorte no ângulo do V.

A curva do duotone tem quatro pontos, não dois: com dois, o mapeamento é linear,
joga todo meio-tom para o âmbar e a imagem fica chapada.
