/**
 * Regras de validação dos dois formulários.
 *
 * Cada regra devolve `true` ou a mensagem de erro — é o contrato que o
 * `v-form` do Vuetify espera em `:rules`.
 *
 * Nada de máscara no v-model: máscara reescreve o valor a cada tecla e o
 * v-form revalida com o valor intermediário, travando o campo. A validação
 * trabalha sobre os dígitos; a formatação fica para a mensagem de saída.
 */

const digitos = (v) => String(v || '').replace(/\D/g, '')

export const obrigatorio = (rotulo = 'Campo') => (v) =>
  (v !== null && v !== undefined && String(v).trim() !== '') || `${rotulo} é obrigatório`

export const nome = (v) => {
  const t = String(v || '').trim()
  if (t.length < 3) return 'Escreva o nome completo'
  if (!t.includes(' ')) return 'Escreva nome e sobrenome'
  return true
}

/**
 * Telefone brasileiro: 10 dígitos (fixo com DDD) ou 11 (celular com o 9).
 * Aceita o que a pessoa digitar — com parênteses, traço, espaço ou nada.
 */
export const telefone = (v) => {
  const d = digitos(v)
  if (d.length < 10) return 'Informe o DDD e o número'
  if (d.length > 11) return 'Número longo demais'
  if (d.length === 11 && d[2] !== '9') return 'Celular com 11 dígitos começa com 9 após o DDD'
  return true
}

export const aceite = (v) => v === true || 'É preciso aceitar para enviar'

/** Formata só na saída, para a mensagem ficar legível de quem recebe. */
export function formatarTelefone(v) {
  const d = digitos(v)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return String(v || '')
}
