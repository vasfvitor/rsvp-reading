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
        highlightIndex: 1,
        wrappedLineCount: 4
      }
    })

    expect(container.querySelector('.wrapped-phrase')).toBeInTheDocument()
    expect(container.querySelector('.wrapped-phrase .orp')).not.toBeInTheDocument()
    expect(container.querySelector('.wrapped-phrase .before-orp')).not.toBeInTheDocument()
    expect(container.querySelector('.wrapped-phrase .after-orp')).not.toBeInTheDocument()
  })

  it('uses the configured wrapped line count in the viewport style', () => {
    const { container } = render(RSVPDisplay, {
      props: {
        displayMode: 'wrapped',
        wordGroup: ['wrapped', 'text', 'works'],
        highlightIndex: 1,
        wrappedLineCount: 6
      }
    })

    expect(container.querySelector('.word-container')).toHaveAttribute('style', expect.stringContaining('--wrapped-lines: 6;'))
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
    targetFPS: 60,
    wrappedLineCount: 4
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

  it('shows the wrapped height control with the default of 4 lines', () => {
    render(Settings, {
      props: {
        ...baseProps,
        displayMode: 'wrapped'
      }
    })

    expect(screen.getByText('Wrapped height')).toBeInTheDocument()
    expect(screen.getByLabelText('Wrapped height')).toHaveValue('4')
  })

  it('offers 75 FPS as the top refresh-rate preset', () => {
    render(Settings, {
      props: {
        ...baseProps,
        displayMode: 'wrapped',
        targetFPS: 75
      }
    })

    expect(screen.getByRole('button', { name: '75 FPS' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '120 FPS' })).not.toBeInTheDocument()
  })
})
