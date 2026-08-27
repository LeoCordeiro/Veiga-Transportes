# Vídeo do hero

**Instalado:** `hero-veiga.mp4` — H.264, 1280×720, 20 s, 4,3 MB, com áudio AAC.

Origem: *"São Paulo do alto — imagens aéreas feitas com o drone Mavic 2 Zoom"*,
cortado **a partir do segundo 5** do original. Como o corte está no arquivo, o
laço volta para o segundo 5 — não para o começo do vídeo bruto.

## Como foi processado

```bash
ffmpeg -ss 5 -t 20 -i entrada.mp4 \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -vf "scale=1280:-2" \
  -movflags +faststart -c:a aac -b:a 80k -ac 2 hero-veiga.mp4
```

- **1280×720 e não 1080p:** o vídeo fica atrás de véu e de tinta de marca. A
  1080p pesava 12 MB para ganho que ninguém vê.
- **`+faststart`:** põe o índice no começo do arquivo, então o vídeo começa a
  tocar antes de terminar de baixar.
- **Áudio mantido** porque o hero usa som ambiente (ver abaixo).
- **Sem WebM.** Foi gerado e descartado: VP9 saiu com 8,8 MB contra 4,3 MB do
  H.264. Imagem aérea de drone tem detalhe fino demais para o VP9 compensar.

## O áudio

O vídeo **começa mudo, e isso não é escolha**: Chrome, Safari e Firefox
bloqueiam autoplay com som. Um `play()` com áudio antes de qualquer gesto é
rejeitado e o vídeo simplesmente não começa.

O fluxo implementado em `HeroHome.vue`:

1. toca mudo — o fundo se mexe desde o primeiro quadro
2. **no primeiro gesto do usuário** em qualquer lugar da página (clique, toque
   ou tecla), o som entra em `volume = 0.12`
3. o botão **Som** fica sempre visível, para ligar e desligar na mão
4. depois de desligar pelo botão, nenhum gesto religa — decisão manual manda
5. quem pede `prefers-reduced-motion` não recebe som nem vídeo, só o poster

Volume 0,12 é som ambiente de verdade. Acima disso o vídeo compete com quem
está lendo, e o primeiro reflexo de quem chega vira procurar o botão de
desligar.

## Trocar o vídeo

Substitua `hero-veiga.mp4` mantendo o nome. O poster
(`src/assets/fotos/hero-video-poster.jpg`) é o primeiro quadro e precisa ser
regerado junto, senão a troca pisca:

```bash
ffmpeg -y -i public/video/hero-veiga.mp4 -frames:v 1 -q:v 3 src/assets/fotos/hero-video-poster.jpg
```

Depois, **medir o contraste de novo** — fundo diferente muda tudo:

```bash
node scripts/contraste-video.mjs http://localhost:4173/ 1440
node scripts/contraste-video.mjs http://localhost:4173/ 390
```

Se algo reprovar, o ajuste é no `.hero-veu` do `HeroHome.vue`.

### O que serve como fundo

Movimento contínuo e lento, assunto à direita, espaço vazio à esquerda (a
headline e a rota ocupam a esquerda). Corte seco no meio denuncia a emenda do
laço.

**Não serve:** entregador posando para a câmera, nem qualquer marca de
terceiro visível. Neste vídeo específico, os trechos depois do segundo 12 são
Paulista, Ponte Estaiada e Ibirapuera — cartão-postal corporativo, que não
comunica o serviço.
