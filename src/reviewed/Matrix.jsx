/* Per-domain mode matrix — Option B layout.
   Desktop (md+): column-header legend + horizontal pill-strip per domain row.
   Mobile (<md): stacked card with full-label buttons per domain (original layout). */
import { DOMAINS, MODE_OPTIONS } from './items.js'

/* Compact column labels — full sentence is in MODE_OPTIONS.label and shown via title attr / mobile. */
const COL_SHORT = {
  M7: 'Hands Off',
  M4: 'Spar',
  M3: 'Steward',
  M5: 'Rework',
  M5_BORDER: 'Light Edit',
  M1: 'Autopilot',
  NA: 'N/A',
}

/* Abbreviated descriptions for the legend (shorter than full labels but more than column headers). */
const COL_SHORT_DESC = {
  M7: "I don't use AI here",
  M4: 'Form view, ask to challenge',
  M3: 'Form view, ask to refine',
  M5: 'AI drafts, I rework',
  M5_BORDER: 'AI drafts, I lightly edit',
  M1: 'Take with minimal review',
  NA: "Doesn't apply",
}

export default function Matrix({ value, onChange, onNext, onBack }) {
  const allAnswered = DOMAINS.every((d) => value?.[d.id])
  const setDomain = (domainId, modeValue) => {
    onChange({ ...(value || {}), [domainId]: modeValue })
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-16">
      <div className="max-w-5xl w-full">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">
          How you typically use AI
        </p>
        <h2
          className="text-[clamp(1.4rem,3.8vw,1.85rem)] leading-[1.35] text-[#1a1a2e] mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
        >
          For each area of your work, pick the closest match.
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-8 leading-relaxed">
          One per row. If a domain doesn't apply to your work, mark "N/A."
        </p>

        {/* Legend — visible at all viewports, helps decode the column abbreviations on desktop */}
        <details className="md:open mb-6 bg-[#faf9f6] border border-[#004d54]/10 rounded-xl group" open>
          <summary className="cursor-pointer list-none px-5 py-3 flex items-center gap-2 ui-text text-[10px] tracking-[0.1em] uppercase font-semibold text-[#004d54] hover:text-[#00b8a9] transition-colors">
            <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            How to read the columns
          </summary>
          <dl className="px-5 pb-4 pt-1 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px] leading-relaxed">
            {MODE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex gap-2">
                <dt className="ui-text font-semibold text-[#004d54] shrink-0">{COL_SHORT[opt.value]}</dt>
                <dd className="text-[#6b7280]">— {COL_SHORT_DESC[opt.value]}</dd>
              </div>
            ))}
          </dl>
        </details>

        {/* DESKTOP: column-header + horizontal pill-strip per row */}
        <div className="hidden md:block bg-white rounded-xl border border-[#004d54]/10 overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[minmax(180px,1.4fr)_repeat(6,minmax(0,1fr))_minmax(60px,0.6fr)] gap-2 px-4 py-3 bg-[#f2f0eb] border-b border-[#004d54]/10">
            <div />
            {MODE_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={`text-center ui-text text-[10px] tracking-[0.05em] uppercase font-semibold ${
                  opt.value === 'NA' ? 'text-[#9ca3af]' : 'text-[#004d54]'
                }`}
                title={opt.label}
              >
                {COL_SHORT[opt.value]}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DOMAINS.map((domain, idx) => (
            <div
              key={domain.id}
              className={`grid grid-cols-[minmax(180px,1.4fr)_repeat(6,minmax(0,1fr))_minmax(60px,0.6fr)] gap-2 px-4 py-4 items-center ${
                idx !== DOMAINS.length - 1 ? 'border-b border-[#004d54]/8' : ''
              }`}
            >
              <div>
                <p className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.03em] uppercase mb-0.5">
                  {domain.label}
                </p>
                <p className="text-[12px] text-[#6b7280] italic leading-snug">{domain.sub}</p>
              </div>
              {MODE_OPTIONS.map((opt) => {
                const isSelected = value?.[domain.id] === opt.value
                const isNA = opt.value === 'NA'
                return (
                  <div key={opt.value} className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setDomain(domain.id, opt.value)}
                      aria-label={`${domain.label}: ${opt.label}`}
                      aria-pressed={isSelected}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                        isSelected
                          ? isNA
                            ? 'bg-[#9ca3af] border-[#9ca3af]'
                            : 'bg-[#004d54] border-[#004d54]'
                          : isNA
                          ? 'border-[#d1d5db] hover:border-[#9ca3af] bg-white'
                          : 'border-[#004d54]/30 hover:border-[#00b8a9] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* MOBILE: stacked cards with full-label buttons (one per domain) */}
        <div className="md:hidden space-y-6">
          {DOMAINS.map((domain) => (
            <div key={domain.id} className="bg-white rounded-xl border border-[#004d54]/10 p-5">
              <p className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.05em] uppercase mb-1">
                {domain.label}
              </p>
              <p className="text-[13px] text-[#6b7280] mb-4 italic">{domain.sub}</p>
              <div className="space-y-2">
                {MODE_OPTIONS.map((opt) => {
                  const isSelected = value?.[domain.id] === opt.value
                  const isNA = opt.value === 'NA'
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDomain(domain.id, opt.value)}
                      aria-pressed={isSelected}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-[14px] leading-[1.4] transition-all duration-150 ${
                        isSelected
                          ? isNA
                            ? 'bg-[#9ca3af] border-[#9ca3af] text-white'
                            : 'bg-[#004d54] border-[#004d54] text-white'
                          : isNA
                          ? 'bg-[#faf9f6] border-[#d1d5db] text-[#6b7280] hover:border-[#9ca3af]'
                          : 'bg-[#faf9f6] border-[#004d54]/10 text-[#2d2d3f] hover:border-[#00b8a9]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={onBack}
            className="ui-text text-[13px] text-[#6b7280] hover:text-[#004d54] transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            disabled={!allAnswered}
            className={`inline-flex items-center gap-2 ui-text text-[13px] font-medium rounded-full px-7 py-3 transition-all duration-200 ${
              allAnswered
                ? 'bg-[#004d54] text-white hover:bg-[#00b8a9]'
                : 'bg-[#d1d5db] text-white cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
