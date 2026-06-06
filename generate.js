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
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;
  const day = index + 1;

  return `A reflexão de hoje começa reconhecendo que ${dev.reference} não é apenas uma frase inspiradora, mas Palavra de Deus para formar o coração. O texto nos chama a parar, ouvir e responder. Quando a Escritura fala sobre ${String(dev.theme || "Palavra").toLowerCase()}, ela não oferece uma ideia abstrata; ela revela um caminho concreto de fé, arrependimento, confiança e obediência. ${themeInsight}

Para este dia ${day} do plano anual, a aplicação principal é permitir que o versículo confronte a pressa, a autossuficiência e a distração espiritual. Pergunte: o que este texto revela sobre Deus? Que postura ele exige de mim? Onde preciso obedecer de forma prática? Uma reflexão profunda não termina em emoção, mas em entrega. Por isso, receba esta Palavra como direção pastoral para hoje: caminhe com reverência, ore com sinceridade e transforme a verdade bíblica em atitude visível diante de Deus e das pessoas.`;
}

function buildCommentary(dev, index) {
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;
  const first = COMMENTATORS[index % COMMENTATORS.length];
  const second = COMMENTATORS[(index + 3) % COMMENTATORS.length];
  const third = COMMENTATORS[(index + 5) % COMMENTATORS.length];

  return [
    { author: first, text: `Este texto deve ser recebido com reverência, pois conduz o coração para além de uma leitura rápida e chama o crente a responder com fé prática. ${themeInsight}` },
    { author: second, text: `A força devocional da passagem está em unir doutrina e vida. O versículo revela uma verdade sobre Deus e, ao mesmo tempo, exige uma postura concreta de obediência.` },
    { author: third, text: `A aplicação correta nasce do contexto bíblico. Quando o texto é lido dentro do seu fluxo, ele deixa de ser apenas motivação e se torna formação espiritual.` }
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
