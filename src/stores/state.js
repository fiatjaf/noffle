import {writable} from 'svelte/store'
import {getPublicKey, getBlankEvent, makeRandom32} from 'nostr-tools'

import {getOurNotes, getOurLatest, getStoredMetadata} from '../lib/events'
import {cacheMetadata} from '../lib/metadata'
import {publish} from '../lib/relay'

export const secretKey =
  localStorage.getItem('key') || Buffer.from(makeRandom32()).toString('hex')
localStorage.setItem('key', secretKey)
export const pubkey = getPublicKey(secretKey)

const initialState = {
  metadataEvent: getBlankEvent(),
  contactListEvent: getBlankEvent(),
  getStoredMetadata: [],
  ourNotes: []
}

const base = writable(initialState)

export default {
  subscribe: base.subscribe,
  update: base.update,

  async updateMetadata(values) {
    let newMetadataEvent = {
      kind: 0,
      content: JSON.stringify(values)
    }
    await publish(newMetadataEvent)

    cacheMetadata(newMetadataEvent)

    base.update(state => {
      state.metadataEvent = newMetadataEvent
      return state
    })
  },

  async initStore() {
    const [
      metadataEvent = getBlankEvent(),
      contactListEvent = getBlankEvent(),
      ourNotes,
      storedMetadata
    ] = await Promise.all([
      getOurLatest(0),
      getOurLatest(3),
      getOurNotes(),
      getStoredMetadata()
    ])

    base.update(state => {
      state.metadataEvent = metadataEvent
      state.contactListEvent = contactListEvent
      state.ourNotes = ourNotes
      return state
    })

    for (let i = 0; i < storedMetadata.length; i++) {
      cacheMetadata(storedMetadata[i])
    }
  }
}
