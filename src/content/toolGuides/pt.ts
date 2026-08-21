import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Mapa mental',
    summary:
      'Uma ferramenta de associação livre em que as ideias se ramificam a partir de um único centro. As caixas não são movidas por você: o mapa se reorganiza sozinho a cada adição, para você cuidar do conteúdo em vez do arranjo.',
    whenToUse: [
      'Em uma chuva de ideias, quando elas precisam sair rápido e a hierarquia ainda não está clara.',
      'Para dividir um assunto em subtítulos e ver o seu alcance.',
      'Para anotar reuniões, aulas ou leituras sem perder o fio.',
      'Para juntar ideias brutas antes de passar à estrutura analítica do projeto.'
    ],
    steps: [
      'Um projeto pode conter vários mapas. Use o menu de mapas no canto superior esquerdo para criar um novo ou alternar entre eles.',
      'Selecione a caixa raiz no centro e renomeie com F2; o assunto vai aí.',
      'Tab abre um novo ramo abaixo da caixa selecionada. A caixa nova já vem pronta para digitar.',
      'Enter cria um ramo irmão no mesmo nível. Também funciona enquanto você digita: termina o texto, pressiona Enter e a próxima caixa abre.',
      'Clique com o botão direito em uma caixa para adicionar descrição, marcar o ramo como concluído ou recolhê-lo quando ficar cheio.',
      'O minimapa no canto inferior direito mostra onde você está; arraste sobre ele para se mover em mapas grandes.'
    ],
    shortcuts: [
      { keys: ['Tab'], desc: 'Novo ramo abaixo da caixa selecionada' },
      { keys: ['Enter'], desc: 'Ramo irmão no mesmo nível' },
      { keys: ['F2'], desc: 'Renomear a caixa selecionada' },
      { keys: ['Delete'], desc: 'Excluir o ramo selecionado (a raiz não é excluída)' },
      { keys: ['Shift', 'Enter'], desc: 'Quebra de linha durante a digitação' },
      { keys: ['Esc'], desc: 'Fechar o campo de texto' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'As caixas não são arrastadas, o arranjo é automático. Para mover um ramo, exclua-o e recrie no lugar certo.',
      'A cor de cada ramo vem do ramo principal que sai da raiz: mesma cor significa o mesmo título principal.',
      'Dentro de um campo de texto, Delete e F2 não agem; termine antes com Enter ou Esc.'
    ],
    seo: {
      name: 'Mapa mental',
      title: 'Criar mapa mental — grátis e sem cadastro | Klarsti',
      description:
        'Coloque um tema no centro e ramifique; da organização cuida o programa. Para reunir ideias rápido, grátis.',
      keywords: 'mapa mental, criar mapa mental, mapa mental online, mind map grátis, mapa mental exemplo'
    },
    example: {
      title: 'Exemplo: montar um programa de treinamento interno',
      intro:
        'O time de RH precisa montar o treinamento de integração e não sabe por onde começar. Antes de decidir qualquer coisa, joga tudo o que tem na cabeça em um único mapa.',
      blocks: [
        {
          heading: 'Quem participa',
          items: [
            'Recém-contratados',
            'Líderes de equipe',
            'Pessoal remoto',
            'Equipe de campo',
          ]
        },
        {
          heading: 'O que ensinamos',
          items: [
            'Conhecimento do produto',
            'Sistemas internos',
            'Atendimento ao cliente',
            'Regras de segurança',
          ]
        },
        {
          heading: 'Como entregamos',
          items: [
            'Workshop presencial',
            'Vídeo gravado',
            'Sessão curta semanal',
            'Acompanhamento de alguém mais experiente',
          ]
        },
        {
          heading: 'Como medimos',
          items: [
            'Teste curto no fim',
            'Opinião do gestor após três meses',
            'Tempo até a primeira tarefa sozinho',
            'Presença',
          ]
        },
      ],
      outcome:
        'Com os quatro ramos no mapa, a lacuna salta aos olhos: o ramo de medição está bem mais fraco que os outros. O time volta lá antes de escrever um único slide. É para isso que serve um mapa mental — mostrar qual lado está vazio.'
    },
    faq: [
      {
        q: 'O que é um mapa mental?',
        a:
          'Uma forma de reunir ideias colocando um tema no centro e ramificando para fora. A diferença para uma lista é que a lista obriga a pensar em ordem, enquanto o mapa deixa você soltar cada ideia no ramo a que ela pertence. Por isso funciona melhor para organizar um pensamento bagunçado.'
      },
      {
        q: 'Qual a diferença entre mapa mental e EAP?',
        a:
          'O mapa mental reúne ideias; não há responsáveis, datas nem sequência. A estrutura analítica do projeto gerencia trabalho: cada caixa tem status, prazo e duração. A ordem usual é mapa mental primeiro e EAP quando o escopo já está claro.'
      },
      {
        q: 'Posso arrastar as caixas?',
        a:
          'Não, o arranjo é automático. Para mover um ramo, apague e crie no lugar certo. Isso é proposital: o tempo gasto alinhando caixas é tirado do tempo de pensar.'
      },
      {
        q: 'Quantos ramos um mapa mental deve ter?',
        a:
          'Não há limite, mas mais de sete ou oito no mesmo nível deixa de ser legível. Quando chegar lá, agrupe os ramos parecidos sob um novo e o mapa volta a ser lido.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento. Você nem precisa de conta para testar o mapa mental.'
      },
    ]
  },

  wbs: {
    title: 'EAP',
    summary:
      'Uma árvore em três níveis: no topo o PROJETO, abaixo as FASES e sob elas os PACOTES DE TRABALHO. Cada caixa carrega status, data de fim, horas de trabalho e descrição. Diferente de um mapa mental, aqui você gerencia trabalho, não ideias.',
    whenToUse: [
      'Para decompor um projeto até ficar claro quem faz o quê.',
      'Para fixar o escopo: o que não está na árvore não está no projeto.',
      'Para ligar o trabalho ao calendário e acompanhar o avanço pelos status.'
    ],
    steps: [
      'Uma árvore tem uma única caixa de projeto. Para um segundo projeto, abra uma árvore nova no menu "Árvores" à esquerda.',
      'O botão de baixo segue a seleção: com o projeto selecionado diz "Adicionar fase"; com uma fase ou pacote, "Adicionar pacote de trabalho". Sem seleção, adiciona uma fase abaixo do projeto.',
      'O mesmo pelo teclado: Ctrl+clique numa caixa abre outra abaixo dela.',
      'Um clique simples apenas seleciona a caixa. Para abrir ou fechar os ramos abaixo, dê DUPLO clique na caixa; a câmera também se centraliza nela. (Duplo clique no nome edita o nome.)',
      'Clique direito numa caixa: nome, data de fim, hora de início e fim, descrição e status (A fazer / Em andamento / Concluído / Falhou).',
      'No mesmo menu, "Adicionar à agenda" leva o item para a sua agenda na data escolhida. Avisa se a data já passou.',
      'Se marcar um item como Falhou, o menu oferece "analisar a causa raiz"; um clique o envia aos 5 Porquês como problema.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clique'], desc: 'Na caixa do projeto: adiciona uma fase' },
      { keys: ['Mod', 'Clique'], desc: 'Numa fase ou pacote: adiciona um pacote de trabalho' },
      { keys: ['Shift', 'Arrastar'], desc: 'Mover uma caixa com todos os ramos abaixo' },
      { keys: ['Delete'], desc: 'Excluir a caixa selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'O que fica abaixo de um pacote de trabalho também é pacote de trabalho; a decomposição pode descer o quanto precisar.',
      'Arrastando sem Shift, só a caixa que você pegou se move; o que está abaixo fica no lugar.',
      'Continue decompondo até cada pacote caber numa pessoa só.',
      'Para limpar uma data, use o xis ao lado do campo no menu do clique direito; os horários saem junto.'
    ],
    seo: {
      name: 'Estrutura analítica do projeto (EAP)',
      title: 'Estrutura analítica do projeto (EAP/WBS) | Klarsti',
      description:
        'Divida o projeto em fases e pacotes de trabalho, com status, prazo e duração em cada um. Com exemplo preenchido, grátis.',
      keywords: 'estrutura analítica do projeto, eap, wbs, eap exemplo, decomposição de tarefas'
    },
    example: {
      title: 'Exemplo: abrir uma cafeteria',
      intro:
        'Seis meses até a inauguração. O trabalho parece enorme e não há um ponto óbvio para pegar. Dividido em três fases, cada fase gera pacotes concretos que uma pessoa consegue assumir.',
      blocks: [
        {
          heading: '1. Ponto e licenças',
          items: [
            'Pesquisar aluguéis em três bairros',
            'Assinar o contrato',
            'Alvará de funcionamento',
            'Licença sanitária',
          ]
        },
        {
          heading: '2. Montagem',
          items: [
            'Projeto da reforma',
            'Obra',
            'Máquina de café e moedor',
            'Mesas, cadeiras, balcão',
          ]
        },
        {
          heading: '3. Inauguração',
          items: [
            'Contratar dois baristas',
            'Cardápio e preços',
            'Acordos com fornecedores',
            'Anúncio de abertura',
          ]
        },
      ],
      outcome:
        'Doze pacotes de trabalho. O escopo está fixado: o que não está nessa árvore não está no projeto. A sequência também apareceu — a obra não pode começar sem o alvará, e isso torna a primeira fase a arriscada.'
    },
    faq: [
      {
        q: 'O que é uma estrutura analítica do projeto (EAP)?',
        a:
          'Uma árvore que divide o projeto até cada pedaço ficar pequeno o suficiente para entregar a uma pessoa. No topo o projeto, abaixo as fases e abaixo os pacotes de trabalho. O objetivo não é encolher o trabalho, mas tornar o escopo visível: o que não está na árvore não está no projeto.'
      },
      {
        q: 'Quantos níveis a EAP deve ter?',
        a:
          'Três níveis cobrem quase tudo: projeto, fase, pacote de trabalho. A regra prática é simples — se olhando para uma caixa você consegue responder «quem faz isso e quanto tempo leva», pode parar de dividir. Se não consegue, desça um nível.'
      },
      {
        q: 'Qual a diferença para o gráfico de Gantt?',
        a:
          'A EAP responde «o que precisa ser feito»; o Gantt responde «quando». A ordem correta é decomposição primeiro, calendário depois. Um Gantt feito sem decomposição é uma lista de tarefas pela metade posta numa linha do tempo.'
      },
      {
        q: 'Qual o tamanho ideal de um pacote de trabalho?',
        a:
          'Uma medida comum é o que uma pessoa termina em uma ou duas semanas. Maior que isso e você não acompanha o avanço; menor e a árvore vira ruído.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar uma EAP.'
      },
    ]
  },

  '5whys': {
    title: 'Análise dos 5 Porquês',
    summary:
      'Perguntar "e por que isso aconteceu?" repetidamente para descer do sintoma visível até a causa raiz. Cinco não é regra, é medida: quando as respostas começam a se repetir, você chegou ao fundo.',
    whenToUse: [
      'Para encontrar a causa real de uma falha em vez de tratar o sintoma.',
      'Em revisões pós-incidente, em que interessa a causa e não o culpado.',
      'Para registrar por que uma tarefa da EAP falhou.'
    ],
    steps: [
      'Pelo menu no canto superior esquerdo você troca entre as análises do mesmo projeto e pode criar, renomear ou excluir uma.',
      'Comece na tela vazia com "Adicionar problema" e descreva em uma frase o que aconteceu. Também há um exemplo pronto.',
      'Ctrl+clique numa caixa abre um novo "porquê" abaixo. Escreva a resposta ali e repita a operação nessa caixa.',
      'Quando não der para descer mais, Shift+clique nessa caixa cria uma caixa de causa raiz. Ela não aceita filhos: a cadeia termina ali.',
      'Com o botão direito você edita ou exclui as caixas.',
      'Cada análise tem um único problema principal. Para examinar um segundo problema, crie uma nova análise pelo menu no canto superior esquerdo.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clique'], desc: 'Sobre uma caixa: novo porquê abaixo' },
      { keys: ['Shift', 'Clique'], desc: 'Sobre uma caixa: caixa de causa raiz' },
      { keys: ['Delete'], desc: 'Excluir a caixa selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Iniciar uma análise de causa raiz a partir de uma tarefa da EAP abre uma análise separada para ela; a análise aberta não é sobrescrita.',
      'Uma causa pode ter mais de uma resposta; repita o Ctrl+clique na mesma caixa para ramificá-la.',
      'Apoie cada resposta em algo verificável. "Desatenção" não é causa raiz, é uma pergunta sem resposta.',
      'Uma tarefa da EAP marcada como falha pode ser enviada para cá como problema pelo próprio menu de contexto.'
    ],
    seo: {
      name: 'Análise dos 5 porquês',
      title: 'Análise dos 5 porquês — encontre a causa raiz | Klarsti',
      description:
        'Pergunte por que cinco vezes e vá do sintoma até a causa real. Explicado passo a passo, com exemplo real, grátis.',
      keywords: '5 porquês, análise de causa raiz, método dos 5 porquês, 5 whys, 5 porquês exemplo'
    },
    example: {
      title: 'Exemplo: os e-mails de confirmação não chegam',
      intro:
        'O suporte está com a mesma reclamação há três dias. O primeiro impulso é «vamos trocar de provedor de e-mail». Perguntar por que cinco vezes mostra que o problema está em outro lugar.',
      blocks: [
        {
          heading: 'Problema',
          items: [
            'Os clientes não recebem o e-mail de confirmação do pedido.',
          ]
        },
        {
          heading: 'A cadeia',
          items: [
            'Por quê? Os e-mails caem no spam.',
            'Por quê? Nosso domínio de envio aparece como não verificado.',
            'Por quê? Falta um registro de verificação no DNS.',
            'Por quê? Não foi copiado na migração do servidor.',
            'Por quê? A lista de verificação da migração não tem essa linha.',
          ]
        },
        {
          heading: 'Causa raiz',
          items: [
            'A lista de verificação da migração está incompleta.',
          ]
        },
        {
          heading: 'Contramedidas',
          items: [
            'Registro que faltava foi adicionado (o problema de hoje está resolvido).',
            'Verificação de domínio entrou na lista de migração.',
            'A lista deixou de depender de quem executa a migração.',
          ]
        },
      ],
      outcome:
        'O primeiro impulso era trocar de provedor: dinheiro gasto e o problema continuaria. A causa real era uma linha faltando numa lista de verificação. Tornar essa diferença visível é todo o trabalho dos cinco porquês.'
    },
    faq: [
      {
        q: 'O que é a análise dos 5 porquês?',
        a:
          'Uma técnica para sair do sintoma visível e chegar à causa real perguntando «por quê» repetidamente. Nasceu na Toyota. A ideia é consertar o que produz o sintoma em vez do sintoma, para o problema não voltar.'
      },
      {
        q: 'Por que exatamente cinco?',
        a:
          'Cinco é um costume, não uma regra. Na prática a maioria dos problemas se esgota entre a quarta e a sexta pergunta. Se achou na terceira, pare. Se na sétima ainda não chegou a lugar nenhum, provavelmente definiu mal o problema.'
      },
      {
        q: 'Como sei que cheguei à causa raiz?',
        a:
          'Dois sinais. O próximo «por quê» começa a apontar para algo fora do seu controle, e você está confiante de que eliminar o que encontrou impediria o problema de voltar.'
      },
      {
        q: '5 porquês ou diagrama de Ishikawa?',
        a:
          'Os 5 porquês seguem uma única cadeia para baixo. O Ishikawa espalha o mesmo problema por categorias: pessoas, método, máquina, material, medição, meio ambiente. Se a causa parece estar num lugar só, use os 5 porquês; se está espalhada, desenhe a espinha antes.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para fazer uma análise dos 5 porquês.'
      },
    ]
  },

  flowchart: {
    title: 'Fluxogramas',
    summary:
      'Desenhe os passos, os pontos de decisão e o sentido de um processo. Há três tipos de diagrama: fluxo de trabalho, fluxo de processo e fluxo de dados. O tipo escolhido determina quais formas de caixa ficam disponíveis.',
    whenToUse: [
      'Fluxograma de trabalho: para mostrar tarefas, decisões, aprovações e quem executa.',
      'Fluxograma de processo: para analisar produção ou serviço pelas etapas de operação, transporte, inspeção, espera e armazenagem.',
      'Diagrama de fluxo de dados: para mapear como os dados circulam entre entidades externas, processos e depósitos de dados.'
    ],
    steps: [
      'Na primeira abertura aparece o seletor de tipo. Ele pode ser trocado depois; as caixas são convertidas para o equivalente mais próximo.',
      'O menu de diagramas no canto superior esquerdo permite manter vários diagramas no mesmo projeto e alternar entre eles.',
      "Passe o ponteiro sobre uma caixa: aparece um + nos quatro pontos de conexão. Clique em um deles, escolha uma forma e a caixa nova surge daquele lado, já conectada. Dê dois cliques em uma caixa para renomear; clique com o botão direito para as demais opções.",
      'Arraste as caixas para onde quiser; aqui não há arranjo automático, a disposição é sua.',
      "Para desenhar uma conexão, arraste de qualquer ponto de uma caixa até qualquer ponto de outra: de lado a lado, de cima a cima, na direção que quiser. Para mudar uma ponta de lugar, segure a extremidade da linha e solte em outro ponto. Dê dois cliques em uma linha para escrever sobre ela (por exemplo sim / não).",
      'Com os controles no canto inferior esquerdo você aproxima, e com o minimapa no canto inferior direito navega em diagramas grandes.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Excluir a caixa ou ligação selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Rotule todos os caminhos que saem de uma decisão; quem lê precisa ver qual condição leva a onde.',
      'Se um diagrama não cabe mais em uma tela, divida-o: leve a parte carregada para uma caixa de subprocesso e desenhe à parte.',
      'A caixa de Papel no fluxo de trabalho serve para mostrar quem executa um passo; deixe-a de fora se quiser descrever o processo independente das pessoas.'
    ],
    seo: {
      name: 'Fluxograma',
      title: 'Criar fluxograma — grátis | Klarsti',
      description:
        'Desenhe os passos do processo, os pontos de decisão e as ramificações. Com os símbolos explicados e um exemplo.',
      keywords: 'fluxograma, criar fluxograma, símbolos fluxograma, fluxograma online, fluxograma exemplo'
    },
    example: {
      title: 'Exemplo: como um pedido de férias é tratado',
      intro:
        'Cada pessoa na empresa tem uma versão diferente desse processo na cabeça. Quem aprova, quando é recusado, quando o RH entra: nada está escrito. Desenhar reduz a discussão a uma única caixa.',
      blocks: [
        {
          heading: 'Passos',
          items: [
            'Início: a pessoa solicita férias',
            'Processo: o sistema calcula os dias restantes',
            'Decisão: há dias suficientes?',
            'Não → pedido recusado, motivo registrado',
            'Sim → Processo: o pedido vai para o gestor',
          ]
        },
        {
          heading: 'Continuação',
          items: [
            'Decisão: o gestor aprova?',
            'Não → o motivo volta para a pessoa e o processo termina',
            'Sim → Processo: o RH registra no calendário',
            'Processo: reflete no calendário da equipe',
            'Fim: confirmação enviada',
          ]
        },
      ],
      outcome:
        'Depois de desenhado, uma coisa saltou: não havia nenhum passo devolvendo o motivo nos pedidos recusados. Ninguém percebia enquanto o processo morava na cabeça das pessoas. Posto em caixas, a lacuna se mostrou sozinha.'
    },
    faq: [
      {
        q: 'O que é um fluxograma?',
        a:
          'Um diagrama que mostra os passos pelos quais um processo passa do início ao fim, onde se decide e onde o caminho se divide. Um processo que leva cinco minutos para ser explicado em voz alta costuma levar cinco segundos para ser lido desenhado.'
      },
      {
        q: 'O que significam os símbolos?',
        a:
          'A caixa arredondada é início ou fim, o retângulo é um passo do processo, o losango é uma decisão. De uma decisão sempre saem pelo menos duas setas, normalmente sim e não. Essa divisão é o que deixa o leitor com uma única interpretação.'
      },
      {
        q: 'Fluxograma e mapa de processos são a mesma coisa?',
        a:
          'Parecidos, mas não iguais. O fluxograma mostra a ordem dos passos. O mapa de processos costuma ser mais amplo: mostra também quem é responsável por cada passo e onde o trabalho passa de uma equipe para outra.'
      },
      {
        q: 'Por onde começo a desenhar?',
        a:
          'Pelo fim. Escreva como o processo termina e vá para trás perguntando «o que precisa acontecer antes disso». Começar pelo início tende a produzir o processo ideal em vez do real.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para desenhar um fluxograma.'
      },
    ]
  },

  orgchart: {
    title: 'Organogramas',
    summary:
      'Mostra quem se reporta a quem e onde fica cada unidade. Há sete tipos: hierárquico, funcional, divisional, matricial, plano, por equipes e em rede. O tipo determina tanto as caixas disponíveis quanto o desenho das ligações.',
    whenToUse: [
      'Para registrar a estrutura atual e enxergar vagas em aberto e duplicidades.',
      'Para discutir uma reorganização: desenhar a mesma equipe em tipos diferentes e comparar.',
      'Para deixar explícita a dupla subordinação no matricial, ou os parceiros externos no de rede.'
    ],
    steps: [
      'Na primeira abertura você escolhe o tipo de organograma. Ele pode ser trocado depois; as caixas são convertidas e o arranjo é preservado.',
      'O menu no canto superior esquerdo permite manter vários organogramas em um projeto (por exemplo, estrutura atual e estrutura alvo).',
      "Passe o ponteiro sobre uma caixa: aparece um + nos quatro pontos de conexão. Clique em um deles e escolha cargo, unidade, time ou vaga em aberto; a caixa nova surge daquele lado. Dê dois cliques em uma caixa para mudar o nome e o cargo abaixo dele.",
      'Arraste as caixas para posicioná-las como quiser.',
      'As ligações normais saem dos pontos superior e inferior de uma caixa: essa é a linha de reporte principal.',
      'As linhas puxadas dos pontos laterais aparecem tracejadas e indicam reporte secundário (nos organogramas matricial, hierárquico e de rede).'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Excluir a caixa ou ligação selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'A caixa de vaga em aberto mantém visíveis as posições não preenchidas; assim o organograma também se lê como plano de contratação.',
      'Use a segunda linha da caixa para o cargo: em cima a pessoa ou unidade, embaixo a função.',
      'Não misture os dois estilos de linha: a contínua diz a quem você se reporta, a tracejada com quem você trabalha.'
    ],
    seo: {
      name: 'Organograma',
      title: 'Criar organograma da empresa — grátis | Klarsti',
      description:
        'Mostre em uma página quem responde a quem e encontre os cargos descobertos. Com um exemplo real de 20 pessoas.',
      keywords: 'organograma, criar organograma, organograma empresa, organograma online, organograma exemplo'
    },
    example: {
      title: 'Exemplo: uma empresa de software com 20 pessoas',
      intro:
        'A empresa foi de 6 para 20 pessoas em dois anos. Quem responde a quem se sabe de boca em boca, mas não está escrito em lugar nenhum, então cada pessoa nova faz as mesmas perguntas.',
      blocks: [
        {
          heading: 'Diretoria',
          items: [
            'Head de produto',
            'Head de engenharia',
            'Head comercial',
            'Responsável por RH e finanças',
          ]
        },
        {
          heading: 'Sob engenharia',
          items: [
            'Time de front-end (3)',
            'Time de back-end (4)',
            'Responsável por qualidade',
            'Administrador de sistemas',
          ]
        },
        {
          heading: 'Sob produto',
          items: [
            'Design (2)',
            'Analista de produto',
          ]
        },
        {
          heading: 'Sob comercial',
          items: [
            'Vendas em campo (2)',
            'Suporte ao cliente (2)',
          ]
        },
      ],
      outcome:
        'Desenhar deixou uma coisa evidente: qualidade é uma pessoa só, respondendo direto para engenharia, então ninguém cobre esse papel nas férias. É aí que um organograma se paga: mostra as lacunas com nome e sobrenome.'
    },
    faq: [
      {
        q: 'O que é um organograma?',
        a:
          'Um diagrama de como pessoas e times de uma organização se conectam. Mostra as linhas de reporte e onde cada unidade fica. Para quem acabou de entrar, é o mapa mais rápido do lugar.'
      },
      {
        q: 'Nomes ou cargos?',
        a:
          'O melhor é os dois: o cargo explica a estrutura e o nome diz a quem recorrer. Só com nomes o organograma perde o sentido assim que alguém sai; só com cargos você não sabe a quem perguntar.'
      },
      {
        q: 'Quantas pessoas cabem em um organograma?',
        a:
          'Até cerca de cinquenta ainda se lê numa página só. Acima disso, mostre o nível de cima separado e dê a cada unidade o seu próprio organograma. Espremer uma organização grande numa página produz um organograma que ninguém lê.'
      },
      {
        q: 'De quanto em quanto tempo atualizar?',
        a:
          'A cada contratação e a cada saída. Um organograma desatualizado é pior do que nenhum, porque manda as pessoas para a pessoa errada com toda a confiança.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar um organograma.'
      },
    ]
  },

  swot: {
    title: 'Análise SWOT',
    summary:
      'Lê uma ideia, um projeto ou uma organização por quatro janelas: o que é bom e ruim dentro, quais oportunidades e ameaças existem fora. O objetivo não é fazer quatro listas, mas ligá-las em uma estratégia.',
    whenToUse: [
      'Para ter o quadro completo antes de se comprometer com algo.',
      'Antes do plano anual ou do orçamento, para situar onde você está.',
      'Para avaliar sua posição diante de um concorrente.',
      'Para construir uma imagem comum na equipe: todos olham para os mesmos quatro quadros.'
    ],
    steps: [
      'Escreva no alto o nome da análise e clique em Criar. Um projeto pode ter várias SWOT.',
      'Surgem quatro quadros: Forças, Fraquezas, Oportunidades, Ameaças.',
      'Escreva um item no campo abaixo de um quadro e pressione Enter, ou clique no botão de mais.',
      'Clique num item já escrito para editá-lo no lugar; as mudanças são salvas sozinhas.',
      'A lixeira do item exclui aquele item; a do cabeçalho exclui a análise inteira.',
      'Para conhecer a ferramenta, carregue o exemplo pronto na tela que aparece quando não há nenhuma análise.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Adicionar ao quadro o item digitado' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Forças e fraquezas são internas, estão na sua mão; oportunidades e ameaças são externas. Uma SWOT que confunde as duas coisas não serve.',
      'O trabalho de verdade é cruzar os quadros: qual força aproveita qual oportunidade, qual fraqueza deixa você exposto a qual ameaça.',
      'Encher um quadro com dez itens e deixar outro vazio não é análise, é tomar partido.'
    ],
    seo: {
      name: 'Análise SWOT (FOFA)',
      title: 'Análise SWOT (FOFA) — como fazer, grátis | Klarsti',
      description:
        'Compare forças e fraquezas com oportunidades e ameaças e cruze os quatro quadrantes. Com exemplo preenchido.',
      keywords: 'análise swot, matriz swot, análise fofa, como fazer análise swot, swot exemplo'
    },
    example: {
      title: 'Exemplo: um escritório de contabilidade pequeno',
      intro:
        'Um escritório de cinco pessoas quer crescer, mas não sabe para onde empurrar. Preencher os quatro quadrantes tira a conversa do achismo e a coloca sobre linhas concretas.',
      blocks: [
        {
          heading: 'Forças',
          items: [
            'Clientes de quinze anos',
            'Praticamente não perde nenhum',
            'Os dois sócios são contadores registrados',
            'Sem dívidas',
          ]
        },
        {
          heading: 'Fraquezas',
          items: [
            'Tudo depende dos dois sócios',
            'Nenhum processo digital, tudo em papel',
            'Nenhum trabalho de marketing',
            'Cliente novo só chega por indicação',
          ]
        },
        {
          heading: 'Oportunidades',
          items: [
            'Obrigações eletrônicas empurram pequenas empresas a procurar',
            'Muitos negócios pequenos abrindo na região',
            'Atendimento remoto já é aceito',
            'Software contábil ficou barato',
          ]
        },
        {
          heading: 'Ameaças',
          items: [
            'Contabilidade online barata',
            'Um dos sócios está perto de se aposentar',
            'A legislação muda com frequência',
            'Difícil contratar gente jovem',
          ]
        },
      ],
      outcome:
        'A tabela diz algo concreto: a maior oportunidade cai exatamente em cima da maior fraqueza — não há processo digital. A decisão se escreve sozinha: não crescer, e sim digitalizar o próprio trabalho primeiro.'
    },
    faq: [
      {
        q: 'O que é uma análise SWOT?',
        a:
          'Um método que reúne a situação de uma organização ou de uma decisão em quatro quadrantes: forças, fraquezas, oportunidades e ameaças. Forças e fraquezas são internas; oportunidades e ameaças, externas. Essa separação dá nome ao método e é a parte que mais se confunde.'
      },
      {
        q: 'Como fazer uma análise SWOT?',
        a:
          'Primeiro escreva em uma frase o que você está analisando: «nossa empresa» é amplo demais, «devemos abrir a segunda filial?» não é. Depois preencha os quatro quadrantes. O último passo é o que mais importa: cruzá-los. Qual força aproveita qual oportunidade, qual fraqueza deixa você exposto a qual ameaça.'
      },
      {
        q: 'Como diferencio força de oportunidade?',
        a:
          'Um teste simples: se a sua própria decisão pode mudar aquilo, é interno; se não pode, é externo. Um time experiente é uma força; um mercado em crescimento é uma oportunidade. Misturar os quadrantes deixa a análise inutilizável.'
      },
      {
        q: 'Quantos itens por quadrante?',
        a:
          'De três a seis funciona bem. Quinze itens em um quadrante são um inventário, não uma análise. Escolher os poucos que de fato decidem é o que faz a conclusão sair sozinha da tabela.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para fazer uma análise SWOT.'
      },
    ]
  },

  ishikawa: {
    title: 'Diagrama de espinha de peixe',
    summary:
      'Reúne as causas possíveis de um problema sob seis títulos: Mão de obra, Máquina, Material, Método, Medição e Meio ambiente. A cabeça do peixe é o problema e as espinhas são grupos de causas. A ideia é varrer todas as áreas em vez de procurar em uma só.',
    whenToUse: [
      'Quando não se sabe onde está a causa e nenhuma área deve ficar de fora.',
      'Em uma chuva de ideias com a equipe, para cada um contribuir da sua área.',
      'Para reunir causas candidatas antes de entrar nos 5 Porquês.'
    ],
    steps: [
      'Escreva o problema em uma frase no alto e clique em Começar.',
      'Surgem seis quadros de categoria. Escreva uma causa possível no campo abaixo e pressione Enter.',
      'O enunciado do problema é editado no cabeçalho e os itens dentro dos seus próprios quadros.',
      'Um projeto pode conter várias análises; cada uma vira um cartão com o seu próprio enunciado.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Adicionar à categoria a causa digitada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Você não precisa preencher todas as categorias; uma categoria vazia também é informação.',
      'Escreva o que aconteceu, não o sintoma: não "atrasou", mas "a aprovação ficou parada três dias".',
      'Leve os candidatos mais fortes para os 5 Porquês. Ishikawa dá largura, os 5 Porquês dão profundidade.'
    ],
    seo: {
      name: 'Diagrama de Ishikawa',
      title: 'Diagrama de Ishikawa — espinha de peixe | Klarsti',
      description:
        'Agrupe as causas possíveis por pessoas, método, máquina e material e veja por onde começar. Com exemplo, grátis.',
      keywords: 'diagrama de ishikawa, espinha de peixe, diagrama causa e efeito, 6m, ishikawa exemplo'
    },
    example: {
      title: 'Exemplo: a taxa de refugo aumentou',
      intro:
        'Numa marcenaria o índice de peças defeituosas passou de 3% para 9% em dois meses. Em vez de caçar uma causa única, todos os candidatos são colocados lado a lado sob seis títulos.',
      blocks: [
        {
          heading: 'Pessoas',
          items: [
            'Dois marceneiros experientes saíram',
            'Os novos não receberam treinamento',
            'Não há passagem de turno',
          ]
        },
        {
          heading: 'Método',
          items: [
            'As medidas de corte não estão escritas',
            'A qualidade só é conferida no fim da linha',
          ]
        },
        {
          heading: 'Máquina',
          items: [
            'A serra está há seis meses sem manutenção',
            'A lixadeira sai de calibração',
          ]
        },
        {
          heading: 'Material',
          items: [
            'O fornecedor mudou',
            'A umidade das novas chapas não é medida',
          ]
        },
      ],
      outcome:
        'Com as espinhas preenchidas, dois títulos ficam visivelmente mais cheios que os outros: pessoas e material. O time começa por aí. A espinha não encontra a causa — ela diz onde começar a procurar.'
    },
    faq: [
      {
        q: 'O que é o diagrama de Ishikawa?',
        a:
          'Um diagrama que organiza as causas possíveis de um problema em categorias e as coloca lado a lado. É chamado de espinha de peixe pelo formato que lembra um esqueleto, e também é conhecido como diagrama de causa e efeito.'
      },
      {
        q: 'O que são os 6M?',
        a:
          'As seis categorias clássicas: mão de obra, método, máquina, material, medição e meio ambiente. O objetivo não é preencher todas, e sim forçar o olhar em seis direções em vez da única que você já tinha na cabeça. Em serviços esses títulos podem e devem ser trocados.'
      },
      {
        q: 'Dá para usar junto com os 5 porquês?',
        a:
          'Dá, e é a forma mais eficaz de usar qualquer um dos dois. Espalhe os candidatos com a espinha, escolha a espinha mais forte e aprofunde nela com os 5 porquês. Um dá largura, o outro profundidade.'
      },
      {
        q: 'A espinha encontra a causa?',
        a:
          'Não diretamente — ela produz candidatos. Quando o diagrama fica pronto você tem uma lista para testar, não uma causa comprovada. O passo seguinte é confrontar com dados, e é aí que a análise de Pareto encaixa bem.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para desenhar um diagrama de Ishikawa.'
      },
    ]
  },

  pdca: {
    title: 'Ciclo PDCA',
    summary:
      'Planejar, Fazer, Checar, Agir. Conduz uma melhoria não como tarefa única, mas como roda que gira: cada volta começa com o resultado da anterior.',
    whenToUse: [
      'Para testar uma mudança pequena, medir o resultado e depois ampliá-la.',
      'Para registrar se uma contramedida realmente funcionou.',
      'Para acompanhar as voltas em equipes de melhoria contínua.'
    ],
    steps: [
      'Escreva no alto o objetivo do ciclo e clique em Começar.',
      'Surgem quatro quadros de fase. Adicione seus itens no campo abaixo de cada fase.',
      'Ao clicar no círculo à esquerda de um item, ele é marcado como concluído e fica riscado.',
      'Um projeto pode conter vários ciclos; cada objetivo vira um cartão.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Adicionar à fase o item digitado' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Coloque algo mensurável na fase Checar. Sem um número por trás de "melhorou?", o ciclo nunca fecha.',
      'O que sai da fase Agir é a entrada do Planejar da volta seguinte.',
      'Não tente preencher os quatro quadros ao mesmo tempo; seguir a ordem é o próprio método.'
    ],
    seo: {
      name: 'Ciclo PDCA',
      title: 'Ciclo PDCA — melhoria contínua | Klarsti',
      description:
        'Planejar, Fazer, Checar e Agir: faça experimentos pequenos e meça o resultado. Com um ciclo completo de exemplo.',
      keywords: 'ciclo pdca, pdca, melhoria contínua, ciclo de deming, pdca exemplo'
    },
    example: {
      title: 'Exemplo: reduzir o tempo de primeira resposta no suporte',
      intro:
        'O time de suporte responde em 14 horas na média. A meta são 4. Antes de contratar alguém, roda um único ciclo.',
      blocks: [
        {
          heading: 'Planejar',
          items: [
            'Meta: primeira resposta média abaixo de 4 horas',
            'Suposição: os chamados se acumulam de manhã e ninguém assume',
            'Experimento: uma pessoa de plantão das 09h às 11h',
            'Duração: duas semanas',
          ]
        },
        {
          heading: 'Fazer',
          items: [
            'Escala compartilhada com o time',
            'Quem está de plantão não recebe outro trabalho nessas duas horas',
            'Hora da primeira resposta registrada em cada chamado',
          ]
        },
        {
          heading: 'Checar',
          items: [
            'A média caiu de 14 horas para 5',
            'Chamados da manhã caíram para 2 horas',
            'Chamados da tarde não mudaram',
            'Quem estava de plantão atrasou o próprio trabalho',
          ]
        },
        {
          heading: 'Agir',
          items: [
            'Plantão da manhã virou permanente',
            'Carga reduzida nos dias de plantão',
            'Novo ciclo aberto para o período da tarde',
          ]
        },
      ],
      outcome:
        'Um ciclo cortou o tempo para um terço e produziu sozinho a próxima pergunta: os chamados da tarde. É assim que o PDCA deve rodar — cada ciclo entrega o assunto do seguinte.'
    },
    faq: [
      {
        q: 'O que é o ciclo PDCA?',
        a:
          'Um laço de quatro passos para melhoria contínua: planejar, fazer, checar e agir. Também conhecido como ciclo de Deming. A ideia é parar de fazer uma grande mudança e, no lugar, rodar experimentos pequenos cujo resultado é de fato medido.'
      },
      {
        q: 'Quanto deve durar um ciclo?',
        a:
          'O menor tempo em que dá para medir o resultado. De uma a quatro semanas serve para quase todo trabalho de escritório. Um ciclo de seis meses não é um ciclo: as condições terão mudado quando você olhar e não dará para saber o que causou o quê.'
      },
      {
        q: 'O que se mede na etapa de checar?',
        a:
          'O que você escreveu ao planejar. Por isso a meta precisa ser um número: «responder mais rápido» não dá para checar, «primeira resposta média abaixo de 4 horas» dá. Sem um número escrito antes, checar vira opinião.'
      },
      {
        q: 'E se o experimento falhar?',
        a:
          'Um ciclo que falha também é resultado e não se joga fora. Na etapa de agir você escreve por que a suposição não se sustentou, e o ciclo seguinte parte dali. O único desperdício real no PDCA é tentar algo novo sem registrar o que aconteceu.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para rodar um ciclo PDCA.'
      },
    ]
  },

  waterfall: {
    title: 'Modelo cascata',
    summary:
      'Divide o projeto em seis fases conduzidas em ordem: Requisitos, Projeto de alto nível, Projeto de baixo nível, Implementação, Verificação e Manutenção. A fase seguinte só abre quando a atual fecha, e a fase fechada fica travada.',
    whenToUse: [
      'Trabalhos cujos requisitos são conhecidos desde o início e não vão mudar no caminho.',
      'Projetos com aprovações e documentação, em que cada fase precisa ficar registrada.',
      'Trabalhos em que a ordem importa: não se produz antes de terminar o projeto.'
    ],
    steps: [
      'Escreva no alto o nome do projeto e clique em Começar.',
      'As seis fases ficam empilhadas. Só a fase aberta aceita itens; as seguintes aparecem com cadeado.',
      'Quando a fase estiver pronta, clique em "concluir esta fase" abaixo do quadro.',
      'Depois de confirmar, a fase seguinte abre; a concluída ganha um visto e os seus itens não podem mais ser alterados.',
      'Um projeto pode conter vários projetos em cascata.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Adicionar à fase o item digitado' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer (também reverte uma fase concluída)' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Não existe botão para reabrir uma fase; se concluiu por engano, desfazer é o único caminho de volta.',
      'Confirme que a fase está mesmo terminada antes de fechá-la: ao fechar, os textos também travam.',
      'Se os requisitos vão mudar no caminho, a cascata aperta; nesse caso a EAP ou o PDCA funcionam melhor.'
    ],
    seo: {
      name: 'Modelo cascata',
      title: 'Modelo cascata na gestão de projetos | Klarsti',
      description:
        'Requisitos, design, desenvolvimento, testes e entrega em sequência. Com exemplo e a diferença para os métodos ágeis.',
      keywords: 'modelo cascata, metodologia cascata, cascata vs ágil, fases modelo cascata, waterfall projeto'
    },
    example: {
      title: 'Exemplo: entregar um módulo de relatórios a um banco',
      intro:
        'Escopo fixado em contrato, data de entrega fixada e aprovação por escrito do cliente ao fim de cada fase. Um trabalho assim avança pelas fases em ordem.',
      blocks: [
        {
          heading: 'Requisitos',
          items: [
            'Tipos de relatório listados',
            'Regras de permissão escritas',
            'Aprovação do cliente',
          ]
        },
        {
          heading: 'Design',
          items: [
            'Modelo de dados',
            'Rascunhos de tela',
            'Limites de desempenho acordados',
          ]
        },
        {
          heading: 'Desenvolvimento',
          items: [
            'Motor de relatórios',
            'Permissões',
            'Exportação',
          ]
        },
        {
          heading: 'Testes e entrega',
          items: [
            'Testes internos',
            'Teste de aceitação do cliente',
            'Entrada em produção',
            'Treinamento de usuários',
          ]
        },
      ],
      outcome:
        'Aqui aparecem juntas a força e a fraqueza da cascata: como o escopo está fixado desde o começo, o avanço é fácil de medir — mas um requisito que muda durante o desenvolvimento joga o plano inteiro para trás.'
    },
    faq: [
      {
        q: 'O que é o modelo cascata?',
        a:
          'Um método que divide o projeto em fases sequenciais e não começa uma antes de terminar a anterior: requisitos, design, desenvolvimento, testes e entrega. O nome vem da água caindo por degraus.'
      },
      {
        q: 'Cascata ou ágil?',
        a:
          'Se o escopo é conhecido de antemão e dificilmente vai mudar, a cascata traz menos peso de gestão: construção, trabalhos regulados e entregas de preço fechado se encaixam. Se o escopo só vai ficar claro no caminho, a cascata sai cara e os métodos ágeis servem melhor.'
      },
      {
        q: 'Dá para voltar a uma fase anterior?',
        a:
          'Dá, mas custa, e o modelo não foi feito para isso. Se você volta com frequência, é sinal de que o escopo nunca esteve claro o bastante; e aí a pergunta real é se a cascata era a escolha certa.'
      },
      {
        q: 'O que acontece entre as fases?',
        a:
          'Cada fase termina com uma entrega e uma aprovação, e a aprovação deve ser por escrito. Toda a garantia que a cascata oferece se apoia em as duas partes concordarem, no mesmo momento, que uma fase está fechada.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para tocar um projeto em cascata.'
      },
    ]
  },

  fta: {
    title: 'Análise de árvore de falhas (FTA)',
    summary:
      'No topo fica um evento indesejado e abaixo as condições que precisam se combinar para que ele ocorra. A árvore é montada com portas lógicas; ao inserir probabilidades nos eventos básicos, a do evento de topo é calculada sozinha.',
    whenToUse: [
      'Para ver quais combinações de condições podem gerar uma falha ou um acidente.',
      'Para falar de risco em números: quanto cada ramo contribui para o total.',
      'Para mostrar qual ramo uma medida de segurança corta.'
    ],
    steps: [
      'Pelo menu no canto superior esquerdo você troca entre as árvores do mesmo projeto e pode criar, renomear ou excluir uma.',
      'Crie a caixa do evento de topo na tela vazia, ou carregue o exemplo pronto.',
      'Clique com o botão direito numa caixa e use Editar para o nome, a descrição e — nos eventos básicos — a probabilidade.',
      'Nesse menu você adiciona eventos abaixo: evento, evento básico, evento não desenvolvido ou evento condicionante.',
      'No mesmo menu estão as portas lógicas: E, E prioritário, OU, OU exclusivo e porta inibidora.',
      'Insira as probabilidades em porcentagem nos eventos básicos; as portas acima e o evento de topo são calculados a partir delas.',
      'Arraste as caixas para posicioná-las e use o minimapa no canto inferior direito para navegar numa árvore grande.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Excluir a caixa selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Uma porta E multiplica as probabilidades abaixo: tudo precisa acontecer e o resultado encolhe. Uma porta OU basta uma, e o resultado cresce.',
      'Ramos sem probabilidade não entram na conta; o número do topo cobre só os dados que você inseriu.',
      'Eventos básicos são círculos e não desenvolvidos são losangos: marcar os ramos que você não aprofundou mantém a árvore honesta.'
    ],
    seo: {
      name: 'Análise de árvore de falhas (FTA)',
      title: 'Análise de árvore de falhas (FTA) | Klarsti',
      description:
        'Coloque o evento indesejado no topo e resolva com portas E/OU quais falhas precisam coincidir. Com exemplo, grátis.',
      keywords: 'árvore de falhas, análise de árvore de falhas, fta, porta e ou, árvore de falhas exemplo'
    },
    example: {
      title: 'Exemplo: a câmara fria passou do limite de temperatura',
      intro:
        'Num armazém de alimentos a temperatura ficou duas horas acima do limite e a mercadoria teve de ser descartada. O evento de topo é escrito e a árvore desce por portas lógicas mostrando quais falhas precisaram coincidir.',
      blocks: [
        {
          heading: 'Evento de topo',
          items: [
            'Câmara fria acima do limite por duas horas',
          ]
        },
        {
          heading: 'Porta OU — qualquer uma basta',
          items: [
            'A refrigeração parou',
            'Entrou calor',
            'O alarme não disparou e ninguém percebeu',
          ]
        },
        {
          heading: 'Sob «a refrigeração parou» (OU)',
          items: [
            'Falha do compressor',
            'Queda de energia',
            'Termostato mal ajustado',
          ]
        },
        {
          heading: 'Sob «o alarme não disparou» (E)',
          items: [
            'Sensor com defeito',
            'Sensor reserva nunca instalado',
            'Avisos remotos desligados',
          ]
        },
      ],
      outcome:
        'A árvore mostra que a refrigeração parar não basta sozinha: o alarme também precisava falhar. Ou seja, a contramedida mais barata não é um compressor novo, é instalar o sensor reserva. É aqui que a árvore de falhas manda o dinheiro para o lugar certo.'
    },
    faq: [
      {
        q: 'O que é a análise de árvore de falhas (FTA)?',
        a:
          'Um método que coloca um evento indesejado no topo e desce por portas lógicas para mostrar quais combinações de falhas o produziriam. Veio da aeronáutica e da indústria nuclear, e hoje é usado em análises de segurança e de processos em geral.'
      },
      {
        q: 'Qual a diferença entre porta E e porta OU?',
        a:
          'Sob uma porta OU, qualquer um dos eventos abaixo já causa o evento acima. Sob uma porta E, todos precisam acontecer juntos. Essa distinção é o coração do método: portas E mostram onde o sistema está se protegendo sozinho.'
      },
      {
        q: 'Árvore de falhas ou 5 porquês?',
        a:
          'Os 5 porquês percorrem para trás uma única cadeia de algo que já aconteceu. A árvore de falhas mapeia todos os caminhos até um evento que ainda não aconteceu. Um olha para o passado, o outro para o futuro.'
      },
      {
        q: 'Até onde a árvore deve descer?',
        a:
          'Até eventos que você não consegue mais dividir e sobre os quais consegue agir diretamente. «Sensor com defeito» está baixo o bastante, porque dá para escrever uma contramedida contra isso. «O sistema não funciona» não está.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar uma árvore de falhas.'
      },
    ]
  },

  vsm: {
    title: 'Mapeamento do fluxo de valor',
    summary:
      'Desenha o fluxo de ponta a ponta de um produto ou trabalho junto com as esperas e estoques no meio. O objetivo é ver quanto do tempo total realmente agrega valor — normalmente bem menos do que se imagina.',
    whenToUse: [
      'Para descobrir onde um processo espera e onde o trabalho se acumula.',
      'Para ver qual etapa não acompanha a demanda do cliente: algo excede o tempo takt?',
      'Para desenhar o estado atual e colocar ao lado um estado futuro para comparar.',
    ],
    steps: [
      'Informe a demanda diária e os turnos no painel do canto superior direito. Daí sai o tempo takt: de quanto em quanto tempo uma peça precisa sair.',
      'No quadro vazio, crie o esqueleto inicial ou comece do zero. Clique com o botão direito no quadro para adicionar qualquer caixa.',
      'Escreva o tempo de ciclo com sua unidade na caixa de processo. Se ultrapassar o tempo takt a caixa fica vermelha: o gargalo está ali.',
      'Escreva as peças aguardando na caixa de estoque; o tempo de espera sai como peças ÷ demanda diária. Sem contagem, informe o tempo diretamente.',
      'Conecte as caixas. Clique com o botão direito numa conexão para trocá-la por empurrar, puxar, FIFO, informação manual ou eletrônica. Só as setas de material entram no cálculo.',
      'No menu superior esquerdo, copie o estado atual como estado futuro, trabalhe nele e compare os números de baixo.',
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Excluir a caixa selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'A eficiência de fluxo lá embaixo é o tempo que agrega valor dividido pelo lead time total. Um dígito é normal; o que precisa encurtar é a espera, não o trabalho.',
      'Se deixar o estoque fora do mapa, o tempo total parece melhor do que é — a informação real está ali.',
      'Caixas não conectadas à cadeia ficam fora dos totais e são contadas como aviso embaixo. Conecte o fluxo em uma única linha.',
      'Coloque a explosão kaizen onde pretende melhorar; é assim que se lê um mapa de estado futuro.',
    ],
    seo: {
      name: 'Mapeamento do fluxo de valor (VSM)',
      title: 'Mapeamento do fluxo de valor (VSM) | Klarsti',
      description:
        'Compare o tempo de processamento com a espera em cada etapa e veja onde o tempo se perde. Com exemplo numérico, grátis.',
      keywords: 'mapeamento do fluxo de valor, vsm, value stream mapping, lean manufacturing, vsm exemplo'
    },
    example: {
      title: 'Exemplo: do pedido recebido à mercadoria expedida',
      intro:
        'Um fabricante mede o tempo entre a chegada de um pedido e a mercadoria subir no caminhão. O tempo real de processamento de cada passo é anotado separado da espera entre passos. A diferença muda o quadro inteiro.',
      blocks: [
        {
          heading: 'Passos e tempo de processamento',
          items: [
            'Entrada do pedido — 10 minutos',
            'Análise de crédito — 15 minutos',
            'Entrada no plano de produção — 30 minutos',
            'Produção — 4 horas',
            'Controle de qualidade — 20 minutos',
            'Embalagem e expedição — 40 minutos',
          ]
        },
        {
          heading: 'Espera entre passos',
          items: [
            'Depois da entrada — 1 dia',
            'Depois do crédito — 2 dias',
            'Depois de entrar no plano — 3 dias',
            'Depois da produção — 1 dia',
            'Depois da qualidade — 2 dias',
          ]
        },
      ],
      outcome:
        'O tempo de processamento soma cerca de 6 horas; o tempo total são 9 dias. Ou seja, 99% do tempo é espera. A maior espera são os três dias depois de entrar no plano. A resposta não deixa dúvida: acelerar a produção não adianta, o problema é a fila.'
    },
    faq: [
      {
        q: 'O que é o mapeamento do fluxo de valor (VSM)?',
        a:
          'Um mapa de todos os passos pelos quais um produto ou um pedido passa, com a duração de cada passo e a espera entre eles. Vem da produção enxuta. O objetivo não é ir mais rápido, e sim mostrar para onde o tempo realmente vai.'
      },
      {
        q: 'O que agrega valor e o que não agrega?',
        a:
          'Tudo pelo que o cliente pagaria de bom grado agrega valor: os passos que de fato mudam o produto. Esperar, movimentar e repetir conferências não agregam. Na maioria dos processos mais de 90% do tempo total não agrega valor.'
      },
      {
        q: 'Qual a diferença para um fluxograma?',
        a:
          'O fluxograma mostra a ordem dos passos e os pontos de decisão, sem durações. No mapa de fluxo de valor a duração é tudo: tempo de processamento e tempo de espera são anotados separadamente em cada passo e depois comparados.'
      },
      {
        q: 'Por onde começo?',
        a:
          'Mapeando o estado atual exatamente como ele é. O erro mais comum é desenhar o processo como ele deveria funcionar. Se o mapa não mostra a realidade, as melhorias são aplicadas a um processo que não existe. É preciso medir os tempos reais no chão.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para desenhar um mapa de fluxo de valor.'
      },
    ]
  },

  pareto: {
    title: 'Análise de Pareto',
    summary:
      'A maior parte do efeito vem de poucas causas. Ordena as categorias por frequência da maior para a menor e traça por cima a curva de porcentagem acumulada, deixando visíveis os poucos itens por trás da maior parte do problema.',
    whenToUse: [
      'Para decidir por qual começar entre muitas reclamações, defeitos ou itens de custo.',
      'Para mostrar onde uma melhoria rende mais.',
      'Para defender que os recursos se concentrem em poucos pontos em vez de se espalharem.'
    ],
    steps: [
      'Crie a análise na primeira abertura. Pela lista do alto você alterna entre as análises do projeto, com o lápis renomeia e com a lixeira exclui.',
      'Na tabela do painel esquerdo, informe o nome da categoria e a frequência.',
      'Para uma linha nova use o botão de adicionar abaixo da tabela.',
      'O gráfico se atualiza na hora: as barras se ordenam da maior para a menor e a curva mostra a porcentagem acumulada.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'No lugar da frequência você pode lançar custo ou tempo perdido, desde que todas as linhas usem a mesma unidade.',
      'Pare onde a curva perde inclinação: a cauda longa da direita não compensa o esforço.',
      'Se picotar demais as categorias, nada se destaca e o gráfico achata. Junte o que for parecido.'
    ],
    seo: {
      name: 'Análise de Pareto',
      title: 'Análise de Pareto e gráfico 80/20 | Klarsti',
      description:
        'Ordene as causas por frequência e encontre as poucas que geram a maior parte do problema. Com exemplo, grátis.',
      keywords: 'análise de pareto, diagrama de pareto, regra 80 20, princípio de pareto, pareto exemplo'
    },
    example: {
      title: 'Exemplo: de onde vêm as reclamações dos clientes',
      intro:
        'Uma loja online recebeu 480 reclamações em três meses. O time vinha discutindo uma solução diferente para cada tipo. Contar e ordenar da maior para a menor muda a conversa.',
      blocks: [
        {
          heading: 'Tipo de reclamação e quantidade',
          items: [
            'Entrega atrasada — 196',
            'Produto diferente da descrição — 121',
            'Devolução demorada — 62',
            'Produto danificado — 48',
            'Produto errado — 29',
            'Outras — 24',
          ]
        },
        {
          heading: 'Percentual acumulado',
          items: [
            'Entrega atrasada — 41%',
            '+ Descrição — 66%',
            '+ Devoluções — 79%',
            '+ Danos — 89%',
            'As três restantes — 100%',
          ]
        },
      ],
      outcome:
        'As duas primeiras somam dois terços de tudo. Em vez de perseguir seis problemas ao mesmo tempo, corrigir o prazo de entrega e as descrições elimina 66% da insatisfação. Tornar essa ordem visível é todo o trabalho da análise de Pareto.'
    },
    faq: [
      {
        q: 'O que é a análise de Pareto?',
        a:
          'Um método que ordena os problemas por frequência, do maior para o menor, e mostra quais poucos somam a maior parte do total. Apoia-se numa observação simples: cerca de 80% dos efeitos vêm de cerca de 20% das causas.'
      },
      {
        q: 'A regra 80/20 sempre vale?',
        a:
          'Não exatamente, e nem precisa. Às vezes dá 70/30, às vezes 90/10. O que importa não é a proporção, e sim a distribuição ser desigual: se poucos itens carregam a maior parte do total, a análise de Pareto serve.'
      },
      {
        q: 'Ordeno por quantidade ou por custo?',
        a:
          'Por aquilo de que a sua decisão depende. A quantidade mostra qual problema acontece mais; o custo, qual dói mais. Muitas vezes discordam: um problema raro mas caro fica no fim de uma lista ordenada por quantidade.'
      },
      {
        q: 'Quantas categorias usar?',
        a:
          'De cinco a dez é o que se lê melhor. Uma análise com trinta categorias continua sendo uma lista e não dá foco. Escolher poucas categorias realmente distintas é metade do trabalho.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para fazer uma análise de Pareto.'
      },
    ]
  },

  histogram: {
    title: 'Histograma',
    summary:
      'Mostra a distribuição de uma medição: onde os valores se agrupam, se a dispersão é simétrica, se há algo nas pontas. Você fornece as medições brutas, a ferramenta forma as classes e, com limites de especificação, calcula também a capacidade do processo.',
    whenToUse: [
      'Para ver o que a média esconde: a mesma média pode vir de distribuições bem diferentes.',
      'Para avaliar quão consistente é um processo — dispersão estreita é consistente, larga é errática.',
      'Para ver com que frequência as medições saem da especificação e se o processo atende à demanda.',
    ],
    steps: [
      'Crie a análise; pela lista de cima você troca entre análises do mesmo projeto.',
      'Escreva as medições no campo à esquerda ou cole uma lista como está. Um valor por linha; decimais aceitam vírgula ou ponto.',
      'A ferramenta escolhe o número de classes (regra de Sturges). Se preferir, escreva o seu próprio número.',
      'Informe os limites inferior e superior. Eles aparecem como linhas vermelhas tracejadas e as colunas fora do limite ficam vermelhas.',
      'Abaixo ficam contagem, média, desvio padrão e amplitude; com os dois limites, também Cp e Cpk.',
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'A curva cinza é uma distribuição normal com a mesma média e desvio. Colunas que se afastam claramente apontam causa especial.',
      'Uma distribuição de dois picos costuma indicar que dois processos (dois turnos, duas máquinas) foram misturados.',
      'Cpk de 1,33 ou mais costuma ser considerado capaz; abaixo de 1 o processo não sustenta os limites.',
      'Cp bom com Cpk ruim significa dispersão estreita mas média deslocada — um ajuste resolve.',
    ],
    seo: {
      name: 'Histograma',
      title: 'Criar um histograma — ver a distribuição | Klarsti',
      description:
        'Agrupe suas medições em intervalos e descubra o que a média esconde. Explica o que significam dois picos. Grátis.',
      keywords: 'histograma, criar histograma, histograma online, distribuição de frequência, histograma exemplo'
    },
    example: {
      title: 'Exemplo: prazos de entrega',
      intro:
        'O prazo médio de entrega é informado como 3 dias e parece razoável. Mesmo assim as reclamações continuam. Agrupar os prazos um a um revela o que a média escondia.',
      blocks: [
        {
          heading: 'Distribuição do prazo (500 pedidos)',
          items: [
            '1 dia — 140 pedidos',
            '2 dias — 165 pedidos',
            '3 dias — 95 pedidos',
            '4 dias — 30 pedidos',
            '5 dias — 12 pedidos',
            '6 dias ou mais — 58 pedidos',
          ]
        },
        {
          heading: 'Como ler',
          items: [
            '60% chega em até dois dias',
            'Há um grupo pequeno mas nítido em seis dias ou mais',
            'A forma tem dois picos, não um',
            'Três dias — a média — é um dos resultados menos frequentes',
          ]
        },
      ],
      outcome:
        'A média diz três dias, mas na prática existem duas experiências de cliente diferentes: a maioria recebe em dois dias e uma parte espera uma semana. Uma distribuição de dois picos significa sempre a mesma coisa: isso não é um processo, são dois. A pergunta seguinte é de que região ou de que centro saíram aqueles 58 pedidos.'
    },
    faq: [
      {
        q: 'O que é um histograma?',
        a:
          'Um gráfico que divide as medições em intervalos e mostra quantas caem em cada um. Torna visível o que a média esconde: como os valores se distribuem.'
      },
      {
        q: 'Qual a diferença para um gráfico de barras?',
        a:
          'O gráfico de barras mostra categorias e você pode reordená-las: cidades, produtos. O histograma tem eixo numérico, a ordem é fixa e as barras se tocam. O que decide qual você precisa é o tipo do dado.'
      },
      {
        q: 'Quantos intervalos usar?',
        a:
          'Um ponto de partida comum é aproximadamente a raiz quadrada do número de medições: cerca de dez para 100 dados. Poucos demais apagam a forma; muitos transformam ruído em estrutura aparente. Teste alguns valores e fique com aquele em que a forma se mantém estável.'
      },
      {
        q: 'O que significa um histograma com dois picos?',
        a:
          'Quase sempre que os dados não vieram de um único processo: dois turnos, duas máquinas, duas regiões. Ao ver essa forma, a primeira coisa a fazer é separar os dados e olhar cada parte por si.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar um histograma.'
      },
    ]
  },

  decision: {
    title: 'Matriz de decisão',
    summary:
      'Pontua várias opções pelos mesmos critérios. Cada critério tem um peso; o total de uma opção é a soma dos produtos de nota por peso.',
    whenToUse: [
      'Quando você está travado entre poucas alternativas e a discussão "qual é melhor" fica dando voltas.',
      'Quando a justificativa da decisão precisa ficar registrada.',
      'Quando cada um na equipe pesa em silêncio um critério diferente: a matriz traz esses critérios à tona.'
    ],
    steps: [
      'Adicione critérios: os títulos pelos quais você vai comparar (custo, prazo, risco...).',
      'Dê a cada critério um peso de 1 a 5, conforme o quanto ele importa para você.',
      'Adicione opções: as alternativas que vai comparar.',
      'Na tabela, dê a cada opção uma nota de 0 a 10 em cada critério.',
      'Os totais são calculados sozinhos e a opção de maior pontuação recebe um troféu.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Defina os pesos antes de começar a pontuar. Mexer neles depois não é decidir, é produzir a resposta que você queria.',
      'A matriz não decide por você; deixa visível com base em que você decidiu.',
      'Se dois totais ficarem muito próximos, a resposta não é "empate", e sim "esses critérios não separam": procure o critério que falta.'
    ],
    seo: {
      name: 'Matriz de decisão',
      title: 'Matriz de decisão — pontuação ponderada | Klarsti',
      description:
        'Pontue as opções com os mesmos critérios e seus pesos, deixando visível no que a decisão se apoia. Com exemplo, grátis.',
      keywords: 'matriz de decisão, pontuação ponderada, tomada de decisão, matriz de decisão exemplo, comparar opções'
    },
    example: {
      title: 'Exemplo: qual galpão devemos alugar?',
      intro:
        'Três candidatos, e cada pessoa tem um favorito. A discussão anda no «eu acho». Ponderar os critérios e dar nota de um a dez a cada opção leva tudo para números.',
      blocks: [
        {
          heading: 'Critérios e peso',
          items: [
            'Custo mensal — peso 5',
            'Distância dos clientes — peso 4',
            'Espaço para crescer — peso 3',
            'Acesso a rodovia e porto — peso 3',
            'Dificuldade da mudança — peso 1',
          ]
        },
        {
          heading: 'Notas (1-10)',
          items: [
            'Galpão A: 8 / 4 / 6 / 5 / 7',
            'Galpão B: 5 / 9 / 4 / 8 / 5',
            'Galpão C: 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Total ponderado',
          items: [
            'Galpão A — 100',
            'Galpão B — 114',
            'Galpão C — 114',
          ]
        },
      ],
      outcome:
        'A saiu. B e C empataram, então a matriz não decidiu — mas reduziu a discussão de cinco critérios para um. A única pergunta que sobrou é se proximidade vale mais que espaço para crescer. Esse costuma ser o real benefício de uma matriz de decisão: ela não escolhe, ela estreita.'
    },
    faq: [
      {
        q: 'O que é uma matriz de decisão?',
        a:
          'Uma tabela que dá nota a várias opções segundo os mesmos critérios e multiplica cada nota pela importância daquele critério. O objetivo não é automatizar a decisão, e sim deixar visíveis as suposições em que ela se apoia.'
      },
      {
        q: 'Como defino os pesos?',
        a:
          'Antes de dar notas e sem olhar as opções. Ao contrário, as pessoas ajustam discretamente os pesos até a opção preferida vencer. Escrever os pesos primeiro e travá-los é a única coisa que faz a matriz valer alguma coisa.'
      },
      {
        q: 'E se o resultado não for a opção que eu queria?',
        a:
          'Esse é o momento mais valioso da matriz. Há duas possibilidades: ou você pesou mal um critério, ou falta um critério na tabela. As duas se resolvem escrevendo o que falta, não mexendo nos números.'
      },
      {
        q: 'Quantos critérios usar?',
        a:
          'De quatro a sete funciona bem. Abaixo de três você poderia ter decidido no instinto; acima de sete os pesos se aproximam e os totais acabam colados sem significado.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar uma matriz de decisão.'
      },
    ]
  },

  notepad: {
    title: 'Agenda',
    summary:
      'Um espaço pessoal em que você escolhe dias no calendário e os planeja. Diferente das outras ferramentas, a agenda não é dado de projeto: os registros são seus e não vão para ninguém quando você compartilha um projeto.',
    whenToUse: [
      'Para organizar o dia e encaixar o trabalho nos horários.',
      'Para puxar uma tarefa da EAP para um dia específico.',
      'Para escrever com suas palavras como foi o dia, ao encerrá-lo.'
    ],
    steps: [
      'Os dias com registros aparecem marcados no calendário; um clique abre o fluxo daquele dia.',
      'Para um registro novo, escreva o título e o texto. Dê um intervalo de horário ou deixe como dia inteiro.',
      'Se o intervalo escolhido conflitar com outro registro, aparece um aviso.',
      'Você pode definir um lembrete: na hora, 5 / 15 / 30 minutos, 1 hora ou 1 dia antes. Os lembretes chegam como notificação no aplicativo móvel.',
      'Na seção de avaliação do dia, no alto, você escreve com suas palavras como foi; não precisa salvar à parte.',
      'Não dá para adicionar registro novo a um dia passado. Os existentes podem ser editados, ou trazidos com "mover para hoje".'
    ],
    tips: [
      'Clique com o botão direito numa tarefa da EAP e escolha "Adicionar à agenda": ela cai aqui com a própria data.',
      'Desfazer e refazer não funcionam na agenda; ela não guarda histórico.',
      'A lista abaixo do calendário mostra os seus próximos registros; comece por ali se não souber qual dia abrir.'
    ],
    seo: {
      name: 'Agenda diária',
      title: 'Agenda diária com balanço do dia | Klarsti',
      description:
        'Escreva o dia de manhã e revise à noite. Sua agenda é privada e não entra no compartilhamento de um projeto.',
      keywords: 'agenda diária, planejador diário, balanço do dia, lista de tarefas, agenda online'
    },
    example: {
      title: 'Exemplo: uma terça-feira cheia',
      intro:
        'Três reuniões, uma entrega e todo o resto espremido no meio. Cinco minutos de manhã escrevendo o dia evitam passar a noite discutindo consigo mesmo sobre o que foi feito.',
      blocks: [
        {
          heading: 'Hoje sem falta',
          items: [
            'Terminar a apresentação do cliente (antes da reunião das 14h)',
            'Enviar as aprovações de nota fiscal',
            'Liberar os acessos da pessoa nova',
          ]
        },
        {
          heading: 'Se der tempo',
          items: [
            'Ler o relatório da semana passada',
            'Ligar para o fornecedor',
            'Organizar a área de trabalho',
          ]
        },
        {
          heading: 'Balanço do dia',
          items: [
            'A apresentação ficou pronta, mas às 13h50, apertado demais',
            'As aprovações de nota fiscal foram esquecidas — amanhã em primeiro lugar',
            'Consegui duas horas seguidas sem interrupção à tarde',
            'Amanhã vou juntar as reuniões depois do almoço',
          ]
        },
      ],
      outcome:
        'O valor não está na lista, está no balanço. Depois de uma semana escrevendo, a mesma linha volta: o trabalho está sendo espremido entre reuniões. Isso não dá para consertar antes de perceber.'
    },
    faq: [
      {
        q: 'Para que serve a agenda diária?',
        a:
          'Para escrever o dia no começo e revê-lo no fim. Tem duas metades: o plano e o balanço do dia. Sem a segunda, vira lista de tarefas; o valor está em perceber que o mesmo erro se repete.'
      },
      {
        q: 'Alguém mais consegue ver minha agenda?',
        a:
          'Não. A agenda e o balanço do dia são pessoais. Não ficam dentro dos seus projetos, e sim no seu próprio registro, então compartilhar um projeto com o time não compartilha a sua agenda.'
      },
      {
        q: 'Quantos itens devo escrever?',
        a:
          'No máximo três na lista do que é obrigatório. Listas maiores terminam todo dia pela metade e depois de um tempo você para de olhar. O resto vai para o segundo grupo: bom se acontecer, e o dia não é um fracasso se não acontecer.'
      },
      {
        q: 'O que escrever no balanço do dia?',
        a:
          'Não o que você fez, e sim o que percebeu. «Terminei a apresentação» não carrega informação; «a apresentação foi para o limite porque a reunião da manhã se estendeu» serve para você na semana seguinte.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento.'
      },
    ]
  },
  gantt: {
    title: "Gráfico de Gantt",
    summary: "Uma ferramenta de planejamento que coloca o trabalho como barras horizontais num calendário. O que começa quando, quanto dura e o que espera pelo quê, tudo numa tela.",
    whenToUse: [
      "Para prender o trabalho a datas e deixar os inícios claros.",
      "Para mostrar a ordem e as tarefas que dependem umas das outras.",
      "Para ver cedo o que está atrasando."
    ],
    steps: [
      "Um projeto pode ter vários gráficos. No menu do canto superior esquerdo você cria um novo ou alterna entre eles.",
      "Adicione linhas com \"Adicionar tarefa\". Duplo clique no nome para alterá-lo.",
      "Ao selecionar uma linha, abre-se a barra de detalhe embaixo: início, fim, progresso e status.",
      "Arraste uma barra para deslocar as datas; puxe uma ponta para alongá-la ou encurtá-la.",
      "O botão de avanço torna uma linha subtarefa da anterior. A barra de uma tarefa-mãe é calculada.",
      "O botão de dependência cria o laço \"não começa antes de\"; é desenhada uma seta entre as barras."
    ],
    tips: [
      "Para marcos sem duração escolha marco: em vez de barra aparece um losango.",
      "A linha vermelha marca hoje. Tarefas não concluídas com data passada ficam com contorno vermelho.",
      "Dia / semana / mês apertam ou abrem o calendário. A visão de mês cabe um plano longo numa tela."
    ],
    seo: {
      name: 'Gráfico de Gantt',
      title: 'Criar gráfico de Gantt — cronograma do projeto | Klarsti',
      description:
        'Coloque as tarefas no calendário e veja o que corre em paralelo e onde falta folga. Com exemplo de oito semanas.',
      keywords: 'gráfico de gantt, criar gráfico de gantt, gantt online, cronograma de projeto, gantt exemplo'
    },
    example: {
      title: 'Exemplo: refazer um site',
      intro:
        'O trabalho precisa caber em oito semanas. Quem começa quando, e qual tarefa espera qual, não está claro. Colocar as tarefas num calendário torna as colisões visíveis.',
      blocks: [
        {
          heading: 'Tarefas e semanas',
          items: [
            'Inventário de conteúdo — semana 1',
            'Design — semanas 2 e 3',
            'Redação — semanas 2 a 5',
            'Desenvolvimento — semanas 4 a 7',
            'Carga de conteúdo — semanas 6 e 7',
            'Testes e lançamento — semana 8',
          ]
        },
        {
          heading: 'Perguntas que apareceram',
          items: [
            'Desenvolvimento começa na semana 4 mas design acaba na 3: nenhuma folga',
            'A carga espera a redação, que acaba na semana 5: apertado',
            'Só uma semana de testes, então qualquer defeito empurra o lançamento',
            'Redação e design são a mesma pessoa?',
          ]
        },
      ],
      outcome:
        'O que o gráfico produziu não foi um plano, e sim os riscos do plano. Oito semanas funcionam no papel, mas não há folga em lugar nenhum. Um Gantt não serve para inventar durações: serve para mostrar onde falta a folga.'
    },
    faq: [
      {
        q: 'O que é um gráfico de Gantt?',
        a:
          'Um gráfico que coloca as tarefas como barras horizontais sobre um calendário. O comprimento da barra é a duração e a posição é quando o trabalho acontece. De uma olhada dá para ver quais tarefas correm ao mesmo tempo.'
      },
      {
        q: 'Como fazer um gráfico de Gantt?',
        a:
          'Primeiro levante as tarefas, depois leve para o calendário. A ordem certa é: monte uma EAP, estime cada item, anote as dependências e só então desenhe. Um Gantt feito sem decomposição apenas deixa uma lista incompleta com cara de organizada.'
      },
      {
        q: 'O que é uma dependência?',
        a:
          'Se uma tarefa não pode começar antes de outra terminar, existe uma dependência entre elas. No Gantt elas formam correntes, e a corrente mais longa define a duração real do projeto: todo atraso nela move a entrega diretamente.'
      },
      {
        q: 'Qual a diferença para um roadmap?',
        a:
          'O Gantt amarra tarefas a dias e semanas e é para o time que executa. O roadmap é mais grosso — trimestres ou meses — e comunica intenção; costuma ir para a diretoria ou para clientes, não para o time de entrega.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar um gráfico de Gantt.'
      },
    ]
  },

  roadmap: {
    title: "Roteiro",
    summary: "Um mapa que divide um assunto em etapas sucessivas, com os temas pendurados em cada etapa. Você nunca arrasta as caixas: o mapa se organiza sozinho a cada alteração. Ao contrário da estrutura analítica, aqui você acompanha o progresso: cada caixa tem um status e a faixa de cima diz quanto já está feito.",
    whenToUse: [
      "Para pôr um assunto em ordem de aprendizado e saber até onde você chegou.",
      "Para planejar passo a passo os primeiros meses de quem chega.",
      "Para mostrar numa só tela as fases pelas quais um trabalho passa.",
      "Para dividir um programa de treinamento em temas e anexar os materiais a eles."
    ],
    steps: [
      "Uma pasta pode ter vários roteiros. No menu do canto superior esquerdo você cria um novo e alterna entre eles.",
      "O traçado principal vai do início ao fim. Selecione uma etapa e pressione Enter para adicionar a seguinte.",
      "Com uma etapa selecionada, o Tab pendura um tema nela. Num tema, o Tab cria um subtema e o Enter um do mesmo nível.",
      "O círculo no início da caixa muda o status: Não iniciado → Em andamento → Concluído → Ignorado. A cor acompanha.",
      "Botão direito numa caixa e «Detalhes» abre o painel lateral: nota, tempo estimado e links.",
      "Para dividir um roteiro longo, adicione um título de seção pelo menu de contexto (Inicial / Intermediário / Avançado, por exemplo).",
      "Um tema tornado opcional é ligado por tracejado e fica de fora da porcentagem.",
      "O botão de girar na faixa passa o traçado de vertical para horizontal; assim um roteiro longo se lê bem numa tela larga."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "Nova etapa no traçado" },
      { keys: ["Tab"], desc: "Tema sob a caixa selecionada" },
      { keys: ["F2"], desc: "Mudar o nome da caixa selecionada" },
      { keys: ["Delete"], desc: "Excluir a caixa selecionada" },
      { keys: ["Shift", "Enter"], desc: "Mudar de linha ao escrever" },
      { keys: ["Esc"], desc: "Fechar o campo de texto" },
      { keys: ["Mod", "Z"], desc: "Desfazer" },
      { keys: ["Mod", "Y"], desc: "Refazer" }
    ],
    tips: [
      "As caixas não se arrastam, a disposição é automática. Para mudar a ordem de uma etapa, use os comandos do menu de contexto.",
      "Os temas alternam de lado de etapa para etapa, para o mapa não crescer só para um lado.",
      "As caixas ignoradas contam como concluídas: um tema que você decidiu não fazer não deve travar a porcentagem para sempre.",
      "As horas que você escreve são somadas; a faixa mostra o total que falta nas caixas não concluídas.",
      "O endereço precisa começar com http ou https, caso contrário não é aceito."
    ],
    seo: {
      name: 'Roadmap',
      title: 'Criar um roadmap de produto | Klarsti',
      description:
        'Divida o próximo período em etapas e escreva também o que não será feito. Com exemplo de seis meses, grátis.',
      keywords: 'roadmap, roadmap de produto, roadmap de projeto, roadmap exemplo, modelo de roadmap'
    },
    example: {
      title: 'Exemplo: roadmap de seis meses de um app',
      intro:
        'O time muda de direção a cada ideia nova e a diretoria não sabe o que chega nem quando. Seis meses são divididos em três paradas grossas. O objetivo não é prometer datas, e sim fixar a ordem.',
      blocks: [
        {
          heading: 'Parada 1 — Firmar a base',
          items: [
            'Cortar o tempo de abertura pela metade',
            'Corrigir as telas que fecham sozinhas',
            'Simplificar o cadastro',
          ]
        },
        {
          heading: 'Parada 2 — Reter',
          items: [
            'Ajustes de notificação',
            'Modo offline',
            'Caixa de sugestões',
          ]
        },
        {
          heading: 'Parada 3 — Crescer',
          items: [
            'Convidar um amigo',
            'Segundo idioma',
            'Base para o plano pago',
          ]
        },
        {
          heading: 'O que não vamos fazer',
          items: [
            'Layout para tablet',
            'Versão desktop',
            'Recursos de IA',
          ]
        },
      ],
      outcome:
        'O quadro mais útil do roadmap é o último. Escrever o que você vai fazer não encerra a discussão; escrever o que não vai fazer neste período, sim.'
    },
    faq: [
      {
        q: 'O que é um roadmap de produto?',
        a:
          'Um plano de alto nível que mostra para onde um produto ou um trabalho vai no período seguinte, e em que ordem. Não é uma lista de tarefas: comunica intenção e sequência.'
      },
      {
        q: 'O roadmap deve ter datas?',
        a:
          'Datas exatas costumam fazer estrago: erre uma e a credibilidade do roadmap inteiro vai junto. Trimestres, ou uma estrutura de «agora / a seguir / depois», aguentam muito melhor. Se você realmente precisa de uma data exata, aquele item pertence a um Gantt, não a um roadmap.'
      },
      {
        q: 'De quanto em quanto tempo atualizar?',
        a:
          'Revisar uma vez por mês serve para quase qualquer time. Um roadmap que muda toda semana não é um roadmap; um que nunca muda perdeu contato com a realidade. O que importa não é a mudança, e sim escrever por que mudou.'
      },
      {
        q: 'Por que preciso de uma lista do que não será feito?',
        a:
          'Porque quase toda pergunta que um roadmap atrai tem a forma «e o X?». Listar o que ficou de fora de propósito responde antes e evita que o time repita a mesma discussão toda semana.'
      },
      {
        q: 'É grátis?',
        a:
          'Sim. O Klarsti é gratuito e sem anúncios no momento, e você não precisa de conta para montar um roadmap.'
      },
    ]
  }
};

export default guides;
