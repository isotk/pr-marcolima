#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data/devocionais.json");
const source = JSON.parse(fs.readFileSync(filePath, "utf8"));
const biblePath = path.join(__dirname, "data/biblia-almeida-livre.json");
const bible = JSON.parse(fs.readFileSync(biblePath, "utf8"));
const imageDir = path.join(__dirname, "assets/devotional-images");

const START_DATE = new Date(2026, 5, 1);
const TOTAL_DAYS = 365;

const BOOK_NAMES = {
  Gen: "Gênesis", Exod: "Êxodo", Lev: "Levítico", Num: "Números", Deut: "Deuteronômio",
  Josh: "Josué", Judg: "Juízes", Ruth: "Rute", "1Sam": "1 Samuel", "2Sam": "2 Samuel",
  "1Kgs": "1 Reis", "2Kgs": "2 Reis", Ezra: "Esdras", Neh: "Neemias", Esth: "Ester",
  Job: "Jó", Ps: "Salmos", Prov: "Provérbios", Eccl: "Eclesiastes", Isa: "Isaías",
  Jer: "Jeremias", Lam: "Lamentações", Ezek: "Ezequiel", Dan: "Daniel", Hos: "Oséias",
  Joel: "Joel", Amos: "Amós", Obad: "Obadias", Jonah: "Jonas", Mic: "Miquéias",
  Nah: "Naum", Hab: "Habacuque", Zeph: "Sofonias", Hag: "Ageu", Zech: "Zacarias", Mal: "Malaquias",
  Matt: "Mateus", Mark: "Marcos", Luke: "Lucas", John: "João", Acts: "Atos", Rom: "Romanos",
  "1Cor": "1 Coríntios", "2Cor": "2 Coríntios", Gal: "Gálatas", Eph: "Efésios", Phil: "Filipenses",
  Col: "Colossenses", "1Thess": "1 Tessalonicenses", "2Thess": "2 Tessalonicenses", "1Tim": "1 Timóteo",
  "2Tim": "2 Timóteo", Titus: "Tito", Phlm: "Filemom", Heb: "Hebreus", Jas: "Tiago",
  "1Pet": "1 Pedro", "2Pet": "2 Pedro", "1John": "1 João", "2John": "2 João", "3John": "3 João",
  Jude: "Judas", Rev: "Apocalipse"
};

const DEVOTIONAL_BOOK_ORDER = [
  "Ps", "Prov", "Isa", "John", "Matt", "Luke", "Rom", "Eph", "Phil", "Col", "Heb", "Jas",
  "1Pet", "2Pet", "1John", "Acts", "2Cor", "Gal", "1Thess", "2Thess", "1Tim", "2Tim",
  "Deut", "Josh", "Ruth", "1Sam", "2Sam", "1Kgs", "Neh", "Job", "Eccl", "Jer", "Lam",
  "Ezek", "Dan", "Hos", "Joel", "Mic", "Hab", "Zeph", "Zech", "Mal", "Mark", "Titus", "Rev"
];

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

const REFERENCE_INSIGHTS = {
  "1 Tessalonicenses 5:16-18": "Paulo une alegria, oração e gratidão como marcas de uma vida que aprendeu a enxergar Deus no centro da rotina. A gratidão cristã não depende de tudo estar fácil; ela nasce da certeza de que Cristo governa até os dias comuns.",
  "Filipenses 4:6-7": "A ansiedade é chamada para fora do coração e levada à presença de Deus em oração. A paz prometida não é ausência de luta, mas guarda espiritual para a mente e para os afetos em Cristo Jesus.",
  "Tiago 1:2-4": "Tiago não romantiza a dor; ele mostra que a provação, quando entregue a Deus, pode produzir perseverança madura. A fé testada deixa de ser apenas discurso e passa a formar caráter diante do Senhor.",
  "1 Coríntios 13:4-7": "O amor descrito por Paulo confronta a imaturidade da igreja. Ele não é sentimento solto, mas expressão do caráter de Cristo: paciente, humilde, verdadeiro e disposto a permanecer quando o ego quer dominar.",
  "João 8:12": "Jesus não apenas aponta para a luz; Ele declara ser a própria luz do mundo. Segui-Lo significa sair das sombras da autossuficiência, do pecado escondido e da confusão espiritual.",
  "Salmos 23:1-3": "Davi apresenta Deus como Pastor que guia, alimenta e restaura a alma. A segurança do rebanho não está na força da ovelha, mas no cuidado fiel Daquele que conduz cada passo.",
  "Salmos 46:10": "A quietude bíblica não é fuga; é rendição. Deus chama o coração a parar de lutar como se tudo dependesse de sua força e reconhecer que Ele é Senhor sobre a história.",
  "Salmos 91:1-2": "O abrigo do Altíssimo fala de proximidade, confiança e permanência. Não é uma promessa de vida sem batalha, mas de presença segura em meio às ameaças que cercam a alma.",
  "Salmos 119:105": "A Palavra é lâmpada para os passos, não holofote para controlar todo o futuro. Deus guia o obediente um passo de cada vez, chamando-o a confiar no que já foi revelado.",
  "Salmos 37:4": "Deleitar-se no Senhor reorganiza desejos. Quando Deus se torna o centro do prazer da alma, o coração aprende a pedir de modo mais santo e a esperar com mais confiança.",
  "Salmos 55:22": "Lançar o fardo sobre o Senhor é admitir que há pesos que não foram feitos para serem carregados sozinhos. Deus sustenta o justo não por causa da força humana, mas por Sua fidelidade.",
  "Salmos 138:8": "A obra de Deus não fica pela metade. O salmista descansa na fidelidade do Senhor, sabendo que a graça que começou a conduzir também é capaz de completar.",
  "Salmos 27:1": "Quando o Senhor é luz e salvação, o medo perde seu trono. A coragem nasce de saber quem Deus é antes de olhar para quem ou o que ameaça a vida.",
  "Salmos 34:8": "Provar e ver é mais que ouvir informações sobre Deus; é experimentar Sua bondade pela confiança obediente. A fé deixa de ser conceito distante e se torna encontro com o Senhor.",
  "Salmos 40:8": "Obedecer não é apenas cumprir regras externas; é ter a vontade de Deus gravada no íntimo. O coração transformado começa a desejar aquilo que antes apenas suportava.",
  "Salmos 51:10": "Davi não pede apenas alívio da culpa; pede um coração novo. O arrependimento verdadeiro não quer esconder o pecado, mas ser purificado por Deus desde a raiz.",
  "Salmos 62:1-2": "A alma aprende descanso quando para de procurar salvadores menores. Só Deus é rocha firme; tudo o mais pode ajudar, mas não pode substituir o Senhor.",
  "Salmos 73:26": "O corpo e o coração podem falhar, mas Deus permanece como porção eterna. A esperança cristã não depende da estabilidade humana, mas da suficiência do Senhor.",
  "Salmos 84:11": "Deus não retém o que é bom para os que andam com integridade. Isso não significa receber tudo o que se deseja, mas confiar que o Pai sabe o que realmente conduz à vida.",
  "Salmos 103:1-5": "Bendizer ao Senhor é treinar a memória espiritual. A alma esquece facilmente os benefícios de Deus, por isso precisa ser chamada de volta à gratidão, ao perdão e à adoração.",
  "Jeremias 29:11": "A esperança dada por Deus nasce em contexto de espera, disciplina e exílio. Seus planos não alimentam pressa egoísta; sustentam confiança quando o caminho ainda é longo.",
  "Jeremias 33:3": "O convite para clamar revela um Deus que ouve e responde segundo Sua sabedoria. A oração abre o coração para depender do Senhor, inclusive quando a resposta é maior que a expectativa.",
  "Ezequiel 36:26": "A promessa de um novo coração mostra que a mudança mais profunda não vem de maquiagem moral, mas de intervenção divina. Deus tira a dureza e dá sensibilidade espiritual.",
  "Daniel 3:17-18": "A fé dos amigos de Daniel não dependia do livramento acontecer do jeito esperado. Eles confiavam que Deus podia salvar, mas continuariam fiéis mesmo se a resposta fosse diferente.",
  "Joel 2:25": "A restauração de Deus alcança áreas que pareciam perdidas. Ele não apaga toda consequência automaticamente, mas redime histórias quebradas e chama o povo de volta à aliança.",
  "Habacuque 2:4": "O justo vive pela fé quando as respostas ainda não chegaram. Habacuque ensina a confiar no caráter de Deus mesmo quando a realidade parece contradizer a promessa.",
  "Ageu 2:9": "A glória prometida por Deus não depende da aparência inicial da obra. O Senhor encoraja um povo cansado a reconstruir prioridades e esperar uma presença maior que o passado.",
  "Zacarias 4:6": "A obra de Deus não avança por força humana, carisma ou pressão, mas pelo Espírito. Essa verdade humilha a autossuficiência e fortalece quem se sente pequeno diante da missão.",
  "Malaquias 3:10": "A fidelidade nas finanças revela confiança no Senhor. O texto confronta uma espiritualidade que separa culto e vida prática, chamando o povo a honrar Deus com tudo.",
  "Mateus 5:14-16": "Jesus chama Seus discípulos de luz do mundo. A vida transformada não deve buscar aplauso, mas apontar para o Pai por meio de obras que tornam visível a graça recebida.",
  "Mateus 6:25-27": "Jesus confronta a ansiedade mostrando o cuidado do Pai. A preocupação tenta ocupar o lugar da confiança, mas o discípulo aprende a descansar em quem sustenta a criação.",
  "Mateus 6:33": "Buscar primeiro o Reino reorganiza agendas, desejos e medos. Jesus não chama a acrescentar Deus à lista; Ele chama a colocar Deus no centro de tudo.",
  "Mateus 11:28-30": "O descanso oferecido por Cristo é para cansados e sobrecarregados. Ele não entrega apenas alívio emocional; oferece um jugo novo, manso, que ensina a viver debaixo da graça.",
  "Mateus 16:24-26": "Seguir Jesus envolve negar a si mesmo, tomar a cruz e perder a vida para encontrá-la. O evangelho confronta a ilusão de ganhar o mundo e perder a alma.",
  "Mateus 19:26": "O impossível humano não limita Deus. Jesus aponta para a incapacidade do homem de salvar a si mesmo e para o poder de Deus em realizar o que a graça exige.",
  "2 Pedro 3:9": "A paciência do Senhor é misericórdia, não demora vazia. Deus chama ao arrependimento enquanto ainda há tempo, revelando que Sua longanimidade tem propósito salvador.",
  "Judas 1:24-25": "Judas termina olhando para Deus, que é poderoso para guardar. A perseverança final não se apoia em orgulho espiritual, mas na graça que sustenta os Seus diante da queda.",
  "Apocalipse 3:20": "Cristo se apresenta à porta de uma igreja morna. O convite é íntimo e urgente: abrir a vida ao Senhor, abandonar a autossuficiência e restaurar comunhão verdadeira.",
  "Apocalipse 21:4": "A promessa de Deus enxugar lágrimas aponta para a consumação da esperança. A dor não terá a última palavra, porque Cristo fará novas todas as coisas.",
  "Apocalipse 22:20": "O clamor 'Vem, Senhor Jesus' é a oração de uma igreja que espera. A esperança futura purifica a vida presente e desperta fidelidade até o fim.",
  "Rute 1:16": "A lealdade de Rute revela compromisso que ultrapassa conveniência. Sua entrega mostra como Deus conduz histórias simples para dentro de propósitos maiores de redenção.",
  "1 Samuel 16:7": "Deus vê além da aparência. Enquanto pessoas julgam pela superfície, o Senhor examina o coração e chama Seu povo a viver diante Dele com sinceridade.",
  "2 Samuel 22:31": "Davi celebra um Deus cujo caminho é perfeito e cuja Palavra é provada. A proteção do Senhor não é teoria; é refúgio aprendido em batalhas reais.",
  "1 Reis 3:11-12": "Salomão pediu sabedoria para governar, não apenas benefício pessoal. A sabedoria que agrada a Deus nasce quando o coração deseja servir melhor e não apenas vencer sozinho.",
  "2 Reis 2:9": "O pedido de Eliseu não era vaidade espiritual, mas senso de dependência para continuar a missão. Quem serve a Deus precisa mais do Espírito do que de prestígio.",
  "Esdras 8:23": "Jejum e oração expressam dependência pública do Senhor. Esdras ensina que planejamento e fé não competem; a jornada precisa ser entregue a Deus com humildade.",
  "Neemias 8:10": "A alegria do Senhor nasce depois de ouvir a Palavra com arrependimento. Não é euforia superficial, mas força para recomeçar debaixo da graça.",
  "Ester 4:14": "Ester é chamada a discernir seu tempo. A providência de Deus não elimina responsabilidade; ela convoca coragem para agir quando o silêncio seria omissão.",
  "Eclesiastes 3:1": "Há tempo para tudo debaixo do céu, e reconhecer isso liberta o coração da ansiedade de controlar todas as estações. Deus governa ritmos que não dominamos.",
  "Eclesiastes 12:13": "A conclusão de Eclesiastes chama ao temor de Deus e à obediência. Depois de examinar tantas buscas humanas, o sentido da vida é encontrado diante do Senhor."
};

function dateForIndex(index) {
  const date = new Date(START_DATE);
  date.setDate(START_DATE.getDate() + index);
  return date;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function cleanTitle(title, index, fallback) {
  const raw = String(title || "").trim();
  const base = !raw || raw.toLowerCase() === "undefined" || raw.toLowerCase() === "null"
    ? (fallback || `Devocional Diário ${index + 1}`)
    : raw;
  return String(base).replace(/\s+—\s+(Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|Janeiro|Fevereiro|Março|Abril|Maio)$/i, "");
}

const TITLE_VARIANTS_BY_THEME = {
  Ansiedade: ["Descanso para o Coração", "Entregando o Amanhã", "Paz em Meio à Pressa", "Confiança no Cuidado do Pai", "Quando a Preocupação Cede", "O Pai Cuida de Mim", "Oração Antes da Ansiedade"],
  Amor: ["O Amor que Permanece", "Amar Como Cristo", "Graça em Forma de Amor", "Um Coração Paciente", "Amor que Serve", "Entrega que Cura", "O Caminho do Amor"],
  Coragem: ["Firmeza na Prova", "Fé Diante do Fogo", "Coragem para Permanecer", "Deus Conosco na Fornalha", "Fiéis Mesmo no Fogo", "Quando a Fé Não Recua", "O Senhor Pode Livrar"],
  Descanso: ["Alívio para a Alma", "O Jugo Leve de Jesus", "Descanso na Graça", "Quando a Alma Para", "Repouso no Cuidado de Deus", "Paz para o Cansado", "Cristo Sustenta o Fardo"],
  Esperança: ["Esperança que Não Morre", "Luz no Caminho Longo", "Promessa para a Espera", "Deus Ainda Está Agindo", "Confiança no Futuro de Deus", "Quando a Espera Ensina", "Amanhã nas Mãos do Pai"],
  Fé: ["Crer Mesmo Sem Ver", "Confiança que Caminha", "Fé no Deus Fiel", "O Justo Vive pela Fé", "Quando a Fé Sustenta", "Descansar na Promessa", "Olhos Fixos no Senhor"],
  Força: ["Força na Fraqueza", "Sustento para Continuar", "Graça que Levanta", "Quando Deus Fortalece", "Firmes no Senhor", "Poder em Meio à Fraqueza", "A Mão que Sustenta"],
  Gratidão: ["Memória Agradecida", "Bendize, Minha Alma", "Graça Recebida", "Gratidão nos Dias Comuns", "Olhos para a Bondade", "Louvor em Todo Tempo", "Reconhecer o Cuidado"],
  Oração: ["Conversa com o Pai", "Clamor que Aproxima", "Buscar o Rosto de Deus", "Oração que Descansa", "Quando o Coração Ora", "Comunhão no Secreto", "Deus Ouve o Clamor"],
  Paz: ["Quietude Diante de Deus", "Paz que Guarda", "Silêncio que Confia", "Descanso no Governo de Deus", "Quando Deus Acalma", "Paz no Meio da Luta", "Coração Guardado"],
  Perdão: ["Graça que Liberta", "Perdoados para Perdoar", "Livre da Culpa", "Misericórdia na Cruz", "Quando a Mágoa Sai", "Coração Perdoado", "Soltar o Ressentimento"],
  Perseverança: ["Continuar Pela Graça", "Fé que Não Desiste", "Constância na Prova", "Quando Deus Forma Caráter", "Permanecer Até o Fim", "Esperança no Caminho", "A Obra Não Para"],
  Sabedoria: ["Discernimento do Alto", "Escolhas Diante de Deus", "Temor que Ensina", "Sabedoria para Servir", "Conselho do Senhor", "Caminho de Prudência", "Decidir com Deus"],
  Santidade: ["Separado para Deus", "Pureza no Caminho", "Coração sem Máscaras", "Pertencer ao Senhor", "Obediência que Honra", "Vida Consagrada", "A Beleza da Santidade"],
  Serviço: ["Servir Como Cristo", "Grandeza que Serve", "Mãos Disponíveis", "Amor em Ação", "Humildade no Reino", "Levantar Quem Precisa", "Chamados para Servir"],
  Palavra: ["Lâmpada para Hoje", "A Voz que Guia", "Palavra Viva", "Verdade para o Caminho", "A Escritura no Coração", "Ouvir e Obedecer", "Luz para os Passos"],
  Proteção: ["Seguro no Refúgio", "Debaixo das Asas", "Guardado pelo Senhor", "Abrigo na Batalha", "O Escudo de Deus", "Proteção no Caminho", "Refúgio para a Alma"],
  Identidade: ["Sou do Senhor", "Filhos da Graça", "Identidade em Cristo", "Chamados pelo Nome", "O Pai Me Conhece", "Valor Recebido", "Nova Criatura"],
  Missão: ["Enviados por Cristo", "Testemunhas da Graça", "A Boa Notícia em Nós", "Chamados para Anunciar", "Ide e Vivei", "O Evangelho no Caminho", "Luz para Alcançar"],
  Generosidade: ["Graça que Reparte", "Mãos Abertas", "Dar com Alegria", "Provisão que Transborda", "Coração Generoso", "Repartir o Recebido", "Semente de Amor"],
  default: ["Palavra para Hoje", "Caminho de Obediência", "Graça no Cotidiano", "Perto de Jesus", "Resposta de Fé", "Coração Rendído", "Viver a Palavra"]
};

const BASE_TITLE_BY_THEME = {
  Ansiedade: "Descanso para o Coração",
  Amor: "Amor que Sustenta",
  Coragem: "Coragem no Senhor",
  Descanso: "Descanso em Cristo",
  Esperança: "Esperança Viva",
  Fé: "Fé para Hoje",
  Força: "Força na Graça",
  Gratidão: "Coração Grato",
  Oração: "Oração no Secreto",
  Paz: "Paz que Guarda",
  Perdão: "Graça que Perdoa",
  Perseverança: "Perseverança na Fé",
  Sabedoria: "Sabedoria do Alto",
  Santidade: "Vida Consagrada",
  Serviço: "Servir com Amor",
  Palavra: "Palavra Viva",
  Proteção: "Guardado por Deus",
  Identidade: "Identidade em Cristo",
  Missão: "Chamados para Anunciar",
  Generosidade: "Graça que Reparte",
  default: "Palavra para Hoje"
};

function titleForOccurrence(baseTitle, theme, occurrence) {
  if (!occurrence) return baseTitle;
  const variants = TITLE_VARIANTS_BY_THEME[theme] || TITLE_VARIANTS_BY_THEME.default;
  const variant = variants[(occurrence - 1) % variants.length];
  return `${baseTitle}: ${variant}`;
}

function stripGeneratedTitleVariant(title) {
  return String(title || "").replace(/: .+$/g, "");
}

function replacementTitle(theme, reference, occurrence) {
  const variants = TITLE_VARIANTS_BY_THEME[theme] || TITLE_VARIANTS_BY_THEME.default;
  const variant = variants[(occurrence - 1) % variants.length];
  const base = BASE_TITLE_BY_THEME[theme] || BASE_TITLE_BY_THEME.default;
  return variant === base ? `${base}: ${reference}` : `${base}: ${variant} (${reference})`;
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeReference(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function buildVersePool() {
  const orderedBooks = DEVOTIONAL_BOOK_ORDER
    .map(code => bible.books.find(book => book.book === code))
    .filter(Boolean);
  const candidates = [];

  for (const book of orderedBooks) {
    const name = BOOK_NAMES[book.book] || book.englishName || book.book;
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        const text = String(verse.text || "").replace(/\s+/g, " ").trim();
        if (text.length < 70 || text.length > 240) continue;
        if (/[\[\]{}]/.test(text)) continue;
        if (/^E disse|^E aconteceu|^E foi|^Então disse/i.test(text)) continue;
        if (/^(Salmo|Cântico|Mictão|Masquil|Oração)\b/i.test(text)) continue;
        candidates.push({ reference: `${name} ${chapter.chapter}:${verse.number}`, scripture: text });
      }
    }
  }

  return candidates;
}

const versePool = buildVersePool();
let versePoolIndex = 0;

function nextUniqueVerse(usedReferences) {
  while (versePoolIndex < versePool.length) {
    const candidate = versePool[versePoolIndex++];
    const normalized = normalizeReference(candidate.reference);
    if (!usedReferences.has(normalized)) {
      usedReferences.add(normalized);
      return candidate;
    }
  }
  throw new Error("Não há versículos suficientes para completar 365 referências únicas.");
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
  const title = escapeXml(cleanTitle(dev.title, index, dev.theme));
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

function buildReflection(dev, index, occurrence = 0) {
  const seed = index + occurrence * 7;
  const theme = String(dev.theme || "Palavra").toLowerCase();
  const themeInsight = THEME_INSIGHTS[dev.theme] || THEME_INSIGHTS.default;
  const referenceInsight = REFERENCE_INSIGHTS[dev.reference] || `${dev.reference} chama o coração a ouvir Deus com reverência e responder com fé prática. A Palavra não foi dada para enfeitar pensamentos religiosos, mas para conduzir pessoas reais ao Senhor.`;
  const openings = [
    `Hoje, ${dev.reference} não deve ser lido como uma frase isolada, mas como uma Palavra de Deus para alcançar a consciência e reorganizar a vida diante de Cristo.`,
    `Este devocional começa com uma pergunta simples: que área da sua vida precisa ser iluminada por ${dev.reference} hoje?`,
    `Ao meditar em ${dev.reference}, não procure apenas conforto rápido; permita que Deus ensine, corrija, console e chame você para mais perto de Jesus.`,
    `${dev.reference} coloca diante de nós uma verdade capaz de atravessar a rotina, confrontar o coração e renovar a esperança em Deus.`,
    `A leitura de hoje convida você a diminuir o ruído, abrir a Bíblia com humildade e deixar que ${dev.reference} fale com profundidade.`,
    `Há dias em que precisamos de uma resposta imediata; há outros em que Deus nos dá algo melhor: uma verdade para sustentar a caminhada. ${dev.reference} faz isso.`
  ];
  const occurrenceOpenings = [
    "",
    "Nesta nova leitura da mesma passagem, observe como Deus forma fidelidade em meio à pressão.",
    "Ao voltar a este texto, perceba um detalhe prático: a fé também amadurece quando a resposta demora.",
    "Esta meditação olha para a mesma verdade por outro ângulo, buscando obediência concreta e não apenas informação.",
    "Hoje, a ênfase está em como esta Palavra alcança decisões pequenas, silenciosas e reais.",
    "Desta vez, leia o texto pensando no que precisa ser entregue antes de qualquer mudança externa.",
    "A mesma passagem pode tratar uma nova área do coração quando ouvimos Deus com humildade.",
    "Aqui, o convite é perceber como Deus sustenta a caminhada quando a fé é provada no cotidiano."
  ];
  const bridges = [
    `Esse ensino precisa descer da mente para a prática. ${themeInsight}`,
    `O ponto central não é apenas saber mais, mas viver de modo mais rendido. ${themeInsight}`,
    `A maturidade cristã começa quando a Palavra deixa de ser apenas inspiração e passa a governar escolhas. ${themeInsight}`,
    `O Senhor não usa esta passagem para alimentar vaidade espiritual, mas para formar obediência sincera. ${themeInsight}`,
    `Quando essa verdade encontra resistência dentro de nós, é justamente ali que o Espírito deseja trabalhar. ${themeInsight}`,
    `Receba esta Palavra como convite pastoral: Deus está tratando não apenas circunstâncias, mas o coração. ${themeInsight}`
  ];
  const examinations = [
    `Pergunte com honestidade: tenho obedecido a Deus nessa área ou apenas concordado com o texto? A fé bíblica não se contenta com admiração; ela se expressa em arrependimento, confiança e passos concretos.`,
    `Examine se existe orgulho, comparação, medo, culpa escondida ou autossuficiência impedindo sua resposta ao Senhor. A graça não nos humilha para destruir; ela nos quebra para reconstruir em Cristo.`,
    `Talvez o maior desafio de hoje não seja entender o versículo, mas permitir que ele exponha o que precisa ser entregue. Deus cura com verdade, não com distração espiritual.`,
    `Não transforme este devocional em informação religiosa. Pare por alguns instantes, nomeie diante de Deus aquilo que precisa mudar e peça um coração pronto para obedecer.`,
    `A Palavra convida você a abandonar desculpas. Onde houver pecado, confesse; onde houver incredulidade, peça fé; onde houver cansaço, volte-se para Cristo.`,
    `O Senhor conhece aquilo que ninguém vê. Por isso, responda com sinceridade: que desejo, atitude ou decisão precisa se render ao governo de Jesus hoje?`
  ];
  const gospelConnections = [
    `O evangelho é a resposta mais profunda para essa necessidade: Jesus morreu pelos nossos pecados, ressuscitou e chama pecadores ao arrependimento e à vida nova.`,
    `Cristo não veio apenas melhorar comportamentos, mas salvar pessoas. Na cruz, Ele trata a culpa; na ressurreição, Ele abre caminho para uma nova vida.`,
    `A salvação não nasce do esforço humano, mas da graça de Deus em Jesus. Quem crê não precisa fingir força; pode se render, confessar e recomeçar.`,
    `O simples evangelho de Cristo Jesus continua sendo suficiente: arrependa-se, creia, receba perdão e caminhe em obediência pelo poder do Espírito Santo.`,
    `Deus não chama você para uma religiosidade sem vida, mas para reconciliação com Ele por meio de Cristo. Essa reconciliação começa com fé humilde e arrependimento sincero.`,
    `Em Jesus, o convite de Deus é claro: venha como está, mas não permaneça como está. A graça que perdoa também transforma.`
  ];
  const practices = [
    `Hoje, escolha uma atitude pequena e verificável: uma oração honesta, uma conversa corrigida, um pedido de perdão, uma renúncia ou uma decisão de obedecer sem adiar.`,
    `Leve esta Palavra para o ponto mais concreto do seu dia. O fruto da meditação aparecerá quando Cristo governar uma reação, uma prioridade ou uma escolha.`,
    `Antes de terminar, ore com simplicidade: “Senhor, mostra onde preciso me arrepender e dá-me fé para obedecer”. Depois, pratique o que Deus já deixou claro.`,
    `Não espere sentir tudo para obedecer. Comece com fidelidade no próximo passo, confiando que Deus sustenta quem responde à Sua voz.`,
    `Se o texto trouxe consolo, adore. Se trouxe confronto, arrependa-se. Se trouxe direção, obedeça. Em tudo, volte os olhos para Cristo.`,
    `Faça deste dia um altar simples: menos justificativas, mais rendição; menos pressa, mais escuta; menos controle, mais confiança no Senhor.`
  ];

  const opening = occurrenceOpenings[occurrence % occurrenceOpenings.length]
    ? `${occurrenceOpenings[occurrence % occurrenceOpenings.length]} ${openings[seed % openings.length]}`
    : openings[seed % openings.length];

  return `${opening}

${referenceInsight}

O tema de ${theme} precisa ser recebido com simplicidade e seriedade. ${bridges[seed % bridges.length]}

${examinations[seed % examinations.length]}

Arrependimento não é apenas sentir peso na consciência; é voltar-se para Deus, abandonar o caminho que entristece o Senhor e confiar que a graça de Cristo é suficiente para perdoar e transformar.

Este é o evangelho que sustenta toda aplicação: Jesus Cristo morreu pelos pecadores, ressuscitou em vitória e chama cada pessoa a responder com fé, arrependimento e uma vida rendida ao Seu senhorio.

${gospelConnections[seed % gospelConnections.length]}

${practices[seed % practices.length]}`;
}

function buildApplication(dev, index) {
  return [
    `Leia ${dev.reference} lentamente e destaque uma palavra ou expressão central do texto.`,
    `Confesse a Deus um pecado, resistência ou frieza espiritual que esta Palavra revelou.`,
    `Declare sua fé em Jesus Cristo e pratique hoje uma atitude concreta de arrependimento e obediência.`
  ];
}

const THEME_PRAYERS = {
  Ansiedade: [
    (r) => `Pai, onde a ansiedade aperta, lembra-me que Tu estás perto. ${r} me ensina a entregar o que me preocupa em Tuas mãos, porque Tu cuidas de mim mais do que eu cuido de mim mesmo. Acalma meu coração e me dá a Tua paz.`,
    (r) => `Senhor, eu trago a Ti o que me tumultua. Não consigo controlar tudo, mas Tu podes. ${r} me mostra que a oração é mais forte que a preocupação. Que eu aprenda a buscar Teu rosto antes de tentar resolver sozinho.`,
    (r) => `Pai, onde há pressa na minha alma, freia. Onde há medo, acalma. ${r} me lembra de que Tu és o Deus de hoje, não de amanhã. Guarda meu coração da inquietação e me conduz ao descanso que só Tu ofereces.`,
    (r) => `Meu Deus, a vida cobra mais do que eu posso dar. ${r} me convida a parar, respirar e confiar. Que eu não carregue sozinho o peso que Tu convidas a entregar. Toma para Ti o que me paralisa.`,
    (r) => `Senhor, onde a ansiedade grita, quero ouvir a Tua voz. ${r} me lembra de que não preciso ter medo, porque Tu estás perto de quem Te invoca. Afasta de mim a agitação e me dá serenidade.`,
    (r) => `Pai, eu confesso que me preocupo com coisas que não controlo. ${r} me ensina a confiar que Tu governas até aquilo que não entendo. Que eu descanse no Teu cuidado, não na minha própria força.`
  ],
  Amor: [
    (r) => `Pai, onde há frieza no meu amor, aquece. Onde há egoísmo, transforma. ${r} me mostra que amar não é sentimento, mas escolha que reflete o caráter de Cristo. Faz de mim alguém que ama com paciência e verdade.`,
    (r) => `Senhor, eu preciso aprender a amar sem condição, sem retorno esperado. ${r} revela um amor paciente, que não se orgulha, que não busca seus próprios interesses. Ensina-me a viver esse amor nas minhas relações.`,
    (r) => `Pai, o mundo ensina a amar com medidas, mas Tu chamas a um amor sem limites. ${r} aponta para Cristo como o exemplo perfeito de entrega. Cura as feridas que me impedem de amar com liberdade.`,
    (r) => `Senhor, onde há mágoa que impede de amar, sara. Onde há ressentimento, liberta. ${r} me ensina que o amor de Deus foi derramado em nosso coração. Que eu ame como Cristo amou: com entrega total.`
  ],
  Coragem: [
    (r) => `Senhor, onde o medo fala mais alto, lembra-me de quem Tu és. ${r} me ensina que a coragem não é ausência de medo, mas presença de Deus no meio dele. Fortalece minha fé para caminhar onde Tu envias.`,
    (r) => `Pai, eu não quero viver dominado pelo que me ameaça. ${r} me mostra que Tu és maior que qualquer gigante diante de mim. Dá-me a ousadia de quem confia em Deus.`,
    (r) => `Senhor, onde há covardia espiritual, desperta. Onde há timidez para falar de Ti, encoraja. ${r} chama o coração a ser forte e corajoso, porque Tu estás conosco.`,
    (r) => `Pai, a coragem que preciso não é minha, mas vem de Ti. ${r} me lembra de que o Senhor luta por Seu povo. Que eu não fuja dos desafios, mas caminhe neles com o poder do Teu Espírito.`
  ],
  Descanso: [
    (r) => `Senhor, eu venho cansado de tentar vencer pela minha força. ${r} me convida ao descanso que a graça oferece. Que eu pare de lutar contra o que só Tu podes resolver.`,
    (r) => `Pai, a exaustão me lembra de que não fui feito para carregar tudo sozinho. ${r} apresenta Jesus como o Bom Pastor que faz descansar as ovelhas cansadas. Ensina-me a render o peso.`,
    (r) => `Senhor, onde há pressa, freia. Onde há desassossego, acalma. ${r} me mostra que até Deus descansou. Que eu aprenda que o descanso é dádiva, não preguiça.`,
    (r) => `Pai, eu confesso que confundo descanso com fraqueza. Mas o Teu descanso é paz da alma que sabe que Deus governa. ${r} me ensina a parar e reconhecer que a vida depende da Tua graça.`
  ],
  Esperança: [
    (r) => `Senhor, quando tudo parece escuro, ${r} acende uma luz em mim. A esperança que Tu dás não depende do que vejo, mas do que Tu prometeste. Renova minha confiança.`,
    (r) => `Pai, a desilusão quer roubar minha alegria. ${r} me lembra que os Teus planos são de paz. Que eu olhe para as Tuas promessas e não para as minhas circunstâncias.`,
    (r) => `Senhor, onde há desânimo, renova. Onde há cansaço de esperar, sustenta. ${r} mostra que Deus age nos bastidores antes de revelar Sua obra. Que eu espere com paciência.`,
    (r) => `Pai, a esperança cristã não é otimismo vago, mas confiança no caráter fiel de Deus. ${r} me ensina a perseverar na espera sem perder a fé.`
  ],
  Fé: [
    (r) => `Senhor, eu creio, mas aumenta minha fé. ${r} me mostra que a fé não ignora a realidade, mas escolhe interpretar tudo à luz de Deus. Fortalece minha confiança.`,
    (r) => `Pai, onde a dúvida me paralisa, lembra-me de quem Tu és. ${r} revela que a fé é certeza do que se espera. Que eu confie no que Tu revelas, mesmo quando não entendo.`,
    (r) => `Senhor, a fé que Tu desejas não é sentimento passageiro, mas escolha diária de confiar. ${r} ensina que o justo vive pela fé. Que minha vida seja marcada por confiança em Ti.`,
    (r) => `Pai, onde há incredulidade, gera fé. Onde há medo, dá ousadia. ${r} me lembra que a fé pequena ainda é fé. Afasta de mim a autossuficiência e me ensina a depender de Ti.`
  ],
  Força: [
    (r) => `Senhor, onde minha força acaba, a Tua começa. ${r} me ensina que Deus escolhe o fraco para confundir o forte. Que eu não tenha vergonha da minha fraqueza.`,
    (r) => `Pai, eu não consigo mais por mim mesmo. Preciso de Ti. ${r} mostra que a força nasce da dependência do Senhor. Forja em mim resistência que vem da Tua presença.`,
    (r) => `Senhor, onde a exaustão ameaça me derrubar, levanta-me. ${r} revela que a graça é suficiente e que o poder de Deus se aperfeiçoa na debilidade. Sustenta-me.`,
    (r) => `Pai, a vida cobra mais do que eu posso dar. ${r} me convida a encontrar no Teu jugo a verdadeira força. Tira de mim a ilusão de ser autossuficiente.`
  ],
  Gratidão: [
    (r) => `Pai, eu tenho tanto que agradecer e tantas vezes esqueço. ${r} me chama de volta ao reconhecimento. Abre meus olhos para ver as bênçãos que já recebi.`,
    (r) => `Senhor, onde a queixa governa, instala em mim a gratidão. ${r} ensina que bendizer ao Senhor é treinar a memória espiritual. Que eu nunca trate as Tuas bênçãos como merecidas.`,
    (r) => `Pai, mesmo nos dias difíceis há motivos para agradecer. ${r} me mostra que a gratidão não nega a dor, mas reconhece a presença do Senhor em meio a ela.`,
    (r) => `Senhor, eu quero viver com um coração grato. ${r} me lembra de todos os benefícios do Senhor que perdoa, sara e sustenta. Que a gratidão seja o tom da minha vida.`
  ],
  Oração: [
    (r) => `Pai, ensina-me a orar. ${r} me mostra que a oração é comunhão antes de ser pedido. Que eu não ore apenas para falar, mas para ouvir a Tua voz.`,
    (r) => `Senhor, muitas vezes a oração vira lista de pedidos. ${r} me ensina a buscar Teu rosto, não apenas Tuas mãos. Que a oração seja o primeiro passo, não o último recurso.`,
    (r) => `Pai, eu confesso que oro pouco e mal. ${r} revela que o Espírito intercede por nós. Tira de mim a preguiça espiritual e me dá fome de estar na Tua presença.`,
    (r) => `Senhor, a oração não é fórmula, mas conversa honesta com o Pai. ${r} me chama a orar sem desistir, a render minhas vontades e a confiar que Tu respondes.`
  ],
  Paz: [
    (r) => `Pai, onde há guerra ao meu redor, dá-me a Tua paz. ${r} não é ausência de conflito, mas presença segura do Senhor no meio dele. Guarda meu coração.`,
    (r) => `Senhor, a perturbação do mundo não deve governar o que há dentro de mim. ${r} revela que a paz de Deus guarda quem deposita nele os seus pensamentos.`,
    (r) => `Pai, onde há tumulto, sê quietude. Onde há discórdia, sê concórdia. ${r} me ensina que a paz com Deus precede a paz com os outros.`,
    (r) => `Senhor, eu desejo a paz que supera todo entendimento. ${r} me mostra que ela nasce da confiança no Senhor, não da estabilidade das circunstâncias.`
  ],
  Perdão: [
    (r) => `Pai, eu preciso do Teu perdão mais do que imagino. ${r} me mostra que a cruz é o lugar onde a misericórdia encontra a justiça. Perdoa o que escondi e o que nem percebi.`,
    (r) => `Senhor, perdoar é difícil quando a ofensa foi grande. Mas ${r} me lembra de que fui perdoado com uma graça muito maior. Dá-me coragem para soltar o ressentimento.`,
    (r) => `Pai, onde há amargura, sara. Onde há mágoa profunda, restaura. ${r} revela que o perdão cristão nasce da cruz. Ensina-me a perdoar como fui perdoado.`,
    (r) => `Senhor, eu confesso que guardo mágoas que deveria ter entregue a Ti. ${r} me chama à liberdade que só o perdão oferece. Liberta minha alma do ressentimento.`
  ],
  Perseverança: [
    (r) => `Senhor, quando o caminho é longo, ${r} me lembra de que o fim será maior que o começo. Dá-me perseverança para continuar, mesmo quando não vejo fruto.`,
    (r) => `Pai, a provação pode desanimar, mas não deve destruir. ${r} ensina que a tribulação produz perseverança. Que eu receba a dor como instrumento do Teu aprimoramento.`,
    (r) => `Deus fiel, há dias em que quase desisto. ${r} me mostra que Tu não abandonas quem começou a guiar. Que eu persevere em oração, em fé e em obediência.`,
    (r) => `Senhor, a perseverança não é bravura humana, mas fruto do Espírito. ${r} me ensina que há recompensa para quem não se cansa de fazer o bem.`
  ],
  Sabedoria: [
    (r) => `Pai, eu não quero apenas informação, mas discernimento. ${r} revela que o temor do Senhor é o começo da sabedoria. Dá-me discernimento para separar o que é de Ti.`,
    (r) => `Senhor, as decisões do dia a dia precisam da Tua direção. ${r} me ensina a não confiar na minha compreensão, mas a reconhecer Ti em todos os caminhos.`,
    (r) => `Pai, onde há confusão, dá-me clareza. Onde há dúvida, direção. ${r} mostra que a sabedoria divina une humildade, temor e obediência prática.`,
    (r) => `Senhor, a sabedoria que preciso não está nos livros dos homens, mas na Tua Palavra. ${r} me chama a pedir com fé e a buscar Teu conselho antes de agir.`
  ],
  Santidade: [
    (r) => `Pai, eu pertenço a Ti e quero que isso seja visível. ${r} me mostra que santidade não é isolamento, mas separação para refletir o Teu caráter. Purifica o que há de pecado em mim.`,
    (r) => `Senhor, onde há compromisso secreto com o pecado, confronta. ${r} revela que Deus chama à santidade porque é bom para nós. Que eu não viva como o mundo vive, mas como filho de Deus.`,
    (r) => `Pai, a Tua Palavra não me deixa confortável no pecado. ${r} me convida a uma vida separada, não por regras, mas por um coração transformado. Ensina-me a honrar Teu nome.`,
    (r) => `Senhor, a santidade é pertencimento a Deus de modo visível. ${r} me ensina a viver diante de Ti com sinceridade, sem máscaras. Que minha vida seja ato de adoração.`
  ],
  Serviço: [
    (r) => `Pai, onde há orgulho que impede de servir, humilha. ${r} revela que em Cristo a grandeza não é dominar, mas servir. Faz de mim servo, não de quem busca ser servido.`,
    (r) => `Senhor, eu quero servir como Cristo serviu: com amor e entrega. ${r} me ensina que o serviço cristão inverte a lógica do mundo. Ensina-me a servir nos pequenos detalhes.`,
    (r) => `Pai, onde há preguiça que evita levantar o caído, desperta. ${r} mostra que quem quer ser grande precisa ser servo de todos. Tira de mim o desejo de ser relevante.`,
    (r) => `Senhor, onde há pessoas precisando de ajuda, abre meus olhos. ${r} me lembra de que servir é amar em ação. Que eu não passe ao lado da necessidade.`
  ],
  Palavra: [
    (r) => `Pai, a Tua Palavra é viva e eficaz. ${r} me ensina que ela não foi dada para enfeitar pensamentos religiosos, mas para conduzir ao Senhor. Abre meus olhos para as Suas maravilhas.`,
    (r) => `Senhor, onde há superficialidade na leitura, aprofunda. ${r} revela que a Escritura é lâmpada para os passos. Que eu não leia por hábito, mas com fome espiritual.`,
    (r) => `Pai, preciso ouvir mais a Ti e menos a mim. ${r} mostra que a Palavra é discernimento para o coração. Deixa que ela confronte, console e direcione cada área da minha vida.`,
    (r) => `Senhor, que a Bíblia não seja apenas um livro, mas a Tua voz falando comigo. ${r} me chama a meditar dia e noite e a deixar que a verdade governe minhas escolhas.`
  ],
  Proteção: [
    (r) => `Senhor, onde há perigo, sê escudo. Onde há ameaça, sê refúgio. ${r} me mostra que a proteção divina é presença fiel de Deus no meio das lutas. Cobre minha família e minha fé.`,
    (r) => `Pai, eu não preciso ter medo porque Tu és o meu abrigo. ${r} revela que quem habita no esconderijo do Altíssimo descansa sob a sombra do Onipotente. Guarda meus passos.`,
    (r) => `Senhor, onde a insegurança me ronda, dá-me certeza. ${r} me ensina que o Senhor é luz e salvação — de quem temerei? Protege os que amo e sustenta minha fé.`,
    (r) => `Pai, as investidas do inimigo são reais, mas Tu és maior. ${r} me mostra que nenhum mal me alcança sem a Tua permissão. Mantém-me vigilante e seguro em Ti.`
  ],
  Identidade: [
    (r) => `Pai, eu sou Teu. Isso muda tudo. ${r} me lembra de que em Cristo sou filho, herdeiro e testemunho da graça. Que eu não busque identidade no que faço, mas no que Tu fizeste por mim.`,
    (r) => `Senhor, onde a insegurança me faz agir como se não fosse Teu, lembra-me de quem sou. ${r} revela que Deus vê além da aparência e chama o coração pelo nome.`,
    (r) => `Pai, o mundo me diz quem eu deveria ser, mas a Tua Palavra me diz quem eu sou. ${r} confirma que fui criado para refletir a imagem de Deus. Que eu viva como nova criatura.`,
    (r) => `Senhor, onde há busca desesperada por aprovação humana, descanso na Tua. ${r} me ensina que a identidade cristã é recebida, não construída. Sou Teu, e isso basta.`
  ],
  Missão: [
    (r) => `Pai, a Tua Palavra não é para ser guardada, mas compartilhada. ${r} me chama a ser testemunha com palavras e atitudes. Envia-me onde Tu queres, mesmo que seja desconfortável.`,
    (r) => `Senhor, há pessoas ao meu redor que precisam ouvir o evangelho. ${r} me mostra que o discípulo não guarda a fé para si. Que eu fale de Ti com ousadia e amor.`,
    (r) => `Pai, onde há covardia para testemunhar, encoraja. Onde há desculpas, remove. ${r} revela que o Reino avança quando o povo fala e vive o evangelho.`,
    (r) => `Senhor, a missão é Tua e me convidas a participar. ${r} me ensina que ir, batizar e ensinar é o chamado de todo crente. Usa minha vida para alcançar quem não Te conhece.`
  ],
  Generosidade: [
    (r) => `Pai, onde há avareza, generosidade. Onde há medo de perder, confiança na provisão. ${r} me mostra que a generosidade nasce de quem compreendeu a graça. Ensina-me a repartir sem medo.`,
    (r) => `Senhor, eu tenho mais do que preciso enquanto outros têm menos. ${r} me chama a ser canal de bênção. Liberta minha mão e meu coração para dar com alegria.`,
    (r) => `Pai, onde há escassez mental, muda minha perspectiva. ${r} revela que quem semeia generosidade colhe abundância. Que eu não guarde para mim o que Tu me deste para compartilhar.`,
    (r) => `Senhor, a generosidade não é apenas dinheiro, mas tempo e presença. ${r} me ensina a ser generoso em tudo. Que minha vida reflita quem recebeu e quer repartir a graça.`
  ],
  Glória: [
    (r) => `Pai, tudo é Teu. A criação, a salvação, a esperança. ${r} me ensina que a vida cristã é para a Tua glória. Que eu não busque a minha, mas viva de modo que outros Te glorifiquem.`,
    (r) => `Senhor, onde há orgulho que rouba a Tua glória, humilha. ${r} revela que Deus compartilha Sua glória com os humildes. Que o nome de Jesus seja exaltado, não o meu.`,
    (r) => `Pai, a Tua majestade excede tudo o que posso imaginar. ${r} me chama a viver diante de Ti com admiração. Que cada área da minha vida aponte para a Tua grandeza.`
  ],
  Espírito: [
    (r) => `Pai, onde há secura espiritual, renova. ${r} me mostra que a vida no Espírito é caminhada diária. Enche-me do Teu Espírito para que eu viva e sirva com poder que não é meu.`,
    (r) => `Senhor, eu não quero viver pela força humana, mas pelo Teu Espírito. ${r} revela que o Espírito consola, guia e transforma. Que eu não apague o fogo do Espírito em mim.`,
    (r) => `Pai, onde há rebeldia, submete. Onde há resistência, rende. ${r} me ensina que a unção do Espírito é para servir, não para exibir. Dá-me o Teu Espírito em plenitude.`
  ],
  Dízimos: [
    (r) => `Pai, a fidelidade nas finanças revela se eu confio em Ti. ${r} me ensina a honrar Deus com os primeiros frutos. Que eu não trate o dízimo como obrigação, mas como adoração.`,
    (r) => `Senhor, onde há medo de dar, liberta. ${r} mostra que Deus abençoa quem semeia com generosidade. Ensina-me a administrar o que é Teu com fidelidade e alegria.`
  ],
  Testemunho: [
    (r) => `Pai, que minha vida seja um testemunho vivo da Tua graça. ${r} me mostra que somos luz do mundo. Que minhas palavras e atitudes apontem para Cristo, não para mim.`,
    (r) => `Senhor, onde há vergonha do evangelho, envergonha-me para Ti. ${r} me ensina a ser testemunha com ousadia, não apenas com palavras, mas com uma vida que reflete o Teu amor.`
  ],
  Prioridade: [
    (r) => `Pai, onde há distrações que deslocam Teu lugar, reordena. ${r} me ensina que buscar primeiro o Reino reorganiza tudo. Que eu não acrescente Deus à lista, mas Te coloque no centro.`,
    (r) => `Senhor, muitas vezes priorizo o urgente sobre o eterno. ${r} revela que a vida não consiste na abundância de bens, mas na presença de Deus. Ensina-me a colocar Teu Reino em primeiro.`
  ],
  Discipulado: [
    (r) => `Pai, seguir Jesus não é confortável, mas é o único caminho. ${r} me mostra que discípulo toma a cruz e nega a si mesmo. Que eu não faça um cristianismo cômodo, mas siga Jesus de verdade.`,
    (r) => `Senhor, onde há compromisso superficial, aprofunda. ${r} revela que o discipulado custa algo, mas a recompensa é eterna. Faz de mim discípulo que obedece e caminha com Cristo.`
  ],
  Poder: [
    (r) => `Pai, onde há impotência diante do impossível, lembra-me de que Tu podes todas as coisas. ${r} mostra que o poder de Deus não depende da capacidade humana. Que eu não limite o que Tu podes fazer.`,
    (r) => `Senhor, o poder que preciso não é meu, mas Teu. ${r} me ensina a buscar no Espírito a força que a carne não pode fornecer. Que eu viva pela unção de Deus, não pelo esforço próprio.`
  ],
  Paciência: [
    (r) => `Pai, onde há pressa que desvia do caminho, freia. ${r} revela que a paciência é confiança no tempo de Deus. Ensina-me a esperar sem desistir e a confiar que Tu cumpres Tuas promessas.`,
    (r) => `Senhor, a impaciência me faz querer resolver antes do tempo. ${r} me mostra que há tempos para cada coisa. Que eu aprenda a esperar em Deus com fé, sabendo que o que Ele prepara é melhor.`
  ],
  Convite: [
    (r) => `Pai, o Teu convite é aberto e urgente. ${r} revela Cristo à porta batendo. Que eu não feche a minha vida ao Senhor por medo ou comodismo. Abre a porta do meu coração.`,
    (r) => `Senhor, onde há porta fechada em mim, abre. ${r} me ensina que o convite de Deus é para todos, mas exige resposta. Que eu receba com alegria o chamado do Senhor.`
  ],
  Consolação: [
    (r) => `Pai, onde há dor, sê consolo. Onde há lágrima, sê esperança. ${r} revela que Deus é o Pai de todas as consolações. Que eu receba o Teu consolo e o compartilhe com quem precisa.`,
    (r) => `Senhor, a tristeza pode ser real sem ser permanente. ${r} me mostra que há um dia em que Deus enxugará toda lágrima. Até lá, sustenta-me com a Tua presença.`
  ],
  Lealdade: [
    (r) => `Pai, onde há traição à aliança, restaura. ${r} revela que a lealdade cristã nasce da fidelidade de Deus. Ensina-me a ser fiel ao Senhor, aos irmãos e às promessas que faço.`,
    (r) => `Senhor, a lealdade que Tu desejas é coração rendido. ${r} me ensina a permanecer fiel mesmo quando seria mais fácil desistir. Que eu valorize as alianças que Deus fez comigo.`
  ],
  Coração: [
    (r) => `Pai, Tu vês o que eu escondo dos outros. ${r} me mostra que Deus examina o coração e não se engana com aparências. Purifica os motivos ocultos e os desejos desordenados.`,
    (r) => `Senhor, onde há dureza, amolece. Onde há frieza, acende. ${r} revela que o coração é a fonte da vida. Ensina-me a guardá-lo com toda a vigilância.`
  ],
  "O Dobro do Teu Espírito": [
    (r) => `Pai, eu não quero apenas o suficiente, mas o que Tu queres derramar. ${r} me ensina a pedir com fé o dobro do Teu Espírito, para que eu sirva com unção e viva com poder.`,
    (r) => `Senhor, onde há mediocridade espiritual, transforma. ${r} revela que Deus dá o Espírito sem medida a quem pede com sinceridade. Que eu não aceite viver com menos do que Tu queres.`
  ],
  "Jejuamos e Pedimos": [
    (r) => `Pai, o jejum não é fórmula, mas expressão de dependência. ${r} me ensina a jejuar com propósito e a orar com fome espiritual. Que a busca a Deus seja mais intensa que a busca pelas coisas.`,
    (r) => `Senhor, onde há espiritualidade superficial, aprofunda com jejum e oração. ${r} revela que há coisas que só saem por jejum e oração. Que eu busque Deus como necessidade vital.`
  ],
  Alegria: [
    (r) => `Pai, a alegria do Senhor é a minha força, mesmo quando o dia é pesado. ${r} me ensina a não depender das circunstâncias para alegrar, mas da certeza de que Cristo é Senhor.`,
    (r) => `Senhor, onde há tristeza que sufoca, traz a Tua alegria. ${r} revela que a alegria cristã não é euforia, mas fruto do Espírito. Que eu aprenda a alegrar-me sempre, em tudo dando graças.`
  ],
  Propósito: [
    (r) => `Pai, eu não vim ao mundo por acaso. ${r} me ensina que Deus tem um propósito para cada vida. Que eu não desperdice os dias buscando o que não é eterno, mas viva conforme o Teu chamado.`,
    (r) => `Senhor, onde há confusão sobre o caminho, direciona. ${r} revela que os propósitos de Deus são de paz. Que eu confie que o que Tu preparaste é melhor do que o que eu planejaria.`
  ],
  Tempo: [
    (r) => `Pai, há tempos debaixo do céu para cada coisa. ${r} me ensina a reconhecer os Teus tempos e a não adiar o que precisa ser feito hoje. Que eu viva no ritmo que Tu determinas.`,
    (r) => `Senhor, onde há ansiedade pelo futuro, ensina-me a viver o presente. ${r} revela que tudo tem o seu tempo. Que eu use bem os dias que Tu me dás, sabendo que a eternidade é certa.`
  ],
  Temor: [
    (r) => `Pai, onde há irreverência, restaura o temor santo. ${r} me ensina que o temor do Senhor é o começo da sabedoria. Que eu trate a Deus com a reverência que merece, sem perder a intimidade.`,
    (r) => `Senhor, onde há desrespeito à Tua santidade, desperta o temor saudável. ${r} revela que Deus é digno de louvor e de obediência. Que eu viva entre a intimidade com o Pai e a reverência ao Senhor.`
  ],
  default: [
    (r) => `Pai, ${r} é uma Palavra que alcançou meu coração hoje. Recebo-a com humildade. Transforma o que ouvi em obediência prática e em fé que se rende ao Teu evangelho.`,
    (r) => `Senhor, eu não quero ser ouvinte apenas, mas obedecer. ${r} me ensina que a adoração começa quando a Escritura governa as escolhas. Que eu viva hoje de acordo com o que ouvi.`,
    (r) => `Pai, onde há resistência em mim, rende. Onde há obediência, fortalece. ${r} revela que Deus fala e espera resposta. Que eu não trate esta Palavra como mais um devocional, mas como convite para caminhar mais perto de Jesus.`,
    (r) => `Deus fiel, eu agradeço por ${r}. Que esta verdade marque minha mente, meu coração e minhas ações. Dá-me fé para crer, coragem para obedecer e humildade para reconhecer que tudo é graça.`
  ]
};

const PRAYER_CLOSINGS = [
  " Aproxima meu coração de Ti hoje.",
  " Que isso se torne vida em mim.",
  " Ensina-me a responder com simplicidade.",
  " Guarda-me perto de Jesus.",
  " Que eu caminhe contigo neste dia.",
  " Faz essa verdade criar raízes em mim.",
  " Ajuda-me a viver essa Palavra com sinceridade."
];

function buildPrayer(dev, index, occurrence = 0) {
  const ref = dev.reference;
  const theme = dev.theme || "Palavra";
  const refText = `${ref}`;
  const prayers = THEME_PRAYERS[theme] || THEME_PRAYERS.default;
  const seed = index + occurrence * 11;
  const prayerFn = prayers[seed % prayers.length];
  const closing = occurrence ? PRAYER_CLOSINGS[(occurrence - 1) % PRAYER_CLOSINGS.length] : "";
  return `${prayerFn(refText)}${closing}`;
}

function normalizeDevotional(sourceDev, index, occurrence = 0, replacement = null) {
  const date = dateForIndex(index);
  const reference = replacement?.reference || sourceDev.reference || "João 3:16";
  const theme = sourceDev.theme || "Palavra";
  const sourceTitle = replacement ? replacementTitle(theme, reference, occurrence) : sourceDev.title;
  const baseTitle = stripGeneratedTitleVariant(cleanTitle(sourceTitle, index, theme));
  const title = replacement ? sourceTitle : titleForOccurrence(baseTitle, theme, occurrence);

  return {
    id: `dia-${String(index + 1).padStart(3, "0")}-${formatDate(date)}`,
    title,
    theme,
    reference,
    image: writeDevotionalImage({ ...sourceDev, title, reference, theme }, index),
    imageAlt: `Arte devocional única sobre ${theme}, baseada em ${reference}, para ${title}.`,
    scripture: replacement?.scripture || sourceDev.scripture || "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...",
    reflection: buildReflection({ ...sourceDev, reference, theme }, index, occurrence),
    application: buildApplication({ ...sourceDev, reference, theme }, index),
    prayer: buildPrayer({ ...sourceDev, reference, theme }, index, occurrence),
    author: "Pr. Marco Lima"
  };
}

const base = source.slice(0, 50);
if (!base.length) {
  throw new Error("Nenhum devocional base encontrado em data/devocionais.json");
}

fs.rmSync(imageDir, { recursive: true, force: true });

const occurrenceByReference = new Map();
const usedReferences = new Set();
const result = Array.from({ length: TOTAL_DAYS }, (_, index) => {
  const sourceDev = base[index % base.length];
  const originalReference = normalizeReference(sourceDev.reference || "João 3:16");
  const occurrence = occurrenceByReference.get(originalReference) || 0;
  occurrenceByReference.set(originalReference, occurrence + 1);

  let replacement = null;
  if (usedReferences.has(originalReference)) {
    replacement = nextUniqueVerse(usedReferences);
  } else {
    usedReferences.add(originalReference);
  }

  return normalizeDevotional(sourceDev, index, occurrence, replacement);
});

fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");

console.log(JSON.stringify({ total: result.length, first: result[0].id, last: result[result.length - 1].id }, null, 2));
