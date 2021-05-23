import {derived} from 'svelte/store'

import state from './state'

export default derived(state, $state => {
  let metadata = {
    name: null,
    about: null,
    picture: null
  }

  const event = $state.metadataEvent

  if (event) {
    try {
      const content = JSON.parse(event.content)
      metadata = {...metadata, ...content}
    } catch (err) {
      console.log('error parsing our own metadata content', err)
    }
  }

  return metadata
})
