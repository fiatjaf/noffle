import {relayPool, getEventHash} from 'nostr-tools'

import {secretKey, pubkey} from '../stores/state'
import relays from '../stores/relays'
import {saveEvent, updateEvent} from './events'

export const pool = relayPool()

export const initPool = async () => {
  if (secretKey) {
    pool.setPrivateKey(secretKey)
  }



  relays.subscribe(relays => {
    relays.forEach(relay => {
      pool.addRelay(relay.host, parsePolicy(relay.policy))
    })
  })
}

export function parsePolicy(rw) {
  let policy = {}
  if (rw.indexOf('r') !== -1) policy.read = true
  if (rw.indexOf('w') !== -1) policy.write = true
  return policy
}

export const publish = async event => {
  event.pubkey = pubkey
  event.created_at = Math.round(new Date().getTime() / 1000)
  event.tags = event.tags || []
  event.id = await getEventHash(event)

  await saveEvent(event)

  await pool.publish(event, (status, url) => {
    switch (status) {
      case 0:
        console.log(`sent to ${url}`, event)
        break
      case 1:
        console.log(`published to ${url}`, event)
        break
      case -1:
        console.log(`publish failed on ${url}`, event)
        break
    }
    updateEvent(event.id, {[`status."${url}"`]: status})
  })
}
