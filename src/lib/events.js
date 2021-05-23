import Dexie from 'dexie'
import {get} from 'svelte/store'

import state from '../stores/state'

Dexie.debug = true

const db = new Dexie('nostr')

db.version(1).stores({
  events: '&id,pubkey,created_at,kind,*tags'
})

export const getEvent = id => db.events.get(id)
export const delEvent = id => db.events.delete(id)
export const updateEvent = (id, changes) => db.events.update(id, changes)
export const saveEvent = event => db.events.put(event)

export const getOurLatest = async kind => {
  const events = await db.events
    .where({
      kind,
      pubkey: get(state).pubkey
    })
    .reverse()
    .sortBy('created_at')

  if (events.length === 0) return null

  if (kind === 3 || kind === 0) {
    // delete previous
    db.events
      .bulkDelete(events.slice(1).map(({id}) => id))
      .catch(err =>
        console.log(`failed to bulkDelete past ${kind} events.`, err)
      )
  }

  return events[0]
}

export const getOurNotes = () =>
  db.events
    .where({
      kind: 1,
      pubkey: get(state).pubkey
    })
    .reverse()
    .sortBy('created_at')
