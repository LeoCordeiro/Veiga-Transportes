/**
 * Dados da empresa e do conteúdo. Fonte única — nenhuma view repete texto
 * institucional nem número de contato.
 */

export const empresa = {
  razaoSocial: '57.554.496 LAERCIO VEIGA NETO',
  fantasia: 'Veiga Transportes',
  cnpj: '57.554.496/0001-62',
  cnae: '53.20-2-02 — Serviços de entrega rápida',
  // A base é o endereço do CNPJ. NÃO é a área de atuação — a rede cobre a
  // Grande São Paulo inteira. Os dois campos existem separados justamente
  // para não voltarem a ser confundidos no texto.
  bairro: 'Vila Regina',
  baseRegiao: 'Zona Leste',
  cidade: 'São Paulo',
  uf: 'SP',
  cobertura: 'Grande São Paulo',

  // Formato do wa.me: 55 + DDD + número, sem espaço nem pontuação.
  whatsapp: '5511927067198',
  whatsappExibicao: '(11) 92706-7198',
  email: 'contato@veigatransportes.com.br',
  instagram: 'veiga_transportes',
  reclameAqui: 'veigatransportes',

  // Faixa genérica de propósito. Não cravar "entrega em até X horas": prazo
  // fechado em site de serviço vira obrigação contratual exigível.
  atendimento: 'Segunda a sábado, horário comercial',
}

/** Perfis externos. Fonte única — nenhuma view monta URL de rede social. */
export const redes = [
  {
    id: 'whatsapp',
    nome: 'WhatsApp',
    rotulo: empresa.whatsappExibicao,
    url: `https://wa.me/${empresa.whatsapp}`,
  },
  {
    id: 'instagram',
    nome: 'Instagram',
    rotulo: `@${empresa.instagram}`,
    url: `https://instagram.com/${empresa.instagram}`,
  },
  {
    id: 'reclameaqui',
    nome: 'Reclame Aqui',
    rotulo: 'Nossa página',
    url: `https://www.reclameaqui.com.br/empresa/${empresa.reclameAqui}/`,
  },
]

/** O que o site promete, em uma frase. Usado no <title> e na meta description. */
export const posicionamento = {
  chamada: 'Rede de entregadores sob demanda na Grande São Paulo',
  descricao:
    'Entrega avulsa ou rota fixa em toda a Grande São Paulo. Atendimento humano ' +
    'na hora, entregador parceiro com documento e CNH conferidos, e confirmação ' +
    'por foto e assinatura. Sem manter frota própria.',
}

/**
 * As seis paradas da home. A ordem é a do percurso e importa: e-commerce
 * primeiro porque é o caso mais comum de quem chega.
 */
export const segmentos = [
  {
    id: 'ecommerce',
    nome: 'E-commerce local',
    desc: 'Vende pelo Instagram ou por marketplace e precisa entregar no mesmo dia, sem entregador na folha.',
    tag: 'Avulsa ou rota fixa',
  },
  {
    id: 'farmacia',
    nome: 'Farmácia',
    desc: 'Receita e medicamento que não podem esperar o dia seguinte.',
    tag: 'Urgência',
  },
  {
    id: 'floricultura',
    nome: 'Floricultura',
    desc: 'Arranjo com hora marcada, entregue de pé e sem sacudida no caminho.',
    tag: 'Hora marcada',
  },
  {
    id: 'petshop',
    nome: 'Pet shop',
    desc: 'Ração e volume pesado, que pedem carro em vez de moto.',
    tag: 'Carro',
  },
  {
    id: 'restaurante',
    nome: 'Restaurante',
    desc: 'Reforço nos horários de pico, sem contratar para um pico que dura duas horas.',
    tag: 'Pico',
  },
  {
    id: 'conveniencia',
    nome: 'Conveniência',
    desc: 'Pedido pequeno e repetido, que fecha melhor como rota.',
    tag: 'Rota fixa',
  },
]

/**
 * Fatos da faixa da home.
 *
 * Fatos verificáveis, não métrica de operação. Sem histórico consolidado,
 * publicar volume estimado seria propaganda enganosa. Quando houver dado real,
 * ele entra aqui.
 */
export const fatos = [
  { valor: 2, rotulo: 'Modalidades', desc: 'Avulsa e rota fixa' },
  { valor: 3, rotulo: 'Veículos', desc: 'Moto, bike e carro' },
  { texto: 'Grande SP', rotulo: 'Cobertura', desc: 'Capital e região metropolitana' },
  { texto: 'Seg–Sáb', rotulo: 'Atendimento', desc: 'Horário comercial' },
]

/**
 * Os seis diferenciais — o bloco numerado da home.
 *
 * Argumento numerado lê como lista de razões, e a numeração se sustenta.
 * Segmento de cliente não tem ordem e por isso não fica aqui.
 *
 * Cada item precisa de lastro. "Entregador qualificado" sozinho é adjetivo
 * que o leitor pula. O que a empresa confere hoje é documento e CNH — é isso
 * que o texto diz. Quando o cadastro passar a exigir mais, o texto acompanha.
 */
export const diferenciais = [
  {
    id: 'resposta',
    nome: 'Resposta na hora',
    desc: 'Você chama no WhatsApp e alguém responde. Não é robô, não é protocolo, não é "retornaremos em até 48 horas".',
    tag: 'Atendimento humano',
  },
  {
    id: 'coleta',
    nome: 'Coleta sem fila',
    desc: 'A central aciona o entregador que já está mais perto da sua porta, no veículo certo para o volume.',
    tag: 'Rede na rua',
  },
  {
    id: 'cobertura',
    nome: 'Toda a Grande São Paulo',
    desc: 'Capital e região metropolitana. Se o seu cliente está na cidade, a entrega chega nele.',
    tag: 'Capital e RMSP',
  },
  {
    id: 'parceiro',
    nome: 'Documento e CNH conferidos',
    desc: 'Ninguém entra na rede sem identidade e habilitação válidas na categoria do veículo. Quem pega a sua carga foi verificado antes.',
    tag: 'Rede verificada',
  },
  {
    id: 'modalidade',
    nome: 'Avulsa ou rota fixa',
    desc: 'Pede quando aparece, ou contrata um pacote mensal com desconto por volume. Você escolhe conforme o movimento.',
    tag: 'Dois formatos',
  },
  {
    id: 'faturamento',
    nome: 'Faturamento fechado',
    desc: 'O acerto é com a central, num valor só. Sem pagamento avulso na porta, sem acerto individual com cada entregador.',
    tag: 'Um acerto só',
  },
]

export const confirmacao =
  'Toda entrega fecha com foto e assinatura de quem recebeu.'

/** Os três passos, para a seção "como funciona". */
export const passos = [
  {
    n: '01',
    titulo: 'Você solicita',
    desc: 'Pede uma entrega avulsa pelo WhatsApp ou contrata uma rota fixa recorrente.',
  },
  {
    n: '02',
    titulo: 'A central aciona',
    desc: 'A gente chama um entregador da rede que já está na região, no veículo certo para o volume.',
  },
  {
    n: '03',
    titulo: 'Entregue e confirmado',
    desc: 'Você acompanha até a entrega e recebe a confirmação com foto e assinatura.',
  },
]

/** Opções dos formulários. Alimentam os v-select — não duplicar na view. */
export const opcoes = {
  tipoNegocio: [
    'E-commerce',
    'Farmácia',
    'Floricultura',
    'Pet shop',
    'Restaurante',
    'Conveniência',
    'Outro',
  ],
  necessidade: ['Entrega avulsa', 'Rota fixa recorrente', 'Ainda não sei'],
  volume: [
    'Até 5 entregas por semana',
    'De 5 a 20 por semana',
    'De 20 a 50 por semana',
    'Mais de 50 por semana',
  ],
  veiculo: ['Moto', 'Bike', 'Carro'],
  periodo: ['Manhã', 'Tarde', 'Noite', 'O dia todo'],
  diasSemana: ['Dias úteis', 'Fins de semana', 'Todos os dias'],
}

/** Prefixos de triagem da mensagem de WhatsApp. */
export const prefixos = {
  negocio: '[NEGÓCIO]',
  entregador: '[ENTREGADOR]',
}
