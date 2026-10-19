// Build di Teoria delle Corde: gira sui server di Vercel a ogni pubblicazione.
//
// Scarica da Google Fonts i tre font del sito (Big Shoulders Display, Figtree, JetBrains Mono)
// e li salva in public/fonts/ con nomi basati sul contenuto. Così i font sono serviti dal
// nostro dominio e il browser dei visitatori non contatta Google. Poi sostituisce il segnaposto
// <!--FONTS--> nelle pagine HTML con i link ai font.
//
// Inserisce anche nella pagina l'elenco delle racchette (senza range e schede) e i conteggi del
// catalogo, presi dal motore in lib/motore.js: il motore resta sul server.
// Se qualcosa va storto la build si ferma e resta online la versione precedente del sito.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import motore from './lib/motore.js';

const PUBLIC = 'public';
const FONT_DIR = path.join(PUBLIC, 'fonts');
const PLACEHOLDER = '<!--FONTS-->';
const CSS_URL = 'https://fonts.googleapis.com/css2'
  + '?family=Big+Shoulders+Display:wght@600;800'
  + '&family=Figtree:wght@400;500;600;700'
  + '&family=JetBrains+Mono:wght@500'
  + '&display=swap';
// Con un browser moderno Google risponde con file woff2 divisi per alfabeto (unicode-range).
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// Font usati subito nella prima schermata: li precarichiamo (solo alfabeto latino).
const PRELOAD = new Set(['Figtree', 'Big Shoulders Display']);
const FONT_URL = /url\((https:\/\/fonts\.gstatic\.com\/[^)\s'"]+)\)/g;

const hash = data => createHash('sha256').update(data).digest('hex').slice(0, 16);

async function download(url, asText) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return asText ? await res.text() : Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      await new Promise(r => setTimeout(r, 800 * attempt));
    }
  }
  throw new Error(`Download non riuscito: ${url} (${lastError && lastError.message})`);
}

/* ---------- Dati per la pagina ---------- */
{
  const file = path.join(PUBLIC, 'index.html');
  let html = await readFile(file, 'utf8');
  const inserisci = (nome, valore) => {
    const re = new RegExp(`/\\*${nome}\\*/[\\s\\S]*?/\\*FINE\\*/`);
    if (!re.test(html)) throw new Error(`index.html: manca il segnaposto ${nome}`);
    html = html.replace(re, () => JSON.stringify(valore));
  };
  inserisci('RACCHETTE', motore.RACCHETTE_PUBBLICHE);
  inserisci('CONTEGGI', motore.CONTEGGI);
  await writeFile(file, html);
  console.log(`Pagina: ${motore.RACCHETTE_PUBBLICHE.length} racchette, ${motore.CONTEGGI.corde} corde di ${motore.CONTEGGI.marche} marche`);
}

/* ---------- Font ---------- */
const css = await download(CSS_URL, true);
const urls = [...new Set([...css.matchAll(FONT_URL)].map(m => m[1]))];
if (!urls.length) throw new Error('Il CSS di Google Fonts non contiene file di font');
for (const family of ['Big Shoulders Display', 'Figtree', 'JetBrains Mono']) {
  if (!css.includes(family)) throw new Error(`Font mancante nella risposta di Google: ${family}`);
}

await mkdir(FONT_DIR, { recursive: true });
const local = new Map();
let bytes = 0;
for (const url of urls) {
  const buf = await download(url, false);
  if (buf.length < 1024) throw new Error(`File di font troppo piccolo (${buf.length} byte): ${url}`);
  const ext = path.extname(new URL(url).pathname) || '.woff2';
  const name = `${hash(buf)}${ext}`;
  await writeFile(path.join(FONT_DIR, name), buf);
  local.set(url, `/fonts/${name}`);
  bytes += buf.length;
}

let outCss = css;
for (const [url, rel] of local) outCss = outCss.split(url).join(rel);
if (outCss.includes('fonts.gstatic.com')) throw new Error('Nel CSS dei font restano indirizzi di Google');
outCss = '/* Big Shoulders Display, Figtree e JetBrains Mono: SIL Open Font License 1.1.\n'
  + '   Copia locale creata in fase di build a partire da Google Fonts. */\n' + outCss;
const cssName = `${hash(outCss)}.css`;
await writeFile(path.join(FONT_DIR, cssName), outCss);

// Precarico: blocchi @font-face preceduti dal commento /* latin */
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)].map(([, subset, body]) => ({
  subset,
  family: (body.match(/font-family:\s*['"]?([^;'"]+?)['"]?\s*;/) || [])[1],
  url: (body.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)\s'"]+)\)/) || [])[1],
}));
const preload = [...new Set(blocks
  .filter(b => b.subset === 'latin' && PRELOAD.has(b.family) && b.url && b.url.endsWith('.woff2'))
  .map(b => local.get(b.url)))];

const tags = [
  ...preload.map(href => `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`),
  `<link rel="stylesheet" href="/fonts/${cssName}">`,
].join('\n');

const pages = (await readdir(PUBLIC)).filter(f => f.endsWith('.html'));
for (const page of pages) {
  const file = path.join(PUBLIC, page);
  const html = await readFile(file, 'utf8');
  if (!html.includes(PLACEHOLDER)) throw new Error(`${page}: manca il segnaposto ${PLACEHOLDER}`);
  await writeFile(file, html.replace(PLACEHOLDER, tags));
}

// Piccolo resoconto della build, leggibile su /build.txt per controllare che i font siano a posto.
const report = [
  'Teoria delle Corde: resoconto della build',
  `data: ${new Date().toISOString()}`,
  `commit: ${(process.env.VERCEL_GIT_COMMIT_SHA || 'locale').slice(0, 7)}`,
  `font: ${local.size} file, ${Math.round(bytes / 1024)} KB`,
  `foglio: /fonts/${cssName}`,
  `precaricati: ${preload.join(', ') || 'nessuno'}`,
  `pagine: ${pages.join(', ')}`,
].join('\n') + '\n';
await writeFile(path.join(PUBLIC, 'build.txt'), report);

console.log(`Font locali: ${local.size} file (${Math.round(bytes / 1024)} KB), ${preload.length} precaricati, foglio /fonts/${cssName}`);
console.log(`Pagine aggiornate: ${pages.join(', ')}`);
