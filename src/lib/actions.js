import {get} from 'svelte/store'

import {publish} from './relay'
import {saveEvent, deleteStoredMetadataFor} from './events'
import {cacheMetadata, getRawMetadataEvent} from './metadata'
import state from '../stores/state'

export async function updateFollow(action, pubkey) {
  let {tags} = get(state).contactListEvent
  let newContactListEvent = {
    kind: 3,
    tags,
    content: ''
  }

  let index = tags.findIndex(([_t, key, _r, _n]) => key === pubkey)
  let updated = true

  switch (action) {
    case 'follow':
      if (index === -1) newContactListEvent.tags.push(['p', pubkey, null, null])
      let event = getRawMetadataEvent(pubkey)
      if (event) await saveEvent(event)
      break
    case 'unfollow':
      if (index !== -1) newContactListEvent.tags.splice(index, 1)
      await deleteStoredMetadataFor(pubkey)
      break
  }

  if (updated) {
    await publish(newContactListEvent)
    state.update(state => {
      state.contactListEvent = newContactListEvent
      return state
    })
  }
}

export async function updateMetadata(values) {
  let newMetadataEvent = {
    kind: 0,
    content: JSON.stringify(values)
  }
  await publish(newMetadataEvent)

  cacheMetadata(newMetadataEvent)

  state.update(state => {
    state.metadataEvent = newMetadataEvent
    return state
  })
}
