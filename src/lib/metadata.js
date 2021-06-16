import {readable} from 'svelte/store'

import {emptyMetadata} from '../lib/helpers'

const events = {}
const setters = {}

export function cacheMetadata(event) {
  events[event.pubkey] = event
  ;(setters[event.pubkey] || []).forEach(set => {
    set(getMetadata(event.pubkey))
  })
}

export function getMetadata(pubkey) {
  try {
    return JSON.parse(getRawMetadataEvent(pubkey).content)
  } catch (err) {
    return null
  }
}

export function getMetadataStore(pubkey) {
  return readable(emptyMetadata(), set => {
    setters[pubkey] = setters[pubkey] || []
    let index = setters[pubkey].length
    setters[pubkey].push(set)
    return () => {
      setters[pubkey].splice(index, 1)
      if (setters[pubkey].length === 0) delete setters[pubkey]
    }
  })
}

export function getRawMetadataEvent(pubkey) {
  return events[pubkey]
}
