import {writable, get} from 'svelte/store'
import {getPublicKey, getBlankEvent, makeRandom32} from 'nostr-tools'

import {getOurLatest, getOurNotes} from '../lib/events'
import {publish} from '../lib/relay'

export const secretKey =
  localStorage.getItem('key') || Buffer.from(makeRandom32()).toString('hex')
localStorage.setItem('key', secretKey)
export const pubkey = getPublicKey(secretKey)

const initialState = {
  metadataEvent: getBlankEvent(),
  contactListEvent: getBlankEvent()
}

const base = writable(initialState)

export default {
  subscribe: base.subscribe,

  async updateMetadata(values) {
    const newMetadataEvent = {
      kind: 0,
      content: JSON.stringify(values)
    }
    await publish(newMetadataEvent)

    base.update(state => {
      state.metadataEvent = newMetadataEvent
      return state
    })
  },

  async updateFollow(action, pubkey) {
    const {tags} = get(base).contactListEvent
    const newContactListEvent = {
      kind: 3,
      tags,
      content: ''
    }

    const index = tags.findIndex(([_t, key, _r, _n]) => key === pubkey)
    const updated = true

    switch (action) {
      case 'follow':
        if (index === -1) {
          newContactListEvent.tags.push(['p', pubkey, null, null])
        }
        break
      case 'unfollow':
        if (index !== -1) {
          newContactListEvent.tags.splice(index, 1)
        }
        break
    }

    if (updated) {
      await publish(newContactListEvent)
      base.update(state => {
        state.contactListEvent = newContactListEvent
        return state
      })
    }
  },

  async initStore() {
    const [
      metadataEvent = getBlankEvent(),
      contactListEvent = getBlankEvent(),
      ourNotes
    ] = await Promise.all([getOurLatest(0), getOurLatest(3), getOurNotes()])

    base.update(state => {
      state.metadataEvent = metadataEvent
      state.contactListEvent = contactListEvent
      state.ourNotes = ourNotes
      return state
    })
  }
}
