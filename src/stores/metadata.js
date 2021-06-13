import {derived} from 'svelte/store'

import state, {pubkey} from './state'
import browsing from './browsing'
import {emptyMetadata} from '../lib/helpers'

const all = {}

export default derived([state, browsing], ([$state, $browsing]) => {
  const event = $state.metadataEvent

  if (event && event.content && event.content !== '') {
    try {
      const content = JSON.parse(event.content)
      all.self = {...emptyMetadata(), ...content}
      all[pubkey] = all.self
    } catch (err) {
      console.log('error parsing our own metadata content', event.content, err)
    }
  }

  if ($browsing.metadata && $browsing.metadata.pubkey) {
    try {
      all[$browsing.metadata.pubkey] = JSON.parse($browsing.metadata.content)
    } catch (err) {
      console.log(
        `error parsing ${$browsing.metadata.pubkey}'s metadata`,
        $browsing.metadata.content,
        err
      )
    }
  }

  for (let pubkey in $state.storedMetadata) {
    all[pubkey] = $state.storedMetadata[pubkey]
  }

  return all
})
