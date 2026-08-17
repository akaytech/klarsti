import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Mind Map',
    summary:
      'A free-association tool where ideas branch out from a single centre. You never move the boxes yourself; the map re-arranges itself after every addition, so you stay focused on the content instead of the layout.',
    whenToUse: [
      'Brainstorming, when you want ideas out fast and the hierarchy is not clear yet.',
      'Breaking a topic into sub-headings to see its full scope.',
      'Taking meeting, lecture or book notes without losing the thread.',
      'Collecting raw ideas before moving on to a work breakdown.'
    ],
    steps: [
      'A project can hold several maps. Use the map menu at the top left to create a new map or switch between them.',
      'Select the root box in the middle and press F2 to rename it; put the topic here.',
      'Press Tab on the selected box to open a new branch beneath it. The new box opens ready for typing.',
      'Enter creates a sibling branch at the same level. It also works while typing: finish the text, press Enter, and the next box opens.',
      'Right-click a box to add a description, mark the branch as done, or collapse it when it gets crowded.',
      'The mini map at the bottom right shows where you are; drag on it to move around large maps.'
    ],
    shortcuts: [
      { keys: ['Tab'], desc: 'New branch under the selected box' },
      { keys: ['Enter'], desc: 'Sibling branch at the same level' },
      { keys: ['F2'], desc: 'Rename the selected box' },
      { keys: ['Delete'], desc: 'Delete the selected branch (the root cannot be deleted)' },
      { keys: ['Shift', 'Enter'], desc: 'New line while typing' },
      { keys: ['Esc'], desc: 'Close the text field' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Boxes cannot be dragged; the layout is automatic. To move a branch elsewhere, delete it and recreate it in the right place.',
      'Branch colours follow the main branch coming off the root, so the same colour means the same top-level heading.',
      'Delete and F2 do not fire while you are inside a text field; finish with Enter or Esc first.'
    ]
  },

  wbs: {
    title: 'Work Breakdown Structure (WBS)',
    summary:
      'A tree with three levels: the PROJECT on top, PHASES under it, and WORK PACKAGES under the phases. Every box carries a status, a due date, working hours and a description. Unlike a mind map, here you are managing work, not ideas.',
    whenToUse: [
      'Breaking a project down until it is clear who does what.',
      'Fixing the scope: work that is not on the tree is not in the project.',
      'Tying work to dates and tracking progress through statuses.'
    ],
    steps: [
      'A tree holds one project box. For a second project, open a new tree from the "Trees" menu on the left.',
      'The add button at the bottom follows your selection: with the project selected it says "Add phase", with a phase or work package selected it says "Add work package". With nothing selected it adds a phase under the project.',
      'To do the same with the keyboard, Ctrl-click a box: it opens a new one underneath.',
      'A plain click selects the box, expands or collapses the branches below it, and centres the camera on it.',
      'Right-click a box to set its name, due date, start and end time, description and status (To Do / In Progress / Done / Failed).',
      'The same menu has "Add to Agenda", which moves the item into your agenda on the chosen date. It warns you if the date is already in the past.',
      'Mark an item as Failed and the menu offers "analyze root cause"; one click sends it to the 5 Whys tool as a problem.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Click'], desc: 'On the project box: add a phase under it' },
      { keys: ['Mod', 'Click'], desc: 'On a phase or work package: add a work package under it' },
      { keys: ['Shift', 'Drag'], desc: 'Move a box together with every branch below it' },
      { keys: ['Delete'], desc: 'Delete the selected box' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'What sits under a work package is a work package too; the breakdown can go as deep as you need.',
      'Drag without Shift and only the box you grabbed moves; everything below it stays put.',
      'Keep breaking work down until each work package is small enough for one person to finish alone.',
      'To clear a date, use the small cross next to the date field in the right-click menu; the times are cleared with it.'
    ]
  },

  '5whys': {
    title: '5 Whys',
    summary:
      'Asking "and why did that happen?" over and over to get from the visible symptom down to the root cause. Five is not a rule but a rough measure: once your answers start repeating themselves, you have hit bottom.',
    whenToUse: [
      'Finding the real cause of a failure instead of treating the symptom.',
      'Post-incident reviews, where the point is the cause and not the culprit.',
      'Recording why a WBS task failed.'
    ],
    steps: [
      'The menu at the top left switches between analyses in the same project, and lets you add, rename or delete one.',
      'Start with "Add problem" on the empty screen and state what happened in one sentence. There is also a ready-made example if you want to see the tool first.',
      'Ctrl-click a box to open a new "why" box under it. Write the answer there, then do the same on that box.',
      'When you cannot go deeper, Shift-click that box to create a root-cause box. Root-cause boxes take no children; the chain ends there.',
      'Right-click boxes to edit or delete them.',
      'Ctrl-click empty space to start a second, independent problem chain on the same canvas.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Click'], desc: 'On a box: add a new why beneath it' },
      { keys: ['Shift', 'Click'], desc: 'On a box: create a root-cause box' },
      { keys: ['Mod', 'Click'], desc: 'On empty space: new problem' },
      { keys: ['Delete'], desc: 'Delete the selected box' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Starting a root cause analysis from a task in the work breakdown opens a separate analysis for that task; it does not overwrite the open one.',
      'A cause can have more than one answer; Ctrl-click the same box repeatedly to branch it.',
      'Ground every answer in something verifiable. "Carelessness" is not a root cause, it is an unanswered question.',
      'A WBS task marked as failed can be sent here as a problem straight from its right-click menu.'
    ]
  },

  flowchart: {
    title: 'Flowcharts',
    summary:
      'Draw the steps, decision points and direction of a process. There are three chart types: workflow, process flow and data flow. The type you pick determines which box shapes are available.',
    whenToUse: [
      'Workflow chart: to show tasks, decisions, approvals and who performs them.',
      'Process flow chart: to analyse a production or service process through operation, transport, inspection, delay and storage steps.',
      'Data flow chart: to map how data moves between external entities, processes and data stores.'
    ],
    steps: [
      'The type picker appears the first time you open the tool. You can change the type later; boxes are converted to the closest equivalent in the new type.',
      'The chart menu at the top left lets you keep several charts in the same project and switch between them.',
      'Right-click a box: when adding a box beneath it you also choose its shape (start, process, decision, document, end...). The same menu edits the text or deletes the box.',
      'Drag boxes wherever you want; there is no automatic layout here, the arrangement is yours.',
      'To draw a connection, drag from a connection point on the edge of one box to another box.',
      'Zoom with the controls at the bottom left and navigate large charts with the mini map at the bottom right.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Delete the selected box or connection' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Label every path leaving a decision box; the reader must see which condition leads where.',
      'If a chart no longer fits on one screen, split it: move a crowded section into a subprocess box and draw it as a separate chart.',
      'The Role box in a workflow chart is there to show who performs a step; leave it out if you want to describe the process independently of people.'
    ]
  },

  orgchart: {
    title: 'Organisation Charts',
    summary:
      'Shows who reports to whom and where each unit sits. There are seven chart types: hierarchical, functional, divisional, matrix, flat, team-based and network. The type determines both the available box kinds and how connections are drawn.',
    whenToUse: [
      'Recording the current structure and spotting vacancies and duplication.',
      'Discussing a reorganisation by drawing the same team in different chart types and comparing them.',
      'Making dual reporting explicit in a matrix chart, or outside partners visible in a network chart.'
    ],
    steps: [
      'You pick the chart type the first time you open the tool. It can be changed later; boxes are converted to the closest equivalent and the layout is preserved.',
      'The chart menu at the top left lets you keep several charts in one project (for example current structure and target structure).',
      'Right-click a box to add a position, unit, team or vacant role beneath it. The same menu edits the name and the title underneath it.',
      'Drag boxes to arrange them as you like.',
      'Normal connections are drawn from the top and bottom points of a box: this is the primary reporting line.',
      'Lines drawn from the side points appear dashed and mean secondary reporting (available in the matrix, hierarchical and network charts).'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Delete the selected box or connection' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'The vacant-role box keeps unfilled positions visible, so the chart doubles as a hiring plan.',
      'Use the second line of a box for the title: the name of the person or unit on top, the role underneath.',
      'Do not mix the two line styles: a solid line says who you report to, a dashed line says who you work with.'
    ]
  },

  swot: {
    title: 'SWOT Analysis',
    summary:
      'Reads an idea, project or organisation through four windows: what is good and bad inside, what opportunities and threats exist outside. The point is not to produce four lists but to connect them into a strategy.',
    whenToUse: [
      'Getting a complete picture of where you stand before committing to something.',
      'Assessing your current position ahead of an annual plan or budget.',
      'Evaluating where you sit against a competitor.',
      'Building a shared picture with a team: everyone looks at the same four boxes.'
    ],
    steps: [
      'Type a name for the analysis at the top and press Create. A project can hold several SWOTs.',
      'Four boxes appear: Strengths, Weaknesses, Opportunities, Threats.',
      'Type an item in the field under a box and press Enter, or click the plus button.',
      'Click an existing item to edit it in place; changes are saved automatically.',
      'The bin icon on an item deletes that item; the one in the header deletes the whole analysis.',
      'To see how it works, load the ready-made example from the screen shown when there is no analysis yet.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Add the item you typed to the box' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Strengths and weaknesses are internal — things within your control; opportunities and threats are external. A SWOT that confuses the two is useless.',
      'The real work is pairing the boxes: which strength catches which opportunity, which weakness exposes you to which threat.',
      'Filling one box with ten items and leaving another empty is not analysis, it is taking sides.'
    ]
  },

  ishikawa: {
    title: 'Fishbone Diagram',
    summary:
      'Collects the possible causes of a problem under six headings: Manpower, Machine, Material, Method, Measurement and Milieu. The fish head is the problem, the bones are cause groups. The point is to sweep every area rather than look for the cause in one place.',
    whenToUse: [
      'When it is not clear where the cause lies and you want to sweep without skipping an area.',
      'In team brainstorming, so everyone contributes from their own domain.',
      'Collecting candidate causes before going into 5 Whys.'
    ],
    steps: [
      'Write the problem in one sentence at the top and press Start.',
      'Six category boxes appear. Type a possible cause in the field under a box and press Enter.',
      'Edit the problem statement from the header and the items in place inside their boxes.',
      'A project can hold several analyses; each becomes its own card with its own problem statement.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Add the cause you typed to the category' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'You do not have to fill every category; a category left empty is information too.',
      'Write what happened, not the symptom: not "it was late" but "the approval sat for three days".',
      'Take the strongest few candidates into the 5 Whys tool. Ishikawa gives breadth, 5 Whys gives depth.'
    ]
  },

  pdca: {
    title: 'PDCA Cycle',
    summary:
      'Plan, Do, Check, Act. Runs an improvement as a turning wheel rather than a one-off task: each round starts from the result of the previous one.',
    whenToUse: [
      'Trying a small change, measuring the result, then rolling it out.',
      'Recording whether a countermeasure actually worked.',
      'Tracking rounds in teams running continuous improvement.'
    ],
    steps: [
      'Write the goal of the cycle at the top and press Start.',
      'Four phase boxes appear. Add your items in the field under each phase.',
      'Click the circle to the left of an item to mark it complete; it gets struck through.',
      'A project can hold several cycles; each goal becomes its own card.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Add the item you typed to the phase' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Put something measurable in the Check phase. If "did it improve?" has no number behind it, the cycle never closes.',
      'What comes out of the Act phase is the input to the Plan phase of the next cycle.',
      'Do not try to fill all four boxes at once; going in order is the method itself.'
    ]
  },

  waterfall: {
    title: 'Waterfall Model',
    summary:
      'Splits a project into six phases run in order: Requirements, High-Level Design, Low-Level Design, Implementation, Verification, Maintenance. The next phase does not open until the current one closes, and a closed phase is locked.',
    whenToUse: [
      'Work where the requirements are known up front and will not change along the way.',
      'Projects needing approvals and documentation, where each phase must be on record.',
      'Work where the order itself matters: production must not start before design is finished.'
    ],
    steps: [
      'Write the project name at the top and press Start.',
      'The six phases stack up. Only the open phase accepts items; later phases are marked with a padlock.',
      'When the phase is done, press the "complete this phase" button under the box.',
      'After you confirm, the next phase opens; the completed one gets a tick and its items can no longer be changed.',
      'A project can hold several waterfall projects.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Add the item you typed to the phase' },
      { keys: ['Mod', 'Z'], desc: 'Undo (also reverts a completed phase)' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'There is no button to reopen a phase; if you completed one by mistake, undo is the only way back.',
      'Make sure a phase is genuinely finished before closing it — closing locks the text as well.',
      'If requirements will shift along the way, waterfall boxes you in; WBS or PDCA works more comfortably there.'
    ]
  },

  fta: {
    title: 'Fault Tree Analysis (FTA)',
    summary:
      'An undesired event sits at the top, and beneath it the conditions that must combine for it to happen. The tree is built from logic gates; enter probabilities on the basic events and the probability of the top event is calculated for you.',
    whenToUse: [
      'Seeing which combinations of conditions can produce a failure or accident.',
      'Talking about risk in numbers: how much each branch contributes to the total.',
      'Showing which branch a given safety measure cuts.'
    ],
    steps: [
      'The menu at the top left switches between trees in the same project, and lets you add, rename or delete one.',
      'Create the top-event box on the empty screen, or load the ready-made example.',
      'Right-click a box and use Edit to set its name, description and — on basic events — its probability.',
      'From the same menu add an event beneath it: event, basic event, undeveloped event or conditioning event.',
      'From that menu you also add logic gates: AND, priority AND, OR, exclusive OR or inhibit.',
      'Enter probabilities as percentages on the basic events; the gates above and the top event are computed from them.',
      'Drag boxes to arrange them and use the mini map at the bottom right to navigate a large tree.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Delete the selected box' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'An AND gate multiplies the probabilities below it — everything must happen, so the result shrinks. An OR gate needs only one, so the result grows.',
      'Branches without a probability are not counted; the number at the top only covers the data you entered.',
      'Basic events are circles, undeveloped events are diamonds: marking the branches you did not dig into keeps the tree honest.'
    ]
  },

  vsm: {
    title: 'Value Stream Mapping (VSM)',
    summary:
      'Draws the end-to-end flow of a product or a job together with the waiting and inventory in between. The point is to see how much of the total time actually adds value — usually far less than people assume.',
    whenToUse: [
      'To find where a process waits and where work piles up.',
      'To see which step cannot keep up with customer demand: does anything exceed takt time?',
      'To draw the current state and put a future state next to it for comparison.',
    ],
    steps: [
      'Enter daily demand and shift information in the panel at the top right. Takt time comes from there: how often a piece must come out.',
      'On an empty canvas, create the starter skeleton or start from scratch. Right-click the canvas to add any box.',
      'Write the cycle time with its unit into the process box. If it exceeds takt time the box turns red: that is the bottleneck.',
      'Write the number of waiting pieces into the inventory box; wait time is derived as pieces ÷ daily demand. If you have no count, enter the time directly.',
      'Connect the boxes. Right-click a connection to switch it to push, pull, FIFO, manual information or electronic information. Only material arrows enter the time calculation.',
      'From the menu at the top left, copy the current state as a future state, work on it, and compare the numbers at the bottom.',
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Delete the selected box' },
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Flow efficiency at the bottom is value-adding time over total lead time. Single digits are normal; what needs shortening is the waiting, not the work.',
      'If you leave inventory off the map, the total time looks better than it is — that is where the real information hides.',
      'Boxes not connected to the chain are excluded from the totals and counted as a warning below. Connect the flow as a single line.',
      'Put a kaizen burst where you intend to improve; that is how a future state map is read.',
    ]
  },

  pareto: {
    title: 'Pareto Analysis',
    summary:
      'Most of the effect comes from a few of the causes. Sorts categories by frequency from largest to smallest and draws a cumulative percentage curve on top, so the handful of items behind most of the problem becomes visible.',
    whenToUse: [
      'Deciding which of many complaints, defects or cost items to tackle first.',
      'Showing where an improvement will pay off most.',
      'Arguing for concentrating resources on a few points rather than spreading them.'
    ],
    steps: [
      'Create the analysis on first open. Use the list at the top to switch between analyses in the project, the pencil to rename, the bin to delete.',
      'Enter the category name and its frequency in the table on the left panel.',
      'Use the add button below the table for a new row.',
      'The chart updates instantly: bars sort from largest to smallest and the curve shows the cumulative percentage.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'You can enter cost or lost time instead of frequency, as long as every row uses the same unit.',
      'Stop where the curve flattens: the long tail on the right is the part not worth chasing.',
      'Slice the categories too finely and nothing stands out — the chart just flattens. Merge similar items.'
    ]
  },

  histogram: {
    title: 'Histogram',
    summary:
      'Shows the distribution of a measurement: where values gather, whether the spread is symmetric, whether anything sits at the edges. You give raw measurements, it bins them, and with specification limits it also computes process capability.',
    whenToUse: [
      'To see what the average hides: the same mean can come from very different distributions.',
      'To judge how consistently a process runs — a narrow spread means consistent, a wide one means erratic.',
      'To see how often measurements fall outside specification and whether the process can meet demand.',
    ],
    steps: [
      'Create the analysis; switch between analyses in the same project from the list at the top.',
      'Type the measurements into the box on the left, or paste a list as is. One value per line; decimals may use a comma or a dot.',
      'The tool picks the number of classes itself (Sturges rule). Override it with your own number if you prefer.',
      'Enter the lower and upper specification limits. They appear as red dashed lines and out-of-spec columns turn red.',
      'Below you get count, mean, standard deviation and range; with both limits entered, Cp and Cpk as well.',
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'The grey curve is a normal distribution with the same mean and deviation. Columns departing clearly from it point to a special cause.',
      'A two-peaked distribution usually means two different processes (two shifts, two machines) got mixed into one table.',
      'Cpk of 1.33 and above is generally considered capable; below 1 means the process cannot hold the limits.',
      'Good Cp with poor Cpk means the spread is tight but the mean has drifted — an adjustment fixes it, no need to narrow the distribution.',
    ]
  },

  decision: {
    title: 'Decision Matrix',
    summary:
      'Scores several options against the same criteria. Each criterion carries a weight; an option\'s total is the sum of its score × weight products.',
    whenToUse: [
      'When you are stuck between a few alternatives and the "which is better" argument keeps going in circles.',
      'When the reasoning behind a decision has to be left on record.',
      'When everyone on the team is quietly weighing a different criterion: the matrix brings those criteria out.'
    ],
    steps: [
      'Add criteria: the headings you will compare on (cost, time, risk...).',
      'Give each criterion a weight from 1 to 5 — how much that heading matters to you.',
      'Add options: the alternatives you are comparing.',
      'Score each option against each criterion from 0 to 10 in the table.',
      'Totals are calculated automatically and the highest-scoring option is marked with a trophy.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Undo' },
      { keys: ['Mod', 'Y'], desc: 'Redo' }
    ],
    tips: [
      'Set the weights before you start scoring. Adjusting them afterwards is not deciding, it is producing the answer you wanted.',
      'The matrix does not decide for you; it makes visible what you decided on.',
      'If two totals come out very close, the answer is not "equal" but "these criteria do not separate them" — look for a missing criterion.'
    ]
  },

  notepad: {
    title: 'Agenda',
    summary:
      'A personal space where you pick days from the calendar and plan them. Unlike the other tools, the agenda is not project data: the entries are yours and do not travel to anyone when you share a project.',
    whenToUse: [
      'Laying out the day and placing work into hours.',
      'Pulling a WBS task onto a specific day.',
      'Writing down in your own words how the day went as you close it.'
    ],
    steps: [
      'Days with entries are marked on the calendar; click a day to open its flow.',
      'For a new entry, write the title and the text. Give it a time range or leave it as all-day.',
      'If you set a time range that clashes with another entry, you get a conflict warning.',
      'You can set a reminder: at the time, 5 / 15 / 30 minutes, 1 hour or 1 day before. Reminders arrive as notifications in the mobile app.',
      'Use the end-of-day review section at the top to write about the day in your own words; you do not need to save it separately.',
      'You cannot add a new entry to a past day. Existing entries can still be edited, or pulled forward with "move to today".'
    ],
    tips: [
      'Right-click a WBS task and choose "Add to Agenda" and it lands here with its own date.',
      'Undo and redo do not work in the agenda; it does not keep a history.',
      'The list under the calendar shows your upcoming entries; start there if you do not know which day to open.'
    ]
  },
  gantt: {
    title: "Gantt Chart",
    summary: "A planning tool that lays work out as horizontal bars on a calendar. What starts when, how long it takes and what waits for what — all on one screen.",
    whenToUse: [
      "To tie work to dates and make start times explicit.",
      "To show the order of the work and the steps that wait on each other.",
      "To spot work falling behind while there is still time."
    ],
    steps: [
      "A project can hold several charts. Use the menu at the top left to add one or switch between them.",
      "Add rows with \"Add task\". Double-click a row name to change it.",
      "Selecting a row opens the detail bar below: start, end, progress and status live there.",
      "Drag a bar to shift its dates; drag either edge to make it longer or shorter.",
      "The indent button turns a row into a subtask of the one above. A parent bar is computed from its children and cannot be edited by hand.",
      "The dependency button links \"cannot start before\"; an arrow is drawn between the two bars."
    ],
    tips: [
      "For markers with no duration, switch a task to milestone: it becomes a diamond instead of a bar.",
      "The red line marks today. Unfinished work whose end date has passed gets a red outline.",
      "Day / week / month buttons squeeze or open the calendar. Month view fits a long plan on one screen."
    ]
  },

  roadmap: {
    title: "Roadmap",
    summary: "A map that breaks a subject into a track of steps, with topics hanging off each step. You never drag the boxes; the map lays itself out after every change. What sets it apart from a work breakdown is that it tracks progress: every box has a status and the strip at the top tells you how much of the map is done.",
    whenToUse: [
      "To lay a subject out in learning order and keep track of where you left off.",
      "To plan a new hire’s first months step by step.",
      "To show on one screen which stages a piece of work goes through.",
      "To break a training programme into topics and attach the material to each."
    ],
    steps: [
      "A folder can hold several roadmaps. Open a new one from the menu at the top left and switch between them there.",
      "The main track runs from start to finish. Select a step and press Enter to add the next one after it.",
      "With a step selected, Tab hangs a topic off it. On a topic, Tab adds a sub-topic and Enter adds a sibling.",
      "The circle at the start of a box changes its status: Not started → In progress → Done → Skipped. The box changes colour with it.",
      "Right-click a box and choose \"Details\" to open the side panel: notes, an estimated time and links go there.",
      "To break a long roadmap up, add a section heading from the right-click menu (Beginner / Intermediate / Advanced, say).",
      "Make a topic optional and it is joined with a dashed line and left out of the progress percentage.",
      "The turn button on the progress strip flips the track from vertical to horizontal; that is how a long roadmap stays readable on a wide screen."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "New step on the track" },
      { keys: ["Tab"], desc: "Topic under the selected box" },
      { keys: ["F2"], desc: "Rename the selected box" },
      { keys: ["Delete"], desc: "Delete the selected box" },
      { keys: ["Shift", "Enter"], desc: "New line while typing" },
      { keys: ["Esc"], desc: "Close the text field" },
      { keys: ["Mod", "Z"], desc: "Undo" },
      { keys: ["Mod", "Y"], desc: "Redo" }
    ],
    tips: [
      "Boxes are never dragged; the layout is automatic. To reorder a step, use the move commands in the right-click menu.",
      "Topics alternate sides from one step to the next, so the map does not pile up on one side.",
      "Skipped boxes count as finished in the progress bar, so a topic you decided against does not hold the percentage down forever.",
      "The hours you enter add up; the strip at the top shows the total left on unfinished boxes.",
      "A link has to start with http or https; anything else is rejected."
    ]
  }
};

export default guides;
