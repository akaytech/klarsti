import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Carte mentale',
    summary:
      'Un outil d\'association libre où les idées se ramifient depuis un seul centre. Vous ne déplacez pas les boîtes : la carte se réorganise après chaque ajout, pour que vous restiez sur le contenu plutôt que sur la mise en page.',
    whenToUse: [
      'En remue-méninges, quand les idées doivent sortir vite et que la hiérarchie n\'est pas encore claire.',
      'Pour découper un sujet en sous-titres et en voir l\'étendue.',
      'Pour prendre des notes de réunion, de cours ou de lecture sans perdre le fil.',
      'Pour rassembler des idées brutes avant de passer à l\'organigramme des tâches.'
    ],
    steps: [
      'Un projet peut contenir plusieurs cartes. Le menu des cartes en haut à gauche sert à en créer une ou à passer de l\'une à l\'autre.',
      'Sélectionnez la boîte racine au centre et renommez-la avec F2 ; le sujet va là.',
      'Tab ouvre une nouvelle branche sous la boîte sélectionnée. La nouvelle boîte est prête à la saisie.',
      'Entrée crée une branche sœur au même niveau. Cela marche aussi pendant la saisie : vous finissez le texte, Entrée, la boîte suivante s\'ouvre.',
      'Clic droit sur une boîte : ajouter une description, marquer la branche comme faite, ou la replier quand elle devient chargée.',
      'La mini-carte en bas à droite montre où vous êtes ; faites-y glisser pour vous déplacer dans les grandes cartes.'
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
      'Les boîtes ne se déplacent pas, la disposition est automatique. Pour déplacer une branche, supprimez-la et recréez-la au bon endroit.',
      'La couleur d\'une branche vient de la branche principale issue de la racine : même couleur, même grand titre.',
      'Dans un champ de saisie, Suppr et F2 n\'agissent pas ; terminez d\'abord par Entrée ou Échap.'
    ]
  },

  wbs: {
    title: 'Organigramme des tâches (OTP)',
    summary:
      'Un arbre à trois niveaux : le PROJET en haut, les PHASES en dessous, et les LOTS DE TRAVAIL sous les phases. Chaque case porte un statut, une échéance, des heures de travail et une description. Contrairement à une carte mentale, ici vous pilotez du travail, pas des idées.',
    whenToUse: [
      'Pour découper un projet jusqu’à savoir clairement qui fait quoi.',
      'Pour figer le périmètre : ce qui n’est pas dans l’arbre n’est pas dans le projet.',
      'Pour relier le travail au calendrier et suivre l’avancement par les statuts.'
    ],
    steps: [
      'Un arbre contient une seule case projet. Pour un deuxième projet, ouvrez un nouvel arbre dans le menu « Arbres » à gauche.',
      'Le bouton en bas suit la sélection : sur le projet il affiche « Ajouter une phase », sur une phase ou un lot « Ajouter un lot de travail ». Sans sélection, il ajoute une phase sous le projet.',
      'La même chose au clavier : Ctrl+clic sur une case ouvre une nouvelle case en dessous.',
      'Un clic simple sélectionne la case, ouvre ou ferme les branches en dessous et centre la caméra dessus.',
      'Clic droit sur une case : nom, échéance, heures de début et de fin, description et statut (À faire / En cours / Terminé / Échoué).',
      'Le même menu propose « Ajouter à l’agenda », qui place l’élément dans votre agenda à la date choisie. Il vous prévient si la date est passée.',
      'Marquez un élément comme Échoué et le menu propose « analyser la cause racine » ; un clic l’envoie dans les 5 Pourquoi comme problème.'
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
      'Découpez jusqu’à ce que chaque lot puisse être terminé par une seule personne.',
      'Pour effacer une date, cliquez sur la petite croix à côté du champ dans le menu contextuel ; les heures partent avec.'
    ]
  },

  '5whys': {
    title: '5 Pourquoi',
    summary:
      'Demander « et pourquoi cela est-il arrivé ? » encore et encore pour descendre du symptôme visible à la cause racine. Cinq n\'est pas une règle mais un repère : quand les réponses se répètent, vous avez touché le fond.',
    whenToUse: [
      'Pour trouver la cause réelle d\'une défaillance au lieu de traiter le symptôme.',
      'Dans les retours d\'incident, où l\'on cherche la cause et non le coupable.',
      'Pour consigner pourquoi une tâche du WBS a échoué.'
    ],
    steps: [
      'Le menu en haut à gauche permet de passer d\'une analyse à l\'autre dans le même projet, d\'en créer, d\'en renommer ou d\'en supprimer.',
      'Commencez sur l\'écran vide par « Ajouter un problème » et décrivez en une phrase ce qui s\'est passé. Un exemple prêt à l\'emploi existe aussi.',
      'Ctrl+clic sur une boîte ouvre un nouveau « pourquoi » en dessous. Écrivez-y la réponse, puis recommencez sur cette boîte.',
      'Quand vous ne pouvez plus descendre, Shift+clic sur cette boîte crée une boîte de cause racine. Elle n\'accepte pas d\'enfant : la chaîne s\'arrête là.',
      'Le clic droit permet de modifier ou de supprimer les boîtes.',
      'Ctrl+clic dans le vide démarre une seconde chaîne de problème, indépendante, sur le même canevas.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clic'], desc: 'Sur une boîte : nouveau pourquoi en dessous' },
      { keys: ['Shift', 'Clic'], desc: 'Sur une boîte : boîte de cause racine' },
      { keys: ['Mod', 'Clic'], desc: 'Dans le vide : nouveau problème' },
      { keys: ['Suppr'], desc: 'Supprimer la boîte sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Lancer une analyse des causes depuis une tâche de l\'organigramme des tâches ouvre une analyse distincte pour cette tâche ; celle en cours n\'est pas écrasée.',
      'Une cause peut avoir plusieurs réponses ; répétez le Ctrl+clic sur la même boîte pour la ramifier.',
      'Appuyez chaque réponse sur quelque chose de vérifiable. « Négligence » n\'est pas une cause racine, c\'est une question sans réponse.',
      'Une tâche du WBS marquée comme échouée peut être envoyée ici comme problème depuis son propre menu contextuel.'
    ]
  },

  flowchart: {
    title: 'Logigrammes',
    summary:
      'Dessinez les étapes, les points de décision et le sens d\'un processus. Trois types de schémas existent : flux de travail, flux de processus et flux de données. Le type choisi détermine les formes de boîtes disponibles.',
    whenToUse: [
      'Schéma de flux de travail : pour montrer tâches, décisions, validations et qui les exécute.',
      'Schéma de flux de processus : pour analyser une production ou un service par les étapes d\'opération, transport, contrôle, attente et stockage.',
      'Schéma de flux de données : pour tracer les échanges de données entre entités externes, processus et magasins de données.'
    ],
    steps: [
      'Au premier lancement, le sélecteur de type apparaît. Il peut être changé ensuite ; les boîtes sont converties vers leur équivalent le plus proche.',
      'Le menu des schémas en haut à gauche permet de garder plusieurs schémas dans un même projet et de passer de l\'un à l\'autre.',
      'Clic droit sur une boîte : en ajoutant une boîte en dessous, vous choisissez aussi sa forme (début, traitement, décision, document, fin...). Le même menu sert à modifier le texte ou à supprimer.',
      'Placez les boîtes librement par glisser-déposer ; il n\'y a pas de disposition automatique ici, l\'agencement vous appartient.',
      'Pour tracer une liaison, glissez depuis un point de connexion au bord d\'une boîte vers une autre.',
      'Les contrôles en bas à gauche servent au zoom, la mini-carte en bas à droite à naviguer dans les grands schémas.'
    ],
    shortcuts: [
      { keys: ['Suppr'], desc: 'Supprimer la boîte ou la liaison sélectionnée' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Étiquetez chaque chemin sortant d\'une décision ; le lecteur doit voir quelle condition mène où.',
      'Si un schéma ne tient plus sur un écran, découpez-le : mettez la partie chargée dans une boîte de sous-processus et dessinez-la à part.',
      'La boîte Rôle du flux de travail sert à montrer qui exécute une étape ; laissez-la de côté si vous décrivez le processus indépendamment des personnes.'
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
      'Au premier lancement, vous choisissez le type d\'organigramme. Il reste modifiable ; les boîtes sont converties et la disposition est conservée.',
      'Le menu en haut à gauche permet de garder plusieurs organigrammes dans un projet (par exemple structure actuelle et structure cible).',
      'Clic droit sur une boîte pour ajouter en dessous un poste, une entité, une équipe ou un poste vacant. Le même menu modifie le nom et l\'intitulé en dessous.',
      'Placez les boîtes par glisser-déposer.',
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
      'Utilisez la deuxième ligne pour l\'intitulé : la personne ou l\'entité au-dessus, le rôle en dessous.',
      'Ne mélangez pas les deux styles de trait : le trait plein dit de qui vous dépendez, le pointillé avec qui vous travaillez.'
    ]
  },

  swot: {
    title: 'Analyse SWOT',
    summary:
      'Lit une idée, un projet ou une organisation par quatre fenêtres : ce qui est bon et mauvais à l\'intérieur, quelles opportunités et menaces à l\'extérieur. Le but n\'est pas de faire quatre listes mais de les relier en stratégie.',
    whenToUse: [
      'Pour avoir une vue d\'ensemble avant de s\'engager.',
      'Avant un plan annuel ou un budget, pour situer où vous en êtes.',
      'Pour évaluer votre position face à un concurrent.',
      'Pour construire une image commune en équipe : tout le monde regarde les quatre mêmes cases.'
    ],
    steps: [
      'Saisissez en haut le nom de l\'analyse et cliquez sur Créer. Un projet peut contenir plusieurs SWOT.',
      'Quatre cases apparaissent : Forces, Faiblesses, Opportunités, Menaces.',
      'Écrivez un point dans le champ sous une case et appuyez sur Entrée, ou cliquez sur le plus.',
      'Cliquez sur un point existant pour le modifier sur place ; les changements sont enregistrés automatiquement.',
      'La corbeille du point supprime ce point, celle de l\'en-tête supprime toute l\'analyse.',
      'Pour découvrir l\'outil, chargez l\'exemple depuis l\'écran affiché quand aucune analyse n\'existe.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la case le point saisi' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Forces et faiblesses sont internes, elles dépendent de vous ; opportunités et menaces sont externes. Un SWOT qui confond les deux ne sert à rien.',
      'Le vrai travail est de croiser les cases : quelle force saisit quelle opportunité, quelle faiblesse expose à quelle menace.',
      'Remplir une case de dix points et en laisser une vide n\'est pas une analyse, c\'est une prise de parti.'
    ]
  },

  ishikawa: {
    title: 'Ishikawa (arête de poisson)',
    summary:
      'Rassemble les causes possibles d\'un problème sous six en-têtes : Main-d\'œuvre, Machine, Matière, Méthode, Mesure et Milieu. La tête du poisson est le problème, les arêtes sont des familles de causes. Le but est de balayer tous les domaines plutôt qu\'un seul.',
    whenToUse: [
      'Quand on ignore où se trouve la cause et qu\'aucun domaine ne doit être oublié.',
      'En remue-méninges d\'équipe, pour que chacun contribue depuis son domaine.',
      'Pour rassembler des causes candidates avant d\'entrer dans les 5 Pourquoi.'
    ],
    steps: [
      'Décrivez le problème en une phrase en haut et cliquez sur Démarrer.',
      'Six cases de catégorie apparaissent. Écrivez une cause possible dans le champ du dessous et appuyez sur Entrée.',
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
      'Écrivez ce qui s\'est passé, pas le symptôme : non pas « c\'était en retard », mais « la validation est restée trois jours ».',
      'Emmenez les meilleurs candidats dans les 5 Pourquoi. Ishikawa donne la largeur, les 5 Pourquoi la profondeur.'
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
      'Écrivez en haut l\'objectif du cycle et cliquez sur Démarrer.',
      'Quatre cases de phase apparaissent. Ajoutez vos points dans le champ sous chaque phase.',
      'Un clic sur le cercle à gauche d\'un point le marque comme terminé et le barre.',
      'Un projet peut contenir plusieurs cycles ; chaque objectif devient une carte.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la phase le point saisi' },
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Mettez du mesurable dans la phase Vérifier. Sans chiffre derrière « est-ce mieux ? », le cycle ne se referme jamais.',
      'Ce qui sort de la phase Agir est l\'entrée du Planifier du tour suivant.',
      'N\'essayez pas de remplir les quatre cases en même temps ; avancer dans l\'ordre est la méthode elle-même.'
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
      'Écrivez en haut le nom du projet et cliquez sur Démarrer.',
      'Les six phases s\'empilent. Seule la phase ouverte accepte des points ; les suivantes portent un cadenas.',
      'Quand la phase est terminée, cliquez sur « terminer cette phase » sous la case.',
      'Après confirmation, la phase suivante s\'ouvre ; la phase terminée reçoit une coche et ses points ne sont plus modifiables.',
      'Un projet peut contenir plusieurs projets en cascade.'
    ],
    shortcuts: [
      { keys: ['Entrée'], desc: 'Ajouter à la phase le point saisi' },
      { keys: ['Mod', 'Z'], desc: 'Annuler (revient aussi sur une phase terminée)' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Aucun bouton ne rouvre une phase ; si vous l\'avez terminée par erreur, seule l\'annulation ramène en arrière.',
      'Assurez-vous que la phase est vraiment complète avant de la clore : la clôture verrouille aussi les textes.',
      'Si les exigences bougeront en cours de route, la cascade vous enferme ; le WBS ou le PDCA y sont plus confortables.'
    ]
  },

  fta: {
    title: 'Arbre de défaillances (FTA)',
    summary:
      'En haut, un événement redouté ; en dessous, les conditions qui doivent se combiner pour qu\'il survienne. L\'arbre se construit avec des portes logiques ; en saisissant des probabilités sur les événements de base, celle de l\'événement sommet se calcule seule.',
    whenToUse: [
      'Pour voir quelles combinaisons de conditions peuvent produire une panne ou un accident.',
      'Pour parler du risque en chiffres : quelle branche contribue de combien au total.',
      'Pour montrer quelle branche une mesure de sécurité vient couper.'
    ],
    steps: [
      'Le menu en haut à gauche permet de passer d\'un arbre à l\'autre dans le même projet, d\'en créer, d\'en renommer ou d\'en supprimer.',
      'Créez la boîte de l\'événement sommet sur l\'écran vide, ou chargez l\'exemple.',
      'Clic droit sur une boîte puis Modifier pour le nom, la description et — sur les événements de base — la probabilité.',
      'Depuis ce menu, ajoutez des événements en dessous : événement, événement de base, événement non développé ou événement conditionnel.',
      'Le même menu contient les portes logiques : ET, ET prioritaire, OU, OU exclusif et porte d\'inhibition.',
      'Saisissez les probabilités en pourcentage sur les événements de base ; les portes au-dessus et l\'événement sommet en découlent.',
      'Placez les boîtes par glisser-déposer et servez-vous de la mini-carte en bas à droite dans un grand arbre.'
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
    ]
  },

  vsm: {
    title: 'Cartographie de la Chaîne de Valeur (VSM)',
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
      'Créez l\'analyse au premier lancement. La liste du haut sert à passer d\'une analyse à l\'autre, le crayon à renommer, la corbeille à supprimer.',
      'Dans le tableau du panneau de gauche, saisissez le nom de la catégorie et sa fréquence.',
      'Pour une nouvelle ligne, utilisez le bouton d\'ajout sous le tableau.',
      'Le graphique se met à jour aussitôt : les barres se trient du plus grand au plus petit et la courbe montre le cumul.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'À la place de la fréquence, vous pouvez saisir un coût ou un temps perdu, du moment que toutes les lignes utilisent la même unité.',
      'Arrêtez-vous là où la courbe s\'aplatit : la longue traîne de droite ne vaut pas l\'effort.',
      'Des catégories trop fines et plus rien ne ressort, le graphique s\'aplatit. Regroupez ce qui se ressemble.'
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
    ]
  },

  decision: {
    title: 'Matrice de décision',
    summary:
      'Note plusieurs options selon les mêmes critères. Chaque critère porte un poids ; le total d\'une option est la somme des produits note × poids.',
    whenToUse: [
      'Quand vous êtes bloqué entre quelques options et que la discussion tourne en rond.',
      'Quand la justification d\'une décision doit rester écrite.',
      'Quand chacun, dans l\'équipe, pèse en silence un critère différent : la matrice les fait sortir.'
    ],
    steps: [
      'Ajoutez les critères : les rubriques sur lesquelles vous comparez (coût, délai, risque...).',
      'Donnez à chaque critère un poids de 1 à 5, selon son importance pour vous.',
      'Ajoutez les options : les alternatives à comparer.',
      'Dans le tableau, notez chaque option sur chaque critère de 0 à 10.',
      'Les totaux se calculent seuls et l\'option la mieux notée reçoit un trophée.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Annuler' },
      { keys: ['Mod', 'Y'], desc: 'Rétablir' }
    ],
    tips: [
      'Fixez les poids avant de commencer à noter. Les retoucher ensuite, ce n\'est pas décider, c\'est fabriquer la réponse voulue.',
      'La matrice ne décide pas à votre place ; elle rend visible ce sur quoi vous avez décidé.',
      'Si deux totaux sont très proches, la réponse n\'est pas « à égalité » mais « ces critères ne les séparent pas » : cherchez le critère manquant.'
    ]
  },

  notepad: {
    title: 'Agenda',
    summary:
      'Un espace personnel où vous choisissez des jours dans le calendrier et les planifiez. Contrairement aux autres outils, l\'agenda n\'est pas une donnée de projet : les entrées vous appartiennent et ne partent chez personne quand vous partagez un projet.',
    whenToUse: [
      'Pour organiser la journée et placer le travail dans les heures.',
      'Pour amener une tâche du WBS sur un jour précis.',
      'Pour écrire avec vos mots comment la journée s\'est passée, au moment de la clore.'
    ],
    steps: [
      'Les jours contenant des entrées sont marqués dans le calendrier ; un clic ouvre le déroulé de ce jour.',
      'Pour une nouvelle entrée, écrivez le titre et le texte. Donnez-lui une plage horaire ou laissez-la sur toute la journée.',
      'Si la plage saisie chevauche une autre entrée, un avertissement de conflit s\'affiche.',
      'Vous pouvez régler un rappel : à l\'heure, 5 / 15 / 30 minutes, 1 heure ou 1 jour avant. Les rappels arrivent en notification dans l\'application mobile.',
      'Dans la section de bilan de journée, en haut, vous écrivez avec vos mots comment cela s\'est passé ; pas besoin d\'enregistrer à part.',
      'On ne peut pas ajouter d\'entrée à un jour passé. Les entrées existantes restent modifiables, ou se ramènent avec « déplacer à aujourd\'hui ».'
    ],
    tips: [
      'Clic droit sur une tâche du WBS puis « Ajouter à l\'agenda » : elle atterrit ici avec sa propre date.',
      'Annuler et rétablir ne fonctionnent pas dans l\'agenda ; elle ne garde pas d\'historique.',
      'La liste sous le calendrier montre vos prochaines entrées ; commencez par là si vous ne savez pas quel jour ouvrir.'
    ]
  }
};

export default guides;
