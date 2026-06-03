import { defineNodeSpec, defineNodeView, union } from '@prosekit/core'

export interface YoutubeAttrs {
  videoID: string
}

export function defineYoutubeSpec() {
  return defineNodeSpec<'youtube', YoutubeAttrs>({
    name: 'youtube',
    group: 'block',
    inline: false,
    attrs: {
      videoID: { default: '', validate: 'string' },
    },
    defining: true,

    parseDOM: [
      {
        tag: 'a[data-prosekit-youtube]',
        priority: 100,
        getAttrs(element) {
          const videoID = element.getAttribute('data-prosekit-youtube')
          if (!videoID) {
            return false
          } else {
            return { videoID } satisfies YoutubeAttrs
          }
        },
      },
      {
        tag: 'iframe[data-prosekit-youtube]',
        getAttrs(element) {
          const videoID = element.getAttribute('data-prosekit-youtube')
          if (!videoID) {
            return false
          } else {
            return { videoID } satisfies YoutubeAttrs
          }
        },
      },
      {
        tag: 'a',
        priority: 100,
        getAttrs(element) {
          const url = element.getAttribute('href') || ''
          const match = url.match(
            /https?:\/\/www\.youtube\.com\/embed\/([^/?]+)/,
          )
          if (match && match[1]) {
            const videoID = match[1]
            return { videoID } satisfies YoutubeAttrs
          } else {
            return false
          }
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as YoutubeAttrs
      const url = `https://www.youtube.com/embed/${attrs.videoID}`
      return ['a', { href: url, 'data-prosekit-youtube': attrs.videoID }]
    },
    leafText(node) {
      const attrs = node.attrs as YoutubeAttrs
      const url = `https://www.youtube.com/embed/${attrs.videoID}`
      return url
    },
  })
}

export function defineYoutubeNodeView() {
  return defineNodeView({
    name: 'youtube',
    constructor(node, view) {
      const attrs = node.attrs as YoutubeAttrs
      const url = `https://www.youtube.com/embed/${attrs.videoID}`
      const document = view.dom.ownerDocument
      const iframe = document.createElement('iframe')
      iframe.setAttribute('type', 'text/html')
      iframe.setAttribute('src', url)
      iframe.setAttribute('height', '360')
      iframe.setAttribute('width', '640')
      iframe.setAttribute('data-prosekit-youtube', attrs.videoID)
      iframe.setAttribute('frameborder', '0')
      return {
        dom: iframe,
      }
    },
  })
}

export function defineYoutube() {
  return union(defineYoutubeSpec(), defineYoutubeNodeView())
}
