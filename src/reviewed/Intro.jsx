/* Intro screen — caveats up front, set expectations, start button. */
export default function Intro({ onStart }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-12 pb-16">
      <div className="max-w-2xl">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.25em] uppercase mb-6">
          Companion to The Metacognition Playbook
        </p>
        <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] leading-[1.05] text-[#004d54] mb-6">
          Your AI Use,<br />Reviewed.
        </h1>
        <p className="text-[18px] text-[#2d2d3f]/75 leading-relaxed mb-10 max-w-xl">
          A 5–7 minute behavioral self-snapshot. You'll answer 7 short questions about how you
          actually use AI in your work. The results give you a directional read on whether
          your current practice is leaning toward maintaining or degrading cognition — plus
          two or three evidence-grounded experiments to try.
        </p>

        <div className="bg-[#f2f0eb] rounded-2xl p-7 mb-10 border border-[#004d54]/8">
          <p className="ui-text text-[11px] font-semibold text-[#004d54] tracking-[0.15em] uppercase mb-4">
            Before you start
          </p>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-[#2d2d3f]/75">
            <li className="flex gap-3">
              <span className="text-[#00b8a9] mt-1 shrink-0">•</span>
              <span>
                <strong className="text-[#004d54]">This is self-report.</strong> People in
                decline modes (passive acceptance) often think they're in growth modes
                (active engagement). That's a feature of what's being measured, not a flaw
                in you.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00b8a9] mt-1 shrink-0">•</span>
              <span>
                <strong className="text-[#004d54]">The framework is a working model.</strong>{' '}
                The 7 modes and 4 factors are a synthesis of 36 studies, not an empirically
                validated measurement instrument. If results don't match your sense of
                yourself, your sense of yourself may be more reliable.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00b8a9] mt-1 shrink-0">•</span>
              <span>
                <strong className="text-[#004d54]">No data is collected.</strong> Everything
                stays in your browser. Results are not saved.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00b8a9] mt-1 shrink-0">•</span>
              <span>
                <strong className="text-[#004d54]">Conflict of interest disclosed.</strong>{' '}
                Joshua sells a Personal AI Accelerator that uses this framework as its
                evidence base. Read the recommendations skeptically because of it, not
                despite it.
              </span>
            </li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 ui-text text-[14px] font-medium text-white bg-[#004d54] border border-[#004d54] rounded-full px-8 py-4 hover:bg-[#00b8a9] hover:border-[#00b8a9] transition-all duration-300 group"
        >
          Start the review
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
