/* Your AI Use, Reviewed — companion behavioral assessment to The Metacognition Playbook.
   Single-page state machine: intro → 7 question screens → results. */
import { useState, useEffect } from 'react'
import Header from './reviewed/Header.jsx'
import Intro from './reviewed/Intro.jsx'
import SingleChoice from './reviewed/SingleChoice.jsx'
import Matrix from './reviewed/Matrix.jsx'
import IoCQuestion from './reviewed/IoCQuestion.jsx'
import Results from './reviewed/Results.jsx'
import { ITEMS } from './reviewed/items.js'

/* Screen identifiers in order. Item2 is conditionally skipped when Item1 = "no_recent". */
const SCREENS = ['intro', 'item1', 'item2', 'matrix', 'iocs', 'configuration', 'frontier', 'handsOff', 'results']

const initialAnswers = {
  item1: null,
  item2: null,
  matrix: {},
  iocs: [],
  configuration: null,
  frontier: null,
  handsOff: null,
}

export default function Reviewed() {
  const [screen, setScreen] = useState('intro')
  const [answers, setAnswers] = useState(initialAnswers)

  /* Scroll to top when screen changes — assessment screens shouldn't carry scroll position */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen])

  const goNext = () => {
    const idx = SCREENS.indexOf(screen)
    if (idx === -1 || idx === SCREENS.length - 1) return

    let next = SCREENS[idx + 1]
    /* Skip Item 2 if user marked "no recent task" on Item 1 */
    if (next === 'item2' && answers.item1 === 'no_recent') {
      next = SCREENS[idx + 2]
    }
    setScreen(next)
  }

  const goBack = () => {
    const idx = SCREENS.indexOf(screen)
    if (idx <= 1) {
      setScreen('intro')
      return
    }
    let prev = SCREENS[idx - 1]
    /* Skip Item 2 going backward too if it was skipped going forward */
    if (prev === 'item2' && answers.item1 === 'no_recent') {
      prev = SCREENS[idx - 2]
    }
    setScreen(prev)
  }

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const retake = () => {
    setAnswers(initialAnswers)
    setScreen('intro')
  }

  /* Compute progress text — counts the user-facing question screens, not intro/results */
  const QUESTION_SCREENS = SCREENS.filter((s) => s !== 'intro' && s !== 'results')
  const progressIndex = QUESTION_SCREENS.indexOf(screen)
  const progress =
    progressIndex >= 0
      ? `${progressIndex + 1} of ${QUESTION_SCREENS.length}${
          answers.item1 === 'no_recent' && screen !== 'item2' ? ' (one skipped)' : ''
        }`
      : null

  return (
    <div className="min-h-screen">
      <Header progress={progress} />

      {screen === 'intro' && <Intro onStart={goNext} />}

      {screen === 'item1' && (
        <SingleChoice
          item={ITEMS.item1}
          value={answers.item1}
          onChange={(v) => updateAnswer('item1', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'item2' && (
        <SingleChoice
          item={ITEMS.item2}
          value={answers.item2}
          onChange={(v) => updateAnswer('item2', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'matrix' && (
        <Matrix
          value={answers.matrix}
          onChange={(v) => updateAnswer('matrix', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'iocs' && (
        <IoCQuestion
          value={answers.iocs}
          onChange={(v) => updateAnswer('iocs', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'configuration' && (
        <SingleChoice
          item={ITEMS.configuration}
          value={answers.configuration}
          onChange={(v) => updateAnswer('configuration', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'frontier' && (
        <SingleChoice
          item={ITEMS.frontier}
          value={answers.frontier}
          onChange={(v) => updateAnswer('frontier', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'handsOff' && (
        <SingleChoice
          item={ITEMS.handsOff}
          value={answers.handsOff}
          onChange={(v) => updateAnswer('handsOff', v)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {screen === 'results' && <Results answers={answers} onRetake={retake} />}
    </div>
  )
}
