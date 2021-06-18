import {writable} from 'svelte/store'
import {getBlankEvent} from 'nostr-tools'

import {pool} from '../lib/relay'
import {cacheMetadata} from '../lib/metadata'
import {
  KIND_TEXTNOTE,
  KIND_METADATA,
  KIND_CONTACTLIST,
  KIND_RECOMMENDSERVER
} from '../constants'

const initial = () => ({
  notes: [],
  metadata: getBlankEvent(),
  contactList: getBlankEvent()
})

let current = initial()
let selected = {pubkey: null, event: null}

const base = writable(current)

const sub = pool.sub({
  cb: (event, _relay) => {
    // not from the selected author or related to the selected event
    if (
      event.pubkey !== selected.pubkey &&
      event.id !== selected.event &&
      event.tags.findIndex(([t, ev]) => t === 'e' && ev === event.id) !== -1
    )
      return

    switch (event.kind) {
      case KIND_TEXTNOTE:
        // we already have this one
        if (current.notes.findIndex(ev => ev.id === event.id) !== -1) return

        current.notes.push(event)
        current.notes = current.notes
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 100)
        base.set(current)
        break
      case KIND_METADATA:
        if (event.created_at > current.metadata.created_at) {
          current.metadata = event
          base.set(current)
        }
        cacheMetadata(event)
        break
      case KIND_CONTACTLIST:
        if (event.created_at > current.contactList.created_at) {
          current.contactList = event
          base.set(current)
        }
        break
    }
  },
  filter: {
    kind: 255 // hopefully with this we will fetch nothing
  }
})

export default {
  subscribe: base.subscribe,

  setPubkey(pubkey) {
    selected = {pubkey}
    current = initial()
    base.set(current)

    setTimeout(
      () =>
        sub.sub({
          filter: [
            {
              author: selected.pubkey,
              kind: KIND_METADATA
            },
            {
              author: selected.pubkey,
              since: Math.round(Date.now() / 1000 - 60 * 60 * 24 * 7),
              kind: KIND_TEXTNOTE
            },
            {
              author: selected.pubkey,
              since: Math.round(Date.now() / 1000 - 60 * 60 * 24 * 7),
              kind: KIND_RECOMMENDSERVER
            },
            {
              author: selected.pubkey,
              kind: KIND_CONTACTLIST
            }
          ]
        }),
      1
    )
  }
}
