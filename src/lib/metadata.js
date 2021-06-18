import throttle from 'throttleit'
import {readable} from 'svelte/store'
import {keyFromDomain} from 'nostr-tools/nip05'

import {emptyMetadata} from '../lib/helpers'

const events = {}
const stores = {}
const setters = {}
const domainVerificationCache = {}

export function cacheMetadata(event) {
  events[event.pubkey] = event
  ;(setters[event.pubkey] || []).forEach(async set => {
    let metadata = getMetadata(event.pubkey)
    set(metadata)
    if (metadata.domain) {
      verifyDomain(metadata, event.pubkey, set)
    }
  })
}

const verifyDomain = throttle(async (metadata, pubkey, set) => {
  let domainkey
  if (metadata.domain in domainVerificationCache) {
    domainkey = domainVerificationCache[metadata.domain]
  } else {
    domainkey = await keyFromDomain(metadata.domain)
    domainVerificationCache[metadata.domain] = pubkey
  }

  if (domainkey === pubkey) {
    metadata.domainVerified = true
    set(metadata)
  }
}, 3000)

export function getMetadata(pubkey) {
  try {
    return JSON.parse(getRawMetadataEvent(pubkey).content)
  } catch (err) {
    return null
  }
}

export function getMetadataStore(pubkey) {
  var store = stores[pubkey]
  if (store) return store

  store = readable(emptyMetadata(), set => {
    setters[pubkey] = setters[pubkey] || []
    let index = setters[pubkey].length
    setters[pubkey].push(set)
    return () => {
      setters[pubkey].splice(index, 1)
      if (setters[pubkey].length === 0) delete setters[pubkey]
    }
  })
  stores[pubkey] = store
  return store
}

export function getRawMetadataEvent(pubkey) {
  return events[pubkey]
}

export function checkDomain(pubkey, domain) {}
