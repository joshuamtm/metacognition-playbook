/* Per-domain mode matrix. Each row = a work domain. Each row has its own list of
   mode options. We render it as 5 stacked compact pickers (one per domain) — easier
   on mobile than a true cross-tab. */
import { DOMAINS, MODE_OPTIONS } from './items.js'

export default function Matrix({ value, onChange, onNext, onBack }) {
  const allAnswered = DOMAINS.every((d) => value?.[d.id])

  const setDomain = (domainId, modeValue) => {
    onChange({ ...(value || {}), [domainId]: modeValue })
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 pb-16">
      <div className="max-w-3xl w-full">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">
          How you typically use AI
        </p>
        <h2 className="text-[clamp(1.4rem,3.8vw,1.85rem)] leading-[1.35] text-[#1a1a2e] mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          For each area of your work, pick the closest match.
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-10 leading-relaxed">
          If a domain doesn't apply to your work, mark "Doesn't apply." Pick one per row.
        </p>

        <div className="space-y-8">
          {DOMAINS.map((domain) => (
            <div key={domain.id} className="bg-white rounded-xl border border-[#004d54]/10 p-6">
              <p className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.05em] uppercase mb-1">
                {domain.label}
              </p>
              <p className="text-[13px] text-[#6b7280] mb-5 italic">{domain.sub}</p>
              <div className="space-y-2">
                {MODE_OPTIONS.map((opt) => {
                  const isSelected = value?.[domain.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setDomain(domain.id, opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-[14px] leading-[1.4] transition-all duration-150 ${
                        isSelected
                          ? 'bg-[#004d54] border-[#004d54] text-white'
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
