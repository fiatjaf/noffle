import {readable, get} from 'svelte/store'

import {pubkey} from '../stores/state'
import {pool} from '../lib/relay'
import following from './following'
import {KIND_TEXTNOTE, KIND_METADATA} from '../constants'

let current = []

export default readable([], set => {
  const feed = pool.sub({
    cb: (event, _relay) => {
      switch (event.kind) {
        case KIND_METADATA:
          break
        case KIND_TEXTNOTE:
          // we already have this one
          if (current.findIndex(ev => ev.id === event.id) !== -1) return

          current.push(event)
          current.sort((a, b) => b.created_at - a.created_at)
          current = current.slice(0, 100)
          set(current)
          break
        default:
          console('got event of unhandled kind', event)
      }
    },
    filter: {
      authors: addOurOwnKey(get(following)),
      since: Math.round(Date.now() / 1000 - 60 * 60 * 24 * 7)
    }
  })

  following.subscribe(keys => feed.sub({filter: {authors: addOurOwnKey(keys)}}))
})

function addOurOwnKey(keys) {
  if (keys.indexOf(pubkey) === -1) keys.push(pubkey)
  return keys
}
