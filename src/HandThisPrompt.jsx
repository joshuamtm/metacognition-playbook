/* "Hand This Prompt to Your Own AI" — copyable artifact + tool-specific tweaks.
   Same component renders on both Report.jsx and Reviewed.jsx (results page) so the
   prompt text is a single source of truth across surfaces. */
import { useState } from 'react'

export const PROMPT_TEXT = `You are acting as my honest reviewer of my AI use, not my flatterer. Your job is to look at our recent interactions and tell me whether my pattern of working with you is leaning toward maintaining my cognitive capability or eroding it.

This request is grounded in The Metacognition Playbook, a synthesis of 36 studies on AI and cognition. Here is the compact framework:

THE TWO DIAGNOSTIC QUESTIONS
- Was I trying to learn it, or finish it?
- Would I catch it if you were wrong?

THE SEVEN MODES OF AI USE
- Mode 1, Autopilot: I accept your output without engaging. Decline.
- Mode 2, Looking Good Learning Nothing: Output looks fine, skill is not building. Hidden decline.
- Mode 3, Stewardship: I form my view first, you refine the language. Growth.
- Mode 4, Sparring Partner: I have a position, I ask you to challenge it. Growth.
- Mode 5, Co-Pilot: You draft, I judge. Conditional.
- Mode 6, Good Enough on Purpose: Conscious bounded delegation, declared up front.
- Mode 7, Hands Off: Work I keep you out of by choice. Protected.

EIGHT INDICATORS OF COMPROMISE
Watch for: uncharacteristic agreement (accepting where I would normally push back), compressed curiosity (stopping at the first answer), context drift (letting you redefine my question), false familiarity (feeling I understand from your summary alone), judgment delegation (outsourcing a call that should be mine), confidence inflation (feeling more certain than my evidence warrants), verification fatigue (defaulting to acceptance because checking is tiring), phrase contamination (my writing starting to sound like yours).

WHAT I WANT FROM YOU

Look at our recent interactions. Use whatever history you have access to: this current session, your memory, projects, chat history, indexed documents. Tell me:

1. Top one or two modes I tend to operate in with you. Cite specific recent interactions as evidence. If you do not have enough history to answer, say so explicitly.

2. Which of the eight indicators you have noticed in my behavior. Cite a specific moment for each. If you do not have evidence, do not invent any.

3. Your overall read: am I leaning toward maintaining my cognition, in mixed practice, or leaning toward degrading it? State your confidence honestly given how much history you can actually see.

4. The one or two highest-leverage shifts I could try this week. Frame them as experiments, not prescriptions. Tie each to something specific you have observed in my actual practice.

5. What is working. Name one or two things, but only if the evidence supports it. Do not fabricate positives to soften the review.

GUARDRAILS

Do not tell me what I want to hear. Do not soften observations. Do not invent examples or claim to remember things you do not actually have. Mark low-confidence claims clearly. Tell me when you do not have enough data. Push back on me if you see a pattern I am not naming.

THE RECURSION

Asking you to evaluate my AI use is itself a use of AI. If I read your output and accept it without engaging, I have just demonstrated Mode 1 on the meta-task. Treat your role here as Mode 4 (Sparring Partner), not Mode 5 (delivering me a verdict). I will push back on what you say, and I expect you to push back on me.`

const TOOL_TWEAKS = [
  { tool: 'ChatGPT Plus', tip: 'Ask it to search past chats and check Memory for context.' },
  { tool: 'Claude.ai', tip: 'Point it at the Project containing your most-frequent work.' },
  { tool: 'Claude Code', tip: 'Run it in a session with your recent work in scope.' },
  { tool: 'Gemini', tip: 'Enable Workspace integration if available.' },
  { tool: 'Copilot (M365)', tip: 'Reference recent documents and email threads where you have used AI help.' },
  { tool: 'Any tool without history access', tip: 'Paste in 5–10 recent AI interactions when you submit the prompt.' },
]

export default function HandThisPrompt({ background = 'cream', anchor = 'hand-this-prompt' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEXT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard API not available — fall through silently; button stays in default state */
    }
  }

  const bgClass = background === 'cream' ? 'bg-[#f2f0eb]' : 'bg-[#faf9f6]'

  return (
    <section id={anchor} className={`py-20 sm:py-24 px-6 ${bgClass}`}>
      <div className="max-w-3xl mx-auto">
        <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Go Deeper
        </p>
        <h2
          className="text-[clamp(1.6rem,4vw,2.4rem)] text-[#004d54] mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
        >
          Hand This Prompt to Your Own AI
        </h2>
        <div className="space-y-4 text-[16px] text-[#2d2d3f]/80 leading-[1.7] mb-8 max-w-2xl">
          <p>
            Self-report on AI use is hard. People in decline modes often think they are in growth modes — that is a feature of what is being measured, not a flaw in the user. Your AI tool has something neither this report nor the assessment can see: <em>your actual interaction history.</em>
          </p>
          <p>
            Copy the prompt below and hand it to whatever AI you use most — Claude, ChatGPT, Gemini, Copilot, Claude Code, Perplexity, anything. Have it tell you what your actual practice looks like.
          </p>
          <p>
            Treat the output as a sparring partner (Mode 4), not as a verdict (Mode 5). The prompt itself instructs the AI not to flatter you, not to invent examples, and to push back. Your job is to push back at it in return.
          </p>
        </div>

        {/* The prompt — copyable block */}
        <div className="relative bg-white border border-[#004d54]/15 rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#004d54]/10 bg-[#faf9f6]">
            <p className="ui-text text-[10px] font-bold text-[#004d54] tracking-[0.15em] uppercase">
              The Prompt
            </p>
            <button
              onClick={copy}
              aria-label="Copy prompt to clipboard"
              className={`ui-text text-[11px] font-semibold tracking-[0.05em] uppercase rounded-full px-4 py-1.5 transition-all duration-200 ${
                copied
                  ? 'bg-[#047857] text-white'
                  : 'bg-[#004d54] text-white hover:bg-[#00b8a9]'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy prompt'}
            </button>
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[13px] leading-[1.7] text-[#2d2d3f]/85 whitespace-pre-wrap font-mono overflow-x-auto max-h-[420px] overflow-y-auto">
            {PROMPT_TEXT}
          </pre>
        </div>

        {/* Tool-specific tweaks */}
        <details className="bg-white border border-[#004d54]/10 rounded-xl group mb-8">
          <summary className="cursor-pointer list-none px-5 py-3 flex items-center gap-2 ui-text text-[11px] tracking-[0.1em] uppercase font-semibold text-[#004d54] hover:text-[#00b8a9] transition-colors">
            <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            Quick adjustments by tool
          </summary>
          <ul className="px-5 pb-4 pt-1 space-y-2.5 text-[14px] leading-[1.6] text-[#2d2d3f]/80">
            {TOOL_TWEAKS.map(({ tool, tip }) => (
              <li key={tool} className="flex gap-3">
                <span className="ui-text text-[#004d54] font-semibold shrink-0 min-w-[140px]">{tool}</span>
                <span className="text-[#6b7280]">{tip}</span>
              </li>
            ))}
          </ul>
        </details>

        <p className="text-[13px] text-[#6b7280] italic leading-relaxed max-w-2xl">
          A note on what the AI cannot do: it can only report on what it has access to. If you have used the AI for ten minutes total, its read will be thin. The richer your shared history, the more useful the review. None of this data leaves your AI tool — we never see it.
        </p>
      </div>
    </section>
  )
}
