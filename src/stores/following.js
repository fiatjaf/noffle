import {derived} from 'svelte/store'

import state from './state'

export default derived(state, $state => {
  const event = $state.metadataEvent
  const keys = event
    ? event.tags.filter(([tag]) => tag === 'p').map(([_, key]) => key)
    : []
  return keys.map(key => ({
    ...$state.storedMetadata[key],
    pubkey: key
  }))
})
