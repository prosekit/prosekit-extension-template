import { defineBasicExtension } from '@prosekit/basic'
import { union } from '@prosekit/core'
import { createTestEditor } from '@prosekit/core/test'
import { expect, it } from 'vitest'

import { defineYoutubeSpec } from '../src/index.ts'

function getTestContainerDiv() {
  const id = 'test-container'
  const existing = document.getElementById(id)
  if (existing) {
    existing.innerHTML = ''
    return existing
  }

  const div = document.createElement('div')
  div.id = id
  document.body.appendChild(div)
  return div
}

it('contains youtube node in the ProseMirror schema', () => {
  const extension = union(defineBasicExtension(), defineYoutubeSpec())
  const editor = createTestEditor({ extension })
  const schema = editor.schema
  expect(schema.spec.nodes.get('youtube')).toBeDefined()
})

it('can create a youtube node', () => {
  const extension = union(defineBasicExtension(), defineYoutubeSpec())
  const editor = createTestEditor({ extension })
  const schema = editor.schema
  const youtubeNode = schema.nodes.youtube.create({ videoID: 'abc123' })
  expect(youtubeNode).toBeDefined()
  expect(youtubeNode.attrs.videoID).toBe('abc123')
  expect(() => youtubeNode.check()).not.toThrow()
})

it('can reject invalid youtube node attributes', () => {
  const extension = union(defineBasicExtension(), defineYoutubeSpec())
  const editor = createTestEditor({ extension })
  const schema = editor.schema
  const invalidVideoID = 123456 // Should be a string
  expect(() => {
    const youtubeNode = schema.nodes.youtube.create({ videoID: invalidVideoID })
    youtubeNode.check()
  }).toThrow()
})

it('can render youtube node as an iframe', () => {
  const extension = union(defineBasicExtension(), defineYoutubeSpec())
  const editor = createTestEditor({ extension })
  const n = editor.nodes
  const doc = n.doc(n.paragraph('Paragraph'), n.youtube({ videoID: 'abc123' }))

  const div = getTestContainerDiv()
  const selector = 'iframe[data-prosekit-youtube]'
  expect(document.querySelector(selector)).toBeFalsy()

  editor.mount(div)
  editor.setContent(doc)

  expect(document.querySelector(selector)).toBeTruthy()
})
