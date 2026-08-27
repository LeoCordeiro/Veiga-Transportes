<script setup>
import PaginaLegal from '@/components/PaginaLegal.vue'
import { empresa } from '@/config/site'

/**
 * REVISÃO JURÍDICA PENDENTE.
 *
 * Dois pontos que precisam de atenção do advogado, e que estão redigidos com
 * cuidado justamente por isso:
 *
 * 1. NENHUM PRAZO EM NÚMERO. "Entrega em até X horas" num site de serviço vira
 *    obrigação contratual exigível, e a operação é nova, sem histórico para
 *    sustentar promessa. Prazo se combina por pedido.
 *
 * 2. A NATUREZA DO VÍNCULO com o entregador. O texto diz que a Veiga é central
 *    de intermediação e que o entregador é autônomo — mas isso é descrição do
 *    modelo, não blindagem: a caracterização de vínculo depende de como a
 *    operação roda na prática, não do que o site declara.
 */
</script>

<template>
  <PaginaLegal titulo="Termos de uso" atualizado="agosto de 2026">
    <p>
      Estes termos valem para o uso deste site. Contratar entregas ou entrar na rede
      envolve um acordo à parte, combinado diretamente com a central.
    </p>

    <h2>O que é a {{ empresa.fantasia }}</h2>
    <p>
      A <strong>{{ empresa.razaoSocial }}</strong> (CNPJ {{ empresa.cnpj }}) atua como
      <strong>central de intermediação de entregas</strong>: recebe a solicitação do
      comércio, aciona um entregador da rede e acompanha até a confirmação. A atividade
      está registrada sob o CNAE {{ empresa.cnae }}.
    </p>

    <h2>O que este site faz</h2>
    <p>
      Este site é institucional. Ele apresenta o serviço e encaminha o contato para o
      WhatsApp da central. <strong>Não há contratação, pagamento, rastreamento ou
      área de cliente aqui</strong> — nenhum pedido se torna firme por meio deste site.
    </p>

    <h2>Prazos e disponibilidade</h2>
    <p>
      As entregas dependem de entregador disponível na região, do trânsito, das
      condições do tempo e do tipo de carga. <strong>Nenhum prazo é garantido por este
      site</strong>: cada prazo é combinado no momento do pedido, com a central, e é
      esse combinado que vale.
    </p>
    <p>
      A área de atuação é a {{ empresa.cobertura }} — capital e municípios da região
      metropolitana. Endereço fora dessa área pode ser recusado, e a central informa
      isso antes de a corrida sair, nunca depois.
    </p>

    <h2>Entregadores da rede</h2>
    <p>
      Os entregadores são <strong>profissionais autônomos</strong>, com veículo próprio,
      que escolhem os períodos em que ficam disponíveis. A Veiga faz o despacho e o
      repasse; não há relação de emprego entre a central e o entregador pelo simples
      cadastro na rede.
    </p>

    <h2>Responsabilidade sobre a carga</h2>
    <p>
      O remetente é responsável por embalar a carga de forma adequada ao transporte e
      por declarar corretamente o que está enviando. <strong>Não transportamos</strong>
      itens ilícitos, armas, produtos controlados sem a documentação exigida, animais
      vivos, valores em espécie ou qualquer item cuja circulação seja proibida.
    </p>
    <p>
      Ocorrências de avaria, extravio ou atraso são tratadas caso a caso com a central,
      conforme o que tiver sido combinado na contratação e, quando houver, conforme a
      cobertura de seguro contratada.
    </p>

    <h2>Confirmação de entrega</h2>
    <p>
      Toda entrega é encerrada com registro — foto e assinatura de quem recebeu. Esse
      registro é o comprovante da operação e fica disponível para o contratante.
    </p>

    <h2>Conteúdo do site</h2>
    <p>
      A marca, o logotipo, os textos e o layout deste site pertencem à
      {{ empresa.fantasia }}. As fotografias usadas são licenciadas para uso comercial e
      ilustram o contexto do serviço; não retratam necessariamente operações,
      entregadores ou clientes da empresa.
    </p>

    <h2>Dados pessoais</h2>
    <p>
      O tratamento dos dados enviados pelos formulários está descrito na
      <RouterLink to="/privacidade">política de privacidade</RouterLink>.
    </p>

    <h2>Mudanças</h2>
    <p>
      Estes termos podem mudar. A data de atualização no topo indica a versão vigente, e
      é sempre a publicada aqui que vale.
    </p>

    <h2>Foro</h2>
    <p>
      Fica eleito o foro da comarca de {{ empresa.cidade }}/{{ empresa.uf }} para
      resolver questões decorrentes destes termos.
    </p>
  </PaginaLegal>
</template>
