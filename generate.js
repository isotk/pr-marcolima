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
  Rute: "Rute mostra a providência de Deus agindo em meio à perda, lealdade e redenção familiar. A história prepara o caminho da linhagem davídica e aponta para a fidelidade do Senhor em detalhes comuns da vida.",
  "1 Samuel": "1 Samuel narra a transição de Israel para a monarquia e destaca que Deus vê o coração, levanta líderes e governa acima das aparências humanas.",
  "2 Samuel": "2 Samuel acompanha o reinado de Davi, mostrando tanto a fidelidade da aliança quanto as consequências do pecado. O texto aponta para a necessidade de um Rei justo e fiel.",
  "1 Reis": "1 Reis mostra a glória e a queda progressiva da monarquia, contrastando sabedoria, idolatria, profecia e fidelidade ao Senhor.",
  "2 Reis": "2 Reis expõe as consequências espirituais da infidelidade de Israel e Judá, mas também preserva testemunhos da graça e do poder de Deus em meio ao declínio.",
  Esdras: "Esdras trata do retorno do exílio, da restauração do culto e da centralidade da Palavra para reconstruir a identidade espiritual do povo de Deus.",
  Neemias: "Neemias mostra reconstrução física e espiritual. Os muros importam, mas a restauração mais profunda acontece quando o povo volta a ouvir e obedecer à Palavra.",
  Ester: "Ester revela a providência silenciosa de Deus preservando Seu povo em ambiente hostil. Mesmo quando o nome de Deus não aparece, Sua mão conduz a história.",
  Salmos: "Nos Salmos, oração, louvor, dor e esperança aparecem diante de Deus sem máscaras. O texto deve ser lido como expressão da vida de fé que aprende a levar tudo ao Senhor.",
  Provérbios: "Em Provérbios, a sabedoria é apresentada como caminho de vida no temor do Senhor. O texto fala à rotina, às decisões e à formação do caráter diante de Deus.",
  Eclesiastes: "Eclesiastes examina a vida debaixo do sol e confronta a vaidade de buscar sentido longe de Deus. Sua conclusão chama ao temor do Senhor e à obediência.",
  Isaías: "Isaías anuncia juízo, consolo e esperança messiânica. Suas promessas apontam para a soberania de Deus e para a restauração que encontra cumprimento final em Cristo.",
  Jeremias: "Jeremias denuncia a infidelidade do povo e anuncia juízo, mas também preserva promessas de restauração, nova aliança e esperança fundada na fidelidade de Deus.",
  Ezequiel: "Ezequiel fala a um povo exilado, mostrando a glória de Deus, a gravidade do pecado e a promessa de renovação espiritual por iniciativa do Senhor.",
  Daniel: "Daniel apresenta fidelidade em ambiente pagão e revela que Deus governa reinos, tempos e autoridades. O livro chama à coragem, santidade e confiança soberana.",
  Joel: "Joel usa a crise nacional para chamar o povo ao arrependimento e anunciar restauração, derramamento do Espírito e o Dia do Senhor.",
  Habacuque: "Habacuque registra o diálogo honesto entre o profeta e Deus diante da injustiça. O livro ensina que o justo vive pela fé mesmo sem compreender todo o processo divino.",
  Ageu: "Ageu chama o povo pós-exílio a reorganizar prioridades e reconstruir o templo, mostrando que a glória de Deus deve ocupar o centro da vida comunitária.",
  Zacarias: "Zacarias encoraja o povo restaurado com visões de esperança, purificação e promessa messiânica, lembrando que a obra de Deus avança pelo Seu Espírito.",
  Malaquias: "Malaquias confronta culto negligente, infidelidade e frieza espiritual, chamando o povo a voltar ao Senhor com reverência e aliança renovada.",
  Mateus: "Mateus apresenta Jesus como o Messias prometido e Rei do Reino de Deus. Seus ensinos chamam o discípulo a uma justiça que nasce do coração transformado.",
  João: "O Evangelho de João revela a identidade de Jesus como o Filho eterno de Deus. Cada sinal e discurso conduz o leitor a crer e a encontrar vida em Seu nome.",
  Romanos: "Romanos expõe o evangelho com profundidade: pecado, graça, justificação, vida no Espírito e prática cristã. O texto deve ser lido à luz da obra redentora de Cristo.",
  Filipenses: "Filipenses foi escrito em meio à prisão, mas transborda alegria, paz e confiança em Cristo. Paulo mostra que a vida cristã encontra firmeza não nas circunstâncias, mas no Senhor.",
  Efésios: "Efésios mostra a riqueza da graça e a nova vida da Igreja em Cristo. A teologia da salvação se transforma em unidade, santidade e vida prática.",
  "1 Tessalonicenses": "1 Tessalonicenses encoraja uma igreja jovem a permanecer firme, santa e esperançosa enquanto aguarda a volta de Cristo. As exortações finais mostram como a fé deve aparecer na vida comunitária cotidiana.",
  "2 Tessalonicenses": "2 Tessalonicenses corrige confusões sobre o fim dos tempos e fortalece a igreja para perseverar com discernimento, trabalho fiel e esperança na justiça de Deus.",
  "1 Coríntios": "1 Coríntios corrige uma igreja marcada por divisões, orgulho e mau uso dos dons. Paulo mostra que maturidade cristã exige santidade, amor e ordem no corpo de Cristo.",
  "2 Coríntios": "2 Coríntios revela o ministério cristão sob fraqueza, sofrimento e consolação. Paulo mostra que o poder de Deus se manifesta em vasos frágeis para que a glória seja do Senhor.",
  Gálatas: "Gálatas defende a liberdade do evangelho contra toda tentativa de acrescentar mérito humano à graça. A fé em Cristo produz vida no Espírito, não escravidão religiosa.",
  Colossenses: "Colossenses exalta a supremacia de Cristo sobre toda a criação e sobre a vida da Igreja. A nova vida cristã nasce de estar unido Àquele que é antes de todas as coisas.",
  Hebreus: "Hebreus apresenta Cristo como superior aos anjos, a Moisés, ao sacerdócio antigo e aos sacrifícios da antiga aliança. O livro chama os crentes a perseverar olhando para Jesus.",
  Tiago: "Tiago aplica a fé à vida concreta. Ele insiste que a verdadeira fé aparece em perseverança, sabedoria, domínio da língua, humildade e obras coerentes com o evangelho.",
  "1 Pedro": "1 Pedro fala a cristãos sob pressão, chamando-os à esperança, santidade e testemunho fiel. O sofrimento é interpretado à luz da obra de Cristo e da glória futura.",
  "2 Pedro": "2 Pedro alerta contra falsos ensinos e chama a igreja a crescer na graça e no conhecimento de Cristo, mantendo esperança firme na promessa do Senhor.",
  "1 João": "1 João foi escrito para fortalecer a certeza da fé, distinguir verdade e erro, e mostrar que comunhão com Deus aparece em amor, obediência e fidelidade a Cristo.",
  Judas: "Judas exorta os crentes a batalhar pela fé entregue aos santos, resistindo a distorções do evangelho e permanecendo firmes na misericórdia de Deus.",
  Apocalipse: "Apocalipse revela Cristo exaltado, confronta igrejas reais em sua fidelidade ou frieza, e aponta para a consumação da história quando Deus julgará o mal e fará novas todas as coisas.",
  default: "O contexto bíblico imediato deve ser lido considerando o livro, o tema e o fluxo da revelação. O versículo não é uma frase isolada, mas parte da história de Deus conduzindo Seu povo à fé e à obediência."
};

const BOOK_SETTINGS = {
  Salmos: "O livro nasce da vida de adoração de Israel e reúne orações, cânticos, confissões e lamentos usados pelo povo de Deus em culto e caminhada diária.",
  Provérbios: "A coleção de sabedoria de Israel ensina a viver diante de Deus nas escolhas comuns: fala, trabalho, família, dinheiro, amizades e domínio do coração.",
  Isaías: "O profeta fala a um povo dividido entre pecado, juízo e esperança, anunciando que Deus disciplina, consola e promete restauração por meio do Servo do Senhor.",
  Jeremias: "Jeremias ministra em um tempo de crise espiritual e queda nacional, chamando o povo ao arrependimento e apontando para a fidelidade de Deus mesmo em meio ao juízo.",
  Mateus: "Mateus apresenta Jesus como o Messias prometido, o Rei que cumpre as Escrituras e chama Seus discípulos a viverem a justiça do Reino.",
  João: "João organiza sinais e discursos para revelar que Jesus é o Filho eterno de Deus, a Palavra encarnada, e para conduzir o leitor à fé que gera vida.",
  Romanos: "Romanos expõe a lógica do evangelho: culpa universal, justificação pela fé, vida no Espírito e uma obediência que nasce da misericórdia de Deus.",
  Filipenses: "Filipenses é uma carta marcada por alegria e firmeza em Cristo, escrita por Paulo em prisão, mostrando que a fé permanece quando as circunstâncias são adversas.",
  Efésios: "Efésios revela a identidade da Igreja em Cristo e mostra como a graça recebida se transforma em unidade, santidade, amor e batalha espiritual.",
  Tiago: "Tiago confronta uma fé apenas verbal e mostra que a verdadeira confiança em Deus aparece em perseverança, sabedoria, domínio da língua e obras coerentes.",
  "1 Tessalonicenses": "Paulo escreve a uma igreja jovem, encorajando santidade, esperança na volta de Cristo e fidelidade em meio a pressões externas.",
  "1 Coríntios": "A carta corrige uma comunidade cheia de dons, mas marcada por divisões, orgulho e imaturidade, mostrando que tudo deve ser governado pelo amor e pela santidade.",
  "1 Pedro": "Pedro escreve a cristãos como peregrinos, ensinando-os a sofrer com esperança, viver em santidade e testemunhar Cristo em uma sociedade hostil.",
  Apocalipse: "Apocalipse consola igrejas pressionadas, revelando Cristo exaltado, o juízo de Deus e a vitória final do Cordeiro sobre todo mal.",
  default: "O livro deve ser lido dentro da história maior da redenção, percebendo o que o texto revela sobre Deus, sobre o ser humano e sobre a resposta de fé esperada do povo do Senhor."
};

const BOOK_GENRES = {
  Rute: "narrativa histórica de redenção familiar",
  "1 Samuel": "narrativa histórica e teológica",
  "2 Samuel": "narrativa histórica e aliança davídica",
  "1 Reis": "história profética da monarquia",
  "2 Reis": "história profética do declínio de Israel e Judá",
  Esdras: "narrativa de restauração pós-exílio",
  Neemias: "memória de reconstrução e reforma espiritual",
  Ester: "narrativa de providência e preservação",
  Salmos: "poesia e oração",
  Provérbios: "sabedoria prática",
  Eclesiastes: "sabedoria reflexiva",
  Isaías: "profecia",
  Jeremias: "profecia de juízo e esperança",
  Ezequiel: "profecia exílica e visão da glória de Deus",
  Daniel: "narrativa de fidelidade e visão apocalíptica",
  Joel: "profecia de arrependimento e restauração",
  Habacuque: "diálogo profético e teologia da fé",
  Ageu: "profecia pós-exílica de reconstrução",
  Zacarias: "profecia visionária e messiânica",
  Malaquias: "profecia de aliança e correção espiritual",
  Mateus: "evangelho narrativo e ensino de Jesus",
  Marcos: "evangelho narrativo",
  Lucas: "evangelho narrativo",
  João: "evangelho teológico",
  Atos: "narrativa da expansão da igreja",
  Romanos: "carta doutrinária",
  Filipenses: "carta pastoral",
  Efésios: "carta doutrinária e prática",
  "1 Tessalonicenses": "carta pastoral e escatológica",
  "2 Tessalonicenses": "carta pastoral e escatológica",
  "1 Coríntios": "carta pastoral corretiva",
  "2 Coríntios": "carta pastoral e defesa apostólica",
  Gálatas: "carta doutrinária e polêmica",
  Colossenses: "carta cristológica e pastoral",
  Hebreus: "sermão/carta de exortação",
  Tiago: "exortação sapiencial cristã",
  "1 Pedro": "carta de esperança em sofrimento",
  "2 Pedro": "carta de advertência e perseverança",
  "1 João": "carta pastoral sobre certeza e comunhão",
  Judas: "exortação contra falso ensino",
  Apocalipse: "profecia apocalíptica",
  default: "texto bíblico"
};

const CONTEXT_OPENINGS = [
  "Para entender bem esta passagem, é importante observar primeiro o lugar que ela ocupa no livro.",
  "O contexto desta leitura impede uma aplicação apressada e ajuda a ouvir o texto com mais fidelidade.",
  "Antes de transformar este versículo em conselho pessoal, precisamos escutar sua ênfase dentro da própria Escritura.",
  "Esta passagem ganha profundidade quando lida no movimento do livro, e não como uma frase isolada.",
  "O pano de fundo bíblico desta leitura mostra que Deus está formando Seu povo por meio de uma verdade específica.",
  "A força deste texto aparece quando percebemos quem está sendo confrontado, consolado ou instruído pela Palavra."
];

const CONTEXT_BRIDGES = [
  "A passagem concentra uma resposta de fé que nasce do caráter de Deus, não de mero entusiasmo humano.",
  "O texto aproxima doutrina e vida prática: aquilo que Deus revela precisa moldar aquilo que o crente faz.",
  "A ênfase bíblica aqui não é apenas informar, mas reorganizar desejos, prioridades e atitudes diante do Senhor.",
  "O versículo aponta para uma verdade que corrige leituras superficiais e chama a uma obediência concreta.",
  "A aplicação correta nasce quando o leitor percebe a tensão do texto e se submete à direção que Deus oferece.",
  "O centro da passagem não é a experiência humana em si, mas Deus agindo, falando e chamando Seu povo a responder."
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
  const bookSetting = BOOK_SETTINGS[book] || BOOK_SETTINGS.default;
  const genre = BOOK_GENRES[book] || BOOK_GENRES.default;
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;
  const opening = CONTEXT_OPENINGS[index % CONTEXT_OPENINGS.length];
  const bridge = CONTEXT_BRIDGES[index % CONTEXT_BRIDGES.length];
  const theme = String(dev.theme || "Palavra").toLowerCase();

  return `${opening} ${dev.reference} está em ${book || "um livro bíblico"}, dentro de um ambiente de ${genre}. ${bookSetting} ${bookContext}

Dentro desse cenário, o tema de ${theme} não aparece como uma ideia solta. ${bridge} ${themeInsight} Por isso, o contexto bíblico deste devocional deve ser lido em três movimentos: primeiro, o que Deus revela sobre Si mesmo; segundo, que resposta Ele exige do Seu povo; terceiro, como essa verdade encontra seu cumprimento e direção final em Cristo.

Para o dia ${index + 1} do plano anual, a leitura pastoral é esta: antes de perguntar “como isso me ajuda?”, pergunte “o que este texto está dizendo no seu próprio lugar na Bíblia?”. Só depois disso a aplicação se torna saudável, profunda e fiel.`;
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
