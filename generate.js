#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data/devocionais.json");
const source = JSON.parse(fs.readFileSync(filePath, "utf8"));
const imageDir = path.join(__dirname, "assets/devotional-images");

const START_DATE = new Date(2026, 5, 1);
const TOTAL_DAYS = 365;

const THEME_VISUALS = {
  Ansiedade: { symbol: "dove", colors: ["#6f8fa8", "#d9e7ef"], words: "Entrega e paz" },
  Amor: { symbol: "heart", colors: ["#8f4d4d", "#f3d2c5"], words: "Amor de Cristo" },
  Coragem: { symbol: "mountain", colors: ["#405f4f", "#d6c3a5"], words: "Firmeza no Senhor" },
  Descanso: { symbol: "shepherd", colors: ["#5f8069", "#e5dfc7"], words: "Descanso em Cristo" },
  Esperança: { symbol: "sunrise", colors: ["#c98635", "#f5dfae"], words: "Esperança viva" },
  Fé: { symbol: "cross", colors: ["#465f82", "#d8c49a"], words: "Crer e seguir" },
  Força: { symbol: "mountain", colors: ["#3f4d3f", "#c9b57e"], words: "Força na graça" },
  Gratidão: { symbol: "sunrise", colors: ["#b3783d", "#f0d6a3"], words: "Graça recebida" },
  Oração: { symbol: "dove", colors: ["#5d6f8f", "#ddd7c7"], words: "Comunhão com Deus" },
  Paz: { symbol: "dove", colors: ["#5f8276", "#d9ece5"], words: "Paz com Deus" },
  Perdão: { symbol: "cross", colors: ["#7a5a75", "#e5d5df"], words: "Perdão na cruz" },
  Perseverança: { symbol: "path", colors: ["#6b704a", "#d8d1a6"], words: "Perseverar em fé" },
  Sabedoria: { symbol: "lamp", colors: ["#7c6335", "#ead8a6"], words: "Sabedoria do alto" },
  Santidade: { symbol: "flame", colors: ["#7d4738", "#ecd0b5"], words: "Vida separada" },
  Serviço: { symbol: "hands", colors: ["#506f67", "#d3e1d7"], words: "Servir como Cristo" },
  Palavra: { symbol: "bible", colors: ["#4c5f3c", "#ded6b8"], words: "Palavra viva" },
  Proteção: { symbol: "shield", colors: ["#3f5f67", "#c9dce0"], words: "Guardado por Deus" },
  Identidade: { symbol: "cross", colors: ["#654c75", "#ded1e7"], words: "Filhos em Cristo" },
  Missão: { symbol: "path", colors: ["#786234", "#e6d29b"], words: "Ide e anunciai" },
  Generosidade: { symbol: "hands", colors: ["#6e7d45", "#dfe8bd"], words: "Graça que reparte" },
  Luz: { symbol: "sunrise", colors: ["#b58a35", "#f4e7bc"], words: "Cristo ilumina" },
  Pastor: { symbol: "shepherd", colors: ["#55735d", "#dfd9bd"], words: "O Bom Pastor" },
  Guia: { symbol: "path", colors: ["#596f8a", "#d9dec8"], words: "Caminho de Deus" },
  Desejos: { symbol: "heart", colors: ["#7d5c67", "#ead4d8"], words: "Coração rendido" },
  Carga: { symbol: "hands", colors: ["#6b6757", "#ded6c2"], words: "Entrega ao Senhor" },
  Perfeição: { symbol: "cross", colors: ["#5d6347", "#dfd6ab"], words: "Cristo completa" },
  Bondade: { symbol: "sunrise", colors: ["#9a723a", "#ead8a8"], words: "Bondade do Senhor" },
  Obediência: { symbol: "path", colors: ["#53674d", "#d8d9b8"], words: "Seguir Jesus" },
  Provisão: { symbol: "hands", colors: ["#6b7a47", "#e2ddb5"], words: "Deus provê" },
  Renovação: { symbol: "flame", colors: ["#4f7467", "#d6e2d5"], words: "Novo coração" },
  Restauração: { symbol: "sunrise", colors: ["#80633f", "#e8d1a8"], words: "Deus restaura" },
  Glória: { symbol: "sunrise", colors: ["#8a6731", "#f2dda4"], words: "Glória de Deus" },
  Espírito: { symbol: "flame", colors: ["#6d5d82", "#ddd3ea"], words: "Vida no Espírito" },
  Dízimos: { symbol: "hands", colors: ["#627146", "#e0dcb8"], words: "Fidelidade e entrega" },
  Testemunho: { symbol: "lamp", colors: ["#5a6f72", "#d9e3de"], words: "Luz diante do mundo" },
  Prioridade: { symbol: "cross", colors: ["#556b4e", "#ded7b9"], words: "Reino em primeiro lugar" },
  Discipulado: { symbol: "path", colors: ["#4f6355", "#d8deca"], words: "Tomar a cruz" },
  Poder: { symbol: "mountain", colors: ["#465b6e", "#d5d7c4"], words: "Deus pode todas as coisas" },
  Paciência: { symbol: "path", colors: ["#687055", "#e2d9b8"], words: "Esperar em Deus" },
  Convite: { symbol: "cross", colors: ["#725a7b", "#e4d5e8"], words: "Cristo à porta" },
  Consolação: { symbol: "dove", colors: ["#637f8b", "#dce7e9"], words: "Consolo eterno" },
  Lealdade: { symbol: "heart", colors: ["#6c6f4e", "#ded8b6"], words: "Aliança fiel" },
  Coração: { symbol: "heart", colors: ["#7c4f57", "#ead4d2"], words: "Deus vê o coração" },
  "O Dobro do Teu Espírito": { symbol: "flame", colors: ["#6c5678", "#ded1e4"], words: "Unção para servir" },
  "Jejuamos e Pedimos": { symbol: "hands", colors: ["#5d6878", "#d8dde5"], words: "Busca e dependência" },
  Alegria: { symbol: "sunrise", colors: ["#b47a30", "#f0d69a"], words: "Alegria do Senhor" },
  Propósito: { symbol: "path", colors: ["#596c54", "#d8dfc4"], words: "Chamado de Deus" },
  Tempo: { symbol: "sunrise", colors: ["#7d7150", "#e5d9b6"], words: "Tudo no tempo de Deus" },
  Temor: { symbol: "lamp", colors: ["#654f3a", "#e3d0aa"], words: "Reverência ao Senhor" },
  default: { symbol: "cross", colors: ["#536b57", "#e7dcc0"], words: "Evangelho de Jesus" }
};

const SYMBOLS = {
  cross: `<path d="M589 210h62v198h174v62H651v310h-62V470H415v-62h174z" fill="currentColor" opacity=".9"/>`,
  dove: `<path d="M412 534c115-10 210-66 284-170-25 108-79 190-160 246 58 11 109 2 156-26-64 74-147 106-250 91-72-11-132-44-180-100 50 21 100 8 150-41zm120-66c-74-45-127-98-159-160 88 31 167 78 239 141-25 8-52 14-80 19z" fill="currentColor" opacity=".88"/>`,
  heart: `<path d="M620 728S352 574 352 398c0-77 55-133 126-133 55 0 92 31 142 88 50-57 87-88 142-88 71 0 126 56 126 133 0 176-268 330-268 330z" fill="currentColor" opacity=".86"/>`,
  mountain: `<path d="M250 710l236-330 106 146 74-96 264 280H250zm236-206l-82 115h185l-103-115z" fill="currentColor" opacity=".84"/>`,
  sunrise: `<path d="M260 665h720v46H260v-46zm95-70c42-110 145-187 265-187s223 77 265 187H355zm265-286v-96h42v96h-42zm-221 72l-68-68 30-30 68 68-30 30zm442 0l-30-30 68-68 30 30-68 68z" fill="currentColor" opacity=".86"/>`,
  shepherd: `<path d="M372 694c70-122 151-210 242-264 92-55 184-74 276-57-74 31-139 74-195 129 69 18 123 58 162 120-102-24-188-18-258 19-71 37-143 55-227 53zm248-244c-43-64-43-122 0-174 43 52 43 110 0 174z" fill="currentColor" opacity=".82"/>`,
  path: `<path d="M322 720c75-92 133-145 174-159 42-14 88-5 139 27 50 32 99 41 145 27 45-14 92-55 140-123v130c-45 50-91 82-138 96-69 21-139 8-208-38-33-22-65-26-95-12-30 13-70 52-119 116l-38-64zM346 382c49-58 101-92 156-102 56-10 109 7 160 51 37 32 74 43 112 33 37-10 80-46 129-108v115c-51 51-103 81-157 89-54 8-105-10-154-54-32-29-65-39-100-30-35 8-75 41-120 98l-26-92z" fill="currentColor" opacity=".82"/>`,
  lamp: `<path d="M462 714h316v52H462v-52zm80-80h156v50H542v-50zm-52-293c0-85 59-147 130-147s130 62 130 147c0 61-34 105-70 143-28 29-43 55-43 95h-34c0-40-15-66-43-95-36-38-70-82-70-143zm130-78c-37 0-68 34-68 78 0 35 18 62 45 91 8 9 16 18 23 28 7-10 15-19 23-28 27-29 45-56 45-91 0-44-31-78-68-78z" fill="currentColor" opacity=".86"/>`,
  flame: `<path d="M622 748c-104 0-177-74-177-172 0-79 46-128 89-175 35-38 68-73 69-121 85 64 150 151 94 267 46-27 68-73 68-135 58 49 88 108 88 172 0 93-89 164-231 164z" fill="currentColor" opacity=".84"/>`,
  hands: `<path d="M330 586c94 20 159 51 196 94 22 26 48 39 80 39h189c-25 36-63 55-114 55H536c-57 0-100-19-130-57l-76-97v-34zm580 0v34l-76 97c-30 38-73 57-130 57h-41c38-21 66-49 84-84 15-30 8-59-18-88-37 5-72 2-105-10-55-20-102-56-141-108 90 6 168 30 234 72 41 26 105 36 193 30z" fill="currentColor" opacity=".82"/>`,
  bible: `<path d="M382 255h380c60 0 96 36 96 96v379H438c-60 0-96-36-96-96V295c0-22 18-40 40-40zm46 76v303c0 15 11 26 26 26h318V351c0-15-11-26-26-26H428zm155 56h54v84h84v54h-84v84h-54v-84h-84v-54h84v-84z" fill="currentColor" opacity=".84"/>`,
  shield: `<path d="M620 760c-142-69-229-181-229-349V284l229-80 229 80v127c0 168-87 280-229 349zm0-75c102-57 163-144 163-274v-80l-163-57-163 57v80c0 130 61 217 163 274z" fill="currentColor" opacity=".86"/>`
};

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

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageName(index, title) {
  const slug = String(title || "devocional")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 46);
  return `dia-${String(index + 1).padStart(3, "0")}-${slug || "devocional"}.svg`;
}

function buildImageSvg(dev, index) {
  const visual = THEME_VISUALS[dev.theme] || THEME_VISUALS.default;
  const [primary, secondary] = visual.colors;
  const symbol = SYMBOLS[visual.symbol] || SYMBOLS.cross;
  const day = String(index + 1).padStart(3, "0");
  const title = escapeXml(cleanTitle(dev.title, index));
  const reference = escapeXml(dev.reference || "João 3:16");
  const theme = escapeXml(dev.theme || "Palavra");
  const words = escapeXml(visual.words);
  const rotation = (index % 13) - 6;
  const circleX = 160 + ((index * 37) % 160);
  const circleY = 120 + ((index * 53) % 120);
  const lineOffset = (index * 29) % 220;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-labelledby="title desc">
  <title id="title">${title} - ${reference}</title>
  <desc id="desc">Arte devocional única sobre ${theme}, ${words}, baseada em ${reference}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${primary}"/>
      <stop offset="1" stop-color="${secondary}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="70%">
      <stop offset="0" stop-color="#fff8dc" stop-opacity=".45"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#1f231d" flood-opacity=".22"/>
    </filter>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>
  <g opacity=".16" stroke="#fff" stroke-width="2">
    <path d="M${-200 + lineOffset} 120 C 150 30, 330 210, 590 120 S 990 40, 1320 150" fill="none"/>
    <path d="M${-80 + lineOffset} 700 C 230 600, 390 740, 650 650 S 1030 590, 1280 710" fill="none"/>
  </g>
  <circle cx="${circleX}" cy="${circleY}" r="180" fill="#fff" opacity=".12"/>
  <circle cx="1010" cy="610" r="230" fill="#2b312a" opacity=".10"/>
  <g transform="rotate(${rotation} 620 470)" color="#ffffff" filter="url(#soft)">${symbol}</g>
  <rect x="76" y="70" width="1048" height="660" rx="44" fill="#fff" opacity=".13" stroke="#fff" stroke-opacity=".26"/>
  <text x="96" y="130" fill="#fff" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="700" letter-spacing="3">DEVOCIONAL DIÁRIO ${day}</text>
  <text x="96" y="188" fill="#fff" font-family="Arial, sans-serif" font-size="34" font-weight="700">${reference}</text>
  <text x="96" y="590" fill="#fff" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700">${title}</text>
  <text x="96" y="646" fill="#fff" font-family="Arial, sans-serif" font-size="26" opacity=".92">${theme} • ${words}</text>
  <text x="96" y="696" fill="#fff" font-family="Arial, sans-serif" font-size="22" opacity=".82">Pr. Marco Lima</text>
</svg>`;
}

function writeDevotionalImage(dev, index) {
  fs.mkdirSync(imageDir, { recursive: true });
  const name = imageName(index, dev.title);
  fs.writeFileSync(path.join(imageDir, name), buildImageSvg(dev, index), "utf8");
  return `assets/devotional-images/${name}`;
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
    image: writeDevotionalImage({ ...sourceDev, title, reference, theme }, index),
    imageAlt: `Arte devocional única sobre ${theme}, baseada em ${reference}, para ${title}.`,
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

fs.rmSync(imageDir, { recursive: true, force: true });

const result = Array.from({ length: TOTAL_DAYS }, (_, index) => {
  const sourceDev = base[index % base.length];
  return normalizeDevotional(sourceDev, index);
});

fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");

console.log(JSON.stringify({ total: result.length, first: result[0].id, last: result[result.length - 1].id }, null, 2));
