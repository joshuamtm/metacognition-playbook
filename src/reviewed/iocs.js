/* Your AI Use, Reviewed — IoC definitions with tooltips.
   See ~/Desktop/Vishali/AI_Use_Reviewed/03_ioc_tooltips.md */

export const IOCS = [
  {
    id: 'agreement',
    name: 'Uncharacteristic agreement',
    label: "Accepting an AI answer where I'd normally push back if a colleague said it",
    tooltip:
      "If a colleague had said the same thing, you'd push back, or at least probe. AI gets a pass — not because it's more credible, but because it's more frictionless to accept.",
  },
  {
    id: 'curiosity',
    name: 'Compressed curiosity',
    label: 'Stopping at the first AI answer instead of probing further',
    tooltip:
      "AI gives you a plausible answer fast. The danger isn't that the answer is wrong; it's that 'plausible and fast' satisfies the curiosity that would have generated the next question.",
  },
  {
    id: 'drift',
    name: 'Context drift',
    label: 'Letting AI redefine the question I started with',
    tooltip:
      "You started by asking one thing. AI subtly reframed it. Three turns later, you're answering AI's question, not yours.",
  },
  {
    id: 'familiarity',
    name: 'False familiarity',
    label: 'Feeling I understand a topic from an AI summary alone',
    tooltip:
      "A good summary creates the feeling of having understood. The feeling is real; the understanding may not be. Especially dangerous on topics you'll later have to defend.",
  },
  {
    id: 'judgment',
    name: 'Judgment delegation',
    label: 'Outsourcing a call that probably should have been mine to make',
    tooltip:
      "Some calls are yours by role, expertise, or stakes. When AI's answer becomes the answer, the role hasn't moved — but the judgment has.",
  },
  {
    id: 'confidence',
    name: 'Confidence inflation',
    label: 'Feeling more confident about something than my evidence warrants',
    tooltip:
      "More information doesn't always mean more knowing. AI delivers polished output that registers as evidence of grip — even when the underlying understanding is shallow.",
  },
  {
    id: 'fatigue',
    name: 'Verification fatigue',
    label: 'Defaulting to acceptance because checking is tiring',
    tooltip:
      "Each individual check feels reasonable. The cumulative effort of checking everything doesn't. The slide is from 'usually verify' to 'verify when convenient' to 'I trust this.'",
  },
  {
    id: 'phrase',
    name: 'Phrase contamination',
    label: 'My writing starting to sound noticeably AI-flavored',
    tooltip:
      'Your writing starts using more colons. More tricolons. More "It\'s not just X, it\'s Y." Distinctive phrasing flattens toward a model average. Often noticed first by people who know your writing.',
  },
]

export const IOC_NONE = { id: 'none', label: "None of these — that I've noticed" }
