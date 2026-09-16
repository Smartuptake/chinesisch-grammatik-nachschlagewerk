#!/usr/bin/env python3
"""Baut aus blocks.json die Kapiteldaten des Nachschlagewerks.

Jede Zeile behaelt ihre Runs, damit Pinyin auch innerhalb eines deutschen
Satzes blau bleibt — so wie im Skript und im MM-Designhandbuch (Kap. 3.3).
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


def mk_runs(p):
    """Runs auf (Text, Pinyin?) reduzieren und Gleichartiges zusammenfassen."""
    out = []
    for r in p['runs']:
        t = clean(r['t'])
        if not t:
            continue
        py = is_blue(r['c'])
        if out and out[-1][1] == py:
            out[-1][0] += t
        else:
            out.append([t, py])
    if out:
        out[0][0] = out[0][0].lstrip()
        out[-1][0] = out[-1][0].rstrip()
    return [[t, 1] if py else [t, 0] for t, py in out if t]


def line_of(p, numbered):
    rs = mk_runs(p)
    txt = ''.join(t for t, _ in rs).strip()
    if not txt:
        return None
    blue = sum(len(t) for t, py in rs if py)
    lang = 'py' if blue >= len(txt) * 0.75 else ('de' if blue == 0 else 'mix')
    z = {'r': rs, 'l': lang}
    if numbered:
        z['n'] = 1
    return z


def all_bold(p):
    return bool(p['runs']) and all(r['b'] for r in p['runs'])


RULE = re.compile(r'^[_\-–—\s]{10,}$')
INTRO = 'Bearbeite die folgenden Fragen/Übungen'
LJ = re.compile(r'^Grammatikstrukturen\s+([\d./]+)\s*Lernjahr')
HSK = re.compile(r'^HSK\s*3\.0\s*:')
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
    i = t.find('+')
    if i > 45:
        return False
    return not t.endswith(('.', '!')) or t.count('+') >= 2


def fix_titel(t):
    """Nur ein alleinstehendes Schlussanfuehrungszeichen entfernen."""
    t = t.strip()
    if t.endswith('"') and t.count('"') % 2 == 1:
        t = t[:-1].strip()
    return t


# --------------------------------------------------------------------------
# Inhaltsverzeichnis des Skripts — liefert Titel und Seitenzahl
# --------------------------------------------------------------------------
TOC = {}
for b in blocks[:260]:
    if b['kind'] != 'p':
        continue
    m = re.match(r'^\s*(\d{1,3})\.	(.+?)	(\d{1,3})\s*$', b['text'])
    if m:
        TOC[int(m.group(1))] = (fix_titel(clean(m.group(2))), int(m.group(3)))

# --------------------------------------------------------------------------
# Kapitel schneiden
# --------------------------------------------------------------------------
starts = [i for i, b in enumerate(blocks) if b.get('bm')]
starts.append(len(blocks))
kapitel = []

for k in range(len(starts) - 1):
    s, e = starts[k], starts[k + 1]
    toc_titel, seite = TOC.get(k + 1, ('', 0))
    titel = fix_titel(clean(blocks[s].get('text', ''))) or toc_titel
    hsk, lernjahr = '', ''
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
        if not t or RULE.match(t):
            continue
        m = LJ.match(t)
        if m:
            lernjahr = m.group(1).rstrip('.')
            continue
        if HSK.match(t):
            hsk = t
            continue
        if t.startswith(INTRO):
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
            if t.endswith('?'):
                typ = 'frage'
            elif TASK.match(t):
                typ = 'uebung'
            else:
                typ = 'titel'
            cur = {'typ': typ, 'kopf': t, 'zeilen': []}
            continue

        if cur is None:
            cur = {'typ': 'text', 'kopf': '', 'zeilen': []}
        cur['zeilen'].append(z)

    push(cur)
    kapitel.append({'nr': k + 1, 'titel': titel, 'hsk': hsk,
                    'lj': lernjahr, 'seite': seite,
                    'abschnitte': abschnitte})

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

json.dump(kapitel, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))

# --------------------------------------------------------------------------
# Bericht
# --------------------------------------------------------------------------
print('Kapitel:', len(kapitel))
print('Abschnitte:', dict(Counter(a['typ'] for k in kapitel
                                  for a in k['abschnitte'])))
ue = [it for k in kapitel for a in k['abschnitte']
      if a['typ'] == 'uebung' for it in a['items']]
print('Uebungsaufgaben:', len(ue),
      '| davon mit Loesung:', sum(1 for i in ue if i['l']))
print('TOC-Eintraege:', len(TOC))
print('ohne Titel:', [k['nr'] for k in kapitel if not k['titel']])
print('ohne HSK:', [k['nr'] for k in kapitel if not k['hsk']])
print('ohne Lernjahr:', [k['nr'] for k in kapitel if not k['lj']])
