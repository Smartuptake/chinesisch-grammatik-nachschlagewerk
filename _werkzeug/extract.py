#!/usr/bin/env python3
"""Zerlegt das Grammatikskript in Kapitel-Bloecke mit Formatmerkmalen."""
import zipfile, re, json, sys
from xml.etree import ElementTree as ET

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
def q(t): return '{%s}%s' % (W, t)

# Erstes Argument: die .docx-Fassung des Skripts. Zweites: wohin die Bloecke.
DOC = sys.argv[1]
ZIEL = sys.argv[2] if len(sys.argv) > 2 else 'blocks.json'

z = zipfile.ZipFile(DOC)
root = ET.fromstring(z.read('word/document.xml'))
body = root.find(q('body'))


def run_text(r):
    parts = []
    for n in r:
        if n.tag == q('t'):
            parts.append(n.text or '')
        elif n.tag == q('tab'):
            parts.append('\t')
        elif n.tag in (q('br'), q('cr')):
            parts.append('\n')
    return ''.join(parts)


def runs_of(p):
    """(text, bold, italic, underline, color) je Run, leere uebersprungen."""
    out = []
    for r in p.iter(q('r')):
        t = run_text(r)
        if not t:
            continue
        rPr = r.find(q('rPr'))
        b = i = u = False
        col = None
        if rPr is not None:
            bn = rPr.find(q('b'))
            b = bn is not None and bn.get(q('val'), '1') not in ('0', 'false')
            inode = rPr.find(q('i'))
            i = inode is not None and inode.get(q('val'), '1') not in ('0', 'false')
            un = rPr.find(q('u'))
            u = un is not None and un.get(q('val'), 'single') not in ('none',)
            cn = rPr.find(q('color'))
            if cn is not None:
                col = cn.get(q('val'))
        out.append({'t': t, 'b': b, 'i': i, 'u': u, 'c': col})
    return out


def para_info(p):
    runs = runs_of(p)
    text = ''.join(r['t'] for r in runs)
    pPr = p.find(q('pPr'))
    ilvl = None
    numid = None
    if pPr is not None:
        numPr = pPr.find(q('numPr'))
        if numPr is not None:
            iv = numPr.find(q('ilvl'))
            ni = numPr.find(q('numId'))
            if iv is not None: ilvl = int(iv.get(q('val')))
            if ni is not None: numid = int(ni.get(q('val')))
    has_img = p.find('.//' + q('drawing')) is not None
    bookmarks = [bm.get(q('name')) for bm in p.iter(q('bookmarkStart'))]
    return {'kind': 'p', 'text': text, 'runs': runs, 'ilvl': ilvl,
            'numid': numid, 'img': has_img,
            'bm': [b for b in bookmarks if b and b.startswith('_Toc_MM_')]}


def table_info(tbl):
    rows = []
    for tr in tbl.findall(q('tr')):
        cells = []
        for tc in tr.findall(q('tc')):
            paras = [''.join(r['t'] for r in runs_of(p)) for p in tc.findall(q('p'))]
            cells.append('\n'.join(x for x in paras).strip())
        rows.append(cells)
    return {'kind': 'tbl', 'rows': rows, 'text': ' '.join(c for r in rows for c in r)}


blocks = []
for el in body:
    if el.tag == q('p'):
        blocks.append(para_info(el))
    elif el.tag == q('tbl'):
        # Lesezeichen koennen auch in Tabellen stecken
        bms = [bm.get(q('name')) for bm in el.iter(q('bookmarkStart'))]
        ti = table_info(el)
        ti['bm'] = [b for b in bms if b and b.startswith('_Toc_MM_')]
        blocks.append(ti)

json.dump(blocks, open(ZIEL, 'w'), ensure_ascii=False)
print('blocks:', len(blocks))
print('mit bookmark:', sum(1 for b in blocks if b.get('bm')))
