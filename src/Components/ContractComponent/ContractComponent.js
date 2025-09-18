// src/components/ContractComponent.jsx
import React from "react";
import "./ContractComponent.css";

const ContractComponent = ({ clientData, contractData }) => {
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return months[monthNumber - 1];
  };

  const today = new Date();
  const day = today.getDate();
  const month = getMonthName(today.getMonth() + 1);
  const year = today.getFullYear();

  const hasRg = clientData.rg && clientData.rg.trim() !== "";

  return (
    <div className="contract-container">
      <header className="contract-header">
        <div className="logo-section">
          <img
            src="/img/logo.png"
            alt="Gemas Brilhantes Logo"
            className="logo"
          />
        </div>
        <div className="title-section">
          <h2>
            CONTRATO DE COMPRA E VENDA DE GEMAS PRECIOSAS COM CLÁUSULA DE
            RECOMPRA - GEMCASH
          </h2>
        </div>
      </header>

      <section className="preamble">
        <p>Pelo presente instrumento particular, as PARTES:</p>
        <div className="party-details">
          <p>
            <strong>GEMAS BRILHANTES</strong>, pessoa jurídica de direito
            privado, inscrita no CNPJ/MF n° 50.793.164/0001-91, com sede em
            Avenida Paulista, nº 1471 Cxpst 2659 Conj 511, Bela Vista, São
            Paulo-SP, CEP 01.311-927, neste ato devidamente representada por seu
            representante legal, doravante denominada simplesmente "VENDEDOR" ou
            "GEMAS BRILHANTES";
          </p>
          <p>E</p>
          <p>
            <strong>{clientData.name.toUpperCase()}</strong>, pessoa física,
            inscrito(a) no CPF nº {clientData.cpfCnpj},{" "}
            {hasRg && `RG nº ${clientData.rg},`} residente e domiciliado(a) em{" "}
            {clientData.address.fullAddress}, doravante denominado(a)
            simplesmente "COMPRADOR" ou "USUÁRIO";
          </p>
          <p>
            As partes acima identificadas, em conjunto, como "PARTES", e
            isoladamente como "PARTE", têm entre si, justas e acertadas a
            celebração do presente Contrato de Compra e Venda de Gemas Preciosas
            com Cláusula de Recompra, que se regerá pelas cláusulas e condições
            a seguir:
          </p>
        </div>
      </section>

      <section className="clauses-section">
        <h3>CONSIDERAÇÕES PRELIMINARES:</h3>
        <ol>
          <li>
            Considerando que a GEMAS BRILHANTES é pessoa jurídica que atua no
            mercado de minérios, pedras preciosas, joias e mineração, e oferece
            a seus clientes o produto GemCash, uma modalidade de aquisição de
            gemas preciosas certificadas com um benefício mensal e opção de
            recompra garantida;
          </li>
          <li>
            Considerando que o COMPRADOR declara ter plena capacidade civil para
            celebrar este CONTRATO e assumir as obrigações nele previstas;
          </li>
          <li>
            Considerando que o COMPRADOR declara ter lido, compreendido e aceito
            as condições estabelecidas neste CONTRATO e na proposta comercial
            específica da sua aquisição;
          </li>
        </ol>
        <p>
          AS PARTES celebram o presente CONTRATO, que se regerá pelas seguintes
          cláusulas e condições:
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 1ª - DEFINIÇÕES E INTERPRETAÇÕES</h3>
        <p>
          Para os fins do presente CONTRATO, os termos abaixo terão os seguintes
          significados, salvo se expressamente indicado em contrário:
        </p>
        <ul>
          <li>
            <strong>Gemas Brilhantes / Vendedor:</strong> Refere-se à empresa
            GEMAS BRILHANTES (D GIACOMO LTDA), conforme qualificada no preâmbulo
            deste CONTRATO.
          </li>
          <li>
            <strong>Comprador / Usuário:</strong> Refere-se ao cliente que
            adquire Gemas Preciosas através do produto GemCash, conforme
            qualificado no preâmbulo deste CONTRATO.
          </li>
          <li>
            <strong>GemCash:</strong> Refere-se ao produto exclusivo da GEMAS
            BRILHANTES, que combina a aquisição de Gemas Preciosas certificadas
            com a possibilidade de um benefício mensal e opção de recompra
            garantida.
          </li>
          <li>
            <strong>Gemas Preciosas:</strong> Refere-se, predominantemente, a
            diamantes lapidados certificados, podendo incluir outras gemas
            nobres (como turmalinas, safiras, rubis, esmeraldas, tanzanitas,
            entre outras), conforme disponibilidade do VENDEDOR e critérios
            técnicos de qualidade, estética e procedência.
          </li>
          <li>
            <strong>Certificação:</strong> Documento emitido por laboratórios
            nacionais e internacionais de referência (GIA, IGI, IGL, entre
            outros) atestando a autenticidade e características da Gema
            Preciosa.
          </li>
          <li>
            <strong>Plataforma Digital:</strong> Refere-se ao endereço
            eletrônico oficial da GEMAS BRILHANTES (www.gemasbrilhantes.com.br)
            e à Área do Cliente, onde o COMPRADOR poderá gerenciar sua
            aquisição, opções de remuneração e comunicação.
          </li>
          <li>
            <strong>Remuneração Mensal:</strong> Benefício financeiro pago
            mensalmente ao COMPRADOR, calculado sobre o valor inicial da
            aquisição da Gema Preciosa, conforme as condições e taxas
            estabelecidas neste CONTRATO e na proposta comercial.
          </li>
          <li>
            <strong>Custódia:</strong> Modalidade em que a Gema Preciosa
            adquirida permanece sob a guarda e responsabilidade da GEMAS
            BRILHANTES, em local seguro, pelo período contratual.
          </li>
          <li>
            <strong>LGPD:</strong> Lei Geral de Proteção de Dados (Lei nº
            13.709/2018).
          </li>
          <li>
            <strong>Força Maior / Caso Fortuito:</strong> Eventos imprevisíveis
            ou de difícil previsão, e inevitáveis, que impedem o cumprimento de
            uma obrigação contratual.
          </li>
        </ul>
      </section>

      <section className="clauses-section">
        <h3>
          CLÁUSULA 2ª DO OBJETO DO CONTRATO E CARACTERÍSTICAS DO PRODUTO GEMCASH
        </h3>
        <p>
          <strong>ARTIGO 1º.</strong> O presente CONTRATO tem por objeto a
          compra e venda de Gemas Preciosas certificadas pela GEMAS BRILHANTES
          ao COMPRADOR, através do produto GemCash, conforme as condições e
          propostas comerciais específicas acordadas no momento da aquisição.
        </p>
        <p>
          <strong>ARTIGO 2º.</strong> Desde o momento da aquisição e confirmação
          do pagamento, a Gema Preciosa torna-se de propriedade integral do
          COMPRADOR, independentemente da escolha de posse física ou custódia.
        </p>
        <p>
          <strong>ARTIGO 3º.</strong> A aquisição de Gemas Preciosas pelo
          COMPRADOR se dará de acordo com as condições de preço e quantidade, e
          as regras e condições estabelecidas na proposta de contratação e neste
          CONTRATO, às quais o COMPRADOR manifesta sua concordância integral.
        </p>
        <p>
          <strong>ARTIGO 4º.</strong> As Gemas Preciosas serão entregues com
          Certificação nacional e/ou internacional de laboratórios renomados
          (GIA, IGI ou IGL, entre outros), e terão seu valor e características
          avaliados conforme padrões de mercado e destes laboratórios.
        </p>
        <p>
          <strong>ARTIGO 5º</strong> A GEMAS BRILHANTES oferece ao COMPRADOR as
          seguintes modalidades de posse da Gema Preciosa:
        </p>
        <p>
          a) <strong>Posse Física:</strong> O COMPRADOR recebe e mantém a Gema
          Preciosa em sua posse desde o início do CONTRATO.
        </p>
        <p>
          b) <strong>Custódia da GEMAS BRILHANTES:</strong> A Gema Preciosa
          permanece sob a custódia da GEMAS BRILHANTES em local seguro, sendo
          esta responsável por sua guarda e conservação até o término do prazo
          contratual ou solicitação de entrega pelo COMPRADOR.
        </p>
        <p>
          <strong>ARTIGO 6º.</strong> O COMPRADOR se compromete a não utilizar a
          Plataforma Digital e os serviços da GEMAS BRILHANTES para fins diretos
          ou indiretos de (i) infringir qualquer lei, regulamento ou contrato,
          nem praticar atos contrários à moral e aos bons costumes;
        </p>
        <p>
          (ii) praticar lavagem de dinheiro; e/ou (iii) financiar atividades
          e/ou organizações que envolvam terrorismo, crime organizado, tráfico
          de drogas, pessoas e/ou órgãos humanos, estelionato e quaisquer outros
          crimes previstos na legislação brasileira ou normas internacionais.
        </p>
        <p>
          <strong>ARTIGO 7°.</strong> A GEMAS BRILHANTES esclarece que a
          aquisição de Gemas Preciosas através do GemCash constitui uma compra e
          venda de bens reais, e não caracteriza custódia de dinheiro,
          arbitragem de ativos financeiros ou qualquer modalidade de
          investimento financeiro.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 3ª - DO PREÇO E DAS FORMAS DE PAGAMENTO</h3>
        <p>
          <strong>ARTIGO 8º.</strong> O valor mínimo de aquisição inicial de
          Gemas Preciosas pelo produto GemCash é de{" "}
          {formatCurrency(contractData.amount)}, podendo o COMPRADOR optar por
          valores maiores, conforme sua discricionariedade e as propostas
          comerciais da GEMAS BRILHANTES.
        </p>
        <p>
          <strong>ARTIGO 9º</strong> O pagamento da aquisição poderá ser
          realizado através de PIX, transferência bancária ou boleto bancário.
          Não será aceita a modalidade de pagamento por cartão de crédito.
        </p>
        <p>
          <strong>ARTIGO 10º.</strong> A efetivação do CONTRATO e o início da
          contagem do prazo contratual dar-se-ão a partir da confirmação do
          pagamento integral da aquisição na Plataforma Digital e sua validação
          pela GEMAS BRILHANTES.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 4ª - DA REMUNERAÇÃO E DO PRAZO</h3>
        <p>
          <strong>ARTIGO 11º.</strong> O presente CONTRATO vigorará pelo prazo
          de {contractData.duration} meses, a contar da data de confirmação do
          pagamento, podendo ser encerrado antecipadamente nas condições
          previstas na CLÁUSULA 8ª.
        </p>
        <p>
          <strong>ARTIGO 12º.</strong> Durante o período de vigência do
          CONTRATO, o COMPRADOR receberá uma Remuneração Mensal como benefício
          direto da sua aquisição, calculada sobre o valor inicial da compra,
          observando-se as seguintes taxas, conforme a modalidade de posse
          escolhida:
        </p>
        <p>
          a) 1,75% (um vírgula setenta e cinco por cento) ao mês: Quando o
          COMPRADOR optar por manter a Gema Preciosa sob Custódia da GEMAS
          BRILHANTES.
        </p>
        <p>
          b) 1,25% (um vírgula vinte e cinco por cento) ao mês: Quando o
          COMPRADOR optar por receber e manter a Gema Preciosa em sua Posse
          Física.
        </p>
        <p>
          <strong>ARTIGO 13º</strong> A Remuneração Mensal será disponibilizada
          ao COMPRADOR a cada mês, e este, com total autonomia, deverá acessar a
          Área do Cliente na Plataforma Digital da GEMAS BRILHANTES no dia 05
          (cinco) de cada mês para registrar sua escolha de recebimento:
        </p>
        <p>
          a) <strong>Saque Mensal:</strong> O valor da remuneração será
          transferido diretamente para a conta bancária cadastrada pelo
          COMPRADOR, via PIX, no prazo de até 72 (setenta e duas) horas úteis
          após a solicitação.
        </p>
        <p>
          b) <strong>Acúmulo Mensal:</strong> Os valores não sacados se somarão
          ao montante inicial da aquisição, aumentando a base de cálculo para as
          remunerações futuras, no formato de juros compostos. Esta escolha
          poderá ser revisada mensalmente pelo COMPRADOR.
        </p>
        <p>
          <strong>ARTIGO 14º.</strong> Ao término do período de 12 (doze) meses
          de vigência do CONTRATO, o COMPRADOR terá as seguintes opções,
          conforme sua escolha:
        </p>
        <p>
          a) <strong>Devolução e Recompra:</strong> Devolver a Gema Preciosa à
          GEMAS BRILHANTES e reaver integralmente o valor inicial pago na
          compra. Os custos de envio da Gema Preciosa à GEMAS BRILHANTES
          (transporte e seguro) serão de responsabilidade do COMPRADOR. O
          reembolso do valor inicial pago será realizado em até 5 (cinco) dias
          úteis após a confirmação do recebimento e avaliação das condições e
          autenticidade da Gema Preciosa. Em caso de dano ou substituição da
          Gema Preciosa, poderá haver desconto no valor a ser reembolsado ou
          bloqueio total do reembolso, conforme avaliação da GEMAS BRILHANTES.
        </p>
        <p>
          b) <strong>Manutenção da posse:</strong> Manter a posse definitiva da
          Gema Preciosa, abrindo mão do valor inicialmente pago e ficando
          exclusivamente com o bem físico.
        </p>
        <p>
          c) <strong>Reembolso com Custódia:</strong> Se o COMPRADOR não tiver
          optado pela posse física desde o início (mantendo a Gema Preciosa sob
          Custódia da GEMAS BRILHANTES), receberá em até 15 (quinze) dias úteis
          o valor inicial da compra, acrescido de eventuais Remunerações Mensais
          acumuladas.
        </p>
        <p>
          d) <strong>Aquisição de Produto Físico (Gemas Brilhantes):</strong>{" "}
          Possibilidade de utilizar o valor da aquisição inicial e/ou das
          Remunerações Mensais acumuladas para uma nova compra de Gemcash ou de
          outro produto físico, como Gemas Preciosas ou joias personalizadas,
          diretamente da GEMAS BRILHANTES.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 5ª - DAS OBRIGAÇÕES DAS PARTES</h3>
        <p>
          <strong>ARTIGO 15º.</strong> São obrigações do COMPRADOR:
        </p>
        <p>
          a) Fornecer informações cadastrais completas, corretas e atualizadas à
          GEMAS BRILHANTES, sendo de sua exclusiva responsabilidade a manutenção
          dessas informações.
        </p>
        <p>
          b) Cumprir integralmente a legislação brasileira, especialmente no que
          se refere à prevenção e combate às atividades ligadas à ocultação de
          bens e lavagem de dinheiro, bem como as regras e procedimentos
          operacionais aplicáveis.
        </p>
        <p>
          c) Assumir a responsabilidade civil, tributária e criminal por todas e
          quaisquer informações e documentos apresentados à GEMAS BRILHANTES.
        </p>
        <p>
          d) No caso de optar pela Posse Física da Gema Preciosa, ser
          integralmente responsável por sua guarda, transporte, conservação e
          integridade a partir do momento do recebimento, sendo recomendável a
          contratação de seguro pessoal para proteção adicional.
        </p>
        <p>
          e) Realizar o pagamento dos custos de envio (transporte e seguro) caso
          opte por devolver a Gema Preciosa à GEMAS BRILHANTES para recompra ou
          em caso de rescisão antecipada.
        </p>
        <p>
          f) Acessar mensalmente a Plataforma Digital para gerenciar suas opções
          de Remuneração Mensal.
        </p>
        <p>
          <strong>ARTIGO 16º.</strong> São obrigações da GEMAS BRILHANTES:
        </p>
        <p>
          a) Disponibilizar Gemas Preciosas autênticas e certificadas, conforme
          descrito neste CONTRATO e na proposta comercial.
        </p>
        <p>
          b) Realizar a entrega da Gema Preciosa ao COMPRADOR que optar pela
          Posse Física, nos termos da CLÁUSULA 7ª.
        </p>
        <p>
          c) Garantir a guarda e conservação da Gema Preciosa quando esta
          estiver sob sua Custódia.
        </p>
        <p>
          d) Efetuar o pagamento da Remuneração Mensal e as demais condições de
          recompra/reembolso, conforme as regras estabelecidas neste CONTRATO e
          na proposta comercial.
        </p>
        <p>
          e) Manter a Plataforma Digital funcional para o gerenciamento das
          aquisições e remunerações pelo COMPRADOR.
        </p>
        <p>
          f) Processar os dados pessoais do COMPRADOR em conformidade com a LGPD
          e a política de privacidade da GEMAS BRILHANTES.
        </p>
        <p>
          g) Garantir a recompra da Gema Preciosa ao final do prazo contratual,
          caso o COMPRADOR opte por esta modalidade e cumpra as condições
          estabelecidas.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 6ª - DAS GARANTIAS E RESPONSABILIDADES</h3>
        <p>
          <strong>ARTIGO 17º.</strong> A GEMAS BRILHANTES garante a
          autenticidade, e Certificação das Gemas Preciosas adquiridas através
          do produto GemCash.
        </p>
        <p>
          <strong>ARTIGO 18º.</strong> A GEMAS BRILHANTES garante ao COMPRADOR o
          direito de recompra da Gema Preciosa ao final do prazo contratual, nos
          termos da alínea "a" do ARTIGO 14º e demais condições aplicáveis.
        </p>
        <p>
          <strong>ARTIGO 19º</strong> A GEMAS BRILHANTES não se responsabiliza
          por perdas, danos ou extravios da Gema Preciosa que esteja sob Posse
          Física do COMPRADOR. A partir do momento em que a Gema Preciosa é
          entregue fisicamente ao COMPRADOR, esta passa a ser de sua total
          responsabilidade.
        </p>
        <p>
          <strong>ARTIGO 20º</strong> A responsabilidade da GEMAS BRILHANTES não
          abrange danos especiais, indiretos, danos de terceiros, lucros
          cessantes ou quaisquer prejuízos sofridos em decorrência de decisões
          do COMPRADOR de vender, transformar ou manter as Gemas Preciosas após
          o recebimento da posse física. Qualquer responsabilidade estará
          limitada às condições da transação constante da proposta de
          contratação.
        </p>
        <p>
          <strong>ARTIGO 21º.</strong> A GEMAS BRILHANTES não poderá ser
          responsabilizada por caso fortuito ou força maior, tais como, mas não
          se limitando a, determinações governamentais, pandemias, desastres
          naturais, guerras, greves, interrupções de serviços essenciais, que
          impeçam ou atrasem a execução de suas atividades.
        </p>
        <p>
          <strong>ARTIGO 22º.</strong> Caso a Gema Preciosa seja devolvida à
          GEMAS BRILHANTES para recompra com danos, alteração ou substituição, o
          valor a ser reembolsado ao COMPRADOR poderá ser descontado ou o
          reembolso bloqueado, conforme avaliação técnica da GEMAS BRILHANTES,
          sendo o custo de tal avaliação suportado pelo COMPRADOR caso haja
          discrepância.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 7ª - DO PRAZO DE ENTREGA E CONDIÇÕES DE ENTREGA</h3>
        <p>
          <strong>ARTIGO 23º.</strong> Caso o COMPRADOR opte pela Posse Física
          da Gema Preciosa, o envio será realizado diretamente ao endereço
          cadastrado pelo COMPRADOR em um prazo de 10 (dez) a 20 (vinte) dias
          úteis após a confirmação da aquisição.
        </p>
        <p>
          <strong>ARTIGO 24º.</strong> O envio será feito via Correios ou
          transportadora, com seguro incluso e custeado pela GEMAS BRILHANTES. A
          entrega será considerada realizada no momento em que a Gema Preciosa
          for devidamente recebida pelo COMPRADOR ou por pessoa autorizada no
          endereço indicado.
        </p>
        <p>
          <strong>ARTIGO 25º.</strong> A GEMAS BRILHANTES não se responsabiliza
          por atrasos na entrega decorrentes de informações de endereço
          incorretas ou incompletas fornecidas pelo COMPRADOR, ou por eventos de
          Força Maior/Caso Fortuito que afetem o serviço de entrega.
        </p>
        <p>
          <strong>ARTIGO 26º.</strong> Em caso de solicitação de envio da Gema
          Preciosa que estava sob Custódia da GEMAS BRILHANTES durante a
          vigência do CONTRATO, os custos de envio (transporte e seguro) serão
          de responsabilidade do COMPRADOR.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 8ª - DA RESCISÃO E SUAS CONSEQUÊNCIAS</h3>
        <p>
          <strong>ARTIGO 27º.</strong> O presente CONTRATO tem prazo determinado
          de 12 (doze) meses, findo o qual as condições de recompra/reembolso do
          valor inicial serão aplicadas conforme ARTIGO 14º.
        </p>
        <p>
          <strong>ARTIGO 28º.</strong> O COMPRADOR poderá solicitar o
          encerramento do CONTRATO antes do prazo de 12 (doze) meses, mediante
          comunicação formal à GEMAS BRILHANTES. Nesta hipótese, as seguintes
          condições serão aplicadas:
        </p>
        <p>
          a) Qualquer saldo de Remuneração Mensal disponível na Plataforma
          Digital ou a ser creditado será automaticamente cancelado e o
          COMPRADOR perderá o direito a recebê-lo.
        </p>
        <p>
          b) Se o COMPRADOR tiver optado pela Posse Física da Gema Preciosa
          desde o início: i. Poderá permanecer com a Gema Preciosa, não havendo
          qualquer reembolso de valores pela GEMAS BRILHANTES. ii. Caso o
          COMPRADOR deseje devolver a Gema Preciosa à GEMAS BRILHANTES, os
          custos de envio (transporte e seguro) serão de sua responsabilidade. A
          GEMAS BRILHANTES, após o recebimento e avaliação da Gema Preciosa
          (conforme ARTIGO 22º), devolverá o valor da aquisição inicial, abatido
          o percentual de 20% (vinte por cento) como multa por quebra de
          CONTRATO.
        </p>
        <p>
          c) Se o COMPRADOR não tiver optado pela Posse Física da Gema Preciosa
          (estando sob Custódia da GEMAS BRILHANTES): i. A GEMAS BRILHANTES
          devolverá o valor da aquisição inicial, abatido o percentual de 20%
          (vinte por cento) como multa por quebra de CONTRATO.
        </p>
        <p>
          <strong>ARTIGO 29º</strong> A GEMAS BRILHANTES poderá rescindir o
          CONTRATO imediatamente, sem prejuízo das medidas legais cabíveis, em
          caso de:
        </p>
        <p>
          a) Violação de qualquer Cláusula ou Artigo do presente CONTRATO pelo
          COMPRADOR, especialmente as relativas às condutas proibidas e à
          legislação aplicável (ARTIGO 6º).
        </p>
        <p>
          b) Fornecimento de informações falsas, incompletas ou fraudulentas
          pelo COMPRADOR.
        </p>
        <p>
          c) Identificação de qualquer atividade suspeita ou ilegal associada à
          conta do COMPRADOR.
        </p>
        <p>
          <strong>ARTIGO 30º.</strong> A rescisão do CONTRATO, por qualquer
          motivo, não exime as PARTES de cumprirem as obrigações que lhes são
          devidas até a data da rescisão, especialmente no que tange aos
          reembolsos e multas previstos.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 9ª - DA CONFIDENCIALIDADE</h3>
        <p>
          <strong>ARTIGO 31º</strong> As PARTES obrigam-se a manter em sigilo e
          a não revelar a terceiros quaisquer Informações Confidenciais
          recebidas ou obtidas em decorrência do CONTRATO, podendo fornecê-las
          aos seus empregados, advogados, consultores e representantes, desde
          que estritamente necessário. A Parte que revelar as informações a
          terceiros, ainda que autorizados, será responsável por qualquer
          utilização ou divulgação não autorizada das Informações Confidenciais
          por estes.
        </p>
        <p>
          <strong>ARTIGO 32º.</strong> Para fins deste CONTRATO, "Informações
          Confidenciais" significam todas e quaisquer informações de caráter
          sigiloso, economicamente e estrategicamente relevantes às PARTES,
          notadamente no que se refere a estratégias comerciais, dados de
          clientes e direitos de propriedade intelectual, que qualquer PARTE
          revele, forneça ou comunique, seja verbalmente ou por escrito, em
          forma eletrônica, textos, desenhos, projetos, fotografias, gráficos,
          plantas, planos, programas de computador ou qualquer outra forma, a
          uma outra Parte ou que de qualquer outra forma sejam obtidas pela
          outra Parte em função do cumprimento das disposições do presente
          CONTRATO.
        </p>
        <p>
          <strong>ARTIGO 33º</strong> As Informações Confidenciais não incluirão
          informações que devam ser divulgadas por qualquer uma das PARTES em
          decorrência de Lei ou ordem exarada por Autoridade Governamental
          competente.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 10ª - DAS DISPOSIÇÕES GERAIS</h3>
        <p>
          <strong>ARTIGO 34º.</strong> O presente CONTRATO obriga as PARTES por
          si, seus sucessores e cessionários a qualquer título.
        </p>
        <p>
          <strong>ARTIGO 35º.</strong> As obrigações assumidas neste instrumento
          são irretratáveis e irrevogáveis, salvo as condições expressas de
          rescisão previstas neste CONTRATO.
        </p>
        <p>
          <strong>ARTIGO 36º.</strong> O não exercício, por qualquer das PARTES,
          de qualquer direito, vantagem ou opção prevista neste CONTRATO não
          implicará em renúncia dos direitos, nem afetará o exercício, a
          qualquer tempo, de tais direitos ou opções.
        </p>
        <p>
          <strong>ARTIGO 37º.</strong> A nulidade ou inexequibilidade de
          quaisquer das disposições ou cláusulas contidas neste CONTRATO não
          prejudicará as demais disposições nele contidas, as quais permanecerão
          válidas e produzirão seus regulares efeitos jurídicos, obrigando as
          PARTES, que deverão empenhar-se para reinterpretar as disposições
          ilegais, inválidas ou inexequíveis de modo que correspondam à intenção
          original das PARTES.
        </p>
        <p>
          <strong>ARTIGO 38º.</strong> Todas as comunicações e notificações
          entre as PARTES no âmbito deste CONTRATO serão realizadas
          preferencialmente por e-mail, para os endereços eletrônicos indicados
          no cadastro do COMPRADOR e para sac@gemasbrilhantes.com.br,
          considerando-se válidas todas as comunicações enviadas para tais
          endereços.
        </p>
        <p>
          <strong>ARTIGO 39º.</strong> Quaisquer impostos, taxas ou encargos
          tributários incidentes sobre as Remunerações Mensais ou sobre a venda
          das Gemas Preciosas pelo COMPRADOR serão de sua exclusiva
          responsabilidade.
        </p>
        <p>
          <strong>ARTIGO 40º.</strong> As PARTES atribuem a este instrumento a
          qualidade de título executivo extrajudicial nos termos do artigo 783,
          inciso III do Código de Processo Civil, reconhecendo desde logo a
          liquidez e certeza de quaisquer obrigações pecuniárias previstas neste
          instrumento que venham a ser cobradas por meio de processo de
          execução.
        </p>
        <p>
          <strong>ARTIGO 41º.</strong> O presente CONTRATO, juntamente com a
          proposta comercial específica, constitui o acordo integral entre as
          PARTES no que se refere ao seu objeto, substituindo todo e qualquer
          entendimento ou acordo anterior, verbal ou escrito.
        </p>
      </section>

      <section className="clauses-section">
        <h3>CLÁUSULA 11ª - DA LEGISLAÇÃO APLICÁVEL E DO FORO</h3>
        <p>
          <strong>ARTIGO 42º.</strong> O presente CONTRATO é regido e
          interpretado de acordo com as leis da República Federativa do Brasil,
          em especial o Código Civil Brasileiro e a Lei nº 8.078/90 (Código de
          Defesa do Consumidor), no que couber.
        </p>
        <p>
          <strong>ARTIGO 43º</strong> Para dirimir quaisquer conflitos, dúvidas
          ou controvérsias decorrentes do presente CONTRATO, as PARTES elegem o
          foro da Comarca de São Paulo, Estado de São Paulo, renunciando a
          qualquer outro, por mais privilegiado que seja.
        </p>
      </section>

      <footer className="contract-footer">
        <p>
          E, por estarem assim justas e contratadas, as PARTES assinam o
          presente CONTRATO.
        </p>
        <p>
          São Paulo, {day} de {month} de {year}.
        </p>
        <div className="signatures">
          <div className="signature-line">
            <p>_____________________________________</p>
            <p>
              <strong>{clientData.name.toUpperCase()}</strong>
            </p>
            <p>COMPRADOR</p>
          </div>
          <div className="signature-line">
            <p>_____________________________________</p>
            <p>
              <strong>GEMAS BRILHANTES LTDA</strong>
            </p>
            <p>[Nome do Representante Legal] VENDEDOR</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContractComponent;
