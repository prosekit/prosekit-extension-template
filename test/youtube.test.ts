import { defineBasicExtension } from '@prosekit/basic'
import { isApple, union } from '@prosekit/core'
import { createTestEditor } from '@prosekit/core/test'
import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { defineYoutubeSpec } from '../src/index.ts'

import {
  getTestContainerDiv,
  readHtmlTextFromClipboard,
  readPlainTextFromClipboard,
} from './utils.ts'

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
  editor.unmount()
})

it('can copy a youtube node as a link', async () => {
  const extension = union(defineBasicExtension(), defineYoutubeSpec())
  const editor = createTestEditor({ extension })
  const n = editor.nodes
  const doc = n.doc(
    n.paragraph('Paragraph 1'),
    n.youtube({ videoID: 'foo' }),
    n.paragraph('Paragraph 2'),
  )

  const div = getTestContainerDiv()
  const selector = 'iframe[data-prosekit-youtube]'
  expect(document.querySelector(selector)).toBeFalsy()

  editor.mount(div)
  editor.setContent(doc)
  editor.focus()

  const mod = isApple ? 'Meta' : 'Control'
  await userEvent.keyboard(`{${mod}>}a{/${mod}}`) // Select all
  await userEvent.keyboard(`{${mod}>}a{/${mod}}`) // Select all
  await userEvent.keyboard(`{${mod}>}c{/${mod}}`) // Copy

  expect(await readPlainTextFromClipboard()).toMatchInlineSnapshot(`
    "Paragraph 1

    Paragraph 2"
  `)
  expect(await readHtmlTextFromClipboard()).toMatchInlineSnapshot(`
    "
    <meta charset="utf-8">
    <p data-pm-slice="0 0 []">
      Paragraph 1
    </p>
    <iframe
      data-prosekit-youtube
      frameborder="0"
      height="360"
      src="https://www.youtube.com/embed/foo"
      type="text/html"
      width="640"
    >
    </iframe>
    <p>
      Paragraph 2
    </p>
    "
  `)

  editor.unmount()
})
