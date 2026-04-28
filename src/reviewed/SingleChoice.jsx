/* Single-choice question component. Used for Items 1, 2, 9, 10, 11. */
export default function SingleChoice({ item, value, onChange, onNext, onBack }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16 pb-16">
      <div className="max-w-2xl w-full">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">
          {item.title}
        </p>
        <h2 className="text-[clamp(1.5rem,4vw,2rem)] leading-[1.3] text-[#1a1a2e] mb-10" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          {item.prompt}
        </h2>

        <div className="space-y-3">
          {item.options.map((opt) => {
            const isSelected = value === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#004d54] border-[#004d54] text-white'
                    : 'bg-white border-[#004d54]/15 text-[#2d2d3f] hover:border-[#00b8a9] hover:bg-[#00b8a9]/5'
                }`}
              >
                <span className="text-[15px] leading-[1.5]">{opt.label}</span>
              </button>
            )
          })}
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
            disabled={!value}
            className={`inline-flex items-center gap-2 ui-text text-[13px] font-medium rounded-full px-7 py-3 transition-all duration-200 ${
              value
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
