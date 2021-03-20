<script>
  import {onMount, tick} from 'svelte'
  import {idbGetMany} from './lib/db'
  import state from './stores/store'
  import {pool, setRelays, subscribeRelays, validSig} from './lib/relay'
  import Home from './routes/Home.svelte'
  import Optin from './routes/Optin.svelte'

  export let isuser

  const KIND_METADATA = 0
  const KIND_TEXTNOTE = 1
  const KIND_RECOMMENDSERVER = 2
  const KIND_CONTACTLIST = 3

  onMount(async () => {
    if (!isuser) return
    let data = await idbGetMany([
      'following',
      'mynotes',
      'events',
      'contaclist'
    ])
    await state.initStore(data)
    await setRelays()
    await subscribeRelays()
    await state.initApp()
    pool.setPrivateKey($state.key)
    pool.sub({
      cb: (event, relay) => {
        if (event.type === 'error') {
          console.error(event)
        }
        if (!validSig(event)) {
          console.log('received event with invalid signature', event)
          return
        }
        switch (event.kind) {
          case KIND_TEXTNOTE:
            let mynote = event.pubkey === state.pubKeyHex(isuser)
            state.receivedTextNote(event, mynote)
            break
          case KIND_METADATA:
            let meta = JSON.parse(event.content)
            state.receivedMetadata(event.pubkey, meta)
            break
        }
      },
      filter: {
        authors: $state.following
      }
    })
    // console.log($state)
  })
</script>

<main>
  {#if isuser}
    <Home />
  {:else}
    <Optin on:start={() => (isuser = $state.key)} />
  {/if}
</main>
