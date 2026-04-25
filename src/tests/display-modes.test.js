import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import RSVPDisplay from '../lib/components/RSVPDisplay.svelte'
import Settings from '../lib/components/Settings.svelte'

describe('wrapped display mode', () => {
  it('does not use centered ORP positioning classes inside the wrapped phrase', () => {
    const { container } = render(RSVPDisplay, {
      props: {
        displayMode: 'wrapped',
        wordGroup: ['wrapped', 'text', 'works'],
        highlightIndex: 1
      }
    })

    expect(container.querySelector('.wrapped-phrase')).toBeInTheDocument()
    expect(container.querySelector('.wrapped-phrase .orp')).not.toBeInTheDocument()
    expect(container.querySelector('.wrapped-phrase .before-orp')).not.toBeInTheDocument()
    expect(container.querySelector('.wrapped-phrase .after-orp')).not.toBeInTheDocument()
  })
})

describe('display settings', () => {
  const baseProps = {
    wordsPerMinute: 300,
    fadeEnabled: true,
    fadeDuration: 150,
    pauseOnPunctuation: true,
    punctuationPauseMultiplier: 2,
    pauseAfterWords: 0,
    pauseDuration: 500,
    frameWordCount: 5,
    wordLengthWPMMultiplier: 5,
    targetFPS: 60
  }

  it('hides the simultaneous-word control outside multi-word context mode', () => {
    render(Settings, {
      props: {
        ...baseProps,
        displayMode: 'wrapped'
      }
    })

    expect(screen.queryByText('Words shown simultaneously')).not.toBeInTheDocument()
  })

  it('shows the simultaneous-word control in multi-word context mode', () => {
    render(Settings, {
      props: {
        ...baseProps,
        displayMode: 'multi-word'
      }
    })

    expect(screen.getByText('Words shown simultaneously')).toBeInTheDocument()
  })
})
