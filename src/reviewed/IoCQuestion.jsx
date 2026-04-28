/* IoC multi-select with tooltips. Item 8. */
import { useState, useEffect, useRef } from 'react'
import { IOCS, IOC_NONE } from './iocs.js'

export default function IoCQuestion({ value, onChange, onNext, onBack }) {
  const [tooltipOpen, setTooltipOpen] = useState(null)
  const tooltipRefs = useRef({})
  const selected = value || []

  /* Outside-click dismissal for the floating tooltip panel */
  useEffect(() => {
    if (!tooltipOpen) return
    const onDocClick = (e) => {
      const node = tooltipRefs.current[tooltipOpen]
      if (node && !node.contains(e.target)) setTooltipOpen(null)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('touchstart', onDocClick)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('touchstart', onDocClick)
    }
  }, [tooltipOpen])

  const toggle = (id) => {
    if (id === 'none') {
      // selecting "none" clears all others; selecting an IoC clears "none"
      onChange(selected.includes('none') ? [] : ['none'])
      return
    }
    let next
    if (selected.includes(id)) {
      next = selected.filter((x) => x !== id)
    } else {
      next = selected.filter((x) => x !== 'none').concat(id)
    }
    onChange(next)
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 pb-16">
      <div className="max-w-2xl w-full">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">
          Have you noticed any of these?
        </p>
        <h2 className="text-[clamp(1.4rem,3.8vw,1.85rem)] leading-[1.35] text-[#1a1a2e] mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          In the past two weeks, have you noticed any of these in your own AI use?
        </h2>
        <p className="text-[14px] text-[#6b7280] mb-10 leading-relaxed">
          Check all that apply — no shame, this is a snapshot, not a verdict. Hover the question
          marks for what each pattern looks like.
        </p>

        <div className="space-y-3">
          {IOCS.map((ioc) => {
            const isSelected = selected.includes(ioc.id)
            const isOpen = tooltipOpen === ioc.id
            return (
              <div key={ioc.id} className="relative" ref={(el) => (tooltipRefs.current[ioc.id] = el)}>
                <button
                  onClick={() => toggle(ioc.id)}
                  aria-pressed={isSelected}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#004d54] border-[#004d54] text-white'
                      : 'bg-white border-[#004d54]/15 text-[#2d2d3f] hover:border-[#00b8a9]'
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded border-2 mt-px flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white border-white'
                        : 'border-[#004d54]/30'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4 text-[#004d54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[15px] leading-[1.45] flex-1">{ioc.label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      setTooltipOpen(isOpen ? null : ioc.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        setTooltipOpen(isOpen ? null : ioc.id)
                      }
                    }}
                    onMouseEnter={() => setTooltipOpen(ioc.id)}
                    className={`shrink-0 w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center cursor-help transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white hover:bg-white/40'
                        : 'bg-[#004d54]/10 text-[#004d54] hover:bg-[#004d54]/20'
                    }`}
                    aria-label={`What is ${ioc.name}? Click for details.`}
                    aria-expanded={isOpen}
                  >
                    ?
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border border-[#004d54]/20 rounded-xl shadow-lg px-5 py-4"
                    onMouseLeave={() => setTooltipOpen(null)}
                  >
                    <button
                      onClick={() => setTooltipOpen(null)}
                      aria-label="Close tooltip"
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full hover:bg-[#004d54]/10 flex items-center justify-center text-[#6b7280] hover:text-[#004d54] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <p className="ui-text text-[10px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-2 pr-8">
                      {ioc.name}
                    </p>
                    <p className="text-[13px] leading-[1.55] text-[#2d2d3f]/80">{ioc.tooltip}</p>
                  </div>
                )}
              </div>
            )
          })}

          <div className="pt-2">
            <button
              onClick={() => toggle('none')}
              aria-pressed={selected.includes('none')}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                selected.includes('none')
                  ? 'bg-[#004d54] border-[#004d54] text-white'
                  : 'bg-[#f2f0eb] border-[#004d54]/15 text-[#2d2d3f] hover:border-[#00b8a9]'
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded border-2 mt-px flex items-center justify-center transition-colors ${
                  selected.includes('none') ? 'bg-white border-white' : 'border-[#004d54]/30'
                }`}
              >
                {selected.includes('none') && (
                  <svg className="w-4 h-4 text-[#004d54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-[15px] leading-[1.45] flex-1 italic">
                {IOC_NONE.label}
              </span>
            </button>
          </div>
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
            disabled={selected.length === 0}
            className={`inline-flex items-center gap-2 ui-text text-[13px] font-medium rounded-full px-7 py-3 transition-all duration-200 ${
              selected.length > 0
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
