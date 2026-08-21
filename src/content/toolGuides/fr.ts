import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Carte mentale',
    summary:
      'Un outil d\'association libre où les idées se ramifient depuis un seul centre. Tu ne déplaces pas les cases : la carte se réorganise après chaque ajout, pour que tu restes sur le contenu plutôt que sur la mise en page.',
    whenToUse: [
      'En remue-méninges, quand les idées doivent sortir vite et que la hiérarchie n\'est pas encore claire.',
      'Pour découper un sujet en sous-titres et en voir l\'étendue.',
      'Pour prendre des notes de réunion, de cours ou de lecture sans perdre le fil.',
      'Pour rassembler des idées brutes avant de passer à l\'organigramme des tâches.'
    ],
    steps: [
      'Un projet peut contenir plusieurs cartes. Le menu des cartes en haut à gauche sert à en créer une ou à passer de l\'une à l\'autre.',
      'Sélectionne la boîte racine au centre et renomme-la avec F2 ; le sujet va là.',
      'Tab ouvre une nouvelle branche sous la boîte sélectionnée. La nouvelle boîte est prête à la saisie.',
      'Entrée crée une branche sœur au même niveau. Cela marche aussi pendant la saisie : tu finis le texte, Entrée, la boîte suivante s\'ouvre.',
      'Clic droit sur une boîte : ajouter une description, marquer la branche comme faite, ou la replier quand elle devient chargée.',
      'La mini-carte en bas à droite montre où tu es ; fais-y glisser pour te déplacer dans les grandes cartes.'
    ],
    shortcuts: [
      { keys: ['Tab'], desc: 'Nouvelle branche sous la boîte sélectionnée' },
      { keys: ['Entrée'], desc: 'Branche sœur au même niveau' },
      { keys: ['F2'], desc: 'Renommer la boîte sélectionnée' },
      { keys: ['Suppr'], desc: 'Supprimer la branche sélectionnée (la racine reste)' },
      { keys: ['Shift', 'Entrée'], desc: 'Retour à la ligne pendant la saisie' },
      { keys: ['Échap'], desc: 'Fermer le champ de saisie' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Les boîtes ne se déplacent pas, la disposition est automatique. Pour déplacer une branche, supprime-la et recrée-la au bon endroit.',
      'La couleur d\'une branche vient de la branche principale issue de la racine : même couleur, même grand titre.',
      'Dans un champ de saisie, Suppr et F2 n\'agissent pas ; termine d\'abord par Entrée ou Échap.'
    ],
    seo: {
      name: 'Carte mentale',
      title: 'Créer une carte mentale — gratuit et sans compte | Klarsti',
      description:
        'Mets un sujet au centre et fais-le ramifier ; la mise en place est automatique. Pour rassembler des idées vite, gratuit.',
      keywords: 'carte mentale, créer une carte mentale, carte heuristique, mind map gratuit, carte mentale exemple'
    },
    example: {
      title: 'Exemple : monter un programme de formation interne',
      intro:
        'Une équipe RH doit construire le parcours d\'intégration et ne sait pas par où commencer. Avant de décider quoi que ce soit, elle vide tout ce qu\'elle a en tête sur une seule carte.',
      blocks: [
        {
          heading: 'Qui participe',
          items: [
            'Nouvelles recrues',
            'Responsables d\'équipe',
            'Personnel à distance',
            'Équipe terrain',
          ]
        },
        {
          heading: 'Ce qu\'on enseigne',
          items: [
            'Connaissance du produit',
            'Outils internes',
            'Relation client',
            'Règles de sécurité',
          ]
        },
        {
          heading: 'Comment on le livre',
          items: [
            'Atelier en présentiel',
            'Vidéo enregistrée',
            'Séance courte hebdomadaire',
            'Binôme avec un ancien',
          ]
        },
        {
          heading: 'Comment on mesure',
          items: [
            'Test court à la fin',
            'Retour du manager après trois mois',
            'Délai avant la première tâche en autonomie',
            'Taux de présence',
          ]
        },
      ],
      outcome:
        'Une fois les quatre branches posées, le manque saute aux yeux : la branche mesure est bien plus maigre que les autres. L\'équipe y revient avant d\'écrire la moindre diapositive. C\'est à ça que sert une carte mentale — montrer quel côté est vide.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'une carte mentale ?',
        a:
          'Une façon de rassembler des idées en plaçant un sujet au centre et en ramifiant vers l\'extérieur. La différence avec une liste : la liste t\'oblige à penser dans l\'ordre, la carte te laisse déposer chaque idée sur la branche à laquelle elle appartient. C\'est pour ça qu\'elle marche mieux pour démêler une pensée en vrac.'
      },
      {
        q: 'Quelle différence avec un organigramme des tâches ?',
        a:
          'La carte mentale rassemble des idées ; pas de responsable, pas de date, pas de séquence. L\'organigramme des tâches gère du travail : chaque case a un statut, une échéance et une durée. L\'ordre habituel est carte mentale d\'abord, découpage ensuite, une fois le périmètre stabilisé.'
      },
      {
        q: 'Puis-je déplacer les cases à la main ?',
        a:
          'Non, la disposition est automatique. Pour déplacer une branche, supprime-la et recrée-la au bon endroit. C\'est volontaire : le temps passé à aligner des cases est pris sur le temps de réflexion.'
      },
      {
        q: 'Combien de branches pour une carte mentale ?',
        a:
          'Pas de limite, mais au-delà de sept ou huit au même niveau, ça ne se lit plus. Quand tu y arrives, regroupe les branches proches sous une nouvelle et la carte redevient lisible.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment. Tu n\'as même pas besoin de compte pour essayer la carte mentale.'
      },
    ]
  },

  wbs: {
    title: 'Organigramme des tâches',
    summary:
      'Un arbre à trois niveaux : le PROJET en haut, les PHASES en dessous, et les LOTS DE TRAVAIL sous les phases. Chaque case porte un statut, une échéance, des heures de travail et une description. Contrairement à une carte mentale, ici tu pilotes du travail, pas des idées.',
    whenToUse: [
      'Pour découper un projet jusqu’à savoir clairement qui fait quoi.',
      'Pour figer le périmètre : ce qui n’est pas dans l’arbre n’est pas dans le projet.',
      'Pour relier le travail au calendrier et suivre l’avancement par les statuts.'
    ],
    steps: [
      'Un arbre contient une seule case projet. Pour un deuxième projet, ouvre un nouvel arbre dans le menu « Arbres » à gauche.',
      'Le bouton en bas suit la sélection : sur le projet il affiche « Ajouter une phase », sur une phase ou un lot « Ajouter un lot de travail ». Sans sélection, il ajoute une phase sous le projet.',
      'La même chose au clavier : Ctrl+clic sur une case ouvre une nouvelle case en dessous.',
      'Un clic simple ne fait que sélectionner la case. Pour ouvrir ou fermer les branches en dessous, DOUBLE-clique sur la case ; la caméra se centre dessus aussi. (Un double-clic sur le nom modifie le nom.)',
      'Clic droit sur une case : nom, échéance, heures de début et de fin, description et statut (À faire / En cours / Terminé / Échoué).',
      'Le même menu propose « Ajouter à l’agenda », qui place l’élément dans ton agenda à la date choisie. Il te prévient si la date est passée.',
      'Marque un élément comme Échoué et le menu propose « analyser la cause racine » ; un clic l’envoie dans les 5 Pourquoi comme problème.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clic'], desc: 'Sur la case projet : ajoute une phase' },
      { keys: ['Mod', 'Clic'], desc: 'Sur une phase ou un lot : ajoute un lot de travail' },
      { keys: ['Shift', 'Glisser'], desc: 'Déplacer une case avec toutes ses branches' },
      { keys: ['Delete'], desc: 'Supprimer la case sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Ce qui se trouve sous un lot de travail est encore un lot de travail ; le découpage peut descendre autant que nécessaire.',
      'Sans Shift, seule la case saisie bouge ; ce qui est en dessous reste en place.',
      'Découpe jusqu’à ce que chaque lot puisse être terminé par une seule personne.',
      'Pour effacer une date, clique sur la petite croix à côté du champ dans le menu contextuel ; les heures partent avec.'
    ],
    seo: {
      name: 'Organigramme des tâches (WBS)',
      title: 'Organigramme des tâches (WBS) — outil gratuit | Klarsti',
      description:
        'Découpe ton projet en phases et en lots de travail, avec statut, échéance et durée. Avec un exemple complet, gratuit.',
      keywords: 'organigramme des tâches, wbs, structure de découpage du projet, lot de travail, wbs exemple'
    },
    example: {
      title: 'Exemple : ouvrir un café',
      intro:
        'Six mois avant l\'ouverture. Le travail paraît énorme et il n\'y a pas d\'endroit évident par où le saisir. Découpé en trois phases, chaque phase donne des lots concrets qu\'une personne peut prendre en charge.',
      blocks: [
        {
          heading: '1. Local et autorisations',
          items: [
            'Comparer les loyers dans trois quartiers',
            'Signer le bail',
            'Autorisation d\'exploitation',
            'Agrément sanitaire',
          ]
        },
        {
          heading: '2. Aménagement',
          items: [
            'Plans des travaux',
            'Travaux',
            'Machine à café et moulin',
            'Tables, chaises, comptoir',
          ]
        },
        {
          heading: '3. Ouverture',
          items: [
            'Recruter deux baristas',
            'Carte et prix',
            'Accords fournisseurs',
            'Annonce d\'ouverture',
          ]
        },
      ],
      outcome:
        'Douze lots de travail. Le périmètre est figé : ce qui n\'est pas dans cet arbre n\'est pas dans le projet. La séquence apparaît aussi — les travaux ne peuvent pas démarrer sans l\'autorisation, ce qui fait de la première phase la phase risquée.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'un organigramme des tâches (WBS) ?',
        a:
          'Un arbre qui découpe un projet jusqu\'à ce que chaque morceau soit assez petit pour être confié à une personne. En haut le projet, en dessous les phases, puis les lots de travail. Le but n\'est pas de réduire le travail mais de rendre le périmètre visible : ce qui n\'est pas dans l\'arbre n\'est pas dans le projet.'
      },
      {
        q: 'Combien de niveaux ?',
        a:
          'Trois suffisent pour presque tout : projet, phase, lot de travail. La règle pratique est simple — si en regardant une case tu peux répondre « qui le fait et en combien de temps », arrête de découper. Sinon, descends d\'un niveau.'
      },
      {
        q: 'Quelle différence avec un diagramme de Gantt ?',
        a:
          'Le découpage répond à « qu\'y a-t-il à faire », le Gantt répond à « quand ». Le bon ordre est découpage d\'abord, calendrier ensuite. Un Gantt tracé sans découpage n\'est qu\'une liste de tâches à moitié oubliée posée sur une frise.'
      },
      {
        q: 'Quelle taille pour un lot de travail ?',
        a:
          'Une mesure courante : ce qu\'une personne termine en une à deux semaines. Plus gros, tu ne peux pas suivre l\'avancement ; plus petit, l\'arbre se remplit de bruit.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour construire un organigramme des tâches.'
      },
    ]
  },

  '5whys': {
    title: 'Analyse des 5 Pourquoi',
    summary:
      'Demander « et pourquoi cela est-il arrivé ? » encore et encore pour descendre du symptôme visible à la cause racine. Cinq n\'est pas une règle mais un repère : quand les réponses se répètent, tu as touché le fond.',
    whenToUse: [
      'Pour trouver la cause réelle d\'une défaillance au lieu de traiter le symptôme.',
      'Dans les retours d\'incident, où l\'on cherche la cause et non le coupable.',
      'Pour consigner pourquoi une tâche du WBS a échoué.'
    ],
    steps: [
      'Le menu en haut à gauche permet de passer d\'une analyse à l\'autre dans le même projet, d\'en créer, d\'en renommer ou d\'en supprimer.',
      'Commence sur l\'écran vide par « Ajouter un problème » et décris en une phrase ce qui s\'est passé. Un exemple prêt à l\'emploi existe aussi.',
      'Ctrl+clic sur une boîte ouvre un nouveau « pourquoi » en dessous. Écris-y la réponse, puis recommence sur cette boîte.',
      'Quand tu ne peux plus descendre, Shift+clic sur cette boîte crée une boîte de cause racine. Elle n\'accepte pas d\'enfant : la chaîne s\'arrête là.',
      'Le clic droit permet de modifier ou de supprimer les boîtes.',
      'Une analyse ne contient qu\'un seul problème principal. Pour en examiner un second, crée une nouvelle analyse depuis le menu en haut à gauche.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clic'], desc: 'Sur une boîte : nouveau pourquoi en dessous' },
      { keys: ['Shift', 'Clic'], desc: 'Sur une boîte : boîte de cause racine' },
      { keys: ['Suppr'], desc: 'Supprimer la boîte sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Lancer une analyse des causes depuis une tâche de l\'organigramme des tâches ouvre une analyse distincte pour cette tâche ; celle en cours n\'est pas écrasée.',
      'Une cause peut avoir plusieurs réponses ; répète le Ctrl+clic sur la même boîte pour la ramifier.',
      'Appuie chaque réponse sur quelque chose de vérifiable. « Négligence » n\'est pas une cause racine, c\'est une question sans réponse.',
      'Une tâche du WBS marquée comme échouée peut être envoyée ici comme problème depuis son propre menu contextuel.'
    ],
    seo: {
      name: 'Méthode des 5 pourquoi',
      title: 'Méthode des 5 pourquoi — trouver la cause racine | Klarsti',
      description:
        'Demande pourquoi cinq fois et passe du symptôme à la cause réelle. Expliqué pas à pas, avec un exemple concret, gratuit.',
      keywords: '5 pourquoi, méthode des 5 pourquoi, analyse cause racine, 5 why, 5 pourquoi exemple'
    },
    example: {
      title: 'Exemple : les e-mails de confirmation n\'arrivent pas',
      intro:
        'Le support reçoit la même réclamation depuis trois jours. Le premier réflexe est « changeons de prestataire e-mail ». Demander pourquoi cinq fois montre que le problème est ailleurs.',
      blocks: [
        {
          heading: 'Problème',
          items: [
            'Les clients ne reçoivent pas l\'e-mail de confirmation de commande.',
          ]
        },
        {
          heading: 'La chaîne',
          items: [
            'Pourquoi ? Les e-mails partent en spam.',
            'Pourquoi ? Notre domaine d\'envoi apparaît comme non vérifié.',
            'Pourquoi ? Un enregistrement de vérification manque dans le DNS.',
            'Pourquoi ? Il n\'a pas été recopié lors de la migration du serveur.',
            'Pourquoi ? La liste de contrôle de migration ne comporte pas cette ligne.',
          ]
        },
        {
          heading: 'Cause racine',
          items: [
            'La liste de contrôle de migration est incomplète.',
          ]
        },
        {
          heading: 'Mesures prises',
          items: [
            'Enregistrement manquant ajouté (le problème du jour est réglé).',
            'Vérification du domaine ajoutée à la liste de contrôle.',
            'La liste ne dépend plus de qui exécute la migration.',
          ]
        },
      ],
      outcome:
        'Le premier réflexe était de changer de prestataire : de l\'argent dépensé et le problème toujours là. La vraie cause était une ligne manquante dans une liste. Rendre cette différence visible, c\'est tout le travail des cinq pourquoi.'
    },
    faq: [
      {
        q: 'Qu\'est-ce que la méthode des 5 pourquoi ?',
        a:
          'Une technique pour passer du symptôme visible à la cause réelle en demandant « pourquoi » de façon répétée. Elle vient de Toyota. L\'idée est de réparer ce qui produit le symptôme plutôt que le symptôme, pour que le problème ne revienne pas.'
      },
      {
        q: 'Pourquoi exactement cinq ?',
        a:
          'Cinq est une habitude, pas une règle. En pratique la plupart des problèmes se dénouent entre la quatrième et la sixième question. Si tu trouves à la troisième, arrête. Si à la septième tu n\'as toujours rien, tu as sans doute mal défini le problème.'
      },
      {
        q: 'Comment savoir que j\'ai atteint la cause racine ?',
        a:
          'Deux signes. Le « pourquoi » suivant commence à pointer vers quelque chose hors de ton contrôle, et tu es convaincu que supprimer ce que tu as trouvé empêcherait le problème de revenir.'
      },
      {
        q: '5 pourquoi ou diagramme d\'Ishikawa ?',
        a:
          'Les 5 pourquoi suivent une seule chaîne vers le bas. L\'Ishikawa étale le même problème par catégories : main-d\'œuvre, méthode, machine, matière, mesure, milieu. Si la cause semble tenir à un endroit, prends les 5 pourquoi ; si elle est éparpillée, trace d\'abord l\'arête.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour une analyse des 5 pourquoi.'
      },
    ]
  },

  flowchart: {
    title: 'Diagrammes de flux',
    summary:
      'Dessine les étapes, les points de décision et le sens d\'un processus. Trois types de schémas existent : flux de travail, flux de processus et flux de données. Le type choisi détermine les formes de boîtes disponibles.',
    whenToUse: [
      'Schéma de flux de travail : pour montrer tâches, décisions, validations et qui les exécute.',
      'Schéma de flux de processus : pour analyser une production ou un service par les étapes d\'opération, transport, contrôle, attente et stockage.',
      'Schéma de flux de données : pour tracer les échanges de données entre entités externes, processus et magasins de données.'
    ],
    steps: [
      'Au premier lancement, le sélecteur de type apparaît. Il peut être changé ensuite ; les boîtes sont converties vers leur équivalent le plus proche.',
      'Le menu des schémas en haut à gauche permet de garder plusieurs schémas dans un même projet et de passer de l\'un à l\'autre.',
      "Passe le pointeur sur une boîte : un + apparaît sur ses quatre points de connexion. Clique sur l'un d'eux, choisis une forme, et la nouvelle boîte se place de ce côté, déjà reliée. Double-clique sur une boîte pour la renommer ; clic droit pour les autres options.",
      'Place les boîtes librement par glisser-déposer ; il n\'y a pas de disposition automatique ici, l\'agencement t\'appartient.',
      "Pour tracer une connexion, fais glisser depuis n'importe quel point d'une boîte vers n'importe quel point d'une autre : côté à côté, haut à haut, dans le sens que tu veux. Pour déplacer une extrémité, attrape le bout de la ligne et lâche-le sur un autre point. Double-clique sur une ligne pour écrire dessus (par exemple oui / non).",
      'Les contrôles en bas à gauche servent au zoom, la mini-carte en bas à droite à naviguer dans les grands schémas.'
    ],
    shortcuts: [
      { keys: ['Suppr'], desc: 'Supprimer la boîte ou la liaison sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Étiquette chaque chemin sortant d\'une décision ; le lecteur doit voir quelle condition mène où.',
      'Si un schéma ne tient plus sur un écran, découpe-le : mets la partie chargée dans une boîte de sous-processus et dessine-la à part.',
      'La boîte Rôle du flux de travail sert à montrer qui exécute une étape ; laisse-la de côté si tu décris le processus indépendamment des personnes.'
    ],
    seo: {
      name: 'Logigramme',
      title: 'Créer un logigramme — diagramme de flux gratuit | Klarsti',
      description:
        'Dessine les étapes d\'un processus, les points de décision et les embranchements. Symboles expliqués, avec un exemple.',
      keywords: 'logigramme, diagramme de flux, créer un logigramme, symboles logigramme, organigramme de processus'
    },
    example: {
      title: 'Exemple : le traitement d\'une demande de congés',
      intro:
        'Chaque personne dans l\'entreprise a une version différente de ce processus en tête. Qui valide, quand c\'est refusé, quand les RH interviennent : rien n\'est écrit. Le tracer ramène la discussion à une seule case.',
      blocks: [
        {
          heading: 'Étapes',
          items: [
            'Début : la personne dépose une demande de congés',
            'Traitement : le système calcule les jours restants',
            'Décision : reste-t-il assez de jours ?',
            'Non → demande refusée, motif consigné',
            'Oui → Traitement : la demande part au manager',
          ]
        },
        {
          heading: 'Suite',
          items: [
            'Décision : le manager valide-t-il ?',
            'Non → le motif revient à la personne, le processus s\'arrête',
            'Oui → Traitement : les RH inscrivent au calendrier',
            'Traitement : le calendrier d\'équipe se met à jour',
            'Fin : confirmation envoyée',
          ]
        },
      ],
      outcome:
        'Une fois tracé, une chose est apparue : il n\'existait aucune étape renvoyant un motif sur les demandes refusées. Tant que le processus vivait dans les têtes, personne ne le voyait. Mis en cases, le trou s\'est montré tout seul.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'un logigramme ?',
        a:
          'Un schéma qui montre les étapes traversées par un processus du début à la fin, où l\'on décide et où le chemin se sépare. Un processus qui prend cinq minutes à expliquer à l\'oral se lit en général en cinq secondes une fois dessiné.'
      },
      {
        q: 'Que signifient les symboles ?',
        a:
          'La case arrondie est un début ou une fin, le rectangle une étape, le losange une décision. D\'une décision partent toujours au moins deux flèches, généralement oui et non. C\'est cette bifurcation qui ne laisse au lecteur qu\'une seule interprétation.'
      },
      {
        q: 'Logigramme et cartographie des processus, c\'est pareil ?',
        a:
          'Proche, mais pas identique. Le logigramme montre l\'ordre des étapes. La cartographie est en général plus large : elle montre aussi qui est responsable de chaque étape et où le travail passe d\'une équipe à l\'autre.'
      },
      {
        q: 'Par où commencer ?',
        a:
          'Par la fin. Écris comment le processus se termine, puis remonte en demandant « que faut-il avant ça ». Commencer par le début produit souvent le processus idéal plutôt que le processus réel.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour tracer un logigramme.'
      },
    ]
  },

  orgchart: {
    title: 'Organigrammes',
    summary:
      'Montre qui dépend de qui et où se situe chaque entité. Sept types existent : hiérarchique, fonctionnel, divisionnel, matriciel, plat, par équipes et en réseau. Le type détermine à la fois les boîtes disponibles et le tracé des liaisons.',
    whenToUse: [
      'Pour consigner la structure existante et repérer les postes vacants comme les doublons.',
      'Pour discuter d\'une réorganisation : dessiner la même équipe dans plusieurs types et comparer.',
      'Pour rendre explicite la double hiérarchie du matriciel, ou les partenaires externes du réseau.'
    ],
    steps: [
      'Au premier lancement, tu choisis le type d\'organigramme. Il reste modifiable ; les boîtes sont converties et la disposition est conservée.',
      'Le menu en haut à gauche permet de garder plusieurs organigrammes dans un projet (par exemple structure actuelle et structure cible).',
      "Passe le pointeur sur une boîte : un + apparaît sur ses quatre points de connexion. Clique sur l'un d'eux et choisis un poste, une unité, une équipe ou un poste vacant ; la nouvelle boîte se place de ce côté. Double-clique sur une boîte pour modifier son nom et l'intitulé en dessous.",
      'Place les boîtes par glisser-déposer.',
      'Les liaisons normales partent des points haut et bas d\'une boîte : c\'est le lien hiérarchique principal.',
      'Les lignes tirées depuis les points latéraux sont en pointillés et signalent un rattachement secondaire (dans les organigrammes matriciel, hiérarchique et en réseau).'
    ],
    shortcuts: [
      { keys: ['Suppr'], desc: 'Supprimer la boîte ou la liaison sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'La boîte de poste vacant garde visibles les postes non pourvus : l\'organigramme se lit aussi comme un plan de recrutement.',
      'Utilise la deuxième ligne pour l\'intitulé : la personne ou l\'entité au-dessus, le rôle en dessous.',
      'Ne mélange pas les deux styles de trait : le trait plein dit de qui tu dépends, le pointillé avec qui tu travailles.'
    ],
    seo: {
      name: 'Organigramme',
      title: 'Créer un organigramme d\'entreprise — gratuit | Klarsti',
      description:
        'Montre sur une page qui rapporte à qui et repère les postes non couverts. Avec un exemple réel de 20 personnes.',
      keywords: 'organigramme, créer un organigramme, organigramme entreprise, organigramme en ligne, modèle organigramme'
    },
    example: {
      title: 'Exemple : une société de logiciel de 20 personnes',
      intro:
        'L\'entreprise est passée de 6 à 20 personnes en deux ans. Qui dépend de qui se sait de bouche à oreille, mais n\'est écrit nulle part — alors chaque nouvelle recrue pose les mêmes questions.',
      blocks: [
        {
          heading: 'Direction générale',
          items: [
            'Responsable produit',
            'Responsable technique',
            'Responsable commercial',
            'Responsable RH et finances',
          ]
        },
        {
          heading: 'Sous la technique',
          items: [
            'Équipe front-end (3)',
            'Équipe back-end (4)',
            'Responsable qualité',
            'Administrateur système',
          ]
        },
        {
          heading: 'Sous le produit',
          items: [
            'Design (2)',
            'Analyste produit',
          ]
        },
        {
          heading: 'Sous le commercial',
          items: [
            'Vente terrain (2)',
            'Support client (2)',
          ]
        },
      ],
      outcome:
        'Le tracer a fait ressortir une chose : la qualité repose sur une seule personne rattachée directement à la direction technique, donc personne ne la remplace pendant ses congés. C\'est là qu\'un organigramme gagne sa place : il montre les trous avec des noms.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'un organigramme ?',
        a:
          'Un schéma de la façon dont les personnes et les équipes d\'une organisation sont reliées. Il montre les liens hiérarchiques et la place de chaque unité. Pour quelqu\'un qui arrive, c\'est la carte la plus rapide de la maison.'
      },
      {
        q: 'Des noms ou des fonctions ?',
        a:
          'Les deux, idéalement : la fonction explique la structure, le nom dit à qui s\'adresser. Avec les noms seuls, l\'organigramme perd son sens dès qu\'une personne part ; avec les fonctions seules, on ne sait pas à qui demander.'
      },
      {
        q: 'Combien de personnes tiennent sur un organigramme ?',
        a:
          'Jusqu\'à une cinquantaine, ça reste lisible sur une page. Au-delà, mieux vaut montrer le niveau supérieur à part et donner à chaque unité son propre schéma. Faire tenir une grande organisation sur une page produit un organigramme que personne ne lit.'
      },
      {
        q: 'À quelle fréquence le mettre à jour ?',
        a:
          'À chaque arrivée et à chaque départ. Un organigramme périmé est pire que pas d\'organigramme, parce qu\'il envoie les gens vers la mauvaise personne en toute confiance.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour faire un organigramme.'
      },
    ]
  },

  swot: {
    title: 'Analyse SWOT',
    summary:
      'Lit une idée, un projet ou une organisation par quatre fenêtres : ce qui est bon et mauvais à l\'intérieur, quelles opportunités et menaces à l\'extérieur. Le but n\'est pas de faire quatre listes mais de les relier en stratégie.',
    whenToUse: [
      'Pour avoir une vue d\'ensemble avant de s\'engager.',
      'Avant un plan annuel ou un budget, pour situer où tu en es.',
      'Pour évaluer ta position face à un concurrent.',
      'Pour construire une image commune en équipe : tout le monde regarde les quatre mêmes cases.'
    ],
    steps: [
      'Saisis en haut le nom de l\'analyse et clique sur Créer. Un projet peut contenir plusieurs SWOT.',
      'Quatre cases apparaissent : Forces, Faiblesses, Opportunités, Menaces.',
      'Écris un point dans le champ sous une case et appuie sur Entrée, ou clique sur le plus.',
      'Clique sur un point existant pour le modifier sur place ; les changements sont enregistrés automatiquement.',
      'La corbeille du point supprime ce point, celle de l\'en-tête supprime toute l\'analyse.',
      'Pour découvrir l\'outil, charge l\'exemple depuis l\'écran affiché quand aucune analyse n\'existe.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la case le point saisi' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Forces et faiblesses sont internes, elles dépendent de toi ; opportunités et menaces sont externes. Un SWOT qui confond les deux ne sert à rien.',
      'Le vrai travail est de croiser les cases : quelle force saisit quelle opportunité, quelle faiblesse expose à quelle menace.',
      'Remplir une case de dix points et en laisser une vide n\'est pas une analyse, c\'est une prise de parti.'
    ],
    seo: {
      name: 'Analyse SWOT',
      title: 'Analyse SWOT — comment la faire, gratuit | Klarsti',
      description:
        'Confronte forces et faiblesses aux opportunités et menaces, puis croise les quatre cases. Avec un exemple rempli.',
      keywords: 'analyse swot, matrice swot, comment faire une analyse swot, swot exemple, forces faiblesses'
    },
    example: {
      title: 'Exemple : un petit cabinet comptable',
      intro:
        'Un cabinet de cinq personnes veut grandir mais ne sait pas où pousser. Remplir les quatre cases sort la discussion de l\'intuition et la pose sur des lignes concrètes.',
      blocks: [
        {
          heading: 'Forces',
          items: [
            'Des clients depuis quinze ans',
            'Presque aucune perte de clientèle',
            'Les deux associés sont experts-comptables',
            'Aucune dette',
          ]
        },
        {
          heading: 'Faiblesses',
          items: [
            'Tout repose sur les deux associés',
            'Aucun processus numérique, tout sur papier',
            'Aucune action commerciale',
            'Les nouveaux clients n\'arrivent que par recommandation',
          ]
        },
        {
          heading: 'Opportunités',
          items: [
            'La facturation électronique pousse les petites structures à chercher',
            'Beaucoup de créations d\'entreprises dans le secteur',
            'Le service à distance est désormais accepté',
            'Les logiciels comptables sont devenus abordables',
          ]
        },
        {
          heading: 'Menaces',
          items: [
            'Services de comptabilité en ligne à bas prix',
            'Un associé approche de la retraite',
            'La réglementation change souvent',
            'Difficile de recruter des jeunes',
          ]
        },
      ],
      outcome:
        'Le tableau dit quelque chose de précis : la plus grande opportunité (la facturation électronique) tombe exactement sur la plus grande faiblesse (aucun processus numérique). La décision s\'écrit toute seule — pas grandir, mais numériser d\'abord son propre travail.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'une analyse SWOT ?',
        a:
          'Une méthode qui rassemble la situation d\'une organisation ou d\'une décision dans quatre cases : forces, faiblesses, opportunités et menaces. Forces et faiblesses sont internes ; opportunités et menaces, externes. Cette séparation donne son nom à la méthode et c\'est la partie la plus souvent ratée.'
      },
      {
        q: 'Comment faire une analyse SWOT ?',
        a:
          'Écris d\'abord en une phrase ce que tu analyses : « notre entreprise » est trop large, « faut-il ouvrir la deuxième agence » ne l\'est pas. Puis remplis les quatre cases. La dernière étape compte le plus : les croiser. Quelle force saisit quelle opportunité, quelle faiblesse t\'expose à quelle menace.'
      },
      {
        q: 'Comment distinguer une force d\'une opportunité ?',
        a:
          'Un test simple : si ta propre décision peut le changer, c\'est interne ; sinon, c\'est externe. Une équipe expérimentée est une force ; un marché en croissance est une opportunité. Mélanger les cases rend l\'analyse inutilisable.'
      },
      {
        q: 'Combien d\'éléments par case ?',
        a:
          'De trois à six fonctionne bien. Quinze éléments dans une case, c\'est un inventaire, pas une analyse. Choisir les rares qui décident vraiment, c\'est ce qui fait tomber la conclusion du tableau toute seule.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour une analyse SWOT.'
      },
    ]
  },

  ishikawa: {
    title: 'Diagramme en arête de poisson',
    summary:
      'Rassemble les causes possibles d\'un problème sous six en-têtes : Main-d\'œuvre, Machine, Matière, Méthode, Mesure et Milieu. La tête du poisson est le problème, les arêtes sont des familles de causes. Le but est de balayer tous les domaines plutôt qu\'un seul.',
    whenToUse: [
      'Quand on ignore où se trouve la cause et qu\'aucun domaine ne doit être oublié.',
      'En remue-méninges d\'équipe, pour que chacun contribue depuis son domaine.',
      'Pour rassembler des causes candidates avant d\'entrer dans les 5 Pourquoi.'
    ],
    steps: [
      'Décris le problème en une phrase en haut et clique sur Démarrer.',
      'Six cases de catégorie apparaissent. Écris une cause possible dans le champ du dessous et appuie sur Entrée.',
      'L\'énoncé du problème se modifie depuis l\'en-tête, les points directement dans leurs cases.',
      'Un projet peut contenir plusieurs analyses ; chacune devient une carte avec son propre énoncé.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la catégorie la cause saisie' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Vous n\'êtes pas obligé de remplir chaque catégorie ; une catégorie vide est aussi une information.',
      'Écris ce qui s\'est passé, pas le symptôme : non pas « c\'était en retard », mais « la validation est restée trois jours ».',
      'Emmène les meilleurs candidats dans les 5 Pourquoi. Ishikawa donne la largeur, les 5 Pourquoi la profondeur.'
    ],
    seo: {
      name: 'Diagramme d\'Ishikawa',
      title: 'Diagramme d\'Ishikawa — arêtes de poisson | Klarsti',
      description:
        'Range les causes possibles par main-d\'œuvre, méthode, machine et matière, et vois par où commencer. Avec exemple, gratuit.',
      keywords: 'diagramme ishikawa, arêtes de poisson, diagramme causes effets, méthode 5m, ishikawa exemple'
    },
    example: {
      title: 'Exemple : le taux de rebut a augmenté',
      intro:
        'Dans un atelier de menuiserie, le taux de pièces défectueuses est passé de 3 % à 9 % en deux mois. Plutôt que de chercher une cause unique, tous les candidats sont alignés sous six en-têtes.',
      blocks: [
        {
          heading: 'Main-d\'œuvre',
          items: [
            'Deux menuisiers expérimentés sont partis',
            'Les nouveaux n\'ont pas été formés',
            'Aucune passation entre les équipes',
          ]
        },
        {
          heading: 'Méthode',
          items: [
            'Les cotes de coupe ne sont pas écrites',
            'La qualité n\'est contrôlée qu\'en fin de ligne',
          ]
        },
        {
          heading: 'Machine',
          items: [
            'La scie n\'a pas été révisée depuis six mois',
            'La ponceuse se dérègle',
          ]
        },
        {
          heading: 'Matière',
          items: [
            'Le fournisseur a changé',
            'L\'humidité des nouveaux panneaux n\'est pas mesurée',
          ]
        },
      ],
      outcome:
        'Une fois les arêtes remplies, deux en-têtes sont visiblement plus chargés que les autres : main-d\'œuvre et matière. L\'équipe commence par là. L\'arête ne trouve pas la cause — elle indique par où commencer à chercher.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'un diagramme d\'Ishikawa ?',
        a:
          'Un schéma qui range les causes possibles d\'un problème par catégories et les met côte à côte. On l\'appelle aussi diagramme en arêtes de poisson à cause de sa forme, ou diagramme causes-effets.'
      },
      {
        q: 'Que sont les 5M ?',
        a:
          'Les catégories classiques : main-d\'œuvre, méthode, machine, matière et milieu — souvent complétées par la mesure, ce qui donne 6M. L\'objectif n\'est pas de toutes les remplir mais de forcer le regard dans plusieurs directions au lieu de la seule qu\'on avait déjà en tête. Dans les services, ces en-têtes peuvent et doivent être adaptés.'
      },
      {
        q: 'Peut-on le combiner avec les 5 pourquoi ?',
        a:
          'Oui, et c\'est la façon la plus efficace d\'utiliser l\'un comme l\'autre. Étale les candidats avec l\'arête, choisis la branche la plus solide, puis creuse-la avec les 5 pourquoi. L\'un donne la largeur, l\'autre la profondeur.'
      },
      {
        q: 'L\'arête trouve-t-elle la cause ?',
        a:
          'Pas directement — elle produit des candidats. Quand le diagramme est fini, tu as une liste à vérifier, pas une cause démontrée. L\'étape suivante est la confrontation aux données, et c\'est là que l\'analyse de Pareto s\'emboîte bien.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour tracer un diagramme d\'Ishikawa.'
      },
    ]
  },

  pdca: {
    title: 'Roue de Deming (PDCA)',
    summary:
      'Planifier, Faire, Vérifier, Agir. Mène une amélioration non comme une tâche unique mais comme une roue qui tourne : chaque tour part du résultat du précédent.',
    whenToUse: [
      'Pour essayer un petit changement, mesurer le résultat, puis le généraliser.',
      'Pour consigner si une mesure a réellement fonctionné.',
      'Pour suivre les tours dans les équipes en amélioration continue.'
    ],
    steps: [
      'Écris en haut l\'objectif du cycle et clique sur Démarrer.',
      'Quatre cases de phase apparaissent. Ajoute tes points dans le champ sous chaque phase.',
      'Un clic sur le cercle à gauche d\'un point le marque comme terminé et le barre.',
      'Un projet peut contenir plusieurs cycles ; chaque objectif devient une carte.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la phase le point saisi' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Mets du mesurable dans la phase Vérifier. Sans chiffre derrière « est-ce mieux ? », le cycle ne se referme jamais.',
      'Ce qui sort de la phase Agir est l\'entrée du Planifier du tour suivant.',
      'N\'essaie pas de remplir les quatre cases en même temps ; avancer dans l\'ordre est la méthode elle-même.'
    ],
    seo: {
      name: 'Cycle PDCA',
      title: 'Cycle PDCA (roue de Deming) — amélioration continue | Klarsti',
      description:
        'Planifier, Dérouler, Contrôler, Agir : mène de petites expériences et mesure le résultat. Avec un cycle complet en exemple.',
      keywords: 'cycle pdca, roue de deming, amélioration continue, pdca exemple, méthode pdca'
    },
    example: {
      title: 'Exemple : réduire le délai de première réponse au support',
      intro:
        'L\'équipe support répond en 14 heures en moyenne. L\'objectif est 4. Avant de recruter, elle lance un seul cycle.',
      blocks: [
        {
          heading: 'Planifier',
          items: [
            'Objectif : première réponse moyenne sous 4 heures',
            'Hypothèse : les demandes s\'accumulent le matin et personne ne les prend',
            'Essai : une personne d\'astreinte de 9h à 11h',
            'Durée : deux semaines',
          ]
        },
        {
          heading: 'Dérouler',
          items: [
            'Rotation partagée avec l\'équipe',
            'La personne d\'astreinte ne reçoit aucun autre travail sur ces deux heures',
            'Heure de première réponse enregistrée pour chaque demande',
          ]
        },
        {
          heading: 'Contrôler',
          items: [
            'La moyenne est passée de 14 heures à 5',
            'Les demandes du matin sont tombées à 2 heures',
            'Celles du soir n\'ont pas bougé',
            'La personne d\'astreinte a pris du retard sur son propre travail',
          ]
        },
        {
          heading: 'Agir',
          items: [
            'L\'astreinte du matin devient permanente',
            'Charge réduite les jours d\'astreinte',
            'Nouveau cycle ouvert pour les heures du soir',
          ]
        },
      ],
      outcome:
        'Un seul cycle a divisé le délai par trois et a produit de lui-même la question suivante : les demandes du soir. C\'est ainsi que le PDCA est censé tourner — chaque cycle livre le sujet du suivant.'
    },
    faq: [
      {
        q: 'Qu\'est-ce que le cycle PDCA ?',
        a:
          'Une boucle en quatre étapes pour l\'amélioration continue : planifier, dérouler, contrôler, agir. Aussi appelée roue de Deming. L\'idée est d\'arrêter les grands changements d\'un coup et de faire à la place de petites expériences dont on mesure vraiment le résultat.'
      },
      {
        q: 'Quelle durée pour un cycle ?',
        a:
          'Le temps le plus court où tu peux encore mesurer le résultat. D\'une à quatre semaines convient à la plupart des travaux de bureau. Un cycle de six mois n\'est pas un cycle : les conditions auront changé quand tu regarderas et tu ne sauras pas ce qui a causé quoi.'
      },
      {
        q: 'Que mesure-t-on à l\'étape contrôler ?',
        a:
          'Ce que tu as écrit à l\'étape planifier. C\'est pourquoi l\'objectif doit être un nombre : « répondre plus vite » ne se contrôle pas, « première réponse moyenne sous 4 heures » se contrôle. Sans nombre écrit à l\'avance, contrôler devient une opinion.'
      },
      {
        q: 'Et si l\'expérience échoue ?',
        a:
          'Un cycle raté est aussi un résultat et ne se jette pas. À l\'étape agir, tu écris pourquoi l\'hypothèse n\'a pas tenu, et le cycle suivant démarre de là. Le seul vrai gaspillage en PDCA, c\'est d\'essayer autre chose sans consigner ce qui s\'est passé.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour mener un cycle PDCA.'
      },
    ]
  },

  waterfall: {
    title: 'Modèle en cascade',
    summary:
      'Découpe le projet en six phases menées dans l\'ordre : Exigences, Conception générale, Conception détaillée, Réalisation, Vérification, Maintenance. La phase suivante ne s\'ouvre qu\'une fois l\'actuelle close, et une phase close reste verrouillée.',
    whenToUse: [
      'Des travaux dont les exigences sont connues d\'avance et ne changeront pas en route.',
      'Des projets à validations et documentation, où chaque phase doit être tracée.',
      'Des travaux où l\'ordre compte : ne pas produire avant d\'avoir fini la conception.'
    ],
    steps: [
      'Écris en haut le nom du projet et clique sur Démarrer.',
      'Les six phases s\'empilent. Seule la phase ouverte accepte des points ; les suivantes portent un cadenas.',
      'Quand la phase est terminée, clique sur « terminer cette phase » sous la case.',
      'Après confirmation, la phase suivante s\'ouvre ; la phase terminée reçoit une coche et ses points ne sont plus modifiables.',
      'Un projet peut contenir plusieurs projets en cascade.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la phase le point saisi' },
      { keys: ['Mod', 'Z'], desc: 'Annuler (revient aussi sur une phase terminée)' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Aucun bouton ne rouvre une phase ; si tu l\'as terminée par erreur, seule l\'annulation ramène en arrière.',
      'Assure-toi que la phase est vraiment complète avant de la clore : la clôture verrouille aussi les textes.',
      'Si les exigences bougeront en cours de route, la cascade t\'enferme ; le WBS ou le PDCA y sont plus confortables.'
    ],
    seo: {
      name: 'Modèle en cascade',
      title: 'Modèle en cascade en gestion de projet | Klarsti',
      description:
        'Besoins, conception, développement, tests et livraison dans l\'ordre. Avec un exemple et la différence avec l\'agile.',
      keywords: 'modèle en cascade, cycle en v cascade, cascade vs agile, phases modèle en cascade, gestion de projet cascade'
    },
    example: {
      title: 'Exemple : livrer un module de reporting à une banque',
      intro:
        'Périmètre fixé par contrat, date de livraison fixée, validation écrite du client à la fin de chaque phase. Ce type de travail avance dans l\'ordre des phases.',
      blocks: [
        {
          heading: 'Besoins',
          items: [
            'Types de rapports listés',
            'Règles de droits écrites',
            'Validation du client',
          ]
        },
        {
          heading: 'Conception',
          items: [
            'Modèle de données',
            'Maquettes d\'écrans',
            'Limites de performance convenues',
          ]
        },
        {
          heading: 'Développement',
          items: [
            'Moteur de rapports',
            'Droits d\'accès',
            'Export',
          ]
        },
        {
          heading: 'Tests et livraison',
          items: [
            'Tests internes',
            'Recette client',
            'Mise en production',
            'Formation des utilisateurs',
          ]
        },
      ],
      outcome:
        'La force et la faiblesse de la cascade apparaissent ici en même temps : comme le périmètre est fixé dès le départ, l\'avancement se mesure facilement — mais un besoin qui change en cours de développement renvoie tout le plan en arrière.'
    },
    faq: [
      {
        q: 'Qu\'est-ce que le modèle en cascade ?',
        a:
          'Une méthode qui découpe un projet en phases successives et n\'en démarre pas une avant que la précédente soit terminée : besoins, conception, développement, tests, livraison. Le nom vient de l\'eau qui tombe de marche en marche.'
      },
      {
        q: 'Cascade ou agile ?',
        a:
          'Si le périmètre est connu d\'avance et ne bougera guère, la cascade coûte moins en gestion : bâtiment, travaux réglementaires et livraisons au forfait s\'y prêtent. Si le périmètre ne se précisera qu\'en chemin, la cascade revient cher et les méthodes agiles conviennent mieux.'
      },
      {
        q: 'Peut-on revenir à une phase précédente ?',
        a:
          'On peut, mais ça coûte, et le modèle n\'est pas fait pour ça. Si tu reviens souvent en arrière, c\'est le signe que le périmètre n\'a jamais été assez clair — et la vraie question devient alors si la cascade était le bon choix.'
      },
      {
        q: 'Que se passe-t-il entre les phases ?',
        a:
          'Chaque phase se termine par un livrable et une validation, et la validation doit être écrite. Toute la garantie qu\'offre la cascade repose sur le fait que les deux parties reconnaissent, au même moment, qu\'une phase est close.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour piloter un projet en cascade.'
      },
    ]
  },

  fta: {
    title: 'Analyse par arbre de défaillances (FTA)',
    summary:
      'En haut, un événement redouté ; en dessous, les conditions qui doivent se combiner pour qu\'il survienne. L\'arbre se construit avec des portes logiques ; en saisissant des probabilités sur les événements de base, celle de l\'événement sommet se calcule seule.',
    whenToUse: [
      'Pour voir quelles combinaisons de conditions peuvent produire une panne ou un accident.',
      'Pour parler du risque en chiffres : quelle branche contribue de combien au total.',
      'Pour montrer quelle branche une mesure de sécurité vient couper.'
    ],
    steps: [
      'Le menu en haut à gauche permet de passer d\'un arbre à l\'autre dans le même projet, d\'en créer, d\'en renommer ou d\'en supprimer.',
      'Crée la boîte de l\'événement sommet sur l\'écran vide, ou charge l\'exemple.',
      'Clic droit sur une boîte puis Modifier pour le nom, la description et — sur les événements de base — la probabilité.',
      'Depuis ce menu, ajoute des événements en dessous : événement, événement de base, événement non développé ou événement conditionnel.',
      'Le même menu contient les portes logiques : ET, ET prioritaire, OU, OU exclusif et porte d\'inhibition.',
      'Saisis les probabilités en pourcentage sur les événements de base ; les portes au-dessus et l\'événement sommet en découlent.',
      'Place les boîtes par glisser-déposer et sers-toi de la mini-carte en bas à droite dans un grand arbre.'
    ],
    shortcuts: [
      { keys: ['Suppr'], desc: 'Supprimer la boîte sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Une porte ET multiplie les probabilités du dessous : tout doit arriver, le résultat diminue. Une porte OU n\'en demande qu\'une, le résultat augmente.',
      'Les branches sans probabilité ne comptent pas ; le chiffre du sommet ne couvre que les données saisies.',
      'Les événements de base sont des cercles, les non développés des losanges : marquer les branches non creusées garde l\'arbre honnête.'
    ],
    seo: {
      name: 'Arbre de défaillances (AdD)',
      title: 'Arbre de défaillances (AdD/FTA) | Klarsti',
      description:
        'Place l\'événement redouté en haut et déroule avec des portes ET/OU quelles pannes doivent coïncider. Avec exemple, gratuit.',
      keywords: 'arbre de défaillances, analyse par arbre de défaillances, fta, porte et ou, arbre de défaillances exemple'
    },
    example: {
      title: 'Exemple : la chambre froide a dépassé la limite de température',
      intro:
        'Dans un entrepôt alimentaire, la température est restée deux heures au-dessus de la limite et la marchandise a dû être détruite. L\'événement redouté est écrit en haut, et l\'arbre descend par portes logiques en montrant quelles pannes ont dû coïncider.',
      blocks: [
        {
          heading: 'Événement redouté',
          items: [
            'Chambre froide au-dessus de la limite pendant deux heures',
          ]
        },
        {
          heading: 'Porte OU — une seule suffit',
          items: [
            'Le froid s\'est arrêté',
            'De la chaleur est entrée',
            'L\'alarme ne s\'est pas déclenchée et personne n\'a rien vu',
          ]
        },
        {
          heading: 'Sous « le froid s\'est arrêté » (OU)',
          items: [
            'Panne du compresseur',
            'Coupure de courant',
            'Thermostat mal réglé',
          ]
        },
        {
          heading: 'Sous « l\'alarme ne s\'est pas déclenchée » (ET)',
          items: [
            'Capteur défectueux',
            'Capteur de secours jamais installé',
            'Notifications à distance désactivées',
          ]
        },
      ],
      outcome:
        'L\'arbre montre que l\'arrêt du froid ne suffit pas à lui seul : il fallait aussi que l\'alarme tombe. La parade la moins chère n\'est donc pas un compresseur neuf, c\'est le capteur de secours. C\'est là que l\'arbre de défaillances envoie l\'argent au bon endroit.'
    },
    faq: [
      {
        q: 'Qu\'est-ce que l\'analyse par arbre de défaillances (AdD) ?',
        a:
          'Une méthode qui place un événement redouté au sommet et descend par portes logiques pour montrer quelles combinaisons de pannes le produiraient. Elle vient de l\'aéronautique et du nucléaire, et sert aujourd\'hui plus largement en analyse de sécurité et de processus.'
      },
      {
        q: 'Quelle différence entre une porte ET et une porte OU ?',
        a:
          'Sous une porte OU, n\'importe lequel des événements du dessous suffit. Sous une porte ET, il faut qu\'ils surviennent tous ensemble. Cette distinction est le cœur de la méthode : les portes ET montrent où le système se protège lui-même.'
      },
      {
        q: 'Arbre de défaillances ou 5 pourquoi ?',
        a:
          'Les 5 pourquoi remontent une seule chaîne à partir de quelque chose qui s\'est déjà produit. L\'arbre cartographie toutes les routes vers un événement qui ne s\'est pas encore produit. L\'un regarde le passé, l\'autre l\'avenir.'
      },
      {
        q: 'Jusqu\'où descendre ?',
        a:
          'Jusqu\'à des événements que tu ne peux plus découper et sur lesquels tu peux agir directement. « Capteur défectueux » est assez bas, parce qu\'on peut écrire une parade en face. « Le système ne marche pas » ne l\'est pas.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour construire un arbre de défaillances.'
      },
    ]
  },

  vsm: {
    title: 'Cartographie de la chaîne de valeur',
    summary:
      'Dessine le flux complet d\'un produit ou d\'un travail avec les attentes et les stocks intermédiaires. Le but est de voir quelle part du temps total crée réellement de la valeur — bien moins qu\'on ne le croit.',
    whenToUse: [
      'Pour trouver où un processus attend et où le travail s\'accumule.',
      'Pour voir quelle étape ne suit pas la demande client : quelque chose dépasse-t-il le temps takt ?',
      'Pour dessiner l\'état actuel et placer à côté un état futur à comparer.',
    ],
    steps: [
      'Saisis la demande quotidienne et les équipes dans le panneau en haut à droite. Le temps takt en découle : à quelle cadence une pièce doit sortir.',
      'Sur un canevas vide, crée le squelette de départ ou pars de zéro. Un clic droit sur le canevas ajoute n\'importe quelle boîte.',
      'Écris le temps de cycle avec son unité dans la boîte de processus. S\'il dépasse le temps takt, la boîte devient rouge : le goulot est là.',
      'Écris le nombre de pièces en attente dans la boîte de stock ; le temps d\'attente est déduit par pièces ÷ demande quotidienne. Sans comptage, saisis le temps directement.',
      'Relie les boîtes. Un clic droit sur une liaison la bascule en poussé, tiré, FIFO, information manuelle ou électronique. Seules les flèches matière entrent dans le calcul.',
      'Depuis le menu en haut à gauche, copie l\'état actuel en état futur, travaille dessus et compare les chiffres du bas.',
    ],
    shortcuts: [
      { keys: ['Suppr'], desc: 'Supprimer la boîte sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'L\'efficacité du flux en bas est le temps à valeur ajoutée rapporté au délai total. Un chiffre à une décimale est normal ; ce qu\'il faut raccourcir, c\'est l\'attente, pas le travail.',
      'Si tu laisses les stocks hors de la carte, le temps total paraît meilleur qu\'il ne l\'est — c\'est là que se cache l\'information.',
      'Les boîtes non reliées à la chaîne sont exclues des totaux et signalées en bas. Relie le flux en une seule ligne.',
      'Place l\'éclair kaizen là où tu comptes améliorer ; c\'est ainsi qu\'on lit une carte d\'état futur.',
    ],
    seo: {
      name: 'Cartographie de la chaîne de valeur (VSM)',
      title: 'Cartographie de la chaîne de valeur (VSM) | Klarsti',
      description:
        'Compare le temps de traitement et l\'attente à chaque étape et vois où le temps se perd. Avec exemple chiffré, gratuit.',
      keywords: 'cartographie chaîne de valeur, vsm, value stream mapping, lean management, vsm exemple'
    },
    example: {
      title: 'Exemple : de la commande reçue à la marchandise expédiée',
      intro:
        'Un fabricant mesure le temps entre l\'arrivée d\'une commande et le chargement dans le camion. Le temps de traitement réel de chaque étape est noté séparément de l\'attente entre les étapes. L\'écart change tout le tableau.',
      blocks: [
        {
          heading: 'Étapes et temps de traitement',
          items: [
            'Saisie de la commande — 10 minutes',
            'Contrôle de solvabilité — 15 minutes',
            'Entrée au plan de production — 30 minutes',
            'Production — 4 heures',
            'Contrôle qualité — 20 minutes',
            'Emballage et expédition — 40 minutes',
          ]
        },
        {
          heading: 'Attente entre les étapes',
          items: [
            'Après la saisie — 1 jour',
            'Après le contrôle de solvabilité — 2 jours',
            'Après l\'entrée au plan — 3 jours',
            'Après la production — 1 jour',
            'Après la qualité — 2 jours',
          ]
        },
      ],
      outcome:
        'Le temps de traitement fait environ 6 heures ; le délai total, 9 jours. Autrement dit, 99 % du temps est de l\'attente. La plus longue attente, ce sont les trois jours après l\'entrée au plan. La réponse ne laisse pas de doute : accélérer la production ne sert à rien, le problème est la file.'
    },
    faq: [
      {
        q: 'Qu\'est-ce que la cartographie de la chaîne de valeur (VSM) ?',
        a:
          'Une carte de toutes les étapes traversées par un produit ou une demande, avec la durée de chaque étape et l\'attente entre elles. Elle vient de la production au plus juste. Son but n\'est pas d\'aller plus vite mais de montrer où le temps part réellement.'
      },
      {
        q: 'Qu\'est-ce qui crée de la valeur et qu\'est-ce qui n\'en crée pas ?',
        a:
          'Tout ce que le client paierait volontiers crée de la valeur : les étapes qui transforment vraiment le produit. Attendre, déplacer, recontrôler, non. Dans la plupart des processus, plus de 90 % du délai total ne crée pas de valeur.'
      },
      {
        q: 'Quelle différence avec un logigramme ?',
        a:
          'Le logigramme montre l\'ordre des étapes et les points de décision, sans durées. Dans la cartographie de la chaîne de valeur, la durée est tout : temps de traitement et temps d\'attente sont notés séparément à chaque étape puis comparés.'
      },
      {
        q: 'Par où commencer ?',
        a:
          'Par cartographier l\'état actuel exactement tel qu\'il est. L\'erreur la plus fréquente est de dessiner le processus tel qu\'il devrait fonctionner. Si la carte ne montre pas la réalité, on améliore un processus qui n\'existe pas. Il faut mesurer les durées réelles sur le terrain.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour cartographier une chaîne de valeur.'
      },
    ]
  },

  pareto: {
    title: 'Analyse de Pareto',
    summary:
      'L\'essentiel de l\'effet vient de quelques causes. Trie les catégories par fréquence décroissante et superpose la courbe des pourcentages cumulés, pour faire apparaître les quelques postes à l\'origine de la plus grande part du problème.',
    whenToUse: [
      'Pour décider par laquelle commencer parmi de nombreuses réclamations, défauts ou postes de coût.',
      'Pour montrer où une amélioration rapportera le plus.',
      'Pour défendre une concentration des moyens sur quelques points plutôt qu\'une dispersion.'
    ],
    steps: [
      'Crée l\'analyse au premier lancement. La liste du haut sert à passer d\'une analyse à l\'autre, le crayon à renommer, la corbeille à supprimer.',
      'Dans le tableau du panneau de gauche, saisis le nom de la catégorie et sa fréquence.',
      'Pour une nouvelle ligne, utilise le bouton d\'ajout sous le tableau.',
      'Le graphique se met à jour aussitôt : les barres se trient du plus grand au plus petit et la courbe montre le cumul.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'À la place de la fréquence, tu peux saisir un coût ou un temps perdu, du moment que toutes les lignes utilisent la même unité.',
      'Arrête-toi là où la courbe s\'aplatit : la longue traîne de droite ne vaut pas l\'effort.',
      'Des catégories trop fines et plus rien ne ressort, le graphique s\'aplatit. Regroupe ce qui se ressemble.'
    ],
    seo: {
      name: 'Diagramme de Pareto',
      title: 'Diagramme de Pareto et loi des 80/20 | Klarsti',
      description:
        'Classe les causes par fréquence et repère les quelques-unes qui produisent l\'essentiel du problème. Avec exemple, gratuit.',
      keywords: 'diagramme de pareto, analyse de pareto, loi 80 20, principe de pareto, pareto exemple'
    },
    example: {
      title: 'Exemple : d\'où viennent les réclamations clients',
      intro:
        'Une boutique en ligne a reçu 480 réclamations en trois mois. L\'équipe discutait d\'une solution différente pour chaque type. Les compter et les trier du plus grand au plus petit change la conversation.',
      blocks: [
        {
          heading: 'Type de réclamation et nombre',
          items: [
            'Livraison en retard — 196',
            'Article différent de la description — 121',
            'Retour trop lent — 62',
            'Article abîmé — 48',
            'Mauvais article — 29',
            'Autres — 24',
          ]
        },
        {
          heading: 'Part cumulée',
          items: [
            'Livraison en retard — 41 %',
            '+ Description — 66 %',
            '+ Retours — 79 %',
            '+ Casse — 89 %',
            'Les trois restantes — 100 %',
          ]
        },
      ],
      outcome:
        'Les deux premières font les deux tiers du total. Plutôt que de courir après six problèmes à la fois, corriger les délais de livraison et les descriptions supprime 66 % du mécontentement. Rendre cet ordre visible, c\'est tout le travail de l\'analyse de Pareto.'
    },
    faq: [
      {
        q: 'Qu\'est-ce que l\'analyse de Pareto ?',
        a:
          'Une méthode qui trie les problèmes par fréquence décroissante et montre lesquels, en petit nombre, font l\'essentiel du total. Elle repose sur une observation simple : environ 80 % des effets viennent d\'environ 20 % des causes.'
      },
      {
        q: 'La loi des 80/20 est-elle toujours vraie ?',
        a:
          'Pas exactement, et ce n\'est pas nécessaire. Parfois ça donne 70/30, parfois 90/10. Ce qui compte n\'est pas la proportion mais que la répartition soit déséquilibrée : si quelques postes portent l\'essentiel, l\'analyse de Pareto sert.'
      },
      {
        q: 'Trier par nombre ou par coût ?',
        a:
          'Selon ce dont dépend ta décision. Le nombre montre quel problème arrive le plus souvent ; le coût, lequel fait le plus mal. Les deux divergent souvent : un problème rare mais coûteux se retrouve en bas d\'une liste triée par nombre.'
      },
      {
        q: 'Combien de catégories ?',
        a:
          'De cinq à dix se lit le mieux. Une analyse à trente catégories reste une liste et ne donne aucun cap. Choisir peu de catégories réellement distinctes, c\'est la moitié du travail.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour faire une analyse de Pareto.'
      },
    ]
  },

  histogram: {
    title: 'Histogramme',
    summary:
      'Montre la distribution d\'une mesure : où les valeurs se regroupent, si la dispersion est symétrique, s\'il y a des valeurs aux extrêmes. Tu fournis les mesures brutes, l\'outil forme les classes et, avec des limites de spécification, calcule aussi la capabilité.',
    whenToUse: [
      'Pour voir ce que la moyenne cache : une même moyenne peut venir de distributions très différentes.',
      'Pour juger de la régularité d\'un procédé — une dispersion étroite est régulière, une large est erratique.',
      'Pour voir à quelle fréquence les mesures sortent des spécifications et si le procédé répond au besoin.',
    ],
    steps: [
      'Crée l\'analyse ; la liste en haut permet de passer d\'une analyse à l\'autre dans le même projet.',
      'Saisis les mesures dans le champ de gauche, ou colle une liste telle quelle. Une valeur par ligne ; virgule ou point pour les décimales.',
      'L\'outil choisit lui-même le nombre de classes (règle de Sturges). Tu peux imposer ton propre nombre.',
      'Saisis les limites inférieure et supérieure. Elles apparaissent en pointillés rouges et les colonnes hors limites deviennent rouges.',
      'En bas figurent l\'effectif, la moyenne, l\'écart-type et l\'étendue ; avec les deux limites, aussi Cp et Cpk.',
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'La courbe grise est une loi normale de même moyenne et même écart-type. Un écart net des colonnes signale une cause spéciale.',
      'Une distribution à deux pics indique généralement que deux procédés (deux équipes, deux machines) ont été mélangés.',
      'Un Cpk de 1,33 ou plus est généralement jugé capable ; sous 1, le procédé ne tient pas les limites.',
      'Bon Cp mais mauvais Cpk : la dispersion est serrée mais la moyenne a dérivé — un réglage suffit.',
    ],
    seo: {
      name: 'Histogramme',
      title: 'Créer un histogramme — voir la distribution | Klarsti',
      description:
        'Répartis tes mesures en classes et découvre ce que la moyenne cache. Explique ce que signifient deux pics. Gratuit.',
      keywords: 'histogramme, créer un histogramme, histogramme en ligne, distribution des fréquences, histogramme exemple'
    },
    example: {
      title: 'Exemple : les délais de livraison',
      intro:
        'Le délai moyen de livraison est annoncé à 3 jours et paraît correct. Les réclamations continuent pourtant. Regrouper les délais un à un révèle ce que la moyenne cachait.',
      blocks: [
        {
          heading: 'Répartition des délais (500 commandes)',
          items: [
            '1 jour — 140 commandes',
            '2 jours — 165 commandes',
            '3 jours — 95 commandes',
            '4 jours — 30 commandes',
            '5 jours — 12 commandes',
            '6 jours et plus — 58 commandes',
          ]
        },
        {
          heading: 'Comment le lire',
          items: [
            '60 % arrivent en deux jours',
            'Un groupe petit mais net se tient à six jours et plus',
            'La forme a deux sommets, pas un',
            'Trois jours — la moyenne — est l\'un des résultats les plus rares',
          ]
        },
      ],
      outcome:
        'La moyenne dit trois jours, mais il existe en réalité deux expériences client différentes : la plupart reçoivent en deux jours, une partie attend une semaine. Une distribution à deux sommets veut toujours dire la même chose : ce n\'est pas un processus, ce sont deux. La question suivante est de quelle région ou de quel entrepôt viennent ces 58 commandes.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'un histogramme ?',
        a:
          'Un graphique qui découpe les mesures en intervalles et montre combien tombent dans chacun. Il rend visible ce que la moyenne cache : la façon dont les valeurs se répartissent.'
      },
      {
        q: 'Quelle différence avec un diagramme en barres ?',
        a:
          'Le diagramme en barres montre des catégories que l\'on peut réordonner — villes, produits. L\'histogramme a un axe numérique, l\'ordre est fixe et les barres se touchent. C\'est le type de données qui décide de celui dont tu as besoin.'
      },
      {
        q: 'Combien d\'intervalles utiliser ?',
        a:
          'Un point de départ courant est environ la racine carrée du nombre de mesures : une dizaine pour 100 valeurs. Trop peu d\'intervalles effacent la forme ; trop nombreux transforment le bruit en structure apparente. Essaie deux ou trois valeurs et garde celle où la forme reste stable.'
      },
      {
        q: 'Que signifie un histogramme à deux sommets ?',
        a:
          'Presque toujours que les données ne viennent pas d\'un seul processus : deux équipes, deux machines, deux régions. Devant cette forme, la première chose à faire est de séparer les données et de regarder chaque partie à part.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour construire un histogramme.'
      },
    ]
  },

  decision: {
    title: 'Matrice de décision',
    summary:
      'Note plusieurs options selon les mêmes critères. Chaque critère porte un poids ; le total d\'une option est la somme des produits note × poids.',
    whenToUse: [
      'Quand tu es bloqué entre quelques options et que la discussion tourne en rond.',
      'Quand la justification d\'une décision doit rester écrite.',
      'Quand chacun, dans l\'équipe, pèse en silence un critère différent : la matrice les fait sortir.'
    ],
    steps: [
      'Ajoute les critères : les rubriques sur lesquelles tu compares (coût, délai, risque...).',
      'Donne à chaque critère un poids de 1 à 5, selon son importance pour toi.',
      'Ajoute les options : les alternatives à comparer.',
      'Dans le tableau, notez chaque option sur chaque critère de 0 à 10.',
      'Les totaux se calculent seuls et l\'option la mieux notée reçoit un trophée.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Fixez les poids avant de commencer à noter. Les retoucher ensuite, ce n\'est pas décider, c\'est fabriquer la réponse voulue.',
      'La matrice ne décide pas à ta place ; elle rend visible ce sur quoi tu as décidé.',
      'Si deux totaux sont très proches, la réponse n\'est pas « à égalité » mais « ces critères ne les séparent pas » : cherche le critère manquant.'
    ],
    seo: {
      name: 'Matrice de décision',
      title: 'Matrice de décision — notation pondérée | Klarsti',
      description:
        'Note les options selon des critères pondérés et rends visible ce sur quoi repose vraiment la décision. Avec exemple, gratuit.',
      keywords: 'matrice de décision, notation pondérée, aide à la décision, matrice de décision exemple, comparer des options'
    },
    example: {
      title: 'Exemple : quel entrepôt louer ?',
      intro:
        'Trois candidats, et chacun a son favori. La discussion tourne au « moi je pense ». Pondérer les critères et noter chaque option sur dix la ramène à des chiffres.',
      blocks: [
        {
          heading: 'Critères et poids',
          items: [
            'Coût mensuel — poids 5',
            'Proximité des clients — poids 4',
            'Marge d\'agrandissement — poids 3',
            'Accès route et port — poids 3',
            'Difficulté du déménagement — poids 1',
          ]
        },
        {
          heading: 'Notes (1-10)',
          items: [
            'Entrepôt A : 8 / 4 / 6 / 5 / 7',
            'Entrepôt B : 5 / 9 / 4 / 8 / 5',
            'Entrepôt C : 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Total pondéré',
          items: [
            'Entrepôt A — 100',
            'Entrepôt B — 114',
            'Entrepôt C — 114',
          ]
        },
      ],
      outcome:
        'A est éliminé. B et C sont à égalité, donc la matrice n\'a pas tranché — mais elle a ramené la discussion de cinq critères à un seul. Il ne reste qu\'une question : la proximité pèse-t-elle plus que la marge d\'agrandissement ? C\'est souvent le vrai bénéfice d\'une matrice de décision : elle ne choisit pas, elle resserre.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'une matrice de décision ?',
        a:
          'Un tableau qui note plusieurs options sur les mêmes critères et multiplie chaque note par l\'importance du critère. Son but n\'est pas d\'automatiser la décision mais de rendre visibles les hypothèses sur lesquelles elle repose.'
      },
      {
        q: 'Comment fixer les poids ?',
        a:
          'Avant de noter, et sans regarder les options. Dans l\'autre sens, on ajuste discrètement les poids jusqu\'à ce que son option préférée gagne. Écrire les poids d\'abord et les verrouiller est la seule chose qui donne de la valeur à la matrice.'
      },
      {
        q: 'Et si le résultat n\'est pas l\'option que je voulais ?',
        a:
          'C\'est le moment le plus utile de la matrice. Deux possibilités : soit tu as mal pondéré un critère, soit un critère manque au tableau. Les deux se corrigent en écrivant ce qui manque, pas en retouchant les chiffres.'
      },
      {
        q: 'Combien de critères ?',
        a:
          'De quatre à sept fonctionne bien. En dessous de trois, tu aurais pu trancher à l\'instinct ; au-dessus de sept, les poids se rapprochent et les totaux finissent collés sans signification.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour bâtir une matrice de décision.'
      },
    ]
  },

  notepad: {
    title: 'Agenda',
    summary:
      'Un espace personnel où tu choisis des jours dans le calendrier et les planifies. Contrairement aux autres outils, l\'agenda n\'est pas une donnée de projet : les entrées t\'appartiennent et ne partent chez personne quand tu partages un projet.',
    whenToUse: [
      'Pour organiser la journée et placer le travail dans les heures.',
      'Pour amener une tâche du WBS sur un jour précis.',
      'Pour écrire avec tes mots comment la journée s\'est passée, au moment de la clore.'
    ],
    steps: [
      'Les jours contenant des entrées sont marqués dans le calendrier ; un clic ouvre le déroulé de ce jour.',
      'Pour une nouvelle entrée, écris le titre et le texte. Donne-lui une plage horaire ou laisse-la sur toute la journée.',
      'Si la plage saisie chevauche une autre entrée, un avertissement de conflit s\'affiche.',
      'Tu peux régler un rappel : à l\'heure, 5 / 15 / 30 minutes, 1 heure ou 1 jour avant. Les rappels arrivent en notification dans l\'application mobile.',
      'Dans la section de bilan de journée, en haut, tu écris avec tes mots comment cela s\'est passé ; pas besoin d\'enregistrer à part.',
      'On ne peut pas ajouter d\'entrée à un jour passé. Les entrées existantes restent modifiables, ou se ramènent avec « déplacer à aujourd\'hui ».'
    ],
    tips: [
      'Clic droit sur une tâche du WBS puis « Ajouter à l\'agenda » : elle atterrit ici avec sa propre date.',
      'Annuler et rétablir ne fonctionnent pas dans l\'agenda ; elle ne garde pas d\'historique.',
      'La liste sous le calendrier montre tes prochaines entrées ; commence par là si tu ne sais pas quel jour ouvrir.'
    ],
    seo: {
      name: 'Agenda quotidien',
      title: 'Agenda quotidien avec bilan de journée | Klarsti',
      description:
        'Écris ta journée le matin et repasse dessus le soir. Ton agenda reste privé et n\'est pas inclus quand tu partages un projet.',
      keywords: 'agenda quotidien, bilan de journée, planificateur quotidien, liste de tâches, agenda en ligne'
    },
    example: {
      title: 'Exemple : un mardi chargé',
      intro:
        'Trois réunions, une échéance et tout le reste coincé entre les deux. Cinq minutes le matin pour écrire la journée évitent la soirée passée à se disputer avec soi-même sur ce qui a été fait.',
      blocks: [
        {
          heading: 'Aujourd\'hui sans faute',
          items: [
            'Terminer la présentation client (avant la réunion de 14h)',
            'Envoyer les validations de factures',
            'Ouvrir les accès de la nouvelle recrue',
          ]
        },
        {
          heading: 'Bien si ça passe',
          items: [
            'Lire le rapport de la semaine dernière',
            'Appeler le fournisseur',
            'Ranger le bureau',
          ]
        },
        {
          heading: 'Bilan de la journée',
          items: [
            'Présentation finie — mais à 13h50, trop juste',
            'Validations de factures oubliées — demain en premier',
            'Deux heures sans interruption l\'après-midi',
            'Demain je regroupe les réunions après le déjeuner',
          ]
        },
      ],
      outcome:
        'La valeur n\'est pas dans la liste mais dans le bilan. Après une semaine, la même ligne revient : le travail se fait coincer entre les réunions. On ne peut pas corriger ça avant de l\'avoir remarqué.'
    },
    faq: [
      {
        q: 'À quoi sert l\'agenda quotidien ?',
        a:
          'À écrire la journée au début et à la reprendre à la fin. Il a deux moitiés : le plan et le bilan. Sans la seconde, ça devient une liste de tâches ; la valeur est de remarquer que la même erreur se répète.'
      },
      {
        q: 'Quelqu\'un d\'autre peut-il voir mon agenda ?',
        a:
          'Non. L\'agenda et le bilan sont personnels. Ils ne sont pas rangés dans tes projets mais dans ton propre enregistrement : partager un projet avec ton équipe ne partage pas ton agenda.'
      },
      {
        q: 'Combien d\'éléments écrire ?',
        a:
          'Pas plus de trois dans la liste des indispensables. Les listes plus longues finissent chaque jour à moitié et au bout d\'un moment on ne les regarde plus. Le reste va dans le second groupe : bien si ça passe, et la journée n\'est pas ratée sinon.'
      },
      {
        q: 'Qu\'écrire dans le bilan de la journée ?',
        a:
          'Pas ce que tu as fait, mais ce que tu as remarqué. « Présentation terminée » ne transmet rien ; « la présentation est passée au ras parce que la réunion du matin a débordé » te servira la semaine prochaine.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment.'
      },
    ]
  },
  gantt: {
    title: "Diagramme de Gantt",
    summary: "Un outil de planification qui pose le travail en barres horizontales sur un calendrier. Ce qui commence quand, combien de temps ça dure et ce qui attend quoi — sur un seul écran.",
    whenToUse: [
      "Pour rattacher le travail à des dates et fixer les départs.",
      "Pour montrer l'ordre des tâches et celles qui s'attendent.",
      "Pour repérer tôt le retard."
    ],
    steps: [
      "Un projet peut contenir plusieurs diagrammes. Le menu en haut à gauche sert à en créer et à passer de l'un à l'autre.",
      "Ajoute des lignes avec \"Ajouter une tâche\". Double-clique sur le nom pour le changer.",
      "Sélectionner une ligne ouvre la barre de détail en bas : début, fin, avancement et état.",
      "Fais glisser une barre pour décaler les dates ; tire un bord pour allonger ou raccourcir.",
      "Le bouton d'indentation transforme une ligne en sous-tâche de celle du dessus. La barre d'une tâche parente est calculée.",
      "Le bouton de dépendance pose un lien \"ne commence pas avant\" ; une flèche relie les deux barres."
    ],
    tips: [
      "Pour un repère sans durée, passe la tâche en jalon : elle devient un losange.",
      "La ligne rouge marque aujourd'hui. Une tâche non terminée dont la fin est passée est encadrée en rouge.",
      "Jour / semaine / mois resserrent ou étalent le calendrier. La vue mois fait tenir un long plan sur un écran."
    ],
    seo: {
      name: 'Diagramme de Gantt',
      title: 'Créer un diagramme de Gantt — planning projet | Klarsti',
      description:
        'Pose les tâches sur le calendrier et vois ce qui se chevauche et où la marge manque. Avec un exemple sur huit semaines.',
      keywords: 'diagramme de gantt, créer un diagramme de gantt, planning projet, gantt en ligne, gantt exemple'
    },
    example: {
      title: 'Exemple : refonte d\'un site web',
      intro:
        'Le travail doit tenir en huit semaines. Qui démarre quand, et quelle tâche attend laquelle, n\'est pas clair. Poser les tâches sur un calendrier rend les collisions visibles.',
      blocks: [
        {
          heading: 'Tâches et semaines',
          items: [
            'Inventaire des contenus — semaine 1',
            'Design — semaines 2 et 3',
            'Rédaction — semaines 2 à 5',
            'Développement — semaines 4 à 7',
            'Intégration des contenus — semaines 6 et 7',
            'Tests et mise en ligne — semaine 8',
          ]
        },
        {
          heading: 'Questions soulevées',
          items: [
            'Le développement commence semaine 4 alors que le design finit semaine 3 : aucune marge',
            'L\'intégration attend la rédaction, qui finit semaine 5 : très serré',
            'Une seule semaine de tests, donc le moindre défaut décale la mise en ligne',
            'La rédaction et le design, c\'est la même personne ?',
          ]
        },
      ],
      outcome:
        'Ce que le diagramme a produit n\'est pas un plan mais les risques du plan. Huit semaines tiennent sur le papier, mais il n\'y a de marge nulle part. Un Gantt ne sert pas à inventer des durées : il montre où le matelas manque.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'un diagramme de Gantt ?',
        a:
          'Un graphique qui pose les tâches en barres horizontales sur un calendrier. La longueur de la barre est la durée, sa position le moment. On voit d\'un coup d\'œil quelles tâches tournent en même temps.'
      },
      {
        q: 'Comment faire un diagramme de Gantt ?',
        a:
          'D\'abord sortir les tâches, ensuite les poser sur le calendrier. Le bon ordre : construire un organigramme des tâches, estimer chaque élément, noter les dépendances, puis tracer. Un Gantt tracé sans découpage se contente de rendre présentable une liste incomplète.'
      },
      {
        q: 'Qu\'est-ce qu\'une dépendance ?',
        a:
          'Si une tâche ne peut pas démarrer avant qu\'une autre soit finie, il y a une dépendance. Sur le Gantt elles forment des chaînes, et la plus longue fixe la durée réelle du projet : chaque retard sur cette chaîne décale directement la livraison.'
      },
      {
        q: 'Quelle différence avec une feuille de route ?',
        a:
          'Le Gantt relie les tâches à des jours et des semaines et sert à l\'équipe qui exécute. La feuille de route est plus grossière — trimestres ou mois — et communique une intention ; elle part plutôt vers la direction ou les clients.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour faire un diagramme de Gantt.'
      },
    ]
  },

  roadmap: {
    title: "Feuille de route",
    summary: "Une carte qui découpe un sujet en étapes successives, avec des thèmes accrochés à chacune. Tu ne déplaces jamais les cases : la carte se réorganise après chaque changement. À la différence de l’organigramme des tâches, elle suit l’avancement : chaque case a un statut et le bandeau du haut indique la part déjà faite.",
    whenToUse: [
      "Pour ordonner un sujet dans un ordre d’apprentissage et savoir où tu en es.",
      "Pour planifier étape par étape les premiers mois d’un nouvel arrivant.",
      "Pour montrer sur un seul écran les phases que traverse un travail.",
      "Pour découper un programme de formation en thèmes et y accrocher les ressources."
    ],
    steps: [
      "Un dossier peut contenir plusieurs feuilles de route. Le menu en haut à gauche sert à en créer une et à passer de l’une à l’autre.",
      "Le tracé principal va du début à la fin. Sélectionne une étape et appuie sur Entrée pour en ajouter une après.",
      "Sur une étape sélectionnée, Tab accroche un thème. Sur un thème, Tab crée un sous-thème et Entrée un thème voisin.",
      "Le cercle au début d’une case change son statut : Pas commencé → En cours → Terminé → Ignoré. La couleur suit.",
      "Clic droit sur une case puis « Détails » ouvre le panneau latéral : note, durée estimée et liens.",
      "Pour aérer une longue feuille de route, ajoute un titre de section depuis le menu contextuel (Débutant / Intermédiaire / Avancé, par exemple).",
      "Un thème rendu facultatif est relié en pointillés et sort du pourcentage d’avancement.",
      "Le bouton de rotation du bandeau bascule le tracé de la verticale à l’horizontale ; c’est ainsi qu’une longue carte reste lisible sur un écran large."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "Nouvelle étape sur le tracé" },
      { keys: ["Tab"], desc: "Thème sous la case sélectionnée" },
      { keys: ["F2"], desc: "Renommer la case sélectionnée" },
      { keys: ["Delete"], desc: "Supprimer la case sélectionnée" },
      { keys: ["Shift", "Enter"], desc: "Aller à la ligne en écrivant" },
      { keys: ["Esc"], desc: "Fermer le champ de saisie" },
      { keys: ["Mod", "Z"], desc: "Annuler" },
      { keys: ["Mod", "Y"], desc: "Rétablir" }
    ],
    tips: [
      "Les cases ne se déplacent pas à la main, la disposition est automatique. Pour changer l’ordre d’une étape, utilise les commandes du menu contextuel.",
      "Les thèmes changent de côté d’une étape à l’autre, pour que la carte ne penche pas d’un seul côté.",
      "Les cases ignorées comptent comme terminées : un thème écarté volontairement ne doit pas bloquer le pourcentage.",
      "Les heures saisies s’additionnent ; le bandeau affiche le total restant sur les cases non terminées.",
      "Une adresse doit commencer par http ou https, sinon elle est refusée."
    ],
    seo: {
      name: 'Feuille de route',
      title: 'Créer une feuille de route produit | Klarsti',
      description:
        'Découpe la période à venir en étapes et écris aussi ce que vous ne ferez pas. Avec un exemple sur six mois, gratuit.',
      keywords: 'feuille de route, roadmap produit, feuille de route projet, roadmap exemple, modèle feuille de route'
    },
    example: {
      title: 'Exemple : feuille de route à six mois d\'une application mobile',
      intro:
        'L\'équipe change de cap à chaque nouvelle idée et la direction ne sait pas ce qui arrive ni quand. Six mois sont découpés en trois étapes grossières. Le but n\'est pas de promettre des dates mais de fixer l\'ordre.',
      blocks: [
        {
          heading: 'Étape 1 — Consolider les bases',
          items: [
            'Diviser par deux le temps de démarrage',
            'Réparer les écrans qui plantent',
            'Simplifier l\'inscription',
          ]
        },
        {
          heading: 'Étape 2 — Retenir',
          items: [
            'Réglages de notifications',
            'Mode hors ligne',
            'Boîte à retours',
          ]
        },
        {
          heading: 'Étape 3 — Croître',
          items: [
            'Inviter un ami',
            'Deuxième langue',
            'Socle de l\'offre payante',
          ]
        },
        {
          heading: 'Volontairement écarté',
          items: [
            'Mise en page tablette',
            'Version bureau',
            'Fonctions d\'IA',
          ]
        },
      ],
      outcome:
        'La case la plus utile de la feuille de route est la dernière. Écrire ce que vous allez faire ne clôt pas la discussion ; écrire ce que vous ne ferez pas sur la période, si.'
    },
    faq: [
      {
        q: 'Qu\'est-ce qu\'une feuille de route produit ?',
        a:
          'Un plan de haut niveau qui montre où va un produit ou un chantier sur la période à venir, et dans quel ordre. Ce n\'est pas une liste de tâches : elle communique une intention et une séquence.'
      },
      {
        q: 'Faut-il mettre des dates ?',
        a:
          'Les dates précises font souvent des dégâts : une date manquée et la crédibilité de toute la feuille de route part avec. Les trimestres, ou une structure « maintenant / ensuite / plus tard », tiennent bien mieux. Si tu as vraiment besoin d\'une date précise, cet élément relève d\'un Gantt, pas d\'une feuille de route.'
      },
      {
        q: 'À quelle fréquence la mettre à jour ?',
        a:
          'La revoir une fois par mois convient à la plupart des équipes. Une feuille de route qui change chaque semaine n\'en est pas une ; une qui ne change jamais a perdu le contact avec le réel. Ce qui compte n\'est pas le changement mais d\'écrire pourquoi.'
      },
      {
        q: 'Pourquoi une liste de ce qu\'on ne fera pas ?',
        a:
          'Parce que presque toutes les questions posées à une feuille de route prennent la forme « et X, alors ? ». Lister ce que tu as volontairement laissé de côté y répond d\'avance et évite à l\'équipe de refaire la même discussion chaque semaine.'
      },
      {
        q: 'Est-ce gratuit ?',
        a:
          'Oui. Klarsti est gratuit et sans publicité pour le moment, et aucun compte n\'est nécessaire pour construire une feuille de route.'
      },
    ]
  }
};

export default guides;
