const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Read current devocionais
const currentData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devocionais.json'), 'utf8'));

// Read GPT lote files
const lote1 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devocionais-lote-001.json'), 'utf8'));
const lote2 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devocionais-lote-002.json'), 'utf8'));

const allGptDevotionals = [...lote1.devocionais, ...lote2.devocionais];

console.log(`Current devotionals: ${currentData.length}`);
console.log(`GPT devotionals to merge: ${allGptDevotionals.length}`);

// Build a map of existing devotionals by dia (e.g., "dia-001")
const existingMap = new Map();
currentData.forEach(d => {
  const dia = d.id.split('-').slice(0, 2).join('-'); // "dia-001"
  existingMap.set(dia, d);
});

// Convert GPT format to site format
function convertGptToSite(gpt) {
  const dia = gpt.dia; // "dia-001"
  const data = gpt.data; // "2026-06-01"
  const id = `${dia}-${data}`;
  const slug = gpt.slug || `${dia}-${gpt.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const image = `assets/devotional-images/${slug}.svg`;
  const imageAlt = `Arte devocional única sobre ${gpt.tema}, baseada em ${gpt.referencia}, para ${gpt.titulo}.`;

  return {
    id,
    title: gpt.titulo,
    theme: gpt.tema,
    reference: gpt.referencia,
    image,
    imageAlt,
    scripture: gpt.versiculo,
    reflection: gpt.devocional,
    application: gpt.aplicacao,
    prayer: gpt.oracao,
    author: "Pr. Marco Lima"
  };
}

// Merge: keep existing image paths, update content
const merged = currentData.map(d => {
  const dia = d.id.split('-').slice(0, 2).join('-');
  const gptDev = allGptDevotionals.find(g => g.dia === dia);

  if (!gptDev) return d;

  const converted = convertGptToSite(gptDev);

  // Keep existing image if it exists, otherwise use new one
  const imageExists = fs.existsSync(path.join(__dirname, '..', d.image));
  if (imageExists) {
    converted.image = d.image;
    converted.imageAlt = d.imageAlt;
  }

  return converted;
});

// Write merged data
fs.writeFileSync(
  path.join(DATA_DIR, 'devocionais.json'),
  JSON.stringify(merged, null, 2),
  'utf8'
);

console.log(`\nMerged ${merged.length} devotionals`);
console.log(`Updated fields: title, theme, reference, scripture, reflection, application, prayer`);
console.log(`Preserved existing images where they exist`);
