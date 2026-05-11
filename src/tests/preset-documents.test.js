import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createPresetDocuments,
  loadPresetDocumentFromList,
  getMimeTypeForFileName
} from '../lib/preset-documents.js'

describe('createPresetDocuments', () => {
  it('creates sorted preset metadata from a Vite asset manifest', () => {
    const presets = createPresetDocuments({
      '../presets/zebra.epub': '/assets/zebra.epub',
      '../presets/01 intro.md': '/assets/01%20intro.md',
      '../presets/reference.PDF': '/assets/reference.PDF'
    })

    expect(presets).toEqual([
      {
        id: '01-intro-md',
        name: '01 intro',
        fileName: '01 intro.md',
        extension: 'md',
        url: '/assets/01%20intro.md'
      },
      {
        id: 'reference-pdf',
        name: 'reference',
        fileName: 'reference.PDF',
        extension: 'pdf',
        url: '/assets/reference.PDF'
      },
      {
        id: 'zebra-epub',
        name: 'zebra',
        fileName: 'zebra.epub',
        extension: 'epub',
        url: '/assets/zebra.epub'
      }
    ])
  })

  it('deduplicates ids when filenames normalize to the same value', () => {
    const presets = createPresetDocuments({
      '../presets/my book.md': '/assets/my-book.md',
      '../presets/my-book.md': '/assets/my-book-2.md'
    })

    expect(presets.map((preset) => preset.id)).toEqual(['my-book-md', 'my-book-md-2'])
  })
})

describe('getMimeTypeForFileName', () => {
  it('returns MIME types for supported preset formats', () => {
    expect(getMimeTypeForFileName('book.epub')).toBe('application/epub+zip')
    expect(getMimeTypeForFileName('doc.pdf')).toBe('application/pdf')
    expect(getMimeTypeForFileName('notes.txt')).toBe('text/plain')
    expect(getMimeTypeForFileName('draft.md')).toBe('text/markdown')
    expect(getMimeTypeForFileName('draft.markdown')).toBe('text/markdown')
  })
})

describe('loadPresetDocumentFromList', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches a preset and returns it as a File', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['hello'], { type: 'text/plain' }))
    }))

    const file = await loadPresetDocumentFromList([
      {
        id: 'notes-txt',
        fileName: 'notes.txt',
        url: '/assets/notes.txt'
      }
    ], 'notes-txt')

    expect(fetch).toHaveBeenCalledWith('/assets/notes.txt')
    expect(file).toBeInstanceOf(File)
    expect(file.name).toBe('notes.txt')
    expect(file.type).toBe('text/plain')
  })

  it('throws for unknown preset ids', async () => {
    await expect(loadPresetDocumentFromList([], 'missing')).rejects.toThrow('Unknown preset document')
  })

  it('throws for failed preset fetches', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404
    }))

    await expect(loadPresetDocumentFromList([
      {
        id: 'missing-pdf',
        fileName: 'missing.pdf',
        url: '/assets/missing.pdf'
      }
    ], 'missing-pdf')).rejects.toThrow('Could not load preset document')
  })
})
