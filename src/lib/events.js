import Dexie from 'dexie'

import {pubkey} from '../stores/state'

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
      pubkey
    })
    .reverse()
    .sortBy('created_at')

  if (events.length === 0) return undefined

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
      pubkey
    })
    .reverse()
    .sortBy('created_at')

export const getStoredMetadata = () => db.events.where({kind: 0}).toArray()

export const deleteStoredMetadataFor = async pubkey => {
  let events = await db.events.where({kind: 0}).toArray()
  for (let i = 0; i < events.length; i++) {
    let event = events[i]
    if (event.pubkey === pubkey) {
      await db.bulkDelete([event.id])
    }
  }
}
