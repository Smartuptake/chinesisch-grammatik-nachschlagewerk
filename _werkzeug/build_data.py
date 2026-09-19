#!/usr/bin/env python3
"""Baut aus blocks.json die Kapiteldaten des Grammatik-Nachschlagewerks.

Aufruf:  python3 build_data.py blocks.json grammatik.json

WORAN DIE KAPITEL ERKANNT WERDEN
Seit der Fassung „HSK-Struktur" trägt jeder Kapiteltitel im Skript die Marken
!!!…!!!. Daran — und nur daran — werden die Kapitel geschnitten. Die
Textmarken _Toc_MM_### bleiben trotzdem wichtig: sie sind über alle Fassungen
hinweg dieselben und tragen deshalb die Zuordnung alter Kapitelnummern auf
neue (siehe `bm`). Ein Kapitel kann mehrere davon enthalten, seit die drei
chúfēi-Strukturen zu einem Kapitel zusammengefasst wurden.

Direkt unter dem Titel steht die Zeile
    HSK-Stufe/n: [HSK 3.0: HSK 1 · HSK 2 · HSK 4]
oder
    HSK-Stufe/n: [HSK 3.0: kein eigener Grammatikpunkt – ergänzender Stoff]
Daraus entstehen `hsk` (alle genannten Stufen) und `einstieg` (die niedrigste).
Nach `einstieg` ist das Skript sortiert; das Nachschlagewerk gliedert genauso.

Pinyin erkennt das Skript an der blauen Schriftfarbe. Jede Zeile behält ihre
Runs, damit Pinyin auch innerhalb eines deutschen Satzes blau bleibt — so
verlangt es das MM-Designhandbuch in Kapitel 3.3 und 3.4.
"""
import json, re, sys
from collections import Counter

blocks = json.load(open(sys.argv[1]))
OUT = sys.argv[2]

# --------------------------------------------------------------------------
# Sprache aus der Schriftfarbe
# --------------------------------------------------------------------------

def is_blue(col):
    if not col or col in ('auto', 'none'):
        return False
    try:
        r, g, bl = int(col[0:2], 16), int(col[2:4], 16), int(col[4:6], 16)
    except (ValueError, IndexError):
        return False
    return bl > 130 and bl > r + 60 and bl > g + 40


def clean(t):
    return re.sub(r'[ ]{2,}', ' ', t.replace('\t', ' ').replace('\xa0', ' '))


HAN = re.compile(r'[一-鿿]')


def mk_runs(p):
    """Runs auf (Text, Sprache) reduzieren und Gleichartiges zusammenfassen.

    Sprache: 0 = Deutsch, 1 = Pinyin, 2 = Hanzi. Hanzi werden am Zeichen
    erkannt, nicht an der Farbe — im Skript stehen sie teils schwarz, im
    Nachschlagewerk müssen sie nach Handbuch 3.3 immer in #B02418 und in
    Kaiti SC erscheinen.
    """
    roh = []
    for r in p['runs']:
        t = clean(r['t'])
        if not t:
            continue
        py = is_blue(r['c'])
        # Hanzi aus dem Run herauslösen, damit sie eigene Farbe bekommen
        for teil in re.split(r'([一-鿿]+)', t):
            if not teil:
                continue
            art = 2 if HAN.match(teil) else (1 if py else 0)
            if roh and roh[-1][1] == art:
                roh[-1][0] += teil
            else:
                roh.append([teil, art])
    if roh:
        roh[0][0] = roh[0][0].lstrip()
        roh[-1][0] = roh[-1][0].rstrip()
    return [[t, a] for t, a in roh if t]


def line_of(p, numbered):
    rs = mk_runs(p)
    txt = ''.join(t for t, _ in rs).strip()
    if not txt:
        return None
    blau = sum(len(t) for t, a in rs if a == 1)
    lang = 'py' if blau >= len(txt) * 0.75 else ('de' if blau == 0 else 'mix')
    z = {'r': rs, 'l': lang}
    if numbered:
        z['n'] = 1
    return z


def all_bold(p):
    return bool(p['runs']) and all(r['b'] for r in p['runs'])


TITEL = re.compile(r'^!!!\s*(.+?)\s*!!!$')
HSKZ = re.compile(r'^HSK-Stufe/n\s*:\s*\[(.*)\]\s*$')
RULE = re.compile(r'^[_\-–—\s]{10,}$')
INTRO = 'Bearbeite die folgenden Fragen/Übungen'
KEY = 'KEY – KEEP EDUCATING YOURSELF'
NUMMER = re.compile(r'^Grammatikstruktur\s+Nr\.\s*(\d{1,3})\s*$')
MERKE = re.compile(r'^Merke\s*[!:]?$', re.I)

TASK = re.compile(
    r'^(Nǐ xiān|Nǐ |Bringe|Notiere|Bilde|Kreuze|Zähle|Übersetze|Ergänze'
    r'|Setze|Verbinde|Beantworte|Schreibe|Wähle|Finde|Ordne|Formuliere'
    r'|Vervollständige|Benenne|Nenne|Markiere|Streiche|Korrigiere'
    r'|Entscheide|Fülle|Trage|Erstelle|Sortiere|Vergleiche|Wende|Übertrage)',
    re.I)


def is_formel(t):
    """Strukturformel statt Prosa: frueh ein Pluszeichen, keine Frage."""
    if ' + ' not in t and '＋' not in t:
        return False
    if len(t) > 160 or '?' in t:
        return False
    if t.find('+') > 45:
        return False
    return not t.endswith(('.', '!')) or t.count('+') >= 2


def ist_grafiktext(t):
    """Flachgeklopfter Text aus einer SmartArt-Grafik.

    Word liefert den Inhalt solcher Grafiken als einen einzigen Absatz ohne
    Leerzeichen, in dem jede Beschriftung doppelt steht — lesbar ist das
    nicht. Erkennungsmerkmal ist ein Wort von absurder Laenge. Das laengste
    echte Wort im Skript hat 45 Zeichen („Lage-/Richtungswoerter/…"), die
    Schwelle liegt sicher darueber.
    """
    return any(len(w) > 48 and not re.match(r'^[_\-–—]+$', w) for w in t.split())


def fix_titel(t):
    t = t.strip()
    if t.endswith('"') and t.count('"') % 2 == 1:
        t = t[:-1].strip()
    return t


# --------------------------------------------------------------------------
# Titel, die im Skript selbst nichts aussagen
# Das Kapitel „Die Strukturen für:" steht ohne erkennbaren Gegenstand im
# Verzeichnis. Stefan hat den Titel auf die Strukturformeln gesetzt, um die es
# darin geht. Der Schlüssel ist die Textmarke, nicht die Kapitelnummer — die
# Nummer ändert sich bei jeder Umsortierung des Skripts, die Textmarke nicht.
# --------------------------------------------------------------------------
TITEL_ERSATZ = {
    '_Toc_MM_048': 'S + gěi + mǒurén + dǎ (yī ge) diànhuà / '
                   'S + gěi + mǒurén + mǎi + Nomen / usw.',
}

# --------------------------------------------------------------------------
# Inhaltsverzeichnis des Skripts — liefert Kapitelnummer und Seitenzahl.
# Die Zeilen lauten „7.\tTitel\t19"; der Vorspann steht ohne Nummer.
# --------------------------------------------------------------------------
TOC = {}


def toc_key(t):
    return re.sub(r'[^0-9a-zäöüßA-ZÄÖÜ]', '', t).lower()[:60]


kapitel_start = [i for i, b in enumerate(blocks)
                 if b['kind'] == 'p' and TITEL.match(b['text'].strip())]
if not kapitel_start:
    sys.exit('Keine !!!Kapiteltitel!!! gefunden — falsche Fassung des Skripts?')

for b in blocks[:kapitel_start[0]]:
    if b['kind'] != 'p':
        continue
    m = re.match(r'^(?:(\d{1,3})\.)?\t?(.+?)\t(\d{1,3})\s*$', b['text'])
    if m:
        TOC[toc_key(m.group(2))] = (int(m.group(1)) if m.group(1) else 0,
                                    int(m.group(3)))

# --------------------------------------------------------------------------
# Vorbemerkung des Skripts: wie die HSK-Zeile zu lesen ist.
# Sie erklaert den Schuelern die Ordnung und gehoert deshalb in die App.
# --------------------------------------------------------------------------
vorwort = []
anfang = None
for i, b in enumerate(blocks[:kapitel_start[0]]):
    if b['kind'] == 'p' and b['text'].strip().startswith('So liest du sie'):
        anfang = i
        break
if anfang is not None:
    for b in blocks[anfang:kapitel_start[0]]:
        if b['kind'] != 'p':
            continue
        t = clean(b['text']).strip()
        if t and not RULE.match(t):
            z = line_of(b, False)
            if z:
                vorwort.append(z)

# --------------------------------------------------------------------------
# Kapitel schneiden
# --------------------------------------------------------------------------
kapitel_start.append(len(blocks))
kapitel = []
abweichung = []   # Kapitelnummer im Verzeichnis != Nummer im Kapitelkopf
grafiktexte = []  # als unlesbar aussortierte SmartArt-Absaetze

for k in range(len(kapitel_start) - 1):
    s, e = kapitel_start[k], kapitel_start[k + 1]
    roh_titel = fix_titel(TITEL.match(blocks[s]['text'].strip()).group(1))

    marken = []
    for b in blocks[s:e]:
        for name in b.get('bm', []):
            if name not in marken:
                marken.append(name)

    titel = roh_titel
    for m in marken:
        if m in TITEL_ERSATZ:
            titel = TITEL_ERSATZ[m]
            break

    nr, seite = TOC.get(toc_key(roh_titel), (None, 0))

    nr_skript = None          # aus der Zeile „Grammatikstruktur Nr. N"
    hsk, ergaenzend = [], False
    abschnitte, cur = [], None

    def push(a):
        if a and (a.get('kopf') or a.get('zeilen')):
            abschnitte.append(a)

    for b in blocks[s + 1:e]:
        if b['kind'] == 'tbl':
            rows = [[clean(c).strip() for c in r] for r in b['rows']]
            rows = [r for r in rows if any(r)]
            if rows:
                push(cur); cur = None
                abschnitte.append({'typ': 'tabelle', 'rows': rows})
            continue

        t = clean(b['text']).strip()
        if not t or RULE.match(t) or t == KEY or t.startswith(INTRO):
            continue
        if ist_grafiktext(t):
            grafiktexte.append(t[:40])
            continue

        m = NUMMER.match(t)
        if m:
            nr_skript = int(m.group(1))
            continue

        m = HSKZ.match(t)
        if m:
            inhalt = re.sub(r'HSK\s*3\.0\s*:', '', m.group(1))
            if 'kein eigener Grammatikpunkt' in inhalt:
                ergaenzend = True
            else:
                hsk = sorted(set(int(n) for n in re.findall(r'HSK\s*([1-9])',
                                                            inhalt)))
            continue

        bold = all_bold(b)
        z = line_of(b, b.get('numid') is not None)
        if z is None:
            continue

        if bold and is_formel(t):
            push(cur); cur = None
            abschnitte.append({'typ': 'formel', 'kopf': t, 'r': z['r']})
            continue

        if MERKE.match(t):
            push(cur)
            cur = {'typ': 'merke', 'kopf': 'Merke!', 'zeilen': []}
            continue

        if bold:
            push(cur)
            typ = ('frage' if t.endswith('?')
                   else 'uebung' if TASK.match(t) else 'titel')
            cur = {'typ': typ, 'kopf': t, 'zeilen': []}
            continue

        if cur is None:
            cur = {'typ': 'text', 'kopf': '', 'zeilen': []}
        cur['zeilen'].append(z)

    push(cur)
    if nr_skript is not None and nr != nr_skript:
        abweichung.append((roh_titel[:50], nr, nr_skript))

    kapitel.append({
        'nr': nr, 'titel': titel, 'hsk': hsk, 'ergaenzend': ergaenzend,
        'einstieg': hsk[0] if hsk else 0, 'seite': seite,
        'bm': marken, 'abschnitte': abschnitte,
    })

# --------------------------------------------------------------------------
# Uebungen in Aufgabe/Loesung-Paare zerlegen
#   Muster A (Uebersetzung):  deutsch, pinyin, deutsch, pinyin, ...
#   Muster B (Satzstellung):  pinyin (gemischt), pinyin (Loesung), ...
# --------------------------------------------------------------------------
for kap in kapitel:
    for a in kap['abschnitte']:
        if a.get('typ') != 'uebung':
            continue
        items, cur = [], None
        for z in a['zeilen']:
            neu = cur is None
            if not neu:
                if z['l'] == 'py':
                    neu = bool(cur['l'])
                else:
                    neu = bool(cur['l']) or (bool(cur['a']) and z.get('n'))
            if neu:
                cur = {'a': [], 'l': []}
                items.append(cur)
            if z['l'] == 'py' and cur['a']:
                cur['l'].append(z)
            else:
                cur['a'].append(z)
        a['items'] = [i for i in items if i['a'] or i['l']]
        del a['zeilen']

json.dump({'kapitel': kapitel, 'vorwort': vorwort},
          open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))

# --------------------------------------------------------------------------
# Bericht — jede Zahl hier ist eine Probe auf die Zerlegung
# --------------------------------------------------------------------------
print('Kapitel:', len(kapitel), '(davon nummeriert: %d, Vorspann: %d)'
      % (sum(1 for k in kapitel if k['nr']),
         sum(1 for k in kapitel if k['nr'] == 0)))
print('Abschnitte:', dict(Counter(a['typ'] for k in kapitel
                                  for a in k['abschnitte'])))
ue = [it for k in kapitel for a in k['abschnitte']
      if a['typ'] == 'uebung' for it in a['items']]
print('Uebungsaufgaben:', len(ue),
      '| davon mit Loesung:', sum(1 for i in ue if i['l']))
print('IVZ-Eintraege:', len(TOC),
      '| Kapitel ohne IVZ-Zuordnung:', [k['titel'][:40]
                                        for k in kapitel if k['nr'] is None])
print('Vorwortzeilen:', len(vorwort))
print('Grafiktexte aussortiert:', len(grafiktexte),
      [g for g in grafiktexte])
print('Einstiegsstufen:', dict(Counter(
    ('ergänzend' if k['ergaenzend'] else k['einstieg']) for k in kapitel)))
print('Textmarken gesamt:', sum(len(k['bm']) for k in kapitel),
      '| Kapitel ohne Textmarke:', [k['nr'] for k in kapitel if not k['bm']])
# Das Skript zaehlt an zwei Stellen: im Inhaltsverzeichnis ohne den Vorspann
# (1..101), in der Zeile „Grammatikstruktur Nr. N" mit ihm (1..102). Die App
# folgt dem Verzeichnis — der Pruefbericht spricht von 101 Grammatikstrukturen,
# und der Vorspann ist eine Begriffserklaerung, keine Struktur. Hier wird nur
# geprueft, dass der Versatz durchgehend genau 1 betraegt; alles andere waere
# ein echter Fehler im Skript.
versatz = sorted(set(b - a for _, a, b in abweichung))
if not abweichung:
    print('Nummer im Kapitelkopf: deckungsgleich mit dem Verzeichnis')
elif versatz == [1]:
    print('Nummer im Kapitelkopf: um genau 1 hoeher in %d von %d Kapiteln '
          '(der Vorspann zaehlt dort als Nr. 1) — erwartet, die App folgt '
          'dem Verzeichnis' % (len(abweichung), len(kapitel)))
else:
    print('ACHTUNG Nummerierung uneinheitlich, Versatz:', versatz)
    for t, a, b in abweichung[:10]:
        print('   %-50s Verzeichnis %s, Kapitelkopf %s' % (t, a, b))
folge = [k['nr'] for k in kapitel if k['nr']]
print('Nummern lueckenlos 1..%d:' % len(folge), folge == list(range(1, len(folge) + 1)))
