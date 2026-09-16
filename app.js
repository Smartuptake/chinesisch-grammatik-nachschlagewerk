/* ==========================================================================
   Mandarin Maverick – Fast Track Chinese
   app.js · Grammatik-Nachschlagewerk

   Drei Ansichten, die ueber die Adresszeile auseinandergehalten werden:
     #/                  Inhaltsverzeichnis
     #/suche/<Eingabe>   Trefferliste
     #/kapitel/<Nr>      ein Kapitel
   Weil jede Ansicht eine eigene Adresse hat, arbeitet der Zurueck-Knopf des
   Browsers wie erwartet, und jedes Kapitel laesst sich einzeln verlinken.

   DIE SUCHE
   Sie kennt drei Eingaben, ohne dass man ihr sagen muesste, welche es ist:
     Stichwort in Pinyin   „ba", „yinwei", „le"      — Toene sind gleichgueltig
     Stichwort auf Deutsch „Vergangenheit", „obwohl"
     ganzer Satz           „Wǒ bǎ shū fàng zài zhuōzi shàng."
                           „Ich habe das Buch auf den Tisch gelegt."
   Jedes Wort der Eingabe wird nach seiner Seltenheit gewichtet (idf): ein
   Satz besteht groesstenteils aus Woertern, die in fast jedem Kapitel stehen
   — die tragen nichts bei. Uebrig bleibt das Wort, das die Struktur ausmacht,
   und genau das entscheidet ueber den Treffer. Zusaetzlich zaehlt, in welchem
   Feld ein Wort steht: im Titel schwerer als in einem Uebungssatz.
   ========================================================================== */

(function () {
'use strict';

const KAP = window.MM_GRAMMATIK || [];
const STICH = window.MM_STICHWORTE || {};

/* --------------------------------------------------------------------------
   1  Normalisierung
   Toene, Umlaute und Satzzeichen fallen weg. Weil „zähl…" und „zaehl…"
   beide vorkommen duerfen, traegt jedes Wort zwei Schluessel.
   -------------------------------------------------------------------------- */

function entton(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function schluessel(wort) {
  const a = entton(wort);
  const b = entton(wort.replace(/ä/g, 'ae').replace(/ö/g, 'oe')
                       .replace(/ü/g, 'ue').replace(/ß/g, 'ss'));
  return a === b ? [a] : [a, b];
}

function woerter(text) {
  return String(text).toLowerCase()
    .replace(/[0-5]/g, ' ')              /* Tonzahlen wie „le5" */
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim().split(/\s+/).filter(w => w.length > 1 || /[一-鿿]/.test(w));
}

/* --------------------------------------------------------------------------
   2  Index
   Je Kapitel eine Tabelle Wort → Gewicht. Die Gewichte spiegeln, wie sehr
   ein Fundort fuer das Kapitel steht.
   -------------------------------------------------------------------------- */

/* Ein Eintrag in stichworte.js wiegt am schwersten — er ist eine bewusste
   Zuordnung („dieses Kapitel handelt davon") und muss ein beilaeufiges
   Vorkommen im Fliesstext eines anderen Kapitels schlagen. */
const GEWICHT = {
  stichwort: 20, titel: 12, formel: 6, frage: 4,
  zwischentitel: 3, text: 2, beispiel: 1, hsk: 2,
};

const index = [];     /* index[i] = Map(wort → gewicht) fuer KAP[i] */
const df = new Map(); /* Wort → in wie vielen Kapiteln es vorkommt */

function eintragen(map, text, gewicht) {
  for (const w of woerter(text)) {
    for (const k of schluessel(w)) {
      map.set(k, (map.get(k) || 0) + gewicht);
    }
  }
}

function zeilenText(z) {
  return z.r.map(r => r[0]).join('');
}

KAP.forEach((k, i) => {
  const map = new Map();
  eintragen(map, k.titel, GEWICHT.titel);
  eintragen(map, STICH[k.nr] || '', GEWICHT.stichwort);
  eintragen(map, k.hsk || '', GEWICHT.hsk);

  for (const a of k.abschnitte) {
    if (a.typ === 'formel') {
      eintragen(map, a.kopf, GEWICHT.formel);
    } else if (a.typ === 'tabelle') {
      for (const r of a.rows) eintragen(map, r.join(' '), GEWICHT.text);
    } else if (a.typ === 'uebung') {
      eintragen(map, a.kopf, GEWICHT.beispiel);
      for (const it of a.items) {
        for (const z of it.a.concat(it.l)) {
          eintragen(map, zeilenText(z), GEWICHT.beispiel);
        }
      }
    } else {
      const g = a.typ === 'frage' ? GEWICHT.frage
              : a.typ === 'titel' ? GEWICHT.zwischentitel : GEWICHT.text;
      if (a.kopf) eintragen(map, a.kopf, g);
      for (const z of (a.zeilen || [])) {
        eintragen(map, zeilenText(z), GEWICHT.text);
      }
    }
  }
  index[i] = map;
  for (const w of map.keys()) df.set(w, (df.get(w) || 0) + 1);
});

const N = KAP.length;

/* Seltenheit nach BM25. Der steile Abfall ist hier der entscheidende Punkt:
   gibt jemand einen ganzen deutschen Satz ein, bestehen drei Viertel davon
   aus „ich", „habe", „das" — Woertern, die in fast jedem Kapitel stehen.
   Sie muessen praktisch auf null fallen, sonst summieren sie sich zusammen
   und schlagen das eine seltene Wort, auf das es ankommt. */
function idf(w) {
  const d = df.get(w) || 0;
  if (!d) return 0;
  return Math.log(1 + (N - d + 0.5) / (d + 0.5));
}

/* --------------------------------------------------------------------------
   3  Funktionswoerter
   Gibt jemand einen ganzen deutschen Satz ein, tragen „ich", „habe", „auf"
   nichts zur Frage bei, summieren sich aber ueber ein Dutzend Woerter zu
   einem Gewicht, das das eine entscheidende Wort ueberstimmt. Sie werden
   deshalb gedaempft — unter drei Bedingungen, die zusammen verhindern, dass
   dabei ein gesuchter Begriff verlorengeht:

   1. Nur bei Eingaben ab drei Woertern. Wer „nicht" allein sucht, meint die
      Verneinung und soll sie bekommen. (Bei einem einzigen Wort waere die
      Daempfung ohnehin folgenlos — sie traefe jedes Kapitel gleich.)
   2. Nur bei Woertern, die in mehr als der Haelfte aller Kapitel stehen. Ein
      Wort, das nur ein Dutzend Kapitel kennen, ist nie blosses Fuellsel —
      „unter" und „gegen" etwa fuehren zu den Lage- und Richtungswoertern.
   3. Die Liste enthaelt kein Wort, das zugleich eine Pinyin-Silbe ist:
      „wo" (wǒ), „er" (èr), „du" (dú), „bei" (bèi), „wen" (wèn), „man" (màn)
      fehlen darin, sonst verloere ein chinesischer Satz seine Traeger.

   Nicht enthalten sind ausserdem alle Woerter, die in diesem Skript selbst
   Gegenstand eines Kapitels sind — „und", „oder", „aber", „auch", „schon",
   „nur", „noch", „dann", „wenn", „dass", „sondern", „selbst", „wieder",
   „mehr", „erst". Sie sehen wie Fuellsel aus, sind hier aber die Sache.
   -------------------------------------------------------------------------- */

const FUELL = new Set(('ich mich mir mein meinen meine dich dir dein deine ' +
  'deinen sich sie ihn ihm ihnen ihr ihre wir uns unser euch euer ' +
  'der die das den dem des ein eine einen einem einer eines ' +
  'bin bist ist sind war waren gewesen habe hast hat haben hatte hatten ' +
  'gehabt werde wirst wird werden wurde wurden worden ' +
  'am im vom zum zur beim ins ans in an auf aus mit fuer von ueber ' +
  'hier dort jetzt was wem wessen weshalb wieso ' +
  'es dabei daran darauf dazu damit').split(' '));

function fuellwort(keys) {
  return keys.some(k => FUELL.has(k) && (df.get(k) || 0) > N * 0.55);
}

/* --------------------------------------------------------------------------
   4  Suchen
   -------------------------------------------------------------------------- */

function suche(eingabe) {
  const roh = woerter(eingabe);
  if (!roh.length) return [];

  /* Jedes Eingabewort mit seinen Schreibvarianten und seinem Gewicht */
  const satz = roh.length >= 3;
  const begriffe = roh.map(function (w) {
    const keys = schluessel(w);
    return { wort: w, keys: keys,
             dach: (satz && fuellwort(keys)) ? 0.12 : 1 };
  });

  const treffer = [];
  for (let i = 0; i < N; i++) {
    const map = index[i];
    let punkte = 0, getroffen = 0;
    for (const b of begriffe) {
      let best = 0;
      for (const k of b.keys) {
        const g = map.get(k);
        /* Das Gewicht wird gedaempft: ein Wort, das dreissigmal im Kapitel
           steht, ist nicht dreissigmal so aussagekraeftig wie eines, das
           einmal vorkommt. */
        if (g) best = Math.max(best, Math.log(1 + g) * idf(k));
      }
      if (best > 0) { punkte += best * b.dach; getroffen += b.dach; }
    }
    if (!punkte) continue;

    /* Wie viel der Eingabe steckt im Kapitel? Ein Kapitel, das drei von
       vier gesuchten Woertern kennt, schlaegt eines mit nur einem. */
    const summe = begriffe.reduce((s2, b) => s2 + b.dach, 0) || 1;
    const deckung = Math.min(1, getroffen / summe);
    punkte *= 0.35 + 0.65 * deckung;

    /* Steht die Eingabe woertlich im Titel, ist die Sache entschieden. */
    const titel = entton(KAP[i].titel.toLowerCase());
    const frage = entton(eingabe.toLowerCase().trim());
    if (frage.length > 2 && titel.indexOf(frage) >= 0) punkte *= 2.2;

    treffer.push({ i: i, punkte: punkte, deckung: deckung });
  }

  treffer.sort((a, b) => b.punkte - a.punkte || KAP[a.i].nr - KAP[b.i].nr);

  /* Ausreisser nach unten abschneiden: was weniger als vier Prozent des
     besten Treffers holt, ist Rauschen und stiftet nur Verwirrung. */
  if (treffer.length) {
    const grenze = treffer[0].punkte * 0.04;
    return treffer.filter(t => t.punkte >= grenze).slice(0, 40);
  }
  return treffer;
}

/* Die Fundstelle, die den Treffer am besten belegt ---------------------- */

function belegZeile(kapIndex, begriffe) {
  const k = KAP[kapIndex];
  const kandidaten = [];
  for (const a of k.abschnitte) {
    if (a.typ === 'formel') kandidaten.push([a.kopf, 'Strukturformel', 3]);
    else if (a.typ === 'tabelle') continue;
    else if (a.typ === 'uebung') {
      for (const it of a.items) {
        for (const z of it.a.concat(it.l)) {
          kandidaten.push([zeilenText(z), 'Beispielsatz', 1]);
        }
      }
    } else {
      if (a.kopf) kandidaten.push([a.kopf, a.typ === 'frage' ? 'Leitfrage' : 'Abschnitt', 2]);
      for (const z of (a.zeilen || [])) kandidaten.push([zeilenText(z), 'Erklärung', 2]);
    }
  }
  let beste = null, bestwert = 0;
  for (const [text, art, gew] of kandidaten) {
    const ws = new Set();
    for (const w of woerter(text)) for (const s of schluessel(w)) ws.add(s);
    let wert = 0;
    for (const b of begriffe) {
      if (b.keys.some(k2 => ws.has(k2))) wert += idf(b.keys[0]) || 1;
    }
    wert *= gew;
    if (text.length > 240) wert *= 0.6;
    if (wert > bestwert) { bestwert = wert; beste = [text, art]; }
  }
  return beste;
}

/* --------------------------------------------------------------------------
   5  Darstellung
   -------------------------------------------------------------------------- */

const app = document.getElementById('mm-app');
const feld = document.getElementById('mm-suche');
const loeschen = document.getElementById('mm-loeschen');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Runs einer Zeile: Pinyin blau, Deutsch schwarz (Designhandbuch 3.3) */
function runsHtml(runs, marken) {
  return runs.map(r => {
    const t = marken ? markieren(r[0], marken) : esc(r[0]);
    return r[1] ? '<span class="pinyin">' + t + '</span>' : t;
  }).join('');
}

/* Gesuchte Woerter im Text hervorheben */
function markieren(text, begriffe) {
  if (!begriffe || !begriffe.length) return esc(text);
  let out = '';
  const teile = [];
  const re = /[\p{L}\p{N}]+/gu;
  let m, letzte = 0;
  while ((m = re.exec(text)) !== null) {
    const wort = m[0].toLowerCase();
    const keys = schluessel(wort);
    const treffer = begriffe.some(b => b.keys.some(k => keys.indexOf(k) >= 0));
    if (treffer) {
      teile.push([text.slice(letzte, m.index), false]);
      teile.push([m[0], true]);
      letzte = m.index + m[0].length;
    }
  }
  teile.push([text.slice(letzte), false]);
  for (const [t, mark] of teile) {
    out += mark ? '<mark>' + esc(t) + '</mark>' : esc(t);
  }
  return out;
}

/* „HSK 3.0: HSK 1 (一-14) · HSK 3 (三-05)" → „HSK 1–3"
   Das vorangestellte „HSK 3.0:" nennt die Fassung des Rahmenwerks, nicht
   eine Stufe — es muss weg, bevor gezaehlt wird. */
function hskKurz(hsk) {
  const stufen = (hsk.replace(/^HSK\s*3\.0\s*:/, '').match(/HSK\s*([1-9])/g) || [])
    .map(s => parseInt(s.replace(/\D/g, ''), 10))
    .filter(n => n >= 1 && n <= 9);
  const uniq = Array.from(new Set(stufen)).sort((a, b) => a - b);
  if (!uniq.length) return '';
  return uniq.length === 1 ? 'HSK ' + uniq[0]
                           : 'HSK ' + uniq[0] + '–' + uniq[uniq.length - 1];
}

/* „1./2" → „1./2." — das Skript schreibt die letzte Ziffer ohne Punkt. */
function ljZahl(lj) {
  return lj ? lj.split('/').map(t => t.replace(/\.$/, '') + '.').join('/') : '';
}
function ljLabel(lj) {
  return lj ? ljZahl(lj) + ' Lernjahr' : '';
}

/* --- Inhaltsverzeichnis ------------------------------------------------ */

let filterLj = '';

function zeigeVerzeichnis() {
  const gruppen = new Map();
  for (const k of KAP) {
    const g = k.lj || '–';
    if (!gruppen.has(g)) gruppen.set(g, []);
    gruppen.get(g).push(k);
  }
  const reihen = Array.from(gruppen.keys()).sort((a, b) => {
    const f = s => s === '–' ? 99 : parseFloat(s.split('/')[0]);
    return f(a) - f(b) || a.localeCompare(b);
  });

  const alleLj = reihen.filter(r => r !== '–');

  let h = '<div class="mm-titelzeile">' +
    '<h1>Grammatikstrukturen Chinesisch</h1>' +
    '<p>Das Nachschlagewerk zum Grammatikskript der Jahrgangsstufen 10 – 12. ' +
    KAP.length + ' Kapitel. Oben suchen — nach einem Wort auf Pinyin oder Deutsch, ' +
    'oder gleich mit einem ganzen Satz.</p></div>';

  h += '<div class="mm-filter"><span class="mm-filter-rubrik">Lernjahr:</span>' +
    '<button class="mm-knopf mm-knopf--still" data-lj="" aria-pressed="' +
    (filterLj === '') + '">alle</button>';
  for (const lj of alleLj) {
    h += '<button class="mm-knopf mm-knopf--still" data-lj="' + esc(lj) +
      '" aria-pressed="' + (filterLj === lj) + '" title="' + esc(ljLabel(lj)) +
      '">' + esc(ljZahl(lj)) + '</button>';
  }
  h += '</div>';

  for (const g of reihen) {
    if (filterLj && g !== filterLj) continue;
    const liste = gruppen.get(g);
    h += '<h2 class="mm-lj-titel">' +
      (g === '–' ? 'Ohne Zuordnung' : esc(ljLabel(g))) +
      '<span>' + liste.length + ' Kapitel</span></h2><ul class="mm-ivz">';
    for (const k of liste) {
      h += '<li><button class="mm-ivz-eintrag" data-kap="' + k.nr + '">' +
        '<span class="mm-ivz-nr">' + k.nr + '.</span>' +
        '<span class="mm-ivz-titel">' + esc(k.titel) + '</span>' +
        (k.hsk ? '<span class="mm-ivz-hsk">' + esc(hskKurz(k.hsk)) + '</span>' : '') +
        '</button></li>';
    }
    h += '</ul>';
  }
  app.innerHTML = h;
  document.title = 'Grammatikstrukturen Chinesisch · Mandarin Maverick';
}

/* --- Trefferliste ------------------------------------------------------ */

const BEISPIELE = ['le', 'bǎ', 'Vergangenheit', 'obwohl', 'Verneinung',
                   'wie lange', 'Wǒ bǎ shū fàng zài zhuōzi shàng.'];

function zeigeTreffer(frage) {
  const begriffe = woerter(frage).map(w => ({ wort: w, keys: schluessel(w) }));
  const ergebnis = suche(frage);

  let h = '<div class="mm-such-kopf"><h2>Suche nach „' + esc(frage) + '"</h2>' +
    '<span class="zahl">' + (ergebnis.length
      ? ergebnis.length + (ergebnis.length === 1 ? ' Kapitel' : ' Kapitel')
      : 'kein Treffer') + '</span>' +
    '<button class="mm-knopf mm-knopf--still" data-heim="1">☰ Inhaltsverzeichnis</button>' +
    '</div>';

  if (!ergebnis.length) {
    h += '<div class="mm-leer"><b>Dazu findet sich nichts.</b><br>' +
      'Versuche es mit einem einzelnen Wort — auf Pinyin ohne Töne oder auf Deutsch. ' +
      'Ganze Sätze gehen auch; entscheidend ist das Wort, das die Struktur ausmacht.' +
      '<div class="mm-vorschlaege">' +
      BEISPIELE.map(b => '<button class="mm-vorschlag" data-frage="' + esc(b) +
        '">' + esc(b) + '</button>').join('') +
      '</div></div>';
    app.innerHTML = h;
    return;
  }

  h += '<ul class="mm-treffer-liste">';
  ergebnis.forEach((t, rang) => {
    const k = KAP[t.i];
    const beleg = belegZeile(t.i, begriffe);
    h += '<li><button class="mm-treffer" data-kap="' + k.nr +
      '" data-frage="' + esc(frage) + '">' +
      '<span class="mm-treffer-kopf">' +
      '<span class="mm-treffer-nr">Kapitel ' + k.nr + '</span>' +
      '<span class="mm-treffer-titel">' + markieren(k.titel, begriffe) + '</span>' +
      (rang === 0 ? '<span class="mm-treffer-grund">bester Treffer</span>' : '') +
      (k.lj ? '<span class="mm-treffer-grund">' + esc(ljLabel(k.lj)) + '</span>' : '') +
      '</span>';
    if (beleg) {
      h += '<p class="mm-treffer-zeile"><em>' + esc(beleg[1]) + ':</em> ' +
        markieren(kuerzen(beleg[0], begriffe), begriffe) + '</p>';
    }
    h += '</button></li>';
  });
  h += '</ul>';
  app.innerHTML = h;
  document.title = 'Suche: ' + frage + ' · Grammatik Chinesisch';
}

/* Lange Fundstellen auf das Umfeld des Treffers kuerzen */
function kuerzen(text, begriffe, max) {
  max = max || 190;
  if (text.length <= max) return text;
  const tief = text.toLowerCase();
  let pos = -1;
  for (const b of begriffe) {
    const p = entton(tief).indexOf(b.keys[0]);
    if (p >= 0 && (pos < 0 || p < pos)) pos = p;
  }
  if (pos < 0) return text.slice(0, max) + ' …';
  const von = Math.max(0, pos - 60);
  return (von > 0 ? '… ' : '') + text.slice(von, von + max) + ' …';
}

/* --- Kapitel ----------------------------------------------------------- */

function zeigeKapitel(nr, frage) {
  const k = KAP.find(x => x.nr === nr);
  if (!k) { location.hash = '#/'; return; }
  const begriffe = frage
    ? woerter(frage).map(w => ({ wort: w, keys: schluessel(w) })) : null;

  let h = '<article class="mm-kapitel"><div class="mm-kapitel-kopf">' +
    '<div class="mm-kapitel-nr">Kapitel ' + k.nr + ' von ' + KAP.length + '</div>' +
    '<h1>' + markieren(k.titel, begriffe) + '</h1><div class="mm-marken">';
  if (k.lj) h += '<span class="mm-marke-chip">' + esc(ljLabel(k.lj)) + '</span>';
  if (k.hsk) h += '<span class="mm-marke-chip mm-marke-chip--hsk">' +
    esc(k.hsk.replace(/^HSK 3\.0:\s*/, 'HSK 3.0 · ')) + '</span>';
  if (k.seite) h += '<span class="mm-marke-chip mm-marke-chip--hsk">Skript S. ' +
    k.seite + '</span>';
  h += '</div></div>';

  const uebungen = [];

  for (const a of k.abschnitte) {
    if (a.typ === 'uebung') { uebungen.push(a); continue; }

    if (a.typ === 'formel') {
      h += '<div class="mm-formel">' + runsHtml(a.r, begriffe) + '</div>';
      continue;
    }
    if (a.typ === 'tabelle') {
      h += '<div class="mm-tabelle-huelle"><table class="mm-tabelle">';
      a.rows.forEach((r, i) => {
        const tag = i === 0 ? 'th' : 'td';
        h += (i === 0 ? '<thead>' : (i === 1 ? '<tbody>' : '')) + '<tr>' +
          r.map(c => '<' + tag + '>' + markieren(c, begriffe) + '</' + tag + '>').join('') +
          '</tr>' + (i === 0 ? '</thead>' : '');
      });
      h += '</tbody></table></div>';
      continue;
    }
    if (a.typ === 'merke') {
      h += '<div class="mm-merke"><b>Merke</b>' +
        (a.zeilen || []).map(z => '<p class="mm-zeile ' + z.l + '">' +
          runsHtml(z.r, begriffe) + '</p>').join('') + '</div>';
      continue;
    }

    h += '<section class="mm-abschnitt">';
    if (a.kopf) {
      h += a.typ === 'frage'
        ? '<h2 class="mm-frage">' + markieren(a.kopf, begriffe) + '</h2>'
        : '<h3 class="mm-zwischentitel">' + markieren(a.kopf, begriffe) + '</h3>';
    }
    for (const z of (a.zeilen || [])) {
      h += '<p class="mm-zeile ' + z.l + '">' + runsHtml(z.r, begriffe) + '</p>';
    }
    h += '</section>';
  }

  if (uebungen.length) {
    const anzahl = uebungen.reduce((s, a) => s + a.items.length, 0);
    h += '<details class="mm-uebungen"><summary>Übungen aus dem Skript' +
      '<span class="anzahl">' + anzahl + ' Aufgaben</span></summary>';
    uebungen.forEach((a, ai) => {
      h += '<div class="mm-uebung"><p class="mm-uebung-kopf">' +
        markieren(a.kopf, begriffe) + '</p><ul class="mm-aufgaben">';
      a.items.forEach((it, ii) => {
        const id = 'l-' + k.nr + '-' + ai + '-' + ii;
        h += '<li class="mm-aufgabe">' +
          it.a.map(z => '<p class="mm-aufgabe-text ' + z.l + '">' +
            runsHtml(z.r, begriffe) + '</p>').join('');
        if (it.l.length) {
          h += '<button class="mm-loesung-knopf" data-loesung="' + id +
            '" aria-expanded="false">Lösung zeigen</button>' +
            '<div class="mm-loesung" id="' + id + '" hidden>' +
            it.l.map(z => '<p class="' + z.l + '">' + runsHtml(z.r, begriffe) +
              '</p>').join('') + '</div>';
        } else {
          h += '<p class="mm-offen">Offene Aufgabe — im Skript ohne Lösung.</p>';
        }
        h += '</li>';
      });
      h += '</ul></div>';
    });
    h += '</details>';
  }

  /* Rueckweg — von hier aus gleich das naechste Kapitel nachschlagen */
  h += '<div class="mm-rueckweg">' +
    '<p class="hinweis">Weiter nachschlagen:</p>' +
    '<button class="mm-knopf mm-knopf--voll" data-neu="1">Neue Suche</button>' +
    '<button class="mm-knopf" data-heim="1">☰ Inhaltsverzeichnis</button>' +
    (frage ? '<button class="mm-knopf mm-knopf--still" data-frage="' + esc(frage) +
      '">zurück zu „' + esc(frage) + '"</button>' : '') +
    '</div>';

  const vor = KAP.find(x => x.nr === nr - 1);
  const nach = KAP.find(x => x.nr === nr + 1);
  h += '<div class="mm-nachbarn">';
  h += vor ? '<button class="mm-nachbar" data-kap="' + vor.nr +
    '"><span>← Kapitel ' + vor.nr + '</span>' + esc(vor.titel) + '</button>' : '<span></span>';
  h += nach ? '<button class="mm-nachbar mm-nachbar--weiter" data-kap="' + nach.nr +
    '"><span>Kapitel ' + nach.nr + ' →</span>' + esc(nach.titel) + '</button>' : '<span></span>';
  h += '</div></article>';

  app.innerHTML = h;
  document.title = k.nr + '. ' + k.titel + ' · Grammatik Chinesisch';

  /* Zur ersten Fundstelle rollen, wenn man aus der Suche kommt */
  if (begriffe) {
    const erste = app.querySelector('.mm-abschnitt mark, .mm-formel mark');
    if (erste) {
      const y = erste.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
    }
  }
}

/* --------------------------------------------------------------------------
   6  Wegfindung
   -------------------------------------------------------------------------- */

let letzteFrage = '';

function route() {
  const h = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (h.indexOf('/kapitel/') === 0) {
    const teile = h.slice(9).split('?');
    const nr = parseInt(teile[0], 10);
    const frage = teile[1] ? teile[1].replace(/^q=/, '') : '';
    if (frage) { letzteFrage = frage; feld.value = frage; }
    zeigeKapitel(nr, frage);
    if (!frage) window.scrollTo({ top: 0, behavior: 'auto' });
  } else if (h.indexOf('/suche/') === 0) {
    const frage = h.slice(7);
    letzteFrage = frage;
    if (feld.value !== frage) feld.value = frage;
    zeigeTreffer(frage);
    window.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    letzteFrage = '';
    zeigeVerzeichnis();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  loeschen.hidden = !feld.value;
}

function geheZuKapitel(nr, frage) {
  location.hash = '#/kapitel/' + nr + (frage ? '?q=' + encodeURIComponent(frage) : '');
}
function geheZurSuche(frage) {
  location.hash = '#/suche/' + encodeURIComponent(frage);
}
function geheHeim() { location.hash = '#/'; }

/* --------------------------------------------------------------------------
   7  Bedienung
   -------------------------------------------------------------------------- */

let tippTakt = null;

feld.addEventListener('input', function () {
  loeschen.hidden = !feld.value;
  clearTimeout(tippTakt);
  const wert = feld.value.trim();
  tippTakt = setTimeout(function () {
    if (!wert) { if (location.hash.indexOf('/suche/') > 0) geheHeim(); return; }
    geheZurSuche(wert);
  }, 180);
});

feld.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const wert = feld.value.trim();
    if (!wert) return;
    if (/^\d{1,3}$/.test(wert) && KAP.some(k => k.nr === +wert)) {
      feld.blur(); geheZuKapitel(+wert, ''); return;
    }
    const erg = suche(wert);
    if (erg.length) { feld.blur(); geheZuKapitel(KAP[erg[0].i].nr, wert); }
  } else if (e.key === 'Escape') {
    feld.value = ''; loeschen.hidden = true; feld.blur(); geheHeim();
  }
});

loeschen.addEventListener('click', function () {
  feld.value = ''; loeschen.hidden = true; feld.focus(); geheHeim();
});

document.addEventListener('click', function (e) {
  const z = e.target.closest('[data-kap], [data-heim], [data-frage], [data-neu],' +
                             ' [data-loesung], [data-lj]');
  if (!z) return;

  if (z.hasAttribute('data-loesung')) {
    const kasten = document.getElementById(z.getAttribute('data-loesung'));
    const offen = !kasten.hidden;
    kasten.hidden = offen;
    z.setAttribute('aria-expanded', String(!offen));
    z.textContent = offen ? 'Lösung zeigen' : 'Lösung verbergen';
    return;
  }
  if (z.hasAttribute('data-lj')) {
    filterLj = z.getAttribute('data-lj');
    zeigeVerzeichnis();
    return;
  }
  if (z.hasAttribute('data-neu')) {
    feld.focus(); feld.select();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (z.hasAttribute('data-heim')) { geheHeim(); return; }
  if (z.hasAttribute('data-kap')) {
    geheZuKapitel(+z.getAttribute('data-kap'), z.getAttribute('data-frage') || '');
    return;
  }
  if (z.hasAttribute('data-frage')) {
    const f = z.getAttribute('data-frage');
    feld.value = f; loeschen.hidden = false; geheZurSuche(f);
  }
});

/* Tastatur: „/" oder „s" springt ins Suchfeld, Esc fuehrt zurueck. */
document.addEventListener('keydown', function (e) {
  if (e.target === feld || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === '/' || e.key === 's' || e.key === 'S') {
    e.preventDefault(); feld.focus(); feld.select();
  } else if (e.key === 'Escape') {
    geheHeim();
  } else if (e.key === 'i' || e.key === 'I') {
    geheHeim();
  }
});

/* Sprung zum Seitenanfang */
const hoch = document.getElementById('mm-hoch');
window.addEventListener('scroll', function () {
  hoch.classList.toggle('sichtbar', window.scrollY > 600);
}, { passive: true });
hoch.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('hashchange', route);
route();

})();
