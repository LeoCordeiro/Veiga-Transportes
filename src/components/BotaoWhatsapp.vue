<script setup>
import { empresa } from '@/config/site'

/**
 * Botão flutuante de WhatsApp — padrão da casa em todo site de cliente.
 *
 * Ícone em SVG inline: não vale carregar uma fonte de ícones inteira, nem
 * depender do mdi, por um glifo só.
 *
 * A cor é o verde oficial do WhatsApp (#25D366) e não a paleta da Veiga — é
 * reconhecimento, não decoração: quem procura o botão procura o verde. O
 * ícone vai em verde bem escuro porque branco sobre #25D366 mede 2,1:1 e
 * reprova; o escuro mede 6,1:1.
 */
const link = `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(
  'Olá! Vim pelo site da Veiga Transportes.',
)}`
</script>

<template>
  <a
    class="zap"
    :href="link"
    target="_blank"
    rel="noopener"
    aria-label="Falar com a Veiga Transportes no WhatsApp"
  >
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
      />
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.26 8.24z"
      />
    </svg>
    <span class="sr">WhatsApp</span>
  </a>
</template>

<style scoped>
.zap {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #25d366;
  color: #06331a;
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.6);
  transition: transform 200ms var(--t-swift-out);
}
.zap:hover {
  transform: translateY(-3px);
}
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@media (max-width: 767px) {
  .zap {
    right: 16px;
    bottom: 16px;
    width: 54px;
    height: 54px;
  }
}
</style>
