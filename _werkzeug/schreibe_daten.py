#!/usr/bin/env python3
"""Schreibt aus grammatik.json die beiden Dateien, die die App laedt.

Aufruf:  python3 schreibe_daten.py grammatik.json daten.js [alt_daten.js]

daten.js  enthaelt die Kapitel, die Vorbemerkung des Skripts und die
          Umleitungstabelle alter Kapitelnummern.

WARUM ES DIE UMLEITUNG GIBT — UND WARUM SIE NICHT STILL SEIN KANN
Die Fassung „HSK-Struktur" hat die Kapitel neu sortiert: die bǎ-Konstruktion
war Nr. 69 und ist jetzt Nr. 84. Links, die vorher verschickt wurden, zeigen
sonst auf das falsche Kapitel. Die Bruecke sind die Textmarken _Toc_MM_###,
die beide Fassungen unveraendert tragen: in der alten Fassung war Kapitel N
genau die Textmarke _Toc_MM_<N>, in der neuen steht sie in `bm`. Wo drei alte
Kapitel zu einem zusammengefasst wurden (chúfēi), zeigen alle drei alten
Nummern auf dasselbe neue Kapitel.

Automatisch umleiten laesst sich das nicht: beide Nummernkreise laufen von 1
bis 101, eine Adresse #/kapitel/69 traegt kein Merkmal, ob sie aus der alten
oder der neuen Fassung stammt. Eine stille Umleitung wuerde deshalb genauso
viele richtige Links zerstoeren, wie sie falsche rettet. Die App zeigt darum
auf den betroffenen Kapiteln eine Hinweiszeile mit dem alten Titel und einem
Sprung auf das gesuchte Kapitel — `alt_titel` liefert dafuer den Titel, unter
dem diese Nummer frueher stand.
"""
import json, re, sys

daten = json.load(open(sys.argv[1]))
ZIEL = sys.argv[2]
ALT = sys.argv[3] if len(sys.argv) > 3 else None

kapitel = daten['kapitel']

# --------------------------------------------------------------------------
# Umleitung: alte Kapitelnummer -> neue Kapitelnummer
# --------------------------------------------------------------------------
marke_zu_neu = {}
for k in kapitel:
    for m in k['bm']:
        marke_zu_neu[m] = k['nr']

umleitung = {}
for alt_nr in range(1, 200):
    neu = marke_zu_neu.get('_Toc_MM_%03d' % alt_nr)
    if neu is not None and neu != alt_nr:
        umleitung[alt_nr] = neu

alt_titel = {}   # alte Kapitelnummer -> Titel, unter dem sie frueher stand

# Gegenprobe gegen die alte daten.js, falls sie mitgegeben wurde
if ALT:
    roh = open(ALT).read()
    alt_kap = json.loads(re.sub(r'^.*?window\.MM_GRAMMATIK = ', '', roh,
                                flags=re.S).rstrip().rstrip(';'))
    def norm(s):
        return re.sub(r'[^a-zäöüß0-9]', '', s.lower())[:40]
    neu_nach_nr = {k['nr']: k for k in kapitel}
    for a in alt_kap:
        if a['nr'] in umleitung:
            alt_titel[a['nr']] = a['titel']
    passt = fehlt = schief = 0
    for a in alt_kap:
        ziel = umleitung.get(a['nr'], a['nr'])
        k = neu_nach_nr.get(ziel)
        if k is None:
            fehlt += 1
        elif norm(a['titel'])[:25] == norm(k['titel'])[:25]:
            passt += 1
        else:
            schief += 1
            if schief <= 5:
                print('   schief: alt %d %r -> neu %s %r'
                      % (a['nr'], a['titel'][:40], ziel, k['titel'][:40]))
    print('Umleitung geprueft: %d passend, %d abweichend, %d ohne Ziel'
          % (passt, schief, fehlt))

# --------------------------------------------------------------------------
# daten.js
# --------------------------------------------------------------------------
KOPF = '''/* Mandarin Maverick – Fast Track Chinese
   daten.js · Kapiteldaten des Grammatik-Nachschlagewerks
   Erzeugt aus "Grammatikskript-Jgst-10-12-HSK-Struktur_1.docx".
   Nicht von Hand aendern — bei einer neuen Fassung des Skripts wird diese
   Datei neu erzeugt (siehe README, Abschnitt "Aendern").

   window.MM_GRAMMATIK
     kapitel[]   nr        Kapitelnummer im Skript, 0 = Vorspann
                 titel     Kapiteltitel
                 hsk[]     alle im Skript genannten HSK-Stufen
                 einstieg  niedrigste davon — danach ist das Skript sortiert
                 ergaenzend  true = "kein eigener Grammatikpunkt"
                 seite     Seite im gedruckten Skript
                 bm[]      Textmarken des Skripts, ueber Fassungen stabil
                 abschnitte[]  frage | titel | text | formel | merke
                               | tabelle | uebung (items[{a,l}])
     vorwort[]   die Vorbemerkung des Skripts zur HSK-Zeile
     umleitung   alte Kapitelnummer -> neue, fuer bereits verschickte Links
     altTitel    alte Kapitelnummer -> Titel, unter dem sie frueher stand

   Zeilen tragen r: [[Text, Art], ...] mit Art 0 = Deutsch, 1 = Pinyin,
   2 = Hanzi. Die Art bestimmt Farbe, Schrift und Groesse (Designhandbuch
   v1.5, Kapitel 3.3 und 4.3).
*/
'''

nutz = {'kapitel': kapitel, 'vorwort': daten['vorwort'],
        'umleitung': umleitung, 'altTitel': alt_titel}
open(ZIEL, 'w').write(
    KOPF + 'window.MM_GRAMMATIK = '
    + json.dumps(nutz, ensure_ascii=False, separators=(',', ':')) + ';\n')

print('%s geschrieben: %d Kapitel, %d verschobene Nummern, %d alte Titel'
      % (ZIEL, len(kapitel), len(umleitung), len(alt_titel)))
