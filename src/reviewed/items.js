/* Your AI Use, Reviewed — item definitions. v0.3 spec.
   See ~/Desktop/Vishali/AI_Use_Reviewed/01_instrument_spec.md */

export const DOMAINS = [
  {
    id: 'strategic',
    label: 'Strategic decisions',
    sub: 'board memos, prioritization, scoping',
    critical: true,
  },
  {
    id: 'external',
    label: 'External communications',
    sub: 'donor letters, advocacy, public statements',
    critical: true,
  },
  {
    id: 'internal',
    label: 'Internal documents',
    sub: 'staff memos, policies, training materials',
    critical: false,
  },
  {
    id: 'research',
    label: 'Research & synthesis',
    sub: 'landscape scans, grant prep, briefings',
    critical: false,
  },
  {
    id: 'learning',
    label: 'Learning a new domain',
    sub: 'coming up to speed on something unfamiliar',
    critical: false,
  },
]

export const MODE_OPTIONS = [
  { value: 'M7', label: "I don't use AI for this work" },
  { value: 'M4', label: 'I form my own position, then ask AI to challenge or refine it' },
  { value: 'M3', label: 'I form my own position, then ask AI to tighten/refine the language' },
  { value: 'M5', label: 'I use AI to generate first drafts, then I rework them' },
  { value: 'M5_BORDER', label: 'I use AI to generate first drafts, and I lightly edit' },
  { value: 'M1', label: 'I take what AI gives me with minimal review' },
  { value: 'NA', label: "Doesn't apply to my work" },
]

export const MODE_LABELS = {
  M1: 'Mode 1 — Autopilot',
  M2: 'Mode 2 — Looking Good Learning Nothing',
  M3: 'Mode 3 — Stewardship',
  M4: 'Mode 4 — Sparring Partner',
  M5: 'Mode 5 — Co-Pilot',
  M5_BORDER: 'Mode 5 / Mode 1 border',
  M6: 'Mode 6 — Good Enough on Purpose',
  M7: 'Mode 7 — Hands Off',
}

export const MODE_TIERS = {
  M1: 'decline',
  M2: 'decline',
  M3: 'growth',
  M4: 'growth',
  M5: 'conditional',
  M5_BORDER: 'border',
  M6: 'declared',
  M7: 'protected',
  NA: 'na',
}

export const ITEMS = {
  item1: {
    id: 'item1',
    title: 'Forming your view first',
    prompt: 'For your most recent AI-assisted task: before you read what AI gave you, did you write down or fully form what *you* would have said?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes — I had a position before I asked' },
      { value: 'partly', label: 'Partly — I had a rough draft or bullet points' },
      { value: 'forming', label: 'No — but my opinion was forming as I read what AI gave me' },
      { value: 'no_position', label: 'No — I went into it without a position' },
      { value: 'no_recent', label: "I haven't done an AI-assisted task recently" },
    ],
    skipsItem2When: 'no_recent',
  },
  item2: {
    id: 'item2',
    title: 'Catching it if wrong',
    prompt: 'For that same task: how confident are you that you would have caught it if AI had given you something subtly wrong?',
    type: 'single',
    options: [
      { value: 'very', label: 'Very confident — I have direct expertise in this domain' },
      { value: 'fairly', label: "Fairly confident — I'd spot most issues" },
      { value: 'not_very', label: 'Not very confident — I might miss things' },
      { value: 'outside', label: 'Honestly, no — this was outside my expertise' },
      { value: 'didnt_check', label: "I didn't think to check" },
    ],
    skipIfItem1IsNoRecent: true,
  },
  matrix: {
    id: 'matrix',
    title: 'How you typically use AI',
    prompt: 'How do you typically use AI in each of these areas of your work? Pick the closest match per row.',
    type: 'matrix',
    domains: DOMAINS,
    options: MODE_OPTIONS,
  },
  iocs: {
    id: 'iocs',
    title: 'Have you noticed any of these?',
    prompt: 'In the past two weeks, have you noticed any of these in your own AI use? Check all that apply — no shame, this is a snapshot, not a verdict.',
    type: 'multi',
    /* Options come from iocs.js — referenced there to keep IoC data co-located */
  },
  configuration: {
    id: 'configuration',
    title: 'Telling AI what kind of help you want',
    prompt: 'When you start an AI session, how often do you tell it what *kind* of help you want — e.g., "challenge my thinking" vs. "tighten this draft" vs. "just fact-check"?',
    type: 'single',
    options: [
      { value: 'always', label: 'Almost always — I have phrasing I use' },
      { value: 'often', label: 'Often, when I remember to' },
      { value: 'sometimes', label: 'Sometimes, but I usually just describe the task' },
      { value: 'rarely', label: 'Rarely — I just ask it to do the thing' },
      { value: 'never', label: "I don't think I've ever done this" },
    ],
  },
  frontier: {
    id: 'frontier',
    title: 'Frontier awareness',
    prompt: "Think about the work you do most often. Could you draw a rough line — even a fuzzy one — between AI tasks where you trust the output and AI tasks where you'd want a colleague to double-check?",
    type: 'single',
    options: [
      { value: 'clear', label: 'Yes — I have a clear-enough mental model of where AI is reliable for my work' },
      { value: 'sort_of', label: "Sort of — I know it varies, but I couldn't articulate the line" },
      { value: 'no_line', label: 'No — I treat AI output about the same regardless of task' },
      { value: 'havent', label: "Honestly, I haven't thought about it that way" },
    ],
  },
  handsOff: {
    id: 'handsOff',
    title: 'Hands-Off discipline',
    prompt: 'Is there any kind of work — at your job, in your community, in your personal life — that you deliberately keep AI out of?',
    type: 'single',
    options: [
      { value: 'yes_named', label: 'Yes — and I can name what and why' },
      { value: 'yes_unclear', label: "Yes — but I'd struggle to articulate why" },
      { value: 'no_thought', label: "No, but I've thought about it" },
      { value: 'havent', label: "I haven't thought about it that way" },
    ],
  },
}

export const ITEM_ORDER = ['item1', 'item2', 'matrix', 'iocs', 'configuration', 'frontier', 'handsOff']
