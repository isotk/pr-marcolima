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

function buildReflection(dev, index) {
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

  return `${openings[index % openings.length]}

${referenceInsight}

O tema de ${theme} precisa ser recebido com simplicidade e seriedade. ${bridges[index % bridges.length]}

${examinations[index % examinations.length]}

Arrependimento não é apenas sentir peso na consciência; é voltar-se para Deus, abandonar o caminho que entristece o Senhor e confiar que a graça de Cristo é suficiente para perdoar e transformar.

Este é o evangelho que sustenta toda aplicação: Jesus Cristo morreu pelos pecadores, ressuscitou em vitória e chama cada pessoa a responder com fé, arrependimento e uma vida rendida ao Seu senhorio.

${gospelConnections[index % gospelConnections.length]}

${practices[index % practices.length]}`;
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
  const title = cleanTitle(sourceDev.title, index, theme);

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
