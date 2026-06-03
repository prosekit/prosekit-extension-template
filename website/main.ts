import './style.css'

import { defineBasicExtension } from '@prosekit/basic'
import { createEditor, union } from '@prosekit/core'

import { defineYoutube } from '../src/index.ts'

const container = document.querySelector<HTMLDivElement>('#app')
if (!container) {
  throw new Error('Failed to find #app element')
}

function defineEditorExtension() {
  return union(defineBasicExtension(), defineYoutube())
}

type EditorExtension = ReturnType<typeof defineEditorExtension>

function start() {
  const editor = createEditor<EditorExtension>({
    extension: defineEditorExtension(),
    defaultContent: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello, ProseKit!',
            },
          ],
        },
        {
          type: 'youtube',
          attrs: {
            videoID: 'dQw4w9WgXcQ',
          },
        },
      ],
    },
  })

  editor.mount(container)
}

try {
  start()
} catch (error) {
  container.textContent = 'Failed to start the editor. See console for details.'
  throw error
}
