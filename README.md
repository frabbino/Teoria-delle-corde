# Teoria delle Corde

Sito: https://www.teoriadellecorde.com (anche teoriadellecorde.com, che rimanda qui)

Questionario per tennisti: in base al gioco e alla racchetta suggerisce tipo di corda, calibro,
tensione in kg e modelli in commercio. Consigli basati sulla teoria, non ricette.

## Come è fatto

- `public/` contiene il sito, così come viene pubblicato:
  - `index.html`: pagina con il questionario. Manda le risposte a `/api/consiglio` e mostra il risultato.
    L'elenco delle racchette e i conteggi del catalogo li inserisce la build.
  - `privacy.html`: privacy e note legali.
  - `404.html`, icone, `og.png` (anteprima per i social), `robots.txt`, `sitemap.xml`.
- `api/consiglio.js` è la funzione che calcola il consiglio (regione Francoforte, `fra1`).
- `lib/motore.js` contiene il motore: archivio delle racchette, catalogo delle corde, pesi e regole.
  Resta sul server e non viene mai mandato al browser.
- `build.mjs` gira su Vercel a ogni pubblicazione. Scarica i font da Google Fonts e li mette in
  `public/fonts/`, così il sito non fa contattare Google ai visitatori. Alla fine scrive
  `/build.txt`, un breve resoconto (commit, font, pagine) per controllare la pubblicazione.
- `vercel.json` contiene le impostazioni di pubblicazione: indirizzi senza `.html`, regione delle
  funzioni (Francoforte), cache dei font e intestazioni di sicurezza.

## Pubblicare una modifica

Ogni commit sul ramo `main` viene pubblicato automaticamente da Vercel.
