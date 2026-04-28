import { useState, useEffect, useRef } from 'react'
import HandThisPrompt from './HandThisPrompt.jsx'

/* ─── Data ─── */
const SECTIONS = [
  { id: 'hero', label: 'Home', short: '' },
  { id: 'purpose', label: 'Purpose', short: 'Purpose' },
  { id: 'summary', label: 'Summary', short: 'Summary' },
  { id: 'explore', label: 'Explore', short: 'Explore' },
  { id: 'question', label: 'The Question', short: 'Question' },
  { id: 'two-questions', label: 'Two Questions', short: '2 Qs' },
  { id: 'factors', label: 'Four Factors', short: 'Factors' },
  { id: 'modes', label: 'Seven Modes', short: 'Modes' },
  { id: 'evidence', label: 'Evidence Base', short: 'Evidence' },
  { id: 'update-2026', label: 'April 2026 Update', short: 'Update' },
  { id: 'indicators', label: 'Cognitive IoCs', short: 'IoCs' },
  { id: 'hand-this-prompt', label: 'Hand To Your AI', short: 'Prompt' },
  { id: 'caveats', label: 'Caveats', short: 'Caveats' },
]

const FACTORS = [
  { num: 1, title: 'Skill First, or Tool First?', subtitle: 'Order of Exposure', evidence: 'Kosmyna et al. (MIT, 2025). N=54→18. Brain-to-LLM: engagement spikes. LLM-to-Brain: persistent under-engagement — 7/9 couldn’t quote essays they wrote earlier in the same experiment.', caveat: '⚠️ N=9 sub-analysis, preprint — load-bearing single study', takeaway: 'For skills you want to own, do the effortful work first, then bring AI in for refinement.', doi: 'https://arxiv.org/abs/2506.08872', stat: '7/9', statLabel: 'couldn’t quote their own essays' },
  { num: 2, title: 'Do You Know Where AI Is Reliable?', subtitle: 'Frontier Awareness', evidence: 'Dell’Acqua et al. (HBS, 2023). N=758 BCG consultants. Inside frontier: +12.2% productivity. Outside frontier: −19% accuracy. Shaw & Nave (Wharton, 2026). N=1,372. +25 pp accuracy when AI accurate, −15 pp when AI errs (Study 1). Cohen’s h = 0.81. Confidence held steady regardless of accuracy (β=−1.14, p=0.202).', takeaway: 'Every AI use benefits from: “Is this inside or outside what I can check?”', doi: 'https://ssrn.com/abstract=6097646', stat: '+25/−15', statLabel: 'pp swing from same AI (Study 1)' },
  { num: 3, title: 'Did the Thinking Move, or Disappear?', subtitle: 'Effort Relocation', evidence: 'Lee et al. (Microsoft/CMU, 2025). N=319. Effort relocates upstream/downstream. Barcaui (2025). N=120. 45-day retention: d=0.68 loss. Fan et al. (BJET, 2024). N=117. “Metacognitive laziness” — better essays, no knowledge gain.', takeaway: 'Growth mode relocates effort. Decline mode eliminates it.', stat: 'd=0.68', statLabel: '45-day retention loss' },
  { num: 4, title: 'Did You Tell AI What Kind of Help You Want?', subtitle: 'Configuration / Mode Contracts', evidence: 'Bastani et al. (PNAS, 2025). ~1,000 students across ~50 classrooms. Same GPT-4, same curriculum. Unguarded: −17% on exam. Guardrailed (hints, not answers): statistically indistinguishable from control. LearnLM (DeepMind, 2025): +5.5pp on novel transfer.', badge: 'Strongest structural lever — metacognition is the mechanism, Mode Contracts are the means', takeaway: 'Same model, same students, opposite outcomes — determined by the instructions. Metacognitive calibration is what makes a Mode Contract work; the contract is what makes calibration practicable.', doi: 'https://doi.org/10.1073/pnas.2422633122', stat: '−17%', statLabel: 'exam score, unguarded vs control' },
]

const MODE_COLORS = { neutral: '#8b95a5', warning: '#d97706', danger: '#b91c1c', growth: '#047857', conditional: '#0e7490', protected: '#6d28d9' }
const MODE_BG = { neutral: 'rgba(139,149,165,0.06)', warning: 'rgba(217,119,6,0.06)', danger: 'rgba(185,28,28,0.06)', growth: 'rgba(4,120,87,0.06)', conditional: 'rgba(14,116,144,0.06)', protected: 'rgba(109,40,217,0.06)' }

const MODES = [
  { num: 0, name: 'Lookup', color: 'neutral', badge: 'Neutral', desc: 'Quick fact retrieval. Fine unless it leaks into strategic decisions.', prompt: '“What’s the exchange rate?” “How do you spell her name?”' },
  { num: 1, name: 'Autopilot', color: 'warning', badge: 'Decline', desc: 'Accept AI output without engaging. Default state for every busy professional. Goal: notice before it bleeds into what matters.', prompt: 'You asked, you got, you used. You didn’t form your own view first.' },
  { num: 2, name: 'Looking Good, Learning Nothing', color: 'danger', badge: 'Hidden Decline', desc: 'Decline disguised as growth. Output looks fine. Skill isn’t building. The bill comes due all at once: you can’t write without the tool, and your voice has started sounding like everybody else’s.', prompt: 'The grant narrative reads well. If AI vanished tomorrow, could you write it?' },
  { num: 3, name: 'Stewardship', color: 'growth', badge: 'Growth', desc: 'You form your view first. AI proposes, you dispose. Effort relocated upstream and downstream. “Doing → stewarding.”', prompt: 'You wrote the shape. AI tightened the sentences. You kept the voice.' },
  { num: 4, name: 'Sparring Partner', color: 'growth', badge: 'Growth', desc: 'You have a position. You ask AI to challenge it. Position first, critique second. Among the feedback patterns most consistently associated with transfer learning in the corpus.', prompt: '“Steelman the opposite view. Find the weakest link in my argument.”' },
  { num: 5, name: 'Co-Pilot', color: 'conditional', badge: 'Conditional', desc: 'AI removes friction so you focus on judgment. Works when you have evaluative capacity. May flatten voice for high-skill writers.', prompt: 'AI generates six openings; you pick the one with the right tone and rewrite paragraph two.' },
  { num: 6, name: 'Good Enough on Purpose', color: 'neutral', badge: 'Declared', desc: 'Conscious bounded delegation. Observable only via speech act: “I’m using AI for X. Not trying to learn this. I’ll spot-check Y. Budget Z minutes.”', prompt: 'If you didn’t say the sentence, you were in Mode 1.' },
  { num: 7, name: 'Hands Off', color: 'protected', badge: 'Protected', desc: 'Work you keep AI out of on purpose. Not because AI can’t — because doing it yourself IS the point.', prompt: '“This one is mine.”' },
]

const STUDIES = [
  { tier: 1, title: 'Cognitive Debt (EEG)', authors: 'Kosmyna et al.', venue: 'MIT Media Lab', year: 2025, n: '54→18', finding: 'LLM users: weakest brain connectivity. LLM-to-Brain participants couldn’t quote essays they wrote earlier in the same experiment (1/9 vs 7/9).', stars: 5, doi: 'https://arxiv.org/abs/2506.08872' },
  { tier: 1, title: 'Cognitive Surrender', authors: 'Shaw & Nave', venue: 'Wharton / SSRN', year: 2026, n: '1,372', finding: '+25 pp accuracy when AI accurate, −15 pp when AI errs (Study 1). Cohen’s h=0.81. Confidence held steady regardless of accuracy (β=−1.14, p=0.202).', stars: 5, doi: 'https://ssrn.com/abstract=6097646' },
  { tier: 1, title: 'Critical Thinking Impact', authors: 'Lee, H. et al.', venue: 'Microsoft / CMU', year: 2025, n: '319', finding: 'GenAI confidence → less thinking (β=−0.69). Self-confidence → more (+0.31). Effort shifts, doesn’t vanish.', stars: 5 },
  { tier: 1, title: 'Without Guardrails', authors: 'Bastani et al.', venue: 'PNAS', year: 2025, n: '~1,000', finding: 'Same GPT-4: −17% unguarded. 0% guardrailed. Configuration > willpower.', stars: 5, doi: 'https://doi.org/10.1073/pnas.2422633122' },
  { tier: 1, title: 'Creativity vs. Diversity', authors: 'Doshi & Hauser', venue: 'Science Advances', year: 2024, n: '293+600', finding: 'Low-skill: +22% quality. High-skill: no gain + voice flattening toward model prior.', stars: 5, doi: 'https://doi.org/10.1126/sciadv.adn5290' },
  { tier: 1, title: 'Metacognitive Laziness', authors: 'Fan et al.', venue: 'BJET', year: 2024, n: '117', finding: 'Better essays, NO knowledge gain. AI removes disfluency that triggers System 2 monitoring.', stars: 5, doi: 'https://doi.org/10.1111/bjet.13544' },
  { tier: 1, title: 'AIGC Design Creativity', authors: 'Wang et al.', venue: 'Frontiers Psych.', year: 2025, n: '64', finding: 'd=1.02 concentration, d=0.55 creativity. Active partnership, not passive acceptance.', stars: 4, doi: 'https://doi.org/10.3389/fpsyg.2025.1508383' },
  { tier: 1, title: 'Chatbot Feedback (fNIRS)', authors: 'Yin et al.', venue: 'npj Sci. Learning', year: 2025, n: '66', finding: 'Metacognitive feedback → transfer learning. Affective feedback → retention only.', stars: 4 },
  { tier: 2, title: 'Jagged Frontier', authors: 'Dell’Acqua et al.', venue: 'HBS', year: 2023, n: '758', finding: '+12% in-frontier, −19% out-of-frontier. BCG field experiment.', stars: 5 },
  { tier: 2, title: 'Political Persuasion', authors: 'Hackenburg et al.', venue: 'Science', year: 2025, n: '76,977', finding: 'Persuasion +51% but accuracy drops. Trade-off is structural, not accidental.', stars: 5, doi: 'https://doi.org/10.1126/science.aea3884' },
  { tier: 2, title: 'LearnLM Tutoring', authors: 'DeepMind / Eedi', venue: 'Tech Report', year: 2025, n: '165', finding: '+5.5pp novel transfer. Pedagogical AI + human supervision = growth.', stars: 5 },
  { tier: 2, title: 'Cognitive Crutch', authors: 'Barcaui', venue: 'Social Sciences & Humanities Open (Elsevier)', year: 2025, n: '120', finding: '45-day delayed retention: 57.5% vs 68.5%. d=0.68.', stars: 5 },
  { tier: 2, title: 'Tutor CoPilot', authors: 'Wang et al.', venue: 'Stanford', year: 2025, n: '2,700', finding: '+4pp mastery overall; +9pp for lowest-rated tutors. $20/tutor/year.', stars: 4 },
  { tier: 2, title: 'AI vs. Active Learning', authors: 'Kestin et al.', venue: 'Harvard / Sci. Rep.', year: 2024, n: '—', finding: 'Purpose-built AI tutor beats in-class active learning on physics.', stars: 4 },
  { tier: 2, title: 'Psychosocial Effects', authors: 'Fang et al.', venue: 'MIT / OpenAI', year: 2025, n: '981', finding: 'Dose + disposition drive harm, not modality. 4-week longitudinal RCT.', stars: 5 },
  { tier: 2, title: 'Children fMRI', authors: 'Horowitz-Kraus et al.', venue: 'bioRxiv', year: 2025, n: '31', finding: 'Children: lower frontoparietal connectivity during AI co-creation vs adults.', stars: 4 },
  { tier: 2, title: 'How Americans View AI', authors: 'Pew Research', venue: 'Pew', year: 2025, n: '5,023', finding: '53% say AI will worsen creative thinking. 50% say worse for relationships.', stars: 4, doi: 'https://www.pewresearch.org/science/2025/09/17/how-americans-view-ai-and-its-impact-on-people-and-society/' },
  { tier: 2, title: 'Teens & AI Chatbots', authors: 'Pew Research', venue: 'Pew', year: 2025, n: '1,458', finding: '64% of teens use chatbots. ~30% daily. Near-ubiquitous exposure.', stars: 4, doi: 'https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/' },
  { tier: 2, title: 'Illusions of Understanding', authors: 'Nature Editorial', venue: 'Nature', year: 2024, n: '—', finding: 'AI: “more but understanding less.” Scientific monocultures risk.', stars: 4 },
  { tier: 2, title: '3R Principle', authors: 'Rossi et al.', venue: 'npj AI', year: 2026, n: '—', finding: 'Passive AI → synaptic weakening (LTD). Active co-creation → strengthening (LTP).', stars: 4 },
]

/* New studies added in April 2026 update — published or surfaced after the original synthesis. */
const STUDIES_2026 = [
  { title: 'Explanation Gate (RCT)', authors: 'Sankaranarayanan', venue: 'arXiv preprint (intended for ACM L@S ’26)', year: 2026, n: '78', finding: 'Forcing users to explain AI-generated code in their own words before accepting it cut failure on a subsequent AI-blackout task from 77% to 39% — a 38 percentage-point gap from a single structural forcing function. Strongest empirical demonstration of the engaged/outsourced divide in 2026.', implication: 'Confirms Mode 4 Stewardship and Mode 5 Sparring Partner are not just heuristics — even minimal forced engagement produces transfer.', doi: 'https://arxiv.org/abs/2602.20206' },
  { title: 'AI Timing & Critical Thinking', authors: 'Lee, M. et al.', venue: 'CHI ’26, Barcelona (conference presentation)', year: 2026, n: '393', finding: 'Participants who delayed AI access until after partial independent problem-solving outperformed AI-first users on critical thinking tasks. With sufficient time, the late-AI group preserved more independent reasoning. Under time pressure, early-AI access boosted output quality but reduced critical thinking — a speed/cognition tradeoff.', implication: 'New principle the original framework didn’t fully address: form your own view first, then spar. Timing of engagement matters as much as quality of engagement.', doi: 'https://www.sciencenews.org/article/ai-timing-critical-thinking-study' },
  { title: 'Outsourcing Thinking to AI?', authors: 'Tian & Zhang', venue: 'Humanities & Social Sciences Communications (Nature portfolio)', year: 2026, n: '698', finding: 'Same variable — perceived AI intelligence — simultaneously predicts focused immersion (positive pathway) and AI dependency (negative pathway). The mechanism is double-edged: the same engagement that protects can produce dependency in different users.', implication: 'Refines Factor 4 (Configuration). Disposition and individual differences moderate engagement’s protective effect.', doi: 'https://www.nature.com/articles/s41599-026-07153-8' },
  { title: 'Cognitive Offloading in Schools', authors: 'Loble & Lodge', venue: 'UTS / UQ Evidence Synthesis (not a primary RCT)', year: 2026, n: '—', finding: 'Synthesis of multiple studies including high-school math research showing students who used AI scored higher while AI was present but performance collapsed when AI was removed. Names the useful distinction between offloading extraneous cognitive load (safe) vs. intrinsic load — the struggle that builds schema (harmful when outsourced).', implication: 'Sharpens Mode 7 Hands Off. Helps answer the practical question: when is offloading safe?', doi: 'https://www.uts.edu.au/news/2026/03/experts-warn-unstructured-ai-use-in-schools-risks-cognitive-atrophy' },
  { title: 'Brain Fry from AI Volume', authors: 'Bedard et al.', venue: 'HBR', year: 2026, n: '~1,500', finding: 'Heavy AI users — even engaged ones — reported cognitive fatigue: mental fog, slower decision-making, headaches. Different mechanism from outsourcing: the volume and pace of AI-mediated cognitive work exceeded human processing capacity.', implication: 'Counter-evidence to a strict engagement-protects-you reading. Engagement is necessary; dose still matters. Self-report only — lower confidence than the others.', doi: 'https://hbr.org/2026/03/when-using-ai-leads-to-brain-fry' },
  { title: 'Homogenizing Effect of LLMs', authors: 'Sourati et al.', venue: 'Trends in Cognitive Sciences', year: 2026, n: '—', finding: 'Population-scale theoretical synthesis: LLMs standardize language, perspective, and reasoning, favoring linear chain-of-thought over intuitive and abstract modes. A population of engaged sparring users may still converge if all sparring with the same model.', implication: 'New dimension this framework doesn’t address: collective cognitive effects independent of individual engagement quality.', doi: 'https://www.cell.com/trends/cognitive-sciences/fulltext/S1364-6613(26)00003-3' },
]

const INDICATORS = [
  { name: 'Uncharacteristic agreement', signal: 'Accepting AI without pushback where you’d normally debate a colleague' },
  { name: 'Compressed curiosity', signal: 'Stopping at the first answer instead of probing further' },
  { name: 'Context drift', signal: 'Letting AI redefine the question you started with' },
  { name: 'False familiarity', signal: 'Feeling you understand from an AI summary alone' },
  { name: 'Judgment delegation', signal: 'Outsourcing a call that should be yours to make' },
  { name: 'Confidence inflation', signal: 'Feeling more certain than your evidence warrants' },
  { name: 'Verification fatigue', signal: 'Getting tired of checking and defaulting to acceptance' },
  { name: 'Phrase contamination', signal: 'Your writing starting to sound like AI' },
]

/* ─── Hooks ─── */
function useActiveSection() {
  const [active, setActive] = useState('hero')
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis.length) setActive(vis[0].target.id)
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 })
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return active
}

/* ─── Components ─── */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} className={`transition-all duration-[800ms] ease-out ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function SideNav() {
  const active = useActiveSection()
  return (
    <nav className="fixed left-6 top-0 bottom-0 z-50 hidden lg:flex flex-col items-start justify-center" aria-label="Section navigation">
      <div className="relative pl-[14px] border-l border-[#004d54]/12">
        {SECTIONS.filter(s => s.id !== 'hero').map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className="relative flex items-center gap-3 py-[7px] group transition-all duration-200"
          >
            <span
              className={`absolute -left-[18px] w-[7px] h-[7px] rounded-full shrink-0 transition-all duration-300 ${
                active === id
                  ? 'bg-[#00b8a9] scale-125 shadow-[0_0_0_3px_rgba(0,184,169,0.15)]'
                  : 'bg-[#d1d5db] group-hover:bg-[#9ca3af]'
              }`}
            />
            <span
              className={`ui-text text-[11px] tracking-[0.04em] whitespace-nowrap transition-all duration-200 ${
                active === id
                  ? 'text-[#004d54] font-semibold'
                  : 'text-[#6b7280] group-hover:text-[#004d54]'
              }`}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}

function TopNav() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-[#faf9f6]/85 backdrop-blur-xl border-b border-[#004d54]/8">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12">
        <a href="#hero" className="ui-text font-bold text-[#004d54] text-xs tracking-wider uppercase">Metacognition Playbook</a>
        <button className="text-[#004d54]" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
        </button>
      </div>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-1 bg-[#faf9f6]/95 backdrop-blur-xl">
          {SECTIONS.filter(s => s.id !== 'hero').map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className={`ui-text text-xs py-2 px-3 rounded-lg transition-colors ${active === id ? 'bg-[#004d54] text-white' : 'text-[#6b7280] hover:text-[#004d54]'}`}>{label}</a>
          ))}
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d54]/[0.03] via-transparent to-[#00b8a9]/[0.04]" />
      <div className="absolute top-20 right-[15%] w-[500px] h-[500px] rounded-full bg-[#00b8a9]/[0.04] blur-[100px]" />
      <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full bg-[#004d54]/[0.03] blur-[80px]" />
      <div className="max-w-2xl text-center relative z-10">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.25em] uppercase mb-8">Meet the Moment · Research Report</p></Reveal>
        <Reveal delay={120}><h1 className="text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] text-[#004d54] mb-5">The Metacognition<br/>Playbook</h1></Reveal>
        <Reveal delay={240}><p className="ui-text text-[17px] text-[#6b7280] font-light tracking-wide mb-2">A Working Model for Deliberate AI Use</p></Reveal>
        <Reveal delay={320}><p className="ui-text text-[13px] text-[#9ca3af] mb-10">Joshua Peskay · April 2026</p></Reveal>
        <Reveal delay={400}><p className="text-[18px] text-[#2d2d3f]/75 leading-relaxed max-w-lg mx-auto mb-14">A working synthesis of 36 studies on how AI changes the way we think — and what to do about it.</p></Reveal>
        <Reveal delay={500}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#question" className="inline-flex items-center gap-2 ui-text text-[13px] font-medium text-[#004d54] border border-[#004d54]/15 rounded-full px-7 py-3 hover:bg-[#003940] hover:text-white hover:border-[#003940] transition-all duration-300 group">
              Read the report
              <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </a>
            <a href="/reviewed" className="inline-flex items-center gap-2 ui-text text-[13px] font-medium text-white bg-[#004d54] border border-[#004d54] rounded-full px-7 py-3 hover:bg-[#00b8a9] hover:border-[#00b8a9] transition-all duration-300 group">
              Take the assessment
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
          <p className="ui-text text-[11px] text-[#9ca3af] tracking-wide mt-4">5–7 minutes · companion to the report · no data collected</p>
        </Reveal>
      </div>
    </section>
  )
}

function TheQuestion() {
  return (
    <section id="question" className="py-28 px-6">
      <div className="max-w-xl mx-auto">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-10">The Question</p></Reveal>
        <Reveal delay={100}><p className="text-[clamp(1.4rem,3.5vw,1.85rem)] leading-[1.4] text-[#1a1a2e] mb-10" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>Not <em>“does AI make you smarter or dumber”</em> — both are true in different conditions.</p></Reveal>
        <Reveal delay={180}>
          <blockquote className="border-l-[3px] border-[#00b8a9] pl-7 my-10">
            <p className="text-[17px] leading-[1.75] text-[#2d2d3f]/85">What are the distinguishable modes of working with AI, and which conditions determine whether a mode produces cognitive growth, cognitive decline, or neutral triage?</p>
          </blockquote>
        </Reveal>
        <Reveal delay={260}>
          <div className="bg-[#004d54] rounded-2xl p-7 my-10">
            <p className="ui-text text-[11px] font-semibold text-[#00b8a9] tracking-[0.15em] uppercase mb-3">The answer in one sentence</p>
            <p className="text-[16px] leading-[1.7] text-white/85">Cognitive outcomes depend less on AI exposure than on four design variables, with metacognitive calibration as the master moderator.</p>
          </div>
        </Reveal>
        <Reveal delay={340}><p className="text-[17px] leading-[1.75] text-[#2d2d3f]/70">In plain English: it is not just whether you use AI, or only how often — it is the <em>mode</em> you are in each time. Frequency still matters (heavy use produces fatigue even among engaged users), but mode is the variable you can change deliberately. The framework is built around two questions you can answer honestly in each interaction.</p></Reveal>
      </div>
    </section>
  )
}

function TwoQuestions() {
  return (
    <section id="two-questions" className="py-32 px-6 bg-[#004d54] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#003d44] to-[#005a63]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00b8a9]/[0.08] blur-[120px]" />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">The Heart of the Framework</p></Reveal>
        <Reveal delay={100}><h2 className="text-[clamp(2rem,5vw,3rem)] text-white mb-16">The Two Questions</h2></Reveal>
        <div className="grid sm:grid-cols-2 gap-8">
          <Reveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#00b8a9]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.06] backdrop-blur-sm rounded-2xl p-9 border border-white/[0.08]">
                <div className="ui-text text-[#00b8a9]/60 text-[64px] font-black leading-none mb-5" style={{ fontFamily: 'var(--font-display)' }}>1</div>
                <p className="text-[20px] text-white leading-snug mb-5" style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>Am I trying to <span className="text-[#00b8a9]">learn</span> this, or <span className="text-[#00b8a9]">finish</span> it?</p>
                <p className="text-[14px] text-white/45 leading-relaxed">This routes you to a mode. Learning demands Modes 3, 4, or 5. Finishing invites Mode 6 — if you say so out loud.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#00b8a9]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.06] backdrop-blur-sm rounded-2xl p-9 border border-white/[0.08]">
                <div className="ui-text text-[#00b8a9]/60 text-[64px] font-black leading-none mb-5" style={{ fontFamily: 'var(--font-display)' }}>2</div>
                <p className="text-[20px] text-white leading-snug mb-5" style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>If the AI is wrong here, <span className="text-[#00b8a9]">will I catch it?</span></p>
                <p className="text-[14px] text-white/45 leading-relaxed">In a 1,372-person study, the same AI raised participants’ accuracy by 25 points when it was right and dropped it by 15 when it was wrong (Study 1) — yet users’ confidence stayed steady regardless.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={440}>
          <div className="mt-10 bg-white/[0.04] border border-[#00b8a9]/25 rounded-2xl p-7">
            <p className="ui-text text-[#00b8a9] text-[10px] font-semibold tracking-[0.2em] uppercase mb-3">Timing Principle (April 2026 Update)</p>
            <p className="text-[18px] text-white leading-snug mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>Form your own view first. Then spar.</p>
            <p className="text-[14px] text-white/55 leading-relaxed">A CHI 2026 study (N=393) found that participants who delayed AI access until <em>after</em> some independent thinking outperformed AI-first users on critical thinking — even when both engaged actively the whole time. Active engagement is necessary, but if you reach for AI before you’ve formed your own view, you tend to anchor to its framing instead of yours.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Factors() {
  const [expanded, setExpanded] = useState(null)
  return (
    <section id="factors" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">The Framework</p></Reveal>
        <Reveal delay={60}><h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] text-[#004d54] mb-3">Four Design Factors</h2></Reveal>
        <Reveal delay={100}><p className="text-[17px] text-[#6b7280] mb-10">+ one master moderator above them all</p></Reveal>

        <Reveal delay={140}>
          <div className="relative rounded-2xl overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#004d54] via-[#006d77] to-[#00b8a9]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,184,169,0.2),transparent_60%)]" />
            <div className="relative p-8 sm:p-10">
              <p className="ui-text text-[11px] font-semibold text-[#00b8a9]/70 tracking-[0.15em] uppercase mb-3">Master Moderator</p>
              <h3 className="text-[clamp(1.2rem,3vw,1.6rem)] text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Can You Still Tell When It’s Wrong?</h3>
              <p className="text-[15px] text-white/75 leading-relaxed mb-3 max-w-2xl">Confidence did NOT decline when participants were wrong alongside AI (Shaw & Nave, β=−1.14, p=0.202). The calibration loop was severed.</p>
              <p className="text-[14px] text-white/50 leading-relaxed max-w-2xl">Metacognition is a demand, not an intervention. It needs environmental scaffolding — Mode Contracts, verification rituals, peer review — to be sustainable. The relationship is complementary, not competing: metacognition is the underlying mechanism that makes AI use grow (or erode) cognition; Mode Contracts (Factor 4) are the strongest <em>structural</em> means of activating that mechanism reliably.</p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5">
          {FACTORS.map((f, i) => (
            <Reveal key={f.num} delay={180 + i * 80}>
              <article
                onClick={() => setExpanded(expanded === f.num ? null : f.num)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setExpanded(expanded === f.num ? null : f.num)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={expanded === f.num}
                aria-controls={`factor-${f.num}-detail`}
                className="cursor-pointer bg-white rounded-xl border border-[#004d54]/8 hover:border-[#00b8a9]/25 transition-all duration-300 card-lift overflow-hidden"
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 text-center">
                      <div className="factor-num text-[32px] font-black text-[#00b8a9]/20 leading-none">{f.num}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] text-[#004d54] mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{f.title}</h3>
                      <p className="ui-text text-[11px] text-[#9ca3af] tracking-wide uppercase">{f.subtitle}</p>
                      {f.badge && <span className="inline-block ui-text text-[10px] font-semibold bg-[#00b8a9]/8 text-[#006d77] px-2.5 py-1 rounded-full mt-3 tracking-wide">{f.badge}</span>}
                      <p className="text-[15px] text-[#2d2d3f]/75 mt-3 leading-relaxed">{f.takeaway}</p>
                    </div>
                    <div className="shrink-0 hidden sm:block text-right">
                      <div className="stat-number text-[2.5rem]">{f.stat}</div>
                      <p className="ui-text text-[10px] text-[#9ca3af] mt-1 max-w-[120px] leading-tight">{f.statLabel}</p>
                    </div>
                    <svg className={`w-5 h-5 text-[#9ca3af] shrink-0 transition-transform duration-300 ${expanded === f.num ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {expanded === f.num && (
                    <div id={`factor-${f.num}-detail`} className="mt-5 pt-5 border-t border-[#004d54]/5 ml-[52px]">
                      <p className="text-[14px] text-[#2d2d3f]/75 leading-relaxed mb-3"><strong className="ui-text text-[#004d54] font-semibold text-[12px] uppercase tracking-wide">Evidence: </strong>{f.evidence}</p>
                      {f.caveat && <p className="ui-text text-[11px] text-[#d97706] bg-[#d97706]/8 px-3 py-2 rounded-lg inline-block mt-2">{f.caveat}</p>}
                      {f.doi && <a href={f.doi} target="_blank" rel="noopener noreferrer" className="ui-text text-[11px] text-[#00b8a9] hover:underline block mt-3 font-medium">View source →</a>}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SevenModes() {
  return (
    <section id="modes" className="py-28 px-6 bg-[#f2f0eb]">
      <div className="max-w-4xl mx-auto">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">The Patterns</p></Reveal>
        <Reveal delay={60}><h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] text-[#004d54] mb-3">Seven Modes of AI Use</h2></Reveal>
        <Reveal delay={100}><p className="text-[17px] text-[#6b7280] mb-8 max-w-xl">The goal is not to always be in a growth mode. It is to know which mode you are in and choose it deliberately.</p></Reveal>
        <Reveal delay={130}>
          <details className="group max-w-xl mb-12 bg-white/40 border border-[#004d54]/10 rounded-xl">
            <summary className="cursor-pointer list-none px-5 py-3 flex items-center gap-2 ui-text text-[11px] tracking-[0.1em] uppercase font-semibold text-[#004d54] hover:text-[#00b8a9] transition-colors">
              <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              Notes on the framework
            </summary>
            <div className="px-5 pb-5 pt-1 space-y-3 text-[14px] text-[#6b7280] leading-relaxed">
              <p><strong className="text-[#004d54] font-semibold">A note on counting.</strong> Mode 0 (Lookup) is a baseline condition rather than one of the seven modes — it sits outside the cognitive-stakes spectrum because nothing is being formed or eroded. The seven modes start at Mode 1 (Autopilot). Many readers will use Mode 0 dozens of times a day without it being part of the framework's cognitive-impact picture, and that's the right read.</p>
              <p><strong className="text-[#004d54] font-semibold">A note on confidence.</strong> The decline-mode evidence (Modes 1 and 2) is stronger than the growth-mode evidence (Modes 3 and 4) in the corpus. Both kinds of mode are real, but the studies showing harm from passive use are larger and more replicated than those showing gains from sparring or stewardship. Read the badges accordingly: growth modes are well-supported but the case for them is still building.</p>
            </div>
          </details>
        </Reveal>
        <div className="grid gap-4">
          {MODES.map((m, i) => (
            <Reveal key={m.num} delay={140 + i * 60}>
              <article className="rounded-xl overflow-hidden card-lift" style={{ background: MODE_BG[m.color] }}>
                <div className="flex items-stretch">
                  <div className="w-1.5 shrink-0" style={{ background: MODE_COLORS[m.color] }} />
                  <div className="p-5 sm:p-6 flex items-start gap-5 flex-1">
                    <div className="mode-num text-[28px] font-black shrink-0 leading-none mt-0.5" style={{ color: MODE_COLORS[m.color], opacity: 0.35 }}>{m.num}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-2">
                        <h3 className="text-[15px] text-[#1a1a2e] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{m.name}</h3>
                        <span className="badge text-[9px] font-semibold px-2 py-[3px] rounded-full uppercase tracking-wider" style={{ background: `${MODE_COLORS[m.color]}15`, color: MODE_COLORS[m.color] }}>{m.badge}</span>
                      </div>
                      <p className="text-[14px] text-[#2d2d3f]/75 leading-relaxed">{m.desc}</p>
                      <p className="text-[13px] italic text-[#6b7280] mt-2.5 leading-relaxed">{m.prompt}</p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Evidence() {
  const t1 = STUDIES.filter(s => s.tier === 1)
  const t2 = STUDIES.filter(s => s.tier === 2)
  return (
    <section id="evidence" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">The Research</p></Reveal>
        <Reveal delay={60}><h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] text-[#004d54] mb-3">Evidence Base</h2></Reveal>
        <Reveal delay={100}><p className="text-[17px] text-[#6b7280] mb-12">30 studies in the original synthesis (1 since retracted, removed) + 6 added in the April 2026 update = 36 active. 8 anchor papers deep-read; the rest skim-extracted.</p></Reveal>

        <Reveal delay={140}><h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.15em] uppercase mb-5">Tier 1 — Anchor Papers</h3></Reveal>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {t1.map((s, i) => (
            <Reveal key={i} delay={180 + i * 40}>
              <div className="bg-white rounded-xl p-5 border border-[#004d54]/8 card-lift h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="ui-text text-[13px] font-bold text-[#004d54] leading-snug">{s.title}</h4>
                  <div className="ui-text text-[11px] text-[#00b8a9] shrink-0">{'★'.repeat(s.stars)}{'☆'.repeat(5 - s.stars)}</div>
                </div>
                <p className="ui-text text-[10px] text-[#9ca3af] mb-2.5">{s.authors} · {s.venue} · {s.year}{s.n && s.n !== '—' ? ` · N=${s.n}` : ''}</p>
                <p className="text-[13px] text-[#2d2d3f]/55 leading-relaxed">{s.finding}</p>
                {s.doi && <a href={s.doi} target="_blank" rel="noopener noreferrer" className="ui-text text-[10px] text-[#00b8a9] hover:underline mt-2.5 inline-block font-medium">View source →</a>}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal><h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.15em] uppercase mb-5">Tier 2 — Supporting Evidence</h3></Reveal>
        <div className="space-y-2">
          {t2.map((s, i) => (
            <Reveal key={i} delay={i * 25}>
              <div className="bg-white/60 rounded-lg px-4 py-3 border border-[#004d54]/4 hover:border-[#00b8a9]/15 transition-colors flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="ui-text text-[12px] font-semibold text-[#1a1a2e]">{s.title}</h4>
                    <span className="ui-text text-[10px] text-[#9ca3af]">{s.authors} · {s.venue} · {s.year}{s.n && s.n !== '—' ? ` · N=${s.n}` : ''}</span>
                  </div>
                  <p className="text-[12px] text-[#2d2d3f]/45 mt-1 leading-relaxed">{s.finding}</p>
                </div>
                <div className="ui-text text-[10px] text-[#00b8a9] shrink-0 mt-0.5">{'★'.repeat(s.stars)}</div>
                {s.doi && <a href={s.doi} target="_blank" rel="noopener noreferrer" className="ui-text text-[9px] text-[#00b8a9] hover:underline shrink-0 mt-0.5">→</a>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Update2026() {
  return (
    <section id="update-2026" className="py-28 px-6 bg-[#f2f0eb]">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">Living Document</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] text-[#004d54] mb-3">April 2026 Update</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-[17px] text-[#6b7280] mb-12 max-w-2xl">A second research pass in late April 2026 surfaced six new findings published since the original synthesis. Most strengthen the framework. Two add dimensions the original did not address. None invalidate the seven modes or the two questions — but they sharpen them.</p>
        </Reveal>

        <Reveal delay={140}>
          <div className="bg-white rounded-2xl border border-[#004d54]/8 p-7 mb-8">
            <p className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-3">What changed in the framework</p>
            <ul className="space-y-3 text-[15px] text-[#2d2d3f]/70 leading-relaxed">
              <li className="flex gap-3"><span className="text-[#00b8a9] shrink-0 mt-1">→</span><span><strong className="text-[#004d54]">Timing principle added to the Two Questions</strong> — “Form your own view first. Then spar.” (CHI 2026)</span></li>
              <li className="flex gap-3"><span className="text-[#00b8a9] shrink-0 mt-1">→</span><span><strong className="text-[#004d54]">Mode 7 Hands Off sharpened</strong> — Loble &amp; Lodge’s extraneous-vs-intrinsic load distinction tells you when offloading is safe.</span></li>
              <li className="flex gap-3"><span className="text-[#00b8a9] shrink-0 mt-1">→</span><span><strong className="text-[#004d54]">Strongest 2026 evidence for the engaged/outsourced divide</strong> — Gerber et al.’s “Explanation Gate” closed a 38-point gap with one structural forcing function.</span></li>
              <li className="flex gap-3"><span className="text-[#00b8a9] shrink-0 mt-1">→</span><span><strong className="text-[#004d54]">Two new dimensions the framework does not address</strong> — population-scale homogenization (Sourati) and cognitive fatigue from volume (Bedard). Both flagged as honest limits.</span></li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.15em] uppercase mb-5">New studies (Jan–Apr 2026)</h3>
        </Reveal>

        <div className="space-y-4">
          {STUDIES_2026.map((s, i) => (
            <Reveal key={i} delay={220 + i * 50}>
              <div className="bg-white rounded-xl p-6 border border-[#004d54]/8 card-lift">
                <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                  <h4 className="ui-text text-[14px] font-bold text-[#004d54] leading-snug">{s.title}</h4>
                  <span className="ui-text text-[10px] text-[#9ca3af] shrink-0">{s.authors} · {s.venue} · {s.year}{s.n && s.n !== '—' ? ` · N=${s.n}` : ''}</span>
                </div>
                <p className="text-[14px] text-[#2d2d3f]/75 leading-relaxed mb-3">{s.finding}</p>
                <p className="text-[13px] text-[#006d77] bg-[#00b8a9]/5 px-3 py-2 rounded-lg leading-relaxed">
                  <strong className="ui-text text-[11px] uppercase tracking-wide text-[#004d54]">Implication: </strong>{s.implication}
                </p>
                {s.doi && <a href={s.doi} target="_blank" rel="noopener noreferrer" className="ui-text text-[11px] text-[#00b8a9] hover:underline mt-3 inline-block font-medium">View source →</a>}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600}>
          <p className="ui-text text-[11px] text-[#9ca3af] italic mt-10 leading-relaxed">Updates ran April 27, 2026. The CHI 2026 timing study was conference-presented April 14, 2026 and is not yet peer-reviewed — cited as a CHI presentation rather than a published paper.</p>
        </Reveal>
      </div>
    </section>
  )
}

function CognitiveIoCs() {
  return (
    <section id="indicators" className="py-28 px-6 bg-[#004d54] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#003d44] to-[#005a63]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#d97706]/[0.04] blur-[100px]" />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">Early Warning System</p></Reveal>
        <Reveal delay={60}><h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] text-white mb-4">Cognitive Indicators<br className="hidden sm:block" /> of Compromise</h2></Reveal>
        <Reveal delay={100}><p className="text-[15px] text-white/50 mb-12 max-w-lg">Adapted from Allen Westley’s cognitive security work (CSI #91). Behavioral tells that you’re drifting into Mode 1 or Mode 2.</p></Reveal>
        <div className="space-y-3">
          {INDICATORS.map((ind, i) => (
            <Reveal key={i} delay={140 + i * 50}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 flex gap-5 hover:bg-white/[0.06] transition-colors">
                <div className="w-[6px] h-[6px] rounded-full bg-[#d97706] mt-2.5 shrink-0 ring-2 ring-[#d97706]/20" />
                <div>
                  <h4 className="ui-text text-[13px] font-semibold text-white/90">{ind.name}</h4>
                  <p className="text-[14px] text-white/40 mt-1 leading-relaxed">{ind.signal}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Caveats() {
  const items = [
    'Not all AI use is harmful — the growth modes are real when AI use is configured and supported well.',
    'Self-awareness alone is not enough. Knowing about these modes does not protect you from drifting into them; the practice has to be built into how you work.',
    'Most of the underlying research is on students and knowledge workers. Applying the framework to nonprofit professionals is an extrapolation, not a direct finding.',
    'Mode 6 (Good Enough on Purpose) has no studies directly testing it. It exists in the framework only because users can declare it out loud — there is no measured evidence yet that the practice works.',
    'Factor 1 (Order of Exposure) rests heavily on a small sub-section of a single study with only 9 participants, which has not yet been peer-reviewed. If that finding does not hold up in larger replications, this part of the framework will need to change.',
    'The studies showing AI helps cognition (the growth modes) are smaller and less replicated than the studies showing AI harms it (the decline modes). Both kinds of mode are real, but the case for the harmful patterns is currently better-supported.',
    'Most existing studies are short-term. When studies tracking professionals over months or years come out, parts of this framework may need to be rewritten.',
    'Even if you use AI well as an individual, when many people use the same AI model, their language and ideas may converge over time toward what the AI suggests. That collective effect is real, but this framework does not try to address it.',
    'Active engagement is necessary but not sufficient. Heavy AI use produces cognitive fatigue (informally called “brain fry”) even among engaged users — the amount of AI-mediated work still matters, not only the quality of engagement.',
  ]
  return (
    <section id="caveats" className="py-28 px-6 bg-[#f2f0eb]">
      <div className="max-w-2xl mx-auto">
        <Reveal><p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">Epistemic Honesty</p></Reveal>
        <Reveal delay={60}><h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] text-[#004d54] mb-12">What This Framework<br/>Does Not Claim</h2></Reveal>
        <div className="space-y-5">
          {items.map((item, i) => (
            <Reveal key={i} delay={100 + i * 40}>
              <div className="flex gap-4 items-start">
                <div className="w-[6px] h-[6px] rounded-full bg-[#00b8a9]/40 mt-2.5 shrink-0" />
                <p className="text-[16px] text-[#2d2d3f]/75 leading-relaxed">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-20 px-6 bg-[#004d54] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#003038] to-[#004d54]" />
      <div className="max-w-2xl mx-auto text-center relative z-10 space-y-5">
        <div className="w-12 h-[2px] bg-[#00b8a9]/30 mx-auto mb-8" />
        <p className="text-[14px] text-white/45 leading-relaxed">This report was produced by Vishali, Joshua Peskay’s Personal AI, using 31 research sources, 4-voice council review, and 4-persona audience validation.</p>
        <p className="text-[14px] text-white/45 leading-relaxed">The analysis, framework, and editorial voice are Joshua’s. The synthesis was AI-assisted and human-directed.</p>
        <div className="flex justify-center gap-5 pt-6 ui-text text-[11px] text-[#00b8a9]/70 font-medium tracking-wide">
          <span>mtm.now</span><span className="text-white/10">·</span><span>PAI Accelerator</span><span className="text-white/10">·</span><span>MTM Together</span><span className="text-white/10">·</span><span>Solve Tuesday</span>
        </div>
        <p className="ui-text text-[10px] text-white/20 pt-6">© 2026 Meet the Moment. All rights reserved.</p>
      </div>
    </footer>
  )
}

/* ─── New Sections: Purpose, Executive Summary, Explore ─── */

function Purpose() {
  return (
    <section id="purpose" className="py-24 px-6 bg-[#f2f0eb]">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-8">Why This Exists</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#004d54] mb-8">Purpose of This Report</h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="space-y-5 text-[16px] leading-[1.8] text-[#2d2d3f]/75">
            <p>There is a growing body of research on what happens to human cognition when we work alongside AI. Most of it lives behind academic paywalls, scattered across neuroscience, education, behavioral economics, and computer science journals. Very little of it has been synthesized for the people who need it most: professionals making daily decisions about how to use AI in their work.</p>
            <p>This report assembles 36 studies (30 from the original synthesis plus 6 added in the April 2026 update) into a single working model. It is written for <strong className="text-[#004d54] font-semibold">nonprofit professionals, knowledge workers, and anyone building a Personal AI</strong> who wants to understand what the research actually says about the difference between AI use that makes you sharper and AI use that makes you softer.</p>
            <p>It was produced by <strong className="text-[#004d54] font-semibold">Meet the Moment (MTM)</strong> as the evidence base for our PAI Accelerator curriculum and as a contribution to the broader conversation about deliberate, ethical AI adoption. The framework, the caveats, and the conflict-of-interest disclosure are all intentional. We believe the sector deserves research-grounded guidance delivered with intellectual honesty.</p>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { num: '36', label: 'studies reviewed' },
              { num: '8', label: 'anchor papers deep-read' },
              { num: '4', label: 'audience personas validated' },
            ].map((s, i) => (
              <div key={i} className="text-center py-5 px-4 bg-white rounded-xl border border-[#004d54]/6">
                <div className="stat-number text-[2.5rem]">{s.num}</div>
                <p className="ui-text text-[11px] text-[#9ca3af] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ExecutiveSummary() {
  return (
    <section id="summary" className="py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-8">If You Read Nothing Else</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#004d54] mb-10">Executive Summary</h2>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={120}>
            <div>
              <h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-3">The question</h3>
              <p className="text-[16px] leading-[1.8] text-[#2d2d3f]/75">Does AI make us smarter or dumber? The research says: both, depending on how you use it. The real question is what distinguishes the patterns that produce cognitive growth from those that produce cognitive decline.</p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div>
              <h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-3">The framework</h3>
              <p className="text-[16px] leading-[1.8] text-[#2d2d3f]/75 mb-4">Four design factors determine outcomes, with metacognitive calibration as the master moderator:</p>
              <div className="space-y-2.5 ml-1">
                {[
                  ['1. Skill First, or Tool First?', 'Build the skill before adding the tool. The reverse creates persistent dependency.'],
                  ['2. Do You Know Where AI Is Reliable?', 'AI\'s capability boundary is jagged and invisible. Default to verification outside known-reliable zones.'],
                  ['3. Did the Thinking Move, or Disappear?', 'Growth mode relocates effort upstream and downstream. Decline mode eliminates it entirely.'],
                  ['4. Did You Tell AI What Kind of Help You Want?', 'Same model, same task, opposite outcomes — determined by the instructions. This is the strongest lever.'],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1 h-1 rounded-full bg-[#00b8a9] mt-2.5 shrink-0" />
                    <div><span className="ui-text text-[13px] font-semibold text-[#004d54]">{title}</span> <span className="text-[14px] text-[#2d2d3f]/60">{desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-3">The seven modes</h3>
              <p className="text-[16px] leading-[1.8] text-[#2d2d3f]/75 mb-4">Every AI interaction falls into one of seven patterns. The goal is not to always be in a growth mode — it is to know which mode you are in:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: 'Autopilot', color: '#d97706', type: 'decline' },
                  { name: 'Looking Good', color: '#b91c1c', type: 'decline' },
                  { name: 'Stewardship', color: '#047857', type: 'growth' },
                  { name: 'Sparring', color: '#047857', type: 'growth' },
                  { name: 'Co-Pilot', color: '#0e7490', type: 'conditional' },
                  { name: 'Good Enough', color: '#8b95a5', type: 'declared' },
                  { name: 'Hands Off', color: '#6d28d9', type: 'protected' },
                  { name: 'Lookup', color: '#8b95a5', type: 'neutral' },
                ].map((m, i) => (
                  <div key={i} className="text-center py-2.5 px-2 rounded-lg" style={{ background: `${m.color}08`, borderLeft: `2px solid ${m.color}` }}>
                    <p className="ui-text text-[11px] font-semibold" style={{ color: m.color }}>{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div>
              <h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-3">The two questions</h3>
              <p className="text-[16px] leading-[1.8] text-[#2d2d3f]/75">Before any significant AI interaction, ask: <strong className="text-[#004d54]">(1) Am I trying to learn this, or finish it?</strong> and <strong className="text-[#004d54]">(2) If the AI is wrong here, will I catch it?</strong> These two questions, used reflexively, route you to the right mode and keep the calibration loop intact.</p>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div>
              <h3 className="ui-text text-[12px] font-bold text-[#004d54] tracking-[0.1em] uppercase mb-3">The honest caveats</h3>
              <p className="text-[16px] leading-[1.8] text-[#2d2d3f]/75">The research is mostly on students and knowledge workers, not nonprofit professionals. Growth-mode evidence is thinner than decline-mode evidence. One key finding rests on 9 participants. The author sells a training program this framework motivates. All of this is disclosed in full. We would rather you trust the hedging than be impressed by the confidence.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const EXPLORE_PATHS = [
  {
    icon: '🔬',
    title: 'I want to see the research',
    desc: 'Browse 36 studies — 8 anchor papers deep-read, the rest skim-extracted — with effect sizes, sample sizes, and source links. Plus the April 2026 update with 6 new findings.',
    links: [
      { label: 'Evidence Base (36 studies)', href: '#evidence' },
      { label: 'Four Design Factors', href: '#factors' },
      { label: 'Epistemic Caveats', href: '#caveats' },
    ],
  },
  {
    icon: '🧭',
    title: 'I want the practical framework',
    desc: 'The seven modes, the two questions, Mode Contracts, and Cognitive Indicators of Compromise — the tools you can use starting today.',
    links: [
      { label: 'The Two Questions', href: '#two-questions' },
      { label: 'Seven Modes of AI Use', href: '#modes' },
      { label: 'Cognitive IoCs', href: '#indicators' },
    ],
  },
  {
    icon: '📋',
    title: 'I want to teach this to my team',
    desc: 'The Week 1 curriculum module: exercises, Mode Contract templates, the Mode 7 List, and a one-paragraph summary you can print on an index card.',
    links: [
      { label: 'Curriculum Module', href: '#curriculum' },
      { label: 'Next Steps for MTM', href: '#next-steps' },
    ],
  },
  {
    icon: '❓',
    title: 'I want the core question answered',
    desc: 'Does AI make you smarter or dumber? The research question, the one-sentence answer, and why "it depends" is no longer good enough.',
    links: [
      { label: 'The Question', href: '#question' },
      { label: 'The Two Questions', href: '#two-questions' },
      { label: 'Master Moderator', href: '#factors' },
    ],
  },
]

function ExploreGuide() {
  return (
    <section id="explore" className="py-28 px-6 bg-[#004d54] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#003d44] via-[#004d54] to-[#005a63]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00b8a9]/[0.05] blur-[120px]" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal>
          <p className="ui-text text-[#00b8a9] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">Navigate This Report</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] text-white mb-4">Where does your curiosity lead?</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-[15px] text-white/50 mb-12 max-w-lg">This report is designed to be explored, not read linearly. Choose the path that matches what you need right now.</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {EXPLORE_PATHS.map((path, i) => (
            <Reveal key={i} delay={140 + i * 60}>
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.08] transition-colors h-full flex flex-col">
                <div className="text-2xl mb-3">{path.icon}</div>
                <h3 className="text-[16px] text-white mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{path.title}</h3>
                <p className="text-[13px] text-white/45 leading-relaxed mb-5 flex-1">{path.desc}</p>
                <div className="space-y-1.5">
                  {path.links.map((link, j) => (
                    <a key={j} href={link.href} className="flex items-center gap-2 ui-text text-[11px] text-[#00b8a9] hover:text-[#00b8a9]/80 font-medium transition-colors">
                      <span className="text-[#00b8a9]/40">→</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Report ─── */
export default function Report() {
  return (
    <>
      <SideNav />
      <TopNav />
      <main>
        <Hero />
        <Purpose />
        <ExecutiveSummary />
        <ExploreGuide />
        <TheQuestion />
        <TwoQuestions />
        <Factors />
        <SevenModes />
        <Evidence />
        <Update2026 />
        <CognitiveIoCs />
        <HandThisPrompt background="warm" anchor="hand-this-prompt" />
        <Caveats />
      </main>
      <Footer />
    </>
  )
}
