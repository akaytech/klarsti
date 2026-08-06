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
    ]
  },

  wbs: {
    title: 'Estrutura analítica do projeto (EAP)',
    summary:
      'Uma árvore que divide um trabalho grande em partes que dá para fazer de verdade. Cada caixa é uma tarefa com estado, prazo, horário e descrição. Diferente do mapa mental, aqui você gerencia trabalho, não ideias.',
    whenToUse: [
      'Para dividir um projeto até ficar claro quem faz o quê.',
      'Para fixar o escopo: o que não está na árvore não está no projeto.',
      'Para amarrar as tarefas a datas e acompanhar o avanço pelos estados.'
    ],
    steps: [
      'Na tela vazia, segure Ctrl e clique em um espaço livre, ou use o botão direito: nasce uma tarefa raiz.',
      'Ctrl+clique numa caixa adiciona uma subtarefa abaixo dela. É a forma mais rápida de fazer a árvore crescer.',
      'Um clique simples seleciona a caixa, abre ou fecha os ramos abaixo dela e centraliza a câmera.',
      'Clique com o botão direito numa caixa: nome, prazo, hora de início e fim, descrição e estado (A fazer / Em andamento / Concluído / Falhou).',
      'Nesse mesmo menu, "Adicionar à agenda" leva a tarefa para a sua agenda na data escolhida. Se a data já passou, aparece um aviso.',
      'Ao marcar uma tarefa como falha, surge "analisar a causa raiz"; um clique a envia como problema para a ferramenta 5 Porquês.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clique'], desc: 'Em espaço livre: nova tarefa raiz' },
      { keys: ['Mod', 'Clique'], desc: 'Sobre uma caixa: subtarefa abaixo dela' },
      { keys: ['Shift', 'Arrastar'], desc: 'Mover a caixa junto com todos os ramos abaixo' },
      { keys: ['Delete'], desc: 'Excluir a caixa selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Sem o Shift, só a caixa que você segurou se move; o que está abaixo fica no lugar.',
      'Continue dividindo até cada folha ficar pequena o bastante para uma pessoa terminar sozinha.',
      'Para apagar uma data, use o xis ao lado do campo de data no menu de contexto; os horários somem junto.'
    ]
  },

  '5whys': {
    title: '5 Porquês',
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
      'Ctrl+clique em espaço livre inicia uma segunda cadeia de problema, independente, na mesma tela.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clique'], desc: 'Sobre uma caixa: novo porquê abaixo' },
      { keys: ['Shift', 'Clique'], desc: 'Sobre uma caixa: caixa de causa raiz' },
      { keys: ['Mod', 'Clique'], desc: 'Em espaço livre: novo problema' },
      { keys: ['Delete'], desc: 'Excluir a caixa selecionada' },
      { keys: ['Mod', 'Z'], desc: 'Desfazer' },
      { keys: ['Mod', 'Y'], desc: 'Refazer' }
    ],
    tips: [
      'Iniciar uma análise de causa raiz a partir de uma tarefa da EAP abre uma análise separada para ela; a análise aberta não é sobrescrita.',
      'Uma causa pode ter mais de uma resposta; repita o Ctrl+clique na mesma caixa para ramificá-la.',
      'Apoie cada resposta em algo verificável. "Desatenção" não é causa raiz, é uma pergunta sem resposta.',
      'Uma tarefa da EAP marcada como falha pode ser enviada para cá como problema pelo próprio menu de contexto.'
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
      'Clique com o botão direito numa caixa: ao adicionar outra abaixo você também escolhe a forma (início, processo, decisão, documento, fim...). No mesmo menu você edita o texto ou exclui.',
      'Arraste as caixas para onde quiser; aqui não há arranjo automático, a disposição é sua.',
      'Para traçar uma ligação, arraste de um ponto de conexão na borda de uma caixa até outra.',
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
      'Clique com o botão direito numa caixa para adicionar abaixo um cargo, uma unidade, uma equipe ou uma vaga em aberto. No mesmo menu você edita o nome e o título da linha de baixo.',
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
    ]
  },

  ishikawa: {
    title: 'Ishikawa (espinha de peixe)',
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
    ]
  },

  vsm: {
    title: 'Mapeamento do Fluxo de Valor (VSM)',
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
    ]
  }
};

export default guides;
