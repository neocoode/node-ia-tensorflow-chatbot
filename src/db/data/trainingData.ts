export default [
  {
    type: 'question',
    resume:
      'Tecnologia refere-se ao conjunto de conhecimentos, técnicas, ferramentas e métodos utilizados para resolver problemas ou facilitar atividades humanas. Ela pode envolver o uso de máquinas, dispositivos, sistemas ou processos para realizar tarefas de maneira mais eficiente, precisa ou inovadora.',
    keys: [
      'o que é tecnologia',
      'defina tecnologia',
      'fale sobre tecnologia',
      'explicação sobre tecnologia',
      'qual a definição de tecnologia',
      'conceito de tecnologia',
      'significado de tecnologia',
      'para que serve a tecnologia',
      'qual a importância da tecnologia',
    ],
    responses: [
      'Tecnologia é o conjunto de conhecimentos, técnicas, ferramentas e métodos usados para resolver problemas ou facilitar atividades humanas de maneira eficiente.',
      'A tecnologia envolve o uso de sistemas, dispositivos e processos que permitem otimizar e inovar em diversas áreas da vida, como saúde, comunicação e transporte.',
      'Ela pode ser aplicada em várias formas, como tecnologia da informação, comunicação, industrial, médica, e até em soluções de energia.',
      'A importância da tecnologia reside na sua capacidade de transformar e facilitar atividades humanas, melhorando a qualidade de vida e promovendo o avanço em múltiplos setores.',
    ],
    affirmations: [
      {
        statement: 'A tecnologia é relevante?',
        isCorrect: true,
        response:
          'Sim, a tecnologia é essencial para o progresso e inovação em várias áreas da sociedade.',
      },
      {
        statement: 'A tecnologia muda constantemente?',
        isCorrect: true,
        response:
          'Sim, a tecnologia está em constante evolução, trazendo inovações e novas soluções para problemas atuais.',
      },
    ],
    negations: [
      {
        statement: 'Tecnologia não tem impacto na vida moderna?',
        isCorrect: false,
        response:
          'Não, a tecnologia tem um impacto profundo na vida moderna, transformando a maneira como trabalhamos, nos comunicamos e vivemos.',
      },
    ],
    confidence: 0.99,
    tags: ['tecnologia', 'inovação', 'conhecimento', 'definição', 'importância', 'progresso'],
    links: [
      {
        label: 'Como a tecnologia evolui',
        url: 'https://www.evolucaotecnologica.com',
      },
      {
        label: 'Impactos da tecnologia na sociedade',
        url: 'https://www.tecnologiasociedade.com',
      },
    ],
  },
  {
    type: 'question',
    resume:
      'A Bíblia é um conjunto de textos religiosos e sagrados do Cristianismo e do Judaísmo. Ela é composta pelo Antigo Testamento, que inclui os textos sagrados dos judeus, e o Novo Testamento, que descreve a vida e os ensinamentos de Jesus Cristo.',
    keys: [
      'o que é a Bíblia',
      'defina Bíblia',
      'fale sobre a Bíblia',
      'explicação sobre a Bíblia',
      'qual a definição de Bíblia',
      'conceito de Bíblia',
      'significado da Bíblia',
      'para que serve a Bíblia',
      'qual a importância da Bíblia',
    ],
    responses: [
      'A Bíblia é uma coleção de textos religiosos e sagrados, dividida em Antigo e Novo Testamento.',
      'O Antigo Testamento contém os textos sagrados do Judaísmo, enquanto o Novo Testamento descreve a vida e os ensinamentos de Jesus Cristo.',
      'A Bíblia é uma das obras mais influentes da história, sendo um guia espiritual para bilhões de pessoas em todo o mundo.',
      'Ela contém histórias, leis, profecias, ensinamentos e orações que moldaram o pensamento religioso e filosófico ao longo dos séculos.',
    ],
    affirmations: [
      {
        statement: 'A Bíblia é importante para o Cristianismo?',
        isCorrect: true,
        response:
          'Sim, a Bíblia é a principal fonte de ensinamentos religiosos e espirituais para os cristãos.',
      },
      {
        statement: 'A Bíblia é composta por dois testamentos?',
        isCorrect: true,
        response: 'Sim, a Bíblia é dividida em Antigo e Novo Testamento.',
      },
    ],
    negations: [
      {
        statement: 'A Bíblia é apenas um livro de história?',
        isCorrect: false,
        response:
          'Não, a Bíblia é uma obra sagrada e espiritual que contém ensinamentos religiosos fundamentais, além de relatos históricos.',
      },
    ],
    confidence: 0.99,
    tags: ['Bíblia', 'religião', 'Cristianismo', 'Judaísmo', 'sagrado', 'espiritualidade'],
    links: [
      {
        label: 'História da Bíblia',
        url: 'https://www.historiasdabiblia.com',
      },
      {
        label: 'Estudos Bíblicos',
        url: 'https://www.estudosbiblicos.com',
      },
    ],
  },
];
