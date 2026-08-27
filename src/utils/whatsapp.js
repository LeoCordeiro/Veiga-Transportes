import { empresa } from '@/config/site'

/**
 * Monta o link do WhatsApp com a mensagem já formatada.
 *
 * Todo formulário do site termina aqui — não há backend, e não precisa haver:
 * o que a Veiga quer do site é a conversa começando com os dados na mão.
 *
 *   linkWhatsApp('[NEGÓCIO]', [['Nome', 'Ana'], ['Bairro', 'Vila Regina']])
 *   → https://wa.me/55...?text=%5BNEG%C3%93CIO%5D%0ANome%3A%20Ana%0A...
 *
 * Campo vazio é descartado em vez de virar "Bairro: " — linha sem valor só
 * atrapalha quem vai ler a mensagem do outro lado.
 */
export function linkWhatsApp(prefixo, linhas = [], destino) {
  const corpo = linhas
    .filter(([, valor]) => valor !== undefined && valor !== null && String(valor).trim() !== '')
    .map(([rotulo, valor]) => `${rotulo}: ${String(valor).trim()}`)
    .join('\n')

  const texto = corpo ? `${prefixo}\n${corpo}` : prefixo
  const numero = destino || empresa.whatsapp
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

/**
 * `noopener` não é detalhe: sem ele a aba aberta recebe `window.opener` e pode
 * navegar a nossa de volta para onde quiser.
 */
export function abrirWhatsApp(url) {
  window.open(url, '_blank', 'noopener')
}
