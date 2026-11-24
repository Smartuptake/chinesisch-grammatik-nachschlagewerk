# Grammatikstrukturen Chinesisch · Jahrgangsstufen 10 – 12

Das interaktive Nachschlagewerk zum Grammatikskript von
**Mandarin Maverick – Fast Track Chinese**. 112 Grammatikstrukturen (1–101 und die
Buchstaben-Kapitel 42a–e, 82a–c, 92a–c), geordnet
nach HSK-Stufen (HSK-Prüfungsplan 2025), durchsuchbar auf Pinyin und auf Deutsch bis hin zum ganzen
Satz.

© 2026 Mandarin Maverick · Stefan Happel · Alle Rechte vorbehalten

Grundlage ist die Fassung **„HSK-Struktur"** des Skripts
(`Grammatikskript-Jgst-10-12-HSK-Struktur_1.docx`).
Gestaltung nach **MM-Designhandbuch v1.5**.

## Aufrufen

Die Seite läuft im Browser, ohne Installation und ohne Server: `index.html`
öffnen genügt. Über GitHub Pages ist sie unter der Adresse des Repositorys
erreichbar — dieser Link lässt sich an die Kurse weitergeben.

Auf dem Handy funktioniert sie genauso; wer sie dort zum Startbildschirm
hinzufügt, hat sie wie eine App.

## Die Ordnung

Das Skript ordnet die Grammatikstrukturen nach der **niedrigsten HSK-Stufe**,
auf der sie verlangt werden. Genauso gliedert das Verzeichnis: erst alle
Strukturen ab HSK 1, dann die ab HSK 2 und so fort. Zwei Kapitel führt der
HSK-Standard nicht als eigenen Grammatikpunkt; sie stehen am Ende unter
*Ergänzender Stoff*.

Viele Kapitel nennen mehrere Stufen, weil der HSK ein Thema über mehrere
Prüfungsstufen verteilt, das Skript es aber an einer Stelle vollständig
behandelt. **Der Stufenfilter sucht deshalb in allen genannten Stufen, nicht
nur in der Einstiegsstufe**: Wer auf HSK 4 lernt, bekommt auch die
HSK-4-Erweiterung eines Kapitels, das im HSK-1-Block steht — die Trefferzeile
sagt dazu, wie viele das sind. Die Erklärung dazu steht in der App unter
„Wie die HSK-Angabe zu lesen ist" und stammt wörtlich aus dem Skript.

## Suchen

Ins Feld oben darf alles, was gerade zur Hand ist:

| Eingabe | Beispiel | führt zu |
|---|---|---|
| ein Pinyin-Wort, mit oder ohne Töne | `ba` · `bǎ` · `yinwei` | der bǎ-Konstruktion, den Kausalsätzen |
| ein deutsches Stichwort | `Vergangenheit` · `obwohl` · `wie lange` | der Partikel le, den Konzessivsätzen, den Zeitdauerangaben |
| ein ganzer Satz auf Pinyin | `Wǒ bǎ shū fàng zài zhuōzi shàng.` | der bǎ-Konstruktion |
| ein ganzer Satz auf Deutsch | `Ich habe das Buch auf den Tisch gelegt.` | derselben |
| eine HSK-Stufe | `HSK 4` | dem Verzeichnis, auf diese Stufe gefiltert |
| eine Kapitelnummer | `84` | dem Kapitel |

Die Trefferliste nennt zu jedem Kapitel die Zeile, die den Treffer belegt —
die Strukturformel, die Leitfrage oder den Beispielsatz. Ein Klick springt
dorthin, und das gesuchte Wort ist im Kapitel hervorgehoben.

**Der Rückweg steht unter jedem Kapitel**: „Neue Suche" setzt den Cursor
zurück ins Suchfeld, „☰ Inhaltsverzeichnis" führt zur Übersicht, und der
dritte Knopf bringt die Trefferliste zurück, aus der man gekommen ist. Auch
der Zurück-Knopf des Browsers tut, was man erwartet — jede Ansicht hat eine
eigene Adresse, jedes Kapitel lässt sich einzeln verlinken.

| Taste | Wirkung |
|---|---|
| `/` oder `s` | ins Suchfeld |
| `Eingabe` | in das beste Kapitel springen |
| `i` oder `Esc` | zurück zum Inhaltsverzeichnis |

## Was in einem Kapitel steht

Oben das Nachschlagbare: die Leitfragen mit ihren Antworten, die
Strukturformeln im türkisen Kasten, Merksätze, Tabellen. Darunter,
zusammengeklappt, die **Übungen aus dem Skript** — jede Aufgabe mit einem
Knopf, der die Lösung aufdeckt. So steht die Antwort nicht im Weg, wenn man
nur nachschlagen will, und ist da, wenn man üben will.

Jedes Kapitel nennt seine HSK-Stufen und die Seite im gedruckten Skript,
damit sich beides gegenlesen lässt.

### Alte Kapitelnummern

Mit der Fassung „HSK-Struktur" hat sich die Reihenfolge geändert: die
bǎ-Konstruktion war Nr. 69 und ist jetzt Nr. 84. Automatisch umleiten lässt
sich das **nicht** — alter und neuer Nummernkreis laufen beide von 1 bis 101,
eine Adresse `#/kapitel/69` trägt kein Merkmal, aus welcher Fassung sie
stammt; eine stille Umleitung würde genauso viele richtige Links zerstören,
wie sie falsche rettet. Stattdessen zeigt jedes betroffene Kapitel oben eine
Zeile, was früher unter dieser Nummer stand, mit einem Sprung dorthin.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | die Seite — nur das Gerüst, der Inhalt kommt aus `daten.js` |
| `theme.css` | das Gestaltungssystem nach MM-Designhandbuch v1.5 |
| `daten.js` | die Kapitel, aus dem Skript erzeugt |
| `stichworte.js` | deutsche Suchbegriffe je Kapitel — **hier darf ergänzt werden** |
| `app.js` | Suche, Wegfindung, Darstellung |
| `_werkzeug/` | die drei Python-Skripte, die `daten.js` erzeugen |

## Ändern

**Ein Suchbegriff fehlt.** Das ist der häufigste Fall und der einfachste:
`stichworte.js` öffnen, die Zeile mit der Kapitelnummer suchen — hinter jeder
Zeile steht der Kapiteltitel —, das Wort hinten anfügen, speichern. Groß- und
Kleinschreibung sowie Töne sind gleichgültig. Ein Wort, das hier steht, wiegt
in der Suche schwerer als jedes Vorkommen im Fließtext; wer es einträgt, sagt
damit: *dieses* Kapitel handelt davon.

**Das Skript hat eine neue Fassung.** Dann wird `daten.js` neu erzeugt; von
Hand sollte man es nicht anfassen:

```bash
python3 _werkzeug/extract.py ../Grammatikskript-Jgst-10-12-HSK-Struktur_1.docx .bau/blocks.json
python3 _werkzeug/build_data.py .bau/blocks.json .bau/grammatik.json
python3 _werkzeug/schreibe_daten.py .bau/grammatik.json daten.js .bau/daten_alt.js
python3 _werkzeug/hsk2025.py daten.js ../HSK2025-Abgleich-Grammatikskript.xlsx
```

Seit 25.11.2026 nennt die HSK-Zeile im Skript selbst die Stufen nach dem
**HSK-Prüfungsplan 2025** (CLEC); Gliederung und Filter kommen direkt daraus.
Der letzte Schritt ergänzt je Kapitel die Grammatikpunkte von 2025 mit Code
(2-21 …) aus der je Kapitel geprüften Zuordnung
(`~/Documents/MM-Werkstatt/grammatik-etappe2/hsk2025/ergebnis/zuordnung.json`)
und die alten Stufen nach GF 0025—2021 (`hsk2021`, aus der Abgleich-Tabelle,
die er nur liest). Er meldet, wenn die Stufen der Codes nicht zur HSK-Zeile
im Skript passen.

Jeder Schritt gibt einen Prüfbericht aus — Kapitelzahl, Übungen mit und ohne
Lösung, ob die Nummern lückenlos sind, ob jedes Kapitel im Inhaltsverzeichnis
steht. Weicht eine Zahl ab, stimmt etwas mit der neuen Fassung nicht.

Woran die Skripte sich festhalten, und was deshalb erhalten bleiben muss:

* **Kapiteltitel stehen zwischen `!!!` und `!!!`.** Daran werden die Kapitel
  geschnitten.
* **Unter dem Titel steht `HSK-Stufe/n: [HSK 3.0: HSK 1 · HSK 2]`** oder
  `[HSK 3.0: kein eigener Grammatikpunkt – ergänzender Stoff]` (Stufen nach
  dem Prüfungsplan 2025).
* **Die Textmarken `_Toc_MM_###` bleiben, wie sie sind.** Sie sind über alle
  Fassungen dieselben und tragen die Zuordnung alter Kapitelnummern.
* **Pinyin steht blau.** Daran wird es von deutschem Text unterschieden.
* Das Inhaltsverzeichnis liefert Kapitelnummer und Seitenzahl.

Das Skript zählt an zwei Stellen unterschiedlich: das Inhaltsverzeichnis lässt
den Vorspann unnummeriert; die Zeile „Grammatikstruktur Nr. N" steht vor dem
Titel und landet beim Schneiden im vorigen Kapitel. Die App folgt dem
Inhaltsverzeichnis; `build_data.py` prüft, dass jede Kopfnummer die des
nächsten Kapitels ist. Buchstaben-Kapitel (42a …) sind Text, alle anderen
Zahlen; in der App sind alle Nummern Text, der Vorspann ist 0.

## Hinweise

Die Beispielsätze stehen in **Pinyin**, so wie im Skript; chinesische
Schriftzeichen kommen nur dort vor, wo auch das Skript sie nennt. Die
Sprachfarben folgen dem Designhandbuch v1.5: Pinyin blau `#2271FF` und eine
Stufe größer als der deutsche Text, Schriftzeichen `#B02418` in Kaiti SC,
deutscher Text schwarz `#111111` und nie fett — starke Hervorhebungen stehen
kursiv. Grau `#5C5C5C` bleibt den Nebenangaben vorbehalten.

Weil Kaiti SC außerhalb von macOS fehlen kann, bindet die Seite „LXGW WenKai
TC" als Webfont ein, wie es das Handbuch für Webprojekte verlangt. Google
Fonts liefert ihn nach Zeichenbereich aufgeteilt; von den 32 Schriftzeichen
dieses Skripts lädt der Browser also nur wenige Kilobyte, und ohne
Internetverbindung greift die Systemschrift.

Die Bilder des gedruckten Skripts sind bewusst nicht übernommen. Es sind
Kapitelbilder, keine Grammatikgrafiken; ohne sie lädt die Seite auch im
Schulnetz sofort.

Der Druckdialog gibt das aufgeschlagene Kapitel ohne Bedienoberfläche aus —
und mit aufgedeckten Lösungen, damit ein Übungsblatt daraus werden kann.
