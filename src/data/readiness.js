/* The questions in the readiness check. The tool reads them to run the check;
   the downloadable checklist reads them to print it. Written once. */
export const readinessGroups = [
  {
    id: 'access',
    name: 'Access',
    blurb: 'Who can reach it, and who can reach it for you.',
    questions: [
      { id: 'a1', text: 'Every account, domain and key is in the owner’s name, not an individual’s.' },
      { id: 'a2', text: 'Each person has only the access their job needs.' },
      { id: 'a3', text: 'Secrets are kept out of code, and there is a written way to change each one.' },
      { id: 'a4', text: 'Someone other than the builder has signed in to every service.' },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    blurb: 'What it holds, and what happens to it.',
    questions: [
      { id: 'd1', text: 'There are backups, and a restore has been tried and timed.' },
      { id: 'd2', text: 'It is clear which data is authoritative, and who owns it.' },
      { id: 'd3', text: 'Personal data is kept to a minimum, and how long it is kept has been decided.' },
      { id: 'd4', text: 'Changes to the data’s structure are scripted, ordered, and reversible where possible.' },
    ],
  },
  {
    id: 'operation',
    name: 'Operation',
    blurb: 'Running it, day to day and at night.',
    questions: [
      { id: 'o1', text: 'Someone is told when it breaks, before customers are.' },
      { id: 'o2', text: 'Runbooks exist for the problems that will really happen.' },
      { id: 'o3', text: 'There is a way to release a change, and a way to undo it.' },
      { id: 'o4', text: 'The limits are known: how much load it takes, and what happens beyond that.' },
    ],
  },
  {
    id: 'quality',
    name: 'Quality',
    blurb: 'How we know it works.',
    questions: [
      { id: 'q1', text: 'Automated checks run on every change.' },
      { id: 'q2', text: 'The riskiest path (money, access, deletion) has been tested from end to end.' },
      { id: 'q3', text: 'It has been used with a keyboard alone and with a screen reader.' },
      { id: 'q4', text: 'Failure has been rehearsed: a dependency down, a slow reply, a duplicate request.' },
    ],
  },
  {
    id: 'people',
    name: 'People',
    blurb: 'Who will look after it.',
    questions: [
      { id: 'p1', text: 'The people who will run it have run it, with the builders watching.' },
      { id: 'p2', text: 'The documentation lets a newcomer make a safe first change.' },
      { id: 'p3', text: 'It is clear who decides, who is on call and who to ask.' },
      { id: 'p4', text: 'What “supported” means has been written down and agreed.' },
    ],
  },
];

export const readinessAnswers = [
  { id: 'yes', label: 'Yes', value: 1 },
  { id: 'partly', label: 'Partly', value: 0.5 },
  { id: 'no', label: 'No', value: 0 },
  { id: 'na', label: 'Not applicable', value: null },
];
