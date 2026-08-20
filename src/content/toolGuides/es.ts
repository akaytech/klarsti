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
    ]
  },

  wbs: {
    title: 'Estructura de Desglose del Trabajo (EDT)',
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
    ]
  },

  '5whys': {
    title: '5 Porqués',
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
      'Clic derecho en una caja: al añadir otra debajo también eliges su forma (inicio, proceso, decisión, documento, fin...). Desde ahí también editas el texto o la borras.',
      'Arrastra las cajas donde quieras; aquí no hay disposición automática, el orden es tuyo.',
      'Para trazar una conexión, arrastra desde un punto del borde de una caja hasta otra.',
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
      'Clic derecho en una caja para añadir debajo un puesto, una unidad, un equipo o una vacante. Desde ahí editas el nombre y el cargo de la línea inferior.',
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
    ]
  },

  swot: {
    title: 'Análisis DAFO (SWOT)',
    summary:
      'Lee una idea, un proyecto o una organización por cuatro ventanas: qué hay bueno y malo dentro, qué oportunidades y amenazas hay fuera. El objetivo no es hacer cuatro listas, sino enlazarlas para sacar una estrategia.',
    whenToUse: [
      'Para ver el conjunto antes de comprometerte con algo.',
      'Antes del plan anual o del presupuesto, para situar dónde estás.',
      'Para valorar tu posición frente a un competidor.',
      'Para construir una imagen común en el equipo: todos miran los mismos cuatro cuadros.'
    ],
    steps: [
      'Escribe arriba el nombre del análisis y pulsa Crear. Un proyecto puede tener varios DAFO.',
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
      'Fortalezas y debilidades son internas, están en tu mano; oportunidades y amenazas son externas. Un DAFO que confunde ambas no sirve.',
      'El trabajo de verdad está en cruzar los cuadros: qué fortaleza aprovecha qué oportunidad, qué debilidad te expone a qué amenaza.',
      'Llenar un cuadro con diez puntos y dejar otro vacío no es analizar, es tomar partido.'
    ]
  },

  ishikawa: {
    title: 'Diagrama de Espina de Pescado',
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
    ]
  },

  pdca: {
    title: 'Ciclo PHVA (PDCA)',
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
    ]
  },

  waterfall: {
    title: 'Modelo en cascada',
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
      'Si los requisitos van a cambiar sobre la marcha, la cascada te aprieta; ahí funcionan mejor la EDT o el PHVA.'
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
    ]
  },

  vsm: {
    title: 'Mapeo del Flujo de Valor (VSM)',
    summary:
      'Dibuja el flujo completo de un producto o trabajo junto con las esperas e inventarios intermedios. El objetivo es ver cuánto del tiempo total realmente agrega valor: casi siempre mucho menos de lo que se cree.',
    whenToUse: [
      'Para encontrar dónde espera un proceso y dónde se acumula el trabajo.',
      'Para ver qué paso no alcanza la demanda del cliente: ¿algo supera el tiempo takt?',
      'Para dibujar el estado actual y poner al lado un estado futuro y compararlos.',
    ],
    steps: [
      'Ingresa la demanda diaria y los turnos en el panel superior derecho. De ahí sale el tiempo takt: cada cuánto debe salir una pieza.',
      'En un lienzo vacío, crea el esqueleto inicial o empieza desde cero. Haz clic derecho en el lienzo para agregar cualquier caja.',
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
    ]
  }
};

export default guides;
