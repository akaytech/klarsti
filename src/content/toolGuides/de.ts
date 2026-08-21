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
    ],
    seo: {
      name: 'Mindmap',
      title: 'Mindmap erstellen — kostenloses Mindmap-Tool | Klarsti',
      description:
        'Setze ein Thema in die Mitte und verzweige es; die Anordnung übernimmt das Programm. Zum Sammeln von Ideen, kostenlos.',
      keywords: 'mindmap erstellen, mindmap online, mind map kostenlos, gedankenkarte, mindmap beispiel'
    },
    example: {
      title: 'Beispiel: ein internes Schulungsprogramm aufsetzen',
      intro:
        'Ein HR-Team soll die Einarbeitung neu aufbauen und weiß nicht, wo es anfangen soll. Bevor irgendetwas entschieden wird, kommt alles, was im Kopf ist, auf eine einzige Karte.',
      blocks: [
        {
          heading: 'Wer nimmt teil',
          items: [
            'Neue Mitarbeitende',
            'Teamleitungen',
            'Remote-Beschäftigte',
            'Außendienst',
          ]
        },
        {
          heading: 'Was wir vermitteln',
          items: [
            'Produktwissen',
            'Interne Systeme',
            'Umgang mit Kunden',
            'Sicherheitsregeln',
          ]
        },
        {
          heading: 'Wie wir es vermitteln',
          items: [
            'Präsenzworkshop',
            'Aufgezeichnetes Video',
            'Kurze Wocheneinheit',
            'Begleitung durch erfahrene Kollegen',
          ]
        },
        {
          heading: 'Wie wir es messen',
          items: [
            'Kurzer Test am Ende',
            'Rückmeldung der Führungskraft nach drei Monaten',
            'Zeit bis zur ersten eigenständigen Aufgabe',
            'Teilnahmequote',
          ]
        },
      ],
      outcome:
        'Mit vier Ästen auf der Karte springt die Lücke ins Auge: der Ast zur Messung ist deutlich dünner als die anderen. Das Team geht dorthin zurück, bevor eine einzige Folie geschrieben wird. Genau dafür ist eine Mindmap da — sie zeigt, welche Seite leer ist.'
    },
    faq: [
      {
        q: 'Was ist eine Mindmap?',
        a:
          'Eine Art, Ideen zu sammeln: ein Thema in die Mitte, von dort verzweigt es sich nach außen. Der Unterschied zu einer Liste ist, dass eine Liste dich zwingt, der Reihe nach zu denken, während die Karte jeden Gedanken an den Ast lässt, zu dem er gehört. Deshalb funktioniert sie besser, um wirres Denken zu ordnen.'
      },
      {
        q: 'Was ist der Unterschied zwischen Mindmap und Projektstrukturplan?',
        a:
          'Eine Mindmap sammelt Ideen; es gibt keine Verantwortlichen, Termine oder Reihenfolge. Ein Projektstrukturplan steuert Arbeit: jedes Kästchen hat Status, Termin und Aufwand. Die übliche Reihenfolge ist erst Mindmap, dann PSP, sobald der Umfang steht.'
      },
      {
        q: 'Kann ich die Kästchen verschieben?',
        a:
          'Nein, die Anordnung ist automatisch. Um einen Ast zu verschieben, lösch ihn und leg ihn an der richtigen Stelle neu an. Das ist Absicht: Zeit fürs Ausrichten von Kästchen fehlt beim Denken.'
      },
      {
        q: 'Wie viele Äste sollte eine Mindmap haben?',
        a:
          'Es gibt keine Grenze, aber mehr als sieben oder acht auf derselben Ebene lässt sich nicht mehr lesen. Wenn du dort ankommst, fasse ähnliche Äste unter einem neuen zusammen, dann wird die Karte wieder lesbar.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei. Für die Mindmap brauchst du nicht einmal ein Konto.'
      },
    ]
  },

  wbs: {
    title: 'Projektstrukturplan',
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
      'Ein einfacher Klick wählt das Kästchen nur aus. Zum Auf- und Zuklappen der Zweige darunter doppelklickst du auf das Kästchen; die Kamera zentriert sich dabei darauf. (Ein Doppelklick auf den Namen bearbeitet den Namen.)',
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
    ],
    seo: {
      name: 'Projektstrukturplan (PSP)',
      title: 'Projektstrukturplan erstellen — PSP-Tool | Klarsti',
      description:
        'Zerlege dein Projekt in Phasen und Arbeitspakete, mit Status, Termin und Aufwand je Paket. Mit ausgefülltem Beispiel, kostenlos.',
      keywords: 'projektstrukturplan, psp erstellen, work breakdown structure, projektstrukturplan beispiel, arbeitspakete'
    },
    example: {
      title: 'Beispiel: ein Café eröffnen',
      intro:
        'Sechs Monate bis zur Eröffnung. Die Aufgabe wirkt riesig und es gibt keinen offensichtlichen Punkt, an dem man sie anfasst. In drei Phasen zerlegt liefert jede Phase konkrete Pakete, die eine Person übernehmen kann.',
      blocks: [
        {
          heading: '1. Standort und Genehmigungen',
          items: [
            'Mieten in drei Vierteln vergleichen',
            'Mietvertrag unterschreiben',
            'Gewerbeanmeldung',
            'Lebensmittelrechtliche Erlaubnis',
          ]
        },
        {
          heading: '2. Ausbau',
          items: [
            'Umbauplanung',
            'Bauarbeiten',
            'Espressomaschine und Mühle',
            'Tische, Stühle, Theke',
          ]
        },
        {
          heading: '3. Eröffnung',
          items: [
            'Zwei Baristas einstellen',
            'Karte und Preise',
            'Lieferantenverträge',
            'Eröffnungsankündigung',
          ]
        },
      ],
      outcome:
        'Zwölf Arbeitspakete. Der Umfang steht damit fest: Arbeit, die nicht im Baum steht, gehört nicht zum Projekt. Auch die Reihenfolge wird sichtbar — der Ausbau kann ohne Genehmigung nicht starten, und damit ist die erste Phase die riskante.'
    },
    faq: [
      {
        q: 'Was ist ein Projektstrukturplan (PSP)?',
        a:
          'Ein Baum, der ein Projekt zerlegt, bis jedes Stück klein genug ist, um es einer Person zu geben. Oben das Projekt, darunter die Phasen, darunter die Arbeitspakete. Sein Zweck ist nicht, die Arbeit zu verkleinern, sondern den Umfang sichtbar zu machen: was nicht im Baum steht, gehört nicht zum Projekt.'
      },
      {
        q: 'Wie viele Ebenen sollte ein PSP haben?',
        a:
          'Drei Ebenen reichen für fast alles: Projekt, Phase, Arbeitspaket. Die Faustregel ist einfach — wenn du bei einem Kästchen sagen kannst, wer es macht und wie lange es dauert, hör auf zu zerlegen. Wenn nicht, geh eine Ebene tiefer.'
      },
      {
        q: 'Was ist der Unterschied zum Gantt-Diagramm?',
        a:
          'Der PSP beantwortet «was ist zu tun», das Gantt-Diagramm «wann». Die richtige Reihenfolge ist erst Strukturplan, dann Kalender. Ein Gantt-Diagramm ohne vorherige Zerlegung ist eine halb erinnerte Aufgabenliste auf einer Zeitachse.'
      },
      {
        q: 'Wie groß sollte ein Arbeitspaket sein?',
        a:
          'Ein gängiges Maß ist das, was eine Person in ein bis zwei Wochen schafft. Größer, und du kannst den Fortschritt nicht verfolgen; kleiner, und der Baum füllt sich mit Rauschen.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto, um einen Projektstrukturplan zu bauen.'
      },
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
      'Eine Analyse hat genau ein Hauptproblem. Für ein zweites Problem legst du über das Menü oben links eine neue Analyse an.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Klick'], desc: 'Auf einem Kästchen: neues Warum darunter' },
      { keys: ['Shift', 'Klick'], desc: 'Auf einem Kästchen: Ursachen-Kästchen' },
      { keys: ['Delete'], desc: 'Ausgewähltes Kästchen löschen' },
      { keys: ['Mod', 'Z'], desc: 'Rückgängig' },
      { keys: ['Mod', 'Y'], desc: 'Wiederholen' }
    ],
    tips: [
      'Startest du eine Ursachenanalyse aus einer Aufgabe im Projektstrukturplan, entsteht dafür eine eigene Analyse; die offene wird nicht überschrieben.',
      'Eine Ursache kann mehrere Antworten haben; mehrfaches Strg-Klicken auf dasselbe Kästchen verzweigt sie.',
      'Stütze jede Antwort auf etwas Überprüfbares. "Unachtsamkeit" ist keine Ursache, sondern eine offene Frage.',
      'Eine im PSP als fehlgeschlagen markierte Aufgabe lässt sich direkt aus deren Rechtsklickmenü hierher schicken.'
    ],
    seo: {
      name: '5-Why-Methode',
      title: '5-Why-Methode — die Ursache finden | Klarsti',
      description:
        'Frage fünfmal warum und komme vom Symptom zur eigentlichen Ursache. Schritt für Schritt erklärt, mit echtem Beispiel, kostenlos.',
      keywords: '5 why methode, 5 warum, ursachenanalyse, root cause analyse, 5 why beispiel'
    },
    example: {
      title: 'Beispiel: Bestellbestätigungen kommen nicht an',
      intro:
        'Der Support hat seit drei Tagen dieselbe Beschwerde. Der erste Reflex ist «wir wechseln den E-Mail-Anbieter». Fünfmal warum zu fragen zeigt, dass das Problem ganz woanders liegt.',
      blocks: [
        {
          heading: 'Problem',
          items: [
            'Kunden erhalten die Bestellbestätigung nicht.',
          ]
        },
        {
          heading: 'Die Kette',
          items: [
            'Warum? Die Mails landen im Spam.',
            'Warum? Unsere Absenderdomain gilt als nicht verifiziert.',
            'Warum? Ein Verifizierungseintrag fehlt im DNS.',
            'Warum? Er wurde beim Serverumzug nicht mitkopiert.',
            'Warum? In der Umzugs-Checkliste steht diese Zeile nicht.',
          ]
        },
        {
          heading: 'Grundursache',
          items: [
            'Die Checkliste für den Serverumzug ist unvollständig.',
          ]
        },
        {
          heading: 'Maßnahmen',
          items: [
            'Fehlender Eintrag ergänzt (das heutige Problem ist gelöst).',
            'Domainverifizierung in die Umzugs-Checkliste aufgenommen.',
            'Die Checkliste hängt nicht mehr davon ab, wer den Umzug macht.',
          ]
        },
      ],
      outcome:
        'Der erste Reflex war ein Anbieterwechsel: Geld ausgegeben, Problem bleibt. Die wirkliche Ursache war eine fehlende Zeile in einer Checkliste. Diesen Unterschied sichtbar zu machen ist die ganze Arbeit der 5-Why-Methode.'
    },
    faq: [
      {
        q: 'Was ist die 5-Why-Methode?',
        a:
          'Eine Technik, um vom sichtbaren Symptom zur eigentlichen Ursache zu kommen, indem man wiederholt «warum» fragt. Sie stammt von Toyota. Der Sinn ist, das zu reparieren, was das Symptom erzeugt, statt das Symptom selbst — damit das Problem nicht wiederkommt.'
      },
      {
        q: 'Warum genau fünf?',
        a:
          'Fünf ist eine Gewohnheit, keine Regel. In der Praxis landen die meisten Probleme zwischen der vierten und der sechsten Frage. Wenn du es bei der dritten findest, hör auf. Wenn du bei der siebten immer noch nirgends bist, hast du das Problem wahrscheinlich falsch beschrieben.'
      },
      {
        q: 'Woran erkenne ich die Grundursache?',
        a:
          'An zwei Zeichen. Das nächste «warum» zeigt auf etwas außerhalb deines Einflusses, und du bist überzeugt, dass das Beseitigen des Gefundenen die Wiederholung verhindern würde.'
      },
      {
        q: '5 Why oder Ishikawa-Diagramm?',
        a:
          '5 Why folgt einer einzigen Kette nach unten. Das Ishikawa verteilt dasselbe Problem über Kategorien: Mensch, Methode, Maschine, Material, Messung, Mitwelt. Wenn die Ursache an einer Stelle zu sitzen scheint, nimm 5 Why; wenn sie verstreut ist, zeichne zuerst die Gräte.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine 5-Why-Analyse.'
      },
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
      "Bewege den Zeiger über einen Kasten: An allen vier Verbindungspunkten erscheint ein +. Klicke auf einen, wähle eine Form, und der neue Kasten landet fertig verbunden auf dieser Seite. Zum Umbenennen doppelklicke den Kasten, für die übrigen Optionen klicke mit der rechten Maustaste.",
      'Kästchen ziehst du frei an ihren Platz; hier gibt es keine automatische Anordnung, die Aufteilung gehört dir.',
      "Zum Verbinden ziehe von einem beliebigen Punkt eines Kastens zu einem beliebigen Punkt eines anderen: von der Seite zur Seite, von oben nach oben, in jede Richtung. Um ein Ende zu versetzen, fasse die Spitze der Linie und lass sie auf einem anderen Punkt los. Doppelklicke eine Linie, um sie zu beschriften (zum Beispiel ja / nein).",
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
    ],
    seo: {
      name: 'Flussdiagramm',
      title: 'Flussdiagramm erstellen — kostenloses Tool | Klarsti',
      description:
        'Zeichne Prozessschritte, Entscheidungspunkte und Verzweigungen. Mit Erklärung der Symbole und einem Beispiel, kostenlos.',
      keywords: 'flussdiagramm erstellen, flussdiagramm symbole, ablaufdiagramm, prozessdiagramm, flussdiagramm beispiel'
    },
    example: {
      title: 'Beispiel: wie ein Urlaubsantrag bearbeitet wird',
      intro:
        'Jeder im Unternehmen hat eine leicht andere Version dieses Ablaufs im Kopf. Wer genehmigt, wann wird abgelehnt, wann kommt HR ins Spiel — nichts davon steht irgendwo. Aufgezeichnet schrumpft die Diskussion auf ein einziges Kästchen.',
      blocks: [
        {
          heading: 'Schritte',
          items: [
            'Start: Mitarbeitende stellen einen Urlaubsantrag',
            'Prozess: System berechnet die Resttage',
            'Entscheidung: Sind genug Tage übrig?',
            'Nein → Antrag abgelehnt, Begründung wird erfasst',
            'Ja → Prozess: Antrag geht an die Führungskraft',
          ]
        },
        {
          heading: 'Fortsetzung',
          items: [
            'Entscheidung: Genehmigt die Führungskraft?',
            'Nein → Begründung geht zurück, Vorgang endet',
            'Ja → Prozess: HR trägt es in den Kalender ein',
            'Prozess: Teamkalender wird aktualisiert',
            'Ende: Bestätigung geht raus',
          ]
        },
      ],
      outcome:
        'Nach dem Zeichnen fiel eines auf: Es gab überhaupt keinen Schritt, der bei abgelehnten Anträgen eine Begründung zurückgibt. Solange der Ablauf in den Köpfen lebte, merkte das niemand. In Kästchen gebracht, zeigte sich die Lücke von selbst.'
    },
    faq: [
      {
        q: 'Was ist ein Flussdiagramm?',
        a:
          'Ein Diagramm, das zeigt, welche Schritte ein Prozess von Anfang bis Ende durchläuft, wo entschieden wird und wo sich der Weg teilt. Ein Prozess, dessen mündliche Erklärung fünf Minuten dauert, lässt sich gezeichnet meist in fünf Sekunden lesen.'
      },
      {
        q: 'Was bedeuten die Symbole?',
        a:
          'Das abgerundete Kästchen ist Start oder Ende, das Rechteck ein Prozessschritt, die Raute eine Entscheidung. Aus einer Entscheidung führen immer mindestens zwei Pfeile, meist ja und nein. Diese Verzweigung lässt dem Lesenden genau eine Deutung.'
      },
      {
        q: 'Ist ein Flussdiagramm dasselbe wie eine Prozesslandkarte?',
        a:
          'Verwandt, aber nicht dasselbe. Das Flussdiagramm zeigt die Reihenfolge der Schritte. Eine Prozesslandkarte ist meist breiter: sie zeigt auch, wer für welchen Schritt zuständig ist und wo Arbeit von einem Team zum nächsten wandert.'
      },
      {
        q: 'Wo fange ich an zu zeichnen?',
        a:
          'Am Ende. Schreib auf, wie der Prozess ausgeht, und arbeite dich rückwärts mit der Frage «was muss davor passieren». Von vorne anzufangen erzeugt meist den idealen statt den tatsächlichen Prozess.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto, um ein Flussdiagramm zu zeichnen.'
      },
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
      "Bewege den Zeiger über einen Kasten: An allen vier Verbindungspunkten erscheint ein +. Klicke auf einen und wähle Position, Einheit, Team oder unbesetzte Stelle; der neue Kasten landet auf dieser Seite. Doppelklicke einen Kasten, um den Namen und den Titel darunter zu ändern.",
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
    ],
    seo: {
      name: 'Organigramm',
      title: 'Organigramm erstellen — kostenlos | Klarsti',
      description:
        'Zeige auf einer Seite, wer an wen berichtet, und finde unbesetzte Rollen. Mit einem echten Beispiel aus 20 Personen.',
      keywords: 'organigramm erstellen, organigramm kostenlos, organisationsstruktur, firmen organigramm, organigramm vorlage'
    },
    example: {
      title: 'Beispiel: ein Softwareunternehmen mit 20 Personen',
      intro:
        'Das Unternehmen ist in zwei Jahren von 6 auf 20 Personen gewachsen. Wer an wen berichtet, weiß man vom Hörensagen, aber es steht nirgends — also stellt jede neue Person dieselben Fragen.',
      blocks: [
        {
          heading: 'Geschäftsführung',
          items: [
            'Leitung Produkt',
            'Leitung Entwicklung',
            'Leitung Vertrieb',
            'Verantwortung HR und Finanzen',
          ]
        },
        {
          heading: 'Unter Entwicklung',
          items: [
            'Frontend-Team (3)',
            'Backend-Team (4)',
            'Qualitätssicherung',
            'Systemadministration',
          ]
        },
        {
          heading: 'Unter Produkt',
          items: [
            'Design (2)',
            'Produktanalyse',
          ]
        },
        {
          heading: 'Unter Vertrieb',
          items: [
            'Außendienst (2)',
            'Kundensupport (2)',
          ]
        },
      ],
      outcome:
        'Beim Zeichnen fiel eines sofort auf: Die Qualitätssicherung ist eine einzelne Person, die direkt an die Entwicklungsleitung berichtet — im Urlaub vertritt sie niemand. Genau hier verdient ein Organigramm sein Geld: Es zeigt die Lücken mit Namen.'
    },
    faq: [
      {
        q: 'Was ist ein Organigramm?',
        a:
          'Ein Schaubild, wie Personen und Teams einer Organisation zusammenhängen. Es zeigt Berichtslinien und wo jede Einheit sitzt. Für alle, die neu anfangen, ist es die schnellste Landkarte des Hauses.'
      },
      {
        q: 'Namen oder Funktionen?',
        a:
          'Am besten beides: die Funktion erklärt die Struktur, der Name sagt dir, an wen du dich wendest. Nur Namen machen das Organigramm sinnlos, sobald jemand geht; nur Funktionen lassen dich ratlos, wen du fragen sollst.'
      },
      {
        q: 'Wie viele Personen passen auf ein Organigramm?',
        a:
          'Bis etwa fünfzig bleibt es auf einer Seite lesbar. Darüber zeigt man die obere Ebene getrennt und gibt jeder Einheit ein eigenes Schaubild. Eine große Organisation auf eine Seite zu quetschen ergibt ein Organigramm, das niemand liest.'
      },
      {
        q: 'Wie oft muss es aktualisiert werden?',
        a:
          'Bei jeder Einstellung und jedem Austritt. Ein veraltetes Organigramm ist schlimmer als gar keines, weil es Leute mit voller Überzeugung zur falschen Person schickt.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für ein Organigramm.'
      },
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
    ],
    seo: {
      name: 'SWOT-Analyse',
      title: 'SWOT-Analyse erstellen — kostenlose Vorlage | Klarsti',
      description:
        'Stelle Stärken und Schwächen den Chancen und Risiken gegenüber und lies die vier Felder zusammen. Mit ausgefülltem Beispiel.',
      keywords: 'swot analyse, swot analyse erstellen, swot analyse beispiel, stärken schwächen analyse, swot vorlage'
    },
    example: {
      title: 'Beispiel: eine kleine Steuerkanzlei',
      intro:
        'Eine Kanzlei mit fünf Personen will wachsen, weiß aber nicht, wohin sie drücken soll. Die vier Felder auszufüllen holt das Gespräch aus dem Bauchgefühl und stellt es auf konkrete Zeilen.',
      blocks: [
        {
          heading: 'Stärken',
          items: [
            'Mandate seit fünfzehn Jahren',
            'So gut wie keine Abwanderung',
            'Beide Partner sind Steuerberater',
            'Keine Schulden',
          ]
        },
        {
          heading: 'Schwächen',
          items: [
            'Alles hängt an den beiden Partnern',
            'Kein digitaler Ablauf, alles auf Papier',
            'Kein Marketing',
            'Neue Mandate kommen nur über Empfehlung',
          ]
        },
        {
          heading: 'Chancen',
          items: [
            'Die E-Rechnungspflicht bringt kleine Betriebe zum Suchen',
            'Viele neue kleine Betriebe in der Umgebung',
            'Betreuung aus der Ferne ist inzwischen akzeptiert',
            'Buchhaltungssoftware ist günstig geworden',
          ]
        },
        {
          heading: 'Risiken',
          items: [
            'Billige Online-Buchhaltungsdienste',
            'Ein Partner geht bald in Rente',
            'Das Recht ändert sich häufig',
            'Junge Fachkräfte sind schwer zu finden',
          ]
        },
      ],
      outcome:
        'Die Tabelle sagt etwas Konkretes: Die größte Chance (E-Rechnung) liegt genau auf der größten Schwäche (kein digitaler Ablauf). Die Entscheidung schreibt sich selbst — nicht wachsen, sondern zuerst die eigene Arbeit digitalisieren.'
    },
    faq: [
      {
        q: 'Was ist eine SWOT-Analyse?',
        a:
          'Eine Methode, die die Lage einer Organisation oder einer Entscheidung in vier Feldern sammelt: Stärken, Schwächen, Chancen und Risiken. Stärken und Schwächen sind innen, Chancen und Risiken außen. Diese Trennung gibt der Methode ihren Namen und wird am häufigsten falsch gemacht.'
      },
      {
        q: 'Wie macht man eine SWOT-Analyse?',
        a:
          'Schreib zuerst in einem Satz auf, was du analysierst: «unser Unternehmen» ist zu weit, «sollen wir die zweite Filiale eröffnen» nicht. Dann füllst du die vier Felder. Der letzte Schritt zählt am meisten: die Felder verknüpfen. Welche Stärke greift welche Chance, welche Schwäche macht dich anfällig für welches Risiko.'
      },
      {
        q: 'Wie unterscheide ich Stärke und Chance?',
        a:
          'Ein einfacher Test: Kann deine eigene Entscheidung es ändern, ist es intern; kann sie es nicht, ist es extern. Ein erfahrenes Team ist eine Stärke, ein wachsender Markt eine Chance. Werden die Felder vermischt, ist die Analyse unbrauchbar.'
      },
      {
        q: 'Wie viele Punkte gehören in ein Feld?',
        a:
          'Drei bis sechs funktionieren gut. Fünfzehn Punkte in einem Feld sind eine Bestandsaufnahme, keine Analyse. Die wenigen auszuwählen, die wirklich entscheiden, ist das, was die Schlussfolgerung von selbst aus der Tabelle fallen lässt.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine SWOT-Analyse.'
      },
    ]
  },

  ishikawa: {
    title: 'Fischgrätendiagramm',
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
    ],
    seo: {
      name: 'Ishikawa-Diagramm',
      title: 'Ishikawa-Diagramm erstellen — Fischgrätendiagramm | Klarsti',
      description:
        'Sortiere mögliche Ursachen nach Mensch, Methode, Maschine und Material und sieh, wo du anfangen solltest. Mit Beispiel, kostenlos.',
      keywords: 'ishikawa diagramm, fischgrätendiagramm, ursache wirkungs diagramm, 6m methode, ishikawa beispiel'
    },
    example: {
      title: 'Beispiel: die Ausschussquote ist gestiegen',
      intro:
        'In einer Möbeltischlerei stieg der Anteil fehlerhafter Teile in zwei Monaten von 3 % auf 9 %. Statt einer einzigen Ursache nachzujagen, werden alle Kandidaten unter sechs Überschriften nebeneinandergelegt.',
      blocks: [
        {
          heading: 'Mensch',
          items: [
            'Zwei erfahrene Tischler haben gekündigt',
            'Die Neuen wurden nicht eingearbeitet',
            'Keine Übergabe zwischen den Schichten',
          ]
        },
        {
          heading: 'Methode',
          items: [
            'Zuschnittmaße sind nicht schriftlich festgehalten',
            'Qualität wird nur am Ende der Linie geprüft',
          ]
        },
        {
          heading: 'Maschine',
          items: [
            'Die Säge ist seit sechs Monaten ohne Wartung',
            'Die Schleifmaschine verstellt sich',
          ]
        },
        {
          heading: 'Material',
          items: [
            'Der Lieferant hat gewechselt',
            'Die Feuchtigkeit der neuen Platten wird nicht gemessen',
          ]
        },
      ],
      outcome:
        'Mit gefüllten Gräten sind zwei Überschriften sichtbar voller als die übrigen: Mensch und Material. Dort fängt das Team an. Die Gräte findet die Ursache nicht — sie sagt dir, wo du zu suchen anfängst.'
    },
    faq: [
      {
        q: 'Was ist ein Ishikawa-Diagramm?',
        a:
          'Ein Diagramm, das mögliche Ursachen eines Problems in Kategorien sortiert und nebeneinanderstellt. Wegen der Form heißt es auch Fischgrätendiagramm, außerdem Ursache-Wirkungs-Diagramm.'
      },
      {
        q: 'Was sind die 6M?',
        a:
          'Die sechs klassischen Kategorien: Mensch, Methode, Maschine, Material, Messung und Mitwelt. Ziel ist nicht, alle zu füllen, sondern den Blick in sechs Richtungen zu zwingen statt in die eine, die man ohnehin schon im Kopf hatte. In Dienstleistungen dürfen und sollen diese Überschriften geändert werden.'
      },
      {
        q: 'Lässt sich das mit 5 Why kombinieren?',
        a:
          'Ja, und das ist die wirksamste Art, beides zu nutzen. Verteile die Kandidaten mit der Gräte, wähle den stärksten Ast und geh mit 5 Why darin in die Tiefe. Das eine gibt Breite, das andere Tiefe.'
      },
      {
        q: 'Findet die Gräte die Ursache?',
        a:
          'Nicht direkt — sie liefert Kandidaten. Wenn das Diagramm fertig ist, hast du eine Liste zum Prüfen, keine bewiesene Ursache. Der nächste Schritt ist der Abgleich mit Daten, und dort passt die Pareto-Analyse gut.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für ein Ishikawa-Diagramm.'
      },
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
    ],
    seo: {
      name: 'PDCA-Zyklus',
      title: 'PDCA-Zyklus — kontinuierliche Verbesserung | Klarsti',
      description:
        'Plan, Do, Check, Act: kleine Versuche durchführen und das Ergebnis messen. Mit einem vollständigen Zyklus als Beispiel.',
      keywords: 'pdca zyklus, demingkreis, kontinuierliche verbesserung, kvp, pdca beispiel'
    },
    example: {
      title: 'Beispiel: die Erstreaktionszeit im Support senken',
      intro:
        'Das Support-Team antwortet im Schnitt nach 14 Stunden. Das Ziel sind 4. Bevor jemand eingestellt wird, läuft ein einziger Zyklus.',
      blocks: [
        {
          heading: 'Plan',
          items: [
            'Ziel: durchschnittliche Erstreaktion unter 4 Stunden',
            'Annahme: Tickets stauen sich morgens und niemand übernimmt sie',
            'Versuch: eine Person hat von 09:00 bis 11:00 Dienst',
            'Dauer: zwei Wochen',
          ]
        },
        {
          heading: 'Do',
          items: [
            'Dienstplan im Team geteilt',
            'Wer Dienst hat, bekommt in diesen zwei Stunden keine andere Arbeit',
            'Erstreaktionszeit für jedes Ticket erfasst',
          ]
        },
        {
          heading: 'Check',
          items: [
            'Der Durchschnitt fiel von 14 auf 5 Stunden',
            'Morgens eingehende Tickets fielen auf 2 Stunden',
            'Abends eingehende Tickets änderten sich nicht',
            'Wer Dienst hatte, kam mit der eigenen Arbeit in Verzug',
          ]
        },
        {
          heading: 'Act',
          items: [
            'Der Morgendienst wird dauerhaft',
            'Arbeitslast an Diensttagen reduziert',
            'Neuer Zyklus für die Abendstunden eröffnet',
          ]
        },
      ],
      outcome:
        'Ein einziger Zyklus drittelte die Zeit und lieferte die nächste Frage gleich mit: die Abendtickets. So soll PDCA laufen — jeder Zyklus übergibt das Thema des nächsten.'
    },
    faq: [
      {
        q: 'Was ist der PDCA-Zyklus?',
        a:
          'Eine Schleife aus vier Schritten für kontinuierliche Verbesserung: Plan, Do, Check, Act. Auch als Demingkreis bekannt. Der Gedanke ist, statt einer großen Veränderung kleine Versuche zu machen, deren Ergebnis man tatsächlich misst.'
      },
      {
        q: 'Wie lang sollte ein Zyklus sein?',
        a:
          'So kurz, wie du das Ergebnis noch messen kannst. Ein bis vier Wochen passen für die meiste Büroarbeit. Ein Halbjahreszyklus ist kein Zyklus: Bis du hinschaust, haben sich die Bedingungen verändert, und du weißt nicht, was was verursacht hat.'
      },
      {
        q: 'Was wird im Check gemessen?',
        a:
          'Das, was du im Plan aufgeschrieben hast. Deshalb muss das Ziel eine Zahl sein: «schneller antworten» lässt sich nicht prüfen, «durchschnittliche Erstreaktion unter 4 Stunden» schon. Ohne vorher notierte Zahl wird aus Check eine Meinung.'
      },
      {
        q: 'Was, wenn der Versuch scheitert?',
        a:
          'Ein gescheiterter Zyklus ist auch ein Ergebnis und wird nicht weggeworfen. Im Act-Schritt schreibst du auf, warum die Annahme nicht trug, und der nächste Zyklus startet damit. Die einzige echte Verschwendung bei PDCA ist, etwas Neues zu versuchen, ohne festzuhalten, was passiert ist.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für einen PDCA-Zyklus.'
      },
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
    ],
    seo: {
      name: 'Wasserfallmodell',
      title: 'Wasserfallmodell im Projektmanagement | Klarsti',
      description:
        'Anforderung, Design, Umsetzung, Test und Übergabe der Reihe nach. Mit Beispiel und dem Unterschied zu agilen Methoden.',
      keywords: 'wasserfallmodell, wasserfallmodell phasen, wasserfall vs agil, projektmanagement methoden, wasserfallmodell beispiel'
    },
    example: {
      title: 'Beispiel: ein Berichtsmodul an eine Bank liefern',
      intro:
        'Umfang vertraglich festgelegt, Liefertermin fest, schriftliche Abnahme des Kunden am Ende jeder Phase. Solche Arbeit läuft der Reihe nach durch die Phasen.',
      blocks: [
        {
          heading: 'Anforderungen',
          items: [
            'Berichtstypen aufgelistet',
            'Berechtigungsregeln festgehalten',
            'Abnahme des Kunden',
          ]
        },
        {
          heading: 'Entwurf',
          items: [
            'Datenmodell',
            'Bildschirmentwürfe',
            'Leistungsgrenzen vereinbart',
          ]
        },
        {
          heading: 'Umsetzung',
          items: [
            'Berichtsmodul',
            'Berechtigungen',
            'Export',
          ]
        },
        {
          heading: 'Test und Übergabe',
          items: [
            'Interne Tests',
            'Abnahmetest des Kunden',
            'Produktivsetzung',
            'Anwenderschulung',
          ]
        },
      ],
      outcome:
        'Stärke und Schwäche des Wasserfalls sind hier gleichzeitig sichtbar: Weil der Umfang von Anfang an feststeht, ist der Fortschritt leicht zu messen — aber eine Anforderung, die sich während der Umsetzung ändert, wirft den ganzen Plan zurück.'
    },
    faq: [
      {
        q: 'Was ist das Wasserfallmodell?',
        a:
          'Eine Methode, die ein Projekt in aufeinanderfolgende Phasen teilt und keine beginnt, bevor die vorige abgeschlossen ist: Anforderungen, Entwurf, Umsetzung, Test, Übergabe. Der Name kommt vom Wasser, das eine Treppe hinunterfällt.'
      },
      {
        q: 'Wasserfall oder agil?',
        a:
          'Wenn der Umfang von Anfang an bekannt ist und sich kaum bewegen wird, bringt der Wasserfall weniger Verwaltungsaufwand: Bau, regulatorische Arbeit und Festpreislieferungen passen. Wenn sich der Umfang erst unterwegs klärt, wird Wasserfall teuer und agile Methoden passen besser.'
      },
      {
        q: 'Kann man in eine frühere Phase zurück?',
        a:
          'Man kann, aber es kostet, und das Modell ist nicht dafür gebaut. Wenn du oft zurückgehst, war der Umfang von Anfang an nicht klar genug — und dann lautet die eigentliche Frage, ob Wasserfall die richtige Wahl war.'
      },
      {
        q: 'Was passiert zwischen den Phasen?',
        a:
          'Jede Phase endet mit einem Ergebnis und einer Abnahme, und die Abnahme sollte schriftlich sein. Die ganze Sicherheit, die der Wasserfall bietet, beruht darauf, dass beide Seiten im selben Moment zustimmen, dass eine Phase geschlossen ist.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für ein Wasserfallprojekt.'
      },
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
    ],
    seo: {
      name: 'Fehlerbaumanalyse (FTA)',
      title: 'Fehlerbaumanalyse (FTA) erstellen | Klarsti',
      description:
        'Setze das unerwünschte Ereignis nach oben und löse mit UND/ODER-Gattern auf, welche Ausfälle zusammentreffen müssen. Kostenlos.',
      keywords: 'fehlerbaumanalyse, fta analyse, fehlerbaum erstellen, und oder gatter, fehlerbaumanalyse beispiel'
    },
    example: {
      title: 'Beispiel: das Kühlhaus überschritt die Temperaturgrenze',
      intro:
        'In einem Lebensmittellager lag die Temperatur zwei Stunden über der Grenze und die Ware musste vernichtet werden. Das unerwünschte Ereignis steht oben, und der Baum arbeitet sich über Logikgatter nach unten, welche Ausfälle zusammentreffen mussten.',
      blocks: [
        {
          heading: 'Top-Ereignis',
          items: [
            'Kühlhaus zwei Stunden über der Temperaturgrenze',
          ]
        },
        {
          heading: 'ODER-Gatter — eines genügt',
          items: [
            'Die Kühlung fiel aus',
            'Wärme kam herein',
            'Der Alarm ging nicht los und niemand merkte es',
          ]
        },
        {
          heading: 'Unter «Kühlung fiel aus» (ODER)',
          items: [
            'Kompressorausfall',
            'Stromausfall',
            'Thermostat falsch eingestellt',
          ]
        },
        {
          heading: 'Unter «Alarm ging nicht los» (UND)',
          items: [
            'Sensor defekt',
            'Ersatzsensor nie eingebaut',
            'Fernmeldungen abgeschaltet',
          ]
        },
      ],
      outcome:
        'Der Baum zeigt: Ein Kühlungsausfall allein reicht nicht, auch der Alarm musste versagen. Die billigste Maßnahme ist also kein neuer Kompressor, sondern der Einbau des Ersatzsensors. Genau hier lenkt die Fehlerbaumanalyse das Geld an die richtige Stelle.'
    },
    faq: [
      {
        q: 'Was ist die Fehlerbaumanalyse (FTA)?',
        a:
          'Eine Methode, die ein unerwünschtes Ereignis an die Spitze setzt und sich über Logikgatter nach unten arbeitet, um zu zeigen, welche Kombinationen von Ausfällen es erzeugen würden. Sie stammt aus Luftfahrt und Kerntechnik und wird heute allgemein in Sicherheits- und Prozessanalysen eingesetzt.'
      },
      {
        q: 'Was ist der Unterschied zwischen UND- und ODER-Gatter?',
        a:
          'Unter einem ODER-Gatter genügt eines der darunterliegenden Ereignisse. Unter einem UND-Gatter müssen alle gleichzeitig eintreten. Diese Unterscheidung ist das Herz der Methode: UND-Gatter zeigen, wo sich das System selbst schützt.'
      },
      {
        q: 'Fehlerbaum oder 5 Why?',
        a:
          '5 Why verfolgt eine einzelne Kette rückwärts von etwas, das bereits passiert ist. Der Fehlerbaum kartiert alle Wege zu einem Ereignis, das noch nicht passiert ist. Das eine schaut zurück, das andere nach vorn.'
      },
      {
        q: 'Wie tief muss der Baum gehen?',
        a:
          'Bis zu Ereignissen, die du nicht weiter zerlegen kannst und gegen die du direkt handeln kannst. «Sensor defekt» ist tief genug, weil man dagegen eine Maßnahme schreiben kann. «Das System funktioniert nicht» ist es nicht.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine Fehlerbaumanalyse.'
      },
    ]
  },

  vsm: {
    title: 'Wertstromanalyse',
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
    ],
    seo: {
      name: 'Wertstromanalyse (VSM)',
      title: 'Wertstromanalyse (VSM) erstellen | Klarsti',
      description:
        'Stelle Bearbeitungszeit und Wartezeit je Schritt gegenüber und sieh, wo die Zeit verloren geht. Mit Zahlenbeispiel, kostenlos.',
      keywords: 'wertstromanalyse, value stream mapping, wertstromdesign, lean management, wertstromanalyse beispiel'
    },
    example: {
      title: 'Beispiel: vom Auftragseingang bis zum Warenversand',
      intro:
        'Ein Hersteller misst die Zeit zwischen Auftragseingang und dem Moment, in dem die Ware auf den Lkw geht. Die tatsächliche Bearbeitungszeit jedes Schritts wird getrennt von der Wartezeit dazwischen notiert. Der Unterschied dreht das Bild um.',
      blocks: [
        {
          heading: 'Schritte und Bearbeitungszeit',
          items: [
            'Auftragserfassung — 10 Minuten',
            'Bonitätsprüfung — 15 Minuten',
            'Aufnahme in den Produktionsplan — 30 Minuten',
            'Produktion — 4 Stunden',
            'Qualitätsprüfung — 20 Minuten',
            'Verpacken und Versand — 40 Minuten',
          ]
        },
        {
          heading: 'Wartezeit zwischen den Schritten',
          items: [
            'Nach der Erfassung — 1 Tag',
            'Nach der Bonitätsprüfung — 2 Tage',
            'Nach der Planaufnahme — 3 Tage',
            'Nach der Produktion — 1 Tag',
            'Nach der Qualitätsprüfung — 2 Tage',
          ]
        },
      ],
      outcome:
        'Die Bearbeitungszeit summiert sich auf rund 6 Stunden, die Gesamtdurchlaufzeit auf 9 Tage. Also sind 99 % der Zeit Warten. Die längste Wartezeit sind die drei Tage nach der Planaufnahme. Die Antwort ist eindeutig: Die Produktion zu beschleunigen bringt nichts, das Problem ist die Warteschlange.'
    },
    faq: [
      {
        q: 'Was ist eine Wertstromanalyse (VSM)?',
        a:
          'Eine Karte aller Schritte, die ein Produkt oder eine Anfrage durchläuft, mit der Dauer jedes Schritts und der Wartezeit dazwischen. Sie stammt aus der schlanken Produktion. Ihr Zweck ist nicht schneller zu werden, sondern zu zeigen, wo die Zeit tatsächlich hingeht.'
      },
      {
        q: 'Was ist wertschöpfend und was nicht?',
        a:
          'Alles, wofür der Kunde bereitwillig zahlen würde, schöpft Wert: die Schritte, die das Produkt wirklich verändern. Warten, Transportieren und wiederholtes Prüfen nicht. In den meisten Prozessen sind über 90 % der Gesamtzeit nicht wertschöpfend.'
      },
      {
        q: 'Was ist der Unterschied zum Flussdiagramm?',
        a:
          'Das Flussdiagramm zeigt die Reihenfolge der Schritte und die Entscheidungspunkte, ohne Dauer. In der Wertstromanalyse ist die Dauer alles: Bearbeitungs- und Wartezeit werden je Schritt getrennt notiert und dann verglichen.'
      },
      {
        q: 'Wo fange ich an?',
        a:
          'Beim Ist-Zustand, genau so, wie er ist. Der häufigste Fehler ist, den Prozess so zu zeichnen, wie er funktionieren soll. Zeigt die Karte nicht die Wirklichkeit, verbessert man einen Prozess, den es nicht gibt. Die echten Zeiten müssen vor Ort gemessen werden.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine Wertstromanalyse.'
      },
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
    ],
    seo: {
      name: 'Pareto-Analyse',
      title: 'Pareto-Analyse und 80/20-Diagramm | Klarsti',
      description:
        'Sortiere Ursachen nach Häufigkeit und finde die wenigen, die den Großteil des Problems ausmachen. Mit Beispiel, kostenlos.',
      keywords: 'pareto analyse, pareto diagramm, 80 20 regel, pareto prinzip, pareto analyse beispiel'
    },
    example: {
      title: 'Beispiel: woher die Kundenbeschwerden kommen',
      intro:
        'Ein Onlineshop erhielt in drei Monaten 480 Beschwerden. Das Team hatte für jeden Beschwerdetyp eine eigene Lösung diskutiert. Zählen und absteigend sortieren verändert das Gespräch.',
      blocks: [
        {
          heading: 'Beschwerdeart und Anzahl',
          items: [
            'Lieferung zu spät — 196',
            'Artikel wich von der Beschreibung ab — 121',
            'Rücksendung zu langsam — 62',
            'Artikel beschädigt — 48',
            'Falscher Artikel — 29',
            'Sonstiges — 24',
          ]
        },
        {
          heading: 'Kumulierter Anteil',
          items: [
            'Verspätete Lieferung — 41 %',
            '+ Beschreibung — 66 %',
            '+ Rücksendungen — 79 %',
            '+ Beschädigungen — 89 %',
            'Die drei restlichen — 100 %',
          ]
        },
      ],
      outcome:
        'Die ersten beiden machen zwei Drittel von allem aus. Statt sechs Probleme gleichzeitig zu jagen, beseitigt das Beheben von Lieferzeiten und Produktbeschreibungen 66 % der Unzufriedenheit. Diese Reihenfolge sichtbar zu machen ist die ganze Aufgabe der Pareto-Analyse.'
    },
    faq: [
      {
        q: 'Was ist eine Pareto-Analyse?',
        a:
          'Eine Methode, die Probleme nach Häufigkeit absteigend sortiert und zeigt, welche wenigen den größten Teil der Summe ausmachen. Sie beruht auf einer einfachen Beobachtung: Etwa 80 % der Wirkungen kommen von etwa 20 % der Ursachen.'
      },
      {
        q: 'Gilt die 80/20-Regel immer?',
        a:
          'Nicht exakt, und das muss sie auch nicht. Manchmal kommt 70/30 heraus, manchmal 90/10. Wichtig ist nicht das Verhältnis, sondern dass die Verteilung ungleich ist: Wenn wenige Positionen den Großteil tragen, hilft die Pareto-Analyse.'
      },
      {
        q: 'Nach Anzahl oder nach Kosten sortieren?',
        a:
          'Nach dem, wovon deine Entscheidung abhängt. Die Anzahl zeigt, welches Problem am häufigsten auftritt, die Kosten zeigen, welches am meisten wehtut. Oft widersprechen sie sich: Ein seltenes, aber teures Problem steht in einer Anzahlliste ganz unten.'
      },
      {
        q: 'Wie viele Kategorien sollte eine Pareto-Analyse haben?',
        a:
          'Fünf bis zehn lesen sich am besten. Eine Analyse mit dreißig Kategorien ist immer noch eine Liste und gibt keinen Fokus. Wenige, wirklich verschiedene Kategorien zu wählen ist die halbe Arbeit.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine Pareto-Analyse.'
      },
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
    ],
    seo: {
      name: 'Histogramm',
      title: 'Histogramm erstellen — Verteilung sichtbar machen | Klarsti',
      description:
        'Teile Messwerte in Klassen und sieh, was der Mittelwert verbirgt. Erklärt, was zwei Gipfel bedeuten. Kostenlos.',
      keywords: 'histogramm erstellen, histogramm, häufigkeitsverteilung, histogramm beispiel, verteilung darstellen'
    },
    example: {
      title: 'Beispiel: Lieferzeiten',
      intro:
        'Die durchschnittliche Lieferzeit wird mit 3 Tagen berichtet und sieht ordentlich aus. Trotzdem kommen weiter Beschwerden. Die einzelnen Zeiten zu gruppieren zeigt, was der Durchschnitt verdeckt hat.',
      blocks: [
        {
          heading: 'Verteilung der Lieferzeit (500 Bestellungen)',
          items: [
            '1 Tag — 140 Bestellungen',
            '2 Tage — 165 Bestellungen',
            '3 Tage — 95 Bestellungen',
            '4 Tage — 30 Bestellungen',
            '5 Tage — 12 Bestellungen',
            '6 Tage und mehr — 58 Bestellungen',
          ]
        },
        {
          heading: 'Wie man es liest',
          items: [
            '60 % kommen innerhalb von zwei Tagen an',
            'Eine kleine, aber deutliche Gruppe liegt bei sechs Tagen und mehr',
            'Die Form hat zwei Gipfel, nicht einen',
            'Drei Tage — der Durchschnitt — ist einer der seltensten Werte',
          ]
        },
      ],
      outcome:
        'Der Durchschnitt sagt drei Tage, tatsächlich gibt es aber zwei verschiedene Kundenerfahrungen: Die meisten bekommen die Ware in zwei Tagen, ein Teil wartet eine Woche. Eine zweigipflige Verteilung bedeutet immer dasselbe: Das ist nicht ein Prozess, das sind zwei. Die nächste Frage lautet, aus welcher Region oder welchem Lager diese 58 Bestellungen kamen.'
    },
    faq: [
      {
        q: 'Was ist ein Histogramm?',
        a:
          'Ein Diagramm, das Messwerte in Klassen einteilt und zeigt, wie viele in jede fallen. Es macht sichtbar, was der Durchschnitt verbirgt: wie sich die Werte verteilen.'
      },
      {
        q: 'Was ist der Unterschied zum Balkendiagramm?',
        a:
          'Ein Balkendiagramm zeigt Kategorien, deren Reihenfolge man ändern kann — Städte, Produkte. Ein Histogramm hat eine numerische Achse, die Reihenfolge liegt fest und die Balken berühren sich. Welches du brauchst, entscheidet die Art der Daten.'
      },
      {
        q: 'Wie viele Klassen soll ich nehmen?',
        a:
          'Ein üblicher Startpunkt ist ungefähr die Wurzel aus der Anzahl der Messwerte — etwa zehn bei 100 Werten. Zu wenige Klassen löschen die Form, zu viele machen aus Rauschen scheinbare Struktur. Probiere ein paar Werte und behalte den, bei dem die Form stabil bleibt.'
      },
      {
        q: 'Was bedeutet ein Histogramm mit zwei Gipfeln?',
        a:
          'Fast immer, dass die Daten nicht aus einem einzigen Prozess stammen — zwei Schichten, zwei Maschinen, zwei Regionen. Wenn du diese Form siehst, teilst du die Daten zuerst auf und schaust dir jeden Teil einzeln an.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für ein Histogramm.'
      },
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
    ],
    seo: {
      name: 'Entscheidungsmatrix',
      title: 'Entscheidungsmatrix — gewichtete Bewertung | Klarsti',
      description:
        'Bewerte Optionen nach gewichteten Kriterien und mache sichtbar, worauf die Entscheidung wirklich beruht. Mit Beispiel, kostenlos.',
      keywords: 'entscheidungsmatrix, nutzwertanalyse, entscheidungsmatrix beispiel, gewichtete bewertung, entscheidungshilfe'
    },
    example: {
      title: 'Beispiel: welche Lagerhalle sollen wir mieten?',
      intro:
        'Drei Kandidaten, und jeder hat einen anderen Favoriten. Die Diskussion läuft über «ich finde». Kriterien zu gewichten und jede Option auf einer Zehnerskala zu bewerten bringt sie auf Zahlen.',
      blocks: [
        {
          heading: 'Kriterien und Gewicht',
          items: [
            'Monatliche Kosten — Gewicht 5',
            'Nähe zu den Kunden — Gewicht 4',
            'Platz zum Wachsen — Gewicht 3',
            'Anbindung an Straße und Hafen — Gewicht 3',
            'Aufwand des Umzugs — Gewicht 1',
          ]
        },
        {
          heading: 'Bewertungen (1-10)',
          items: [
            'Halle A: 8 / 4 / 6 / 5 / 7',
            'Halle B: 5 / 9 / 4 / 8 / 5',
            'Halle C: 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Gewichtete Summe',
          items: [
            'Halle A — 100',
            'Halle B — 114',
            'Halle C — 114',
          ]
        },
      ],
      outcome:
        'A ist raus. B und C liegen gleichauf, die Matrix hat also nicht entschieden — aber sie hat die Diskussion von fünf Kriterien auf eines verkleinert. Übrig bleibt nur die Frage, ob Nähe mehr wiegt als Platz zum Wachsen. Das ist meist der eigentliche Nutzen einer Entscheidungsmatrix: Sie wählt nicht, sie engt ein.'
    },
    faq: [
      {
        q: 'Was ist eine Entscheidungsmatrix?',
        a:
          'Eine Tabelle, die mehrere Optionen nach denselben Kriterien bewertet und jede Bewertung mit der Wichtigkeit dieses Kriteriums multipliziert. Ihr Zweck ist nicht, die Entscheidung zu automatisieren, sondern die Annahmen dahinter sichtbar zu machen.'
      },
      {
        q: 'Wie lege ich die Gewichte fest?',
        a:
          'Vor dem Bewerten und ohne auf die Optionen zu schauen. Andersherum schrauben Menschen unbemerkt so lange an den Gewichten, bis ihr Favorit gewinnt. Die Gewichte zuerst aufzuschreiben und festzuzurren ist das Einzige, was die Matrix überhaupt wertvoll macht.'
      },
      {
        q: 'Was, wenn das Ergebnis nicht meine Wunschoption ist?',
        a:
          'Das ist der wertvollste Moment der Matrix. Es gibt zwei Möglichkeiten: Entweder hast du ein Kriterium falsch gewichtet, oder in der Tabelle fehlt ein Kriterium. Beides behebt man, indem man das Fehlende aufschreibt, nicht indem man an den Zahlen dreht.'
      },
      {
        q: 'Wie viele Kriterien sollte ich nehmen?',
        a:
          'Vier bis sieben funktionieren gut. Unter drei hättest du auch aus dem Bauch entscheiden können; über sieben nähern sich die Gewichte an und die Summen kleben bedeutungslos beieinander.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine Entscheidungsmatrix.'
      },
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
    ],
    seo: {
      name: 'Tagesplaner',
      title: 'Tagesplaner mit Tagesrückblick | Klarsti',
      description:
        'Schreib den Tag morgens auf und geh ihn abends durch. Dein Planer bleibt privat und wird beim Teilen eines Projekts nicht mitgeteilt.',
      keywords: 'tagesplaner, tagesrückblick, tagesplanung, to do liste, tagesplaner online'
    },
    example: {
      title: 'Beispiel: ein voller Dienstag',
      intro:
        'Drei Termine, eine Abgabe und alles andere dazwischengequetscht. Fünf Minuten am Morgen, um den Tag aufzuschreiben, ersparen den Abend, an dem man mit sich selbst darüber streitet, was eigentlich erledigt wurde.',
      blocks: [
        {
          heading: 'Heute unbedingt',
          items: [
            'Kundenpräsentation fertigstellen (vor dem Termin um 14:00)',
            'Rechnungsfreigaben verschicken',
            'Zugänge für die neue Kollegin einrichten',
          ]
        },
        {
          heading: 'Schön, wenn es klappt',
          items: [
            'Bericht der letzten Woche lesen',
            'Beim Lieferanten anrufen',
            'Schreibtisch aufräumen',
          ]
        },
        {
          heading: 'Tagesrückblick',
          items: [
            'Präsentation fertig — aber erst um 13:50, zu knapp',
            'Rechnungsfreigaben vergessen — morgen als Erstes',
            'Am Nachmittag zwei Stunden ohne Unterbrechung geschafft',
            'Morgen lege ich die Termine hinter den Mittag',
          ]
        },
      ],
      outcome:
        'Der Wert liegt nicht in der Liste, sondern im Rückblick. Nach einer Woche taucht dieselbe Zeile immer wieder auf: Die Arbeit wird zwischen Termine gequetscht. Das lässt sich nicht beheben, bevor man es bemerkt.'
    },
    faq: [
      {
        q: 'Wofür ist der Tagesplaner da?',
        a:
          'Um den Tag am Anfang aufzuschreiben und am Ende durchzugehen. Er hat zwei Hälften: den Plan und den Tagesrückblick. Ohne die zweite wird daraus eine To-do-Liste; der Wert liegt darin zu bemerken, dass sich derselbe Fehler wiederholt.'
      },
      {
        q: 'Kann jemand anderes meinen Planer sehen?',
        a:
          'Nein. Planer und Tagesrückblick sind persönlich. Sie liegen nicht in deinen Projekten, sondern in deinem eigenen Datensatz — ein Projekt mit dem Team zu teilen teilt deinen Planer also nicht mit.'
      },
      {
        q: 'Wie viele Punkte sollte ich aufschreiben?',
        a:
          'Höchstens drei in der Muss-Liste. Längere Listen enden jeden Tag unfertig, und irgendwann schaust du gar nicht mehr hin. Alles andere kommt in die zweite Gruppe: schön, wenn es klappt, und der Tag ist kein Misserfolg, wenn nicht.'
      },
      {
        q: 'Was gehört in den Tagesrückblick?',
        a:
          'Nicht, was du getan hast, sondern was dir aufgefallen ist. «Präsentation fertig» trägt keine Information; «die Präsentation wurde knapp, weil der Vormittagstermin überzogen hat» hilft dir nächste Woche.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei.'
      },
    ]
  },
  gantt: {
    title: "Gantt-Diagramm",
    summary: "Ein Planungswerkzeug, das die Arbeit als waagerechte Balken auf einem Kalender zeigt. Was wann beginnt, wie lange dauert und worauf wartet — alles auf einem Bildschirm.",
    whenToUse: [
      "Um Arbeit an Termine zu binden und Startzeitpunkte festzulegen.",
      "Um die Reihenfolge und die voneinander abhängigen Schritte zu zeigen.",
      "Um Verzug früh zu erkennen."
    ],
    steps: [
      "Ein Projekt kann mehrere Diagramme enthalten. Über das Menü oben links legst du eines an oder wechselst.",
      "Mit \"Aufgabe hinzufügen\" entstehen Zeilen. Doppelklick auf den Namen ändert ihn.",
      "Beim Auswählen einer Zeile erscheint unten die Detailleiste: Start, Ende, Fortschritt und Status.",
      "Ziehe einen Balken, um die Termine zu verschieben; zieh an den Enden, um die Dauer zu ändern.",
      "Die Einrücken-Schaltfläche macht eine Zeile zur Teilaufgabe der darüber. Der Balken einer Oberaufgabe wird berechnet.",
      "Über die Abhängigkeit legst du \"beginnt nicht vor\" fest; zwischen den Balken wird ein Pfeil gezeichnet."
    ],
    tips: [
      "Für Marken ohne Dauer wähle Meilenstein: statt eines Balkens erscheint eine Raute.",
      "Die rote Linie zeigt heute. Unfertige Aufgaben mit abgelaufenem Enddatum bekommen einen roten Rahmen.",
      "Tag / Woche / Monat stauchen oder dehnen den Kalender. Die Monatsansicht zeigt lange Pläne komplett."
    ],
    seo: {
      name: 'Gantt-Diagramm',
      title: 'Gantt-Diagramm erstellen — Projektplan | Klarsti',
      description:
        'Lege Aufgaben auf den Kalender und sieh, was gleichzeitig läuft und wo der Puffer fehlt. Mit Achtwochenbeispiel, kostenlos.',
      keywords: 'gantt diagramm erstellen, gantt chart, projektplan, balkendiagramm projekt, gantt diagramm beispiel'
    },
    example: {
      title: 'Beispiel: eine Website neu bauen',
      intro:
        'Die Arbeit muss in acht Wochen passen. Wer wann anfängt und welche Aufgabe auf welche wartet, ist unklar. Die Aufgaben auf einen Kalender zu legen macht die Kollisionen sichtbar.',
      blocks: [
        {
          heading: 'Aufgaben und Wochen',
          items: [
            'Inhaltsinventur — Woche 1',
            'Design — Wochen 2 und 3',
            'Texte — Wochen 2 bis 5',
            'Umsetzung — Wochen 4 bis 7',
            'Inhalte einpflegen — Wochen 6 und 7',
            'Test und Livegang — Woche 8',
          ]
        },
        {
          heading: 'Aufgeworfene Fragen',
          items: [
            'Die Umsetzung startet in Woche 4, das Design endet in Woche 3: kein Puffer',
            'Das Einpflegen wartet auf die Texte, die in Woche 5 enden: knapp',
            'Nur eine Woche für Tests, jeder Fehler verschiebt also den Livegang',
            'Sind Texte und Design dieselbe Person?',
          ]
        },
      ],
      outcome:
        'Was das Diagramm hervorgebracht hat, war kein Plan, sondern die Risiken des Plans. Acht Wochen gehen auf dem Papier auf, aber es gibt nirgends Luft. Ein Gantt-Diagramm ist nicht dazu da, Dauern zu erfinden — es zeigt dir, wo der Puffer fehlt.'
    },
    faq: [
      {
        q: 'Was ist ein Gantt-Diagramm?',
        a:
          'Ein Diagramm, das Aufgaben als waagerechte Balken auf einen Kalender legt. Die Länge des Balkens ist die Dauer, seine Lage der Zeitpunkt. Auf einen Blick sieht man, welche Aufgaben gleichzeitig laufen.'
      },
      {
        q: 'Wie erstellt man ein Gantt-Diagramm?',
        a:
          'Erst die Aufgaben ermitteln, dann in den Kalender legen. Die richtige Reihenfolge ist: Projektstrukturplan bauen, jeden Punkt schätzen, Abhängigkeiten notieren, dann zeichnen. Ein Gantt-Diagramm ohne vorherige Zerlegung lässt eine unvollständige Liste nur ordentlich aussehen.'
      },
      {
        q: 'Was ist eine Abhängigkeit?',
        a:
          'Wenn eine Aufgabe nicht starten kann, bevor eine andere fertig ist, besteht zwischen ihnen eine Abhängigkeit. Im Gantt-Diagramm bilden sie Ketten, und die längste Kette bestimmt die tatsächliche Projektdauer: Jede Verzögerung dort verschiebt den Liefertermin direkt.'
      },
      {
        q: 'Was ist der Unterschied zu einer Roadmap?',
        a:
          'Ein Gantt-Diagramm bindet Aufgaben an Tage und Wochen und ist für das umsetzende Team. Eine Roadmap ist gröber — Quartale oder Monate — und vermittelt Absicht; sie geht meist an Leitung oder Kunden, nicht an das Team.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für ein Gantt-Diagramm.'
      },
    ]
  },

  roadmap: {
    title: "Roadmap",
    summary: "Eine Karte, die ein Thema in aufeinanderfolgende Schritte zerlegt, an denen die Unterthemen hängen. Du schiebst keine Kästchen; die Karte ordnet sich nach jeder Änderung selbst. Anders als der Projektstrukturplan verfolgt sie den Fortschritt: jedes Kästchen hat einen Status, und die Leiste oben zeigt, wie viel schon geschafft ist.",
    whenToUse: [
      "Um ein Thema in Lernreihenfolge zu bringen und zu sehen, wo du stehst.",
      "Um die ersten Monate neuer Mitarbeitender Schritt für Schritt zu planen.",
      "Um auf einem Bildschirm zu zeigen, welche Phasen eine Arbeit durchläuft.",
      "Um ein Schulungsprogramm in Themen zu zerlegen und Material daran zu hängen."
    ],
    steps: [
      "Ein Ordner kann mehrere Roadmaps enthalten. Über das Menü oben links legst du eine neue an und wechselst zwischen ihnen.",
      "Die Hauptlinie läuft von Anfang bis Ende. Wähle einen Schritt und drücke Enter, um dahinter einen neuen einzufügen.",
      "Bei ausgewähltem Schritt hängt Tab ein Thema daran. Auf einem Thema erzeugt Tab ein Unterthema, Enter ein gleichrangiges.",
      "Der Kreis am Anfang eines Kästchens ändert den Status: Nicht begonnen → In Arbeit → Erledigt → Übersprungen. Die Farbe ändert sich mit.",
      "Rechtsklick auf ein Kästchen und „Details\" öffnet die Seitenleiste: Notiz, Zeitschätzung und Links stehen dort.",
      "Um eine lange Roadmap zu gliedern, füge über das Rechtsklickmenü einen Abschnittstitel ein (etwa Grundlagen / Mittel / Fortgeschritten).",
      "Ein optionales Thema wird gestrichelt angebunden und zählt nicht zum Fortschritt.",
      "Die Drehtaste in der Fortschrittsleiste kippt die Linie von senkrecht auf waagerecht; so bleibt eine lange Karte auf breiten Bildschirmen lesbar."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "Neuer Schritt auf der Linie" },
      { keys: ["Tab"], desc: "Thema unter dem gewählten Kästchen" },
      { keys: ["F2"], desc: "Gewähltes Kästchen umbenennen" },
      { keys: ["Delete"], desc: "Gewähltes Kästchen löschen" },
      { keys: ["Shift", "Enter"], desc: "Neue Zeile beim Schreiben" },
      { keys: ["Esc"], desc: "Textfeld schließen" },
      { keys: ["Mod", "Z"], desc: "Rückgängig" },
      { keys: ["Mod", "Y"], desc: "Wiederherstellen" }
    ],
    tips: [
      "Kästchen werden nicht verschoben, das Layout ist automatisch. Die Reihenfolge änderst du über die Verschiebebefehle im Rechtsklickmenü.",
      "Die Themen wechseln von Schritt zu Schritt die Seite, damit die Karte nicht einseitig anwächst.",
      "Übersprungene Kästchen zählen als erledigt: ein bewusst ausgelassenes Thema soll den Prozentwert nicht dauerhaft drücken.",
      "Die eingetragenen Stunden werden summiert; die Leiste oben zeigt den Rest der offenen Kästchen.",
      "Ein Link muss mit http oder https beginnen, sonst wird er nicht angenommen."
    ],
    seo: {
      name: 'Roadmap',
      title: 'Roadmap erstellen — Produkt-Roadmap | Klarsti',
      description:
        'Teile die kommende Zeit in Etappen und schreib auch auf, was ihr bewusst nicht macht. Mit Sechsmonatsbeispiel, kostenlos.',
      keywords: 'roadmap erstellen, produkt roadmap, projekt roadmap, roadmap vorlage, roadmap beispiel'
    },
    example: {
      title: 'Beispiel: Sechsmonats-Roadmap für eine App',
      intro:
        'Das Team schwenkt bei jeder neuen Idee um, und die Leitung weiß nicht, was wann kommt. Sechs Monate werden in drei grobe Etappen geteilt. Ziel ist nicht, Termine zu versprechen, sondern die Reihenfolge festzulegen.',
      blocks: [
        {
          heading: 'Etappe 1 — Fundament festigen',
          items: [
            'Startzeit der App halbieren',
            'Abstürzende Bildschirme reparieren',
            'Registrierung vereinfachen',
          ]
        },
        {
          heading: 'Etappe 2 — Menschen halten',
          items: [
            'Benachrichtigungseinstellungen',
            'Offline-Betrieb',
            'Rückmeldung in der App',
          ]
        },
        {
          heading: 'Etappe 3 — Wachsen',
          items: [
            'Freunde einladen',
            'Zweite Sprache',
            'Grundlage für den Bezahlplan',
          ]
        },
        {
          heading: 'Bewusst nicht auf der Liste',
          items: [
            'Tablet-Layout',
            'Desktop-Version',
            'KI-Funktionen',
          ]
        },
      ],
      outcome:
        'Das nützlichste Feld der Roadmap ist das letzte. Aufzuschreiben, was ihr tun werdet, beendet die Diskussion nicht; aufzuschreiben, was ihr in diesem Zeitraum nicht tut, schon.'
    },
    faq: [
      {
        q: 'Was ist eine Produkt-Roadmap?',
        a:
          'Ein Plan auf hoher Flughöhe, der zeigt, wohin ein Produkt oder eine Arbeit im kommenden Zeitraum geht und in welcher Reihenfolge. Sie ist keine Aufgabenliste, sie vermittelt Absicht und Abfolge.'
      },
      {
        q: 'Gehören Termine in eine Roadmap?',
        a:
          'Genaue Termine richten meist Schaden an: Verfehlst du einen, geht die Glaubwürdigkeit der ganzen Roadmap mit. Quartale oder eine Struktur aus «jetzt / als Nächstes / später» halten weit besser. Brauchst du wirklich einen genauen Termin, gehört dieser Punkt in ein Gantt-Diagramm, nicht in eine Roadmap.'
      },
      {
        q: 'Wie oft sollte eine Roadmap aktualisiert werden?',
        a:
          'Einmal im Monat durchzugehen passt für die meisten Teams. Eine Roadmap, die sich wöchentlich ändert, ist keine; eine, die sich nie ändert, hat den Bezug zur Wirklichkeit verloren. Wichtig ist nicht die Änderung, sondern aufzuschreiben, warum sie kam.'
      },
      {
        q: 'Warum brauche ich eine Nicht-Liste?',
        a:
          'Weil fast jede Frage an eine Roadmap die Form «und was ist mit X» hat. Aufzulisten, was du bewusst weggelassen hast, beantwortet sie im Voraus und erspart dem Team, jede Woche dieselbe Diskussion zu führen.'
      },
      {
        q: 'Ist es kostenlos?',
        a:
          'Ja. Klarsti ist derzeit kostenlos und werbefrei, und du brauchst kein Konto für eine Roadmap.'
      },
    ]
  }
};

export default guides;
