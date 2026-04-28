/* Persistent header on the assessment — small, unobtrusive, links back to report. */
export default function Header({ progress }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#faf9f6]/85 backdrop-blur-xl border-b border-[#004d54]/8">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-12">
        <a
          href="/"
          className="ui-text text-[11px] tracking-[0.15em] uppercase text-[#004d54] font-semibold hover:text-[#00b8a9] transition-colors"
        >
          ← The Metacognition Playbook
        </a>
        <span className="ui-text text-[10px] tracking-[0.1em] uppercase text-[#9ca3af]">
          {progress != null ? `Step ${progress}` : 'Your AI Use, Reviewed'}
        </span>
      </div>
    </header>
  )
}
