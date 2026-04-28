/* Results page — lean signal at top, mode profile, IoC flags, experiments, positive callout. */
import { DOMAINS, MODE_LABELS, MODE_TIERS } from './items.js'
import { IOCS } from './iocs.js'
import FormattedText from './FormattedText.jsx'
import {
  scoreAnswers,
  leanBand,
  LEAN_TEXT,
  topSignalBullets,
  generateRecommendations,
  generatePositiveCallout,
  modeProfile,
} from './engine.js'

const TIER_COLORS = {
  growth: { bg: '#047857', light: 'rgba(4,120,87,0.1)' },
  conditional: { bg: '#0e7490', light: 'rgba(14,116,144,0.1)' },
  border: { bg: '#d97706', light: 'rgba(217,119,6,0.1)' },
  decline: { bg: '#b91c1c', light: 'rgba(185,28,28,0.1)' },
  protected: { bg: '#6d28d9', light: 'rgba(109,40,217,0.1)' },
  declared: { bg: '#8b95a5', light: 'rgba(139,149,165,0.1)' },
  na: { bg: '#d1d5db', light: 'rgba(209,213,219,0.1)' },
}

const TIER_LABELS = {
  growth: 'Growth',
  conditional: 'Conditional',
  border: 'Border',
  decline: 'Decline',
  protected: 'Protected (Hands Off)',
  declared: 'Declared',
  na: "Doesn't apply",
}

function LeanBlock({ band, signals, item1Skipped }) {
  const text = LEAN_TEXT[band]
  const bullets = topSignalBullets(signals, band)

  return (
    <section className="px-6 pt-32 pb-16 bg-[#faf9f6]">
      <div className="max-w-3xl mx-auto">
        <p className="ui-text text-[11px] font-semibold tracking-[0.25em] uppercase mb-6" style={{ color: text.accent }}>
          Your Result
        </p>
        <h1 className="text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.3] text-[#1a1a2e] mb-8" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          <FormattedText text={text.headline} />
        </h1>

        <div className="bg-white rounded-2xl border-l-4 p-7 mb-8" style={{ borderColor: text.accent }}>
          <p className="ui-text text-[11px] font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: text.accent }}>
            {text.intro}
          </p>
          <ul className="space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-1.5" style={{ color: text.accent }}>•</span>
                <span className="text-[15px] leading-[1.6] text-[#2d2d3f]/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[14px] text-[#6b7280] italic leading-relaxed">
          {text.closer}
        </p>

        {item1Skipped && (
          <p className="ui-text text-[12px] text-[#d97706] bg-[#d97706]/8 px-4 py-3 rounded-lg mt-6 leading-relaxed">
            ⚠ Lean estimated without Items 1 and 2 (you indicated no recent AI-assisted task). Take this assessment again after a real AI task for a sharper read.
          </p>
        )}
      </div>
    </section>
  )
}

function ModeProfile({ answers }) {
  const profile = modeProfile(answers)
  const applicable = profile.filter((p) => p.mode && p.mode !== 'NA')
  const growthCount = applicable.filter((p) => MODE_TIERS[p.mode] === 'growth').length

  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Your Mode Profile
        </p>
        <h2 className="text-[clamp(1.4rem,3.5vw,1.85rem)] text-[#004d54] mb-8" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Where you operate, by domain
        </h2>

        <div className="space-y-4">
          {profile.map(({ domain, mode }) => {
            const tier = mode ? MODE_TIERS[mode] : 'na'
            const colors = TIER_COLORS[tier]
            return (
              <div key={domain.id} className="bg-white rounded-xl border border-[#004d54]/8 p-5">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <p className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.05em] uppercase">
                    {domain.label}
                  </p>
                  <p className="ui-text text-[10px] tracking-[0.1em] uppercase font-semibold" style={{ color: colors.bg }}>
                    {TIER_LABELS[tier]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 rounded-full flex-1" style={{ backgroundColor: colors.light }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: colors.bg, width: mode && mode !== 'NA' ? '100%' : '0%' }} />
                  </div>
                  <p className="text-[13px] text-[#2d2d3f]/70 shrink-0 max-w-[60%] text-right">
                    {mode && mode !== 'NA' ? MODE_LABELS[mode] : "Doesn't apply"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {applicable.length > 0 && (
          <p className="text-[14px] text-[#6b7280] italic mt-6 leading-relaxed">
            You're operating in growth modes for {growthCount} of your {applicable.length} applicable
            domains.
          </p>
        )}
      </div>
    </section>
  )
}

function IoCFlags({ answers }) {
  const flagged = (answers.iocs || []).filter((id) => id !== 'none')
  const flaggedNone = (answers.iocs || []).includes('none')

  if (flagged.length === 0 && !flaggedNone) return null

  return (
    <section className="px-6 py-16 bg-[#f2f0eb]">
      <div className="max-w-3xl mx-auto">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Indicators
        </p>
        <h2 className="text-[clamp(1.4rem,3.5vw,1.85rem)] text-[#004d54] mb-8" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          What you flagged
        </h2>

        {flaggedNone ? (
          <div className="bg-white rounded-xl border border-[#004d54]/8 p-6">
            <p className="text-[15px] leading-[1.7] text-[#2d2d3f]/80">
              You didn't flag any of the 8 indicators. Most heavy AI users notice at least one.
              Two possibilities: you're operating very deliberately, or the patterns are below
              your awareness threshold. Worth re-asking yourself in two weeks.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {flagged.map((id) => {
              const ioc = IOCS.find((x) => x.id === id)
              if (!ioc) return null
              return (
                <div key={id} className="bg-white rounded-xl border border-[#004d54]/8 p-5">
                  <p className="ui-text text-[11px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-2">
                    {ioc.name}
                  </p>
                  <p className="text-[14px] leading-[1.6] text-[#2d2d3f]/75">
                    {ioc.tooltip}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function PositiveCallout({ callout }) {
  if (!callout) return null
  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#047857]/[0.05] border border-[#047857]/15 rounded-2xl p-7">
          <p className="ui-text text-[#047857] text-[11px] font-semibold tracking-[0.2em] uppercase mb-5">
            What's working
          </p>
          <ul className="space-y-3 mb-5">
            {callout.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#047857] mt-1.5 shrink-0">•</span>
                <span className="text-[15px] leading-[1.65] text-[#2d2d3f]/85">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[14px] text-[#2d2d3f]/60 italic leading-relaxed">
            {callout.closer}
          </p>
        </div>
      </div>
    </section>
  )
}

function Experiments({ recs }) {
  const top3 = recs.top3
  if (top3.length === 0) {
    return (
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
            Experiments
          </p>
          <p className="text-[16px] text-[#2d2d3f]/75 leading-relaxed">
            None of the trigger rules in the recommendations engine fired for you. That means
            your answers don't show any of the patterns the framework flags as worth changing —
            unusual, and worth taking with the same skepticism as any too-clean result.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Experiments
        </p>
        <h2 className="text-[clamp(1.4rem,3.5vw,1.85rem)] text-[#004d54] mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          {top3.length === 1 ? 'One experiment to try' : `${top3.length === 2 ? 'Two' : 'Three'} experiments to try`}
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-8 leading-relaxed">
          Each is grounded in a specific study from the corpus. These are experiments, not
          prescriptions — try one and see what happens.
        </p>

        <div className="space-y-6">
          {top3.map((rec, idx) => (
            <div key={rec.id} className="bg-white rounded-xl border border-[#004d54]/10 p-7">
              <p className="ui-text text-[10px] font-bold text-[#00b8a9] tracking-[0.15em] uppercase mb-3">
                Experiment {idx + 1}
              </p>
              <h3 className="text-[20px] leading-[1.35] text-[#1a1a2e] mb-4 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                {rec.headline}
              </h3>
              <div className="text-[15px] leading-[1.7] text-[#2d2d3f]/80 mb-5 whitespace-pre-line">
                <FormattedText text={rec.body} />
              </div>
              <div className="bg-[#f2f0eb] rounded-lg px-5 py-4 mb-4">
                <p className="ui-text text-[10px] font-semibold text-[#004d54]/70 tracking-[0.1em] uppercase mb-2">
                  Evidence
                </p>
                <p className="text-[13px] leading-[1.6] text-[#2d2d3f]/75 italic">
                  {rec.evidence}
                </p>
              </div>
              <p className="text-[13px] leading-[1.6] text-[#6b7280]">
                <span className="font-semibold text-[#004d54]">Why this for you:</span>{' '}
                {rec.whyForYou}
              </p>
            </div>
          ))}
        </div>

        {recs.more.length > 0 && (
          <details className="mt-8 cursor-pointer group">
            <summary className="ui-text text-[12px] tracking-[0.1em] uppercase text-[#00b8a9] hover:text-[#004d54] transition-colors font-semibold list-none flex items-center gap-2">
              <span>Show {recs.more.length} more experiments</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-5 space-y-6">
              {recs.more.map((rec) => (
                <div key={rec.id} className="bg-white rounded-xl border border-[#004d54]/10 p-7">
                  <h3 className="text-[18px] leading-[1.35] text-[#1a1a2e] mb-4 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                    {rec.headline}
                  </h3>
                  <div className="text-[14px] leading-[1.7] text-[#2d2d3f]/80 mb-4 whitespace-pre-line">
                    <FormattedText text={rec.body} />
                  </div>
                  <p className="text-[12px] leading-[1.55] text-[#6b7280] italic">
                    {rec.evidence}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  )
}

function Caveats() {
  return (
    <section className="px-6 py-16 bg-[#f2f0eb]">
      <div className="max-w-2xl mx-auto">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Epistemic Honesty
        </p>
        <h2 className="text-[clamp(1.3rem,3.2vw,1.6rem)] text-[#004d54] mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          What this result is and isn't
        </h2>
        <ul className="space-y-3 text-[14px] leading-[1.7] text-[#2d2d3f]/70">
          <li className="flex gap-3"><span className="text-[#00b8a9] mt-1.5 shrink-0">•</span><span>This is self-report. People in decline modes often think they're in growth modes — that's the symptom being measured.</span></li>
          <li className="flex gap-3"><span className="text-[#00b8a9] mt-1.5 shrink-0">•</span><span>The framework is a working model, not an empirically validated measurement instrument.</span></li>
          <li className="flex gap-3"><span className="text-[#00b8a9] mt-1.5 shrink-0">•</span><span>The lean band uses transparent scoring rules; the rules are heuristic, not empirically calibrated against outcomes.</span></li>
          <li className="flex gap-3"><span className="text-[#00b8a9] mt-1.5 shrink-0">•</span><span>Results aren't saved. Refreshing the page resets everything. v0.2 may add an opt-in URL snapshot for self-comparison.</span></li>
          <li className="flex gap-3"><span className="text-[#00b8a9] mt-1.5 shrink-0">•</span><span>Joshua sells a Personal AI Accelerator that uses this framework. Read the recommendations skeptically because of it.</span></li>
        </ul>
      </div>
    </section>
  )
}

function PairWith() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Pair this with
        </p>
        <h2 className="text-[clamp(1.4rem,3.5vw,1.85rem)] text-[#004d54] mb-8" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          What to read or do next
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="/"
            className="bg-white rounded-xl border border-[#004d54]/10 p-6 text-left hover:border-[#00b8a9] hover:shadow-md transition-all"
          >
            <p className="ui-text text-[10px] font-bold text-[#00b8a9] tracking-[0.15em] uppercase mb-2">Read</p>
            <p className="text-[15px] leading-[1.5] text-[#004d54] font-semibold mb-2">The Metacognition Playbook</p>
            <p className="text-[12px] leading-[1.55] text-[#6b7280]">The full 36-study research synthesis these recommendations are drawn from.</p>
          </a>
          <a
            href="https://metacognitive-readiness.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-xl border border-[#004d54]/10 p-6 text-left hover:border-[#00b8a9] hover:shadow-md transition-all"
          >
            <p className="ui-text text-[10px] font-bold text-[#00b8a9] tracking-[0.15em] uppercase mb-2">Take</p>
            <p className="text-[15px] leading-[1.5] text-[#004d54] font-semibold mb-2">The Metacognitive Readiness Assessment</p>
            <p className="text-[12px] leading-[1.55] text-[#6b7280]">The trait companion to this tool. Measures cognitive disposition (CRT, NCS, AOT, Ecosystem).</p>
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer({ onRetake }) {
  return (
    <footer className="py-16 px-6 bg-[#004d54] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#003038] to-[#004d54]" />
      <div className="max-w-2xl mx-auto text-center relative z-10 space-y-5">
        <button
          onClick={onRetake}
          className="ui-text text-[12px] tracking-[0.1em] uppercase text-[#00b8a9] hover:text-white transition-colors"
        >
          ↺ Take the review again
        </button>
        <p className="text-[13px] text-white/45 leading-relaxed">
          Your AI Use, Reviewed — companion to The Metacognition Playbook.
        </p>
        <p className="text-[13px] text-white/45 leading-relaxed">
          The analysis, framework, and editorial voice are Joshua's. The synthesis was AI-assisted and human-directed.
        </p>
        <p className="ui-text text-[10px] text-white/20 pt-4">© 2026 Meet the Moment. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function Results({ answers, onRetake }) {
  const { score, signals, item1Skipped } = scoreAnswers(answers)
  const band = leanBand(score)
  const recs = generateRecommendations(answers)
  const positiveCallout = generatePositiveCallout(answers, band)

  return (
    <>
      <LeanBlock band={band} signals={signals} item1Skipped={item1Skipped} />
      <ModeProfile answers={answers} />
      <IoCFlags answers={answers} />
      {positiveCallout && <PositiveCallout callout={positiveCallout} />}
      <Experiments recs={recs} />
      <Caveats />
      <PairWith />
      <Footer onRetake={onRetake} />
    </>
  )
}
