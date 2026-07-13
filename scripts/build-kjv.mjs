// Regenerates data/bible/kjv.json — the committed, self-contained KJV text used
// to render the "Read the Passage" tab on sermon pages.
//
// Source: https://github.com/aruljohn/Bible-kjv (clean public-domain KJV, one
// JSON file per book). We download all 66 books and flatten them into a single
// lookup object shaped for verse-range extraction:
//
//   { "<Book>": { "<chapter>": { "<verse>": "text", ... }, ... }, ... }
//
// Book keys are aruljohn's display names ("1 Corinthians", "Song of Solomon",
// "Psalms"). The KJV is public domain in the US, so the text is committed to the
// repo and the site build never touches the network. That repo rarely changes;
// re-run this only to refresh:  node scripts/build-kjv.mjs
//
// No submodule: we pull the raw files at run time and keep only our formatted
// output under version control.

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges',
  'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles',
  '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
  'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

const RAW_BASE = 'https://raw.githubusercontent.com/aruljohn/Bible-kjv/master';

const outPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'data',
  'bible',
  'kjv.json',
);

async function fetchBook(name) {
  const file = `${name.replace(/ /g, '')}.json`;
  const res = await fetch(`${RAW_BASE}/${file}`);
  if (!res.ok) throw new Error(`${file} -> HTTP ${res.status}`);
  return res.json();
}

const bible = {};
let verseCount = 0;

for (const name of BOOKS) {
  const data = await fetchBook(name);
  const chapters = {};
  for (const ch of data.chapters) {
    const verses = {};
    for (const v of ch.verses) {
      verses[v.verse] = v.text;
      verseCount++;
    }
    chapters[ch.chapter] = verses;
  }
  bible[name] = chapters;
  process.stdout.write(`\r${Object.keys(bible).length}/${BOOKS.length} books`);
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, JSON.stringify(bible));

const { size } = await import('node:fs').then((fs) => fs.promises.stat(outPath));
console.log(
  `\nWrote ${outPath}\n${Object.keys(bible).length} books, ${verseCount} verses, ${(size / 1024 / 1024).toFixed(2)} MB`,
);
