import { defineNodeSpec, union } from '@prosekit/core'

export interface YoutubeAttrs {
  videoID: string
}

export function defineYoutubeSpec() {
  return defineNodeSpec<'youtube', YoutubeAttrs>({
    name: 'youtube',
    group: 'block',
    attrs: {
      videoID: { default: '', validate: 'string' },
    },
    defining: true,
    parseDOM: [
      // TODO
    ],
    toDOM(node) {
      const attrs = node.attrs as YoutubeAttrs
      return [
        'iframe',
        {
          type: 'text/html',
          width: 640,
          height: 360,
          frameborder: 0,
          src: `https://www.youtube.com/embed/${attrs.videoID}`,
          'data-prosekit-youtube': '',
        },
      ]
    },
  })
}

export function defineYoutube() {
  return union(defineYoutubeSpec())
}
