import {derived} from 'svelte/store'

import state from './state'

export default derived(state, $state => {
  let metadata = {
    name: null,
    about: null,
    picture: null
  }

  const event = $state.metadataEvent

  if (event && event.content && event.content !== '') {
    try {
      const content = JSON.parse(event.content)
      metadata = {...metadata, ...content, exists: true}
    } catch (err) {
      console.log('error parsing our own metadata content', event.content, err)
    }
  }

  return metadata
})
