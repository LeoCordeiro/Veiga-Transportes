<script setup>
import PaginaLegal from '@/components/PaginaLegal.vue'
import { empresa } from '@/config/site'

/**
 * REVISÃO JURÍDICA PENDENTE.
 *
 * O texto descreve o que o site faz hoje: coleta nome e telefone num
 * formulário e abre o WhatsApp. Precisa de leitura jurídica antes de publicar,
 * principalmente o prazo de guarda e o encarregado de dados.
 */
</script>

<template>
  <PaginaLegal titulo="Política de privacidade" atualizado="agosto de 2026">
    <p>
      Esta política explica o que a <strong>{{ empresa.fantasia }}</strong> faz com os
      dados que você digita neste site. Ela vale para os dois formulários — o de
      solicitação de entregas e o de cadastro de entregador.
    </p>

    <h2>Quem trata os seus dados</h2>
    <p>
      {{ empresa.razaoSocial }}, inscrita no CNPJ {{ empresa.cnpj }}, com base em
      {{ empresa.bairro }}, {{ empresa.baseRegiao }} — {{ empresa.cidade }}/{{ empresa.uf }}.
      Contato para assuntos de privacidade:
      <a :href="`mailto:${empresa.email}`">{{ empresa.email }}</a>.
    </p>

    <h2>O que coletamos</h2>
    <p>Só o que você mesmo escreve no formulário:</p>
    <ul>
      <li>
        <strong>Formulário de negócio:</strong> nome do responsável, nome do negócio,
        tipo de negócio, tipo de necessidade, volume médio, bairro de coleta e telefone.
      </li>
      <li>
        <strong>Formulário de entregador:</strong> nome completo, tipo de veículo,
        região de atuação, disponibilidade e telefone.
      </li>
    </ul>
    <p>
      Este site <strong>não usa cookies de rastreamento, não tem pixel de anúncio e
      não integra ferramenta de analytics</strong>. Não há login, não há conta e não
      guardamos nada no seu navegador.
    </p>

    <h2>Como os dados são enviados</h2>
    <p>
      O site <strong>não tem servidor próprio nem banco de dados</strong>. Ao enviar o
      formulário, os campos são montados numa mensagem e abertos no WhatsApp, no seu
      próprio aparelho — você vê a mensagem antes de mandar e decide se manda. Nada é
      transmitido sem essa confirmação.
    </p>
    <p>
      A partir do envio, a conversa passa a ocorrer no WhatsApp, e o tratamento dos
      dados ali também se sujeita à política de privacidade da Meta, que não temos
      como controlar.
    </p>

    <h2>Para que usamos</h2>
    <p>
      Exclusivamente para responder à sua solicitação: orçar e organizar entregas, no
      caso do comércio, ou chamar para corridas e rotas, no caso do entregador. Não
      vendemos, não alugamos e não repassamos os seus dados para terceiros com
      finalidade comercial.
    </p>

    <h2>Base legal</h2>
    <p>
      O tratamento é feito com base no <strong>seu consentimento</strong> (art. 7º, I da
      Lei 13.709/2018 — LGPD), coletado na caixa de marcação do formulário, e, quando a
      conversa evolui para contratação, na <strong>execução de contrato</strong>
      (art. 7º, V).
    </p>

    <h2>Por quanto tempo guardamos</h2>
    <p>
      As mensagens ficam no histórico do WhatsApp da central. Quando não houver mais
      relação comercial nem obrigação legal de guarda, os dados são apagados a pedido
      seu ou por revisão periódica da central.
    </p>

    <h2>Seus direitos</h2>
    <p>Pela LGPD, você pode pedir a qualquer momento:</p>
    <ul>
      <li>confirmação de que tratamos dados seus, e acesso a eles;</li>
      <li>correção de dado incompleto ou desatualizado;</li>
      <li>anonimização, bloqueio ou eliminação de dado desnecessário;</li>
      <li>portabilidade;</li>
      <li>informação sobre com quem compartilhamos;</li>
      <li>revogação do consentimento.</li>
    </ul>
    <p>
      Para exercer qualquer um deles, escreva para
      <a :href="`mailto:${empresa.email}`">{{ empresa.email }}</a>. Respondemos no prazo
      da lei.
    </p>

    <h2>Menores de idade</h2>
    <p>
      Os formulários são destinados a maiores de 18 anos. Não coletamos dados de
      crianças e adolescentes de forma consciente.
    </p>

    <h2>Mudanças nesta política</h2>
    <p>
      Se algo mudar, a data de atualização no topo desta página muda junto. Vale sempre
      a versão publicada aqui.
    </p>
  </PaginaLegal>
</template>
