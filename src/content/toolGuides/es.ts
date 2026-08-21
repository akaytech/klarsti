import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Mapa mental',
    summary:
      'Una herramienta de asociación libre donde las ideas se ramifican desde un único centro. Las cajas no las mueves tú: el mapa se reordena solo tras cada añadido, para que te concentres en el contenido y no en la disposición.',
    whenToUse: [
      'En una lluvia de ideas, cuando quieres sacarlas rápido y la jerarquía aún no está clara.',
      'Para descomponer un tema en subtítulos y ver su alcance.',
      'Para tomar notas de una reunión, una clase o un libro sin perder el hilo.',
      'Para reunir ideas en bruto antes de pasar a la estructura de desglose del trabajo.'
    ],
    steps: [
      'Un proyecto puede contener varios mapas. Usa el menú de mapas de arriba a la izquierda para crear uno nuevo o cambiar entre ellos.',
      'Selecciona la caja raíz del centro y renómbrala con F2; ahí va el tema.',
      'Tab abre una rama nueva bajo la caja seleccionada. La caja nueva queda lista para escribir.',
      'Enter crea una rama hermana en el mismo nivel. También funciona mientras escribes: terminas el texto, pulsas Enter y se abre la siguiente caja.',
      'Haz clic derecho en una caja para añadir una descripción, marcar la rama como hecha o plegarla cuando se llene.',
      'El minimapa de abajo a la derecha muestra dónde estás; arrastra sobre él para moverte en mapas grandes.'
    ],
    shortcuts: [
      { keys: ['Tab'], desc: 'Rama nueva bajo la caja seleccionada' },
      { keys: ['Enter'], desc: 'Rama hermana en el mismo nivel' },
      { keys: ['F2'], desc: 'Renombrar la caja seleccionada' },
      { keys: ['Delete'], desc: 'Borrar la rama seleccionada (la raíz no se borra)' },
      { keys: ['Shift', 'Enter'], desc: 'Salto de línea mientras escribes' },
      { keys: ['Esc'], desc: 'Cerrar el campo de texto' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Las cajas no se arrastran, la disposición es automática. Si quieres mover una rama, bórrala y créala en el sitio correcto.',
      'El color de cada rama viene de la rama principal que sale de la raíz: mismo color significa mismo encabezado.',
      'Dentro de un campo de texto, Delete y F2 no actúan; termina antes con Enter o Esc.'
    ],
    seo: {
      name: 'Mapa mental',
      title: 'Crear un mapa mental — gratis y sin registro | Klarsti',
      description:
        'Pon un tema en el centro y ramifícalo; del orden se encarga el programa. Para reunir ideas rápido, gratis.',
      keywords: 'mapa mental, crear mapa mental, mapa mental online, mind map gratis, mapa mental ejemplo'
    },
    example: {
      title: 'Ejemplo: preparar un plan de formación interna',
      intro:
        'Un equipo de RR. HH. tiene que montar la formación de bienvenida y no sabe por dónde empezar. Antes de decidir nada, vuelca todo lo que tiene en la cabeza en un solo mapa.',
      blocks: [
        {
          heading: 'Quién asiste',
          items: [
            'Nuevas incorporaciones',
            'Responsables de equipo',
            'Personal en remoto',
            'Equipo de campo',
          ]
        },
        {
          heading: 'Qué enseñamos',
          items: [
            'Conocimiento del producto',
            'Sistemas internos',
            'Trato con el cliente',
            'Normas de seguridad',
          ]
        },
        {
          heading: 'Cómo lo damos',
          items: [
            'Taller presencial',
            'Vídeo grabado',
            'Sesión corta semanal',
            'Acompañamiento de un veterano',
          ]
        },
        {
          heading: 'Cómo lo medimos',
          items: [
            'Prueba corta al final',
            'Opinión del responsable a los tres meses',
            'Tiempo hasta la primera tarea en solitario',
            'Asistencia',
          ]
        },
      ],
      outcome:
        'Con las cuatro ramas puestas, la carencia salta a la vista: la de medición está mucho más floja que las demás. El equipo vuelve ahí antes de escribir una sola diapositiva. Para eso sirve un mapa mental: para enseñarte qué lado está vacío.'
    },
    faq: [
      {
        q: '¿Qué es un mapa mental?',
        a:
          'Una forma de reunir ideas colocando un tema en el centro y ramificando hacia fuera. La diferencia con una lista es que la lista te obliga a pensar en orden, mientras que el mapa te deja soltar cada idea en la rama a la que pertenece. Por eso funciona mejor para ordenar un pensamiento disperso.'
      },
      {
        q: '¿Qué diferencia hay entre un mapa mental y una EDT?',
        a:
          'El mapa mental recoge ideas; no hay responsables, fechas ni secuencia. La estructura de desglose del trabajo gestiona trabajo: cada caja tiene estado, fecha límite y duración. El orden habitual es mapa mental primero y EDT cuando el alcance ya está claro.'
      },
      {
        q: '¿Puedo mover las cajas a mano?',
        a:
          'No, la disposición es automática. Para mover una rama, bórrala y créala en el sitio correcto. Es deliberado: el tiempo que se va en alinear cajas se le quita a pensar.'
      },
      {
        q: '¿Cuántas ramas debe tener un mapa mental?',
        a:
          'No hay límite, pero más de siete u ocho en el mismo nivel deja de leerse. Cuando llegues ahí, agrupa las ramas parecidas bajo una nueva y el mapa vuelve a ser legible.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo. Ni siquiera necesitas cuenta para probar el mapa mental.'
      },
    ]
  },

  wbs: {
    title: 'EDT (WBS)',
    summary:
      'Un árbol de tres niveles: arriba el PROYECTO, debajo las FASES y bajo ellas los PAQUETES DE TRABAJO. Cada cuadro lleva estado, fecha de fin, horas de trabajo y descripción. A diferencia de un mapa mental, aquí gestionas trabajo, no ideas.',
    whenToUse: [
      'Para desglosar un proyecto hasta que quede claro quién hace qué.',
      'Para fijar el alcance: lo que no está en el árbol no está en el proyecto.',
      'Para atar el trabajo al calendario y seguir el avance con los estados.'
    ],
    steps: [
      'Un árbol tiene un solo cuadro de proyecto. Para un segundo proyecto, abre un árbol nuevo en el menú "Árboles" de la izquierda.',
      'El botón de abajo cambia según la selección: con el proyecto seleccionado dice "Añadir fase"; con una fase o un paquete, "Añadir paquete de trabajo". Sin selección, añade una fase bajo el proyecto.',
      'Lo mismo con el teclado: Ctrl+clic en un cuadro abre uno nuevo debajo.',
      'Un clic normal solo selecciona el cuadro. Para abrir o cerrar las ramas de abajo, haz DOBLE clic en el cuadro; la cámara también se centra en él. (Doble clic en el nombre edita el nombre.)',
      'Clic derecho en un cuadro: nombre, fecha de fin, hora de inicio y fin, descripción y estado (Por hacer / En curso / Hecho / Fallido).',
      'En ese mismo menú, "Añadir a la agenda" lleva el elemento a tu agenda en la fecha elegida. Avisa si la fecha ya pasó.',
      'Si marcas algo como Fallido, el menú ofrece "analizar la causa raíz"; con un clic pasa a los 5 Porqués como problema.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clic'], desc: 'En el cuadro del proyecto: añade una fase' },
      { keys: ['Mod', 'Clic'], desc: 'En una fase o paquete: añade un paquete de trabajo' },
      { keys: ['Shift', 'Arrastrar'], desc: 'Mover un cuadro con todas sus ramas' },
      { keys: ['Delete'], desc: 'Eliminar el cuadro seleccionado' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Lo que va bajo un paquete de trabajo también es un paquete de trabajo; el desglose puede bajar cuanto haga falta.',
      'Si arrastras sin Shift, solo se mueve el cuadro que agarras; lo de abajo se queda.',
      'Sigue desglosando hasta que cada paquete lo pueda terminar una sola persona.',
      'Para borrar una fecha, usa la crucecita junto al campo de fecha en el menú del clic derecho; las horas se borran con ella.'
    ],
    seo: {
      name: 'Estructura de desglose del trabajo (EDT)',
      title: 'Estructura de desglose del trabajo (EDT/WBS) | Klarsti',
      description:
        'Divide el proyecto en fases y paquetes de trabajo, con estado, fecha y duración en cada uno. Con ejemplo resuelto, gratis.',
      keywords: 'estructura de desglose del trabajo, edt proyecto, wbs, edt ejemplo, desglose de tareas'
    },
    example: {
      title: 'Ejemplo: abrir una cafetería',
      intro:
        'Seis meses hasta la apertura. El trabajo parece enorme y no hay un sitio evidente por donde agarrarlo. Partido en tres fases, cada fase da paquetes concretos que una persona puede asumir.',
      blocks: [
        {
          heading: '1. Local y permisos',
          items: [
            'Buscar alquileres en tres barrios',
            'Firmar el contrato',
            'Licencia de actividad',
            'Permiso sanitario',
          ]
        },
        {
          heading: '2. Acondicionamiento',
          items: [
            'Proyecto de reforma',
            'Obra',
            'Máquina de café y molino',
            'Mesas, sillas, barra',
          ]
        },
        {
          heading: '3. Apertura',
          items: [
            'Contratar dos baristas',
            'Carta y precios',
            'Acuerdos con proveedores',
            'Anuncio de apertura',
          ]
        },
      ],
      outcome:
        'Doce paquetes de trabajo. El alcance queda fijado: lo que no está en este árbol no está en el proyecto. También se ve la secuencia — la obra no puede empezar sin la licencia, y eso convierte la primera fase en la arriesgada.'
    },
    faq: [
      {
        q: '¿Qué es una estructura de desglose del trabajo (EDT)?',
        a:
          'Un árbol que divide el proyecto hasta que cada pieza es lo bastante pequeña para dársela a una persona. Arriba el proyecto, debajo las fases y debajo los paquetes de trabajo. Su fin no es reducir el trabajo sino hacer visible el alcance: lo que no está en el árbol no está en el proyecto.'
      },
      {
        q: '¿Cuántos niveles debe tener una EDT?',
        a:
          'Tres bastan para casi todo: proyecto, fase, paquete de trabajo. La regla práctica es sencilla: si mirando una caja puedes responder «quién lo hace y cuánto tarda», deja de dividir. Si no puedes, baja un nivel.'
      },
      {
        q: '¿En qué se diferencia de un diagrama de Gantt?',
        a:
          'La EDT responde a «qué hay que hacer»; el Gantt responde a «cuándo». El orden correcto es desglose primero, calendario después. Un Gantt dibujado sin desglose es una lista de tareas a medias puesta sobre una línea de tiempo.'
      },
      {
        q: '¿Qué tamaño debe tener un paquete de trabajo?',
        a:
          'Una medida habitual es lo que una persona termina en una o dos semanas. Más grande y no puedes seguir el avance; más pequeño y el árbol se llena de ruido.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para montar una EDT.'
      },
    ]
  },

  '5whys': {
    title: 'Análisis de los 5 Porqués',
    summary:
      'Preguntar "¿y por qué pasó eso?" una y otra vez para bajar del síntoma visible a la causa raíz. Cinco no es una regla sino una medida: cuando tus respuestas empiezan a repetirse, has llegado al fondo.',
    whenToUse: [
      'Para encontrar la causa real de un fallo en vez de tratar el síntoma.',
      'En revisiones posteriores a un incidente, donde importa la causa y no el culpable.',
      'Para dejar registro de por qué falló una tarea de la EDT.'
    ],
    steps: [
      'Con el menú superior izquierdo cambias entre los análisis del mismo proyecto y puedes crear, renombrar o eliminar uno.',
      'Empieza en la pantalla vacía con "Añadir problema" y describe en una frase qué ocurrió. También hay un ejemplo listo.',
      'Ctrl+clic en una caja abre debajo un nuevo "porqué". Escribe ahí la respuesta y repite la operación sobre esa caja.',
      'Cuando no puedas bajar más, haz Shift+clic en esa caja para crear una caja de causa raíz. No admite hijos: la cadena termina ahí.',
      'Con el clic derecho editas o borras las cajas.',
      'Ctrl+clic en un hueco inicia una segunda cadena de problema, independiente, en el mismo lienzo.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Clic'], desc: 'Sobre una caja: nuevo porqué debajo' },
      { keys: ['Shift', 'Clic'], desc: 'Sobre una caja: caja de causa raíz' },
      { keys: ['Mod', 'Clic'], desc: 'En un hueco: nuevo problema' },
      { keys: ['Delete'], desc: 'Borrar la caja seleccionada' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Al iniciar un análisis de causa raíz desde una tarea de la EDT se abre un análisis aparte para esa tarea; no se sobrescribe el que está abierto.',
      'Una causa puede tener más de una respuesta; repite el Ctrl+clic sobre la misma caja para ramificarla.',
      'Apoya cada respuesta en algo verificable. "Descuido" no es una causa raíz, es una pregunta sin responder.',
      'Una tarea de la EDT marcada como fallida se puede enviar aquí como problema desde su propio menú contextual.'
    ],
    seo: {
      name: 'Análisis de los 5 porqués',
      title: 'Análisis de los 5 porqués — encuentra la causa raíz | Klarsti',
      description:
        'Pregunta por qué cinco veces y pasa del síntoma a la causa real. Explicado paso a paso, con un ejemplo real y gratis.',
      keywords: '5 porqués, análisis causa raíz, 5 whys, 5 porques ejemplo, método de los cinco porqués'
    },
    example: {
      title: 'Ejemplo: los correos de confirmación no llegan',
      intro:
        'Soporte lleva tres días con la misma queja. El primer impulso es «cambiemos de proveedor de correo». Preguntar por qué cinco veces enseña que el problema está en otro sitio.',
      blocks: [
        {
          heading: 'Problema',
          items: [
            'Los clientes no reciben el correo de confirmación del pedido.',
          ]
        },
        {
          heading: 'La cadena',
          items: [
            '¿Por qué? Los correos caen en spam.',
            '¿Por qué? Nuestro dominio de envío aparece sin verificar.',
            '¿Por qué? Falta un registro de verificación en el DNS.',
            '¿Por qué? No se copió al migrar el servidor.',
            '¿Por qué? La lista de comprobación de migración no lo incluye.',
          ]
        },
        {
          heading: 'Causa raíz',
          items: [
            'La lista de comprobación de migración está incompleta.',
          ]
        },
        {
          heading: 'Contramedidas',
          items: [
            'Añadido el registro que faltaba (el problema de hoy está resuelto).',
            'Añadida la verificación de dominio a la lista.',
            'La lista ya no depende de quién haga la migración.',
          ]
        },
      ],
      outcome:
        'El primer impulso era cambiar de proveedor: dinero gastado y el problema seguiría ahí. La causa real era una línea que faltaba en una lista. Hacer visible esa diferencia es todo el trabajo de los cinco porqués.'
    },
    faq: [
      {
        q: '¿Qué es el análisis de los 5 porqués?',
        a:
          'Una técnica para pasar del síntoma visible a la causa real preguntando «por qué» de forma repetida. Salió de Toyota. La idea es arreglar lo que produce el síntoma en vez del síntoma, para que el problema no vuelva.'
      },
      {
        q: '¿Por qué exactamente cinco?',
        a:
          'Cinco es una costumbre, no una regla. En la práctica la mayoría de los problemas se agotan entre la cuarta y la sexta pregunta. Si lo encuentras a la tercera, para. Si a la séptima sigues sin nada, probablemente has definido mal el problema.'
      },
      {
        q: '¿Cómo sé que he llegado a la causa raíz?',
        a:
          'Dos señales. El siguiente «por qué» empieza a apuntar a algo fuera de tu control, y estás convencido de que eliminar lo que has encontrado impediría que el problema se repita.'
      },
      {
        q: '¿5 porqués o diagrama de Ishikawa?',
        a:
          'Los 5 porqués siguen una sola cadena hacia abajo. El Ishikawa reparte el mismo problema por categorías: persona, método, máquina, material, medición, medio. Si la causa parece estar en un sitio, usa los 5 porqués; si está dispersa, dibuja antes la espina.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para hacer un análisis de los 5 porqués.'
      },
    ]
  },

  flowchart: {
    title: 'Diagramas de flujo',
    summary:
      'Dibuja los pasos, los puntos de decisión y la dirección de un proceso. Hay tres tipos de diagrama: flujo de trabajo, flujo de proceso y flujo de datos. El tipo elegido determina qué formas de caja tienes disponibles.',
    whenToUse: [
      'Diagrama de flujo de trabajo: para mostrar tareas, decisiones, aprobaciones y quién las ejecuta.',
      'Diagrama de flujo de proceso: para analizar una producción o un servicio mediante pasos de operación, transporte, inspección, espera y almacenamiento.',
      'Diagrama de flujo de datos: para trazar cómo se mueven los datos entre entidades externas, procesos y almacenes.'
    ],
    steps: [
      'La primera vez aparece el selector de tipo. Puedes cambiarlo después; las cajas se convierten a su equivalente más cercano.',
      'El menú de diagramas de arriba a la izquierda te permite tener varios diagramas en el mismo proyecto y alternar entre ellos.',
      "Pon el puntero sobre una caja: aparece un + en sus cuatro puntos de conexión. Pulsa uno, elige una forma y la caja nueva aparece en ese lado ya conectada. Haz doble clic en una caja para cambiar su nombre; clic derecho para el resto de opciones.",
      'Arrastra las cajas donde quieras; aquí no hay disposición automática, el orden es tuyo.',
      "Para dibujar una conexión, arrastra desde cualquier punto de una caja hasta cualquier punto de otra: de lado a lado, de arriba a arriba, en la dirección que quieras. Para mover un extremo, agarra la punta de la línea y suéltala en otro punto. Haz doble clic en una línea para escribir sobre ella (por ejemplo sí / no).",
      'Con los controles de abajo a la izquierda haces zoom y con el minimapa de abajo a la derecha navegas por diagramas grandes.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Borrar la caja o la conexión seleccionada' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Etiqueta todos los caminos que salen de una decisión; quien lo lea debe ver qué condición lleva a dónde.',
      'Si un diagrama ya no cabe en una pantalla, divídelo: pasa la parte cargada a una caja de subproceso y dibújala aparte.',
      'La caja de Rol en el flujo de trabajo sirve para indicar quién ejecuta un paso; déjala fuera si quieres describir el proceso al margen de las personas.'
    ],
    seo: {
      name: 'Diagrama de flujo',
      title: 'Crear un diagrama de flujo — gratis | Klarsti',
      description:
        'Dibuja los pasos del proceso, los puntos de decisión y las bifurcaciones. Con los símbolos explicados y un ejemplo.',
      keywords: 'diagrama de flujo, crear diagrama de flujo, símbolos diagrama de flujo, diagrama de flujo online, flujograma'
    },
    example: {
      title: 'Ejemplo: cómo se tramita una solicitud de vacaciones',
      intro:
        'Cada persona de la empresa tiene una versión distinta de este proceso en la cabeza. Quién aprueba, cuándo se rechaza, cuándo entra RR. HH.: nada está escrito. Dibujarlo reduce la discusión a una sola caja.',
      blocks: [
        {
          heading: 'Pasos',
          items: [
            'Inicio: la persona solicita vacaciones',
            'Proceso: el sistema calcula los días restantes',
            'Decisión: ¿quedan días suficientes?',
            'No → se rechaza y se escribe el motivo',
            'Sí → Proceso: la solicitud pasa al responsable',
          ]
        },
        {
          heading: 'Continuación',
          items: [
            'Decisión: ¿el responsable aprueba?',
            'No → vuelve el motivo a la persona y termina',
            'Sí → Proceso: RR. HH. lo registra en el calendario',
            'Proceso: se refleja en el calendario del equipo',
            'Fin: se envía la confirmación',
          ]
        },
      ],
      outcome:
        'Una vez dibujado, saltó una cosa: no había ningún paso que devolviera el motivo en las solicitudes rechazadas. Nadie lo notaba mientras el proceso vivía en la cabeza de la gente. Puesto en cajas, el hueco se enseñó solo.'
    },
    faq: [
      {
        q: '¿Qué es un diagrama de flujo?',
        a:
          'Un esquema que muestra los pasos por los que pasa un proceso de principio a fin, dónde se decide y dónde se bifurca el camino. Un proceso que cuesta cinco minutos explicar de palabra suele leerse en cinco segundos dibujado.'
      },
      {
        q: '¿Qué significan los símbolos?',
        a:
          'La caja redondeada es inicio o fin, el rectángulo es un paso del proceso y el rombo es una decisión. De una decisión siempre salen al menos dos flechas, normalmente sí y no. Esa bifurcación es lo que deja al lector con una sola interpretación.'
      },
      {
        q: '¿Es lo mismo que un mapa de procesos?',
        a:
          'Parecido, pero no igual. El diagrama de flujo muestra el orden de los pasos. El mapa de procesos suele ser más amplio: también indica quién es responsable de cada paso y dónde el trabajo pasa de un equipo a otro.'
      },
      {
        q: '¿Por dónde empiezo a dibujar?',
        a:
          'Por el final. Escribe cómo termina el proceso y ve hacia atrás preguntando «qué tiene que pasar antes de esto». Empezar por el principio suele producir el proceso ideal en lugar del real.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para dibujar un diagrama de flujo.'
      },
    ]
  },

  orgchart: {
    title: 'Organigramas',
    summary:
      'Muestra quién reporta a quién y dónde queda cada unidad. Hay siete tipos: jerárquico, funcional, divisional, matricial, plano, por equipos y en red. El tipo determina tanto las cajas disponibles como la forma de dibujar las conexiones.',
    whenToUse: [
      'Para dejar registro de la estructura actual y detectar vacantes y duplicidades.',
      'Para discutir una reorganización: dibujar el mismo equipo en tipos distintos y compararlos.',
      'Para hacer explícita la doble dependencia en el matricial, o los socios externos en el de red.'
    ],
    steps: [
      'La primera vez eliges el tipo de organigrama. Puede cambiarse después; las cajas se convierten a su equivalente más cercano y la disposición se mantiene.',
      'El menú de arriba a la izquierda te permite tener varios organigramas en un proyecto (por ejemplo, estructura actual y objetivo).',
      "Pon el puntero sobre una caja: aparece un + en sus cuatro puntos de conexión. Pulsa uno y elige puesto, unidad, equipo o vacante; la caja nueva aparece en ese lado. Haz doble clic en una caja para cambiar el nombre y el cargo de debajo.",
      'Arrastra las cajas para colocarlas como quieras.',
      'Las conexiones normales salen de los puntos superior e inferior de una caja: esa es la línea de reporte principal.',
      'Las líneas trazadas desde los puntos laterales se dibujan discontinuas e indican reporte secundario (en los organigramas matricial, jerárquico y de red).'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Borrar la caja o la conexión seleccionada' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'La caja de vacante mantiene visibles los puestos sin cubrir, así el organigrama sirve también como plan de contratación.',
      'Usa la segunda línea de la caja para el cargo: arriba la persona o unidad, debajo el rol.',
      'No mezcles los dos estilos de línea: la continua dice a quién reportas, la discontinua con quién trabajas.'
    ],
    seo: {
      name: 'Organigrama',
      title: 'Crear un organigrama — gratis | Klarsti',
      description:
        'Muestra en una página quién reporta a quién y detecta los puestos sin cubrir. Con un ejemplo real de 20 personas.',
      keywords: 'organigrama, crear organigrama, organigrama empresa, organigrama online, organigrama ejemplo'
    },
    example: {
      title: 'Ejemplo: una empresa de software de 20 personas',
      intro:
        'La empresa pasó de 6 a 20 personas en dos años. Quién reporta a quién se sabe de boca en boca, pero no está escrito en ningún sitio, así que cada persona nueva hace las mismas preguntas.',
      blocks: [
        {
          heading: 'Dirección general',
          items: [
            'Responsable de producto',
            'Responsable de ingeniería',
            'Responsable comercial',
            'Responsable de RR. HH. y finanzas',
          ]
        },
        {
          heading: 'Bajo ingeniería',
          items: [
            'Equipo de front-end (3)',
            'Equipo de back-end (4)',
            'Responsable de calidad',
            'Administrador de sistemas',
          ]
        },
        {
          heading: 'Bajo producto',
          items: [
            'Diseño (2)',
            'Analista de producto',
          ]
        },
        {
          heading: 'Bajo comercial',
          items: [
            'Venta en campo (2)',
            'Soporte al cliente (2)',
          ]
        },
      ],
      outcome:
        'Al dibujarlo saltó una cosa: calidad es una sola persona que reporta directamente a ingeniería, así que nadie cubre ese puesto en vacaciones. Ahí es donde un organigrama se gana el sueldo: enseña los huecos con nombre y apellido.'
    },
    faq: [
      {
        q: '¿Qué es un organigrama?',
        a:
          'Un esquema de cómo se conectan las personas y los equipos de una organización. Muestra las líneas de reporte y dónde encaja cada unidad. Para quien acaba de entrar es el mapa más rápido del sitio.'
      },
      {
        q: '¿Nombres o cargos?',
        a:
          'Lo mejor es ambos: el cargo explica la estructura y el nombre te dice a quién acudir. Solo con nombres el organigrama pierde sentido en cuanto alguien se va; solo con cargos no sabes a quién preguntar.'
      },
      {
        q: '¿Cuánta gente cabe en un organigrama?',
        a:
          'Hasta unas cincuenta personas sigue leyéndose en una sola página. Por encima, conviene mostrar el nivel superior aparte y dar a cada unidad su propio esquema. Meter una organización grande en una página produce un organigrama que nadie lee.'
      },
      {
        q: '¿Cada cuánto hay que actualizarlo?',
        a:
          'Con cada incorporación y cada salida. Un organigrama desactualizado es peor que ninguno, porque manda a la gente a la persona equivocada con toda confianza.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para hacer un organigrama.'
      },
    ]
  },

  swot: {
    title: 'Análisis SWOT',
    summary:
      'Lee una idea, un proyecto o una organización por cuatro ventanas: qué hay bueno y malo dentro, qué oportunidades y amenazas hay fuera. El objetivo no es hacer cuatro listas, sino enlazarlas para sacar una estrategia.',
    whenToUse: [
      'Para ver el conjunto antes de comprometerte con algo.',
      'Antes del plan anual o del presupuesto, para situar dónde estás.',
      'Para valorar tu posición frente a un competidor.',
      'Para construir una imagen común en el equipo: todos miran los mismos cuatro cuadros.'
    ],
    steps: [
      'Escribe arriba el nombre del análisis y pulsa Crear. Un proyecto puede tener varios SWOT.',
      'Aparecen cuatro cuadros: Fortalezas, Debilidades, Oportunidades, Amenazas.',
      'Escribe un punto en el campo bajo un cuadro y pulsa Enter, o haz clic en el botón más.',
      'Haz clic en un punto ya escrito para editarlo en el sitio; los cambios se guardan solos.',
      'La papelera del punto borra ese punto; la de la cabecera, todo el análisis.',
      'Para conocer la herramienta, carga el ejemplo desde la pantalla que sale cuando no hay ningún análisis.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Añadir al cuadro el punto escrito' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Fortalezas y debilidades son internas, están en tu mano; oportunidades y amenazas son externas. Un SWOT que confunde ambas no sirve.',
      'El trabajo de verdad está en cruzar los cuadros: qué fortaleza aprovecha qué oportunidad, qué debilidad te expone a qué amenaza.',
      'Llenar un cuadro con diez puntos y dejar otro vacío no es analizar, es tomar partido.'
    ],
    seo: {
      name: 'Análisis DAFO / FODA',
      title: 'Análisis DAFO (FODA) — cómo hacerlo, gratis | Klarsti',
      description:
        'Compara fortalezas y debilidades con oportunidades y amenazas, y cruza los cuatro cuadrantes. Con ejemplo resuelto.',
      keywords: 'análisis dafo, análisis foda, matriz dafo, cómo hacer un dafo, dafo ejemplo'
    },
    example: {
      title: 'Ejemplo: una asesoría contable pequeña',
      intro:
        'Una asesoría de cinco personas quiere crecer pero no sabe hacia dónde empujar. Rellenar los cuatro cuadrantes saca la conversación del instinto y la lleva a líneas concretas.',
      blocks: [
        {
          heading: 'Fortalezas',
          items: [
            'Clientes de quince años',
            'Prácticamente no se pierde ninguno',
            'Los dos socios son economistas colegiados',
            'Sin deuda',
          ]
        },
        {
          heading: 'Debilidades',
          items: [
            'Todo depende de los dos socios',
            'Ningún proceso digital, todo en papel',
            'No se hace nada de marketing',
            'Los clientes nuevos llegan solo por recomendación',
          ]
        },
        {
          heading: 'Oportunidades',
          items: [
            'La factura electrónica empuja a las pymes a buscar',
            'Muchos negocios pequeños abriendo en la zona',
            'El servicio en remoto ya se acepta',
            'El software contable se ha abaratado',
          ]
        },
        {
          heading: 'Amenazas',
          items: [
            'Servicios de contabilidad online baratos',
            'Uno de los socios está cerca de jubilarse',
            'La normativa cambia a menudo',
            'Cuesta contratar gente joven',
          ]
        },
      ],
      outcome:
        'La tabla dice algo concreto: la mayor oportunidad (la factura electrónica) cae justo encima de la mayor debilidad (no hay proceso digital). La decisión se escribe sola — no crecer, sino digitalizar primero su propio trabajo.'
    },
    faq: [
      {
        q: '¿Qué es un análisis DAFO?',
        a:
          'Un método que recoge la situación de una organización o una decisión en cuatro cuadrantes: debilidades, amenazas, fortalezas y oportunidades. Fortalezas y debilidades son internas; amenazas y oportunidades, externas. Esa separación da nombre al método y es la parte que más se confunde.'
      },
      {
        q: '¿Cómo se hace un análisis DAFO?',
        a:
          'Primero escribe en una frase qué estás analizando: «nuestra empresa» es demasiado amplio, «¿abrimos la segunda sucursal?» no lo es. Luego rellena los cuatro cuadrantes. El último paso es el que más importa: cruzarlos. Qué fortaleza aprovecha qué oportunidad, qué debilidad te deja expuesto a qué amenaza.'
      },
      {
        q: '¿Cómo distingo una fortaleza de una oportunidad?',
        a:
          'Una prueba sencilla: si tu propia decisión puede cambiarlo, es interno; si no puede, es externo. Un equipo con experiencia es una fortaleza; un mercado que crece es una oportunidad. Mezclar los cuadrantes deja el análisis inservible.'
      },
      {
        q: '¿Cuántos puntos por cuadrante?',
        a:
          'De tres a seis funciona bien. Quince puntos en un cuadrante son un inventario, no un análisis. Elegir los pocos que de verdad deciden es lo que hace que la conclusión salga sola de la tabla.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para hacer un análisis DAFO.'
      },
    ]
  },

  ishikawa: {
    title: 'Diagrama de espina de pescado',
    summary:
      'Reúne las causas posibles de un problema bajo seis encabezados: Personas, Máquina, Material, Método, Medición y Medio. La cabeza del pez es el problema y las espinas son grupos de causas. La idea es barrer todas las áreas en vez de buscar en una sola.',
    whenToUse: [
      'Cuando no está claro dónde está la causa y no quieres saltarte ninguna área.',
      'En lluvia de ideas con el equipo, para que cada uno aporte desde su terreno.',
      'Para reunir causas candidatas antes de entrar en los 5 Porqués.'
    ],
    steps: [
      'Escribe arriba el problema en una frase y pulsa Empezar.',
      'Aparecen seis cuadros de categoría. Escribe una causa posible en el campo de abajo y pulsa Enter.',
      'El enunciado del problema se edita desde la cabecera y los puntos dentro de sus cuadros.',
      'Un proyecto puede contener varios análisis; cada uno es una tarjeta con su propio enunciado.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Añadir a la categoría la causa escrita' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'No hace falta llenar todas las categorías; una categoría vacía también es información.',
      'Escribe lo que ocurrió, no el síntoma: no "llegó tarde", sino "la aprobación estuvo tres días parada".',
      'Lleva los candidatos más fuertes a los 5 Porqués. Ishikawa da amplitud, los 5 Porqués dan profundidad.'
    ],
    seo: {
      name: 'Diagrama de Ishikawa',
      title: 'Diagrama de Ishikawa — espina de pescado | Klarsti',
      description:
        'Agrupa las causas posibles por persona, método, máquina y material, y descubre por dónde empezar. Con ejemplo, gratis.',
      keywords: 'diagrama de ishikawa, espina de pescado, diagrama causa efecto, ishikawa ejemplo, método 6m'
    },
    example: {
      title: 'Ejemplo: ha subido la tasa de piezas defectuosas',
      intro:
        'En un taller de muebles el porcentaje de defectos pasó del 3 % al 9 % en dos meses. En vez de buscar una única causa, se ponen todos los candidatos uno al lado del otro bajo seis encabezados.',
      blocks: [
        {
          heading: 'Personas',
          items: [
            'Se fueron dos carpinteros con experiencia',
            'A los nuevos no se les formó',
            'No hay relevo entre turnos',
          ]
        },
        {
          heading: 'Método',
          items: [
            'Las medidas de corte no están escritas',
            'La calidad solo se revisa al final de la línea',
          ]
        },
        {
          heading: 'Máquina',
          items: [
            'La sierra lleva seis meses sin revisión',
            'La lijadora se desajusta',
          ]
        },
        {
          heading: 'Material',
          items: [
            'Cambió el proveedor',
            'No se mide la humedad de los tableros nuevos',
          ]
        },
      ],
      outcome:
        'Con las espinas rellenas, dos encabezados están visiblemente más cargados que el resto: personas y material. El equipo empieza por ahí. La espina no encuentra la causa: te dice dónde empezar a buscar.'
    },
    faq: [
      {
        q: '¿Qué es un diagrama de Ishikawa?',
        a:
          'Un esquema que ordena las causas posibles de un problema en categorías y las coloca una al lado de otra. Se llama de espina de pescado por la forma que recuerda a un esqueleto, y también se conoce como diagrama causa-efecto.'
      },
      {
        q: '¿Qué son las 6M?',
        a:
          'Las seis categorías clásicas: personas (mano de obra), método, máquina, material, medición y medio ambiente. El objetivo no es rellenarlas todas, sino obligar a mirar en seis direcciones en vez de en la única que ya tenías en mente. En servicios estos encabezados se pueden y se deben cambiar.'
      },
      {
        q: '¿Se puede combinar con los 5 porqués?',
        a:
          'Sí, y es la forma más eficaz de usar cualquiera de los dos. Reparte los candidatos con la espina, elige la rama más sólida y profundiza en ella con los 5 porqués. Uno da amplitud, el otro profundidad.'
      },
      {
        q: '¿La espina encuentra la causa?',
        a:
          'No directamente: produce candidatos. Cuando el diagrama está listo tienes una lista para comprobar, no una causa demostrada. El paso siguiente es contrastarla con datos, y ahí encaja bien el análisis de Pareto.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para dibujar un diagrama de Ishikawa.'
      },
    ]
  },

  pdca: {
    title: 'Ciclo PDCA',
    summary:
      'Planificar, Hacer, Verificar, Actuar. Lleva una mejora no como tarea única sino como una rueda que gira: cada vuelta empieza con el resultado de la anterior.',
    whenToUse: [
      'Para probar un cambio pequeño, medir el resultado y luego extenderlo.',
      'Para dejar constancia de si una medida funcionó realmente.',
      'Para seguir las vueltas en equipos que trabajan en mejora continua.'
    ],
    steps: [
      'Escribe arriba el objetivo del ciclo y pulsa Empezar.',
      'Aparecen cuatro cuadros de fase. Añade tus puntos en el campo bajo cada fase.',
      'Al hacer clic en el círculo a la izquierda de un punto, este queda marcado como completado y tachado.',
      'Un proyecto puede contener varios ciclos; cada objetivo es una tarjeta.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Añadir a la fase el punto escrito' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Pon algo medible en la fase de Verificar. Si "¿ha mejorado?" no tiene un número detrás, el ciclo no cierra.',
      'Lo que sale de la fase Actuar es la entrada del Planificar de la vuelta siguiente.',
      'No intentes llenar los cuatro cuadros a la vez; ir en orden es el método.'
    ],
    seo: {
      name: 'Ciclo PDCA (PHVA)',
      title: 'Ciclo PDCA (PHVA) — mejora continua | Klarsti',
      description:
        'Planificar, Hacer, Verificar y Actuar: haz pruebas pequeñas y mide el resultado. Con un ciclo completo de ejemplo.',
      keywords: 'ciclo pdca, ciclo phva, mejora continua, círculo de deming, pdca ejemplo'
    },
    example: {
      title: 'Ejemplo: reducir el tiempo de primera respuesta en soporte',
      intro:
        'El equipo de soporte responde de media en 14 horas. El objetivo son 4. Antes de contratar a nadie, hacen un solo ciclo.',
      blocks: [
        {
          heading: 'Planificar',
          items: [
            'Objetivo: primera respuesta media por debajo de 4 horas',
            'Supuesto: los tickets se acumulan por la mañana y nadie los asume',
            'Prueba: una persona de guardia de 09:00 a 11:00',
            'Duración: dos semanas',
          ]
        },
        {
          heading: 'Hacer',
          items: [
            'Turnos repartidos con el equipo',
            'Quien está de guardia no recibe otro trabajo en esas dos horas',
            'Se registra la hora de primera respuesta de cada ticket',
          ]
        },
        {
          heading: 'Verificar',
          items: [
            'La media bajó de 14 horas a 5',
            'Los tickets de mañana bajaron a 2 horas',
            'Los de la tarde no cambiaron nada',
            'Quien estaba de guardia se retrasó en su propio trabajo',
          ]
        },
        {
          heading: 'Actuar',
          items: [
            'La guardia de mañana se hace fija',
            'Se reduce la carga los días de guardia',
            'Se abre un ciclo nuevo para las tardes',
          ]
        },
      ],
      outcome:
        'Un solo ciclo redujo el tiempo a un tercio y produjo por sí mismo la siguiente pregunta: los tickets de la tarde. Así se supone que funciona el PDCA — cada ciclo te entrega el tema del siguiente.'
    },
    faq: [
      {
        q: '¿Qué es el ciclo PDCA?',
        a:
          'Un bucle de cuatro pasos para la mejora continua: planificar, hacer, verificar y actuar. También se conoce como ciclo de Deming y en América Latina como PHVA. La idea es dejar de hacer un gran cambio y hacer en su lugar experimentos pequeños cuyo resultado se mide de verdad.'
      },
      {
        q: '¿Cuánto debe durar un ciclo?',
        a:
          'El menor tiempo en el que puedas medir el resultado. De una a cuatro semanas encaja en casi todo el trabajo de oficina. Un ciclo de seis meses no es un ciclo: las condiciones habrán cambiado cuando mires y no sabrás qué causó qué.'
      },
      {
        q: '¿Qué se mide en la fase de verificar?',
        a:
          'Lo que escribiste al planificar. Por eso el objetivo tiene que ser un número: «responder más rápido» no se puede verificar, «primera respuesta media por debajo de 4 horas» sí. Sin un número escrito antes, verificar se convierte en opinión.'
      },
      {
        q: '¿Y si el experimento falla?',
        a:
          'Un ciclo fallido también es un resultado y no se tira. En la fase de actuar escribes por qué no se sostuvo el supuesto, y el ciclo siguiente parte de ahí. El único desperdicio real en PDCA es probar algo nuevo sin registrar lo que pasó.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para llevar un ciclo PDCA.'
      },
    ]
  },

  waterfall: {
    title: 'Modelo cascada',
    summary:
      'Divide el proyecto en seis fases y las recorre en orden: Requisitos, Diseño de alto nivel, Diseño de bajo nivel, Implementación, Verificación y Mantenimiento. La siguiente fase no se abre hasta cerrar la actual, y la cerrada queda bloqueada.',
    whenToUse: [
      'Trabajos cuyos requisitos se conocen de antemano y no van a cambiar por el camino.',
      'Proyectos con aprobaciones y documentación, donde cada fase debe quedar registrada.',
      'Trabajos donde el orden importa: no se produce antes de terminar el diseño.'
    ],
    steps: [
      'Escribe arriba el nombre del proyecto y pulsa Empezar.',
      'Las seis fases se apilan. Solo la fase abierta acepta puntos; las siguientes llevan un candado.',
      'Cuando la fase esté lista, pulsa el botón "completar esta fase" bajo el cuadro.',
      'Tras confirmar se abre la siguiente fase; la completada recibe una marca y sus puntos ya no se pueden cambiar.',
      'Un proyecto puede contener varios proyectos en cascada.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Añadir a la fase el punto escrito' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer (también revierte una fase completada)' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'No hay botón para reabrir una fase; si la completaste por error, deshacer es la única vuelta atrás.',
      'Asegúrate de que la fase está realmente terminada antes de cerrarla: al cerrarse también se bloquea el texto.',
      'Si los requisitos van a cambiar sobre la marcha, la cascada te aprieta; ahí funcionan mejor la EDT o el PDCA.'
    ],
    seo: {
      name: 'Modelo en cascada',
      title: 'Modelo en cascada en gestión de proyectos | Klarsti',
      description:
        'Requisitos, diseño, desarrollo, pruebas y entrega en orden. Con ejemplo y la diferencia frente a los métodos ágiles.',
      keywords: 'modelo en cascada, metodología cascada, cascada vs ágil, fases modelo en cascada, waterfall proyecto'
    },
    example: {
      title: 'Ejemplo: entregar un módulo de informes a un banco',
      intro:
        'Alcance fijado por contrato, fecha de entrega fijada y aprobación por escrito del cliente al final de cada fase. Un trabajo así avanza por las fases en orden.',
      blocks: [
        {
          heading: 'Requisitos',
          items: [
            'Tipos de informe listados',
            'Reglas de permisos escritas',
            'Aprobación del cliente',
          ]
        },
        {
          heading: 'Diseño',
          items: [
            'Modelo de datos',
            'Bocetos de pantallas',
            'Límites de rendimiento acordados',
          ]
        },
        {
          heading: 'Desarrollo',
          items: [
            'Motor de informes',
            'Permisos',
            'Exportación',
          ]
        },
        {
          heading: 'Pruebas y entrega',
          items: [
            'Pruebas internas',
            'Pruebas de aceptación del cliente',
            'Puesta en producción',
            'Formación de usuarios',
          ]
        },
      ],
      outcome:
        'Aquí se ven a la vez la fuerza y la debilidad de la cascada: como el alcance está fijado desde el principio, el avance se mide fácil, pero un requisito que cambia durante el desarrollo manda todo el plan hacia atrás.'
    },
    faq: [
      {
        q: '¿Qué es el modelo en cascada?',
        a:
          'Un método que divide el proyecto en fases sucesivas y no empieza una sin haber terminado la anterior: requisitos, diseño, desarrollo, pruebas y entrega. El nombre viene del agua cayendo por una escalera.'
      },
      {
        q: '¿Cascada o ágil?',
        a:
          'Si el alcance se conoce de antemano y no es probable que se mueva, la cascada trae menos carga de gestión: construcción, trabajos regulados y entregas a precio cerrado encajan. Si el alcance solo se aclarará sobre la marcha, la cascada sale cara y encajan mejor los métodos ágiles.'
      },
      {
        q: '¿Se puede volver a una fase anterior?',
        a:
          'Se puede, pero cuesta, y el modelo no está pensado para eso. Si vuelves atrás a menudo, es señal de que el alcance nunca estuvo lo bastante claro; y entonces la pregunta real es si la cascada era la elección correcta.'
      },
      {
        q: '¿Qué ocurre entre fases?',
        a:
          'Cada fase termina con un entregable y una aprobación, y la aprobación debe ser por escrito. Toda la garantía que ofrece la cascada se apoya en que ambas partes acuerden, en el mismo momento, que una fase queda cerrada.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para llevar un proyecto en cascada.'
      },
    ]
  },

  fta: {
    title: 'Análisis de árbol de fallos (FTA)',
    summary:
      'Arriba está el suceso no deseado y debajo las condiciones que deben coincidir para que ocurra. El árbol se construye con puertas lógicas; si introduces probabilidades en los sucesos básicos, la del suceso superior se calcula sola.',
    whenToUse: [
      'Para ver qué combinaciones de condiciones pueden producir un fallo o un accidente.',
      'Para hablar del riesgo con números: cuánto aporta cada rama al total.',
      'Para mostrar qué rama corta una medida de seguridad concreta.'
    ],
    steps: [
      'Con el menú superior izquierdo cambias entre los árboles del mismo proyecto y puedes crear, renombrar o eliminar uno.',
      'Crea la caja del suceso superior en la pantalla vacía, o carga el ejemplo.',
      'Clic derecho en una caja y Editar para poner nombre, descripción y —en los sucesos básicos— probabilidad.',
      'Desde ese menú añades sucesos debajo: suceso, suceso básico, suceso no desarrollado o suceso condicionante.',
      'En el mismo menú están las puertas lógicas: Y, Y prioritaria, O, O exclusiva e inhibidora.',
      'Introduce las probabilidades en porcentaje en los sucesos básicos; las puertas superiores y el suceso final se calculan a partir de ellas.',
      'Arrastra las cajas para colocarlas y usa el minimapa de abajo a la derecha para moverte por un árbol grande.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Borrar la caja seleccionada' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Una puerta Y multiplica las probabilidades de abajo: todo debe ocurrir y el resultado se reduce. Una puerta O necesita solo una, y el resultado crece.',
      'Las ramas sin probabilidad no cuentan; el número de arriba solo cubre los datos que introdujiste.',
      'Los sucesos básicos son círculos y los no desarrollados, rombos: marcar las ramas que no profundizaste mantiene honesto el árbol.'
    ],
    seo: {
      name: 'Análisis de árbol de fallos (FTA)',
      title: 'Análisis de árbol de fallos (FTA) | Klarsti',
      description:
        'Coloca el suceso no deseado arriba y resuelve con puertas Y/O qué fallos deben coincidir. Con ejemplo, gratis.',
      keywords: 'árbol de fallos, análisis de árbol de fallos, fta, puerta y o, árbol de fallos ejemplo'
    },
    example: {
      title: 'Ejemplo: la cámara frigorífica superó la temperatura límite',
      intro:
        'En un almacén de alimentación la temperatura estuvo dos horas por encima del límite y hubo que destruir la mercancía. Se escribe el suceso principal arriba y el árbol baja por puertas lógicas mostrando qué fallos tuvieron que coincidir.',
      blocks: [
        {
          heading: 'Suceso principal',
          items: [
            'Cámara por encima del límite durante dos horas',
          ]
        },
        {
          heading: 'Puerta O — basta con uno',
          items: [
            'El frío se paró',
            'Entró calor',
            'La alarma no saltó y nadie se dio cuenta',
          ]
        },
        {
          heading: 'Bajo «el frío se paró» (O)',
          items: [
            'Avería del compresor',
            'Corte de luz',
            'Termostato mal ajustado',
          ]
        },
        {
          heading: 'Bajo «la alarma no saltó» (Y)',
          items: [
            'Sensor averiado',
            'Sensor de respaldo nunca instalado',
            'Avisos remotos desactivados',
          ]
        },
      ],
      outcome:
        'El árbol enseña que el frío parándose no basta por sí solo: también tenía que fallar la alarma. Así que la contramedida más barata no es un compresor nuevo, es instalar el sensor de respaldo. Ahí es donde el árbol de fallos manda el dinero al sitio correcto.'
    },
    faq: [
      {
        q: '¿Qué es el análisis de árbol de fallos (FTA)?',
        a:
          'Un método que coloca un suceso no deseado arriba y baja por puertas lógicas para mostrar qué combinaciones de fallos lo producirían. Viene de la aeronáutica y la industria nuclear, y hoy se usa en análisis de seguridad y de procesos en general.'
      },
      {
        q: '¿Qué diferencia hay entre una puerta Y y una puerta O?',
        a:
          'Bajo una puerta O basta con que ocurra cualquiera de los sucesos de abajo. Bajo una puerta Y tienen que ocurrir todos a la vez. Esa distinción es el corazón del método: las puertas Y te enseñan dónde el sistema se está protegiendo solo.'
      },
      {
        q: '¿Árbol de fallos o 5 porqués?',
        a:
          'Los 5 porqués recorren hacia atrás una sola cadena de algo que ya ha pasado. El árbol de fallos mapea todas las rutas hacia un suceso que aún no ha pasado. Uno mira al pasado y el otro al futuro.'
      },
      {
        q: '¿Hasta dónde hay que bajar?',
        a:
          'Hasta sucesos que ya no puedes dividir y sobre los que puedes actuar directamente. «Sensor averiado» está lo bastante abajo, porque puedes escribir una contramedida contra eso. «El sistema no funciona» no lo está.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para construir un árbol de fallos.'
      },
    ]
  },

  vsm: {
    title: 'Mapeo de flujo de valor',
    summary:
      'Dibuja el flujo completo de un producto o trabajo junto con las esperas e inventarios intermedios. El objetivo es ver cuánto del tiempo total realmente agrega valor: casi siempre mucho menos de lo que se cree.',
    whenToUse: [
      'Para encontrar dónde espera un proceso y dónde se acumula el trabajo.',
      'Para ver qué paso no alcanza la demanda del cliente: ¿algo supera el tiempo takt?',
      'Para dibujar el estado actual y poner al lado un estado futuro y compararlos.',
    ],
    steps: [
      'Ingresa la demanda diaria y los turnos en el panel superior derecho. De ahí sale el tiempo takt: cada cuánto debe salir una pieza.',
      'En un lienzo vacío, crea el esqueleto inicial o empieza desde cero. Haz clic derecho en el lienzo para añadir cualquier caja.',
      'Escribe el tiempo de ciclo con su unidad en la caja de proceso. Si supera el tiempo takt la caja se pone roja: ahí está el cuello de botella.',
      'Escribe las piezas en espera en la caja de inventario; el tiempo de espera sale como piezas ÷ demanda diaria. Si no tienes conteo, ingresa el tiempo directamente.',
      'Conecta las cajas. Haz clic derecho en una conexión para cambiarla a empuje, extracción, FIFO, información manual o electrónica. Solo las flechas de material entran en el cálculo.',
      'Desde el menú superior izquierdo, copia el estado actual como estado futuro, trabájalo y compara los números de abajo.',
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Borrar la caja seleccionada' },
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'La eficiencia de flujo de abajo es el tiempo con valor agregado sobre el tiempo de entrega total. Es normal que dé un dígito; lo que hay que acortar es la espera, no el trabajo.',
      'Si dejas el inventario fuera del mapa, el tiempo total se ve mejor de lo que es: ahí se esconde la información real.',
      'Las cajas no conectadas a la cadena quedan fuera de los totales y se cuentan como aviso abajo. Conecta el flujo en una sola línea.',
      'Pon la ráfaga kaizen donde vas a mejorar; así se lee un mapa de estado futuro.',
    ],
    seo: {
      name: 'Mapa de flujo de valor (VSM)',
      title: 'Mapa de flujo de valor (VSM) | Klarsti',
      description:
        'Compara el tiempo de proceso con la espera de cada paso y ve dónde se pierde el tiempo. Con ejemplo numérico, gratis.',
      keywords: 'mapa de flujo de valor, vsm, value stream mapping, lean manufacturing, vsm ejemplo'
    },
    example: {
      title: 'Ejemplo: del pedido recibido a la mercancía expedida',
      intro:
        'Un fabricante mide el tiempo entre que entra un pedido y la mercancía sube al camión. El tiempo real de proceso de cada paso se anota aparte de la espera entre pasos. La diferencia cambia el cuadro por completo.',
      blocks: [
        {
          heading: 'Pasos y tiempo de proceso',
          items: [
            'Entrada del pedido — 10 minutos',
            'Comprobación de crédito — 15 minutos',
            'Alta en el plan de producción — 30 minutos',
            'Producción — 4 horas',
            'Control de calidad — 20 minutos',
            'Embalaje y expedición — 40 minutos',
          ]
        },
        {
          heading: 'Espera entre pasos',
          items: [
            'Tras la entrada — 1 día',
            'Tras el crédito — 2 días',
            'Tras entrar en el plan — 3 días',
            'Tras producción — 1 día',
            'Tras calidad — 2 días',
          ]
        },
      ],
      outcome:
        'El tiempo de proceso suma unas 6 horas; el tiempo total son 9 días. Es decir, el 99 % del tiempo es espera. La espera más larga son los tres días tras entrar en el plan. La respuesta no admite discusión: acelerar la producción no sirve de nada, el problema es la cola.'
    },
    faq: [
      {
        q: '¿Qué es un mapa de flujo de valor (VSM)?',
        a:
          'Un mapa de todos los pasos por los que pasa un producto o una petición, con la duración de cada paso y la espera entre ellos. Viene de la producción lean. Su fin no es ir más rápido, sino enseñar dónde se va realmente el tiempo.'
      },
      {
        q: '¿Qué añade valor y qué no?',
        a:
          'Todo aquello por lo que el cliente pagaría de buena gana añade valor: los pasos que de verdad cambian el producto. Esperar, mover cosas y repetir controles no. En la mayoría de los procesos más del 90 % del tiempo total no añade valor.'
      },
      {
        q: '¿En qué se diferencia de un diagrama de flujo?',
        a:
          'El diagrama de flujo muestra el orden de los pasos y los puntos de decisión, sin duraciones. En el mapa de flujo de valor la duración lo es todo: el tiempo de proceso y el de espera se anotan por separado en cada paso y luego se comparan.'
      },
      {
        q: '¿Por dónde empiezo?',
        a:
          'Mapeando el estado actual exactamente como es. El error más común es dibujar el proceso como se supone que funciona. Si el mapa no muestra la realidad, las mejoras se aplican a un proceso que no existe. Hay que medir los tiempos reales sobre el terreno.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para dibujar un mapa de flujo de valor.'
      },
    ]
  },

  pareto: {
    title: 'Análisis de Pareto',
    summary:
      'La mayor parte del efecto viene de unas pocas causas. Ordena las categorías por frecuencia de mayor a menor y traza encima la curva de porcentaje acumulado, de modo que se vean los pocos elementos que están detrás de casi todo el problema.',
    whenToUse: [
      'Para decidir cuál de muchas quejas, defectos o partidas de coste atacar primero.',
      'Para mostrar dónde rendirá más una mejora.',
      'Para defender que se concentren los recursos en unos pocos puntos en lugar de repartirlos.'
    ],
    steps: [
      'Crea el análisis la primera vez. Con la lista de arriba cambias entre los análisis del proyecto, con el lápiz lo renombras y con la papelera lo borras.',
      'En la tabla del panel izquierdo introduce el nombre de la categoría y su frecuencia.',
      'Para una fila nueva usa el botón de añadir bajo la tabla.',
      'El gráfico se actualiza al instante: las barras se ordenan de mayor a menor y la curva muestra el porcentaje acumulado.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'En vez de frecuencia puedes meter coste o tiempo perdido, siempre que todas las filas usen la misma unidad.',
      'Párate donde la curva se aplana: la cola larga de la derecha no compensa el esfuerzo.',
      'Si troceas demasiado las categorías, nada destaca y el gráfico se aplana. Junta lo parecido.'
    ],
    seo: {
      name: 'Análisis de Pareto',
      title: 'Análisis de Pareto y gráfico 80/20 | Klarsti',
      description:
        'Ordena las causas por frecuencia y encuentra las pocas que generan la mayor parte del problema. Con ejemplo, gratis.',
      keywords: 'análisis de pareto, diagrama de pareto, regla 80 20, principio de pareto, pareto ejemplo'
    },
    example: {
      title: 'Ejemplo: de dónde vienen las quejas de los clientes',
      intro:
        'Una tienda online recibió 480 quejas en tres meses. El equipo llevaba tiempo discutiendo una solución distinta para cada tipo. Contarlas y ordenarlas de mayor a menor cambia la conversación.',
      blocks: [
        {
          heading: 'Tipo de queja y número',
          items: [
            'Entrega tardía — 196',
            'El artículo no coincidía con la descripción — 121',
            'Devolución demasiado lenta — 62',
            'Artículo dañado — 48',
            'Artículo equivocado — 29',
            'Otras — 24',
          ]
        },
        {
          heading: 'Porcentaje acumulado',
          items: [
            'Entrega tardía — 41 %',
            '+ Descripción — 66 %',
            '+ Devoluciones — 79 %',
            '+ Daños — 89 %',
            'Las tres restantes — 100 %',
          ]
        },
      ],
      outcome:
        'Las dos primeras suman dos tercios de todo. En lugar de perseguir seis problemas a la vez, arreglar los plazos de entrega y las descripciones elimina el 66 % del descontento. Hacer visible ese orden es todo el trabajo del análisis de Pareto.'
    },
    faq: [
      {
        q: '¿Qué es el análisis de Pareto?',
        a:
          'Un método que ordena los problemas por frecuencia, de mayor a menor, y muestra cuáles pocos suman la mayor parte del total. Se apoya en una observación sencilla: alrededor del 80 % de los efectos viene de alrededor del 20 % de las causas.'
      },
      {
        q: '¿La regla del 80/20 se cumple siempre?',
        a:
          'No exactamente, y no hace falta. A veces sale 70/30 y a veces 90/10. Lo que importa no es la proporción sino que el reparto sea desigual: si unos pocos elementos cargan con la mayor parte, el análisis de Pareto sirve.'
      },
      {
        q: '¿Ordeno por número o por coste?',
        a:
          'Por aquello de lo que dependa tu decisión. El número enseña qué problema ocurre más; el coste, cuál duele más. A menudo no coinciden: un problema raro pero caro queda al final de una lista ordenada por número.'
      },
      {
        q: '¿Cuántas categorías debe tener?',
        a:
          'De cinco a diez se lee mejor. Un análisis con treinta categorías sigue siendo una lista y no da foco. Elegir pocas categorías realmente distintas es la mitad del trabajo.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para hacer un análisis de Pareto.'
      },
    ]
  },

  histogram: {
    title: 'Histograma',
    summary:
      'Muestra la distribución de una medición: dónde se agrupan los valores, si la dispersión es simétrica, si hay algo en los extremos. Tú das las mediciones en bruto, la herramienta forma las clases y, con límites de especificación, calcula también la capacidad del proceso.',
    whenToUse: [
      'Para ver lo que oculta el promedio: la misma media puede venir de distribuciones muy distintas.',
      'Para juzgar qué tan consistente es un proceso: dispersión estrecha es consistente, amplia es errática.',
      'Para ver con qué frecuencia las mediciones salen de especificación y si el proceso cumple la demanda.',
    ],
    steps: [
      'Crea el análisis; con la lista de arriba cambias entre análisis del mismo proyecto.',
      'Escribe las mediciones en el cuadro de la izquierda o pega una lista tal cual. Un valor por línea; los decimales admiten coma o punto.',
      'La herramienta elige el número de clases (regla de Sturges). Si no te convence, escribe tu propio número.',
      'Ingresa el límite inferior y superior. Aparecen como líneas rojas discontinuas y las columnas fuera de límite se vuelven rojas.',
      'Abajo verás cantidad, media, desviación estándar y rango; con ambos límites, también Cp y Cpk.',
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'La curva gris es una distribución normal con la misma media y desviación. Si las columnas se apartan claramente, hay una causa especial.',
      'Una distribución de dos picos suele indicar que se mezclaron dos procesos (dos turnos, dos máquinas).',
      'Cpk de 1,33 o más suele considerarse capaz; por debajo de 1 el proceso no sostiene los límites.',
      'Buen Cp con mal Cpk significa dispersión estrecha pero media desplazada: se corrige ajustando, no hay que estrechar la distribución.',
    ],
    seo: {
      name: 'Histograma',
      title: 'Crear un histograma — ver la distribución | Klarsti',
      description:
        'Agrupa tus mediciones en intervalos y descubre lo que la media esconde. Explica qué significan dos picos. Gratis.',
      keywords: 'histograma, crear histograma, histograma online, distribución de frecuencias, histograma ejemplo'
    },
    example: {
      title: 'Ejemplo: plazos de entrega',
      intro:
        'El plazo medio de entrega se informa como 3 días y parece razonable. Aun así las quejas siguen llegando. Agrupar los plazos uno a uno revela lo que la media escondía.',
      blocks: [
        {
          heading: 'Distribución del plazo (500 pedidos)',
          items: [
            '1 día — 140 pedidos',
            '2 días — 165 pedidos',
            '3 días — 95 pedidos',
            '4 días — 30 pedidos',
            '5 días — 12 pedidos',
            '6 días o más — 58 pedidos',
          ]
        },
        {
          heading: 'Cómo se lee',
          items: [
            'El 60 % llega en dos días',
            'Hay un grupo pequeño pero claro en seis días o más',
            'La forma tiene dos picos, no uno',
            'Tres días —la media— es de los resultados menos frecuentes',
          ]
        },
      ],
      outcome:
        'La media dice tres días, pero en realidad hay dos experiencias de cliente distintas: la mayoría recibe en dos días y una parte espera una semana. Una distribución de dos picos significa siempre lo mismo: esto no es un proceso, son dos. La pregunta siguiente es de qué zona o de qué almacén salieron esos 58 pedidos.'
    },
    faq: [
      {
        q: '¿Qué es un histograma?',
        a:
          'Un gráfico que divide las mediciones en intervalos y muestra cuántas caen en cada uno. Hace visible lo que la media esconde: cómo se reparten los valores.'
      },
      {
        q: '¿En qué se diferencia de un gráfico de barras?',
        a:
          'El gráfico de barras muestra categorías y puedes reordenarlas: ciudades, productos. El histograma tiene un eje numérico, el orden es fijo y las barras se tocan. Lo que decide cuál necesitas es el tipo de dato.'
      },
      {
        q: '¿Cuántos intervalos uso?',
        a:
          'Un punto de partida habitual es aproximadamente la raíz cuadrada del número de mediciones: unos diez para 100 datos. Muy pocos borran la forma; demasiados convierten el ruido en estructura aparente. Prueba un par de valores y quédate con el que mantiene la forma estable.'
      },
      {
        q: '¿Qué significa un histograma con dos picos?',
        a:
          'Casi siempre que los datos no vienen de un solo proceso: dos turnos, dos máquinas, dos zonas. Cuando veas esa forma, lo primero es separar los datos y mirar cada parte por su cuenta.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para hacer un histograma.'
      },
    ]
  },

  decision: {
    title: 'Matriz de decisión',
    summary:
      'Puntúa varias opciones con los mismos criterios. Cada criterio lleva un peso; el total de una opción es la suma de los productos de puntuación por peso.',
    whenToUse: [
      'Cuando estás atascado entre unas pocas alternativas y la discusión da vueltas.',
      'Cuando hay que dejar por escrito el razonamiento de una decisión.',
      'Cuando cada miembro del equipo pesa en silencio un criterio distinto: la matriz los saca a la luz.'
    ],
    steps: [
      'Añade criterios: los encabezados con los que vas a comparar (coste, tiempo, riesgo...).',
      'Da a cada criterio un peso de 1 a 5, según lo importante que sea para ti.',
      'Añade opciones: las alternativas que vas a comparar.',
      'En la tabla puntúa cada opción en cada criterio de 0 a 10.',
      'Los totales se calculan solos y la opción con más puntos queda marcada con un trofeo.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Deshacer' },
      { keys: ['Mod', 'Y'], desc: 'Rehacer' }
    ],
    tips: [
      'Fija los pesos antes de empezar a puntuar. Retocarlos después no es decidir, es fabricar la respuesta que querías.',
      'La matriz no decide por ti; hace visible en función de qué decidiste.',
      'Si dos totales quedan muy cerca, la respuesta no es "empate" sino "estos criterios no los separan": busca el criterio que falta.'
    ],
    seo: {
      name: 'Matriz de decisión',
      title: 'Matriz de decisión — puntuación ponderada | Klarsti',
      description:
        'Puntúa las opciones con los mismos criterios y sus pesos, y deja a la vista en qué se apoya la decisión. Con ejemplo, gratis.',
      keywords: 'matriz de decisión, matriz ponderada, toma de decisiones, matriz de decisión ejemplo, comparar opciones'
    },
    example: {
      title: 'Ejemplo: ¿qué nave alquilamos?',
      intro:
        'Tres candidatas, y cada persona tiene su favorita. La discusión funciona a base de «yo creo». Ponderar los criterios y puntuar cada opción sobre diez la lleva a números.',
      blocks: [
        {
          heading: 'Criterios y peso',
          items: [
            'Coste mensual — peso 5',
            'Distancia a los clientes — peso 4',
            'Margen para crecer — peso 3',
            'Acceso a carretera y puerto — peso 3',
            'Dificultad de la mudanza — peso 1',
          ]
        },
        {
          heading: 'Puntuaciones (1-10)',
          items: [
            'Nave A: 8 / 4 / 6 / 5 / 7',
            'Nave B: 5 / 9 / 4 / 8 / 5',
            'Nave C: 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Total ponderado',
          items: [
            'Nave A — 100',
            'Nave B — 114',
            'Nave C — 114',
          ]
        },
      ],
      outcome:
        'A queda fuera. B y C empatan, así que la matriz no ha decidido, pero ha reducido la discusión de cinco criterios a uno. La única pregunta que queda es si la cercanía pesa más que el margen para crecer. Ese suele ser el beneficio real de una matriz de decisión: no elige, estrecha.'
    },
    faq: [
      {
        q: '¿Qué es una matriz de decisión?',
        a:
          'Una tabla que puntúa varias opciones con los mismos criterios y multiplica cada puntuación por la importancia de ese criterio. Su fin no es automatizar la decisión sino dejar a la vista los supuestos en los que se apoya.'
      },
      {
        q: '¿Cómo pongo los pesos?',
        a:
          'Antes de puntuar y sin mirar las opciones. Al revés, la gente ajusta discretamente los pesos hasta que gana su opción preferida. Escribir los pesos primero y bloquearlos es lo único que hace que la matriz valga algo.'
      },
      {
        q: '¿Y si el resultado no es la opción que quería?',
        a:
          'Ese es el momento más valioso de la matriz. Hay dos posibilidades: o ponderaste mal un criterio, o falta un criterio en la tabla. Ambas se arreglan escribiendo lo que falta, no retocando los números.'
      },
      {
        q: '¿Cuántos criterios uso?',
        a:
          'De cuatro a siete funciona bien. Por debajo de tres podrías haber decidido por instinto; por encima de siete los pesos se acercan entre sí y los totales acaban pegados sin significado.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para montar una matriz de decisión.'
      },
    ]
  },

  notepad: {
    title: 'Agenda',
    summary:
      'Un espacio personal donde eliges días en el calendario y los planificas. A diferencia de las demás herramientas, la agenda no es dato de proyecto: las entradas son tuyas y no viajan a nadie cuando compartes un proyecto.',
    whenToUse: [
      'Para organizar el día y colocar el trabajo en horas.',
      'Para llevar una tarea de la EDT a un día concreto.',
      'Para escribir con tus palabras cómo fue el día al cerrarlo.'
    ],
    steps: [
      'Los días con entradas aparecen marcados en el calendario; al hacer clic se abre el flujo de ese día.',
      'Para una entrada nueva escribe el título y el texto. Ponle una franja horaria o déjala de todo el día.',
      'Si la franja que pones choca con otra entrada, aparece un aviso de conflicto.',
      'Puedes poner un recordatorio: a la hora, 5 / 15 / 30 minutos, 1 hora o 1 día antes. Los recordatorios llegan como notificación en la aplicación móvil.',
      'En la sección de valoración del día, arriba, escribes con tus palabras cómo ha ido; no hace falta guardarlo aparte.',
      'No se pueden añadir entradas nuevas a un día pasado. Las existentes sí se editan, o se traen al presente con "mover a hoy".'
    ],
    tips: [
      'Haz clic derecho en una tarea de la EDT y elige "Añadir a la agenda": aterriza aquí con su propia fecha.',
      'Deshacer y rehacer no funcionan en la agenda; no guarda historial.',
      'La lista bajo el calendario muestra tus próximas entradas; empieza por ahí si no sabes qué día abrir.'
    ],
    seo: {
      name: 'Agenda diaria',
      title: 'Agenda diaria con revisión del día | Klarsti',
      description:
        'Escribe el día por la mañana y repásalo por la noche. Tu agenda es privada y no se comparte al compartir un proyecto.',
      keywords: 'agenda diaria, planificador diario, revisión del día, lista de tareas, agenda online'
    },
    example: {
      title: 'Ejemplo: un martes cargado',
      intro:
        'Tres reuniones, una entrega y todo lo demás encajado entre medias. Cinco minutos por la mañana escribiendo el día evitan pasar la tarde discutiendo contigo mismo sobre qué se hizo.',
      blocks: [
        {
          heading: 'Hoy sin falta',
          items: [
            'Terminar la presentación del cliente (antes de la reunión de las 14:00)',
            'Enviar las aprobaciones de facturas',
            'Dar de alta los accesos de la persona nueva',
          ]
        },
        {
          heading: 'Si da tiempo',
          items: [
            'Leer el informe de la semana pasada',
            'Llamar al proveedor',
            'Ordenar el escritorio',
          ]
        },
        {
          heading: 'Revisión del día',
          items: [
            'La presentación se terminó, pero a las 13:50, demasiado justo',
            'Las aprobaciones de facturas se olvidaron — mañana lo primero',
            'Conseguí dos horas seguidas sin interrupciones por la tarde',
            'Mañana agrupo las reuniones después de comer',
          ]
        },
      ],
      outcome:
        'El valor no está en la lista sino en la revisión. Después de una semana escribiéndola aparece la misma línea una y otra vez: el trabajo se está metiendo entre reuniones. Eso no se puede arreglar hasta que se ve.'
    },
    faq: [
      {
        q: '¿Para qué sirve la agenda diaria?',
        a:
          'Para escribir el día al empezar y repasarlo al terminar. Tiene dos mitades: el plan y la revisión del día. Sin la segunda se convierte en una lista de tareas; el valor está en darte cuenta de que el mismo error se repite.'
      },
      {
        q: '¿Puede verla alguien más?',
        a:
          'No. La agenda y la revisión del día son personales. No se guardan dentro de tus proyectos sino en tu propio registro, así que compartir un proyecto con tu equipo no comparte tu agenda.'
      },
      {
        q: '¿Cuántas cosas debo apuntar?',
        a:
          'No más de tres en la lista de lo imprescindible. Las listas más largas terminan cada día sin acabar y al cabo de un tiempo dejas de mirarlas. Lo demás va al segundo grupo: bien si sale, y el día no es un fracaso si no sale.'
      },
      {
        q: '¿Qué escribo en la revisión del día?',
        a:
          'No lo que hiciste, sino lo que notaste. «Terminé la presentación» no aporta información; «la presentación se fue al límite porque la reunión de la mañana se alargó» te sirve la semana que viene.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo.'
      },
    ]
  },
  gantt: {
    title: "Diagrama de Gantt",
    summary: "Una herramienta de planificación que coloca el trabajo como barras horizontales sobre un calendario. Qué empieza cuándo, cuánto dura y qué espera a qué, todo en una pantalla.",
    whenToUse: [
      "Para atar el trabajo a fechas y dejar claros los inicios.",
      "Para mostrar el orden y las tareas que dependen unas de otras.",
      "Para ver pronto lo que se está retrasando."
    ],
    steps: [
      "Un proyecto puede tener varios diagramas. Con el menú de arriba a la izquierda creas uno o cambias de uno a otro.",
      "Añade filas con \"Añadir tarea\". Doble clic en el nombre para cambiarlo.",
      "Al seleccionar una fila se abre la barra de detalle abajo: inicio, fin, avance y estado.",
      "Arrastra una barra para mover las fechas; tira de un extremo para alargarla o acortarla.",
      "El botón de sangría convierte una fila en subtarea de la anterior. La barra de una tarea madre se calcula sola.",
      "El botón de dependencia crea el vínculo \"no empieza antes de\"; se dibuja una flecha entre las barras."
    ],
    tips: [
      "Para marcas sin duración usa hito: en lugar de barra aparece un rombo.",
      "La línea roja marca hoy. Lo que no está terminado y ya pasó su fecha sale con borde rojo.",
      "Día / semana / mes comprimen o abren el calendario. La vista de mes cabe un plan largo en una pantalla."
    ],
    seo: {
      name: 'Diagrama de Gantt',
      title: 'Crear un diagrama de Gantt — calendario del proyecto | Klarsti',
      description:
        'Coloca las tareas en el calendario y ve qué corre en paralelo y dónde falta margen. Con ejemplo de ocho semanas, gratis.',
      keywords: 'diagrama de gantt, crear diagrama de gantt, gantt online, cronograma de proyecto, gantt ejemplo'
    },
    example: {
      title: 'Ejemplo: rehacer un sitio web',
      intro:
        'El trabajo tiene que caber en ocho semanas. Quién empieza cuándo, y qué tarea espera a cuál, no está claro. Poner las tareas sobre un calendario hace visibles los choques.',
      blocks: [
        {
          heading: 'Tareas y semanas',
          items: [
            'Inventario de contenidos — semana 1',
            'Diseño — semanas 2 y 3',
            'Redacción — semanas 2 a 5',
            'Desarrollo — semanas 4 a 7',
            'Carga de contenidos — semanas 6 y 7',
            'Pruebas y lanzamiento — semana 8',
          ]
        },
        {
          heading: 'Preguntas que salieron',
          items: [
            'Desarrollo empieza en la semana 4 pero diseño acaba en la 3: cero margen',
            'La carga espera a la redacción, que acaba en la semana 5: muy justo',
            'Solo una semana para pruebas, así que cualquier fallo mueve el lanzamiento',
            '¿Redacción y diseño son la misma persona?',
          ]
        },
      ],
      outcome:
        'Lo que produjo el diagrama no fue un plan sino los riesgos del plan. Ocho semanas funcionan sobre el papel, pero no hay margen en ningún sitio. Un Gantt no sirve para inventar duraciones: sirve para enseñarte dónde falta el colchón.'
    },
    faq: [
      {
        q: '¿Qué es un diagrama de Gantt?',
        a:
          'Un gráfico que coloca las tareas como barras horizontales sobre un calendario. La longitud de la barra es la duración y su posición, cuándo ocurre el trabajo. De un vistazo se ve qué tareas corren a la vez.'
      },
      {
        q: '¿Cómo se hace un diagrama de Gantt?',
        a:
          'Primero saca las tareas y luego llévalas al calendario. El orden correcto es: monta una EDT, estima cada elemento, anota las dependencias y después dibuja. Un Gantt sin desglose previo solo hace que una lista incompleta parezca ordenada.'
      },
      {
        q: '¿Qué es una dependencia?',
        a:
          'Si una tarea no puede empezar hasta que otra termine, hay una dependencia entre ellas. En el Gantt forman cadenas, y la cadena más larga marca la duración real del proyecto: cada retraso en esa cadena mueve la entrega directamente.'
      },
      {
        q: '¿En qué se diferencia de una hoja de ruta?',
        a:
          'El Gantt ata las tareas a días y semanas y es para el equipo que ejecuta. La hoja de ruta es más gruesa —trimestres o meses— y comunica intención; suele ir a dirección o a clientes, no al equipo de entrega.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para hacer un diagrama de Gantt.'
      },
    ]
  },

  roadmap: {
    title: "Hoja de ruta",
    summary: "Un mapa que divide un tema en pasos sucesivos, con los subtemas colgando de cada paso. Nunca arrastras las casillas: el mapa se ordena solo después de cada cambio. A diferencia de la estructura de desglose, aquí se sigue el avance: cada casilla tiene un estado y la franja superior dice cuánto llevas hecho.",
    whenToUse: [
      "Para ordenar un tema en secuencia de aprendizaje y saber dónde te quedaste.",
      "Para planificar paso a paso los primeros meses de alguien que se incorpora.",
      "Para enseñar en una sola pantalla por qué fases pasa un trabajo.",
      "Para desglosar un programa de formación en temas y adjuntar el material."
    ],
    steps: [
      "Una carpeta puede tener varias hojas de ruta. Desde el menú de arriba a la izquierda creas una nueva y cambias entre ellas.",
      "El trazado principal va de principio a fin. Selecciona un paso y pulsa Intro para añadir el siguiente.",
      "Con un paso seleccionado, Tab le cuelga un tema. Sobre un tema, Tab crea un subtema y Intro uno del mismo nivel.",
      "El círculo del principio de la casilla cambia el estado: Sin empezar → En curso → Hecho → Omitido. El color va detrás.",
      "Clic derecho en una casilla y «Detalles» abre el panel lateral: nota, tiempo estimado y enlaces.",
      "Para dividir una hoja de ruta larga, añade un título de sección desde el menú contextual (Inicial / Medio / Avanzado, por ejemplo).",
      "Si haces opcional un tema, se conecta con línea discontinua y queda fuera del porcentaje.",
      "El botón de giro de la franja pasa el trazado de vertical a horizontal; así una hoja larga se lee bien en pantalla ancha."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "Paso nuevo en el trazado" },
      { keys: ["Tab"], desc: "Tema bajo la casilla seleccionada" },
      { keys: ["F2"], desc: "Cambiar el nombre de la casilla" },
      { keys: ["Delete"], desc: "Eliminar la casilla seleccionada" },
      { keys: ["Shift", "Enter"], desc: "Salto de línea al escribir" },
      { keys: ["Esc"], desc: "Cerrar el campo de texto" },
      { keys: ["Mod", "Z"], desc: "Deshacer" },
      { keys: ["Mod", "Y"], desc: "Rehacer" }
    ],
    tips: [
      "Las casillas no se arrastran, la disposición es automática. Para cambiar el orden de un paso usa las opciones del menú contextual.",
      "Los temas alternan de lado entre un paso y otro, para que el mapa no crezca hacia un solo lado.",
      "Las casillas omitidas cuentan como terminadas: un tema que decides no hacer no debe frenar el porcentaje para siempre.",
      "Las horas que anotas se suman; la franja muestra el total que queda en las casillas sin terminar.",
      "La dirección debe empezar por http o https; en otro caso no se acepta."
    ],
    seo: {
      name: 'Hoja de ruta',
      title: 'Crear una hoja de ruta de producto | Klarsti',
      description:
        'Divide el próximo periodo en etapas y escribe también lo que no vais a hacer. Con ejemplo de seis meses, gratis.',
      keywords: 'hoja de ruta, roadmap producto, hoja de ruta proyecto, roadmap ejemplo, plantilla hoja de ruta'
    },
    example: {
      title: 'Ejemplo: hoja de ruta a seis meses de una app móvil',
      intro:
        'El equipo cambia de dirección con cada idea nueva y dirección no sabe qué llega ni cuándo. Seis meses se parten en tres etapas gruesas. El objetivo no es prometer fechas sino fijar el orden.',
      blocks: [
        {
          heading: 'Etapa 1 — Asentar la base',
          items: [
            'Reducir a la mitad el tiempo de arranque',
            'Arreglar las pantallas que se cierran solas',
            'Simplificar el registro',
          ]
        },
        {
          heading: 'Etapa 2 — Retener',
          items: [
            'Ajustes de notificaciones',
            'Modo sin conexión',
            'Buzón de sugerencias',
          ]
        },
        {
          heading: 'Etapa 3 — Crecer',
          items: [
            'Invitar a un amigo',
            'Segundo idioma',
            'Base para el plan de pago',
          ]
        },
        {
          heading: 'Lo que no vamos a hacer',
          items: [
            'Diseño para tableta',
            'Versión de escritorio',
            'Funciones de IA',
          ]
        },
      ],
      outcome:
        'El cuadro más útil de la hoja de ruta es el último. Escribir lo que vas a hacer no termina la discusión; escribir lo que no vas a hacer este periodo, sí.'
    },
    faq: [
      {
        q: '¿Qué es una hoja de ruta de producto?',
        a:
          'Un plan de alto nivel que muestra hacia dónde va un producto o un trabajo en el periodo que viene, y en qué orden. No es una lista de tareas: comunica intención y secuencia.'
      },
      {
        q: '¿Debe llevar fechas?',
        a:
          'Las fechas exactas suelen hacer daño: fallas una y se va con ella la credibilidad de toda la hoja de ruta. Los trimestres, o una estructura de «ahora / siguiente / más adelante», aguantan mucho mejor. Si de verdad necesitas una fecha exacta, ese elemento pertenece a un Gantt, no a una hoja de ruta.'
      },
      {
        q: '¿Cada cuánto se actualiza?',
        a:
          'Revisarla una vez al mes le sirve a casi cualquier equipo. Una hoja de ruta que cambia cada semana no es una hoja de ruta; una que no cambia nunca ha perdido el contacto con la realidad. Lo importante no es el cambio, sino escribir por qué cambió.'
      },
      {
        q: '¿Por qué hace falta una lista de lo que no se hará?',
        a:
          'Porque casi todas las preguntas que atrae una hoja de ruta tienen la forma «¿y qué pasa con X?». Enumerar lo que has dejado fuera a propósito las responde de antemano y evita que el equipo repita la misma discusión cada semana.'
      },
      {
        q: '¿Es gratis?',
        a:
          'Sí. Klarsti es gratuito y sin publicidad ahora mismo, y no necesitas cuenta para montar una hoja de ruta.'
      },
    ]
  }
};

export default guides;
