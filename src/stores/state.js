import {writable, get} from 'svelte/store'
import {getPublicKey, getBlankEvent, makeRandom32} from 'nostr-tools'

import {getOurLatest, getOurNotes} from '../lib/events'
import {publish} from '../lib/relay'

export const secretKey =
  localStorage.getItem('key') || Buffer.from(makeRandom32()).toString('hex')
localStorage.setItem('key', secretKey)

const initialState = {
  pubkey: '',
  metadataEvent: null,
  contactListEvent: null
}

const base = writable(initialState)

export default {
  subscribe: base.subscribe,
  updateFollow: async (action, pubkey) => {
    const {tags} = get(base).contactListEvent
    const newContactListEvent = {
      kind: 3,
      tags,
      content: ''
    }

    switch (action) {
      case 'follow':
        newContactListEvent.tags.push(['p', pubkey, null, null])
        break
      case 'unfollow':
        const index = tags.findIndex(([_t, key, _r, _n]) => key === pubkey)
        newContactListEvent.tags.splice(index, 1)
        break
    }

    await publish(newContactListEvent)

    base.update(state => {
      state.contactListEvent = newContactListEvent
      return state
    })
  },
  initStore: async () => {
    const [
      metadataEvent = getBlankEvent(),
      contactListEvent = getBlankEvent(),
      ourNotes
    ] = await Promise.all([getOurLatest(0), getOurLatest(3), getOurNotes()])

    base.update(state => {
      state.metadataEvent = metadataEvent
      state.contactListEvent = contactListEvent
      state.ourNotes = ourNotes
      state.pubkey = getPublicKey(secretKey)
      return state
    })
  }
}
