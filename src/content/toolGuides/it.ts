import type { ToolGuideBundle } from './types';

// NOT: Bu dosyada metinler cift tirnakli. Italyancada kesme isareti cok
// geciyor ("un'analisi", "dell'albero"); tek tirnakli dizgide her birini
// kacirmak gerekiyordu. Ic tirnak icin de Italyancanin kendi isaretleri
// (« ») kullanildi.

const guides: ToolGuideBundle = {
  mindmap: {
    title: "Mappa mentale",
    summary:
      "Uno strumento di libera associazione in cui le idee si diramano da un unico centro. Non sposti mai i riquadri a mano: la mappa si riordina da sola dopo ogni aggiunta, così resti concentrato sul contenuto invece che sulla disposizione.",
    whenToUse: [
      "Brainstorming, quando vuoi far uscire le idee in fretta e la gerarchia non è ancora chiara.",
      "Scomporre un argomento in sottotitoli per vederne tutta l'ampiezza.",
      "Prendere appunti di una riunione, di una lezione o di un libro senza perdere il filo.",
      "Raccogliere idee grezze prima di passare a una scomposizione del lavoro."
    ],
    steps: [
      "Un progetto può contenere più mappe. Usa il menu delle mappe in alto a sinistra per crearne una nuova o passare da una all'altra.",
      "Seleziona il riquadro centrale e premi F2 per rinominarlo: qui va l'argomento.",
      "Con il riquadro selezionato premi Tab per aprire un nuovo ramo sotto di esso. Il nuovo riquadro si apre già pronto per la scrittura.",
      "Invio crea un ramo allo stesso livello. Funziona anche mentre scrivi: finisci il testo, premi Invio e si apre il riquadro successivo.",
      "Fai clic destro su un riquadro per aggiungere una descrizione, segnare il ramo come completato o comprimerlo quando diventa affollato.",
      "La mini mappa in basso a destra mostra dove ti trovi; trascinala per spostarti nelle mappe grandi."
    ],
    shortcuts: [
      { keys: ["Tab"], desc: "Nuovo ramo sotto il riquadro selezionato" },
      { keys: ["Invio"], desc: "Ramo allo stesso livello" },
      { keys: ["F2"], desc: "Rinomina il riquadro selezionato" },
      { keys: ["Canc"], desc: "Elimina il ramo selezionato (la radice non si elimina)" },
      { keys: ["Shift", "Invio"], desc: "A capo mentre scrivi" },
      { keys: ["Esc"], desc: "Chiudi il campo di testo" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "I riquadri non si trascinano: la disposizione è automatica. Per spostare un ramo altrove, eliminalo e ricrealo nel punto giusto.",
      "I colori dei rami seguono il ramo principale che parte dalla radice, quindi lo stesso colore indica lo stesso titolo di primo livello.",
      "Canc e F2 non funzionano mentre sei dentro un campo di testo; chiudilo prima con Invio o Esc."
    ],
    seo: {
      name: 'Mappa mentale',
      title: 'Creare una mappa mentale — gratis, senza registrazione | Klarsti',
      description:
        'Metti un tema al centro e ramificalo; alla disposizione pensa il programma. Per raccogliere idee in fretta, gratis.',
      keywords: 'mappa mentale, creare mappa mentale, mappa mentale online, mind map gratis, mappa mentale esempio'
    },
    example: {
      title: 'Esempio: impostare un programma di formazione interna',
      intro:
        'Un team HR deve costruire il percorso di inserimento e non sa da dove partire. Prima di decidere qualsiasi cosa, riversa tutto quello che ha in testa su un\'unica mappa.',
      blocks: [
        {
          heading: 'Chi partecipa',
          items: [
            'Nuovi assunti',
            'Responsabili di team',
            'Personale da remoto',
            'Squadra sul campo',
          ]
        },
        {
          heading: 'Cosa insegniamo',
          items: [
            'Conoscenza del prodotto',
            'Sistemi interni',
            'Rapporto con il cliente',
            'Regole di sicurezza',
          ]
        },
        {
          heading: 'Come lo eroghiamo',
          items: [
            'Workshop in presenza',
            'Video registrato',
            'Sessione breve settimanale',
            'Affiancamento a un collega esperto',
          ]
        },
        {
          heading: 'Come lo misuriamo',
          items: [
            'Test breve alla fine',
            'Parere del responsabile dopo tre mesi',
            'Tempo fino al primo compito in autonomia',
            'Tasso di presenza',
          ]
        },
      ],
      outcome:
        'Con i quattro rami sulla mappa la lacuna salta all\'occhio: il ramo della misurazione è molto più magro degli altri. Il team ci torna prima di scrivere una sola slide. La mappa mentale serve proprio a questo: mostrare quale lato è vuoto.'
    },
    faq: [
      {
        q: 'Che cos\'è una mappa mentale?',
        a:
          'Un modo di raccogliere idee mettendo un tema al centro e ramificando verso l\'esterno. La differenza con un elenco è che l\'elenco ti costringe a pensare in ordine, mentre la mappa ti lascia depositare ogni pensiero sul ramo a cui appartiene. Per questo funziona meglio per rimettere in ordine un pensiero confuso.'
      },
      {
        q: 'Che differenza c\'è con una work breakdown structure?',
        a:
          'La mappa mentale raccoglie idee; non ci sono responsabili, date o sequenza. La WBS gestisce lavoro: ogni casella ha stato, scadenza e durata. L\'ordine abituale è prima la mappa, poi la WBS quando l\'ambito si è stabilizzato.'
      },
      {
        q: 'Posso spostare le caselle a mano?',
        a:
          'No, la disposizione è automatica. Per spostare un ramo, cancellalo e ricrealo nel punto giusto. È voluto: il tempo speso ad allineare caselle è tolto al pensare.'
      },
      {
        q: 'Quanti rami dovrebbe avere una mappa mentale?',
        a:
          'Non c\'è un limite, ma oltre sette o otto sullo stesso livello non si legge più. Quando ci arrivi, raggruppa i rami simili sotto uno nuovo e la mappa torna leggibile.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità. Per provare la mappa mentale non serve nemmeno un account.'
      },
    ]
  },

  wbs: {
    title: 'Struttura di scomposizione del lavoro',
    summary:
      'Un albero su tre livelli: in cima il PROGETTO, sotto le FASI e sotto ancora i PACCHETTI DI LAVORO. Ogni riquadro porta stato, data di fine, ore di lavoro e descrizione. A differenza di una mappa mentale, qui gestisci lavoro, non idee.',
    whenToUse: [
      'Per scomporre un progetto finché è chiaro chi fa cosa.',
      'Per fissare il perimetro: ciò che non è nell’albero non è nel progetto.',
      'Per legare il lavoro alle date e seguire l’avanzamento con gli stati.'
    ],
    steps: [
      'Un albero contiene un solo riquadro progetto. Per un secondo progetto apri un nuovo albero dal menu "Alberi" a sinistra.',
      'Il pulsante in basso segue la selezione: sul progetto dice "Aggiungi fase", su una fase o un pacchetto dice "Aggiungi pacchetto di lavoro". Senza selezione aggiunge una fase sotto il progetto.',
      'Lo stesso da tastiera: Ctrl+clic su un riquadro apre quello nuovo sotto.',
      'Un clic normale seleziona soltanto il riquadro. Per aprire o chiudere i rami sottostanti fai DOPPIO clic sul riquadro; la camera si centra anche su di esso. (Il doppio clic sul nome modifica il nome.)',
      'Clic destro su un riquadro: nome, data di fine, orario di inizio e fine, descrizione e stato (Da fare / In corso / Fatto / Fallito).',
      'Nello stesso menu "Aggiungi all’agenda" porta l’elemento nella tua agenda alla data scelta. Avvisa se la data è già passata.',
      'Se segni un elemento come Fallito, il menu propone "analizza la causa radice"; con un clic passa ai 5 Perché come problema.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clic'], desc: 'Sul riquadro progetto: aggiunge una fase' },
      { keys: ['Mod', 'Clic'], desc: 'Su fase o pacchetto: aggiunge un pacchetto di lavoro' },
      { keys: ['Shift', 'Trascina'], desc: 'Sposta un riquadro con tutti i rami sottostanti' },
      { keys: ['Delete'], desc: 'Elimina il riquadro selezionato' },
      { keys: ['Mod', 'Z'], desc: 'Annulla' },
      { keys: ['Mod', 'Y'], desc: 'Ripeti' }
    ],
    tips: [
      'Ciò che sta sotto un pacchetto di lavoro è ancora un pacchetto di lavoro; la scomposizione può scendere quanto serve.',
      'Trascinando senza Shift si muove solo il riquadro preso; quello che sta sotto resta fermo.',
      'Continua a scomporre finché ogni pacchetto può essere chiuso da una sola persona.',
      'Per cancellare una data usa la crocetta accanto al campo nel menu del clic destro; gli orari se ne vanno con lei.'
    ],
    seo: {
      name: 'Work breakdown structure (WBS)',
      title: 'Work breakdown structure (WBS) — strumento gratuito | Klarsti',
      description:
        'Suddividi il progetto in fasi e pacchetti di lavoro, con stato, scadenza e durata per ciascuno. Con esempio compilato, gratis.',
      keywords: 'work breakdown structure, wbs, struttura di scomposizione del lavoro, wbs esempio, scomposizione attività'
    },
    example: {
      title: 'Esempio: aprire una caffetteria',
      intro:
        'Sei mesi all\'apertura. Il lavoro sembra enorme e non c\'è un punto ovvio da cui afferrarlo. Diviso in tre fasi, ogni fase produce pacchetti concreti che una persona può prendersi in carico.',
      blocks: [
        {
          heading: '1. Locale e permessi',
          items: [
            'Confrontare affitti in tre quartieri',
            'Firmare il contratto',
            'Licenza commerciale',
            'Autorizzazione sanitaria',
          ]
        },
        {
          heading: '2. Allestimento',
          items: [
            'Progetto dei lavori',
            'Lavori',
            'Macchina del caffè e macinino',
            'Tavoli, sedie, bancone',
          ]
        },
        {
          heading: '3. Apertura',
          items: [
            'Assumere due barista',
            'Menù e prezzi',
            'Accordi con i fornitori',
            'Annuncio di apertura',
          ]
        },
      ],
      outcome:
        'Dodici pacchetti di lavoro. L\'ambito ora è fissato: quello che non sta in questo albero non sta nel progetto. Emerge anche la sequenza — i lavori non possono iniziare senza la licenza, e questo rende la prima fase quella rischiosa.'
    },
    faq: [
      {
        q: 'Che cos\'è una work breakdown structure (WBS)?',
        a:
          'Un albero che scompone un progetto finché ogni pezzo è abbastanza piccolo da essere affidato a una persona. In cima il progetto, sotto le fasi, sotto ancora i pacchetti di lavoro. Lo scopo non è ridurre il lavoro ma rendere visibile l\'ambito: quello che non è nell\'albero non è nel progetto.'
      },
      {
        q: 'Quanti livelli deve avere?',
        a:
          'Tre bastano quasi sempre: progetto, fase, pacchetto di lavoro. La regola pratica è semplice — se guardando una casella riesci a dire «chi lo fa e quanto ci mette», puoi smettere di scomporre. Se non ci riesci, scendi di un livello.'
      },
      {
        q: 'Che differenza c\'è con un diagramma di Gantt?',
        a:
          'La WBS risponde a «cosa va fatto», il Gantt a «quando». L\'ordine giusto è prima la scomposizione, poi il calendario. Un Gantt disegnato senza scomposizione è un elenco di attività ricordato a metà appoggiato su una linea del tempo.'
      },
      {
        q: 'Quanto deve essere grande un pacchetto di lavoro?',
        a:
          'Una misura comune è quello che una persona porta a termine in una o due settimane. Più grande e non riesci a seguire l\'avanzamento; più piccolo e l\'albero si riempie di rumore.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per costruire una WBS.'
      },
    ]
  },

  "5whys": {
    title: "Analisi dei 5 perché",
    summary:
      "Chiedere «e perché è successo?» più volte di seguito per passare dal sintomo visibile alla causa profonda. Cinque non è una regola ma una misura approssimativa: quando le risposte iniziano a ripetersi, sei arrivato in fondo.",
    whenToUse: [
      "Trovare la vera causa di un guasto invece di curarne il sintomo.",
      "Analisi dopo un incidente, dove conta la causa e non il colpevole.",
      "Mettere per iscritto perché un'attività della WBS è fallita."
    ],
    steps: [
      "Il menu in alto a sinistra passa da un'analisi all'altra nello stesso progetto e permette di aggiungerne, rinominarne o eliminarne una.",
      "Parti da «Aggiungi problema» sulla schermata vuota e descrivi in una frase che cosa è successo. C'è anche un esempio già pronto se prima vuoi vedere lo strumento all'opera.",
      "Ctrl + clic su un riquadro apre sotto di esso un nuovo riquadro «perché». Scrivi lì la risposta, poi ripeti l'operazione su quel riquadro.",
      "Quando non riesci più a scendere, Shift + clic su quel riquadro crea un riquadro di causa profonda. I riquadri di causa profonda non accettano figli: la catena finisce lì.",
      "Clic destro sui riquadri per modificarli o eliminarli.",
      "Ctrl + clic su spazio vuoto avvia una seconda catena di problema, indipendente, sulla stessa tela."
    ],
    shortcuts: [
      { keys: ["Mod", "Clic"], desc: "Su un riquadro: aggiungi un nuovo perché sotto" },
      { keys: ["Shift", "Clic"], desc: "Su un riquadro: crea un riquadro di causa profonda" },
      { keys: ["Mod", "Clic"], desc: "Su spazio vuoto: nuovo problema" },
      { keys: ["Canc"], desc: "Elimina il riquadro selezionato" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Avviare un'analisi delle cause profonde da un'attività della scomposizione apre un'analisi separata per quell'attività: non sovrascrive quella aperta.",
      "Una causa può avere più di una risposta; ripeti Ctrl + clic sullo stesso riquadro per ramificarla.",
      "Fonda ogni risposta su qualcosa di verificabile. «Distrazione» non è una causa profonda, è una domanda senza risposta.",
      "Un'attività della WBS segnata come fallita può essere inviata qui come problema direttamente dal suo menu contestuale."
    ],
    seo: {
      name: 'Analisi dei 5 perché',
      title: 'Analisi dei 5 perché — trovare la causa radice | Klarsti',
      description:
        'Chiedi perché cinque volte e passa dal sintomo alla causa vera. Spiegato passo passo, con un esempio reale, gratis.',
      keywords: '5 perché, analisi causa radice, metodo dei 5 perché, 5 whys, 5 perché esempio'
    },
    example: {
      title: 'Esempio: le e-mail di conferma non arrivano',
      intro:
        'L\'assistenza riceve la stessa segnalazione da tre giorni. Il primo istinto è «cambiamo fornitore di posta». Chiedere cinque volte perché mostra che il problema sta altrove.',
      blocks: [
        {
          heading: 'Problema',
          items: [
            'I clienti non ricevono l\'e-mail di conferma dell\'ordine.',
          ]
        },
        {
          heading: 'La catena',
          items: [
            'Perché? Le e-mail finiscono nello spam.',
            'Perché? Il nostro dominio di invio risulta non verificato.',
            'Perché? Manca un record di verifica nel DNS.',
            'Perché? Non è stato copiato durante la migrazione del server.',
            'Perché? La lista di controllo della migrazione non ha quella riga.',
          ]
        },
        {
          heading: 'Causa radice',
          items: [
            'La lista di controllo della migrazione è incompleta.',
          ]
        },
        {
          heading: 'Contromisure',
          items: [
            'Aggiunto il record mancante (il problema di oggi è risolto).',
            'Aggiunta la verifica del dominio alla lista di controllo.',
            'La lista non dipende più da chi esegue la migrazione.',
          ]
        },
      ],
      outcome:
        'Il primo istinto era cambiare fornitore: soldi spesi e problema ancora lì. La causa vera era una riga mancante in una lista di controllo. Rendere visibile questa differenza è tutto il lavoro dei cinque perché.'
    },
    faq: [
      {
        q: 'Che cos\'è l\'analisi dei 5 perché?',
        a:
          'Una tecnica per passare dal sintomo visibile alla causa reale chiedendo ripetutamente «perché». Nasce in Toyota. L\'idea è aggiustare ciò che produce il sintomo invece del sintomo stesso, così il problema non torna.'
      },
      {
        q: 'Perché proprio cinque?',
        a:
          'Cinque è un\'abitudine, non una regola. In pratica la maggior parte dei problemi si esaurisce tra la quarta e la sesta domanda. Se la trovi alla terza, fermati. Se alla settima non sei ancora da nessuna parte, probabilmente hai definito male il problema.'
      },
      {
        q: 'Come capisco di essere arrivato alla causa radice?',
        a:
          'Due segnali. Il «perché» successivo comincia a puntare a qualcosa fuori dal tuo controllo, e sei convinto che eliminare quello che hai trovato impedirebbe al problema di ripetersi.'
      },
      {
        q: '5 perché o diagramma di Ishikawa?',
        a:
          'I 5 perché seguono una sola catena verso il basso. L\'Ishikawa distribuisce lo stesso problema per categorie: persone, metodo, macchina, materiale, misura, ambiente. Se la causa sembra stare in un punto solo, usa i 5 perché; se è sparsa, disegna prima la lisca.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per fare un\'analisi dei 5 perché.'
      },
    ]
  },

  flowchart: {
    title: "Diagrammi di flusso",
    summary:
      "Disegna i passaggi, i punti di decisione e la direzione di un processo. Esistono tre tipi di diagramma: workflow, flusso di processo e flusso dei dati. Il tipo che scegli determina quali forme di riquadro sono disponibili.",
    whenToUse: [
      "Diagramma di workflow: per mostrare attività, decisioni, approvazioni e chi le esegue.",
      "Diagramma di flusso di processo: per analizzare un processo produttivo o di servizio con operazioni, trasporti, controlli, attese e depositi.",
      "Diagramma di flusso dei dati: per mappare come i dati si spostano tra entità esterne, processi e archivi."
    ],
    steps: [
      "La scelta del tipo compare la prima volta che apri lo strumento. Puoi cambiarlo in seguito; i riquadri vengono convertiti nell'equivalente più vicino del nuovo tipo.",
      "Il menu dei diagrammi in alto a sinistra ti permette di tenere più diagrammi nello stesso progetto e di passare dall'uno all'altro.",
      "Porta il puntatore su una casella: su tutti e quattro i punti di connessione compare un +. Premine uno, scegli una forma e la nuova casella compare su quel lato, già collegata. Doppio clic su una casella per rinominarla; clic destro per le altre opzioni.",
      "Trascina i riquadri dove vuoi: qui non c'è disposizione automatica, la sistemazione è tua.",
      "Per tracciare un collegamento, trascina da un punto qualsiasi di una casella a un punto qualsiasi di un'altra: da lato a lato, da sopra a sopra, nella direzione che vuoi. Per spostare un capo, prendi la punta della linea e lasciala su un altro punto. Doppio clic su una linea per scriverci sopra (per esempio sì / no).",
      "Ingrandisci con i comandi in basso a sinistra e muoviti nei diagrammi grandi con la mini mappa in basso a destra."
    ],
    shortcuts: [
      { keys: ["Canc"], desc: "Elimina il riquadro o il collegamento selezionato" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Etichetta ogni percorso che esce da un riquadro di decisione: chi legge deve capire quale condizione porta dove.",
      "Se un diagramma non entra più in una schermata, dividilo: sposta la parte affollata in un riquadro di sottoprocesso e disegnala come diagramma a sé.",
      "Il riquadro Ruolo nel diagramma di workflow serve a mostrare chi esegue un passaggio; lascialo fuori se vuoi descrivere il processo a prescindere dalle persone."
    ],
    seo: {
      name: 'Diagramma di flusso',
      title: 'Creare un diagramma di flusso — gratis | Klarsti',
      description:
        'Disegna i passaggi del processo, i punti decisionali e le diramazioni. Con i simboli spiegati e un esempio.',
      keywords: 'diagramma di flusso, creare diagramma di flusso, simboli diagramma di flusso, flowchart, diagramma di flusso esempio'
    },
    example: {
      title: 'Esempio: come viene gestita una richiesta di ferie',
      intro:
        'Ognuno in azienda ha in testa una versione leggermente diversa di questo processo. Chi approva, quando si rifiuta, quando entrano le risorse umane: niente è scritto. Disegnarlo riduce la discussione a una sola casella.',
      blocks: [
        {
          heading: 'Passaggi',
          items: [
            'Inizio: la persona invia la richiesta di ferie',
            'Processo: il sistema calcola i giorni residui',
            'Decisione: ci sono abbastanza giorni?',
            'No → richiesta respinta, motivo registrato',
            'Sì → Processo: la richiesta va al responsabile',
          ]
        },
        {
          heading: 'Seguito',
          items: [
            'Decisione: il responsabile approva?',
            'No → il motivo torna alla persona e il processo finisce',
            'Sì → Processo: le risorse umane registrano in calendario',
            'Processo: si aggiorna il calendario del team',
            'Fine: conferma inviata',
          ]
        },
      ],
      outcome:
        'Una volta disegnato è saltata fuori una cosa: non esisteva alcun passaggio che restituisse il motivo sulle richieste respinte. Finché il processo viveva nelle teste, nessuno se ne accorgeva. Messo in caselle, il buco si è mostrato da solo.'
    },
    faq: [
      {
        q: 'Che cos\'è un diagramma di flusso?',
        a:
          'Uno schema che mostra i passaggi attraversati da un processo dall\'inizio alla fine, dove si decide e dove la strada si divide. Un processo che ci mette cinque minuti a essere spiegato a voce di solito si legge in cinque secondi una volta disegnato.'
      },
      {
        q: 'Cosa significano i simboli?',
        a:
          'La casella arrotondata è inizio o fine, il rettangolo un passaggio, il rombo una decisione. Da una decisione escono sempre almeno due frecce, di solito sì e no. È quella biforcazione a lasciare al lettore una sola interpretazione.'
      },
      {
        q: 'Diagramma di flusso e mappa dei processi sono la stessa cosa?',
        a:
          'Simili ma non uguali. Il diagramma di flusso mostra l\'ordine dei passaggi. La mappa dei processi di solito è più ampia: indica anche chi è responsabile di ogni passaggio e dove il lavoro passa da un team all\'altro.'
      },
      {
        q: 'Da dove comincio a disegnare?',
        a:
          'Dalla fine. Scrivi come finisce il processo e risali chiedendo «cosa deve succedere prima di questo». Partire dall\'inizio tende a produrre il processo ideale invece di quello reale.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per disegnare un diagramma di flusso.'
      },
    ]
  },

  orgchart: {
    title: "Organigrammi",
    summary:
      "Mostra chi risponde a chi e dove si colloca ogni unità. Esistono sette tipi: gerarchico, funzionale, divisionale, a matrice, piatto, per team e a rete. Il tipo determina sia le categorie di riquadro disponibili sia il modo in cui vengono tracciati i collegamenti.",
    whenToUse: [
      "Mettere per iscritto la struttura attuale e individuare posizioni scoperte e sovrapposizioni.",
      "Discutere una riorganizzazione disegnando lo stesso gruppo in tipi diversi e confrontandoli.",
      "Rendere esplicito il doppio riporto in un organigramma a matrice, o i partner esterni in uno a rete."
    ],
    steps: [
      "Scegli il tipo la prima volta che apri lo strumento. Può essere cambiato in seguito; i riquadri vengono convertiti nell'equivalente più vicino e la disposizione viene conservata.",
      "Il menu in alto a sinistra ti permette di tenere più organigrammi in un progetto (per esempio struttura attuale e struttura obiettivo).",
      "Porta il puntatore su una casella: su tutti e quattro i punti di connessione compare un +. Premine uno e scegli posizione, unità, team o posto vacante; la nuova casella compare su quel lato. Doppio clic su una casella per cambiare il nome e il ruolo sotto.",
      "Trascina i riquadri per sistemarli come preferisci.",
      "I collegamenti normali si tracciano dai punti superiore e inferiore di un riquadro: è la linea di riporto principale.",
      "Le linee tracciate dai punti laterali appaiono tratteggiate e indicano un riporto secondario (disponibili negli organigrammi a matrice, gerarchico e a rete)."
    ],
    shortcuts: [
      { keys: ["Canc"], desc: "Elimina il riquadro o il collegamento selezionato" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Il riquadro «posizione vacante» tiene visibili i posti da coprire, così l'organigramma vale anche come piano di assunzioni.",
      "Usa la seconda riga del riquadro per il titolo: sopra il nome della persona o dell'unità, sotto il ruolo.",
      "Non mescolare i due stili di linea: la linea continua dice a chi rispondi, quella tratteggiata dice con chi lavori."
    ],
    seo: {
      name: 'Organigramma',
      title: 'Creare un organigramma aziendale — gratis | Klarsti',
      description:
        'Mostra in una pagina chi risponde a chi e individua i ruoli scoperti. Con un esempio reale da 20 persone.',
      keywords: 'organigramma, creare organigramma, organigramma aziendale, organigramma online, organigramma esempio'
    },
    example: {
      title: 'Esempio: una software house da 20 persone',
      intro:
        'L\'azienda è passata da 6 a 20 persone in due anni. Chi risponde a chi si sa a voce, ma non è scritto da nessuna parte, quindi ogni nuovo arrivato fa le stesse domande.',
      blocks: [
        {
          heading: 'Direzione generale',
          items: [
            'Responsabile di prodotto',
            'Responsabile tecnico',
            'Responsabile commerciale',
            'Responsabile HR e amministrazione',
          ]
        },
        {
          heading: 'Sotto la tecnica',
          items: [
            'Team front-end (3)',
            'Team back-end (4)',
            'Responsabile qualità',
            'Amministratore di sistema',
          ]
        },
        {
          heading: 'Sotto il prodotto',
          items: [
            'Design (2)',
            'Analista di prodotto',
          ]
        },
        {
          heading: 'Sotto il commerciale',
          items: [
            'Vendita sul campo (2)',
            'Assistenza clienti (2)',
          ]
        },
      ],
      outcome:
        'Disegnarlo ha fatto emergere una cosa: la qualità è una persona sola che risponde direttamente al responsabile tecnico, quindi in ferie non la copre nessuno. È qui che un organigramma si ripaga: mostra i buchi con nome e cognome.'
    },
    faq: [
      {
        q: 'Che cos\'è un organigramma?',
        a:
          'Uno schema di come persone e team di un\'organizzazione si collegano. Mostra le linee di riporto e dove si colloca ogni unità. Per chi entra è la mappa più rapida del posto.'
      },
      {
        q: 'Nomi o ruoli?',
        a:
          'Meglio entrambi: il ruolo spiega la struttura, il nome dice a chi rivolgersi. Con i soli nomi l\'organigramma perde senso appena qualcuno se ne va; con i soli ruoli non sai a chi chiedere.'
      },
      {
        q: 'Quante persone stanno in un organigramma?',
        a:
          'Fino a una cinquantina resta leggibile su una pagina. Oltre, conviene mostrare il livello alto a parte e dare a ogni unità il proprio schema. Comprimere una grande organizzazione in una pagina produce un organigramma che nessuno legge.'
      },
      {
        q: 'Ogni quanto va aggiornato?',
        a:
          'A ogni assunzione e a ogni uscita. Un organigramma non aggiornato è peggio di nessun organigramma, perché manda le persone alla persona sbagliata con tutta sicurezza.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per fare un organigramma.'
      },
    ]
  },

  swot: {
    title: "Analisi SWOT",
    summary:
      "Legge un'idea, un progetto o un'organizzazione attraverso quattro finestre: che cosa funziona e che cosa no all'interno, quali opportunità e quali minacce ci sono all'esterno. Il punto non è produrre quattro elenchi, ma collegarli in una strategia.",
    whenToUse: [
      "Farsi un quadro completo di dove ti trovi prima di impegnarti in qualcosa.",
      "Valutare la posizione attuale prima di un piano annuale o di un budget.",
      "Capire dove ti collochi rispetto a un concorrente.",
      "Costruire una visione condivisa con il team: tutti guardano gli stessi quattro riquadri."
    ],
    steps: [
      "Scrivi in alto un nome per l'analisi e premi Crea. Un progetto può contenere più analisi SWOT.",
      "Compaiono quattro riquadri: Punti di forza, Punti deboli, Opportunità, Minacce.",
      "Scrivi un elemento nel campo sotto un riquadro e premi Invio, oppure fai clic sul pulsante più.",
      "Fai clic su un elemento esistente per modificarlo sul posto; le modifiche vengono salvate automaticamente.",
      "L'icona del cestino su un elemento elimina quell'elemento; quella nell'intestazione elimina l'intera analisi.",
      "Per vedere come funziona, carica l'esempio già pronto dalla schermata che compare quando non c'è ancora nessuna analisi."
    ],
    shortcuts: [
      { keys: ["Invio"], desc: "Aggiungi al riquadro l'elemento che hai scritto" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Punti di forza e punti deboli sono interni, cioè sotto il tuo controllo; opportunità e minacce sono esterne. Una SWOT che confonde le due cose non serve a nulla.",
      "Il lavoro vero è accoppiare i riquadri: quale punto di forza coglie quale opportunità, quale punto debole ti espone a quale minaccia.",
      "Riempire un riquadro con dieci voci e lasciarne un altro vuoto non è analisi, è prendere posizione."
    ],
    seo: {
      name: 'Analisi SWOT',
      title: 'Analisi SWOT — come si fa, gratis | Klarsti',
      description:
        'Confronta punti di forza e debolezza con opportunità e minacce, poi incrocia i quattro riquadri. Con esempio compilato.',
      keywords: 'analisi swot, matrice swot, come fare analisi swot, swot esempio, punti di forza e debolezza'
    },
    example: {
      title: 'Esempio: un piccolo studio commercialista',
      intro:
        'Uno studio di cinque persone vuole crescere ma non sa dove spingere. Riempire i quattro riquadri toglie la discussione dall\'istinto e la porta su righe concrete.',
      blocks: [
        {
          heading: 'Punti di forza',
          items: [
            'Clienti da quindici anni',
            'Quasi nessuna perdita di clienti',
            'Entrambi i soci sono commercialisti',
            'Nessun debito',
          ]
        },
        {
          heading: 'Punti di debolezza',
          items: [
            'Tutto dipende dai due soci',
            'Nessun processo digitale, tutto su carta',
            'Nessuna attività di marketing',
            'I nuovi clienti arrivano solo per passaparola',
          ]
        },
        {
          heading: 'Opportunità',
          items: [
            'Gli obblighi di fatturazione elettronica spingono le piccole imprese a cercare',
            'Molte nuove attività aperte in zona',
            'Il servizio da remoto ormai è accettato',
            'I software contabili sono diventati economici',
          ]
        },
        {
          heading: 'Minacce',
          items: [
            'Servizi di contabilità online a basso costo',
            'Uno dei soci è vicino alla pensione',
            'La normativa cambia spesso',
            'Difficile assumere giovani',
          ]
        },
      ],
      outcome:
        'La tabella dice qualcosa di preciso: la più grande opportunità cade esattamente sopra la più grande debolezza — non esiste un processo digitale. La decisione si scrive da sola: non crescere, ma digitalizzare prima il proprio lavoro.'
    },
    faq: [
      {
        q: 'Che cos\'è l\'analisi SWOT?',
        a:
          'Un metodo che raccoglie la situazione di un\'organizzazione o di una decisione in quattro riquadri: punti di forza, di debolezza, opportunità e minacce. Forza e debolezza sono interne; opportunità e minacce esterne. Questa separazione dà il nome al metodo ed è la parte che si sbaglia più spesso.'
      },
      {
        q: 'Come si fa un\'analisi SWOT?',
        a:
          'Prima scrivi in una frase cosa stai analizzando: «la nostra azienda» è troppo largo, «apriamo la seconda sede?» no. Poi riempi i quattro riquadri. L\'ultimo passo conta di più: incrociarli. Quale forza coglie quale opportunità, quale debolezza ti espone a quale minaccia.'
      },
      {
        q: 'Come distinguo un punto di forza da un\'opportunità?',
        a:
          'Una prova semplice: se la tua decisione può cambiarlo è interno; se non può è esterno. Un team esperto è un punto di forza; un mercato in crescita è un\'opportunità. Mescolare i riquadri rende l\'analisi inutilizzabile.'
      },
      {
        q: 'Quanti punti per riquadro?',
        a:
          'Da tre a sei funziona bene. Quindici voci in un riquadro sono un inventario, non un\'analisi. Scegliere le poche che davvero decidono è ciò che fa cadere la conclusione dalla tabella da sola.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per fare un\'analisi SWOT.'
      },
    ]
  },

  ishikawa: {
    title: "Diagramma a lisca di pesce",
    summary:
      "Raccoglie le possibili cause di un problema sotto sei voci: Manodopera, Macchina, Materiale, Metodo, Misurazione e Ambiente. La testa del pesce è il problema, le lische sono gruppi di cause. Il punto è passare in rassegna ogni ambito invece di cercare la causa in un solo posto.",
    whenToUse: [
      "Quando non è chiaro dove sia la causa e vuoi passare in rassegna tutto senza saltare un ambito.",
      "Nel brainstorming di squadra, perché ciascuno contribuisca dal proprio campo.",
      "Raccogliere cause candidate prima di passare ai 5 perché."
    ],
    steps: [
      "Scrivi il problema in una frase in alto e premi Inizia.",
      "Compaiono sei riquadri di categoria. Scrivi una possibile causa nel campo sotto un riquadro e premi Invio.",
      "Modifica la definizione del problema dall'intestazione e gli elementi direttamente dentro i loro riquadri.",
      "Un progetto può contenere più analisi; ognuna diventa una scheda con la propria definizione del problema."
    ],
    shortcuts: [
      { keys: ["Invio"], desc: "Aggiungi alla categoria la causa che hai scritto" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Non sei obbligato a riempire tutte le categorie; anche una categoria lasciata vuota è un'informazione.",
      "Scrivi che cosa è successo, non il sintomo: non «era in ritardo» ma «l'approvazione è rimasta ferma tre giorni».",
      "Porta le due o tre candidate più solide nello strumento dei 5 perché. Ishikawa dà ampiezza, i 5 perché danno profondità."
    ],
    seo: {
      name: 'Diagramma di Ishikawa',
      title: 'Diagramma di Ishikawa — a lisca di pesce | Klarsti',
      description:
        'Raggruppa le cause possibili per persone, metodo, macchine e materiali e vedi da dove partire. Con esempio, gratis.',
      keywords: 'diagramma di ishikawa, lisca di pesce, diagramma causa effetto, 6m, ishikawa esempio'
    },
    example: {
      title: 'Esempio: la percentuale di scarti è aumentata',
      intro:
        'In una falegnameria la quota di pezzi difettosi è passata dal 3% al 9% in due mesi. Invece di inseguire una causa unica, tutti i candidati vengono messi affiancati sotto sei intestazioni.',
      blocks: [
        {
          heading: 'Persone',
          items: [
            'Sono usciti due falegnami esperti',
            'I nuovi non sono stati formati',
            'Nessun passaggio di consegne tra i turni',
          ]
        },
        {
          heading: 'Metodo',
          items: [
            'Le misure di taglio non sono scritte',
            'La qualità si controlla solo a fine linea',
          ]
        },
        {
          heading: 'Macchine',
          items: [
            'La sega è ferma da sei mesi senza manutenzione',
            'La levigatrice si scalibra',
          ]
        },
        {
          heading: 'Materiali',
          items: [
            'È cambiato il fornitore',
            'L\'umidità dei nuovi pannelli non viene misurata',
          ]
        },
      ],
      outcome:
        'Con le lische riempite, due intestazioni sono visibilmente più cariche delle altre: persone e materiali. Il team parte da lì. La lisca non trova la causa: dice da dove iniziare a cercare.'
    },
    faq: [
      {
        q: 'Che cos\'è il diagramma di Ishikawa?',
        a:
          'Uno schema che ordina in categorie le cause possibili di un problema e le mette una accanto all\'altra. Si chiama anche diagramma a lisca di pesce per la forma, oppure diagramma causa-effetto.'
      },
      {
        q: 'Cosa sono le 6M?',
        a:
          'Le sei categorie classiche: manodopera, metodo, macchina, materiale, misura e ambiente. L\'obiettivo non è riempirle tutte, ma costringere lo sguardo in sei direzioni invece dell\'unica che avevi già in testa. Nei servizi queste intestazioni si possono e si devono cambiare.'
      },
      {
        q: 'Si può usare insieme ai 5 perché?',
        a:
          'Sì, ed è il modo più efficace di usare entrambi. Distribuisci i candidati con la lisca, scegli il ramo più solido e scendi in profondità con i 5 perché. Uno dà ampiezza, l\'altro profondità.'
      },
      {
        q: 'La lisca trova la causa?',
        a:
          'Non direttamente: produce candidati. Quando il diagramma è pronto hai una lista da verificare, non una causa dimostrata. Il passo successivo è il confronto con i dati, e lì l\'analisi di Pareto si incastra bene.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per disegnare un diagramma di Ishikawa.'
      },
    ]
  },

  pdca: {
    title: "Ciclo PDCA",
    summary:
      "Pianifica, Esegui, Verifica, Agisci. Porta avanti un miglioramento come una ruota che gira invece che come un'attività isolata: ogni giro parte dal risultato del precedente.",
    whenToUse: [
      "Provare un piccolo cambiamento, misurarne il risultato e poi estenderlo.",
      "Mettere per iscritto se una contromisura ha davvero funzionato.",
      "Seguire i giri nei gruppi che lavorano al miglioramento continuo."
    ],
    steps: [
      "Scrivi in alto l'obiettivo del ciclo e premi Inizia.",
      "Compaiono quattro riquadri di fase. Aggiungi i tuoi elementi nel campo sotto ciascuna fase.",
      "Fai clic sul cerchio a sinistra di un elemento per segnarlo come completato: viene barrato.",
      "Un progetto può contenere più cicli; ogni obiettivo diventa una scheda a sé."
    ],
    shortcuts: [
      { keys: ["Invio"], desc: "Aggiungi alla fase l'elemento che hai scritto" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Metti qualcosa di misurabile nella fase Verifica. Se dietro a «è migliorato?» non c'è un numero, il ciclo non si chiude mai.",
      "Quello che esce dalla fase Agisci è l'ingresso della fase Pianifica del ciclo successivo.",
      "Non cercare di riempire i quattro riquadri tutti insieme: procedere in ordine è il metodo stesso."
    ],
    seo: {
      name: 'Ciclo PDCA',
      title: 'Ciclo PDCA (ruota di Deming) — miglioramento continuo | Klarsti',
      description:
        'Plan, Do, Check, Act: fai piccoli esperimenti e misura il risultato. Con un ciclo completo come esempio.',
      keywords: 'ciclo pdca, ruota di deming, miglioramento continuo, pdca esempio, metodo pdca'
    },
    example: {
      title: 'Esempio: ridurre il tempo di prima risposta nell\'assistenza',
      intro:
        'Il team di assistenza risponde in media in 14 ore. L\'obiettivo sono 4. Prima di assumere qualcuno, esegue un solo ciclo.',
      blocks: [
        {
          heading: 'Plan',
          items: [
            'Obiettivo: prima risposta media sotto le 4 ore',
            'Ipotesi: le richieste si accumulano al mattino e nessuno le prende',
            'Prova: una persona di turno dalle 09:00 alle 11:00',
            'Durata: due settimane',
          ]
        },
        {
          heading: 'Do',
          items: [
            'Turni condivisi con il team',
            'Chi è di turno non riceve altro lavoro in quelle due ore',
            'Ora di prima risposta registrata per ogni richiesta',
          ]
        },
        {
          heading: 'Check',
          items: [
            'La media è scesa da 14 ore a 5',
            'Le richieste del mattino sono scese a 2 ore',
            'Quelle della sera non sono cambiate',
            'Chi era di turno è rimasto indietro sul proprio lavoro',
          ]
        },
        {
          heading: 'Act',
          items: [
            'Il turno del mattino diventa permanente',
            'Carico ridotto nei giorni di turno',
            'Nuovo ciclo aperto per le ore serali',
          ]
        },
      ],
      outcome:
        'Un solo ciclo ha ridotto il tempo a un terzo e ha prodotto da sé la domanda successiva: le richieste della sera. È così che il PDCA dovrebbe girare — ogni ciclo consegna l\'argomento del successivo.'
    },
    faq: [
      {
        q: 'Che cos\'è il ciclo PDCA?',
        a:
          'Un anello di quattro passi per il miglioramento continuo: Plan, Do, Check, Act. Noto anche come ruota di Deming. L\'idea è smettere di fare un grande cambiamento e fare invece piccoli esperimenti di cui si misura davvero il risultato.'
      },
      {
        q: 'Quanto deve durare un ciclo?',
        a:
          'Il tempo più breve in cui puoi misurare il risultato. Da una a quattro settimane va bene per quasi tutto il lavoro d\'ufficio. Un ciclo di sei mesi non è un ciclo: quando guardi le condizioni saranno cambiate e non saprai cosa ha causato cosa.'
      },
      {
        q: 'Cosa si misura nella fase Check?',
        a:
          'Quello che hai scritto nella fase Plan. Per questo l\'obiettivo deve essere un numero: «rispondere più in fretta» non si verifica, «prima risposta media sotto le 4 ore» sì. Senza un numero scritto prima, Check diventa un\'opinione.'
      },
      {
        q: 'E se l\'esperimento fallisce?',
        a:
          'Un ciclo fallito è comunque un risultato e non si butta. Nella fase Act scrivi perché l\'ipotesi non ha retto, e il ciclo successivo parte da lì. L\'unico vero spreco nel PDCA è provare qualcosa di nuovo senza registrare cos\'è successo.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per portare avanti un ciclo PDCA.'
      },
    ]
  },

  waterfall: {
    title: "Modello a cascata",
    summary:
      "Divide un progetto in sei fasi da percorrere in ordine: Requisiti, Progettazione di alto livello, Progettazione di dettaglio, Implementazione, Verifica, Manutenzione. La fase successiva non si apre finché quella in corso non si chiude, e una fase chiusa resta bloccata.",
    whenToUse: [
      "Lavori i cui requisiti sono noti fin dall'inizio e non cambieranno strada facendo.",
      "Progetti che richiedono approvazioni e documentazione, dove ogni fase deve restare agli atti.",
      "Lavori in cui conta l'ordine stesso: la produzione non deve partire prima che la progettazione sia finita."
    ],
    steps: [
      "Scrivi in alto il nome del progetto e premi Inizia.",
      "Le sei fasi si dispongono una sotto l'altra. Solo la fase aperta accetta elementi; quelle successive sono contrassegnate da un lucchetto.",
      "Quando la fase è conclusa, premi il pulsante «completa questa fase» sotto il riquadro.",
      "Dopo la conferma si apre la fase successiva; quella completata riceve un segno di spunta e i suoi elementi non si possono più modificare.",
      "Un progetto può contenere più progetti a cascata."
    ],
    shortcuts: [
      { keys: ["Invio"], desc: "Aggiungi alla fase l'elemento che hai scritto" },
      { keys: ["Mod", "Z"], desc: "Annulla (riporta indietro anche una fase completata)" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Non esiste un pulsante per riaprire una fase; se ne hai completata una per sbaglio, annullare è l'unica via di ritorno.",
      "Assicurati che una fase sia davvero finita prima di chiuderla: la chiusura blocca anche i testi.",
      "Se i requisiti cambieranno lungo il percorso, la cascata ti ingabbia; in quel caso la WBS o il PDCA sono più comodi."
    ],
    seo: {
      name: 'Modello a cascata',
      title: 'Modello a cascata nella gestione progetti | Klarsti',
      description:
        'Requisiti, progettazione, sviluppo, test e consegna in sequenza. Con esempio e la differenza rispetto ai metodi agili.',
      keywords: 'modello a cascata, waterfall, cascata vs agile, fasi modello a cascata, gestione progetti cascata'
    },
    example: {
      title: 'Esempio: consegnare un modulo di reportistica a una banca',
      intro:
        'Ambito fissato da contratto, data di consegna fissata, approvazione scritta del cliente alla fine di ogni fase. Un lavoro così procede per fasi in ordine.',
      blocks: [
        {
          heading: 'Requisiti',
          items: [
            'Tipi di report elencati',
            'Regole di autorizzazione scritte',
            'Approvazione del cliente',
          ]
        },
        {
          heading: 'Progettazione',
          items: [
            'Modello dei dati',
            'Bozze delle schermate',
            'Limiti di prestazione concordati',
          ]
        },
        {
          heading: 'Sviluppo',
          items: [
            'Motore di reportistica',
            'Autorizzazioni',
            'Esportazione',
          ]
        },
        {
          heading: 'Test e consegna',
          items: [
            'Test interni',
            'Collaudo del cliente',
            'Messa in produzione',
            'Formazione degli utenti',
          ]
        },
      ],
      outcome:
        'Qui si vedono insieme forza e debolezza della cascata: poiché l\'ambito è fissato dall\'inizio, l\'avanzamento si misura facilmente — ma un requisito che cambia durante lo sviluppo rimanda indietro l\'intero piano.'
    },
    faq: [
      {
        q: 'Che cos\'è il modello a cascata?',
        a:
          'Un metodo che divide il progetto in fasi successive e non ne inizia una prima di aver chiuso la precedente: requisiti, progettazione, sviluppo, test, consegna. Il nome viene dall\'acqua che scende di gradino in gradino.'
      },
      {
        q: 'Cascata o agile?',
        a:
          'Se l\'ambito è noto in anticipo e difficilmente si muoverà, la cascata porta meno peso gestionale: edilizia, lavori normati e consegne a prezzo fisso ci stanno bene. Se l\'ambito si chiarirà solo strada facendo, la cascata diventa cara e i metodi agili funzionano meglio.'
      },
      {
        q: 'Si può tornare a una fase precedente?',
        a:
          'Si può, ma costa, e il modello non è fatto per questo. Se torni indietro spesso è segno che l\'ambito non è mai stato abbastanza chiaro; e allora la vera domanda è se la cascata fosse la scelta giusta.'
      },
      {
        q: 'Cosa succede tra una fase e l\'altra?',
        a:
          'Ogni fase finisce con un rilascio e un\'approvazione, e l\'approvazione deve essere scritta. Tutta la garanzia offerta dalla cascata poggia sul fatto che le due parti concordino, nello stesso momento, che una fase è chiusa.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per gestire un progetto a cascata.'
      },
    ]
  },

  fta: {
    title: "Analisi dell'albero dei guasti (FTA)",
    summary:
      "In cima sta un evento indesiderato e sotto le condizioni che devono combinarsi perché accada. L'albero si costruisce con porte logiche; inserisci le probabilità sugli eventi base e la probabilità dell'evento di vertice viene calcolata per te.",
    whenToUse: [
      "Vedere quali combinazioni di condizioni possono produrre un guasto o un incidente.",
      "Parlare di rischio in numeri: quanto contribuisce ogni ramo al totale.",
      "Mostrare quale ramo viene tagliato da una determinata misura di sicurezza."
    ],
    steps: [
      "Il menu in alto a sinistra passa da un albero all'altro nello stesso progetto e permette di aggiungerne, rinominarne o eliminarne uno.",
      "Crea il riquadro dell'evento di vertice sulla schermata vuota, oppure carica l'esempio già pronto.",
      "Clic destro su un riquadro e usa Modifica per impostarne nome, descrizione e, sugli eventi base, la probabilità.",
      "Dallo stesso menu aggiungi un evento sotto di esso: evento, evento base, evento non sviluppato o evento condizionante.",
      "Da quel menu aggiungi anche le porte logiche: AND, AND con priorità, OR, OR esclusivo o inibizione.",
      "Inserisci le probabilità in percentuale sugli eventi base; le porte superiori e l'evento di vertice vengono calcolati da lì.",
      "Trascina i riquadri per sistemarli e usa la mini mappa in basso a destra per muoverti in un albero grande."
    ],
    shortcuts: [
      { keys: ["Canc"], desc: "Elimina il riquadro selezionato" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Una porta AND moltiplica le probabilità sottostanti: deve succedere tutto, quindi il risultato si restringe. Una porta OR ne richiede una sola, quindi il risultato cresce.",
      "I rami senza probabilità non vengono conteggiati; il numero in cima copre soltanto i dati che hai inserito.",
      "Gli eventi base sono cerchi, quelli non sviluppati sono rombi: segnare i rami in cui non sei sceso mantiene onesto l'albero."
    ],
    seo: {
      name: 'Analisi dell\'albero dei guasti (FTA)',
      title: 'Analisi dell\'albero dei guasti (FTA) | Klarsti',
      description:
        'Metti l\'evento indesiderato in cima e risolvi con porte E/O quali guasti devono coincidere. Con esempio, gratis.',
      keywords: 'albero dei guasti, fault tree analysis, fta, porta and or, albero dei guasti esempio'
    },
    example: {
      title: 'Esempio: la cella frigorifera ha superato il limite di temperatura',
      intro:
        'In un magazzino alimentare la temperatura è rimasta due ore sopra il limite e la merce è stata distrutta. L\'evento indesiderato viene messo in cima e l\'albero scende con porte logiche mostrando quali guasti dovevano coincidere.',
      blocks: [
        {
          heading: 'Evento di vertice',
          items: [
            'Cella sopra il limite per due ore',
          ]
        },
        {
          heading: 'Porta OR — ne basta uno',
          items: [
            'Il freddo si è fermato',
            'È entrato calore',
            'L\'allarme non è scattato e nessuno se n\'è accorto',
          ]
        },
        {
          heading: 'Sotto «il freddo si è fermato» (OR)',
          items: [
            'Guasto al compressore',
            'Interruzione di corrente',
            'Termostato impostato male',
          ]
        },
        {
          heading: 'Sotto «l\'allarme non è scattato» (AND)',
          items: [
            'Sensore guasto',
            'Sensore di riserva mai installato',
            'Notifiche remote disattivate',
          ]
        },
      ],
      outcome:
        'L\'albero mostra che il fermo del freddo da solo non basta: doveva mancare anche l\'allarme. Quindi la contromisura più economica non è un compressore nuovo, è installare il sensore di riserva. È qui che l\'albero dei guasti manda i soldi nel posto giusto.'
    },
    faq: [
      {
        q: 'Che cos\'è l\'analisi dell\'albero dei guasti (FTA)?',
        a:
          'Un metodo che mette un evento indesiderato in cima e scende con porte logiche per mostrare quali combinazioni di guasti lo produrrebbero. Viene dall\'aeronautica e dal nucleare e oggi si usa in generale nelle analisi di sicurezza e di processo.'
      },
      {
        q: 'Che differenza c\'è tra porta AND e porta OR?',
        a:
          'Sotto una porta OR basta uno qualsiasi degli eventi sottostanti. Sotto una porta AND devono verificarsi tutti insieme. Questa distinzione è il cuore del metodo: le porte AND mostrano dove il sistema si sta proteggendo da solo.'
      },
      {
        q: 'Albero dei guasti o 5 perché?',
        a:
          'I 5 perché risalgono una singola catena da qualcosa che è già successo. L\'albero mappa tutte le strade verso un evento che non è ancora successo. Uno guarda al passato, l\'altro al futuro.'
      },
      {
        q: 'Fin dove deve scendere l\'albero?',
        a:
          'Fino a eventi che non riesci più a scomporre e su cui puoi agire direttamente. «Sensore guasto» è abbastanza in basso, perché ci puoi scrivere una contromisura sopra. «Il sistema non funziona» no.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per costruire un albero dei guasti.'
      },
    ]
  },

  vsm: {
    title: "Mappatura del flusso di valore",
    summary:
      "Disegna il flusso completo di un prodotto o di un lavoro insieme alle attese e alle scorte che stanno in mezzo. Il punto è vedere quanta parte del tempo totale crea davvero valore: di solito molta meno di quanto si creda.",
    whenToUse: [
      "Per trovare dove un processo aspetta e dove il lavoro si accumula.",
      "Per capire quale passaggio non regge la domanda del cliente: c'è qualcosa che supera il takt time?",
      "Per disegnare lo stato attuale e affiancargli uno stato futuro da confrontare."
    ],
    steps: [
      "Inserisci la domanda giornaliera e i dati sui turni nel pannello in alto a destra. Da lì esce il takt time: ogni quanto deve uscire un pezzo.",
      "Su una tela vuota, crea lo scheletro iniziale oppure parti da zero. Clic destro sulla tela per aggiungere qualsiasi riquadro.",
      "Scrivi nel riquadro di processo il tempo ciclo con la sua unità. Se supera il takt time il riquadro diventa rosso: quello è il collo di bottiglia.",
      "Scrivi nel riquadro di scorta il numero di pezzi in attesa; il tempo di attesa si ricava come pezzi ÷ domanda giornaliera. Se non hai un conteggio, inserisci direttamente il tempo.",
      "Collega i riquadri. Clic destro su un collegamento per trasformarlo in push, pull, FIFO, informazione manuale o informazione elettronica. Solo le frecce di materiale entrano nel calcolo dei tempi.",
      "Dal menu in alto a sinistra copia lo stato attuale come stato futuro, lavoraci sopra e confronta i numeri in basso."
    ],
    shortcuts: [
      { keys: ["Canc"], desc: "Elimina il riquadro selezionato" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "L'efficienza del flusso in basso è il tempo a valore aggiunto diviso il lead time totale. Valori a una cifra sono normali; ciò che va accorciato è l'attesa, non il lavoro.",
      "Se lasci le scorte fuori dalla mappa, il tempo totale sembra migliore di quanto sia: è proprio lì che si nasconde l'informazione utile.",
      "I riquadri non collegati alla catena restano esclusi dai totali e vengono segnalati sotto come avviso. Collega il flusso come una linea unica.",
      "Metti un kaizen burst dove intendi migliorare: è così che si legge una mappa dello stato futuro."
    ],
    seo: {
      name: 'Mappatura del flusso di valore (VSM)',
      title: 'Mappatura del flusso di valore (VSM) | Klarsti',
      description:
        'Confronta tempo di lavorazione e attesa in ogni fase e vedi dove si perde il tempo. Con esempio numerico, gratis.',
      keywords: 'value stream mapping, mappatura flusso di valore, vsm, lean manufacturing, vsm esempio'
    },
    example: {
      title: 'Esempio: dall\'ordine ricevuto alla merce spedita',
      intro:
        'Un produttore misura il tempo tra l\'arrivo di un ordine e il carico sul camion. Il tempo di lavorazione reale di ogni passo viene annotato separatamente dall\'attesa tra i passi. La differenza ribalta il quadro.',
      blocks: [
        {
          heading: 'Passi e tempo di lavorazione',
          items: [
            'Inserimento ordine — 10 minuti',
            'Verifica fido — 15 minuti',
            'Inserimento nel piano di produzione — 30 minuti',
            'Produzione — 4 ore',
            'Controllo qualità — 20 minuti',
            'Imballaggio e spedizione — 40 minuti',
          ]
        },
        {
          heading: 'Attesa tra i passi',
          items: [
            'Dopo l\'inserimento — 1 giorno',
            'Dopo la verifica fido — 2 giorni',
            'Dopo l\'inserimento a piano — 3 giorni',
            'Dopo la produzione — 1 giorno',
            'Dopo la qualità — 2 giorni',
          ]
        },
      ],
      outcome:
        'Il tempo di lavorazione somma circa 6 ore; il tempo totale è di 9 giorni. Cioè il 99% del tempo è attesa. L\'attesa più lunga sono i tre giorni dopo l\'inserimento a piano. La risposta non lascia dubbi: accelerare la produzione non serve, il problema è la coda.'
    },
    faq: [
      {
        q: 'Che cos\'è la mappatura del flusso di valore (VSM)?',
        a:
          'Una mappa di tutti i passi attraversati da un prodotto o da una richiesta, con la durata di ogni passo e l\'attesa tra essi. Viene dalla produzione snella. Il suo scopo non è andare più veloci ma mostrare dove il tempo se ne va davvero.'
      },
      {
        q: 'Cosa aggiunge valore e cosa no?',
        a:
          'Tutto ciò per cui il cliente pagherebbe volentieri aggiunge valore: i passi che cambiano davvero il prodotto. Attendere, spostare e ripetere controlli no. Nella maggior parte dei processi oltre il 90% del tempo totale non aggiunge valore.'
      },
      {
        q: 'Che differenza c\'è con un diagramma di flusso?',
        a:
          'Il diagramma di flusso mostra l\'ordine dei passi e i punti di decisione, senza durate. Nella mappa del flusso di valore la durata è tutto: tempo di lavorazione e tempo di attesa vengono annotati separatamente a ogni passo e poi confrontati.'
      },
      {
        q: 'Da dove comincio?',
        a:
          'Mappando lo stato attuale esattamente com\'è. L\'errore più comune è disegnare il processo come dovrebbe funzionare. Se la mappa non mostra la realtà, i miglioramenti vengono applicati a un processo che non esiste. I tempi reali vanno misurati sul posto.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per disegnare una mappa del flusso di valore.'
      },
    ]
  },

  pareto: {
    title: "Analisi di Pareto",
    summary:
      "La maggior parte dell'effetto viene da poche cause. Ordina le categorie per frequenza dalla più grande alla più piccola e ci sovrappone una curva di percentuale cumulata, così diventa visibile la manciata di voci che sta dietro alla maggior parte del problema.",
    whenToUse: [
      "Decidere quale affrontare per prima tra molte lamentele, difetti o voci di costo.",
      "Mostrare dove un miglioramento renderà di più.",
      "Sostenere la scelta di concentrare le risorse su pochi punti invece di distribuirle."
    ],
    steps: [
      "Crea l'analisi alla prima apertura. Usa l'elenco in alto per passare da un'analisi all'altra nel progetto, la matita per rinominare, il cestino per eliminare.",
      "Inserisci il nome della categoria e la sua frequenza nella tabella del pannello di sinistra.",
      "Usa il pulsante di aggiunta sotto la tabella per una nuova riga.",
      "Il grafico si aggiorna all'istante: le barre si ordinano dalla più grande alla più piccola e la curva mostra la percentuale cumulata."
    ],
    shortcuts: [
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Al posto della frequenza puoi inserire il costo o il tempo perso, purché ogni riga usi la stessa unità.",
      "Fermati dove la curva si appiattisce: la coda lunga sulla destra è la parte che non conviene inseguire.",
      "Se spezzetti troppo le categorie non emerge nulla e il grafico si appiattisce. Unisci le voci simili."
    ],
    seo: {
      name: 'Analisi di Pareto',
      title: 'Analisi di Pareto e grafico 80/20 | Klarsti',
      description:
        'Ordina le cause per frequenza e trova le poche che generano gran parte del problema. Con esempio, gratis.',
      keywords: 'analisi di pareto, diagramma di pareto, regola 80 20, principio di pareto, pareto esempio'
    },
    example: {
      title: 'Esempio: da dove arrivano i reclami dei clienti',
      intro:
        'Un negozio online ha ricevuto 480 reclami in tre mesi. Il team discuteva una soluzione diversa per ogni tipo. Contarli e ordinarli dal più grande al più piccolo cambia la conversazione.',
      blocks: [
        {
          heading: 'Tipo di reclamo e numero',
          items: [
            'Consegna in ritardo — 196',
            'Articolo diverso dalla descrizione — 121',
            'Reso troppo lento — 62',
            'Articolo danneggiato — 48',
            'Articolo sbagliato — 29',
            'Altro — 24',
          ]
        },
        {
          heading: 'Quota cumulata',
          items: [
            'Consegna in ritardo — 41%',
            '+ Descrizione — 66%',
            '+ Resi — 79%',
            '+ Danni — 89%',
            'Le tre restanti — 100%',
          ]
        },
      ],
      outcome:
        'I primi due fanno due terzi del totale. Invece di inseguire sei problemi insieme, sistemare i tempi di consegna e le descrizioni elimina il 66% dell\'insoddisfazione. Rendere visibile quest\'ordine è tutto il lavoro dell\'analisi di Pareto.'
    },
    faq: [
      {
        q: 'Che cos\'è l\'analisi di Pareto?',
        a:
          'Un metodo che ordina i problemi per frequenza, dal più grande al più piccolo, e mostra quali pochi fanno la maggior parte del totale. Si appoggia a un\'osservazione semplice: circa l\'80% degli effetti viene da circa il 20% delle cause.'
      },
      {
        q: 'La regola 80/20 vale sempre?',
        a:
          'Non esattamente, e non serve. A volte esce 70/30, a volte 90/10. Quello che conta non è la proporzione ma che la distribuzione sia squilibrata: se poche voci portano la maggior parte, l\'analisi di Pareto serve.'
      },
      {
        q: 'Ordino per numero o per costo?',
        a:
          'Secondo ciò da cui dipende la tua decisione. Il numero mostra quale problema capita più spesso; il costo, quale fa più male. Spesso non coincidono: un problema raro ma costoso finisce in fondo a un elenco ordinato per numero.'
      },
      {
        q: 'Quante categorie servono?',
        a:
          'Da cinque a dieci si leggono meglio. Un\'analisi con trenta categorie resta un elenco e non dà nessuna direzione. Scegliere poche categorie davvero distinte è metà del lavoro.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per fare un\'analisi di Pareto.'
      },
    ]
  },

  histogram: {
    title: "Istogramma",
    summary:
      "Mostra la distribuzione di una misura: dove si addensano i valori, se la dispersione è simmetrica, se qualcosa sta agli estremi. Tu fornisci le misure grezze, lo strumento le raggruppa in classi e, con i limiti di specifica, calcola anche la capacità di processo.",
    whenToUse: [
      "Per vedere che cosa nasconde la media: la stessa media può venire da distribuzioni molto diverse.",
      "Per giudicare quanto è costante un processo: una dispersione stretta significa costante, una larga significa irregolare.",
      "Per vedere quanto spesso le misure cadono fuori specifica e se il processo riesce a soddisfare la richiesta."
    ],
    steps: [
      "Crea l'analisi; passa da un'analisi all'altra nello stesso progetto dall'elenco in alto.",
      "Scrivi le misure nel riquadro di sinistra, oppure incolla un elenco così com'è. Un valore per riga; i decimali possono usare la virgola o il punto.",
      "Lo strumento sceglie da sé il numero di classi (regola di Sturges). Se preferisci, sostituiscilo con un tuo numero.",
      "Inserisci il limite di specifica inferiore e superiore. Compaiono come linee rosse tratteggiate e le colonne fuori specifica diventano rosse.",
      "Sotto trovi conteggio, media, deviazione standard e intervallo; inserendo entrambi i limiti, anche Cp e Cpk."
    ],
    shortcuts: [
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "La curva grigia è una distribuzione normale con la stessa media e la stessa deviazione. Le colonne che se ne discostano nettamente indicano una causa speciale.",
      "Una distribuzione con due picchi di solito significa che due processi diversi (due turni, due macchine) sono finiti nella stessa tabella.",
      "Un Cpk pari o superiore a 1,33 è generalmente considerato adeguato; sotto 1 il processo non riesce a rispettare i limiti.",
      "Un buon Cp con un Cpk scarso significa che la dispersione è stretta ma la media si è spostata: basta una regolazione, non serve restringere la distribuzione."
    ],
    seo: {
      name: 'Istogramma',
      title: 'Creare un istogramma — vedere la distribuzione | Klarsti',
      description:
        'Dividi le misurazioni in classi e scopri cosa nasconde la media. Spiega cosa significano due picchi. Gratis.',
      keywords: 'istogramma, creare istogramma, istogramma online, distribuzione di frequenza, istogramma esempio'
    },
    example: {
      title: 'Esempio: i tempi di consegna',
      intro:
        'Il tempo medio di consegna viene riportato come 3 giorni e sembra ragionevole. I reclami però continuano. Raggruppare i tempi uno per uno rivela cosa nascondeva la media.',
      blocks: [
        {
          heading: 'Distribuzione dei tempi (500 ordini)',
          items: [
            '1 giorno — 140 ordini',
            '2 giorni — 165 ordini',
            '3 giorni — 95 ordini',
            '4 giorni — 30 ordini',
            '5 giorni — 12 ordini',
            '6 giorni o più — 58 ordini',
          ]
        },
        {
          heading: 'Come si legge',
          items: [
            'Il 60% arriva entro due giorni',
            'C\'è un gruppo piccolo ma netto a sei giorni e oltre',
            'La forma ha due picchi, non uno',
            'Tre giorni — la media — è tra gli esiti meno frequenti',
          ]
        },
      ],
      outcome:
        'La media dice tre giorni, ma in realtà ci sono due esperienze cliente diverse: la maggior parte riceve in due giorni, una parte aspetta una settimana. Una distribuzione a due picchi significa sempre la stessa cosa: non è un processo, sono due. La domanda successiva è da quale zona o quale magazzino vengono quei 58 ordini.'
    },
    faq: [
      {
        q: 'Che cos\'è un istogramma?',
        a:
          'Un grafico che divide le misurazioni in intervalli e mostra quante cadono in ciascuno. Rende visibile ciò che la media nasconde: come si distribuiscono i valori.'
      },
      {
        q: 'Che differenza c\'è con un grafico a barre?',
        a:
          'Il grafico a barre mostra categorie e puoi riordinarle: città, prodotti. L\'istogramma ha un asse numerico, l\'ordine è fisso e le barre si toccano. A decidere quale ti serve è il tipo di dato.'
      },
      {
        q: 'Quanti intervalli uso?',
        a:
          'Un punto di partenza comune è circa la radice quadrata del numero di misurazioni: una decina per 100 dati. Troppo pochi cancellano la forma, troppi trasformano il rumore in struttura apparente. Prova un paio di valori e tieni quello in cui la forma resta stabile.'
      },
      {
        q: 'Cosa significa un istogramma con due picchi?',
        a:
          'Quasi sempre che i dati non vengono da un solo processo: due turni, due macchine, due zone. Davanti a questa forma la prima cosa da fare è separare i dati e guardare ogni parte per conto suo.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per costruire un istogramma.'
      },
    ]
  },

  decision: {
    title: "Matrice decisionale",
    summary:
      "Assegna un punteggio a più opzioni rispetto agli stessi criteri. Ogni criterio ha un peso; il totale di un'opzione è la somma dei prodotti punteggio × peso.",
    whenToUse: [
      "Quando sei bloccato tra poche alternative e la discussione su «quale è meglio» continua a girare in tondo.",
      "Quando il ragionamento dietro a una decisione deve restare agli atti.",
      "Quando ognuno nel team sta pesando in silenzio un criterio diverso: la matrice fa uscire allo scoperto quei criteri."
    ],
    steps: [
      "Aggiungi i criteri: le voci su cui farai il confronto (costo, tempo, rischio...).",
      "Dai a ogni criterio un peso da 1 a 5, cioè quanto quella voce conta per te.",
      "Aggiungi le opzioni: le alternative che stai confrontando.",
      "Nella tabella assegna a ogni opzione un punteggio da 0 a 10 per ciascun criterio.",
      "I totali si calcolano automaticamente e l'opzione con il punteggio più alto viene contrassegnata con un trofeo."
    ],
    shortcuts: [
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripeti" }
    ],
    tips: [
      "Fissa i pesi prima di iniziare a dare punteggi. Ritoccarli dopo non è decidere, è fabbricare la risposta che volevi.",
      "La matrice non decide al posto tuo; rende visibile in base a che cosa hai deciso.",
      "Se due totali risultano molto vicini, la risposta non è «pari merito» ma «questi criteri non li distinguono»: cerca il criterio che manca."
    ],
    seo: {
      name: 'Matrice decisionale',
      title: 'Matrice decisionale — punteggio ponderato | Klarsti',
      description:
        'Valuta le opzioni con criteri pesati e rendi visibile su cosa poggia davvero la decisione. Con esempio, gratis.',
      keywords: 'matrice decisionale, punteggio ponderato, supporto alle decisioni, matrice decisionale esempio, confronto opzioni'
    },
    example: {
      title: 'Esempio: quale capannone affittiamo?',
      intro:
        'Tre candidati, e ognuno ha un preferito diverso. La discussione gira sul «secondo me». Pesare i criteri e dare a ogni opzione un voto da uno a dieci la porta sui numeri.',
      blocks: [
        {
          heading: 'Criteri e peso',
          items: [
            'Costo mensile — peso 5',
            'Vicinanza ai clienti — peso 4',
            'Spazio per crescere — peso 3',
            'Accesso a strada e porto — peso 3',
            'Difficoltà del trasloco — peso 1',
          ]
        },
        {
          heading: 'Voti (1-10)',
          items: [
            'Capannone A: 8 / 4 / 6 / 5 / 7',
            'Capannone B: 5 / 9 / 4 / 8 / 5',
            'Capannone C: 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Totale pesato',
          items: [
            'Capannone A — 100',
            'Capannone B — 114',
            'Capannone C — 114',
          ]
        },
      ],
      outcome:
        'A è fuori. B e C pari, quindi la matrice non ha deciso — ma ha ridotto la discussione da cinque criteri a uno. Resta solo una domanda: la vicinanza pesa più dello spazio per crescere? Di solito è questo il vero vantaggio di una matrice decisionale: non sceglie, restringe.'
    },
    faq: [
      {
        q: 'Che cos\'è una matrice decisionale?',
        a:
          'Una tabella che valuta più opzioni sugli stessi criteri e moltiplica ogni voto per l\'importanza del criterio. Lo scopo non è automatizzare la decisione ma rendere visibili le ipotesi su cui poggia.'
      },
      {
        q: 'Come stabilisco i pesi?',
        a:
          'Prima di dare i voti e senza guardare le opzioni. Al contrario, si finisce per aggiustare i pesi finché vince l\'opzione preferita. Scrivere i pesi per primi e bloccarli è l\'unica cosa che dà valore alla matrice.'
      },
      {
        q: 'E se il risultato non è l\'opzione che volevo?',
        a:
          'È il momento più prezioso della matrice. Ci sono due possibilità: o hai pesato male un criterio, o manca un criterio in tabella. Entrambe si risolvono scrivendo quello che manca, non ritoccando i numeri.'
      },
      {
        q: 'Quanti criteri uso?',
        a:
          'Da quattro a sette funziona bene. Sotto i tre potevi decidere d\'istinto; sopra i sette i pesi si avvicinano e i totali finiscono appiccicati senza significato.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per costruire una matrice decisionale.'
      },
    ]
  },

  notepad: {
    title: "Agenda",
    summary:
      "Uno spazio personale in cui scegli i giorni dal calendario e li pianifichi. A differenza degli altri strumenti, l'agenda non è un dato di progetto: le voci sono tue e non raggiungono nessuno quando condividi un progetto.",
    whenToUse: [
      "Impostare la giornata e collocare il lavoro nelle ore.",
      "Portare un'attività della WBS in un giorno preciso.",
      "Scrivere con parole tue com'è andata la giornata mentre la chiudi."
    ],
    steps: [
      "I giorni con delle voci sono contrassegnati sul calendario; fai clic su un giorno per aprirne il flusso.",
      "Per una nuova voce, scrivi il titolo e il testo. Dalle un intervallo di tempo oppure lasciala per tutto il giorno.",
      "Se imposti un intervallo che si sovrappone a un'altra voce, ricevi un avviso di conflitto.",
      "Puoi impostare un promemoria: all'ora di inizio, 5 / 15 / 30 minuti, 1 ora o 1 giorno prima. I promemoria arrivano come notifiche nell'app per smartphone.",
      "Usa la sezione del bilancio di fine giornata in alto per raccontare la giornata con parole tue; non serve salvarla a parte.",
      "Non puoi aggiungere una nuova voce a un giorno passato. Le voci esistenti restano modificabili, oppure puoi portarle avanti con «sposta a oggi»."
    ],
    tips: [
      "Fai clic destro su un'attività della WBS e scegli «Aggiungi all'agenda»: arriva qui con la propria data.",
      "Annulla e ripeti non funzionano nell'agenda: non conserva una cronologia.",
      "L'elenco sotto il calendario mostra le tue voci in arrivo; parti da lì se non sai quale giorno aprire."
    ],
    seo: {
      name: 'Agenda giornaliera',
      title: 'Agenda giornaliera con bilancio di fine giornata | Klarsti',
      description:
        'Scrivi la giornata al mattino e ripassala la sera. La tua agenda resta privata e non viene condivisa con il progetto.',
      keywords: 'agenda giornaliera, pianificatore giornaliero, bilancio giornata, lista attività, agenda online'
    },
    example: {
      title: 'Esempio: un martedì pieno',
      intro:
        'Tre riunioni, una consegna e tutto il resto incastrato in mezzo. Cinque minuti la mattina per scrivere la giornata evitano la sera passata a discutere con se stessi su cosa è stato fatto.',
      blocks: [
        {
          heading: 'Oggi senza fallo',
          items: [
            'Finire la presentazione per il cliente (prima della riunione delle 14)',
            'Inviare le approvazioni delle fatture',
            'Aprire gli accessi alla nuova collega',
          ]
        },
        {
          heading: 'Bene se capita',
          items: [
            'Leggere il report della settimana scorsa',
            'Chiamare il fornitore',
            'Sistemare la scrivania',
          ]
        },
        {
          heading: 'Bilancio di fine giornata',
          items: [
            'Presentazione finita, ma alle 13:50, troppo tirata',
            'Approvazioni delle fatture dimenticate — domani per prima cosa',
            'Nel pomeriggio due ore senza interruzioni',
            'Domani accorpo le riunioni dopo pranzo',
          ]
        },
      ],
      outcome:
        'Il valore non è nell\'elenco ma nel bilancio. Dopo una settimana la stessa riga torna: il lavoro viene schiacciato tra le riunioni. Non si può correggere prima di essersene accorti.'
    },
    faq: [
      {
        q: 'A cosa serve l\'agenda giornaliera?',
        a:
          'A scrivere la giornata all\'inizio e a ripassarla alla fine. Ha due metà: il piano e il bilancio di fine giornata. Senza la seconda diventa una lista di cose da fare; il valore sta nell\'accorgersi che lo stesso errore si ripete.'
      },
      {
        q: 'Qualcun altro può vedere la mia agenda?',
        a:
          'No. Agenda e bilancio sono personali. Non stanno dentro i tuoi progetti ma nel tuo registro personale, quindi condividere un progetto con il team non condivide la tua agenda.'
      },
      {
        q: 'Quante voci scrivere?',
        a:
          'Non più di tre nell\'elenco delle cose obbligatorie. Gli elenchi più lunghi finiscono ogni giorno a metà e dopo un po\' smetti di guardarli. Tutto il resto va nel secondo gruppo: bene se capita, e la giornata non è un fallimento se non capita.'
      },
      {
        q: 'Cosa scrivere nel bilancio di fine giornata?',
        a:
          'Non quello che hai fatto, ma quello che hai notato. «Finita la presentazione» non porta informazione; «la presentazione è andata all\'ultimo perché la riunione del mattino si è allungata» ti servirà la settimana prossima.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità.'
      },
    ]
  },
  gantt: {
    title: "Diagramma di Gantt",
    summary: "Uno strumento di pianificazione che dispone il lavoro come barre orizzontali su un calendario. Cosa inizia quando, quanto dura e cosa aspetta cosa, tutto in una schermata.",
    whenToUse: [
      "Per legare il lavoro alle date e fissare le partenze.",
      "Per mostrare l'ordine e le attività che si aspettano a vicenda.",
      "Per accorgersi presto dei ritardi."
    ],
    steps: [
      "Un progetto può contenere più diagrammi. Dal menu in alto a sinistra ne crei uno o passi da uno all'altro.",
      "Aggiungi righe con \"Aggiungi attività\". Doppio clic sul nome per cambiarlo.",
      "Selezionando una riga si apre la barra dei dettagli in basso: inizio, fine, avanzamento e stato.",
      "Trascina una barra per spostare le date; tira un bordo per allungarla o accorciarla.",
      "Il pulsante di rientro rende una riga sotto-attività di quella sopra. La barra di un'attività madre viene calcolata.",
      "Il pulsante di dipendenza crea il legame \"non inizia prima di\"; tra le barre compare una freccia."
    ],
    tips: [
      "Per i segnaposto senza durata usa il traguardo: al posto della barra appare un rombo.",
      "La linea rossa segna oggi. Le attività non concluse con data superata hanno un bordo rosso.",
      "Giorno / settimana / mese stringono o allargano il calendario. La vista mese fa stare un piano lungo in una schermata."
    ],
    seo: {
      name: 'Diagramma di Gantt',
      title: 'Creare un diagramma di Gantt — calendario progetto | Klarsti',
      description:
        'Disponi le attività sul calendario e vedi cosa corre in parallelo e dove manca il margine. Con esempio di otto settimane.',
      keywords: 'diagramma di gantt, creare diagramma di gantt, gantt online, cronoprogramma, gantt esempio'
    },
    example: {
      title: 'Esempio: rifare un sito web',
      intro:
        'Il lavoro deve stare in otto settimane. Chi comincia quando, e quale attività aspetta quale, non è chiaro. Mettere le attività su un calendario rende visibili le collisioni.',
      blocks: [
        {
          heading: 'Attività e settimane',
          items: [
            'Inventario dei contenuti — settimana 1',
            'Design — settimane 2 e 3',
            'Redazione testi — settimane 2-5',
            'Sviluppo — settimane 4-7',
            'Caricamento contenuti — settimane 6 e 7',
            'Test e pubblicazione — settimana 8',
          ]
        },
        {
          heading: 'Domande emerse',
          items: [
            'Lo sviluppo parte in settimana 4 ma il design finisce in settimana 3: nessun margine',
            'Il caricamento aspetta i testi, che finiscono in settimana 5: molto stretto',
            'Una sola settimana per i test, quindi qualsiasi difetto sposta la pubblicazione',
            'Testi e design sono la stessa persona?',
          ]
        },
      ],
      outcome:
        'Quello che il diagramma ha prodotto non è un piano, ma i rischi del piano. Otto settimane tornano sulla carta, ma non c\'è margine da nessuna parte. Un Gantt non serve a inventare durate: serve a mostrarti dove manca il cuscinetto.'
    },
    faq: [
      {
        q: 'Che cos\'è un diagramma di Gantt?',
        a:
          'Un grafico che dispone le attività come barre orizzontali su un calendario. La lunghezza della barra è la durata, la posizione è quando avviene il lavoro. Si vede a colpo d\'occhio quali attività corrono contemporaneamente.'
      },
      {
        q: 'Come si costruisce un diagramma di Gantt?',
        a:
          'Prima ricavi le attività, poi le porti sul calendario. L\'ordine giusto è: costruisci una WBS, stima ogni voce, annota le dipendenze e solo dopo disegna. Un Gantt fatto senza scomposizione rende soltanto ordinata una lista incompleta.'
      },
      {
        q: 'Che cos\'è una dipendenza?',
        a:
          'Se un\'attività non può iniziare prima che un\'altra finisca, tra le due c\'è una dipendenza. Sul Gantt formano catene, e la catena più lunga fissa la durata reale del progetto: ogni ritardo su quella catena sposta direttamente la consegna.'
      },
      {
        q: 'Che differenza c\'è con una roadmap?',
        a:
          'Il Gantt lega le attività a giorni e settimane ed è per il team che esegue. La roadmap è più grossolana — trimestri o mesi — e comunica un\'intenzione; di solito va alla direzione o ai clienti, non al team di consegna.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per costruire un diagramma di Gantt.'
      },
    ]
  },

  roadmap: {
    title: "Roadmap",
    summary: "Una mappa che divide un argomento in tappe successive, con i temi appesi a ogni tappa. Non trascini mai i riquadri: la mappa si riordina da sola dopo ogni modifica. A differenza della struttura di scomposizione, qui si segue l’avanzamento: ogni riquadro ha uno stato e la fascia in alto dice quanto hai completato.",
    whenToUse: [
      "Per mettere un argomento in ordine di apprendimento e sapere a che punto sei.",
      "Per pianificare passo passo i primi mesi di chi entra in azienda.",
      "Per mostrare in una schermata sola le fasi che un lavoro attraversa.",
      "Per scomporre un programma di formazione in temi e allegarci i materiali."
    ],
    steps: [
      "Una cartella può contenere più roadmap. Dal menu in alto a sinistra ne apri una nuova e passi da una all’altra.",
      "Il tracciato principale va dall’inizio alla fine. Seleziona una tappa e premi Invio per aggiungerne una dopo.",
      "Con una tappa selezionata, Tab le appende un tema. Su un tema, Tab crea un sottotema e Invio uno allo stesso livello.",
      "Il cerchio all’inizio del riquadro cambia lo stato: Non iniziato → In corso → Fatto → Saltato. Il colore segue.",
      "Tasto destro su un riquadro e «Dettagli» apre il pannello laterale: nota, tempo stimato e link.",
      "Per spezzare una roadmap lunga, aggiungi un titolo di sezione dal menu contestuale (Base / Intermedio / Avanzato, per esempio).",
      "Un tema reso facoltativo viene collegato con linea tratteggiata e resta fuori dalla percentuale.",
      "Il pulsante di rotazione sulla fascia porta il tracciato da verticale a orizzontale: così una mappa lunga resta leggibile su schermi larghi."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "Nuova tappa sul tracciato" },
      { keys: ["Tab"], desc: "Tema sotto il riquadro selezionato" },
      { keys: ["F2"], desc: "Rinomina il riquadro selezionato" },
      { keys: ["Delete"], desc: "Elimina il riquadro selezionato" },
      { keys: ["Shift", "Enter"], desc: "A capo mentre scrivi" },
      { keys: ["Esc"], desc: "Chiudi il campo di testo" },
      { keys: ["Mod", "Z"], desc: "Annulla" },
      { keys: ["Mod", "Y"], desc: "Ripristina" }
    ],
    tips: [
      "I riquadri non si trascinano, la disposizione è automatica. Per cambiare l’ordine di una tappa usa i comandi del menu contestuale.",
      "I temi si alternano di lato da una tappa all’altra, così la mappa non cresce tutta da una parte.",
      "I riquadri saltati contano come finiti: un tema che hai deciso di non fare non deve bloccare la percentuale per sempre.",
      "Le ore inserite si sommano; la fascia mostra il totale che resta sui riquadri non finiti.",
      "L’indirizzo deve iniziare con http o https, altrimenti non viene accettato."
    ],
    seo: {
      name: 'Roadmap',
      title: 'Creare una roadmap di prodotto | Klarsti',
      description:
        'Dividi il periodo che arriva in tappe e scrivi anche cosa non farete. Con un esempio di sei mesi, gratis.',
      keywords: 'roadmap, roadmap prodotto, roadmap progetto, roadmap esempio, modello roadmap'
    },
    example: {
      title: 'Esempio: roadmap a sei mesi di un\'app mobile',
      intro:
        'Il team cambia direzione a ogni idea nuova e la direzione non sa cosa arriva né quando. Sei mesi vengono divisi in tre tappe grossolane. L\'obiettivo non è promettere date ma fissare l\'ordine.',
      blocks: [
        {
          heading: 'Tappa 1 — Consolidare le basi',
          items: [
            'Dimezzare il tempo di avvio',
            'Sistemare le schermate che si chiudono da sole',
            'Semplificare la registrazione',
          ]
        },
        {
          heading: 'Tappa 2 — Trattenere',
          items: [
            'Impostazioni delle notifiche',
            'Modalità offline',
            'Casella per i riscontri',
          ]
        },
        {
          heading: 'Tappa 3 — Crescere',
          items: [
            'Invita un amico',
            'Seconda lingua',
            'Base per il piano a pagamento',
          ]
        },
        {
          heading: 'Volutamente escluso',
          items: [
            'Layout per tablet',
            'Versione desktop',
            'Funzioni di IA',
          ]
        },
      ],
      outcome:
        'Il riquadro più utile della roadmap è l\'ultimo. Scrivere cosa farete non chiude la discussione; scrivere cosa non farete in questo periodo, sì.'
    },
    faq: [
      {
        q: 'Che cos\'è una roadmap di prodotto?',
        a:
          'Un piano ad alto livello che mostra dove va un prodotto o un lavoro nel periodo successivo, e in che ordine. Non è un elenco di attività: comunica intenzione e sequenza.'
      },
      {
        q: 'Una roadmap deve avere date?',
        a:
          'Le date precise di solito fanno danni: ne manchi una e se ne va la credibilità dell\'intera roadmap. I trimestri, o una struttura «ora / poi / più avanti», reggono molto meglio. Se ti serve davvero una data precisa, quella voce appartiene a un Gantt, non a una roadmap.'
      },
      {
        q: 'Ogni quanto va aggiornata?',
        a:
          'Rivederla una volta al mese va bene per quasi tutti i team. Una roadmap che cambia ogni settimana non è una roadmap; una che non cambia mai ha perso contatto con la realtà. Non conta il cambiamento, conta scrivere perché è cambiata.'
      },
      {
        q: 'Perché serve un elenco di ciò che non si farà?',
        a:
          'Perché quasi tutte le domande che una roadmap attira hanno la forma «e X?». Elencare ciò che hai lasciato fuori di proposito risponde in anticipo ed evita al team di rifare la stessa discussione ogni settimana.'
      },
      {
        q: 'È gratis?',
        a:
          'Sì. Klarsti al momento è gratuito e senza pubblicità, e non serve un account per costruire una roadmap.'
      },
    ]
  }
};

export default guides;
