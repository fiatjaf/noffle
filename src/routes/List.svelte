<script>
  import feed from '../stores/feed'
  import NoteCard from '../components/NoteCard.svelte'
  import {publish} from '../lib/relay'

  let note = ''
  let publishing = false

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
