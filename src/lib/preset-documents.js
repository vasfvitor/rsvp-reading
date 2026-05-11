const presetAssetModules = import.meta.glob('../presets/**/*.{epub,pdf,txt,md,markdown}', {
  query: '?url',
  import: 'default',
  eager: true
})

/**
 * @typedef {Object} PresetDocument
 * @property {string} id
 * @property {string} name
 * @property {string} fileName
 * @property {string} extension
 * @property {string} url
 */

/**
 * Build stable preset metadata from a Vite glob manifest.
 * @param {Record<string, string>} manifest
 * @returns {PresetDocument[]}
 */
export function createPresetDocuments(manifest) {
  const usedIds = new Map()

  return Object.entries(manifest)
    .map(([path, url]) => {
      const fileName = decodeURIComponent(path.split('/').pop() || path)
      const extension = getExtension(fileName)
      const baseName = fileName.slice(0, fileName.length - extension.length - 1)
      const idBase = slugify(fileName)
      const seenCount = usedIds.get(idBase) || 0
      usedIds.set(idBase, seenCount + 1)

      return {
        id: seenCount === 0 ? idBase : `${idBase}-${seenCount + 1}`,
        name: baseName,
        fileName,
        extension,
        url
      }
    })
    .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { sensitivity: 'base' }))
}

/**
 * Get all bundled preset documents discovered by Vite.
 * @returns {PresetDocument[]}
 */
export function getPresetDocuments() {
  return createPresetDocuments(presetAssetModules)
}

/**
 * Load a preset document as a File.
 * @param {string} id
 * @returns {Promise<File>}
 */
export async function loadPresetDocument(id) {
  return loadPresetDocumentFromList(getPresetDocuments(), id)
}

/**
 * Load a preset document from a supplied preset list.
 * @param {Array<Pick<PresetDocument, 'id' | 'fileName' | 'url'>>} presets
 * @param {string} id
 * @returns {Promise<File>}
 */
export async function loadPresetDocumentFromList(presets, id) {
  const preset = presets.find((item) => item.id === id)
  if (!preset) {
    throw new Error(`Unknown preset document: ${id}`)
  }

  const response = await fetch(preset.url)
  if (!response.ok) {
    throw new Error(`Could not load preset document: ${preset.fileName}`)
  }

  const blob = await response.blob()
  return new File([blob], preset.fileName, {
    type: blob.type || getMimeTypeForFileName(preset.fileName)
  })
}

/**
 * Return the MIME type for a supported filename.
 * @param {string} fileName
 * @returns {string}
 */
export function getMimeTypeForFileName(fileName) {
  const extension = getExtension(fileName)

  switch (extension) {
    case 'epub':
      return 'application/epub+zip'
    case 'pdf':
      return 'application/pdf'
    case 'txt':
      return 'text/plain'
    case 'md':
    case 'markdown':
      return 'text/markdown'
    default:
      return 'application/octet-stream'
  }
}

function getExtension(fileName) {
  return fileName.toLowerCase().split('.').pop() || ''
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, (extension) => extension.replace('.', '-'))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
