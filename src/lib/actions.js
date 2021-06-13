import {get} from 'svelte/store'

import {publish} from './relay'
import {saveEvent, deleteStoredMetadataFor} from './events'
import state from '../stores/state'
import metadata from '../stores/metadata'

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
      let event = get(metadata)[pubkey]
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
