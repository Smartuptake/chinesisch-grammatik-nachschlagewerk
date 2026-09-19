/* Mandarin Maverick – Fast Track Chinese
   stichworte.js · Suchbegriffe, die nicht im Kapiteltext stehen

   Das Skript ist in Pinyin geschrieben und benennt die Strukturen mit ihren
   chinesischen Woertern. Wer auf Deutsch sucht, tippt aber „Vergangenheit",
   „obwohl" oder „wie lange" — Woerter, die im Kapitel selbst nicht unbedingt
   vorkommen. Diese Liste schlaegt die Bruecke: je Kapitelnummer die Begriffe,
   unter denen es gefunden werden soll.

   Ein Treffer hier wiegt am schwersten — schwerer als im Kapiteltitel. Wer
   ein Wort in diese Liste schreibt, sagt damit: dieses Kapitel handelt
   davon. Das muss ein beilaeufiges Vorkommen desselben Wortes im Fliesstext
   eines anderen Kapitels schlagen.

   Erweitern ist ausdruecklich vorgesehen: Zeile suchen, Wort ergaenzen,
   Datei speichern. Gross- und Kleinschreibung sowie Toene sind gleichgueltig.

   Der Schluessel ist die Kapitelnummer der Fassung "HSK-Struktur"; hinter
   jeder Zeile steht der Kapiteltitel, damit sich die richtige Zeile ohne
   Nachschlagen finden laesst.
*/

window.MM_STICHWORTE = {
  0:   'grammatik begriffe fachbegriffe wortarten nomen substantiv verb adjektiv adverb subjekt objekt prädikat attribut pronomen partikel was bedeutet',  /* Erklärung grammatikalischer Begriffe */
  1:   'personalpronomen ich du er sie es wir ihr plural men wo ni ta women nimen tamen nin höflich anrede',  /* Die Personalpronomen und die Endung "men" */
  2:   'zahlen zahl zählen ziffer nummer eins zwei drei zehn hundert tausend zehntausend yi er san shi bai qian wan liang null ling',  /* Die Zahlen im Chinesischen */
  3:   'frage ja nein entscheidungsfrage fragepartikel ma fragen stellen fragesatz',  /* Entscheidungsfrage mit "ma" / Die Fragepartikel "ma" */
  4:   'satzstruktur satzbau wortstellung reihenfolge grundstruktur subjekt verb objekt svo wie baut man einen satz',  /* Satzstruktur im Chinesischen */
  5:   'elliptische frage rückfrage gegenfrage und du ne partikel',  /* Elliptische Frage mit "ne" / Die Fragepartikel "ne" */
  6:   'auch ebenfalls gleichfalls ye adverb ich bin',  /* Das Adverb "yě" */
  7:   'verneinung negation verneinen nicht kein nein bu mei meiyou negativ',  /* Die Verneinung mit der Partikel/dem Adverb "bù" oder mit "mé */
  8:   'alle alles beide sämtlich allesamt dou adverb',  /* Das Adverb "dōu" */
  9:   'wohnen wohnort leben zhu zai adresse',  /* Die Wortkombination "zhù zài" */
  10:  'ort sein aufenthalt zai ortsangabe wo etwas geschieht',  /* An einem Ort sein und dort etwas tun */
  11:  'präposition präpositionen gen dui cong wang li gei zai mit für zu von nach gegenüber',  /* Die wichtigsten Präpositionen im Überblick */
  12:  'von bis nach cong dao strecke zeitraum anfang ende',  /* Die Struktur "cóng ... dào ..." – von ... bis ... */
  13:  'uhrzeit uhr zeit wie spät dian fen ke ban zhong stunde minute viertel halb',  /* Die Uhrzeit */
  14:  'datum wochentag jahr monat tag nian yue hao ri xingqi zhoumo kalender montag',  /* Datum, Wochentage und Jahreszahlen */
  15:  'zeitangabe zeitpunkt wann heute morgen gestern jintian mingtian zuotian stellung im satz',  /* Zeit(punkt)angaben */
  16:  'fragewort fragewörter interrogativpronomen wer was wo wann warum wie wieviel shei shenme nali naer weishenme zenme ji duoshao',  /* Fragesätze mit: Interrogativpronomen... und Antworten */
  17:  'wie alt gross weit alter größe entfernung duo duoda duogao duoyuan',  /* Das Fragewort "duō" – nach Alter, Größe und Entfernung frage */
  18:  'demonstrativpronomen dieser jener das hier da zhe na zhei nei',  /* Die Demonstrativpronomen "zhè" und "nà" */
  19:  'haben besitzen es gibt you vorhanden',  /* Das Wörtchen "yǒu" */
  20:  'existenz es gibt befindet sich ort you shi zai wo ist',  /* Existenzsätze: "Ort + yǒu/shì/zài" */
  21:  'de attribut besitz zugehörigkeit genitiv mein dein wessen von',  /* Die Partikel "de" */
  22:  'drei de unterschied 的 地 得 attribut adverbial komplement welches',  /* Die drei "de": de (的) – de (地) – de (得) */
  23:  'zähleinheitswort zählwort messwort klassifikator zew ge ben zhang liang zhi jian tai',  /* Zähleinheitswörter (ZEW) */
  24:  'geld preis kosten was kostet wieviel wie viel teuer einkaufen kuai mao fen qian yuan jiao bezahlen',  /* Geld und Preise */
  25:  'mögen mag magst gern lieber nicht xihuan ai vorliebe hobby',  /* mögen/nicht mögen */
  26:  'gradadverb sehr zu ziemlich mehr am meisten hen tai feichang bijiao geng zui steigerung intensität',  /* Die Gradadverbien "hěn, tài, fēicháng, bǐjiào, gèng, zuì" */
  27:  'adjektiv adjektivverb beschreiben eigenschaft wie ist etwas beschreibung',  /* Dinge/Personen/Tiere mit Adjektiven näher beschreiben */
  28:  'zu sehr ausruf tai le wie schön übertreibung',  /* Die Partikel "le" in der Struktur: "tài + Adjektiv + le!" /  */
  29:  'und mit he gen verbindung zwei nomen',  /* Das Wörtchen "hé" und seine Bedeutung */
  30:  'und ausserdem zudem noch dazu ferner hai ye erqie komma satzverknüpfung',  /* Satzverknüpfungen gemäß der Bedeutung "und, außerdem" (hái,  */
  31:  'oder alternative wahl huozhe haishi entweder',  /* huòzhě oder háishì */
  32:  'bitte aufforderung befehl verbot imperativ qing bie buyao nicht tun lass das',  /* Bitten, Aufforderungen und Verbote: "qǐng", "bié", "bùyào" */
  33:  'vorschlag aufforderung vermutung satzschlusspartikel ba wollen wir',  /* Die Satzschlusspartikel "ba" */
  34:  'modalverb können müssen wollen dürfen sollen möchten hui neng keyi yao xiang yinggai bixu dei',  /* Modalverben */
  35:  'einige ein paar mehrere etwas yixie jige unbestimmte menge',  /* Die beiden Begriffe "yī xiē" und "jǐ ge" */
  36:  'gleichzeitig zugleich während nebenher yibian zwei handlungen',  /* Die Struktur um auszudrücken, dass zwei Handlungen eines Sub */
  37:  'le partikel vergangenheit abgeschlossen perfekt veränderung neue situation aspekt',  /* Die Partikel "le" */
  38:  'lagewort richtungswort oben unten vorne hinten links rechts neben zwischen shang xia qian hou zuo you li wai pangbian himmelsrichtung',  /* Verwendung von Lage- und Richtungswörtern/Himmelsrichtungswö */
  39:  'himmelsrichtung norden süden osten westen liegt im bei nan dong xi bu stadt land',  /* Ausdrücken, dass sich eine Stadt im Norden, Süden, Osten, We */
  40:  'durativ verlaufsform progressiv gerade dabei am tun zai zhengzai zhe zustand',  /* Der durative Aspekt mit zài, zhèngzài, und zhe */
  41:  'vergleich komparativ mehr als größer bi weniger meiyou steigerung',  /* Vergleichen III: Mit der folgenden Konstruktion kannst du au */
  42:  'wieder nochmal noch einmal erneut zai you hai unterschied wiederholung',  /* Die Wörtchen "zài", "yòu" und "hái" – dreimal "wieder/noch" */
  43:  'gehen fahren hingehen ort qu zielort',  /* An einen/Zu einem Ort gehen */
  44:  'zukunft futur später werden yao hui jianglai vorhaben plan',  /* Angabe der Zukunft */
  45:  'gleich bald sofort unmittelbare zukunft kuai yao jiu le demnächst',  /* Die Strukturen "kuài (yào) ... le" und "jiù yào ... le" – di */
  46:  'kommen gehen hin her qu lai standpunkt sprecher richtung',  /* qù vs. lái */
  47:  'verbverdopplung verb verdoppeln kurz mal eben ausprobieren kankan yi',  /* Verbverdopplung */
  48:  'adjektivverdopplung adjektiv verdoppeln honghong manman aabb lebendig',  /* Die Verdopplung von Adjektivverben */
  49:  'aussehen wirken scheinen als ob anschein kan qilai haoxiang',  /* So aussehen als ob... */
  50:  'immer mehr größer je desto zunehmend yue lai',  /* Die Struktur: "yuè lái yuè + Adjektiv" */
  51:  'aber doch jedoch sondern gegensatz danshi keshi buguo einschränkung',  /* Das Wörtchen "aber" im Chinesischen */
  52:  'sowohl als auch zugleich beides you ji doppelte eigenschaft',  /* Die Strukturen "yòu ... yòu ..." und "jì ... yòu ..." */
  53:  'zwei objekte doppelobjekt dativ geben schenken beibringen fragen gei song jiao wen jemandem etwas',  /* Sätze mit zwei Objekten ("gěi", "sòng", "jiāo", "wèn") */
  54:  'gei mouren strukturformel strukturen für tätigkeiten alltagshandlungen jemanden anrufen telefonieren zurückrufen dianhua sms schreiben duanxin fotografieren zhaopian jemandem etwas kaufen mai zeigen vorstellen jieshao erklären',  /* S + gěi + mǒurén + dǎ (yī ge) diànhuà / S + gěi + mǒurén + m */
  55:  'reihenfolge abfolge zuerst dann danach anschliessend xian zai ranhou yihou nacheinander handlungen',  /* Strukturen um zwei bzw. mehrere Handlungsabläufe, die aufein */
  56:  'als während wenn zeitpunkt de shihou zu der zeit',  /* Die Struktur: "Satzteil1 + de shíhòu + Satzteil2" */
  57:  'kausalsatz weil deshalb darum grund ursache yinwei suoyi youyu wieso',  /* Kausalsätze im Chinesischen */
  58:  'konditionalsatz wenn dann falls bedingung angenommen ruguo yaoshi de hua jiu',  /* Konditionalsätze im Chinesischen */
  59:  'nur wenn solange sobald bedingung zhiyao zhiyou cai jiu einzige',  /* Die Strukturen "zhǐyào ..., jiù ..." und "zhǐyǒu ..., cái .. */
  60:  'konzessivsatz obwohl obgleich trotzdem dennoch suiran danshi jinguan',  /* Konzessivsätze im Chinesischen */
  61:  'nach danach später anschliessend yihou zhihou hou zeitfolge',  /* Der Begriff "yǐhòu/zhīhòu/hòu" */
  62:  'vor vorher früher zuvor yiqian zhiqian ehe bevor',  /* Der Begriff "yǐqián/zhīqián" */
  63:  'shi de betonung hervorhebung umstand wann wo wie womit vergangenheit hervorheben',  /* Die Konstruktion "shì ... de" */
  64:  'verkehrsmittel bus zug auto fahrrad fliegen fahren zuo qi kai wie komme ich',  /* Die Strukturformel um auszudrücken, dass man mit einem Verke */
  65:  'weg wegbeschreibung wegrichtung wohin abbiegen geradeaus zenme zou wie komme ich nach',  /* Die Frage nach der Wegrichtung um an einen Ort zu gelangen */
  66:  'entfernung abstand weit nah li yuan jin wie ist es',  /* Entfernungen angeben mit "lí" */
  67:  'ein bisschen etwas wenig yidian youyidian unterschied stellung',  /* Die zwei Wörter yīdiǎn(r) und yǒuyīdiǎn(r) */
  68:  'ergebniskomplement resultat resultativ komplement wan hao dong jian zhao fertig',  /* Das Komplement des Resultats (Ergebniskomplement) */
  69:  'richtungskomplement richtung lai qu jinlai chuqu shanglai xiaqu herein hinaus',  /* Das Komplement der Richtung (Richtungskomplement) */
  70:  'art und weise wie etwas getan wird gut schnell sprechen de komplement modalkomplement',  /* Beschreiben wie eine Handlung ausgeführt wird (Er spricht sc */
  71:  'häufigkeit wie oft mal ci bian tang verbales zähleinheitswort anzahl',  /* Verbale Zähleinheitswörter und das Komplement der Häufigkeit */
  72:  'vergleich gleich genauso identisch yiyang gen he nicht unterschied',  /* Vergleichen I: Ausdrücken, dass zwei Nomen/Nominalphrasen gl */
  73:  'vergleich eigenschaft genauso gross wie gleich yiyang adjektiv',  /* Vergleichen II: Ausdrücken, dass zwei Nomen in Bezug auf ein */
  74:  'zeitdauer wie lange dauer stunden jahre lang seit dauerangabe',  /* Zeitdauerangaben */
  75:  'kurz mal eben einen moment yixia yihuir kurze zeit',  /* Die Wörtchen "yī xià" und "yīhuǐr" */
  76:  'nicht nur sondern auch budan erqie bujin darüber hinaus',  /* Die Konstruktion "... nicht nur ..., sondern auch ..." */
  77:  'erst dann schon bereits cai jiu früh spät',  /* Die Wörtchen "cái" – erst/erst dann und "jiù" – bereits/scho */
  78:  'sobald kaum sofort yi jiu unmittelbar danach',  /* Die Konstruktion "... yī ..., jiù ..." */
  79:  'ungefähr etwa circa rund mehr als zuoyou dayue chabuduo duo ji schätzung',  /* Ungefähre Angaben: "duō", "jǐ", "zuǒyòu", "dàyuē", "chàbuduō */
  80:  'erfahrung schon einmal jemals nie niemals noch erlebt guo erlebnis bereits gemacht',  /* Das Wörtchen "guò" zur Angabe von gemachter Erfahrung */
  81:  'bezüglich hinsichtlich was betrifft für duiyu guanyu dui lai shuo thema',  /* Die Wendungen "duìyú ...", "guānyú ..." und "duì ... lái shu */
  82:  'einzig einzige der weiyi nur einer',  /* Die Wörtchen "wéiyī" */
  83:  'einerseits andererseits zum einen anderen yi fangmian ling',  /* Die Struktur "yī fāngmiàn... lìng yī fāngmiàn..." */
  84:  'ba konstruktion objekt vorziehen handhabung ergebnis etwas mit machen',  /* Die "bǎ"-Konstruktion */
  85:  'passiv wurde von werden bei jiao rang gei leideform',  /* Das Passiv */
  86:  'lassen bitten veranlassen auffordern kausativ rang jiao qing shi zwei verben jemanden etwas tun',  /* Sätze mit zwei Verben: "ràng", "jiào", "qǐng", "shǐ" */
  87:  'potentialis möglichkeit kann nicht schaffen de bu komplement möglich unmöglich',  /* Das Komplement der Möglichkeit (Potentialis) */
  88:  'trennbare verben lihe liheci trennen verb objekt einschub',  /* Trennbare Verben ("líhécí") */
  89:  'ausser abgesehen von zusätzlich chule yiwai neben',  /* Die Konstruktion "... chúle ..., yǐwài ..." */
  90:  'rhetorische frage etwa doch nandao bu shi ma erstaunen',  /* Rhetorische Fragen: "nándào ... ma?" und "bù shì ... ma?" */
  91:  'jeder jeglich egal wer was verallgemeinerung shei dou shenme nali niemand nichts',  /* Kombination von Fragewort + "dōu" oder "yě" bzw. "dōu bù" od */
  92:  'denken meinen glauben finden annehmen yiwei renwei juede irrtum meinung',  /* Die Verben "yǐwéi", "rènwéi" und "juéde" – dreimal "denken/m */
  93:  'aufzählung erstens zweitens drittens diyi dier disan punkte nennen',  /* Die Struktur "Erstens..., zweitens..., drittens..., viertens */
  94:  'egal ob gleichgültig ganz gleich buguan wulun dou ye unabhängig davon',  /* Die Struktur "bùguǎn/wúlùn ..., dōu/yě ..." */
  95:  'sogar selbst nicht einmal lian ye dou',  /* Die Wörtchen "lián ... yě/dōu ..." */
  96:  'bruch anteil drittel viertel hälfte fenzhi bruchzahl',  /* Angabe von Anteilen/Brüchen */
  97:  'prozent prozentangabe vielfaches doppelt dreifach hälfte bai fen zhi bei ban',  /* Prozentangaben, Vielfache und "die Hälfte" */
  98:  'selbst wenn sogar jiushi jiusuan angenommen',  /* Die Strukturen "jiùshì ..., yě/hái ..." / "jiùsuàn (shì) ... */
  99:  'da ja nun einmal wo doch jiran schlussfolgerung',  /* Die Struktur "jìrán ..., jiù ..." */
  100: 'sonst andernfalls ansonsten fouze yaoburan buran warnung',  /* Die Wörtchen "fǒuzé, yàobùrán, „bùrán" */
  101: 'nur wenn es sei denn chufei cai bedingung ausnahme sonst andernfalls ansonsten buran fouze yaoburan',  /* Die Strukturen mit "chúfēi" */
};
