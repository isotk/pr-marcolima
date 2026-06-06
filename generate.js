#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const references = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/references.json'), 'utf8'));
const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/devocionais.json'), 'utf8'));

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

const COMMENTATORS = [
  {name: "Charles Spurgeon", style: "prega"},
  {name: "Matthew Henry", style: "observa"},
  {name: "John Stott", style: "escreve"},
  {name: "Warren Wiersbe", style: "ensina"},
  {name: "D.A. Carson", style: "reflete"},
  {name: "F.F. Bruce", style: "anota"},
  {name: "John Gill", style: "declara"},
  {name: "Albert Barnes", style: "acrescenta"}
];

const THEOLOGICAL_INSIGHTS = {
  "Pastor": "A metáfora do pastor no Salmo 23 revela o cuidado personalizado de Deus. Assim como um pastor conhece cada ovelha, Deus conhece nossas necessidades. O 'nada me faltará' não é promessa de abundância material, mas de provisão espiritual completa.",
  "Paz": "A paz bíblica (shalom) não é ausência de conflito, mas presença de Deus no meio das tempestades. Quando Deus diz 'esteja quieto', Ele está nos convidando a parar de lutar contra circunstâncias que só Ele pode resolver.",
  "Proteção": "O Salmo 91 descreve a proteção divina como um refúgio seguro. Deus não nos promete ausência de perigo, mas Sua presença nele. O 'Altíssimo' é aquele que está acima de todas as ameaças.",
  "Guia": "A Palavra de Deus é como um farol na escuridão. Sem ela, andamos à toa. Com ela, temos direção segura para cada passo da vida.",
  "Confiança": "Confiar em Deus é um ato de rendição. Significa admitir que nossos limites são reais e que o conhecimento de Deus é infinito. É submeter cada área da vida à Sua soberania.",
  "Propósitos": "Deus tem planos para cada vida. Esses planos não são para nosso dano, mas para nosso bem. A chave é alinhar nossos propósitos aos dEle.",
  "Coragem": "Deus não nos dá um espírito de covardia, mas de fortaleza. A coragem não é ausência de medo, mas agir apesar dele, confiando na presença divina.",
  "Ansiedade": "Jesus reconhece que a vida terrena traz preocupações, mas nos convida a depositar nossos cuidados nEle. A oração é o antídoto para a ansiedade.",
  "Descanso": "O descanso de Cristo não é inatividade, mas libertação da carga do legalismo e do pecado. É descansar na graça, não no próprio esforço.",
  "Missão": "A Grande Comissão não é opcional — é o mandamento final de Jesus. Cada crente é chamado a ser instrumento de Sua mensagem.",
  "Serviço": "A grandeza no Reino de Deus se mede pela capacidade de se diminuir para servir. O maior exemplo é a própria cruz.",
  "Poder": "A ressurreição de Lázaro mostra que nada é impossível para Deus. O mesmo poder que ressuscitou Cristo habita em nós.",
  "Generosidade": "Deus opera com o princípio da semeadura: quem semea generosamente colhe generosamente. A generosidade não empobrece — enriquece.",
  "Amor": "O amor de Deus é sacrificial, incondicional eterno. É o modelo para todo amor humano.",
  "Luz": "Jesus é a luz que dissipa as trevas do pecado e da ignorância. Segui-Lo é caminhar na verdade.",
  "Vida": "A vida cristã não é sobre restrições, mas sobre abundância. Em Cristo encontramos o verdadeiro propósito da existência.",
  "Caminho": "Jesus não é apenas um guia — Ele é o caminho. Não há acesso ao Pai senão por Ele.",
  "Dependência": "A videira e os Ramos ilustram a dependência total de Cristo. Sem Ele, nada podemos fazer.",
  "Testemunho": "O Espírito Santo nos dá poder para ser testemunhas. Não depende das nossas forças, mas da Sua capacidade.",
  "Graça": "A salvação é um dom gratuito de Deus. Não podemos ganhá-la — apenas recebê-la com fé.",
  "Propósito": "Deus transforma o que o mundo descarta. Até os erros servem aos Seus propósitos eternos.",
  "Frutos": "Os frutos do Espírito são o caráter de Cristo se manifestando em nós. Não são frutos do esforço humano, mas da obra do Espírito.",
  "Força": "A força de Deus se aperfeiçoara na nossa fraqueza. Reconhecer nossa limitação é o início da verdadeira fortaleza.",
  "Oração": "A oração não muda Deus — ela nos muda. Começamos a ver as circunstâncias com os olhos de Deus.",
  "Trabalho": "Todo trabalho deve ser feito como se fosse para o Senhor. Não há distinção entre sagrado e profano na vida do crente.",
  "Gratidão": "A gratidão muda nossa perspectiva. Em vez de focar no que falta, vemos o que Deus já fez.",
  "Perseverança": "A perseverança é a virtude que só se aprende na tribulação. Ninguém nasce perseverante — se torna perseverante através dos testes.",
  "Sabedoria": "A sabedoria divina é mais valiosa que o ouro. Ela governa como usamos tudo o mais.",
  "Resistência": "A resistência ao mal começa com a submissão a Deus. Quando nos aproximamos dEle, o inimigo foge.",
  "Santidade": "Santidade não é perfeição moral, mas uma vida que reflete o caráter de Deus no meio do mundo.",
  "Carga": "Deus nos convida a lançar nossos cuidados sobre Ele. Não fomos feitos para carregar sozinhos.",
  "Desejos": "Deus satisfaz os desejos do coração que estão alinhados com a Sua vontade.",
  "Comunhão": "A fé se fortalece na comunhão. Assim como o ferro afia o ferro, os irmãos na fé se mutuamente.",
  "Tempo": "Deus tem um tempo para cada coisa. A paciência é confiar que Ele está no controle do relógio.",
  "Testemunho": "Nossa vida deve ser uma luz que aponta para Cristo. Não apenas palavras, mas atitudes que refletem o evangelho.",
  "Prioridade": "Quando Deus é primeiro, tudo o mais se encaixa. A ordem dos afetos determina a ordem da vida.",
  "Coração": "Onde está o teu tesouro, ali estará o teu coração. Nossos investimentos revelam nossas prioridades.",
  "Encarnação": "O Verbo se fez carne para que pudéssemos conhecer a Deus pessoalmente. A encarnação é o maior ato de humildade divina.",
  "Salvação": "O salário do pecado é a morte, mas o dom de Deus é a vida eterna em Cristo Jesus.",
  "Esperança": "Deus é a fonte de toda esperança. Ele enche nossa vida de alegria e paz mediante a confiança nEle.",
  "Firmes": "O trabalho no Senhor não é em vão. Mesmo quando não vemos resultados imediatos, Deus está agindo.",
  "Nova Criatura": "Em Cristo, somos novas criaturas. O passado não define quem somos — a graça de Deus nos redefine.",
  "Poder": "Deus pode fazer infinitamente mais do que podemos imaginar ou pensar. O limite está na nossa fé, não no Seu poder.",
  "Futuro": "O que ficou para trás não nos define. O que importa é o chamado à frente: ganhar a corrida da fé.",
  "Paz": "A paz de Cristo deve reinar em nossos corações. Ela é a autoridade que governa nossas decisões.",
  "Volta": "A volta de Cristo é a esperança da Igreja. Vivemos no 'já' e no 'ainda não' da redenção.",
  "Combate": "A vida cristã é um combate espiritual. O crente maduro reconhece a batalha e permanece firme até o fim.",
  "Palavra": "A Palavra de Deus é viva e eficaz. Ela penetra até os mais profundos recessos do coração.",
  "Oração": "A oração do justo pode muito em seus efeitos. A comunhão com Deus transforma realidades.",
  "Identidade": "Somos um povo escolhido, sacerdócio real. Nossa identidade não está em nós mesmos, mas em Cristo.",
  "Paciência": "Deus é paciente porque não deseja que nenhum pereça, mas que todos se arrependam.",
  "Perdão": "Deus é fiel e justo para perdoar nossos pecados e nos purificar de toda injustiça.",
  "Consolação": "A nova criação eliminará todo sofrimento. Deus enxugará todas as lágrimas."
};

function parseReference(ref) {
  const match = ref.match(/^(\d?\s*\w+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verseStart: parseInt(match[3]),
    verseEnd: match[4] ? parseInt(match[4]) : parseInt(match[3])
  };
}

async function fetchVerse(reference) {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  const bookMap = {
    "Salmos": "psa", "Salmo": "psa", "Provérbios": "pro", "Isaías": "isa",
    "Jeremias": "jer", "Mateus": "mat", "Marcos": "mar", "Lucas": "luk",
    "João": "jhn", "Atos": "act", "Romanos": "rom", "1 Coríntios": "1co",
    "2 Coríntios": "2co", "Gálatas": "gal", "Efésios": "eph", "Filipenses": "php",
    "Colossenses": "col", "1 Tessalonicenses": "1th", "2 Tessalonicenses": "2th",
    "1 Timóteo": "1ti", "2 Timóteo": "2ti", "Tito": "tit", "Filemom": "phm",
    "Hebreus": "heb", "Tiago": "jas", "1 Pedro": "1pe", "2 Pedro": "2pe",
    "1 João": "1jn", "2 João": "2jn", "3 João": "3jn", "Judas": "jud",
    "Apocalipse": "rev", "Eclesiastes": "ecc"
  };

  const bookAbbr = bookMap[parsed.book] || parsed.book.toLowerCase();
  const verses = parsed.verseEnd > parsed.verseStart
    ? `${parsed.verseStart}-${parsed.verseEnd}`
    : `${parsed.verseStart}`;

  const url = `https://bible-api.com/${bookAbbr}+${parsed.chapter}:${verses}?translation=almeida`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) return null;
    return {
      text: data.text.trim(),
      reference: data.reference
    };
  } catch (e) {
    return null;
  }
}

function generateCommentary(theme) {
  const shuffled = [...COMMENTATORS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  const insight = THEOLOGICAL_INSIGHTS[theme] || "A Palavra de Deus é viva e eficaz, penetrando até os mais profundos recessos do coração.";

  return selected.map(c => ({
    author: c.name,
    text: `${c.style.charAt(0).toUpperCase() + c.style.slice(1)}: ${insight}`
  }));
}

function generateReflection(theme, scripture) {
  const reflections = {
    "Pastor": "O cuidado de Deus como pastor nos lembra que nunca estamos sós. Ele conhece nossas necessidades, guia nossos passos e nos restastra quando nos perdemos. Confie no Seu cuidado today.",
    "Paz": "A paz de Deus não depende das circunstâncias externas, mas da Sua presença interna. Quando oramos, trocamos ansiedade por confiança.",
    "Proteção": "Deus é nosso refúgio seguro. Não importa a tempestade, Ele está conosco. Sua proteção não é ausência de perigo, mas presença no perigo.",
    "Confiança": "A confiança em Deus é um ato diário de rendição. Não é cega nem irracional — é o reconhecimento honesto de que Ele é soberano e nós não.",
    "Amor": "O amor de Deus é o modelo para todo amor humano. É sacrificial, incondicional e eterno. Quando amamos como Ele ama, refletimos Sua natureza.",
    "Luz": "Jesus é a luz que dissipa as trevas. Segui-Lo é caminhar na verdade, na vida e na direção certa.",
    "Vida": "A vida abundante que Jesus promete não é sobre bens materiais, mas sobre plenitude espiritual. É viver com propósito e significado.",
    "Oração": "A oração é a linha direta com Deus. É onde trocamos ansiedade por paz, controle por rendição.",
    "Força": "Deus dá forças para o que Ele chama. Não depende das nossas capacidades, mas da Sua provisão.",
    "Perseverança": "A perseverança é forjada nas dificuldades. Cada trial é uma oportunidade para crescer na fé.",
    "Sabedoria": "A sabedoria divina guia nossas decisões. Pedir sabedoria é reconhecer que precisamos de direção divina.",
    "Frutos": "Os frutos do Espírito são o caráter de Cristo se manifestando em nós. São o resultado natural de uma vida conectada à videira.",
    "Generosidade": "Deus opera com o princípio da semeadura. Quem semea generosamente colhe generosamente.",
    "Coragem": "A coragem não é ausência de medo, mas agir apesar dele, confiando na presença divina.",
    "Missão": "Somos chamados a ser instrumentos de Sua mensagem. Cada crente é missionário.",
    "Identidade": "Nossa identidade não está em nós mesmos, mas em Cristo. Somos filhos de Deus, escolhidos e amados.",
    "Perdão": "Deus perdoa completamente. O perdão divino é o modelo para nosso perdão mútuo.",
    "Esperança": "A esperança cristã não é desejo vago, mas certeza baseada na fidelidade de Deus.",
    "Futuro": "O que ficou para trás não nos define. O que importa é o chamado à frente.",
    "Paciência": "Deus é paciente porque não deseja que nenhum pereça. Sua paciência é uma oportunidade de arrependimento.",
    "Consolação": "A nova criação eliminará todo sofrimento. Deus enxugará todas as lágrimas.",
    "Caminho": "Jesus não é apenas um guia — Ele é o caminho. Não há acesso ao Pai senão por Ele.",
    "Dependência": "A videira e os Ramos ilustram a dependência total de Cristo. Sem Ele, nada podemos fazer.",
    "Testemunho": "O Espírito Santo nos dá poder para ser testemunhas. Não depende das nossas forças, mas da Sua capacidade.",
    "Graça": "A salvação é um dom gratuito de Deus. Não podemos ganhá-la — apenas recebê-la com fé.",
    "Propósito": "Deus transforma o que o mundo descarta. Até os erros servem aos Seus propósitos eternos.",
    "Coração": "Onde está o teu tesouro, ali estará o teu coração. Nossos investimentos revelam nossas prioridades.",
    "Trabalho": "Todo trabalho deve ser feito como se fosse para o Senhor. Não há distinção entre sagrado e profano.",
    "Gratidão": "A gratidão muda nossa perspectiva. Em vez de focar no que falta, vemos o que Deus já fez.",
    "Desejos": "Deus satisfaz os desejos do coração que estão alinhados com a Sua vontade.",
    "Comunhão": "A fé se fortalece na comunhão. Assim como o ferro afia o ferro.",
    "Tempo": "Deus tem um tempo para cada coisa. A paciência é confiar que Ele está no controle do relógio.",
    "Prioridade": "Quando Deus é primeiro, tudo o mais se encaixa. A ordem dos afetos determina a ordem da vida.",
    "Encarnação": "O Verbo se fez carne para que pudéssemos conhecer a Deus pessoalmente.",
    "Salvação": "O salário do pecado é a morte, mas o dom de Deus é a vida eterna em Cristo Jesus.",
    "Firmes": "O trabalho no Senhor não é em vão. Mesmo quando não vemos resultados imediatos, Deus está agindo.",
    "Nova Criatura": "Em Cristo, somos novas criaturas. O passado não define quem somos — a graça de Deus nos redefine.",
    "Poder": "Deus pode fazer infinitamente mais do que podemos imaginar. O limite está na nossa fé, não no Seu poder.",
    "Volta": "A volta de Cristo é a esperança da Igreja. Vivemos no 'já' e no 'ainda não' da redenção.",
    "Combate": "A vida cristã é um combate espiritual. O crente maduro reconhece a batalha e permanece firme.",
    "Palavra": "A Palavra de Deus é viva e eficaz. Ela penetra até os mais profundos recessos do coração.",
    "Resistência": "A resistência ao mal começa com a submissão a Deus. Quando nos aproximamos dEle, o inimigo foge.",
    "Santidade": "Santidade não é perfeição moral, mas uma vida que reflete o caráter de Deus no meio do mundo.",
    "Carga": "Deus nos convida a lançar nossos cuidados sobre Ele. Não fomos feitos para carregar sozinhos."
  };

  return reflections[theme] || "A Palavra de Deus é viva e eficaz, penetrando até os mais profundos recessos do coração. Medite hoje na verdade que Deus quer revelar para você.";
}

async function generateDevotional(ref, index) {
  const verseData = await fetchVerse(ref.reference);
  if (!verseData) {
    console.log(`Erro ao buscar: ${ref.reference}`);
    return null;
  }

  const commentary = generateCommentary(ref.theme);
  const reflection = generateReflection(ref.theme, verseData.text);

  return {
    id: `auto-${index}-${ref.theme.toLowerCase().replace(/\s+/g, '-')}`,
    title: ref.title,
    theme: ref.theme,
    reference: verseData.reference,
    image: IMAGES[index % IMAGES.length],
    scripture: verseData.text,
    context: `Reflexão sobre ${ref.theme.toLowerCase()} baseada em ${verseData.reference}. A Palavra de Deus é viva e eficaz, trazendo direção e conforto para a nossa jornada de fé.`,
    commentary: commentary,
    reflection: reflection,
    application: [
      `Leia ${verseData.reference} em voz alta e medite sobre as palavras.`,
      `Pergunte-se: como essa verdade se aplica à minha vida hoje?`,
      `Compartilhe o que aprendeu com alguém próximo.`
    ],
    prayer: `Senhor, ajuda-me a viver a verdade de ${verseData.reference} hoje. Que Tua Palavra transforme meu coração e guie meus passos. Em nome de Jesus. Amém.`,
    author: "Pr. Marco Lima"
  };
}

async function main() {
  console.log('Gerando devocionais a partir da API da Bíblia...\n');

  const startIdx = existing.length;
  const newDevotionals = [];

  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    console.log(`${i + 1}/${references.length} - ${ref.reference} (${ref.theme})`);

    const dev = await generateDevotional(ref, startIdx + i);
    if (dev) {
      newDevotionals.push(dev);
      console.log(`  ✓ Gerado: ${dev.title}`);
    } else {
      console.log(`  ✗ Erro ao gerar`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  const allDevotionals = [...existing, ...newDevotionals];
  fs.writeFileSync(
    path.join(__dirname, 'data/devocionais.json'),
    JSON.stringify(allDevotionals, null, 2),
    'utf8'
  );

  console.log(`\nTotal: ${allDevotionals.length} devocionais (${existing.length} existentes + ${newDevotionals.length} novos)`);
}

main().catch(console.error);
