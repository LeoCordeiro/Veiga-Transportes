# Direções visuais

Três estudos de direção para o site, cada um partindo de uma metáfora do
negócio — não de uma variação de paleta. Três dosagens da mesma cor decidiriam
cor, não estrutura, e a escolha viraria "qual fundo eu prefiro".

**Aprovada: Traçado da Rota.** Vive em `direcao-aprovada.html` e é o contrato
visual do projeto. `direcao-3.html` fica como registro do que foi apresentado.

| Arquivo | Direção | Metáfora | Dosagem |
|---|---|---|---|
| `direcao-1.html` | Painel de Despacho | A home é a central de operação vista por dentro | grafite ~75% |
| `direcao-2.html` | Comprovante de Entrega | A página imita o documento que fecha a entrega | claro ~80% |
| `direcao-aprovada.html` | Traçado da Rota | Uma linha costura a página; cada seção é uma parada | 50/50 |

Abra em navegador comum — são arquivos autocontidos, sem build.

## O que é igual nas três

- Paleta oficial, extraída do arquivo do logotipo
- Archivo (display) + IBM Plex Sans (corpo) + IBM Plex Mono (dado com função real)
- Raio de 2px. A marca é toda aresta reta
- Ângulo de 30° da vertical em todo corte diagonal
- Faixa de fatos verificáveis, sem métrica estimada
- `prefers-reduced-motion` desliga toda animação, inclusive a de marca

## O ângulo de 30°

As arestas do próprio V dão a razão **0,577 : 1** (horizontal : vertical):

| Aresta | Cálculo | Ângulo |
|---|---|---|
| interna esquerda `36,0 → 65,50` | 29 / 50 = 0,580 | 30,1° |
| lasca âmbar `54.6,94 → 86,148` | 31,4 / 54 = 0,582 | 30,2° |

Todo recorte, wipe e cotovelo de rota usa esse ângulo. **Nunca 45°** — 45° é a
diagonal de qualquer marca; 30° é a desta.

## Contraste (WCAG 2.1), inclusive o que reprova

| Par | Razão | Veredito |
|---|---|---|
| branco `#FFFFFF` / grafite `#1A1A1A` | 17,4:1 | AAA — texto principal no escuro |
| âmbar `#FFC107` / grafite | 10,7:1 | AAA — rótulo e destaque |
| grafite / âmbar cheio | 10,7:1 | AAA — o rótulo do CTA |
| grafite / cinza-claro `#F4F4F4` | 15,8:1 | AAA — texto nas faixas claras |
| cinza `#9A9A9A` / grafite | 6,2:1 | AA — secundário no escuro |
| cinza-escuro `#5E5E5E` / branco | 6,5:1 | AA — secundário no claro |
| cinza-2 `#8A8A8A` / grafite | 5,0:1 | AA — legenda no escuro |
| cinza `#9A9A9A` / `#2A2A2A` | 5,1:1 | AA — rótulo desativado |
| **cinza `#9A9A9A` / branco** | **2,8:1** | **REPROVA** → no claro, usar `#5E5E5E` |
| **âmbar / branco** | **1,6:1** | **REPROVA** → âmbar nunca é texto no claro |
| **âmbar / `#F4F4F4`** | **1,5:1** | **REPROVA** |
| **cinza `#9A9A9A` / `#333333`** | **4,49:1** | **REPROVA por 0,01** → fundo desativado é `#2A2A2A` |
| **cinza-2 `#8A8A8A` / `#DEDEDE`** | **2,6:1** | **REPROVA** → rótulo desativado no claro é `#5E5E5E` |

Três regras saem daí, e valem no site inteiro:

1. Âmbar é preenchimento e ornamento, nunca texto sobre fundo claro
2. O CTA âmbar leva rótulo grafite, nunca branco
3. O cinza do secundário muda com o fundo — resolvido por token

## Verificação

`node scripts/medir.mjs <url> <largura> <altura>` sobe o Chrome sem interface e
mede no contexto da página, depois que a fonte carregou. Resultado das três, em
390px e 1440px: overflow 0, três famílias de fonte, nenhuma reprovação de
contraste, nenhum raio acima de 2px.

## Fotos

Doze imagens curadas em `src/assets/fotos/`, com autor e licença em
`_creditos.json`. Todas entram com duotone grafite → âmbar e recorte no ângulo
do V. A curva do duotone tem quatro pontos, não dois — com dois, o mapeamento é
linear e a imagem fica chapada.

Descartes registrados, para não serem recolhidos de novo: imagens com marca de
terceiro visível, comércio fora do contexto brasileiro, e retrato posado de
entregador (lê como banco de imagem).
