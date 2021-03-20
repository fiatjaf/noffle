<script>
  import {onMount} from 'svelte'
  import state from '../stores/store'
  import {pool} from '../lib/relay'

  let note = ''
  let publishing = false

  onMount(() => {
    console.log('list')
  })

  const publishNote = async ev => {
    ev.preventDefault()
    publishing = true
    const msg = {
      pubkey: state.pubKeyHex($state.key),
      created_at: Math.round(new Date().getTime() / 1000),
      tags: [],
      kind: 1,
      content: note.trim()
    }
    try {
      await pool.publish(msg, (status, url) => {
        if (status === 0) {
          console.log(`publish request sent to ${url}`)
        }
        if (status === 1) {
          console.log(`event published by ${url}`)
        }
      })
    } catch (e) {
      console.error('Something went wrong:', e)
    }
    note = ''
    publishing = false
  }
</script>

<section class="px-4">
  <header class="header my-2">
    <div class="greet">
      <p class="subtitle">Hello, what's on your mind</p>
    </div>
    <div class="control has-icons-left">
      <input class="input" type="text" placeholder="Search..." />
      <span class="icon is-medium is-left">
        <ion-icon name="search-outline" />
      </span>
    </div>
  </header>
  <div class="post mt-5">
    <div class="block">
      <textarea
        class="textarea"
        placeholder="Add a note..."
        bind:value={note}
      />
    </div>
    <div class="block">
      <button
        class="button is-primary is-rounded is-pulled-right button"
        on:click={publishNote}>Send</button
      >
    </div>
  </div>
  {#each $state.home as note}
    <p>{note.content}</p>
  {/each}
  <pre>{JSON.stringify($state, null, 2)}</pre>
</section>

<style>
  header {
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    align-items: flex-end;
  }
  .navbar,
  .navbar-menu {
    background-color: none;
    background: none;
  }

  .textarea {
    min-height: 6em;
    outline: none;
    resize: none;
    overflow: auto;
    border: none;
    padding: 2rem;
  }
</style>
