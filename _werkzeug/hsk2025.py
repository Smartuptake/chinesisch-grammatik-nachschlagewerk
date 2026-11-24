#!/usr/bin/env python3
"""HSK-Prüfungsplan 2025 im Nachschlagewerk: Grammatikpunkte (Codes) je Kapitel.

Aufruf:  python3 hsk2025.py daten.js ABGLEICH.xlsx

Seit 25.11.2026 nennt das Skript (docx) in seiner Zeile „HSK-Stufe/n: [HSK 3.0: …]"
selbst die Stufen nach dem Prüfungsplan 2025 — `hsk`, `einstieg` und `ergaenzend`
kommen deshalb schon aus build_data.py und bleiben hier unverändert.
Dieser Schritt läuft NACH schreibe_daten.py und ergänzt je Kapitel:
    codes      [[Code, Stufe, Deutsch], …] der Punkte von 2025
    hsk2021    Stufen nach GF 0025—2021 (zum Vergleich; aus der Abgleich-Tabelle)
Quelle der Codes: die je Kapitel geprüfte Zuordnung
    ~/Documents/MM-Werkstatt/grammatik-etappe2/hsk2025/ergebnis/zuordnung.json
(dieselbe, aus der die HSK-Zeilen des Skripts und die Abgleich-Tabelle entstehen).
Die Tabelle wird hier nur GELESEN (Blatt „Kapitel“, Spalte „Stufen GF 2021“);
erzeugt wird sie mit grammatik-etappe2/hsk2025/excel_erneuern.py.
Prüft außerdem, dass die Stufen der Codes zur HSK-Zeile im Skript passen.
"""
import json, os, sys
import openpyxl

DJS, XLSX = sys.argv[1], sys.argv[2]
W = os.path.expanduser("~/Documents/MM-Werkstatt/grammatik-etappe2/hsk2025")
Z = json.load(open(os.path.join(W, "ergebnis", "zuordnung.json"), encoding="utf8"))
TSV = {}
for z in open(os.path.join(W, "grammatik2025.tsv"), encoding="utf8"):
    s = z.rstrip("\n").split("\t")
    if s[0] and s[0] != "code":
        TSV[s[0]] = s

KOPF = "window.MM_GRAMMATIK = "
roh = open(DJS, encoding="utf8").read()
vor, json_teil = roh.split(KOPF, 1)
daten, ende = json.JSONDecoder().raw_decode(json_teil)
rest = json_teil[ende:]

gf = {}
ws = openpyxl.load_workbook(XLSX, read_only=True)["Kapitel"]
for r in ws.iter_rows(min_row=2, values_only=True):
    if r[0] is not None:
        gf[str(r[0])] = r[2]

def ck(c):
    t = c.split("-")
    return (7, int(t[2])) if c.startswith("7-9") else (int(t[0]), int(t[1]))
zahl = lambda s: 7 if s == "7-9" else int(s)

fehler = []
for k in daten["kapitel"]:
    key = "Vorspann" if k["nr"] == 0 else str(k["nr"])
    v = Z[key]
    codes = sorted(v["codes"], key=ck)
    k["codes"] = [[c, TSV[c][1], TSV[c][-1]] for c in codes]
    st = sorted({zahl(s) for s in v["stufen"]})
    if st != k["hsk"]:
        fehler.append((key, st, k["hsk"]))
    g = gf.get(key) or ""
    k["hsk2021"] = [] if not g or g.startswith(("–", "ergänzend")) else [int(x) for x in g.split(" · ")]
daten["hsk_grundlage"] = "HSK-Prüfungsplan 2025 (CLEC), Kapitel-Zuordnung geprüft, Stand 25.11.2026"
open(DJS, "w", encoding="utf8").write(vor + KOPF + json.dumps(daten, ensure_ascii=False, separators=(",", ":")) + rest)
print("Kapitel:", len(daten["kapitel"]), "| mit Codes:", sum(1 for k in daten["kapitel"] if k["codes"]),
      "| Codes gesamt:", len({c[0] for k in daten["kapitel"] for c in k["codes"]}))
print("Stufen Skript ≠ Zuordnung:", fehler or "keine")
