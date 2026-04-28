/* Your AI Use, Reviewed — Recommendation bank.
   See ~/Desktop/Vishali/AI_Use_Reviewed/02_recommendations_bank.md */

import { DOMAINS } from './items.js'

const domainLabel = (id) => {
  const d = DOMAINS.find((x) => x.id === id)
  return d ? d.label.toLowerCase() : id
}

/* Severity ordering for top-3 selection */
export const SEVERITY = { HIGH: 4, 'MEDIUM-HIGH': 3, MEDIUM: 2, MAINTENANCE: 1 }

/* Helpers used in trigger conditions */
const iocCount = (a) => (a.iocs ? a.iocs.length : 0)
const matrixHas = (a, mode) => Object.values(a.matrix || {}).includes(mode)
const matrixDomainsWithMode = (a, mode) =>
  Object.entries(a.matrix || {})
    .filter((entry) => entry[1] === mode)
    .map((entry) => entry[0])
const allItem1Strong = (a) => a.item1 === 'yes' || a.item1 === 'partly'
const allItem2Strong = (a) => a.item2 === 'very' || a.item2 === 'fairly'

/* Recommendation bank — R1 through R10 */
export const RECOMMENDATIONS = [
  {
    id: 'R1',
    severity: 'HIGH',
    headline: 'Try forming your view before you ask.',
    body: (a) => {
      // pick highest-stakes domain from their answers (preferring critical domains where they reported any non-Mode 7 / non-NA use)
      const useDomain =
        DOMAINS.find((d) => d.critical && a.matrix?.[d.id] && !['NA', 'M7'].includes(a.matrix[d.id])) ||
        DOMAINS.find((d) => a.matrix?.[d.id] && !['NA', 'M7'].includes(a.matrix[d.id])) ||
        DOMAINS[0]
      return `For your next ${useDomain.label.toLowerCase()} task, try this: open a blank page first. Write 3 bullet points of your own position before you open AI. Then go to AI and ask it to challenge or refine what you wrote.\n\nOne week. Just three bullets first. The point isn't perfectionism — it's giving yourself a baseline to compare against.`
    },
    evidence:
      'Lee, M. et al. (CHI 2026, N=393): Participants who delayed AI access until after partial independent problem-solving outperformed AI-first users on critical thinking tasks. The effect held even when both groups had the same total time.',
    whyForYou: () =>
      'You answered that you went into your last AI-assisted task without forming a position first. The framework calls this Mode 1 (Autopilot). The behavior change here is small — three bullets, two minutes — and it is the single strongest leverage point in the corpus.',
    trigger: (a) => a.item1 === 'no_position',
  },
  {
    id: 'R2',
    severity: 'HIGH',
    headline: 'Get a second human in the loop on one task this week.',
    body: () =>
      'Pick one AI-assisted output you\'ll produce this week — ideally something with stakes. Before you ship it, send it to a colleague with the question: "Does this hold up?"\n\nThe point isn\'t to outsource judgment. It\'s to interrupt the pattern where confidence in AI output substitutes for verification. One task. One colleague. One week.',
    evidence:
      "Shaw & Nave (Wharton, N=1,372): Participants' confidence in AI output held steady regardless of whether the AI was accurate. Cohen's h = 0.81 — a large effect. Confidence isn't a check; another human is.",
    whyForYou: (a) => {
      const reason =
        a.item2 === 'didnt_check'
          ? "you didn't think to check"
          : "the task was outside your expertise to verify"
      return `You indicated ${reason} on the last AI output. That's the exact scenario the Wharton study showed produces a 15-percentage-point accuracy drop without any drop in confidence. A colleague is the cheapest mitigation available.`
    },
    trigger: (a) =>
      (a.item2 === 'didnt_check' || a.item2 === 'outside') &&
      a.frontier === 'havent',
  },
  {
    id: 'R3',
    severity: 'HIGH',
    headline: 'Name the pattern out loud.',
    body: () =>
      "Pick the IoC from your list that surprised you most — the one you had to think about before checking. For the next week, when you notice yourself doing it, name it explicitly. Out loud, in a note, in your head — doesn't matter. Just: \"I'm doing the thing.\"\n\nThe naming is most of the work. It's the difference between Mode 1 (Autopilot) and Mode 2 (the bottomless one). Awareness is the only available exit.",
    evidence:
      'Lee, H. et al. (Microsoft/CMU, N=319): Confidence in AI was inversely correlated with critical thinking effort (β = −0.69). Self-confidence was positively correlated (+0.31). Metacognitive awareness — knowing what mode you\'re in — was the variable that separated growth from decline.',
    whyForYou: (a) =>
      `You flagged ${iocCount(a)} of the 8 indicators. That's not unusual; what's notable is that you noticed. The hardest part is already done. The next step is the smallest possible change: name the pattern when it shows up, and let the naming do the work.`,
    trigger: (a) => iocCount(a) >= 3,
  },
  {
    id: 'R4',
    severity: 'MEDIUM-HIGH',
    headline: 'Open with a one-sentence ask.',
    body: () =>
      'Before your next AI session, write one sentence: "I want you to ___, not ___."\n\nExamples:\n- "I want you to challenge my thinking, not validate it."\n- "I want you to tighten this draft, not rewrite it in your voice."\n- "I want you to fact-check this, not give me a new opinion."\n\nSame model, same task, opposite outcomes. The variable is the configuration.',
    evidence:
      "Bastani et al. (PNAS, N=1,000): ~1,000 students across ~50 classrooms used the same GPT-4 with the same curriculum. Unguarded use produced a −17% drop on the exam. Guardrailed use (hints, not answers) was statistically indistinguishable from the control group. The students didn't change. The instructions did.",
    whyForYou: () =>
      "You said you rarely or never tell AI what kind of help you want. Most people don't — it's not a skill anyone learns by accident. But it's the single highest-leverage instruction in the corpus, and the cost of trying it is one sentence.",
    trigger: (a) => a.configuration === 'rarely' || a.configuration === 'never',
  },
  {
    id: 'R5',
    severity: 'HIGH',
    headline: 'Draft three sentences in your voice first.',
    body: () =>
      "For your next external communication or staff memo, draft 3 sentences in your own voice before you open AI. Just three. Then bring AI in for refinement.\n\nThe risk you're managing here isn't quality — your AI-assisted output is probably fine. The risk is voice. Heavy reliance flattens distinctive phrasing toward the model's average register, especially for skilled writers.",
    evidence:
      "Doshi & Hauser (Science Advances, N=293+600): Low-skill writers gained 22% in quality from AI assistance. High-skill writers gained nothing — and their voice converged toward the model's prior. Quality stable. Distinctiveness lost.",
    whyForYou: (a) => {
      const heavyDomain =
        ['M1', 'M5_BORDER'].includes(a.matrix?.external)
          ? 'external communications'
          : 'internal documents'
      return `You indicated heavy AI use on ${heavyDomain}. For audiences who recognize your voice, that voice is part of the message. Three sentences of yours, then AI for the rest, is enough to keep the signature intact.`
    },
    trigger: (a) =>
      ['M1', 'M5_BORDER'].includes(a.matrix?.external) ||
      ['M1', 'M5_BORDER'].includes(a.matrix?.internal),
  },
  {
    id: 'R6',
    severity: 'MEDIUM',
    headline: 'Pick one thing to keep AI out of.',
    body: () =>
      "For the next 30 days, pick one task category — anything — that you'll deliberately keep AI out of. Doesn't have to be important. The choice itself is the practice.\n\nSuggestions: Sunday morning journaling. The first 15 minutes of any new project. Writing condolence notes. Hard conversations with people you care about. Whatever feels obvious to you is probably right.",
    evidence:
      "Loble & Lodge (UTS/UQ synthesis, 2026): Offloading extraneous cognitive load is fine. Offloading intrinsic load — the struggle that builds schema — is harmful. Mode 7 is the discipline of telling them apart, and it's only available to people who have made the choice deliberately.",
    whyForYou: () =>
      "You haven't named work you keep AI out of. That's not a moral failing; it's how the default works. The framework calls this discipline Mode 7 — Hands Off. It's the only mode that requires no skill, just a decision. Make one this week.",
    trigger: (a) => a.handsOff === 'havent' || a.handsOff === 'no_thought',
  },
  {
    id: 'R7',
    severity: 'MEDIUM-HIGH',
    headline: 'Tag your next 5 AI uses.',
    body: () =>
      "For your next 5 AI tasks, jot one word in a sticky note or doc: \"in-frontier\" or \"out-of-frontier.\" After a week, look at the pattern.\n\n\"In-frontier\" means a task where AI is reliable and you'd trust it without much checking. \"Out-of-frontier\" means a task where it might confidently hallucinate, where the stakes are too high to trust without verification, or where it's just not great at it. The point isn't to be correct on each one. The point is to start noticing the difference exists.",
    evidence:
      "Dell'Acqua et al. (HBS, N=758): BCG consultants using AI on tasks inside the AI's frontier saw +12.2% productivity. The same consultants on tasks outside the frontier saw −19% accuracy. Same AI. The variable was the task.",
    whyForYou: () =>
      "You answered that you treat AI output about the same regardless of task, or that you haven't thought about the line. The Dell'Acqua finding is one of the most replicated in the literature: same AI, opposite outcomes, determined by where the task lives. The line will be fuzzy and personal — but the act of noticing is most of the protection.",
    trigger: (a) => a.frontier === 'no_line' || a.frontier === 'havent',
  },
  {
    id: 'R8',
    severity: 'MAINTENANCE',
    headline: "You're operating deliberately. Try going harder.",
    body: (a) => {
      const m5Domain = matrixDomainsWithMode(a, 'M5')[0] || matrixDomainsWithMode(a, 'M3')[0]
      const useDomain = m5Domain ? domainLabel(m5Domain) : 'a domain'
      return `You're already running with the discipline most readers of this framework are still building. So here's a Mode 4 experiment for ${useDomain} (where you currently use AI in a Mode 5 / Stewardship pattern): form your full position first, then ask AI to *steelman the opposite view.* Not "what are the counterarguments" — *"what's the strongest version of disagreeing with me?"*\n\nThe shift from "AI helps me draft" to "AI helps me argue with myself" is the most consistent driver of transfer learning in the corpus.`
    },
    evidence:
      'Yin et al. (npj Science of Learning, N=66, fNIRS): Metacognitive feedback from AI drove transfer learning to novel problems. Affective feedback (encouragement, validation) drove retention only — no transfer. The mechanism is forced re-evaluation of your own position.',
    whyForYou: () =>
      "Your answers suggest you're already operating in growth modes across most domains. The next leverage isn't more discipline — it's a sharper kind of engagement. Steelmanning is how Mode 4 actually works in practice.",
    trigger: (a) =>
      allItem1Strong(a) && allItem2Strong(a) && iocCount(a) <= 1 && a.handsOff === 'yes_named',
  },
  {
    id: 'R9',
    severity: 'MEDIUM',
    headline: 'No domain is currently AI-free.',
    body: () =>
      "Your matrix shows Mode 7 (Hands Off) in zero domains. That doesn't necessarily mean anything is wrong — but it does mean every kind of work in your life is currently AI-eligible.\n\nConsider: is there any domain — even a small one — where doing the work yourself IS the point? Picking it doesn't mean swearing off AI in that domain forever. It means having a category you've thought about.",
    evidence: 'Loble & Lodge (UTS/UQ synthesis, 2026) — same anchor as R6.',
    whyForYou: () =>
      "Across the 5 domains you assessed, none currently have AI fully kept out. That's worth pausing on — not as a failing, just as a pattern.",
    trigger: (a) => !matrixHas(a, 'M7'),
  },
]

/* R10 — positive callout. Composed dynamically from strongest signals. */
export const POSITIVE_SIGNALS = [
  {
    id: 'pos_item1',
    text: "You wrote down or formed your position before opening AI. That's the single highest-leverage behavior in the framework, and you're doing it.",
    trigger: (a) => a.item1 === 'yes',
  },
  {
    id: 'pos_config',
    text: 'You name what kind of help you want when you start an AI session. The Bastani study suggests that\'s the difference between a −17% outcome and a flat one.',
    trigger: (a) => a.configuration === 'always' || a.configuration === 'often',
  },
  {
    id: 'pos_handsoff',
    text: 'You have at least one domain where you keep AI out by choice. Mode 7 is rare; it\'s a deliberate practice.',
    trigger: (a) => a.handsOff === 'yes_named',
  },
  {
    id: 'pos_mode4',
    text: (a) => {
      const d = matrixDomainsWithMode(a, 'M4')[0]
      return `You operate in Mode 4 (Sparring Partner) in ${domainLabel(d)}. That's the mode most consistently associated with transfer learning in the corpus. Whatever you're doing there is worth keeping.`
    },
    trigger: (a) => matrixHas(a, 'M4'),
  },
  {
    id: 'pos_mode3',
    text: (a) => {
      const d = matrixDomainsWithMode(a, 'M3')[0]
      return `You operate in Mode 3 (Stewardship) in ${domainLabel(d)}. AI proposes, you dispose. That's the growth-mode pattern in practice.`
    },
    trigger: (a) => matrixHas(a, 'M3'),
  },
]

export const POSITIVE_CLOSER =
  'Frameworks like this one have a built-in negativity bias — they\'re designed to flag risk. What\'s working is also signal.'
