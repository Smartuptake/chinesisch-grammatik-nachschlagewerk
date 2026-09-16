# Grammatikstrukturen Chinesisch · Jahrgangsstufen 10 – 12

Das interaktive Nachschlagewerk zum Grammatikskript von
**Mandarin Maverick – Fast Track Chinese**. 104 Kapitel, durchsuchbar auf
Pinyin und auf Deutsch, bis hin zum ganzen Satz.

© 2026 Mandarin Maverick · Stefan Happel · Alle Rechte vorbehalten

## Aufrufen

Die Seite läuft im Browser, ohne Installation und ohne Server: `index.html`
öffnen genügt. Über GitHub Pages ist sie unter der Adresse des Repositorys
erreichbar — dieser Link lässt sich an die Kurse weitergeben.

Auf dem Handy funktioniert sie genauso; wer sie dort zum Startbildschirm
hinzufügt, hat sie wie eine App.

## Suchen

Ins Feld oben darf alles, was gerade zur Hand ist:

| Eingabe | Beispiel | führt zu |
|---|---|---|
| ein Pinyin-Wort, mit oder ohne Töne | `ba` · `bǎ` · `yinwei` | der bǎ-Konstruktion, den Kausalsätzen |
| ein deutsches Stichwort | `Vergangenheit` · `obwohl` · `wie lange` | der Partikel le, den Konzessivsätzen, den Zeitdauerangaben |
| ein ganzer Satz auf Pinyin | `Wǒ bǎ shū fàng zài zhuōzi shàng.` | der bǎ-Konstruktion |
| ein ganzer Satz auf Deutsch | `Ich habe das Buch auf den Tisch gelegt.` | derselben |
| eine Kapitelnummer | `69` | dem Kapitel |

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

Jedes Kapitel nennt sein Lernjahr, seine HSK-3.0-Stufen und die Seite im
gedruckten Skript, damit sich beides gegenlesen lässt.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | die Seite — nur das Gerüst, der Inhalt kommt aus `daten.js` |
| `theme.css` | das Gestaltungssystem nach MM-Designhandbuch v1.4 |
| `daten.js` | die 104 Kapitel, aus dem Skript erzeugt |
| `stichworte.js` | deutsche Suchbegriffe je Kapitel — **hier darf ergänzt werden** |
| `app.js` | Suche, Wegfindung, Darstellung |
| `_werkzeug/` | die beiden Python-Skripte, die `daten.js` erzeugen |

## Ändern

**Ein Suchbegriff fehlt.** Das ist der häufigste Fall und der einfachste:
`stichworte.js` öffnen, die Zeile mit der Kapitelnummer suchen, das Wort
hinten anfügen, speichern. Groß- und Kleinschreibung sowie Töne sind
gleichgültig. Ein Wort, das hier steht, wiegt in der Suche schwerer als
jedes Vorkommen im Fließtext — wer es einträgt, sagt damit: *dieses* Kapitel
handelt davon.

**Das Skript hat eine neue Fassung.** Dann wird `daten.js` neu erzeugt; von
Hand sollte man es nicht anfassen:

```bash
python3 _werkzeug/extract.py blocks.json
python3 _werkzeug/build_data.py blocks.json grammatik.json
```

Das erste Skript liest die `.docx`-Fassung des Grammatikskripts aus dem
Ordner, in dem es aufgerufen wird, und legt die Absätze mit ihren
Formatmerkmalen ab. Das zweite macht daraus die Kapitel. Wie aus
`grammatik.json` dann `daten.js` wird, steht im Kopf von `build_data.py`.

Die Kapitelgrenzen erkennt es an den Textmarken `_Toc_MM_001` bis
`_Toc_MM_104` im Dokument — bleiben die erhalten, geht alles andere von
selbst. Pinyin erkennt es an der blauen Schriftfarbe, wie das Skript sie
durchgehend setzt.

## Hinweise

Die Beispielsätze stehen in **Pinyin**, so wie im Skript; chinesische
Schriftzeichen kommen nur dort vor, wo auch das Skript sie nennt. Die
Sprachfarben folgen dem Designhandbuch: Pinyin blau, Deutsch schwarz,
Schriftzeichen rot.

Die Bilder des gedruckten Skripts sind bewusst nicht übernommen. Es sind
Kapitelbilder, keine Grammatikgrafiken; ohne sie lädt die Seite auch im
Schulnetz sofort.

Der Druckdialog gibt das aufgeschlagene Kapitel ohne Bedienoberfläche aus —
und mit aufgedeckten Lösungen, damit ein Übungsblatt daraus werden kann.
