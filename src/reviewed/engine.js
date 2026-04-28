/* Your AI Use, Reviewed — Scoring engine.
   See ~/Desktop/Vishali/AI_Use_Reviewed/01_instrument_spec.md (Lean Signal Logic)
   The engine computes a score and lean band; the score is never displayed to the user.
   The user sees only the lean band + the strongest specific signals from their answers. */

import { DOMAINS } from './items.js'
import { RECOMMENDATIONS, POSITIVE_SIGNALS, POSITIVE_CLOSER, SEVERITY } from './recommendations.js'

const CRITICAL_DOMAINS = DOMAINS.filter((d) => d.critical).map((d) => d.id)
const NON_CRITICAL_DOMAINS = DOMAINS.filter((d) => !d.critical).map((d) => d.id)

/* Score the user's answers. Returns { score, signals, item1Skipped }
   where signals is an array of { weight, label } describing what drove the score. */
export function scoreAnswers(answers) {
  const signals = []
  let score = 0
  const item1Skipped = answers.item1 === 'no_recent'

  /* ── Item 1: form view first ── */
  if (!item1Skipped) {
    if (answers.item1 === 'yes') {
      score += 2
      signals.push({ weight: 2, label: 'You formed your own position before opening AI on your last task' })
    } else if (answers.item1 === 'partly') {
      score += 1
      signals.push({ weight: 1, label: 'You had a rough draft or bullet points before opening AI on your last task' })
    } else if (answers.item1 === 'forming') {
      score -= 1
      signals.push({ weight: -1, label: 'On your last task, your opinion was forming as you read what AI gave you' })
    } else if (answers.item1 === 'no_position') {
      score -= 2
      signals.push({ weight: -2, label: 'You went into your last AI-assisted task without forming a position first' })
    }
  }

  /* ── Item 2: catch it if wrong ── */
  if (!item1Skipped) {
    if (answers.item2 === 'very' || answers.item2 === 'fairly') {
      score += 1
      signals.push({ weight: 1, label: 'You\'re confident you would catch it if AI gave you something subtly wrong' })
    } else if (answers.item2 === 'outside') {
      score -= 1
      signals.push({ weight: -1, label: 'The last AI task was outside your expertise to verify' })
    } else if (answers.item2 === 'didnt_check') {
      score -= 2
      signals.push({ weight: -2, label: "You didn't think to check the last AI output" })
    }
  }

  /* ── Item 8: IoCs ── */
  const iocCount = answers.iocs?.length || 0
  if (iocCount >= 5) {
    score -= 3
    signals.push({ weight: -3, label: `You flagged ${iocCount} of the 8 cognitive indicators of compromise` })
  } else if (iocCount >= 3) {
    score -= 1
    signals.push({ weight: -1, label: `You flagged ${iocCount} of the 8 cognitive indicators` })
  } else if (iocCount <= 1) {
    score += 1
    signals.push({
      weight: 1,
      label: iocCount === 0
        ? 'You did not flag any of the 8 cognitive indicators'
        : 'You flagged only one of the 8 cognitive indicators',
    })
  }

  /* ── Mode matrix ── */
  let mode4Count = 0
  let mode3Count = 0
  let mode7Counted = false

  for (const domain of DOMAINS) {
    const mode = answers.matrix?.[domain.id]
    if (!mode || mode === 'NA') continue

    if (mode === 'M4' && mode4Count < 2) {
      score += 2
      mode4Count++
      signals.push({
        weight: 2,
        label: `You operate in Mode 4 (Sparring Partner) on ${domain.label.toLowerCase()}`,
      })
    } else if (mode === 'M3' && mode3Count < 3) {
      score += 1
      mode3Count++
      signals.push({
        weight: 1,
        label: `You operate in Mode 3 (Stewardship) on ${domain.label.toLowerCase()}`,
      })
    } else if (mode === 'M7' && !mode7Counted) {
      score += 1
      mode7Counted = true
      signals.push({
        weight: 1,
        label: 'You keep AI out of at least one domain by choice (Mode 7)',
      })
    } else if (mode === 'M1') {
      const isCritical = CRITICAL_DOMAINS.includes(domain.id)
      const weight = isCritical ? -2 : -1
      score += weight
      signals.push({
        weight,
        label: `You operate in Mode 1 (Autopilot) on ${domain.label.toLowerCase()}${
          isCritical ? ' — a domain where voice flattening and judgment delegation are most studied' : ''
        }`,
      })
    } else if (mode === 'M5_BORDER') {
      const isCritical = CRITICAL_DOMAINS.includes(domain.id)
      if (isCritical) {
        score -= 1
        signals.push({
          weight: -1,
          label: `You take AI first drafts with light editing on ${domain.label.toLowerCase()} — borderline Mode 1 in a critical domain`,
        })
      }
    }
  }

  /* ── Item 9: configuration / mode contracts ── */
  if (answers.configuration === 'always' || answers.configuration === 'often') {
    score += 1
    signals.push({
      weight: 1,
      label: 'You name what kind of help you want when you start an AI session (mode contracts)',
    })
  } else if (answers.configuration === 'rarely' || answers.configuration === 'never') {
    score -= 1
    signals.push({
      weight: -1,
      label: "You rarely or never tell AI what kind of help you want — no mode contracts",
    })
  }

  /* ── Item 10: frontier awareness ── */
  if (answers.frontier === 'clear') {
    score += 1
    signals.push({
      weight: 1,
      label: 'You have a mental model of where AI is reliable for your work (frontier awareness)',
    })
  } else if (answers.frontier === 'no_line' || answers.frontier === 'havent') {
    score -= 1
    signals.push({
      weight: -1,
      label: "You haven't drawn a clear line between in-frontier and out-of-frontier AI tasks for your work",
    })
  }

  /* ── Item 11: hands-off discipline ── */
  if (answers.handsOff === 'yes_named') {
    score += 1
    signals.push({
      weight: 1,
      label: 'You can name domains you deliberately keep AI out of, and why',
    })
  }

  /* Sort signals so the strongest (positive or negative magnitude) appear first */
  signals.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))

  return { score, signals, item1Skipped }
}

/* Determine the lean band from the score. */
export function leanBand(score) {
  if (score >= 3) return 'maintaining'
  if (score <= -3) return 'degrading'
  return 'mixed'
}

/* Lean signal config — text shown at top of results page. */
export const LEAN_TEXT = {
  maintaining: {
    headline: 'Based on your answers, your current AI practice is leaning toward **maintaining** cognition in the work you described.',
    intro: 'The strongest signals from your answers:',
    closer: 'This is a snapshot, not a verdict. Practice is changeable. The experiments below name what to keep doing and what to stretch into.',
    accent: '#047857', // green
  },
  mixed: {
    headline: 'Based on your answers, your current AI practice is showing **mixed signals** — some patterns associated with cognitive growth, some associated with cognitive decline.',
    intro: 'The breakdown:',
    closer: 'This is a snapshot, not a verdict. The mixed band is where most readers of this framework start. The experiments below name where to focus first.',
    accent: '#0e7490', // teal
  },
  degrading: {
    headline: 'Based on your answers, your current AI practice is leaning toward **degrading** cognition in the work you described.',
    intro: 'The strongest signals from your answers:',
    closer: 'This is a snapshot, not a verdict. Practice is changeable. Three of the experiments below speak directly to what\'s driving the lean.',
    accent: '#b91c1c', // red
  },
}

/* Compose top-3 signal bullets for the lean block. */
export function topSignalBullets(signals, band) {
  if (band === 'maintaining') {
    /* Show the strongest positive signals */
    return signals.filter((s) => s.weight > 0).slice(0, 3).map((s) => s.label)
  }
  if (band === 'degrading') {
    /* Show the strongest negative signals */
    return signals.filter((s) => s.weight < 0).slice(0, 3).map((s) => s.label)
  }
  /* Mixed: show top 2 negative + top 1 positive (or similar mix) */
  const positives = signals.filter((s) => s.weight > 0).slice(0, 2)
  const negatives = signals.filter((s) => s.weight < 0).slice(0, 2)
  return [...negatives, ...positives].slice(0, 3).map((s) => s.label)
}

/* Generate the active recommendations, ranked, and capped at top 3 main + remainder. */
export function generateRecommendations(answers) {
  const fired = RECOMMENDATIONS.filter((r) => r.trigger(answers))

  /* Sort by severity descending */
  fired.sort((a, b) => SEVERITY[b.severity] - SEVERITY[a.severity])

  const top3 = fired.slice(0, 3).map((r) => ({
    id: r.id,
    severity: r.severity,
    headline: r.headline,
    body: typeof r.body === 'function' ? r.body(answers) : r.body,
    evidence: r.evidence,
    whyForYou: typeof r.whyForYou === 'function' ? r.whyForYou(answers) : r.whyForYou,
  }))

  const more = fired.slice(3).map((r) => ({
    id: r.id,
    severity: r.severity,
    headline: r.headline,
    body: typeof r.body === 'function' ? r.body(answers) : r.body,
    evidence: r.evidence,
    whyForYou: typeof r.whyForYou === 'function' ? r.whyForYou(answers) : r.whyForYou,
  }))

  return { top3, more }
}

/* Generate the R10 positive callout — appears as separate panel for mixed/degrading users
   with positive signals; for maintaining users, the lean block already covers this so
   we don't double up. */
export function generatePositiveCallout(answers, band) {
  if (band === 'maintaining') return null

  const fired = POSITIVE_SIGNALS.filter((s) => s.trigger(answers))
  if (fired.length === 0) return null

  const items = fired.slice(0, 3).map((s) => (typeof s.text === 'function' ? s.text(answers) : s.text))

  return {
    items,
    closer: POSITIVE_CLOSER,
  }
}

/* Compute mode profile for the visual bars on the results page. */
export function modeProfile(answers) {
  return DOMAINS.map((d) => ({
    domain: d,
    mode: answers.matrix?.[d.id] || null,
  }))
}
