import {readable, get} from 'svelte/store'

import {pubkey} from '../stores/state'
import {pool} from '../lib/relay'
import following from './following'
import {KIND_TEXTNOTE} from '../constants'

let current = []

export default readable([], set => {
  const feed = pool.sub({
    cb: (event, _relay) => {
      switch (event.kind) {
        case KIND_TEXTNOTE:
          current.push(event)
          current.sort((a, b) => b.created_at - a.created_at)
          current = current.slice(0, 100)
          set(current)
          break
      }
    },
    filter: {
      authors: addOurOwnKey(get(following))
    }
  })

  following.subscribe(keys => feed.sub({filter: {authors: addOurOwnKey(keys)}}))
})

function addOurOwnKey(keys) {
  if (keys.indexOf(pubkey) === -1) keys.push(pubkey)
  return keys
}
