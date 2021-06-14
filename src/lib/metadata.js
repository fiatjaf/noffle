const events = {}

export function cacheMetadata(event) {
  events[event.pubkey] = event
}

export function getMetadata(pubkey) {
  try {
    return JSON.parse(getRawMetadataEvent(pubkey).content)
  } catch (err) {
    return null
  }
}

export function getRawMetadataEvent(pubkey) {
  return events[pubkey]
}
