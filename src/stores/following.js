import {derived} from 'svelte/store'

import state from './state'

export default derived(state, $state => {
  const event = $state.metadataEvent

  if (event) {
    return event.tags.filter(([tag]) => tag === 'p').map(([_, key]) => key)
  } else {
    return []
  }
})
