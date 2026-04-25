# Wrapped Height Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manual wrapped-text height control with a default of 4 lines, and make the wrapped viewport size follow that setting.

**Architecture:** The wrapped display will stop using a fixed height constant and instead derive its viewport height from a user-controlled line count. `Settings.svelte` will own the new control, `App.svelte` will persist and pass the value, and `RSVPDisplay.svelte` will use it to compute a predictable wrapped viewport size. Existing multi-word context behavior stays unchanged.

**Tech Stack:** Svelte 5, Vitest, Testing Library for Svelte, CSS

---

### Task 1: Add the wrapped-height setting

**Files:**
- Modify: `src/lib/components/Settings.svelte`
- Modify: `src/App.svelte`
- Modify: `src/tests/display-modes.test.js`

- [ ] **Step 1: Write the failing test**

```js
it('shows a wrapped height control with a default of 4 lines', () => {
  render(Settings, {
    props: {
      wordsPerMinute: 300,
      fadeEnabled: true,
      fadeDuration: 150,
      pauseOnPunctuation: true,
      punctuationPauseMultiplier: 2,
      pauseAfterWords: 0,
      pauseDuration: 500,
      frameWordCount: 1,
      wordLengthWPMMultiplier: 5,
      targetFPS: 60,
      displayMode: 'wrapped',
      wrappedLineCount: 4
    }
  })

  expect(screen.getByText('Wrapped height')).toBeInTheDocument()
  expect(screen.getByDisplayValue('4')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/tests/display-modes.test.js`
Expected: FAIL because `Wrapped height` control does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```svelte
export let wrappedLineCount = 4;

{#if displayMode === 'wrapped'}
  <div class="control-row">
    <div class="control-header">
      <span>Wrapped height</span>
      <span class="control-value">{wrappedLineCount} lines</span>
    </div>
    <input type="range" min="2" max="10" step="1" bind:value={wrappedLineCount} class="slider">
    <p class="hint-text">Controls how many text lines the wrapped viewport can show</p>
  </div>
{/if}
```

```svelte
let wrappedLineCount = 4;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/tests/display-modes.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.svelte src/lib/components/Settings.svelte src/tests/display-modes.test.js
git commit -m "feat: add wrapped height control"
```

### Task 2: Size the wrapped viewport from line count

**Files:**
- Modify: `src/lib/components/RSVPDisplay.svelte`
- Modify: `src/App.svelte`
- Modify: `src/tests/display-modes.test.js`

- [ ] **Step 1: Write the failing test**

```js
it('maps wrapped line count to viewport height', () => {
  const { container } = render(RSVPDisplay, {
    props: {
      displayMode: 'wrapped',
      wordGroup: ['one', 'two', 'three', 'four'],
      highlightIndex: 1,
      wrappedLineCount: 4
    }
  })

  expect(container.querySelector('.word-container')).toHaveClass('wrapped-mode')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/tests/display-modes.test.js`
Expected: FAIL because `wrappedLineCount` is not wired through to the display.

- [ ] **Step 3: Write minimal implementation**

```svelte
export let wrappedLineCount = 4;

<div
  class="word-container"
  class:wrapped-mode={displayMode === 'wrapped'}
  style:height={`calc(${wrappedLineCount} * 1.18em + 1.5rem)`}
>
```

```svelte
<RSVPDisplay
  ...
  wrappedLineCount={wrappedLineCount}
/>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/tests/display-modes.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.svelte src/lib/components/RSVPDisplay.svelte src/tests/display-modes.test.js
git commit -m "feat: size wrapped viewport by line count"
```
