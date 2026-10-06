import { engineeringTerms } from '../glossary';
import { YK_ENGINE_REPO } from '../work';

const page = {
  key: 'work/how-to-read',
  title: 'How to Read the Work',
  accent: '#ff3333',
  aliases: ['case studies', 'evaluate vendors', 'due diligence', 'questions to ask', 'references', 'portfolio', 'claims', 'results', 'what this site says'],
  hero: {
    scene: 'liquid-glass-operational',
    intensity: 'hero',
    eyebrow: 'Work / How to read',
    title: 'A case study is a claim. Read it like one.',
    intro:
      'Anyone can tell a good story about their own work. This page is about asking better questions of any case study, ours included — and about what the pieces of work on this site do and do not say.',
    code: 'WRK.05',
    status: 'READING GUIDE',
    actions: [
      { label: 'Read the guide', to: '/work/how-to-read#guide' },
      { label: 'Put six questions to ours', to: '/work/how-to-read#exam', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'document',
      variant: 'article',
      anchor: 'guide',
      railLabel: 'The guide',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The guide',
      title: 'How to read a case study.',
      intro: 'Six questions, what good answers look like, and what to do when they are missing.',
      version: 'General guidance',
      summary: [
        'A case study is written by the people it flatters. Read it as a **claim**, not as evidence.',
        'Ask who it was for, what it did, what changed, how anyone knows, what went wrong, and whether you can look.',
        'The strongest signs of honesty are **specifics and admitted limits**. The weakest are adjectives.',
      ],
      meta: [
        { k: 'For', v: 'Anyone choosing a team to build something' },
        { k: 'Kind', v: 'General guidance, about any case study' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'claim',
          title: 'A case study is a claim',
          plain: 'It is the best version of a story, told by its subject.',
          body: [
            'Nobody writes a case study about the project that went badly. What is published is selected, polished and framed, usually by the people who did the work and always for the people they hope to impress. That does not make it false. It does mean it should be read the way a careful person reads an advertisement: with interest, and with questions.',
            'The questions below are not a test to pass or fail. They are a way of finding what a case study tells you, and what it leaves out.',
          ],
        },
        {
          id: 'questions',
          title: 'Six questions',
          plain: 'The same six, for any case study.',
          body: [
            {
              steps: [
                { title: 'Who was it for?', body: 'A named client, a described kind of client, or no one in particular? Each is fine; knowing which matters.' },
                { title: 'What did it actually do?', body: 'Not what it was called, or what it was meant to achieve, but what it did, in terms you could check.' },
                { title: 'What changed because of it?', body: 'The only question that most case studies exist to answer, and the one most often answered with adjectives.' },
                { title: 'How does anyone know?', body: 'A number, a comparison with before, a person who will say so. Without one, “improved” is a feeling.' },
                { title: 'What went wrong, or was hard?', body: 'Every real project had a bad week. A case study that mentions none is one you are only half reading.' },
                { title: 'Can I look for myself?', body: 'A public repository, a live product, a reference you can call. Seeing beats being told.' },
              ],
            },
          ],
        },
        {
          id: 'signs',
          title: 'Signs of an honest one',
          plain: 'Specifics, trade-offs and admitted limits.',
          body: [
            { list: [
              '**It is specific.** It names the problem, the constraint, the decision, in words that could turn out to be wrong.',
              '**It admits trade-offs.** “We chose X over Y because…” shows a real choice was made.',
              '**It says what it did not do.** Limits stated plainly are more convincing than breadth claimed loosely.',
              '**It separates what was built from what was hoped.** “Designed to handle” is not “handles”.',
              '**It can be checked.** There is somewhere to look or someone to ask.',
            ] },
          ],
        },
        {
          id: 'weak',
          title: 'Signs of a weak one',
          plain: 'Adjectives where facts should be.',
          body: [
            { list: [
              '**Adjectives instead of numbers**: seamless, robust, scalable, world-class.',
              '**Before-and-after with nothing in between**: it was bad, now it is good.',
              '**Unnamed everything**, with no explanation of why.',
              '**Impressive figures with no baseline**: a “300% increase” of what?',
              '**A story with no problems in it.**',
            ] },
            { note: 'Unnamed clients are not a warning sign in themselves: confidentiality is a good reason. It is the combination of unnamed, unmeasured and unchecked that should make you cautious.', label: 'A fair caveat' },
          ],
        },
        {
          id: 'ask',
          title: 'What to ask for',
          plain: 'The questions that make a polished page honest.',
          body: [
            { ol: [
              '“Can I speak to someone who has used it?”',
              '“What did you get wrong, and what did you do about it?”',
              '“What would you do differently now?”',
              '“Show me the dull parts: how it is run, how it is changed, how it is handed over.”',
              '“What would make this a poor fit for us?”',
            ] },
            'A team that welcomes these is telling you something. So is one that does not.',
          ],
        },
        {
          id: 'this-site',
          title: 'What this site does and does not say',
          plain: 'Applied to its own work, honestly.',
          body: [
            'The four pieces of work on this site are described, not proven. No client is named. No dates, figures or testimonials are given, because none are claimed. The interactive pieces on each page are **illustrations** of the idea, built for the page; they are not the systems themselves, and each page says as much.',
            `The one exception is YK Engine, which has a public repository you can read for yourself (${YK_ENGINE_REPO}). The others are described in general terms and are not available to look at.`,
            'The closing page puts the six questions to each of the four in turn and records, plainly, which are answered and which are not.',
          ],
        },
        {
          id: 'using',
          title: 'Using this when we talk',
          plain: 'Bring the questions.',
          body: [
            'If you are thinking of working with the company, or anyone else, bring these questions. They apply to this site as much as to any other, and a good conversation will take them in its stride. The contact page is the place to start one.',
          ],
        },
      ],
      note: 'General guidance. It describes how to read case studies, and does not claim anything about any project beyond what the work pages themselves say.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'caseExam',
      anchor: 'exam',
      scene: 'magnetic-particles',
      tag: 'End of reading the work',
      minHeight: 780,
      title: 'The six questions, put to ours.',
      lede: 'For each of the four pieces of work on this site, which of the six questions are answered, which only partly, and which are not said at all. Written plainly, because the gaps are the point.',
      questions: [
        { id: 'who', text: 'Who was it for?', why: 'A named client, a kind of client, or no one in particular?' },
        { id: 'what', text: 'What does it actually do?', why: 'In terms you could check.' },
        { id: 'change', text: 'What changed because of it?', why: 'The question case studies exist to answer.' },
        { id: 'know', text: 'How does anyone know?', why: 'A number, a comparison, a person.' },
        { id: 'wrong', text: 'What went wrong, or was hard?', why: 'Every project had a bad week.' },
        { id: 'look', text: 'Can I look for myself?', why: 'Seeing beats being told.' },
      ],
      cases: [
        { id: 'musebase', name: 'Musebase', answers: {
          who: { status: 'partly', text: 'Described by purpose, as a coordination application for people, time and information. No customer is named.' },
          what: { status: 'said', text: 'Scheduling, communication and records in one environment, with access scoped to each role.' },
          change: { status: 'not', text: 'No result is claimed.' },
          know: { status: 'not', text: 'No measurement, comparison or testimonial.' },
          wrong: { status: 'not', text: 'Not covered. The page describes the work; it is not a post-mortem.' },
          look: { status: 'partly', text: 'Three small experiments with the idea behind it are on the page. They are not the application.' },
        } },
        { id: 'yk', name: 'YK Engine', answers: {
          who: { status: 'not', text: 'Not stated. The page says what the engine is, not who uses it.' },
          what: { status: 'said', text: 'A 2D engine with an editor, a standalone player and project export tooling.' },
          change: { status: 'not', text: 'No result is claimed.' },
          know: { status: 'partly', text: 'The page’s own frame-time graph is measured live from the demonstration in your browser, not from the engine.' },
          wrong: { status: 'not', text: 'Not covered.' },
          look: { status: 'said', text: 'A public repository, linked from the page. The editor and player on the page are illustrations.' },
        } },
        { id: 'customer', name: 'Customer product', answers: {
          who: { status: 'partly', text: 'A customer-facing product around shopping and transactions. Unnamed by design.' },
          what: { status: 'said', text: 'The path from a first look to a confirmed purchase, described in five frames.' },
          change: { status: 'not', text: 'No result is claimed.' },
          know: { status: 'not', text: 'No measurement or testimonial.' },
          wrong: { status: 'not', text: 'Not covered.' },
          look: { status: 'not', text: 'Described, not displayed. The page shows abstract wireframes, not screenshots, and says so. The product is not public.' },
        } },
        { id: 'crm', name: 'Internal CRM', answers: {
          who: { status: 'partly', text: 'An internal system, for the people who run an operation. Not a public product.' },
          what: { status: 'said', text: 'Designed for very large data sets. The page demonstrates the idea with synthetic rows made in your browser; no speed or size of the real system is claimed.' },
          change: { status: 'not', text: 'No result is claimed.' },
          know: { status: 'not', text: 'No measurement or testimonial.' },
          wrong: { status: 'not', text: 'Not covered.' },
          look: { status: 'not', text: 'Internal by design. It is not public.' },
        } },
      ],
      onward: [
        { label: 'All work', to: '/work' },
        { label: 'Frequently asked questions', to: '/company/faq' },
      ],
    },
  ],
};

export default page;
