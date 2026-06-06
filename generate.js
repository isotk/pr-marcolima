#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data/devocionais.json");
const source = JSON.parse(fs.readFileSync(filePath, "utf8"));

const START_DATE = new Date(2026, 5, 1);
const TOTAL_DAYS = 365;

const IMAGES = [
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
  "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1518199267010-20d029a38318?w=800&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1505778276668-26b3ff7af103?w=800&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80"
];

const THEME_INSIGHTS = {
  Ansiedade: "A ansiedade tenta deslocar Deus do centro da confiança e colocar o peso da vida sobre os ombros humanos. A Escritura conduz o coração de volta à oração, à entrega e à certeza de que o Pai governa até aquilo que não conseguimos controlar.",
  Amor: "O amor bíblico não é apenas afeto, mas decisão santa que reflete o caráter de Deus. Ele aparece nas Escrituras como entrega, paciência, serviço e fidelidade, tendo em Cristo sua expressão mais perfeita.",
  Coragem: "A coragem bíblica nasce da presença de Deus, não da autoconfiança. O Senhor não chama Seu povo a negar o medo, mas a caminhar apesar dele, sustentado pela promessa de que Ele está junto dos Seus.",
  Descanso: "O descanso prometido por Deus não é fuga da responsabilidade, mas alívio para a alma que deixa de tentar vencer pela própria força. Em Cristo, o coração encontra descanso porque a graça substitui o peso do merecimento.",
  Esperança: "A esperança cristã não é otimismo religioso, mas confiança fundamentada no caráter fiel de Deus. Ela permite atravessar a espera sem abandonar a fé, porque olha para as promessas do Senhor acima das circunstâncias.",
  Fé: "A fé bíblica não ignora a realidade, mas escolhe interpretar a realidade à luz de Deus. Ela descansa no que o Senhor revelou, mesmo quando os olhos ainda não veem o cumprimento completo da promessa.",
  Força: "A força espiritual não nasce da suficiência humana, mas da dependência do Senhor. Deus muitas vezes revela Seu poder justamente onde reconhecemos nossa fraqueza e aprendemos a permanecer nEle.",
  Gratidão: "A gratidão bíblica desloca a atenção da falta para a fidelidade de Deus. Ela não nega a dor, mas ensina a reconhecer a presença e a bondade do Senhor mesmo em dias difíceis.",
  Oração: "A oração é comunhão antes de ser pedido. Por meio dela, o coração ansioso aprende a se render, a vontade humana se submete ao Pai, e a paz de Deus guarda pensamentos e afetos.",
  Paz: "A paz bíblica é mais profunda que tranquilidade externa. Ela é fruto da presença de Deus, da reconciliação em Cristo e da confiança de que o Senhor permanece governando mesmo quando a vida parece instável.",
  Perdão: "O perdão cristão nasce do evangelho. Quem foi alcançado pela graça de Cristo aprende a soltar a amargura, não porque a ofensa foi pequena, mas porque a cruz revelou uma misericórdia maior.",
  Perseverança: "A perseverança é fé amadurecida no tempo da prova. A Escritura mostra que Deus não desperdiça sofrimento; Ele o usa para formar constância, humildade e esperança no coração dos Seus.",
  Sabedoria: "A sabedoria bíblica não é apenas informação correta, mas discernimento para viver diante de Deus. Ela une temor do Senhor, humildade e obediência prática nas decisões diárias.",
  Santidade: "Santidade é pertencer a Deus de modo visível em toda a vida. Não é isolamento orgulhoso, mas separação para refletir o caráter do Senhor no trabalho, nos relacionamentos, nas escolhas e no coração.",
  Serviço: "O serviço cristão inverte a lógica do mundo. Em Cristo, grandeza não é dominar, mas servir; não é buscar reconhecimento, mas levantar outros com humildade e amor.",
  Palavra: "A Palavra de Deus é viva e eficaz porque revela o Senhor, confronta o pecado, consola o aflito e conduz o povo de Deus à obediência. Toda meditação verdadeira começa ouvindo o texto com reverência.",
  Proteção: "A proteção divina não significa ausência de lutas, mas presença fiel de Deus no meio delas. O Senhor guarda a alma, sustenta a fé e conduz Seus filhos mesmo em caminhos difíceis.",
  Identidade: "A identidade cristã é recebida, não construída pelo esforço humano. Em Cristo, somos chamados filhos, povo escolhido e testemunhas da graça que transforma a vida de dentro para fora.",
  Missão: "A missão nasce do coração de Deus. O discípulo não guarda a fé para si, mas vive como testemunha, proclamando com palavras e atitudes que Cristo é Senhor.",
  Generosidade: "A generosidade bíblica revela um coração que confia na provisão de Deus. Quem compreende a graça aprende a repartir sem medo, porque sabe que tudo vem do Senhor.",
  default: "Este tema aponta para a maneira como Deus forma o coração do Seu povo por meio da Palavra. A aplicação correta não nasce de frases soltas, mas de uma leitura reverente, contextual e obediente do texto bíblico."
};

const BOOK_CONTEXTS = {
  Salmos: "Nos Salmos, oração, louvor, dor e esperança aparecem diante de Deus sem máscaras. O texto deve ser lido como expressão da vida de fé que aprende a levar tudo ao Senhor.",
  Provérbios: "Em Provérbios, a sabedoria é apresentada como caminho de vida no temor do Senhor. O texto fala à rotina, às decisões e à formação do caráter diante de Deus.",
  Isaías: "Isaías anuncia juízo, consolo e esperança messiânica. Suas promessas apontam para a soberania de Deus e para a restauração que encontra cumprimento final em Cristo.",
  Mateus: "Mateus apresenta Jesus como o Messias prometido e Rei do Reino de Deus. Seus ensinos chamam o discípulo a uma justiça que nasce do coração transformado.",
  João: "O Evangelho de João revela a identidade de Jesus como o Filho eterno de Deus. Cada sinal e discurso conduz o leitor a crer e a encontrar vida em Seu nome.",
  Romanos: "Romanos expõe o evangelho com profundidade: pecado, graça, justificação, vida no Espírito e prática cristã. O texto deve ser lido à luz da obra redentora de Cristo.",
  Filipenses: "Filipenses foi escrito em meio à prisão, mas transborda alegria, paz e confiança em Cristo. Paulo mostra que a vida cristã encontra firmeza não nas circunstâncias, mas no Senhor.",
  Efésios: "Efésios mostra a riqueza da graça e a nova vida da Igreja em Cristo. A teologia da salvação se transforma em unidade, santidade e vida prática.",
  Tiago: "Tiago aplica a fé à vida concreta. Ele insiste que a verdadeira fé aparece em perseverança, sabedoria, domínio da língua, humildade e obras coerentes com o evangelho.",
  "1 Pedro": "1 Pedro fala a cristãos sob pressão, chamando-os à esperança, santidade e testemunho fiel. O sofrimento é interpretado à luz da obra de Cristo e da glória futura.",
  default: "O contexto bíblico imediato deve ser lido considerando o livro, o tema e o fluxo da revelação. O versículo não é uma frase isolada, mas parte da história de Deus conduzindo Seu povo à fé e à obediência."
};

const COMMENTATORS = [
  "Charles Spurgeon",
  "Matthew Henry",
  "João Calvino",
  "John Stott",
  "Warren Wiersbe",
  "D.A. Carson",
  "F.F. Bruce",
  "Albert Barnes"
];

function parseBook(reference) {
  const match = reference.match(/^(\d?\s?[^\d]+?)\s+\d+/);
  return match ? match[1].trim() : "";
}

function dateForIndex(index) {
  const date = new Date(START_DATE);
  date.setDate(START_DATE.getDate() + index);
  return date;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function cleanTitle(title, index) {
  return String(title || `Devocional Diário ${index + 1}`).replace(/\s+—\s+(Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|Janeiro|Fevereiro|Março|Abril|Maio)$/i, "");
}

function buildContext(dev, index) {
  const book = parseBook(dev.reference);
  const bookContext = BOOK_CONTEXTS[book] || BOOK_CONTEXTS.default;
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;

  return `${dev.reference} deve ser lido dentro do fluxo de ${book || "seu livro bíblico"}. ${bookContext} O versículo escolhido concentra uma verdade que não pode ser separada do caráter de Deus, da resposta de fé esperada do Seu povo e da obra de Cristo como centro da revelação.

No devocional de hoje, o tema é ${String(dev.theme || "Palavra").toLowerCase()}. ${themeInsight} Assim, o contexto bíblico não serve apenas para informar, mas para corrigir leituras superficiais: antes de aplicar o texto à vida, ouvimos o que Deus está revelando sobre Si mesmo, sobre nossa condição e sobre o caminho de obediência que a Palavra apresenta para este dia ${index + 1} do plano anual.`;
}

function buildReflection(dev, index) {
  const day = index + 1;
  const theme = String(dev.theme || "Palavra").toLowerCase();
  const situations = [
    "quando o dia começa cheio de demandas e a alma já se sente atrasada",
    "quando uma conversa difícil precisa ser conduzida com graça e verdade",
    "quando a espera parece longa e a fé é tentada a buscar atalhos",
    "quando o coração está cansado de fazer o que é certo sem ver resultados imediatos",
    "quando uma decisão precisa ser tomada sem que todos os detalhes estejam claros",
    "quando a mente insiste em voltar para preocupações que você já entregou em oração",
    "quando a rotina espiritual corre o risco de virar apenas hábito sem presença de Deus",
    "quando uma ferida antiga tenta determinar a maneira como você enxerga o presente",
    "quando a comparação rouba a gratidão e enfraquece a confiança no cuidado do Pai",
    "quando Deus chama você a obedecer antes de entender completamente o caminho",
    "quando o silêncio de Deus parece maior que as respostas que você esperava",
    "quando o orgulho tenta transformar convicção em dureza de coração",
    "quando a correria rouba a sensibilidade para ouvir a voz do Espírito",
    "quando uma bênção recebida precisa se transformar em louvor, não em autossuficiência",
    "quando o medo tenta diminuir a coragem que nasce da presença do Senhor",
    "quando a Palavra confronta uma área que você preferia não mexer",
    "quando a fé precisa aparecer em atitudes pequenas, não apenas em grandes discursos",
    "quando a vida comum precisa ser vivida como culto diante de Deus"
  ];
  const openings = [
    `${dev.reference} fala com força especial ${situations[index % situations.length]}.`,
    `O devocional de hoje começa no ponto em que a Palavra encontra a vida real: ${situations[index % situations.length]}.`,
    `Há uma verdade em ${dev.reference} que precisa descer do entendimento para a prática, especialmente ${situations[index % situations.length]}.`,
    `Este texto não pede apenas admiração; ele pede resposta, sobretudo ${situations[index % situations.length]}.`,
    `A beleza de ${dev.reference} está em mostrar que Deus se importa com a vida concreta, inclusive ${situations[index % situations.length]}.`,
    `Hoje, a Escritura nos chama a diminuir o ruído interior e ouvir Deus com honestidade ${situations[index % situations.length]}.`
  ];
  const movements = [
    `O primeiro passo é reconhecer que ${theme} não nasce de esforço religioso, mas de um coração reposicionado diante do Senhor.`,
    `A Palavra nos impede de tratar ${theme} como teoria; ela nos chama a uma obediência que pode ser vista nas escolhas do dia.`,
    `Deus usa esse texto para arrancar a fé da superfície e conduzi-la para um lugar de confiança mais profunda.`,
    `Nem sempre a aplicação será grandiosa; muitas vezes ela começa com uma resposta humilde, uma palavra mansa ou uma decisão silenciosa.`,
    `O texto nos lembra que maturidade espiritual aparece quando a verdade bíblica governa reações, prioridades e desejos.`,
    `Antes de perguntar o que Deus fará por nós, o texto nos convida a perguntar o que Deus quer formar em nós.`
  ];
  const endings = [
    `Leve essa Palavra para uma situação específica de hoje e transforme a meditação em obediência.`,
    `Ore antes de agir, aja com simplicidade e deixe que Cristo seja visto em uma atitude concreta.`,
    `Não termine esta leitura apenas informado; termine rendido, disponível e disposto a obedecer.`,
    `Escolha uma prática simples para hoje e permita que ela seja uma resposta sincera ao Senhor.`,
    `O fruto deste devocional será percebido quando a Palavra mudar sua postura diante de pessoas e circunstâncias.`,
    `Que a verdade lida aqui acompanhe suas conversas, decisões e pensamentos até o fim do dia.`
  ];

  return `${openings[index % openings.length]} O texto fala sobre ${theme}, mas não de maneira distante ou decorativa. Ele toca o modo como você responde às pressões, como administra expectativas, como trata pessoas e como mantém a fé quando a rotina tenta ocupar o lugar de Deus.

${movements[index % movements.length]} Por isso, no dia ${day} do plano anual, não leia apenas para concordar; leia para obedecer. Pergunte ao Senhor onde essa verdade precisa ganhar forma: em uma conversa, em uma escolha, em um perdão, em uma renúncia ou em uma atitude de fé. ${endings[index % endings.length]}`;
}

function chooseCommentator(dev, index) {
  const book = parseBook(dev.reference);
  const theme = dev.theme || "Palavra";

  const byBook = {
    Salmos: "Charles Spurgeon",
    Provérbios: "Matthew Henry",
    Isaías: "João Calvino",
    Jeremias: "Matthew Henry",
    Mateus: "John Stott",
    Marcos: "William Lane",
    Lucas: "Joel B. Green",
    João: "D.A. Carson",
    Atos: "F.F. Bruce",
    Romanos: "João Calvino",
    "1 Coríntios": "Gordon Fee",
    "2 Coríntios": "John Stott",
    Gálatas: "Martinho Lutero",
    Efésios: "John Stott",
    Filipenses: "Warren Wiersbe",
    Colossenses: "N.T. Wright",
    "1 Tessalonicenses": "Warren Wiersbe",
    "2 Tessalonicenses": "Warren Wiersbe",
    Hebreus: "F.F. Bruce",
    Tiago: "Douglas Moo",
    "1 Pedro": "Edmund Clowney",
    "2 Pedro": "Michael Green",
    "1 João": "John Stott",
    Apocalipse: "G.K. Beale"
  };

  const byTheme = {
    Oração: "Matthew Henry",
    Graça: "João Calvino",
    Fé: "Martinho Lutero",
    Amor: "John Stott",
    Esperança: "Charles Spurgeon",
    Perseverança: "D.A. Carson",
    Santidade: "J.C. Ryle",
    Sabedoria: "Matthew Henry",
    Serviço: "John Stott",
    Gratidão: "Charles Spurgeon",
    Perdão: "John Stott"
  };

  return byBook[book] || byTheme[theme] || COMMENTATORS[index % COMMENTATORS.length];
}

function buildCommentatorInsight(dev, commentator) {
  const book = parseBook(dev.reference) || "o livro bíblico";
  const theme = String(dev.theme || "Palavra").toLowerCase();
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;

  const perspectives = {
    "Charles Spurgeon": `Comentário inspirado na abordagem pastoral de Charles Spurgeon: ${dev.reference} coloca a alma diante do Deus que sustenta, consola e chama à confiança. Em sua pregação, Spurgeon frequentemente conduzia o leitor do texto para a experiência viva da fé; por isso, sua leitura destacaria que ${theme} não deve permanecer como sentimento religioso, mas tornar-se dependência do Senhor, adoração e descanso nas promessas divinas.`,
    "Matthew Henry": `Comentário inspirado na abordagem de Matthew Henry: ${dev.reference} apresenta doutrina e dever. Henry costumava perguntar o que o texto revela sobre Deus e que resposta exige do crente. Nessa linha, a passagem ensina que ${theme} precisa formar uma vida ordenada pela piedade, com reverência, humildade e obediência nas práticas comuns.`,
    "João Calvino": `Comentário inspirado na abordagem de João Calvino: ${dev.reference} deve ser lido reconhecendo a soberania de Deus e a dependência humana da graça. Calvino enfatizaria que ${theme} não nasce da autossuficiência, mas de um coração governado pela Palavra, submetido à vontade divina e sustentado pela fidelidade do Senhor.`,
    "John Stott": `Comentário inspirado na abordagem de John Stott: ${dev.reference} une fidelidade bíblica e discipulado. Stott destacaria que o texto precisa ser compreendido com a mente e obedecido com a vida. Assim, ${theme} não é uma ideia devocional isolada, mas uma expressão concreta de seguir Cristo no mundo.`,
    "Warren Wiersbe": `Comentário inspirado na abordagem de Warren Wiersbe: ${dev.reference} mostra uma verdade bíblica que precisa funcionar na rotina. Wiersbe tenderia a destacar o movimento do texto para a prática: ${theme} amadurece quando a Palavra começa a orientar pensamentos, escolhas, relacionamentos e reações cotidianas.`,
    "D.A. Carson": `Comentário inspirado na abordagem de D.A. Carson: ${dev.reference} precisa ser interpretado dentro do argumento de ${book}, evitando usos isolados do versículo. Carson chamaria atenção para a relação da passagem com o evangelho, com o caráter de Deus e com a resposta esperada do povo da aliança.`,
    "F.F. Bruce": `Comentário inspirado na abordagem de F.F. Bruce: ${dev.reference} deve ser observado dentro do desenvolvimento bíblico e da vida da Igreja. Bruce destacaria o sentido histórico e apostólico do texto, mostrando que ${theme} é uma verdade revelada para sustentar fé, perseverança e prática cristã sóbria.`,
    "Albert Barnes": `Comentário inspirado na abordagem de Albert Barnes: ${dev.reference} deve ser lido buscando seu sentido claro e suas implicações morais. Barnes destacaria que a Escritura foi dada para corrigir, consolar e dirigir; portanto, ${theme} é resposta objetiva ao que Deus torna evidente no texto.`,
    "Martinho Lutero": `Comentário inspirado na abordagem de Martinho Lutero: ${dev.reference} aponta para a fé que se agarra à promessa de Deus. Lutero ressaltaria que a segurança do crente não repousa em mérito pessoal, mas na Palavra fiel do Senhor; por isso, ${theme} deve brotar da confiança no evangelho.`,
    "J.C. Ryle": `Comentário inspirado na abordagem de J.C. Ryle: ${dev.reference} exige santidade prática. Ryle destacaria que a fé verdadeira não fica invisível; ela aparece em arrependimento, disciplina espiritual, reverência e decisões concretas. O tema de ${theme} deve alcançar hábitos e prioridades.`,
    "Gordon Fee": `Comentário inspirado na abordagem de Gordon Fee: ${dev.reference} deve ser lido considerando a obra do Espírito na comunidade cristã. Fee destacaria que ${theme} não é apenas experiência individual, mas fruto da presença de Deus formando um povo que vive o evangelho em unidade e testemunho.`,
    "Douglas Moo": `Comentário inspirado na abordagem de Douglas Moo: ${dev.reference} mostra que fé e prática caminham juntas. Moo destacaria a lógica ética da passagem: a Palavra recebida com fé precisa produzir obediência verificável. O tema de ${theme} deve ser testado nas decisões e nos relacionamentos reais.`,
    "Edmund Clowney": `Comentário inspirado na abordagem de Edmund Clowney: ${dev.reference} deve ser lido apontando para Cristo e para a identidade do povo de Deus. Clowney destacaria que a passagem forma peregrinos chamados à esperança e fidelidade; ${theme} fortalece a consciência de pertencimento ao Senhor.`,
    "Michael Green": `Comentário inspirado na abordagem de Michael Green: ${dev.reference} chama o cristão a uma fé perseverante e pública. Green destacaria que ${theme} confronta acomodação espiritual e encoraja o crente a viver com clareza, coragem e fidelidade em meio a uma cultura resistente ao evangelho.`,
    "G.K. Beale": `Comentário inspirado na abordagem de G.K. Beale: ${dev.reference} deve ser lido dentro da grande história bíblica, da criação à nova criação. Beale destacaria ecos da revelação e sua consumação em Cristo, mostrando que ${theme} aponta para esperança final e fidelidade presente.`
  };

  return `${perspectives[commentator] || perspectives["Matthew Henry"]} ${themeInsight} Essa leitura enfatiza o sentido bíblico antes da aplicação pessoal: primeiro entendemos o que o texto afirma sobre Deus e Sua obra; depois respondemos com fé, arrependimento e obediência.`;
}

function buildCommentary(dev, index) {
  const commentator = chooseCommentator(dev, index);

  return [
    {
      author: commentator,
      text: buildCommentatorInsight(dev, commentator)
    }
  ];
}

function buildApplication(dev, index) {
  return [
    `Leia ${dev.reference} lentamente e destaque uma palavra ou expressão central do texto.`,
    `Ore perguntando: Senhor, que área da minha vida precisa se alinhar a esta Palavra hoje?`,
    `Pratique uma atitude concreta relacionada ao tema ${String(dev.theme || "Palavra").toLowerCase()} antes de terminar este dia.`
  ];
}

function buildPrayer(dev) {
  return `Senhor Deus, eu recebo a Tua Palavra em ${dev.reference} com reverência. Abre meus olhos para compreender o texto, meu coração para obedecer e minha vida para refletir Cristo. Que este devocional não seja apenas leitura, mas transformação real. Conduz-me hoje no caminho da fé, da humildade e da obediência. Em nome de Jesus. Amém.`;
}

function normalizeDevotional(sourceDev, index) {
  const date = dateForIndex(index);
  const reference = sourceDev.reference || "João 3:16";
  const theme = sourceDev.theme || "Palavra";
  const title = cleanTitle(sourceDev.title, index);

  return {
    id: `dia-${String(index + 1).padStart(3, "0")}-${formatDate(date)}`,
    title,
    theme,
    reference,
    image: sourceDev.image || IMAGES[index % IMAGES.length],
    scripture: sourceDev.scripture || "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...",
    context: buildContext({ ...sourceDev, reference, theme }, index),
    commentary: buildCommentary({ ...sourceDev, reference, theme }, index),
    reflection: buildReflection({ ...sourceDev, reference, theme }, index),
    application: buildApplication({ ...sourceDev, reference, theme }, index),
    prayer: buildPrayer({ ...sourceDev, reference, theme }),
    author: "Pr. Marco Lima"
  };
}

const base = source.length ? source : [];
if (!base.length) {
  throw new Error("Nenhum devocional base encontrado em data/devocionais.json");
}

const result = Array.from({ length: TOTAL_DAYS }, (_, index) => {
  const sourceDev = base[index % base.length];
  return normalizeDevotional(sourceDev, index);
});

fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");

console.log(JSON.stringify({ total: result.length, first: result[0].id, last: result[result.length - 1].id }, null, 2));
