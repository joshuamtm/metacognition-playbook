/* Persistent header on the assessment — small, unobtrusive, links back to report.
   Compact on narrow viewports: chevron + "Report" instead of full title; short progress count. */
export default function Header({ progress }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#faf9f6]/85 backdrop-blur-xl border-b border-[#004d54]/8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12 gap-3">
        <a
          href="/"
          className="ui-text text-[11px] tracking-[0.15em] uppercase text-[#004d54] font-semibold hover:text-[#00b8a9] transition-colors whitespace-nowrap"
        >
          <span className="sm:hidden">← Report</span>
          <span className="hidden sm:inline">← The Metacognition Playbook</span>
        </a>
        {progress != null ? (
          <span className="ui-text text-[10px] tracking-[0.1em] uppercase text-[#9ca3af] whitespace-nowrap">
            {progress}
          </span>
        ) : (
          <span className="ui-text text-[10px] tracking-[0.1em] uppercase text-[#9ca3af] whitespace-nowrap hidden sm:inline">
            Your AI Use, Reviewed
          </span>
        )}
      </div>
    </header>
  )
}
