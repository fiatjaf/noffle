<script>
  import {onMount} from 'svelte'
  import {push} from 'svelte-spa-router'

  import feed from '../stores/feed'
  import NoteCard from '../components/NoteCard.svelte'
  import {publish} from '../lib/relay'

  let note = ''
  let search = ''
  let publishing = false

  onMount(() => {
    console.log('list')
  })

  const keyPress = e => {
    if (e.charCode === 13) searchUser()
  }

  const searchUser = () => {
    // console.log(search, search.length)
    if (search.length !== 64) {
      console.log('Not valid user pubkey!')
      return
    }
    push(`#/u/${search.trim()}`)
    search = ''
  }

  const publishNote = async ev => {
    ev.preventDefault()
    publishing = true

    try {
      await publish({
        tags: [],
        kind: 1,
        content: note.trim()
      })
    } catch (e) {
      console.error('error publishing text note', e)
    }

    note = ''
    publishing = false
  }
</script>

<div class="px-4">
  <header class="header my-2">
    <div class="greet">
      <p class="subtitle">Hello, what's on your mind</p>
    </div>
    <div class="control has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="Search..."
        bind:value={search}
        on:keypress={keyPress}
      />
      <span class="icon is-medium is-left">
        <i class="icon ion-md-search" />
      </span>
    </div>
  </header>
  <div class="post my-5">
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
        on:click={publishNote}
        disabled={publishing}
      >
        Send
      </button>
    </div>
  </div>
  <div class="notes">
    {#each $feed as note}
      <NoteCard {note} />
    {/each}
  </div>
</div>

<style>
  header {
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    align-items: flex-end;
  }
  .post {
    display: grid;
  }
  :global(.textarea) {
    min-height: 4em;
    outline: none;
    resize: none;
    overflow: auto;
    border: none;
    padding: 2rem;
    box-shadow: none;
  }

  :global(.textarea:focus) {
    border: none;
  }

  .textarea:focus {
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
      0 0px 0 1px rgba(10, 10, 10, 0.02);
  }
</style>
