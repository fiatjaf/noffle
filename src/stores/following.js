import {derived} from 'svelte/store'

import state from './state'

export default derived(state, $state => {
  const event = $state.contactListEvent
  const keys = event
    ? event.tags.filter(([tag]) => tag === 'p').map(([_, key]) => key)
    : []
  return keys
})
