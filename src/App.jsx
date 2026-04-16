import { useState, useEffect, useRef } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'question', label: 'The Question' },
  { id: 'two-questions', label: 'Two Questions' },
  { id: 'factors', label: 'Four Factors' },
  { id: 'modes', label: 'Seven Modes' },
  { id: 'evidence', label: 'Evidence Base' },
  { id: 'indicators', label: 'Cognitive IoCs' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'caveats', label: 'Caveats' },
  { id: 'next-steps', label: 'Next Steps' },
]

function useActiveSection() {
  const [active, setActive] = useState('hero')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Nav() {
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8f7f4]/90 backdrop-blur-md border-b border-[#006d77]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <a href="#hero" className="font-sans font-semibold text-[#006d77] text-sm tracking-wide">THE METACOGNITION PLAYBOOK</a>
        <button className="sm:hidden text-[#006d77]" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
        <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex absolute sm:relative top-14 sm:top-0 left-0 right-0 bg-[#f8f7f4] sm:bg-transparent flex-col sm:flex-row gap-1 sm:gap-0 p-4 sm:p-0 border-b sm:border-0 border-[#006d77]/10`}>
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}
              className={`font-sans text-xs px-2.5 py-1.5 rounded-full transition-colors ${active === id ? 'bg-[#006d77] text-white' : 'text-[#64748b] hover:text-[#006d77]'}`}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-14">
      <div className="max-w-2xl text-center">
        <FadeIn><p className="font-sans text-[#00b8a9] text-sm font-semibold tracking-widest uppercase mb-6">Meet the Moment · Research Report</p></FadeIn>
        <FadeIn delay={100}><h1 className="font-sans text-5xl sm:text-6xl font-bold text-[#006d77] leading-tight mb-4">The Metacognition Playbook</h1></FadeIn>
        <FadeIn delay={200}><p className="font-sans text-xl text-[#64748b] mb-2">A Working Model for Deliberate AI Use</p></FadeIn>
        <FadeIn delay={300}><p className="font-sans text-sm text-[#64748b] mb-8">Joshua Peskay · April 2026</p></FadeIn>
        <FadeIn delay={400}><p className="text-lg text-[#1e293b]/80 leading-relaxed mb-12">A meta-analysis of 31 studies on how AI changes the way we think — and what to do about it.</p></FadeIn>
        <FadeIn delay={500}>
          <a href="#question" className="inline-block font-sans text-sm text-[#006d77] border border-[#006d77]/20 rounded-full px-6 py-2.5 hover:bg-[#006d77] hover:text-white transition-colors">Read the report ↓</a>
        </FadeIn>
      </div>
    </section>
  )
}

function TheQuestion() {
  return (
    <section id="question" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <FadeIn><p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-8">The Question</p></FadeIn>
        <FadeIn delay={100}><p className="text-2xl sm:text-3xl leading-snug text-[#1e293b] mb-8 font-sans font-light">Not <em>"does AI make you smarter or dumber"</em> — both are true in different conditions.</p></FadeIn>
        <FadeIn delay={200}>
          <blockquote className="border-l-4 border-[#00b8a9] pl-6 my-8">
            <p className="text-lg leading-relaxed text-[#1e293b]/90">What are the distinguishable modes of working with AI, and which conditions determine whether a mode produces cognitive growth, cognitive decline, or neutral triage?</p>
          </blockquote>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="bg-[#f0efeb] rounded-xl p-6 my-8">
            <p className="font-sans text-sm font-semibold text-[#006d77] mb-2">The answer in one sentence</p>
            <p className="text-base leading-relaxed">Cognitive outcomes depend less on AI exposure than on four design variables, with metacognitive calibration as the master moderator.</p>
          </div>
        </FadeIn>
        <FadeIn delay={400}><p className="text-lg leading-relaxed text-[#1e293b]/80">In plain English: it is not whether you use AI. It is not even how much. It is whether, in each interaction, you can answer two questions honestly.</p></FadeIn>
      </div>
    </section>
  )
}

function TwoQuestions() {
  return (
    <section id="two-questions" className="py-24 px-6 bg-[#006d77]">
      <div className="max-w-3xl mx-auto">
        <FadeIn><p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-8">The Heart of the Framework</p></FadeIn>
        <FadeIn delay={100}><h2 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-12">The Two Questions</h2></FadeIn>
        <div className="grid sm:grid-cols-2 gap-6">
          <FadeIn delay={200}>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10">
              <div className="font-sans text-[#00b8a9] text-5xl font-bold mb-4">Q1</div>
              <p className="text-xl text-white leading-relaxed font-sans">Am I trying to <strong className="text-[#00b8a9]">learn</strong> this, or <strong className="text-[#00b8a9]">finish</strong> it?</p>
              <p className="text-sm text-white/60 mt-4 leading-relaxed">This routes you to a mode. Learning demands Modes 3, 4, or 5. Finishing invites Mode 6 — if you say so out loud.</p>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10">
              <div className="font-sans text-[#00b8a9] text-5xl font-bold mb-4">Q2</div>
              <p className="text-xl text-white leading-relaxed font-sans">If the AI is wrong here, <strong className="text-[#00b8a9]">will I catch it?</strong></p>
              <p className="text-sm text-white/60 mt-4 leading-relaxed">In a 1,372-person study, the same AI produced a 40-point accuracy swing — and users' confidence did <em>not</em> drop when they were wrong.</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

const FACTORS = [
  { num: 1, title: 'Skill First, or Tool First?', subtitle: 'Order of Exposure', evidence: 'Kosmyna et al. (MIT, 2025). N=54→18. Brain-to-LLM: engagement spikes. LLM-to-Brain: persistent under-engagement — 7/9 couldn\'t quote own essays.', caveat: '⚠️ N=9 sub-analysis, preprint', takeaway: 'For skills you want to own, do the effortful work first.', doi: 'https://arxiv.org/abs/2506.08872' },
  { num: 2, title: 'Do You Know Where AI Is Reliable?', subtitle: 'Frontier Awareness', evidence: 'Dell\'Acqua et al. (HBS, 2023). N=758. In-frontier: +12%. Out-frontier: −19%. Shaw & Nave (Wharton, 2026). N=1,372. 40pp swing. h=0.81.', takeaway: '"Is this inside or outside what I can check?"', doi: 'https://ssrn.com/abstract=6097646' },
  { num: 3, title: 'Did the Thinking Move, or Disappear?', subtitle: 'Effort Relocation', evidence: 'Lee et al. (Microsoft, 2025). N=319. Effort relocates. Barcaui (2025). d=0.68 retention loss at 45 days. Fan et al. (2024). "Metacognitive laziness."', takeaway: 'Growth mode relocates effort. Decline mode eliminates it.' },
  { num: 4, title: 'Did You Tell AI What Kind of Help You Want?', subtitle: 'Configuration / Mode Contracts', evidence: 'Bastani et al. (PNAS, 2025). ~1,000 students. Unguarded: −17%. Guardrailed: no effect. LearnLM (DeepMind): +5.5pp transfer.', badge: '🔬 Strongest lever', takeaway: 'Same model, same students, opposite outcomes.', doi: 'https://doi.org/10.1073/pnas.2422633122' },
]

function Factors() {
  const [expanded, setExpanded] = useState(null)
  return (
    <section id="factors" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">The Framework</p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#006d77] mb-4">Four Design Factors</h2>
          <p className="text-lg text-[#64748b] mb-6">+ one master moderator</p>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="bg-gradient-to-r from-[#006d77] to-[#00b8a9] rounded-2xl p-6 sm:p-8 mb-10 text-white">
            <p className="font-sans text-xs font-semibold tracking-widest uppercase text-[#00b8a9]/80 mb-2">Master Moderator</p>
            <h3 className="font-sans text-xl font-bold mb-3">Can You Still Tell When It's Wrong?</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-3">Confidence did NOT decline when participants were wrong alongside AI (Shaw & Nave). The calibration loop was severed.</p>
            <p className="text-sm text-white/60 leading-relaxed">Metacognition is a demand, not an intervention. It needs environmental scaffolding to be sustainable.</p>
          </div>
        </FadeIn>
        <div className="grid gap-4">
          {FACTORS.map((f, i) => (
            <FadeIn key={f.num} delay={150 + i * 100}>
              <div onClick={() => setExpanded(expanded === f.num ? null : f.num)} className="cursor-pointer w-full text-left bg-white rounded-xl border border-[#006d77]/10 hover:border-[#00b8a9]/30 transition-colors overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="font-sans text-3xl font-bold text-[#00b8a9]/30 shrink-0">{f.num}</div>
                    <div className="flex-1">
                      <h3 className="font-sans text-lg font-semibold text-[#006d77]">{f.title}</h3>
                      <p className="font-sans text-xs text-[#64748b] mt-0.5">{f.subtitle}</p>
                      {f.badge && <span className="inline-block font-sans text-xs bg-[#00b8a9]/10 text-[#006d77] px-2 py-0.5 rounded-full mt-2">{f.badge}</span>}
                      <p className="text-sm text-[#1e293b]/70 mt-3 leading-relaxed">{f.takeaway}</p>
                    </div>
                    <svg className={`w-5 h-5 text-[#64748b] shrink-0 transition-transform ${expanded === f.num ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {expanded === f.num && (
                    <div className="mt-4 pt-4 border-t border-[#006d77]/5">
                      <p className="text-sm text-[#1e293b]/70 leading-relaxed mb-2"><strong className="font-sans text-[#006d77]">Evidence:</strong> {f.evidence}</p>
                      {f.caveat && <p className="font-sans text-xs text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1.5 rounded-lg inline-block mt-2">{f.caveat}</p>}
                      {f.doi && <a href={f.doi} target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-[#00b8a9] hover:underline block mt-2">View source →</a>}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const MODE_COLORS = { 'neutral': '#94a3b8', 'warning': '#f59e0b', 'danger': '#dc2626', 'growth': '#00b8a9', 'conditional': '#0891b2', 'protected': '#7c3aed' }
const MODES = [
  { num: 0, name: 'Lookup', color: 'neutral', badge: 'Neutral', desc: 'Quick fact retrieval. Fine unless it leaks into strategic decisions.', prompt: '"What\'s the exchange rate?" "How do you spell her name?"' },
  { num: 1, name: 'Autopilot', color: 'warning', badge: '⚠️ Decline', desc: 'Accept AI output without engaging. Default state for every busy professional.', prompt: 'You asked, you got, you used. You didn\'t form your own view first.' },
  { num: 2, name: 'Looking Good, Learning Nothing', color: 'danger', badge: '🔴 Hidden Decline', desc: 'Decline disguised as growth. Output looks fine. Skill isn\'t building. The bill comes due all at once.', prompt: 'The grant narrative reads well. If AI vanished tomorrow, could you write it?' },
  { num: 3, name: 'Stewardship', color: 'growth', badge: '✅ Growth', desc: 'You form your view first. AI proposes, you dispose. "Doing → stewarding."', prompt: 'You wrote the shape. AI tightened the sentences. You kept the voice.' },
  { num: 4, name: 'Sparring Partner', color: 'growth', badge: '✅ Growth', desc: 'You have a position. You ask AI to challenge it. The only feedback type shown to produce transfer learning.', prompt: '"Steelman the opposite view. Find the weakest link."' },
  { num: 5, name: 'Co-Pilot', color: 'conditional', badge: '✅ Conditional', desc: 'AI removes friction so you focus on judgment. Works when you have evaluative capacity. May flatten voice for high-skill writers.', prompt: 'AI generates six openings; you pick the one with the right tone.' },
  { num: 6, name: 'Good Enough on Purpose', color: 'neutral', badge: 'Declared', desc: 'Conscious bounded delegation. "I\'m using AI for X. Not trying to learn this. I\'ll spot-check Y. Budget Z minutes."', prompt: 'If you didn\'t say the sentence, you were in Mode 1.' },
  { num: 7, name: 'Hands Off', color: 'protected', badge: '🟣 Protected', desc: 'Work you keep AI out of on purpose. Not because AI can\'t — because doing it yourself IS the point.', prompt: '"This one is mine."' },
]

function Modes() {
  return (
    <section id="modes" className="py-24 px-6 bg-[#f0efeb]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">The Patterns</p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#006d77] mb-4">Seven Modes of AI Use</h2>
          <p className="text-lg text-[#64748b] mb-10">The goal is not to always be in a growth mode. It is to know which mode you are in and choose it deliberately.</p>
        </FadeIn>
        <div className="grid gap-4">
          {MODES.map((m, i) => (
            <FadeIn key={m.num} delay={i * 80}>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid ${MODE_COLORS[m.color]}` }}>
                <div className="flex items-start gap-4">
                  <div className="font-sans text-3xl font-bold shrink-0" style={{ color: MODE_COLORS[m.color], opacity: 0.4 }}>{m.num}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-sans text-base font-semibold text-[#1e293b]">{m.name}</h3>
                      <span className="font-sans text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${MODE_COLORS[m.color]}20`, color: MODE_COLORS[m.color] }}>{m.badge}</span>
                    </div>
                    <p className="text-sm text-[#1e293b]/70 leading-relaxed mt-2">{m.desc}</p>
                    <p className="text-sm italic text-[#64748b] mt-2">{m.prompt}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const STUDIES = [
  { tier: 1, title: 'Cognitive Debt (EEG)', authors: 'Kosmyna et al.', venue: 'MIT Media Lab', year: 2025, n: '54→18', finding: 'LLM users: weakest connectivity. 7/9 couldn\'t quote own essays.', stars: 5, doi: 'https://arxiv.org/abs/2506.08872' },
  { tier: 1, title: 'Cognitive Surrender', authors: 'Shaw & Nave', venue: 'Wharton / SSRN', year: 2026, n: '1,372', finding: '40pp accuracy swing. h=0.81. Confidence didn\'t drop when wrong.', stars: 5, doi: 'https://ssrn.com/abstract=6097646' },
  { tier: 1, title: 'Critical Thinking Impact', authors: 'Lee et al.', venue: 'Microsoft / CMU', year: 2025, n: '319', finding: 'GenAI confidence → less thinking (β=−0.69). Self-confidence → more (+0.31).', stars: 5 },
  { tier: 1, title: 'Without Guardrails', authors: 'Bastani et al.', venue: 'PNAS', year: 2025, n: '~1,000', finding: 'Same GPT-4: −17% unguarded. 0% guardrailed. Configuration > willpower.', stars: 5, doi: 'https://doi.org/10.1073/pnas.2422633122' },
  { tier: 1, title: 'Creativity vs. Diversity', authors: 'Doshi & Hauser', venue: 'Science Advances', year: 2024, n: '293+600', finding: 'Low-skill: +22% quality. High-skill: no gain + voice flattening.', stars: 5, doi: 'https://doi.org/10.1126/sciadv.adn5290' },
  { tier: 1, title: 'Metacognitive Laziness', authors: 'Fan et al.', venue: 'BJET', year: 2024, n: '117', finding: 'Better essays, NO knowledge gain. AI removes disfluency triggers.', stars: 5, doi: 'https://doi.org/10.1111/bjet.13544' },
  { tier: 1, title: 'AIGC Design Creativity', authors: 'Wang et al.', venue: 'Frontiers Psych.', year: 2025, n: '64', finding: 'd=1.02 concentration, d=0.55 creativity. Active partnership works.', stars: 4, doi: 'https://doi.org/10.3389/fpsyg.2025.1508383' },
  { tier: 1, title: 'Chatbot Feedback (fNIRS)', authors: 'Yin et al.', venue: 'npj Sci. Learning', year: 2025, n: '66', finding: 'Metacognitive feedback → transfer. Affective → retention only.', stars: 4 },
  { tier: 2, title: 'Jagged Frontier', authors: 'Dell\'Acqua et al.', venue: 'HBS', year: 2023, n: '758', finding: '+12% in-frontier, −19% out-of-frontier.', stars: 5 },
  { tier: 2, title: 'Political Persuasion', authors: 'Hackenburg et al.', venue: 'Science', year: 2025, n: '76,977', finding: 'Persuasion +51% but accuracy drops. Trade-off is structural.', stars: 5, doi: 'https://doi.org/10.1126/science.aea3884' },
  { tier: 2, title: 'LearnLM Tutoring', authors: 'DeepMind / Eedi', venue: 'Tech Report', year: 2025, n: '165', finding: '+5.5pp novel transfer. Pedagogical AI + supervision = growth.', stars: 5 },
  { tier: 2, title: 'Cognitive Crutch', authors: 'Barcaui', venue: 'SSH Open', year: 2025, n: '120', finding: '45-day retention: d=0.68 loss.', stars: 5 },
  { tier: 2, title: 'Tutor CoPilot', authors: 'Wang et al.', venue: 'Stanford', year: 2025, n: '2,700', finding: '+4pp mastery; +9pp for weakest tutors. $20/yr.', stars: 4 },
  { tier: 2, title: 'AI vs. Active Learning', authors: 'Kestin et al.', venue: 'Harvard / Sci. Rep.', year: 2024, n: '-', finding: 'Purpose-built AI tutor beats active learning.', stars: 4 },
  { tier: 2, title: 'Meta-analysis (51 studies)', authors: 'Wang & Fan', venue: 'Nature Portfolio', year: 2025, n: '51 studies', finding: 'g=0.867 performance. Conditional on scaffolding.', stars: 4 },
  { tier: 2, title: 'Psychosocial Effects', authors: 'Fang et al.', venue: 'MIT / OpenAI', year: 2025, n: '981', finding: 'Dose + disposition drive harm, not modality.', stars: 5 },
  { tier: 2, title: 'Children fMRI', authors: 'Horowitz-Kraus et al.', venue: 'bioRxiv', year: 2025, n: '31', finding: 'Children: lower frontoparietal connectivity during AI use.', stars: 4 },
  { tier: 2, title: 'How Americans View AI', authors: 'Pew Research', venue: 'Pew', year: 2025, n: '5,023', finding: '53% say AI will worsen creative thinking.', stars: 4, doi: 'https://www.pewresearch.org/science/2025/09/17/how-americans-view-ai-and-its-impact-on-people-and-society/' },
  { tier: 2, title: 'Teens & AI Chatbots', authors: 'Pew Research', venue: 'Pew', year: 2025, n: '1,458', finding: '64% of teens use chatbots. ~30% daily.', stars: 4, doi: 'https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/' },
  { tier: 2, title: 'Illusions of Understanding', authors: 'Nature Editorial', venue: 'Nature', year: 2024, n: '-', finding: 'AI: "more but understanding less." Scientific monocultures.', stars: 4 },
  { tier: 2, title: '3R Principle', authors: 'Rossi et al.', venue: 'npj AI', year: 2026, n: '-', finding: 'Passive → synaptic weakening. Active → strengthening.', stars: 4 },
]

function EvidenceBase() {
  return (
    <section id="evidence" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">The Research</p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#006d77] mb-4">Evidence Base</h2>
          <p className="text-lg text-[#64748b] mb-10">31 studies. 8 anchor papers deep-read. 23 supporting studies skim-extracted.</p>
        </FadeIn>
        <div className="space-y-3">
          {STUDIES.map((s, i) => (
            <FadeIn key={i} delay={i * 30}>
              <div className="bg-white rounded-lg p-4 border border-[#006d77]/5 hover:border-[#00b8a9]/20 transition-colors">
                <div className="flex items-start gap-3">
                  <span className={`font-sans text-[10px] px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${s.tier === 1 ? 'bg-[#00b8a9]/10 text-[#006d77] font-semibold' : 'bg-[#006d77]/5 text-[#64748b]'}`}>{s.tier === 1 ? 'T1' : 'T2'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-sans text-sm font-semibold text-[#1e293b] leading-snug">{s.title}</h4>
                        <p className="font-sans text-xs text-[#64748b] mt-0.5">{s.authors} · {s.venue} · {s.year}{s.n && s.n !== '-' ? ` · N=${s.n}` : ''}</p>
                      </div>
                      <div className="font-sans text-xs text-[#00b8a9] shrink-0">{'★'.repeat(s.stars)}{'☆'.repeat(5 - s.stars)}</div>
                    </div>
                    <p className="text-xs text-[#1e293b]/60 mt-1.5 leading-relaxed">{s.finding}</p>
                    {s.doi && <a href={s.doi} target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] text-[#00b8a9] hover:underline mt-1 inline-block">View source →</a>}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const INDICATORS = [
  { name: 'Uncharacteristic agreement', signal: 'Accepting AI without pushback where you\'d normally debate' },
  { name: 'Compressed curiosity', signal: 'Stopping at the first answer instead of probing' },
  { name: 'Context drift', signal: 'Letting AI redefine the question you started with' },
  { name: 'False familiarity', signal: 'Feeling you understand from an AI summary alone' },
  { name: 'Judgment delegation', signal: 'Outsourcing a call that should be yours' },
  { name: 'Confidence inflation', signal: 'Feeling more certain than your evidence warrants' },
  { name: 'Verification fatigue', signal: 'Getting tired of checking and defaulting to acceptance' },
  { name: 'Phrase contamination', signal: 'Your writing starting to sound like AI' },
]

function CognitiveIoCs() {
  return (
    <section id="indicators" className="py-24 px-6 bg-[#006d77]">
      <div className="max-w-3xl mx-auto">
        <FadeIn><p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">Early Warning System</p></FadeIn>
        <FadeIn delay={100}><h2 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-4">Cognitive Indicators of Compromise</h2></FadeIn>
        <FadeIn delay={150}><p className="text-base text-white/60 mb-10">Adapted from Allen Westley's cognitive security work (CSI #91). Behavioral tells that you're drifting into Mode 1 or Mode 2.</p></FadeIn>
        <div className="space-y-3">
          {INDICATORS.map((ind, i) => (
            <FadeIn key={i} delay={200 + i * 60}>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b] mt-2 shrink-0"></div>
                <div><h4 className="font-sans text-sm font-semibold text-white">{ind.name}</h4><p className="text-sm text-white/50 mt-1">{ind.signal}</p></div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Curriculum() {
  return (
    <section id="curriculum" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn><p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">Week 1 Preview</p></FadeIn>
        <FadeIn delay={50}><h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#006d77] mb-10">The Curriculum Module</h2></FadeIn>
        <div className="space-y-6">
          {[
            { title: 'The Two-Question Habit', desc: 'Before every significant AI interaction: Q1 (learn or finish?) and Q2 (will I catch a wrong answer?). Clunky for a week, then infrastructure.' },
            { title: 'Three Mode Contract Templates', desc: 'For Learning: "Don\'t give me the answer until I show my work." For Stewardship: "Critique, don\'t rewrite. Keep my voice." For Sparring: "Steelman the opposite position."' },
            { title: 'Mode 7 List', desc: 'Write down 2-3 kinds of work where AI does not get a seat at the table. Revisit once a year.' },
            { title: 'Three Self-Check Layers', desc: 'Daily: Two Questions. Weekly: Artifact review (one transcript, four questions). Monthly: "Could I still do this tomorrow if AI disappeared?"' },
            { title: 'Week 1 Exercises', desc: '(1) Review three real AI transcripts against the seven modes. (2) Write three Mode Contracts + your Mode 7 list. (3) Speech Act: say the Mode 6 sentence to a pod partner.' },
          ].map((item, i) => (
            <FadeIn key={i} delay={100 + i * 60}>
              <div className="bg-white rounded-xl border border-[#006d77]/10 p-6">
                <h3 className="font-sans text-lg font-semibold text-[#006d77] mb-3">{item.title}</h3>
                <p className="text-sm text-[#1e293b]/70 leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Caveats() {
  const items = [
    'Not all AI use is harmful — growth modes are real when configured well',
    'Metacognitive awareness alone is not sufficient — needs Mode Contracts, rituals, peer review',
    'Research is mostly students and knowledge workers — nonprofit generalization is extrapolation',
    'Mode 6 has zero direct empirical support — operationalized via speech act',
    'Factor 1 (Kosmyna) rests on N=9 in a preprint sub-analysis',
    'Growth-mode evidence is thinner than decline-mode evidence',
    'The framework may need rewriting when longitudinal data on professionals arrives',
    'The author sells a PAI Accelerator — conflict of interest disclosed',
  ]
  return (
    <section id="caveats" className="py-24 px-6 bg-[#f0efeb]">
      <div className="max-w-3xl mx-auto">
        <FadeIn><p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">Epistemic Honesty</p></FadeIn>
        <FadeIn delay={50}><h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#006d77] mb-10">What This Framework Does Not Claim</h2></FadeIn>
        <div className="space-y-4">
          {items.map((item, i) => (
            <FadeIn key={i} delay={100 + i * 50}>
              <div className="flex gap-3 items-start"><span className="text-[#00b8a9] mt-1 shrink-0">○</span><p className="text-base text-[#1e293b]/70 leading-relaxed">{item}</p></div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const NEXT_STEPS = [
  { area: 'PAI Accelerator', items: ['Integrate Week 1 module: modes, two questions, mode contracts', 'Mode 7 List exercise → Week 2', 'Mode Contracts → Week 3 Packages', 'Disagreement Audit → Week 4', 'Peer artifact review from Week 2 forward'] },
  { area: 'MTM Together', items: ['"Mode of the Month" discussion series', 'Shareable Mode identification cards', 'Monthly retrospective audit template'] },
  { area: 'Thought Leadership', items: ['Solve Tuesday #10 (1,200-1,500 words)', 'LinkedIn series: Problem → Framework → Practice', 'Conference talk for keynotes & TechSoup', 'Co-author with cognitive scientist'] },
  { area: 'Client Advisory', items: ['"Deliberate AI Use" policy template for vCISO work', 'Per-client Mode Contract library', 'Cognitive IoCs in security awareness training'] },
  { area: 'Research & Development', items: ['Track Kosmyna replication (Factor 1 flag)', 'Pre/post pilot with Accelerator cohort', 'Explore Wharton / MIT collaboration', '90-day / 180-day longitudinal tracking'] },
  { area: 'Nonprofit Sector', items: ['Position MTM as evidence-grounded voice', 'NTEN / AFP session proposal', 'Module for Nonprofit AI Safety Guide', 'Mode identification self-assessment tool'] },
]

function NextSteps() {
  return (
    <section id="next-steps" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn><p className="font-sans text-[#00b8a9] text-xs font-semibold tracking-widest uppercase mb-4">Looking Forward</p></FadeIn>
        <FadeIn delay={50}><h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#006d77] mb-10">Next Steps for MTM</h2></FadeIn>
        <div className="grid sm:grid-cols-2 gap-6">
          {NEXT_STEPS.map((section, i) => (
            <FadeIn key={i} delay={100 + i * 60}>
              <div className="bg-white rounded-xl border border-[#006d77]/10 p-6 h-full">
                <h3 className="font-sans text-sm font-semibold text-[#00b8a9] mb-4">{section.area}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-2 items-start"><span className="text-[#00b8a9] text-xs mt-1">→</span><span className="text-sm text-[#1e293b]/70 leading-relaxed">{item}</span></li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-16 px-6 bg-[#006d77] text-white/60">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="font-sans text-sm">This report was produced by Vishali, Joshua Peskay's Personal AI, using 31 research sources, 4-voice council review, and 4-persona audience validation.</p>
        <p className="font-sans text-sm">The analysis, framework, and editorial voice are Joshua's. The synthesis was AI-assisted and human-directed.</p>
        <div className="flex justify-center gap-6 pt-4 font-sans text-xs text-[#00b8a9]"><span>mtm.now</span><span>·</span><span>PAI Accelerator</span><span>·</span><span>MTM Together</span><span>·</span><span>Solve Tuesday</span></div>
        <p className="font-sans text-xs text-white/30 pt-4">© 2026 Meet the Moment. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (<><Nav /><main><Hero /><TheQuestion /><TwoQuestions /><Factors /><Modes /><EvidenceBase /><CognitiveIoCs /><Curriculum /><Caveats /><NextSteps /></main><Footer /></>)
}
