import type { ToolGuideBundle } from './types';

const guides: ToolGuideBundle = {
  mindmap: {
    title: 'Mind map',
    summary:
      'A free-association tool where ideas branch out from a single center. You never move the boxes yourself; the map re-arranges itself after every addition, so you stay focused on the content instead of the layout.',
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
      'Branch colors follow the main branch coming off the root, so the same color means the same top-level heading.',
      'Delete and F2 do not fire while you are inside a text field; finish with Enter or Esc first.'
    ],
    example: {
      title: 'Example: planning an internal training programme',
      intro:
        'An HR team has to build onboarding training and has no idea where to start. Before deciding anything, they dump everything on their mind onto one map. Order and priority come later.',
      blocks: [
        {
          heading: 'Who attends',
          items: [
            'New joiners',
            'Team leads',
            'Remote staff',
            'Field engineers',
          ]
        },
        {
          heading: 'What we teach',
          items: [
            'Product knowledge',
            'Internal systems',
            'Talking to customers',
            'Security rules',
          ]
        },
        {
          heading: 'How we deliver it',
          items: [
            'In-person workshop',
            'Recorded video',
            'Short weekly session',
            'Pairing with a senior',
          ]
        },
        {
          heading: 'How we measure it',
          items: [
            'Quiz at the end',
            'Manager feedback after three months',
            'Time to first solo task',
            'Attendance rate',
          ]
        },
      ],
      outcome:
        'With four branches on the map the gap is obvious: the measurement branch is thin next to the others. The team goes back to it before writing a single slide. That is what a mind map is for — showing you which side is empty.'
    },
    faq: [
      {
        q: 'What is a mind map?',
        a:
          'A way of collecting ideas by putting one topic in the middle and branching outwards. The difference from a list is that a list forces you to think in order, while a map lets you drop each thought onto whichever branch it belongs to. That is why it works better for untangling messy thinking.'
      },
      {
        q: 'What is the difference between a mind map and a work breakdown structure?',
        a:
          'A mind map collects ideas; there are no owners, dates or sequence. A work breakdown structure manages work; every box has a status, a due date and a duration. The usual order is mind map first, then WBS once the scope has settled.'
      },
      {
        q: 'Can I drag the boxes around?',
        a:
          'No, the layout is automatic. To move a branch, delete it and add it again in the right place. This is deliberate: time spent aligning boxes is time taken away from thinking.'
      },
      {
        q: 'How many branches should a mind map have?',
        a:
          'There is no limit, but more than seven or eight at the same level becomes unreadable. When you get there, group similar branches under a new parent and the map becomes legible again.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now. You do not even need an account to try the mind map — you can start drawing straight from the trial screen.'
      },
    ]
  },

  wbs: {
    title: 'Work breakdown structure',
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
      'A plain click only selects the box. To expand or collapse the branches below it, DOUBLE-click the box; the camera centers on it too. (Double-clicking the name edits the name instead.)',
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
    ],
    example: {
      title: 'Example: opening a coffee shop',
      intro:
        'Six months until opening day. The job looks big and there is no obvious place to grab it. Split into three phases, each phase produces concrete work packages that one person can own.',
      blocks: [
        {
          heading: '1. Site and permits',
          items: [
            'Survey rents in three neighbourhoods',
            'Sign the lease',
            'Business licence',
            'Food handling permit',
          ]
        },
        {
          heading: '2. Fit-out',
          items: [
            'Interior drawings',
            'Building work',
            'Espresso machine and grinder',
            'Tables, chairs, counter',
          ]
        },
        {
          heading: '3. Launch',
          items: [
            'Hire two baristas',
            'Menu and pricing',
            'Supplier agreements',
            'Opening announcement',
          ]
        },
      ],
      outcome:
        'Twelve work packages. The scope is now fixed: work that is not on this tree is not in the project. The sequence also became visible — the fit-out cannot start before the permit lands, which makes phase one the risky one.'
    },
    faq: [
      {
        q: 'What is a work breakdown structure (WBS)?',
        a:
          'A tree that splits a project until every piece is small enough to hand to one person. The project sits at the top, phases below it, work packages below those. Its purpose is not to shrink the work but to make the scope visible: work that is not on the tree is not in the project.'
      },
      {
        q: 'How many levels should a WBS have?',
        a:
          'Three levels cover most work: project, phase, work package. The rule of thumb is simple — if you can look at a box and answer "who does this, and how long does it take", you can stop splitting. If you cannot, go one level deeper.'
      },
      {
        q: 'What is the difference between a WBS and a Gantt chart?',
        a:
          'A WBS answers "what has to be done". A Gantt chart answers "when". The correct order is breakdown first, calendar second. A Gantt chart drawn without a breakdown is a half-remembered task list on a timeline.'
      },
      {
        q: 'How big should a work package be?',
        a:
          'A common measure is what one person can finish in one to two weeks. Any bigger and you cannot track progress; any smaller and the tree fills up with noise.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build a work breakdown structure.'
      },
    ]
  },

  '5whys': {
    title: '5 Whys analysis',
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
    ],
    example: {
      title: 'Example: order confirmation emails are not arriving',
      intro:
        'Support has had the same complaint for three days. The first instinct is "let\'s switch email providers". Asking why five times shows the problem is somewhere else entirely.',
      blocks: [
        {
          heading: 'Problem',
          items: [
            'Customers are not receiving order confirmation emails.',
          ]
        },
        {
          heading: 'The chain',
          items: [
            'Why? The emails land in spam.',
            'Why? Our sending domain looks unverified.',
            'Why? A verification record is missing from the DNS settings.',
            'Why? It was not copied across when the server was migrated.',
            'Why? The migration checklist has no line for it.',
          ]
        },
        {
          heading: 'Root cause',
          items: [
            'The server migration checklist is incomplete.',
          ]
        },
        {
          heading: 'Countermeasures',
          items: [
            'Added the missing record (today\'s problem is fixed).',
            'Added domain verification to the migration checklist.',
            'Made the checklist independent of who runs the migration.',
          ]
        },
      ],
      outcome:
        'The first instinct was to change email provider: money spent, problem still there. The real root cause was one missing line in a checklist. Making that difference visible is the whole job of the five whys.'
    },
    faq: [
      {
        q: 'What is 5 Whys analysis?',
        a:
          'A technique for getting from the visible symptom to the actual cause by asking "why" repeatedly. It came out of Toyota. The point is to fix the thing that produces the symptom rather than the symptom itself, so the problem does not come back.'
      },
      {
        q: 'Why exactly five?',
        a:
          'Five is a habit, not a rule. In practice most problems bottom out somewhere between the fourth and the sixth question. If you find it at the third, stop. If you are still nowhere at the seventh, you have probably defined the problem badly.'
      },
      {
        q: 'How do I know I have reached the root cause?',
        a:
          'Two signs. The next "why" starts pointing at something outside your control, and you are confident that removing what you found would stop the problem recurring.'
      },
      {
        q: '5 Whys or a fishbone diagram?',
        a:
          '5 Whys follows a single chain downwards. A fishbone spreads the same problem across categories — people, method, machine, material, measurement, environment. If the cause seems to sit in one place, use 5 Whys. If it is scattered, draw the fishbone first.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to run a 5 Whys analysis.'
      },
    ]
  },

  flowchart: {
    title: 'Flowcharts',
    summary:
      'Draw the steps, decision points and direction of a process. There are three chart types: workflow, process flow and data flow. The type you pick determines which box shapes are available.',
    whenToUse: [
      'Workflow chart: to show tasks, decisions, approvals and who performs them.',
      'Process flow chart: to analyze a production or service process through operation, transport, inspection, delay and storage steps.',
      'Data flow chart: to map how data moves between external entities, processes and data stores.'
    ],
    steps: [
      'The type picker appears the first time you open the tool. You can change the type later; boxes are converted to the closest equivalent in the new type.',
      'The chart menu at the top left lets you keep several charts in the same project and switch between them.',
      "Move the pointer over a box: a + appears at each of its four connection points. Click one, pick a shape, and the new box lands on that side already connected. Double-click a box to rename it; right-click for the other options.",
      'Drag boxes wherever you want; there is no automatic layout here, the arrangement is yours.',
      "To draw a connection, drag from any point on one box to any point on another: side to side, top to top, in any direction you want. To move an end, grab the tip of the line and drop it on another point. Double-click a line to write on it (for example yes / no).",
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
    ],
    example: {
      title: 'Example: how a leave request is handled',
      intro:
        'Everyone in the company has a slightly different version of this process in their head. Who approves, when it gets rejected, when HR steps in — none of it is written down. Drawing it narrows the argument to a single box.',
      blocks: [
        {
          heading: 'Steps',
          items: [
            'Start: employee submits a leave request',
            'Process: system calculates remaining leave days',
            'Decision: are there enough days left?',
            'No → request rejected, reason written back',
            'Yes → Process: request goes to the manager',
          ]
        },
        {
          heading: 'Continued',
          items: [
            'Decision: does the manager approve?',
            'No → reason goes back to the employee, process ends',
            'Yes → Process: HR records it in the calendar',
            'Process: team calendar updates',
            'End: confirmation sent to the employee',
          ]
        },
      ],
      outcome:
        'Once it was drawn, one thing stood out: there was no step at all that sent a reason back on a rejected request. Nobody noticed while the process lived in people\'s heads. Put into boxes, the gap showed itself.'
    },
    faq: [
      {
        q: 'What is a flowchart?',
        a:
          'A diagram showing the steps a process goes through from start to finish, where decisions are made and where the path splits. Processes that take five minutes to explain out loud usually take five seconds to read as a flowchart.'
      },
      {
        q: 'What do the flowchart shapes mean?',
        a:
          'A rounded box is a start or an end, a rectangle is a process step, a diamond is a decision. A decision always has at least two arrows leaving it, usually yes and no. That split is what leaves the reader with one interpretation instead of several.'
      },
      {
        q: 'Is a flowchart the same as a process map?',
        a:
          'Close, but not the same. A flowchart shows the order of steps. A process map is usually broader: it also shows who owns each step and where work crosses from one team to another.'
      },
      {
        q: 'Where should I start drawing?',
        a:
          'At the end. Write down how the process finishes, then work backwards asking "what has to happen before this". Starting at the beginning tends to produce the ideal process rather than the real one.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to draw a flowchart.'
      },
    ]
  },

  orgchart: {
    title: 'Organization charts',
    summary:
      'Shows who reports to whom and where each unit sits. There are seven chart types: hierarchical, functional, divisional, matrix, flat, team-based and network. The type determines both the available box kinds and how connections are drawn.',
    whenToUse: [
      'Recording the current structure and spotting vacancies and duplication.',
      'Discussing a reorganization by drawing the same team in different chart types and comparing them.',
      'Making dual reporting explicit in a matrix chart, or outside partners visible in a network chart.'
    ],
    steps: [
      'You pick the chart type the first time you open the tool. It can be changed later; boxes are converted to the closest equivalent and the layout is preserved.',
      'The chart menu at the top left lets you keep several charts in one project (for example current structure and target structure).',
      "Move the pointer over a box: a + appears at each of its four connection points. Click one and pick a position, unit, team or vacant role; the new box lands on that side. Double-click a box to change its name and the title underneath.",
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
    ],
    example: {
      title: 'Example: a 20-person software company',
      intro:
        'The company went from 6 people to 20 in two years. Who reports to whom is common knowledge but written down nowhere, so every new joiner asks the same questions in their first week.',
      blocks: [
        {
          heading: 'Managing director',
          items: [
            'Head of product',
            'Head of engineering',
            'Head of sales',
            'HR and finance lead',
          ]
        },
        {
          heading: 'Under engineering',
          items: [
            'Front-end team (3)',
            'Back-end team (4)',
            'QA lead',
            'Systems administrator',
          ]
        },
        {
          heading: 'Under product',
          items: [
            'Designers (2)',
            'Product analyst',
          ]
        },
        {
          heading: 'Under sales',
          items: [
            'Field sales (2)',
            'Customer support (2)',
          ]
        },
      ],
      outcome:
        'Drawing it made one thing jump out: QA is one person reporting straight to the head of engineering, so nobody covers that role during holidays. This is where org charts earn their keep — they show the gaps by name.'
    },
    faq: [
      {
        q: 'What is an organisational chart?',
        a:
          'A diagram of how people and teams in an organisation connect to each other. It shows reporting lines and where each unit sits. For anyone joining, it is the fastest map of the place they will get.'
      },
      {
        q: 'Should the chart show names or job titles?',
        a:
          'Both is best: the title explains the structure, the name tells you who to go to. Names alone make the chart meaningless the moment somebody leaves; titles alone leave you not knowing who to ask.'
      },
      {
        q: 'How many people fit on one chart?',
        a:
          'Up to around fifty stays readable on a single chart. Above that, show the top level separately and give each unit its own chart. Squeezing a large organisation onto one page produces a chart nobody reads.'
      },
      {
        q: 'How often should it be updated?',
        a:
          'At every hire and every departure. An out-of-date org chart is worse than none at all, because it sends people to the wrong person with confidence.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build an organisational chart.'
      },
    ]
  },

  swot: {
    title: 'SWOT analysis',
    summary:
      'Reads an idea, project or organization through four windows: what is good and bad inside, what opportunities and threats exist outside. The point is not to produce four lists but to connect them into a strategy.',
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
    ],
    example: {
      title: 'Example: a small accounting practice',
      intro:
        'A five-person accounting firm wants to grow but cannot decide where to push. Filling in the four boxes moves the discussion off gut feeling and onto specific lines.',
      blocks: [
        {
          heading: 'Strengths',
          items: [
            'Client relationships going back fifteen years',
            'Almost no client churn',
            'Both partners are qualified accountants',
            'No debt',
          ]
        },
        {
          heading: 'Weaknesses',
          items: [
            'Everything depends on the two partners',
            'No digital process, all paper',
            'No marketing at all',
            'New clients only arrive by referral',
          ]
        },
        {
          heading: 'Opportunities',
          items: [
            'New e-invoicing rules are pushing small firms to look around',
            'Lots of new small businesses opening locally',
            'Remote service is now accepted',
            'Accounting software has become cheap',
          ]
        },
        {
          heading: 'Threats',
          items: [
            'Cheap online bookkeeping services',
            'One partner is close to retirement',
            'Regulation changes frequently',
            'Hard to hire younger accountants',
          ]
        },
      ],
      outcome:
        'The table says something specific: the biggest opportunity (e-invoicing) sits exactly on top of the biggest weakness (no digital process). The decision writes itself — not growth, but digitising their own work first.'
    },
    faq: [
      {
        q: 'What is a SWOT analysis?',
        a:
          'A method that collects the position of an organisation or a decision into four boxes: strengths, weaknesses, opportunities and threats. Strengths and weaknesses are internal; opportunities and threats are external. That split is what gives the method its name, and it is the part people most often get wrong.'
      },
      {
        q: 'How do you do a SWOT analysis?',
        a:
          'First write down in one sentence what you are analysing — "our company" is too wide to be useful, "should we open the second branch" is not. Then fill the four boxes. The last step matters most: pair them up. Which strength catches which opportunity, which weakness leaves you exposed to which threat.'
      },
      {
        q: 'How do I tell a strength from an opportunity?',
        a:
          'A simple test: if your own decision can change it, it is internal. If it cannot, it is external. An experienced team is a strength; a growing market is an opportunity. Mixing the boxes makes the analysis unusable.'
      },
      {
        q: 'How many items should go in each box?',
        a:
          'Three to six works well. Fifteen items in one box is an inventory, not an analysis. Choosing the few that actually decide things is what makes the decision fall out of the table.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to run a SWOT analysis.'
      },
    ]
  },

  ishikawa: {
    title: 'Fishbone diagram',
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
    ],
    example: {
      title: 'Example: the scrap rate has gone up',
      intro:
        'In a furniture workshop the defect rate went from 3% to 9% in two months. Instead of hunting a single cause, every candidate is laid out side by side under six headings.',
      blocks: [
        {
          heading: 'People',
          items: [
            'Two experienced carpenters left',
            'New hires were never trained',
            'No handover between shifts',
          ]
        },
        {
          heading: 'Method',
          items: [
            'Cutting dimensions are not written down',
            'Quality is only checked at the end of the line',
          ]
        },
        {
          heading: 'Machine',
          items: [
            'The saw has not been serviced in six months',
            'The sander drifts out of calibration',
          ]
        },
        {
          heading: 'Material',
          items: [
            'Supplier changed',
            'Moisture content of the new boards is not measured',
          ]
        },
      ],
      outcome:
        'With the bones filled in, two headings are visibly more crowded than the rest: people and material. The team starts there. The fishbone does not find the cause — it tells you where to start looking.'
    },
    faq: [
      {
        q: 'What is a fishbone diagram?',
        a:
          'A diagram that sorts the possible causes of a problem into categories and lays them out side by side. It is named after the fish skeleton its shape resembles, and is also called an Ishikawa diagram or a cause-and-effect diagram.'
      },
      {
        q: 'What are the 6Ms?',
        a:
          'The six classic categories: People, Method, Machine, Material, Measurement and Environment. The goal is not to fill all six but to force your attention in six different directions instead of the one you were already looking at. In service work these headings can and should be changed.'
      },
      {
        q: 'Can I use a fishbone with 5 Whys?',
        a:
          'Yes, and it is the most effective way to use either. Spread the candidates with the fishbone, pick the strongest bone, then drill into it with 5 Whys. One gives you breadth, the other depth.'
      },
      {
        q: 'Does a fishbone diagram find the cause?',
        a:
          'Not directly — it produces candidates. When the diagram is done you have a list to test, not a proven cause. The next step is checking those candidates against data, which is where Pareto analysis fits well.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to draw a fishbone diagram.'
      },
    ]
  },

  pdca: {
    title: 'PDCA cycle',
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
    ],
    example: {
      title: 'Example: cutting first-response time in support',
      intro:
        'The support team currently replies in 14 hours on average. The target is 4. Before hiring anyone, they run a single cycle.',
      blocks: [
        {
          heading: 'Plan',
          items: [
            'Target: average first response under 4 hours',
            'Assumption: tickets pile up in the morning with nobody owning them',
            'Experiment: one person on duty from 09:00 to 11:00',
            'Duration: two weeks',
          ]
        },
        {
          heading: 'Do',
          items: [
            'Rota shared with the team',
            'The person on duty was given no other work in those two hours',
            'First-response time logged for every ticket',
          ]
        },
        {
          heading: 'Check',
          items: [
            'Average fell from 14 hours to 5',
            'Morning tickets fell to 2 hours',
            'Evening tickets did not change at all',
            'The person on duty fell behind on their own work',
          ]
        },
        {
          heading: 'Act',
          items: [
            'Morning duty made permanent',
            'Workload reduced on duty days',
            'New cycle opened for evening hours',
          ]
        },
      ],
      outcome:
        'One cycle cut the time to a third and produced the next question by itself: evening tickets. That is how PDCA is meant to run — each cycle hands you the subject of the next one.'
    },
    faq: [
      {
        q: 'What is the PDCA cycle?',
        a:
          'A four-step loop for continuous improvement: Plan, Do, Check, Act. Also known as the Deming cycle. The idea is to stop making one big change and instead run small experiments whose results you actually measure.'
      },
      {
        q: 'How long should one cycle be?',
        a:
          'The shortest time in which you can measure the result. One to four weeks works for most office work. A six-month cycle is not a cycle: conditions will have shifted by the time you look, and you will not know what caused what.'
      },
      {
        q: 'What do you measure in the Check step?',
        a:
          'Whatever you wrote in the Plan step. This is why the target has to be a number: "respond faster" cannot be checked, "average first response under 4 hours" can. Without a number written up front, Check turns into opinion.'
      },
      {
        q: 'What if the experiment fails?',
        a:
          'A failed cycle is still a result and should not be thrown away. In the Act step you write down why the assumption did not hold, and the next cycle starts from that. The only real waste in PDCA is trying something new without recording what happened.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to run a PDCA cycle.'
      },
    ]
  },

  waterfall: {
    title: 'Waterfall model',
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
    ],
    example: {
      title: 'Example: delivering a reporting module to a bank',
      intro:
        'Scope fixed by contract, delivery date fixed, written sign-off from the client at the end of each stage. Work like this moves through the stages in order.',
      blocks: [
        {
          heading: 'Requirements',
          items: [
            'Report types listed',
            'Permission rules written',
            'Client sign-off obtained',
          ]
        },
        {
          heading: 'Design',
          items: [
            'Data model drawn',
            'Screen wireframes',
            'Performance limits agreed',
          ]
        },
        {
          heading: 'Build',
          items: [
            'Reporting engine',
            'Permissions',
            'Export',
          ]
        },
        {
          heading: 'Test and hand over',
          items: [
            'Internal testing',
            'Client acceptance testing',
            'Go live',
            'User training',
          ]
        },
      ],
      outcome:
        'Both the strength and the weakness of waterfall are visible here: because the scope is fixed up front, progress is easy to measure — but a requirement that changes during the build sends the whole plan backwards.'
    },
    faq: [
      {
        q: 'What is the waterfall model?',
        a:
          'A method that splits a project into sequential stages and does not start one before the previous one is finished: requirements, design, build, test, delivery. It is named after water falling down a set of steps.'
      },
      {
        q: 'Waterfall or agile?',
        a:
          'If the scope is known up front and unlikely to move, waterfall carries less management overhead — construction, regulatory work and fixed-price delivery all fit. If the scope will only become clear as you go, waterfall gets expensive and agile methods fit better.'
      },
      {
        q: 'Can you go back to an earlier stage?',
        a:
          'You can, but it costs, and the model is not designed for it. If you are going backwards often, that is a sign the scope was never clear enough up front — at which point the real question is whether waterfall was the right choice.'
      },
      {
        q: 'What happens between stages?',
        a:
          'Each stage ends with a deliverable and a sign-off, and the sign-off should be written. The entire guarantee waterfall offers rests on both sides agreeing, at the same moment, that a stage is closed.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to run a waterfall project.'
      },
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
    ],
    example: {
      title: 'Example: cold store temperature rose above the limit',
      intro:
        'In a food warehouse the temperature stayed above the limit for two hours and the stock had to be destroyed. The top event is written down and the tree works downwards through logic gates, showing which failures had to happen together.',
      blocks: [
        {
          heading: 'Top event',
          items: [
            'Cold store above the temperature limit for two hours',
          ]
        },
        {
          heading: 'OR gate — any one is enough',
          items: [
            'Cooling stopped',
            'Heat got in',
            'The alarm did not fire and nobody noticed',
          ]
        },
        {
          heading: 'Under "cooling stopped" (OR)',
          items: [
            'Compressor failure',
            'Power cut',
            'Thermostat set wrongly',
          ]
        },
        {
          heading: 'Under "alarm did not fire" (AND)',
          items: [
            'Sensor faulty',
            'Backup sensor never installed',
            'Remote notifications switched off',
          ]
        },
      ],
      outcome:
        'The tree shows that cooling failing is not enough on its own — the alarm has to fail as well. So the cheapest countermeasure is not a new compressor, it is fitting the backup sensor. This is where fault tree analysis sends money to the right place.'
    },
    faq: [
      {
        q: 'What is fault tree analysis (FTA)?',
        a:
          'A method that puts an undesired event at the top and works downwards through logic gates to show which combinations of failures would produce it. It came from aerospace and nuclear engineering and is now used in safety and process analysis generally.'
      },
      {
        q: 'What is the difference between an AND gate and an OR gate?',
        a:
          'Under an OR gate, any one of the events below is enough to cause the event above. Under an AND gate, all of them must happen together. That distinction is the heart of the method: AND gates show you where the system is protecting itself.'
      },
      {
        q: 'Fault tree analysis or 5 Whys?',
        a:
          '5 Whys traces a single chain backwards from something that already happened. A fault tree maps every route to an event that has not happened yet. One looks at the past, the other at the future.'
      },
      {
        q: 'How far down should the tree go?',
        a:
          'Down to events you can no longer split and can act on directly. "Sensor faulty" is low enough, because you can write a countermeasure against it. "The system does not work" is not.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build a fault tree.'
      },
    ]
  },

  vsm: {
    title: 'Value stream mapping',
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
    ],
    example: {
      title: 'Example: from order received to goods shipped',
      intro:
        'A manufacturer measures the time between an order arriving and the goods going onto a lorry. Each step\'s actual processing time is written separately from the waiting time between steps. The gap changes the picture entirely.',
      blocks: [
        {
          heading: 'Steps and processing time',
          items: [
            'Order entry — 10 minutes',
            'Credit check — 15 minutes',
            'Added to production plan — 30 minutes',
            'Production — 4 hours',
            'Quality check — 20 minutes',
            'Packing and dispatch — 40 minutes',
          ]
        },
        {
          heading: 'Waiting between steps',
          items: [
            'After order entry — 1 day',
            'After credit check — 2 days',
            'After being planned — 3 days',
            'After production — 1 day',
            'After quality — 2 days',
          ]
        },
      ],
      outcome:
        'Total processing time is about 6 hours; total elapsed time is 9 days. So 99% of the time is waiting. The longest wait is the three days after an order is planned. The answer is unambiguous: speeding up production is pointless, the queue is the problem.'
    },
    faq: [
      {
        q: 'What is value stream mapping (VSM)?',
        a:
          'A map of every step a product or a request passes through, with the duration of each step and the waiting time between them. It comes from lean manufacturing. Its purpose is not to go faster but to show where the time is actually going.'
      },
      {
        q: 'What counts as value-adding and non-value-adding?',
        a:
          'Anything the customer would willingly pay for adds value — the steps that genuinely change the product. Waiting, moving things around and repeated checks do not. In most processes more than 90% of elapsed time is non-value-adding.'
      },
      {
        q: 'What is the difference between a value stream map and a flowchart?',
        a:
          'A flowchart shows the order of steps and the decision points, with no durations. In a value stream map duration is the whole point: processing time and waiting time are written separately for every step and then compared.'
      },
      {
        q: 'Where do I start?',
        a:
          'By mapping the current state exactly as it is. The most common mistake is drawing the process as it is supposed to work. If the map does not show reality, the improvements get applied to a process that does not exist. Measure the real durations on the floor.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to draw a value stream map.'
      },
    ]
  },

  pareto: {
    title: 'Pareto analysis',
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
    ],
    example: {
      title: 'Example: where the customer complaints come from',
      intro:
        'An online shop received 480 complaints in three months. The team had been discussing a separate fix for each complaint type. Counting them and sorting largest first changes the conversation.',
      blocks: [
        {
          heading: 'Complaint type and count',
          items: [
            'Delivery was late — 196',
            'Item did not match the description — 121',
            'Returns process too slow — 62',
            'Item arrived damaged — 48',
            'Wrong item sent — 29',
            'Other — 24',
          ]
        },
        {
          heading: 'Cumulative share',
          items: [
            'Late delivery — 41%',
            '+ Description mismatch — 66%',
            '+ Slow returns — 79%',
            '+ Damaged in transit — 89%',
            'Remaining three — 100%',
          ]
        },
      ],
      outcome:
        'The top two account for two-thirds of everything. Instead of chasing six problems at once, fixing delivery times and product descriptions removes 66% of the dissatisfaction. Making that order visible is the entire job of Pareto analysis.'
    },
    faq: [
      {
        q: 'What is Pareto analysis?',
        a:
          'A method that sorts problems by how often they occur, largest first, and shows which few account for most of the total. It rests on a simple observation: roughly 80% of the effects come from roughly 20% of the causes.'
      },
      {
        q: 'Does the 80/20 rule always hold?',
        a:
          'Not exactly, and it does not need to. Sometimes it comes out 70/30, sometimes 90/10. What matters is not the ratio but that the distribution is uneven: if a few items carry most of the total, Pareto analysis is useful.'
      },
      {
        q: 'Should I sort by count or by cost?',
        a:
          'By whatever your decision depends on. Count shows which problem happens most; cost shows which one hurts most. They often disagree — a rare but expensive problem sits at the bottom of a count-based list.'
      },
      {
        q: 'How many categories should a Pareto chart have?',
        a:
          'Five to ten reads best. An analysis with thirty categories is still just a list and gives you no focus. Choosing a small number of genuinely distinct categories is half the work.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to run a Pareto analysis.'
      },
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
    ],
    example: {
      title: 'Example: delivery times',
      intro:
        'Average delivery time is reported as 3 days, which looks fine. Complaints keep coming anyway. Grouping the individual times reveals what the average was hiding.',
      blocks: [
        {
          heading: 'Delivery time distribution (500 orders)',
          items: [
            '1 day — 140 orders',
            '2 days — 165 orders',
            '3 days — 95 orders',
            '4 days — 30 orders',
            '5 days — 12 orders',
            '6 days or more — 58 orders',
          ]
        },
        {
          heading: 'Reading it',
          items: [
            '60% of orders arrive within two days',
            'A small but distinct cluster sits at six days and above',
            'The shape has two peaks, not one',
            'Three days — the average — is one of the least common outcomes',
          ]
        },
      ],
      outcome:
        'The average says three days, but there are really two different customer experiences: most people get it in two days, some wait a week. A two-peaked distribution always means the same thing — this is not one process, it is two. The next question is which region or which warehouse those 58 orders came from.'
    },
    faq: [
      {
        q: 'What is a histogram?',
        a:
          'A chart that splits measurements into intervals and shows how many fall into each one. It makes visible the thing an average hides: how the values are spread out.'
      },
      {
        q: 'What is the difference between a histogram and a bar chart?',
        a:
          'A bar chart shows categories, and you can reorder them — cities, products and so on. A histogram has a numeric axis, the order is fixed, and the bars touch. What decides which one you need is the type of the data.'
      },
      {
        q: 'How many bins should I use?',
        a:
          'A common starting point is roughly the square root of the number of measurements — about ten for 100 readings. Too few bins erase the shape; too many turn noise into apparent structure. Try a couple of values and keep the one where the shape stays stable.'
      },
      {
        q: 'What does a histogram with two peaks mean?',
        a:
          'Almost always that the data did not come from a single process — two shifts, two machines, two regions. When you see that shape, the first thing to do is split the data and look at each part separately.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build a histogram.'
      },
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
    ],
    example: {
      title: 'Example: which warehouse should we lease?',
      intro:
        'Three candidates, and everyone has a different favourite. The discussion runs on "I think". Weighting the criteria and scoring each option out of ten brings it down to numbers.',
      blocks: [
        {
          heading: 'Criteria and weight',
          items: [
            'Monthly cost — weight 5',
            'Distance to customers — weight 4',
            'Room to expand — weight 3',
            'Road and port access — weight 3',
            'Difficulty of moving — weight 1',
          ]
        },
        {
          heading: 'Scores (1-10)',
          items: [
            'Warehouse A: 8 / 4 / 6 / 5 / 7',
            'Warehouse B: 5 / 9 / 4 / 8 / 5',
            'Warehouse C: 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Weighted total',
          items: [
            'Warehouse A — 100',
            'Warehouse B — 114',
            'Warehouse C — 114',
          ]
        },
      ],
      outcome:
        'A is out. B and C tie, so the matrix did not decide — but it reduced the argument from five criteria to one. The only remaining question is whether proximity beats room to expand. That is usually the real benefit of a decision matrix: it does not choose, it narrows.'
    },
    faq: [
      {
        q: 'What is a decision matrix?',
        a:
          'A table that scores several options against the same criteria and multiplies each score by how much that criterion matters. Its purpose is not to automate the decision but to make the assumptions behind it visible.'
      },
      {
        q: 'How do I set the weights?',
        a:
          'Before you score, and without looking at the options. If you do it the other way round, people quietly adjust the weights until their preferred option wins. Writing the weights first and locking them is the only thing that makes the matrix worth anything.'
      },
      {
        q: 'What if the result is not the option I wanted?',
        a:
          'That is the most valuable moment the matrix offers. There are two possibilities: either you weighted a criterion wrongly, or there is a criterion missing from the table. Both are fixed by writing down what is missing, not by adjusting the numbers.'
      },
      {
        q: 'How many criteria should I use?',
        a:
          'Four to seven works well. Below three you could have decided on instinct anyway; above seven the weights converge and the totals end up meaninglessly close together.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build a decision matrix.'
      },
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
    ],
    example: {
      title: 'Example: a busy Tuesday',
      intro:
        'Three meetings, one deadline and everything else squeezed in between. Five minutes in the morning writing the day down means the evening is not spent arguing with yourself about what got done.',
      blocks: [
        {
          heading: 'Must happen today',
          items: [
            'Finish the client deck (before the 14:00 meeting)',
            'Send the invoice approvals',
            'Set up accounts for the new joiner',
          ]
        },
        {
          heading: 'Nice if it happens',
          items: [
            'Read last week\'s report',
            'Call the supplier',
            'Tidy the desktop',
          ]
        },
        {
          heading: 'End-of-day review',
          items: [
            'Deck was finished — at 13:50, too close',
            'Invoice approvals forgotten — first thing tomorrow',
            'Got two uninterrupted hours in the afternoon',
            'Tomorrow I will group the meetings after lunch',
          ]
        },
      ],
      outcome:
        'The value is not in the list, it is in the review. After a week of writing it down the same line keeps coming back: work is being squeezed between meetings. You cannot fix that until you notice it.'
    },
    faq: [
      {
        q: 'What is the daily planner for?',
        a:
          'Writing the day down at the start and going over it at the end. It has two halves: the plan and the end-of-day review. Without the second half it becomes a to-do list; the value is in noticing that the same mistake keeps repeating.'
      },
      {
        q: 'Can anyone else see my planner?',
        a:
          'No. The planner and the end-of-day review are personal. They are not stored inside your projects but under your own record, so sharing a project with your team does not share your planner.'
      },
      {
        q: 'How many items should I write down?',
        a:
          'No more than three in the must-happen list. Longer lists end every day unfinished, and after a while you stop looking at them. Everything else goes in the second group: good if it happens, and the day is not a failure if it does not.'
      },
      {
        q: 'What should go in the end-of-day review?',
        a:
          'Not what you did, but what you noticed. "Finished the deck" carries no information; "the deck went to the wire because the morning meeting overran" is useful to you next week.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now.'
      },
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
    ],
    example: {
      title: 'Example: a website rebuild',
      intro:
        'The work has to fit into eight weeks. Who starts when, and which task is waiting on which, is unclear. Laying the tasks onto a calendar makes the collisions visible.',
      blocks: [
        {
          heading: 'Tasks and weeks',
          items: [
            'Content inventory — week 1',
            'Design — weeks 2 and 3',
            'Copywriting — weeks 2 to 5',
            'Development — weeks 4 to 7',
            'Content entry — weeks 6 and 7',
            'Testing and launch — week 8',
          ]
        },
        {
          heading: 'Questions it raised',
          items: [
            'Development starts in week 4 but design ends in week 3: no slack at all',
            'Content entry waits on copywriting, which ends in week 5: tight',
            'Only one week for testing, so any bug pushes the launch',
            'Are copywriting and design the same person?',
          ]
        },
      ],
      outcome:
        'What the chart produced was not a plan but the risks in the plan. Eight weeks works on paper, but there is no slack anywhere. A Gantt chart is not for inventing durations — it is for showing you where the slack is missing.'
    },
    faq: [
      {
        q: 'What is a Gantt chart?',
        a:
          'A chart that places tasks as horizontal bars on a calendar. The length of a bar is the duration, its position is when the work happens. It shows at a glance which tasks are running at the same time.'
      },
      {
        q: 'How do you make a Gantt chart?',
        a:
          'Work out the tasks first, then put them on the calendar. The right order is: build a work breakdown structure, estimate each item, note the dependencies, then draw. A Gantt chart drawn without a breakdown just makes an incomplete list look tidy.'
      },
      {
        q: 'What is a dependency?',
        a:
          'If a task cannot start until another finishes, there is a dependency between them. On a Gantt chart these form chains, and the longest chain sets the real duration of the project — every delay on that chain moves the delivery date directly.'
      },
      {
        q: 'What is the difference between a Gantt chart and a roadmap?',
        a:
          'A Gantt chart ties tasks to days and weeks and is for the team doing the work. A roadmap is coarser — quarters or months — and communicates intent; it usually goes to management or customers rather than the delivery team.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build a Gantt chart.'
      },
    ]
  },

  roadmap: {
    title: "Roadmap",
    summary: "A map that breaks a subject into a track of steps, with topics hanging off each step. You never drag the boxes; the map lays itself out after every change. What sets it apart from a work breakdown is that it tracks progress: every box has a status and the strip at the top tells you how much of the map is done.",
    whenToUse: [
      "To lay a subject out in learning order and keep track of where you left off.",
      "To plan a new hire’s first months step by step.",
      "To show on one screen which stages a piece of work goes through.",
      "To break a training program into topics and attach the material to each."
    ],
    steps: [
      "A folder can hold several roadmaps. Open a new one from the menu at the top left and switch between them there.",
      "The main track runs from start to finish. Select a step and press Enter to add the next one after it.",
      "With a step selected, Tab hangs a topic off it. On a topic, Tab adds a sub-topic and Enter adds a sibling.",
      "The circle at the start of a box changes its status: Not started → In progress → Done → Skipped. The box changes color with it.",
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
    ],
    example: {
      title: 'Example: six-month roadmap for a mobile app',
      intro:
        'The team changes direction with every new idea and management has no idea what is coming when. Six months are split into three rough stops. The goal is not to promise dates but to fix the order.',
      blocks: [
        {
          heading: 'Stop 1 — Steady the foundations',
          items: [
            'Halve the app start-up time',
            'Fix the screens that crash',
            'Simplify sign-up',
          ]
        },
        {
          heading: 'Stop 2 — Keep people',
          items: [
            'Notification settings',
            'Offline mode',
            'In-app feedback',
          ]
        },
        {
          heading: 'Stop 3 — Grow',
          items: [
            'Invite a friend',
            'Second language',
            'Paid plan infrastructure',
          ]
        },
        {
          heading: 'Deliberately not doing',
          items: [
            'Tablet layout',
            'Desktop version',
            'AI features',
          ]
        },
      ],
      outcome:
        'The most useful box on the roadmap is the last one. Writing down what you will do does not end the argument; writing down what you will not do this period does.'
    },
    faq: [
      {
        q: 'What is a product roadmap?',
        a:
          'A high-level plan showing where a product or a piece of work is heading over the coming period, and in what order. It is not a task list — it communicates intent and sequence.'
      },
      {
        q: 'Should a roadmap have dates?',
        a:
          'Exact dates usually do damage: miss one and the credibility of the whole roadmap goes with it. Quarters, or a "now / next / later" structure, hold up far better. If you genuinely need an exact date, that item belongs on a Gantt chart, not a roadmap.'
      },
      {
        q: 'How often should a roadmap be updated?',
        a:
          'Reviewing it monthly suits most teams. A roadmap that changes every week is not a roadmap; one that never changes has lost touch with reality. What matters is not the change itself but writing down why it changed.'
      },
      {
        q: 'Why do I need a \'not doing\' list?',
        a:
          'Because most questions a roadmap attracts take the form "but what about X". Listing what you deliberately left out answers them up front and stops the team relitigating the same argument every week.'
      },
      {
        q: 'Is it free?',
        a:
          'Yes. Klarsti is free and ad-free right now, and you do not need an account to build a roadmap.'
      },
    ]
  }
};

export default guides;
