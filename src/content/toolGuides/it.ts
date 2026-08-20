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
      "Clic destro su un riquadro: quando ne aggiungi uno sotto scegli anche la sua forma (inizio, processo, decisione, documento, fine...). Lo stesso menu modifica il testo o elimina il riquadro.",
      "Trascina i riquadri dove vuoi: qui non c'è disposizione automatica, la sistemazione è tua.",
      "Per tracciare un collegamento, trascina da un punto di connessione sul bordo di un riquadro verso un altro riquadro.",
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
      "Clic destro su un riquadro per aggiungere sotto di esso una posizione, un'unità, un team o una posizione vacante. Lo stesso menu modifica il nome e il titolo sottostante.",
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
    ]
  },

  ishikawa: {
    title: "Diagramma a Lisca di Pesce",
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
    ]
  }
};

export default guides;
