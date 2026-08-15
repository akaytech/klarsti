import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Mindmap',
    summary:
      'Ein Werkzeug für freie Assoziation: Ideen verzweigen sich von einem einzigen Zentrum aus. Die Kästchen verschiebst du nicht selbst — die Karte ordnet sich nach jeder Ergänzung neu, damit du dich auf den Inhalt statt auf das Layout konzentrierst.',
    whenToUse: [
      'Beim Brainstorming, wenn Ideen schnell heraus sollen und die Hierarchie noch offen ist.',
      'Um ein Thema in Unterpunkte zu zerlegen und seinen Umfang zu sehen.',
      'Für Notizen aus Besprechungen, Vorlesungen oder Büchern, ohne den Faden zu verlieren.',
      'Um Rohideen zu sammeln, bevor du zum Projektstrukturplan übergehst.'
    ],
    steps: [
      'Ein Projekt kann mehrere Karten enthalten. Über das Kartenmenü oben links legst du eine neue an oder wechselst zwischen ihnen.',
      'Wähle das Wurzelkästchen in der Mitte und benenne es mit F2 um; hier steht dein Thema.',
      'Tab öffnet unter dem ausgewählten Kästchen einen neuen Zweig. Das neue Kästchen ist sofort beschreibbar.',
      'Enter erzeugt einen Geschwisterzweig auf derselben Ebene. Das funktioniert auch beim Tippen: Text fertig, Enter, nächstes Kästchen.',
      'Rechtsklick auf ein Kästchen: Beschreibung ergänzen, Zweig als erledigt markieren oder ihn einklappen, wenn es unübersichtlich wird.',
      'Die Übersichtskarte unten rechts zeigt, wo du bist; zieh darin, um dich in großen Karten zu bewegen.'
    ],
    shortcuts: [
      { keys: ['Tab'], desc: 'Neuer Zweig unter dem ausgewählten Kästchen' },
      { keys: ['Enter'], desc: 'Geschwisterzweig auf derselben Ebene' },
      { keys: ['F2'], desc: 'Ausgewähltes Kästchen umbenennen' },
      { keys: ['Delete'], desc: 'Ausgewählten Zweig löschen (die Wurzel bleibt)' },
      { keys: ['Shift', 'Enter'], desc: 'Zeilenumbruch beim Tippen' },
      { keys: ['Esc'], desc: 'Textfeld schließen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Kästchen lassen sich nicht ziehen, die Anordnung ist automatisch. Willst du einen Zweig verschieben, lösche ihn und lege ihn an der richtigen Stelle neu an.',
      'Die Zweigfarben richten sich nach dem Hauptzweig an der Wurzel: gleiche Farbe heißt gleiche Oberkategorie.',
      'In einem Textfeld greifen Delete und F2 nicht; beende die Eingabe erst mit Enter oder Esc.'
    ]
  },

  wbs: {
    title: 'Projektstrukturplan (PSP)',
    summary:
      'Ein Baum mit drei Ebenen: oben das PROJEKT, darunter die PHASEN, darunter die ARBEITSPAKETE. Jedes Kästchen trägt Status, Fälligkeitsdatum, Arbeitszeit und Beschreibung. Anders als in der Mindmap steuerst du hier Arbeit, nicht Ideen.',
    whenToUse: [
      'Um ein Projekt so weit herunterzubrechen, dass klar ist, wer was macht.',
      'Um den Umfang festzuzurren: Was nicht im Baum steht, gehört nicht zum Projekt.',
      'Um Arbeit an Termine zu binden und den Fortschritt über Status zu verfolgen.'
    ],
    steps: [
      'Ein Baum enthält ein Projektkästchen. Für ein zweites Projekt öffnest du links im Menü "Bäume" einen neuen Baum.',
      'Die Schaltfläche unten richtet sich nach der Auswahl: Beim Projekt heißt sie "Phase hinzufügen", bei einer Phase oder einem Arbeitspaket "Arbeitspaket hinzufügen". Ohne Auswahl kommt eine Phase unter das Projekt.',
      'Dasselbe per Tastatur: Strg-Klick auf ein Kästchen legt darunter ein neues an.',
      'Ein einfacher Klick wählt das Kästchen aus, klappt die Zweige darunter auf oder zu und zentriert die Kamera darauf.',
      'Rechtsklick auf ein Kästchen: Name, Fälligkeitsdatum, Start- und Endzeit, Beschreibung und Status (Zu erledigen / In Arbeit / Erledigt / Fehlgeschlagen).',
      'Im selben Menü verschiebt "Zur Agenda hinzufügen" den Eintrag mit dem gewählten Datum in deine Agenda. Bei einem vergangenen Datum kommt eine Warnung.',
      'Markierst du einen Eintrag als fehlgeschlagen, erscheint "Ursache analysieren"; ein Klick überträgt ihn als Problem in die 5-Warum-Analyse.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Klick'], desc: 'Auf dem Projektkästchen: Phase darunter' },
      { keys: ['Mod', 'Klick'], desc: 'Auf Phase oder Arbeitspaket: Arbeitspaket darunter' },
      { keys: ['Shift', 'Ziehen'], desc: 'Kästchen samt aller Zweige darunter verschieben' },
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Was unter einem Arbeitspaket liegt, ist wieder ein Arbeitspaket; der Plan darf so tief gehen wie nötig.',
      'Ziehst du ohne Shift, bewegt sich nur das angefasste Kästchen; alles darunter bleibt liegen.',
      'Zerlege so lange, bis jedes Arbeitspaket klein genug ist, dass eine Person es allein abschließen kann.',
      'Ein Datum löschst du über das kleine Kreuz neben dem Datumsfeld im Rechtsklickmenü; die Uhrzeiten verschwinden mit.'
    ]
  },

  '5whys': {
    title: '5-Warum-Analyse',
    summary:
      'Immer wieder "und warum ist das passiert?" fragen, um vom sichtbaren Symptom zur eigentlichen Ursache zu kommen. Fünf ist keine Regel, sondern ein Richtwert: Wiederholen sich deine Antworten, bist du unten angekommen.',
    whenToUse: [
      'Um die wirkliche Ursache eines Fehlers zu finden, statt das Symptom zu behandeln.',
      'In Nachbetrachtungen, in denen es um die Ursache geht und nicht um Schuldige.',
      'Um festzuhalten, warum eine PSP-Aufgabe gescheitert ist.'
    ],
    steps: [
      'Über das Menü oben links wechselst du zwischen den Analysen desselben Projekts und legst neue an, benennst sie um oder löschst sie.',
      'Beginne auf dem leeren Bildschirm mit "Problem hinzufügen" und beschreibe in einem Satz, was passiert ist. Es gibt auch ein fertiges Beispiel.',
      'Strg-Klick auf ein Kästchen öffnet darunter ein neues "Warum". Schreib die Antwort hinein und wiederhole das Gleiche dort.',
      'Kommst du nicht tiefer, erzeugt Shift-Klick auf dieses Kästchen ein Ursachen-Kästchen. Darunter lässt sich nichts mehr anhängen, die Kette endet dort.',
      'Per Rechtsklick bearbeitest oder löschst du Kästchen.',
      'Strg-Klick auf die leere Fläche startet eine zweite, unabhängige Problemkette auf derselben Zeichenfläche.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Klick'], desc: 'Auf einem Kästchen: neues Warum darunter' },
      { keys: ['Shift', 'Klick'], desc: 'Auf einem Kästchen: Ursachen-Kästchen' },
      { keys: ['Mod', 'Klick'], desc: 'Auf leerer Fläche: neues Problem' },
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Startest du eine Ursachenanalyse aus einer Aufgabe im Projektstrukturplan, entsteht dafür eine eigene Analyse; die offene wird nicht überschrieben.',
      'Eine Ursache kann mehrere Antworten haben; mehrfaches Strg-Klicken auf dasselbe Kästchen verzweigt sie.',
      'Stütze jede Antwort auf etwas Überprüfbares. "Unachtsamkeit" ist keine Ursache, sondern eine offene Frage.',
      'Eine im PSP als fehlgeschlagen markierte Aufgabe lässt sich direkt aus deren Rechtsklickmenü hierher schicken.'
    ]
  },

  flowchart: {
    title: 'Flussdiagramme',
    summary:
      'Zeichne die Schritte, Entscheidungspunkte und die Richtung eines Ablaufs. Es gibt drei Diagrammtypen: Arbeitsablauf, Prozessablauf und Datenfluss. Der gewählte Typ bestimmt, welche Kästchenformen zur Verfügung stehen.',
    whenToUse: [
      'Arbeitsablaufdiagramm: um Aufgaben, Entscheidungen, Freigaben und die Ausführenden zu zeigen.',
      'Prozessablaufdiagramm: um einen Fertigungs- oder Serviceprozess über Bearbeitung, Transport, Prüfung, Wartezeit und Lagerung zu analysieren.',
      'Datenflussdiagramm: um zu zeigen, wie Daten zwischen externen Einheiten, Prozessen und Datenspeichern fließen.'
    ],
    steps: [
      'Beim ersten Öffnen erscheint die Typauswahl. Der Typ lässt sich später ändern; die Kästchen werden in die nächstliegende Entsprechung überführt.',
      'Über das Diagrammmenü oben links hältst du mehrere Diagramme im selben Projekt und wechselst zwischen ihnen.',
      'Rechtsklick auf ein Kästchen: Beim Anlegen eines Kästchens darunter wählst du auch dessen Form (Start, Bearbeitung, Entscheidung, Dokument, Ende ...). Im selben Menü bearbeitest oder löschst du es.',
      'Kästchen ziehst du frei an ihren Platz; hier gibt es keine automatische Anordnung, die Aufteilung gehört dir.',
      'Für eine Verbindung ziehst du von einem Verbindungspunkt am Rand eines Kästchens zu einem anderen.',
      'Unten links zoomst du über die Steuerung, unten rechts navigierst du mit der Übersichtskarte.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen oder Verbindung löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Beschrifte jeden Pfad, der aus einer Entscheidung herausführt; der Leser muss sehen, welche Bedingung wohin führt.',
      'Passt ein Diagramm nicht mehr auf eine Seite, teile es: Verschiebe einen überladenen Abschnitt in ein Teilprozess-Kästchen und zeichne ihn separat.',
      'Das Rollen-Kästchen im Arbeitsablauf zeigt, wer einen Schritt ausführt; lass es weg, wenn du den Ablauf unabhängig von Personen beschreiben willst.'
    ]
  },

  orgchart: {
    title: 'Organigramme',
    summary:
      'Zeigt, wer wem berichtet und wo jede Einheit sitzt. Es gibt sieben Diagrammtypen: hierarchisch, funktional, divisional, Matrix, flach, teambasiert und Netzwerk. Der Typ bestimmt die verfügbaren Kästchenarten und die Darstellung der Verbindungen.',
    whenToUse: [
      'Um die bestehende Struktur festzuhalten und offene Stellen wie Doppelungen zu erkennen.',
      'Um eine Umstrukturierung zu diskutieren: dasselbe Team in verschiedenen Typen zeichnen und vergleichen.',
      'Um doppelte Berichtslinien in der Matrix oder externe Partner im Netzwerk sichtbar zu machen.'
    ],
    steps: [
      'Beim ersten Öffnen wählst du den Diagrammtyp. Er lässt sich später ändern; die Kästchen werden übernommen und die Anordnung bleibt erhalten.',
      'Über das Diagrammmenü oben links hältst du mehrere Diagramme in einem Projekt (etwa Ist- und Zielstruktur).',
      'Rechtsklick auf ein Kästchen: Position, Einheit, Team oder offene Stelle darunter anlegen. Im selben Menü bearbeitest du Namen und die Bezeichnung darunter.',
      'Kästchen ziehst du frei an ihren Platz.',
      'Normale Verbindungen ziehst du von den oberen und unteren Punkten eines Kästchens: Das ist die eigentliche Berichtslinie.',
      'Linien von den seitlichen Punkten werden gestrichelt gezeichnet und stehen für eine zweite Berichtslinie (in Matrix-, hierarchischen und Netzwerkdiagrammen).'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen oder Verbindung löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Das Kästchen für offene Stellen hält unbesetzte Positionen sichtbar; damit liest sich das Diagramm zugleich als Einstellungsplan.',
      'Nutze die zweite Zeile für die Bezeichnung: oben Person oder Einheit, darunter die Rolle.',
      'Verwechsle die beiden Linienarten nicht: Die durchgezogene sagt, wem du berichtest, die gestrichelte, mit wem du arbeitest.'
    ]
  },

  swot: {
    title: 'SWOT-Analyse',
    summary:
      'Betrachtet eine Idee, ein Projekt oder eine Organisation durch vier Fenster: Was ist innen gut und schlecht, welche Chancen und Risiken gibt es außen. Es geht nicht um vier Listen, sondern darum, sie zu einer Strategie zu verbinden.',
    whenToUse: [
      'Um sich vor einer Entscheidung ein Gesamtbild zu verschaffen.',
      'Vor Jahresplanung oder Budget, um die aktuelle Lage zu bestimmen.',
      'Um einzuschätzen, wo man gegenüber einem Wettbewerber steht.',
      'Um im Team ein gemeinsames Bild zu erzeugen: alle schauen auf dieselben vier Felder.'
    ],
    steps: [
      'Gib oben einen Namen für die Analyse ein und klicke auf Erstellen. Ein Projekt kann mehrere SWOTs enthalten.',
      'Es erscheinen vier Felder: Stärken, Schwächen, Chancen, Risiken.',
      'Schreib einen Punkt in das Feld unter einem Kasten und drück Enter oder klicke auf Plus.',
      'Ein Klick auf einen vorhandenen Punkt macht ihn direkt bearbeitbar; Änderungen werden automatisch gespeichert.',
      'Der Papierkorb am Punkt löscht diesen Punkt, der in der Kopfzeile die gesamte Analyse.',
      'Zum Kennenlernen kannst du auf dem Startbildschirm das fertige Beispiel laden.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Eingetragenen Punkt zum Feld hinzufügen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Stärken und Schwächen sind intern und in deiner Hand, Chancen und Risiken extern. Eine SWOT, die das vermischt, ist wertlos.',
      'Die eigentliche Arbeit ist das Verknüpfen: Welche Stärke greift welche Chance auf, welche Schwäche öffnet welchem Risiko die Tür?',
      'Ein Feld mit zehn Punkten zu füllen und ein anderes leer zu lassen, ist keine Analyse, sondern Parteinahme.'
    ]
  },

  ishikawa: {
    title: 'Ishikawa (Fischgräte)',
    summary:
      'Sammelt mögliche Ursachen eines Problems unter sechs Überschriften: Mensch, Maschine, Material, Methode, Messung und Umfeld. Der Fischkopf ist das Problem, die Gräten sind Ursachengruppen. Ziel ist, alle Bereiche abzusuchen statt nur einen.',
    whenToUse: [
      'Wenn unklar ist, wo die Ursache liegt, und kein Bereich übersprungen werden soll.',
      'Beim Brainstorming im Team, damit jeder aus seinem Bereich beiträgt.',
      'Um Ursachenkandidaten zu sammeln, bevor es in die 5-Warum-Analyse geht.'
    ],
    steps: [
      'Beschreibe das Problem oben in einem Satz und klicke auf Start.',
      'Es erscheinen sechs Kategoriefelder. Schreib eine mögliche Ursache in das Feld darunter und drück Enter.',
      'Die Problemformulierung bearbeitest du in der Kopfzeile, die Punkte direkt in ihren Feldern.',
      'Ein Projekt kann mehrere Analysen enthalten; jede wird zu einer eigenen Karte mit eigener Problemformulierung.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Eingetragene Ursache zur Kategorie hinzufügen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Du musst nicht jede Kategorie füllen; eine leere Kategorie ist ebenfalls eine Information.',
      'Schreib auf, was geschehen ist, nicht das Symptom: nicht "war zu spät", sondern "die Freigabe lag drei Tage".',
      'Nimm die stärksten Kandidaten mit in die 5-Warum-Analyse. Ishikawa gibt Breite, 5 Warum gibt Tiefe.'
    ]
  },

  pdca: {
    title: 'PDCA-Zyklus',
    summary:
      'Plan, Do, Check, Act. Führt eine Verbesserung nicht als einmalige Aufgabe, sondern als drehendes Rad: Jede Runde beginnt mit dem Ergebnis der vorigen.',
    whenToUse: [
      'Eine kleine Änderung ausprobieren, das Ergebnis messen und sie dann ausrollen.',
      'Festhalten, ob eine Maßnahme tatsächlich gewirkt hat.',
      'Runden verfolgen in Teams, die kontinuierlich verbessern.'
    ],
    steps: [
      'Schreib das Ziel des Zyklus oben hin und klicke auf Start.',
      'Es erscheinen vier Phasenfelder. Trag deine Punkte in das Feld unter jeder Phase ein.',
      'Ein Klick auf den Kreis links neben einem Punkt markiert ihn als erledigt und streicht ihn durch.',
      'Ein Projekt kann mehrere Zyklen enthalten; jedes Ziel wird zu einer eigenen Karte.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Eingetragenen Punkt zur Phase hinzufügen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Schreib in die Check-Phase etwas Messbares. Ohne Zahl hinter "ist es besser geworden?" schließt sich der Zyklus nie.',
      'Was aus der Act-Phase herauskommt, ist die Eingabe für die Plan-Phase der nächsten Runde.',
      'Versuch nicht, alle vier Felder gleichzeitig zu füllen; die Reihenfolge ist die Methode.'
    ]
  },

  waterfall: {
    title: 'Wasserfallmodell',
    summary:
      'Teilt ein Projekt in sechs aufeinanderfolgende Phasen: Anforderungen, Grobentwurf, Feinentwurf, Umsetzung, Verifikation, Wartung. Die nächste Phase öffnet erst, wenn die aktuelle geschlossen ist — und eine geschlossene Phase bleibt gesperrt.',
    whenToUse: [
      'Arbeit, deren Anforderungen von Anfang an feststehen und sich unterwegs nicht ändern.',
      'Projekte mit Freigaben und Dokumentationspflicht, in denen jede Phase belegt sein muss.',
      'Arbeit, bei der die Reihenfolge selbst zählt: Die Fertigung darf nicht vor dem Entwurf beginnen.'
    ],
    steps: [
      'Schreib den Projektnamen oben hin und klicke auf Start.',
      'Die sechs Phasen stapeln sich untereinander. Nur die offene Phase nimmt Punkte auf; spätere sind mit einem Schloss markiert.',
      'Ist die Phase fertig, klicke auf "Phase abschließen" unter dem Kasten.',
      'Nach der Bestätigung öffnet die nächste Phase; die abgeschlossene bekommt ein Häkchen und ihre Punkte lassen sich nicht mehr ändern.',
      'Ein Projekt kann mehrere Wasserfallprojekte enthalten.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Eingetragenen Punkt zur Phase hinzufügen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig (macht auch einen Phasenabschluss zurück)' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Es gibt keine Schaltfläche, um eine Phase wieder zu öffnen; hast du versehentlich abgeschlossen, hilft nur Rückgängig.',
      'Vergewissere dich vor dem Abschluss, dass die Phase wirklich vollständig ist — mit dem Abschluss werden auch die Texte gesperrt.',
      'Ändern sich Anforderungen unterwegs, engt dich der Wasserfall ein; dann arbeiten PSP oder PDCA angenehmer.'
    ]
  },

  fta: {
    title: 'Fehlerbaumanalyse (FTA)',
    summary:
      'Oben steht ein unerwünschtes Ereignis, darunter die Bedingungen, die zusammentreffen müssen, damit es eintritt. Der Baum wird aus Logikgattern gebaut; trägst du Wahrscheinlichkeiten an den Basisereignissen ein, wird die des Top-Ereignisses berechnet.',
    whenToUse: [
      'Um zu sehen, welche Kombinationen von Bedingungen einen Ausfall oder Unfall erzeugen können.',
      'Um über Risiko in Zahlen zu sprechen: Welcher Zweig trägt wie viel zum Gesamtwert bei?',
      'Um zu zeigen, welchen Zweig eine Schutzmaßnahme abschneidet.'
    ],
    steps: [
      'Über das Menü oben links wechselst du zwischen den Bäumen desselben Projekts und legst neue an, benennst sie um oder löschst sie.',
      'Lege auf dem leeren Bildschirm das Kästchen für das Top-Ereignis an oder lade das fertige Beispiel.',
      'Rechtsklick auf ein Kästchen, dann Bearbeiten: Name, Beschreibung und — bei Basisereignissen — Wahrscheinlichkeit.',
      'Aus demselben Menü fügst du darunter Ereignisse ein: Ereignis, Basisereignis, unentwickeltes Ereignis oder Bedingungsereignis.',
      'Ebenfalls dort findest du die Logikgatter: UND, Prioritäts-UND, ODER, exklusives ODER und Sperrgatter.',
      'Trag die Wahrscheinlichkeiten als Prozentwerte an den Basisereignissen ein; Gatter und Top-Ereignis werden daraus berechnet.',
      'Kästchen ziehst du an ihren Platz, mit der Übersichtskarte unten rechts navigierst du im großen Baum.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Ein UND-Gatter multipliziert die Wahrscheinlichkeiten darunter — alles muss eintreten, das Ergebnis wird kleiner. Ein ODER-Gatter braucht nur eines, das Ergebnis wächst.',
      'Zweige ohne Wahrscheinlichkeit zählen nicht mit; die Zahl oben deckt nur ab, was du eingetragen hast.',
      'Basisereignisse sind Kreise, unentwickelte Ereignisse Rauten: Markierst du die nicht weiter verfolgten Zweige, bleibt der Baum ehrlich.'
    ]
  },

  vsm: {
    title: 'Wertstromanalyse (VSM)',
    summary:
      'Zeichnet den Fluss eines Produkts oder Auftrags von Anfang bis Ende, samt Wartezeiten und Beständen dazwischen. Ziel ist zu sehen, wie viel der Gesamtzeit tatsächlich Wert schafft — meist deutlich weniger als angenommen.',
    whenToUse: [
      'Um zu finden, wo ein Prozess wartet und wo sich Arbeit staut.',
      'Um zu sehen, welcher Schritt der Kundennachfrage nicht folgen kann: überschreitet etwas die Taktzeit?',
      'Um den Ist-Zustand zu zeichnen und einen Soll-Zustand zum Vergleich danebenzustellen.',
    ],
    steps: [
      'Trage Tagesbedarf und Schichtdaten im Panel oben rechts ein. Daraus ergibt sich die Taktzeit: wie oft ein Teil fertig werden muss.',
      'Erstelle auf leerer Fläche das Startgerüst oder fange leer an. Mit Rechtsklick auf die Fläche fügst du jeden Kasten hinzu.',
      'Schreibe die Zykluszeit mit Einheit in den Prozesskasten. Überschreitet sie die Taktzeit, wird der Kasten rot: dort ist der Engpass.',
      'Trage die wartende Stückzahl in den Bestandskasten ein; die Wartezeit ergibt sich als Stück ÷ Tagesbedarf. Ohne Zählung kannst du die Zeit direkt eingeben.',
      'Verbinde die Kästen. Mit Rechtsklick auf eine Verbindung wechselst du zu Push, Pull, FIFO, manueller oder elektronischer Information. Nur Materialpfeile gehen in die Zeitrechnung ein.',
      'Kopiere über das Menü oben links den Ist-Zustand als Soll-Zustand, arbeite daran und vergleiche die Zahlen unten.',
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Die Flusseffizienz unten ist wertschöpfende Zeit geteilt durch die Durchlaufzeit. Einstellige Werte sind normal; zu verkürzen ist das Warten, nicht die Arbeit.',
      'Lässt du Bestände weg, sieht die Gesamtzeit besser aus als sie ist — dort steckt die eigentliche Information.',
      'Nicht mit der Kette verbundene Kästen zählen nicht zu den Summen und werden unten als Warnung gezählt. Verbinde den Fluss als eine Linie.',
      'Setze den Kaizen-Blitz dorthin, wo du verbessern willst; so liest man eine Soll-Zustand-Karte.',
    ]
  },

  pareto: {
    title: 'Pareto-Analyse',
    summary:
      'Der größte Teil der Wirkung stammt von wenigen Ursachen. Sortiert Kategorien nach Häufigkeit absteigend und legt eine kumulative Prozentkurve darüber, sodass die wenigen Positionen hinter dem Großteil des Problems sichtbar werden.',
    whenToUse: [
      'Um zu entscheiden, welche von vielen Beschwerden, Fehlern oder Kostenpositionen zuerst drankommt.',
      'Um zu zeigen, wo eine Verbesserung am meisten bringt.',
      'Um zu begründen, warum Mittel auf wenige Punkte konzentriert statt verteilt werden.'
    ],
    steps: [
      'Lege beim ersten Öffnen die Analyse an. Über die Liste oben wechselst du zwischen den Analysen des Projekts, mit dem Stift benennst du um, mit dem Papierkorb löschst du.',
      'Trag im Panel links Kategoriename und Häufigkeit in die Tabelle ein.',
      'Für eine neue Zeile nutzt du die Hinzufügen-Schaltfläche unter der Tabelle.',
      'Das Diagramm aktualisiert sich sofort: Die Balken sortieren sich absteigend, die Kurve zeigt den kumulativen Anteil.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Statt Häufigkeit kannst du Kosten oder verlorene Zeit eintragen — solange alle Zeilen dieselbe Einheit verwenden.',
      'Hör dort auf, wo die Kurve flach wird: Der lange Schwanz rechts lohnt die Mühe nicht.',
      'Zerlegst du die Kategorien zu fein, sticht nichts mehr hervor und das Diagramm verflacht. Fass Ähnliches zusammen.'
    ]
  },

  histogram: {
    title: 'Histogramm',
    summary:
      'Zeigt die Verteilung eines Messwerts: wo sich Werte sammeln, ob die Streuung symmetrisch ist, ob etwas am Rand liegt. Du gibst Rohmesswerte ein, das Werkzeug bildet Klassen und berechnet mit Spezifikationsgrenzen auch die Prozessfähigkeit.',
    whenToUse: [
      'Um zu sehen, was der Mittelwert verbirgt: derselbe Mittelwert kann aus sehr verschiedenen Verteilungen stammen.',
      'Um zu beurteilen, wie gleichmäßig ein Prozess läuft — schmale Streuung heißt konstant, breite heißt unruhig.',
      'Um zu sehen, wie oft Messwerte außerhalb der Spezifikation liegen und ob der Prozess die Anforderung erfüllt.',
    ],
    steps: [
      'Analyse anlegen; über die Liste oben wechselst du zwischen Analysen desselben Projekts.',
      'Messwerte links in das Feld schreiben oder eine Liste einfügen. Ein Wert pro Zeile; Dezimaltrennzeichen Komma oder Punkt.',
      'Die Klassenanzahl wählt das Werkzeug selbst (Sturges-Regel). Bei Bedarf eigene Zahl eintragen.',
      'Untere und obere Spezifikationsgrenze eingeben. Sie erscheinen als rote gestrichelte Linien, Säulen außerhalb werden rot.',
      'Unten stehen Anzahl, Mittelwert, Standardabweichung und Spannweite; mit beiden Grenzen zusätzlich Cp und Cpk.',
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Die graue Kurve ist eine Normalverteilung mit gleichem Mittelwert und gleicher Abweichung. Deutliche Abweichungen deuten auf eine besondere Ursache.',
      'Eine zweigipflige Verteilung heißt meist, dass zwei Prozesse (zwei Schichten, zwei Maschinen) vermischt wurden.',
      'Cpk ab 1,33 gilt allgemein als fähig; unter 1 hält der Prozess die Grenzen nicht ein.',
      'Gutes Cp bei schlechtem Cpk heißt: die Streuung ist eng, aber der Mittelwert ist verschoben — eine Justage genügt.',
    ]
  },

  decision: {
    title: 'Entscheidungsmatrix',
    summary:
      'Bewertet mehrere Optionen anhand derselben Kriterien. Jedes Kriterium hat eine Gewichtung; die Gesamtsumme einer Option ist die Summe der Produkte aus Punktzahl und Gewichtung.',
    whenToUse: [
      'Wenn du zwischen wenigen Alternativen feststeckst und sich die Diskussion im Kreis dreht.',
      'Wenn die Begründung einer Entscheidung dokumentiert werden muss.',
      'Wenn im Team jeder still ein anderes Kriterium abwägt: Die Matrix holt diese Kriterien hervor.'
    ],
    steps: [
      'Kriterien anlegen: die Überschriften, entlang derer du vergleichst (Kosten, Zeit, Risiko ...).',
      'Gib jedem Kriterium eine Gewichtung von 1 bis 5 — wie wichtig dir diese Überschrift ist.',
      'Optionen anlegen: die Alternativen, die du vergleichst.',
      'Bewerte in der Tabelle jede Option je Kriterium mit 0 bis 10 Punkten.',
      'Die Summen werden automatisch berechnet; die höchste Option wird mit einem Pokal markiert.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Lege die Gewichtungen fest, bevor du zu bewerten beginnst. Sie nachträglich zu verschieben heißt nicht entscheiden, sondern das gewünschte Ergebnis herstellen.',
      'Die Matrix entscheidet nicht für dich; sie macht sichtbar, wonach du entschieden hast.',
      'Liegen zwei Summen sehr nah beieinander, lautet die Antwort nicht "gleichwertig", sondern "diese Kriterien trennen nicht" — such ein fehlendes Kriterium.'
    ]
  },

  notepad: {
    title: 'Agenda',
    summary:
      'Ein persönlicher Bereich, in dem du Tage im Kalender auswählst und planst. Anders als die übrigen Werkzeuge gehört die Agenda nicht zum Projekt: Die Einträge sind deine und gehen beim Teilen eines Projekts an niemanden.',
    whenToUse: [
      'Um den Tag zu planen und Arbeit in Stunden einzuordnen.',
      'Um eine PSP-Aufgabe auf einen bestimmten Tag zu ziehen.',
      'Um zum Tagesabschluss in eigenen Worten festzuhalten, wie er verlaufen ist.'
    ],
    steps: [
      'Tage mit Einträgen sind im Kalender markiert; ein Klick öffnet den Ablauf dieses Tages.',
      'Für einen neuen Eintrag schreibst du Titel und Text. Gib ihm eine Zeitspanne oder lass ihn ganztägig.',
      'Kollidiert eine gesetzte Zeitspanne mit einem anderen Eintrag, erscheint eine Warnung.',
      'Du kannst eine Erinnerung setzen: zum Zeitpunkt, 5 / 15 / 30 Minuten, 1 Stunde oder 1 Tag vorher. Erinnerungen kommen als Benachrichtigung in der mobilen App.',
      'Im Bereich für die Tagesauswertung oben schreibst du in eigenen Worten über den Tag; separat speichern musst du nicht.',
      'An einem vergangenen Tag lässt sich kein neuer Eintrag anlegen. Bestehende kannst du bearbeiten oder mit "Auf heute verschieben" nach vorn holen.'
    ],
    tips: [
      'Rechtsklick auf eine PSP-Aufgabe und "Zur Agenda hinzufügen" — sie landet mit ihrem eigenen Datum hier.',
      'Rückgängig und Wiederholen wirken in der Agenda nicht; sie führt keine Historie.',
      'Die Liste unter dem Kalender zeigt deine anstehenden Einträge; fang dort an, wenn du nicht weißt, welchen Tag du öffnen sollst.'
    ]
  }
};

export default guides;
