import {derived} from 'svelte/store'

import state from './state'

export default derived(state, $state => {
  let event = $state.contactListEvent
  let relays = event
    ? event.tags
        .filter(([tag]) => tag === 'r')
        .map(([_, host, policy]) => ({host, policy}))
    : null

  return relays && relays.length
    ? relays
    : [
        {host: 'wss://nostr-relay.herokuapp.com', policy: 'rw'},
        {host: 'wss://moonbreeze.richardbondi.net/ws', policy: 'rw'},
        {host: 'wss://nodestr-relay.dolu.dev/ws', policy: 'rw'},
        {host: 'wss://nostr-relay.bigsun.xyz', policy: 'rw'}
      ]
})
