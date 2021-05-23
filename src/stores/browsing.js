import {writable} from 'svelte/store'

import {pool} from '../lib/relay'
import {KIND_TEXTNOTE, KIND_METADATA} from '../constants'

let current = []

const base = writable(current)

const sub = pool.sub({
  cb: (event, _relay) => {
    switch (event.kind) {
      case KIND_TEXTNOTE:
        current.push(event)
        current.sort((a, b) => b.created_at - a.created_at)
        current = current.slice(0, 100)
        base.set(current)
        break
      case KIND_METADATA:
        break
    }
  },
  filter: {
    kind: -1 // hopefully with this we will fetch nothing
  }
})

export default {
  subscribe: base.subscribe,
  setFilter(filter) {
    sub.sub({filter})
  }
}
