import './style.css'

import { defineBasicExtension } from '@prosekit/basic'
import { createEditor, union } from '@prosekit/core'

function defineEditorExtension() {
  return union(defineBasicExtension())
}

type EditorExtension = ReturnType<typeof defineEditorExtension>

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
    ],
  },
})

const container = document.querySelector<HTMLDivElement>('#app')
if (!container) {
  throw new Error('Failed to find #app element')
}

editor.mount(container)
