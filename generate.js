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

function buildReflection(dev, index) {
  const day = index + 1;
  const theme = String(dev.theme || "Palavra").toLowerCase();
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;
  const openings = [
    `${dev.reference} nos coloca diante de uma verdade simples e profunda: Deus fala para salvar, corrigir e conduzir o coração de volta a Ele.`,
    `A Palavra de hoje não é apenas uma mensagem bonita; é um chamado de Deus para que a vida inteira se renda a Cristo.`,
    `${dev.reference} nos lembra que a fé verdadeira começa quando paramos de fugir de Deus e ouvimos Sua voz com humildade.`,
    `Este devocional começa com uma pergunta séria: o que esta Palavra revela sobre Deus, sobre o pecado e sobre a necessidade de Cristo?`,
    `A mensagem de hoje aponta para o centro da fé cristã: Jesus Cristo veio buscar e salvar o pecador.`,
    `Deus usa esta leitura para tirar o coração da religiosidade vazia e levá-lo ao evangelho vivo de Cristo Jesus.`
  ];
  const teachings = [
    `O ensinamento principal é que ${theme} não pode ser separado do evangelho. Sem Cristo, até as melhores intenções continuam marcadas pelo pecado; com Cristo, a graça alcança, perdoa e transforma.`,
    `A Escritura ensina que Deus não procura aparência religiosa, mas arrependimento sincero, fé obediente e um coração disposto a ser governado por Jesus.`,
    `O texto mostra que a maior necessidade humana não é apenas alívio para problemas, mas reconciliação com Deus por meio de Jesus, o Filho que morreu e ressuscitou.`,
    `Esta Palavra ensina que Deus é santo e misericordioso. Ele confronta o pecado, mas também oferece perdão ao que se volta para Cristo com fé verdadeira.`,
    `A lição de hoje é clara: ninguém é salvo por mérito, esforço ou tradição. A salvação é graça de Deus recebida pela fé em Jesus Cristo.`,
    `O ensino bíblico aqui chama o coração a sair da superfície. Deus não deseja apenas melhorar comportamentos; Ele quer dar nova vida em Cristo.`
  ];
  const repentanceCalls = [
    `Por isso, examine sua vida com sinceridade. Há pecados escondidos, orgulho, frieza espiritual, incredulidade ou desobediência que precisam ser confessados hoje? Arrependimento não é medo religioso; é voltar para Deus, abandonar o caminho errado e confiar na misericórdia de Jesus.`,
    `O convite ao arrependimento é urgente e amoroso. Não endureça o coração. Confesse aquilo que tem afastado você do Senhor, abandone a falsa segurança e entregue sua vida a Cristo.`,
    `Arrepender-se é parar de justificar o pecado e começar a concordar com Deus. É reconhecer: eu preciso de perdão, preciso de uma nova vida, preciso do Salvador.`,
    `Se esta Palavra confronta você, não fuja. O confronto de Deus é graça. Ele fere o orgulho para curar a alma, revela o pecado para oferecer perdão e chama ao arrependimento para conduzir à vida.`,
    `Hoje é dia de responder. Não adie obediência, não negocie com o pecado e não trate a graça como algo comum. Volte-se para Deus enquanto há tempo.`,
    `O arrependimento verdadeiro começa quando a pessoa deixa de dizer apenas “eu errei” e passa a dizer “Senhor, pequei contra Ti; tem misericórdia de mim e muda meu coração”.`
  ];
  const gospelInvites = [
    `O evangelho é simples: Jesus Cristo morreu na cruz pelos nossos pecados, ressuscitou ao terceiro dia e oferece salvação a todo aquele que crê. Receba esse convite com fé, renda-se a Ele e comece hoje uma caminhada de obediência.`,
    `Cristo não chama você para uma religião sem vida, mas para reconciliação com Deus. Creia em Jesus, entregue seu coração a Ele e receba pela graça o perdão que você jamais conseguiria comprar.`,
    `A salvação está em Jesus. Ele é o caminho, a verdade e a vida. Se você ainda não se entregou a Cristo, faça isso hoje: confesse seus pecados, creia no Salvador e siga-O com sinceridade.`,
    `O convite de Deus é claro: venha a Cristo. Não venha perfeito; venha arrependido. Não venha confiando em si mesmo; venha confiando na cruz e na ressurreição do Senhor Jesus.`,
    `Jesus salva pecadores, restaura quebrantados e dá nova vida. Hoje, abra mão da autossuficiência e diga pela fé: Senhor Jesus, eu preciso de Ti; salva-me e governa minha vida.`,
    `A boa notícia é esta: quem se arrepende e crê em Jesus encontra perdão, paz com Deus e vida eterna. Essa é a esperança do evangelho para este dia.`
  ];

  return `${openings[index % openings.length]} No dia ${day} do plano anual, o tema de ${theme} deve levar você a olhar para Cristo, não apenas para si mesmo. ${themeInsight}

${teachings[index % teachings.length]} A reflexão cristã não termina em pensamento positivo; ela conduz ao Senhorio de Jesus, à cruz, à ressurreição e à nova vida que o Espírito Santo produz no coração.

Aprenda esta verdade com simplicidade: Deus não veio apenas ajustar alguns hábitos, mas resgatar a pessoa inteira. O pecado separa, engana e endurece; a graça de Cristo perdoa, reconcilia e ensina um novo caminho. Quem crê em Jesus não recebe licença para continuar igual, mas poder para nascer de novo e viver como filho de Deus.

Este é o evangelho: a salvação não nasce do desempenho humano, mas da obra perfeita de Cristo. Ele tomou sobre Si a culpa do pecado, venceu a morte e chama cada pessoa a responder com arrependimento e fé.

${repentanceCalls[index % repentanceCalls.length]}

${gospelInvites[index % gospelInvites.length]}`;
}

function buildApplication(dev, index) {
  return [
    `Leia ${dev.reference} lentamente e destaque uma palavra ou expressão central do texto.`,
    `Confesse a Deus um pecado, resistência ou frieza espiritual que esta Palavra revelou.`,
    `Declare sua fé em Jesus Cristo e pratique hoje uma atitude concreta de arrependimento e obediência.`
  ];
}

function buildPrayer(dev) {
  return `Senhor Deus, eu recebo a Tua Palavra em ${dev.reference} com reverência. Reconheço que preciso de arrependimento, perdão e nova vida. Creio que Jesus Cristo morreu pelos meus pecados e ressuscitou para me salvar. Lava meu coração, governa minha vida e conduz-me em obediência simples ao Teu evangelho. Em nome de Jesus. Amém.`;
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
