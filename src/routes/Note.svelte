<script>
  import { onMount } from 'svelte'
  import { SortedMap } from 'insort'
  import { push } from 'svelte-spa-router'
  import { pool } from '../lib/relay'
  import { abbr, humanDate } from '../lib/helpers'
  import NoteCard from '../components/NoteCard.svelte'

  export let params

  let s, note, comments
  let replyMsg = ''

  const sendReply = (id) => {
    return
  }

  $: params.note_id, getNote()

  function getNote() {
    comments = []
    let _comments = new SortedMap(comments.map(n => [n.id + ':' + n.created_at, n]), (a, b) => b.split(':')[1] - a.split(':')[1])
    s = pool.sub({
      cb: (event, relay) => {
        if (event.id === params.note_id) {
          note = event
        } else {
          _comments.set(event.id + ':' + event.created_at, event)
          comments = Array.from(_comments.values())
          // console.log(event)
        }
      },
      filter: [{ id: params.note_id }, { '#e': params.note_id }],
    })
    s.unsub()
  }

  onMount(() => {
    getNote()
  })
</script>

<style>
  .card-footer {
    border: none;
  }
</style>

<section>
  {#if note}
    <article class="card p-5 my-5">
      <div class="card-header is-shadowless">
        <div class="media">
          <figure class="media-left pointer">
            <p class="image is-32x32">
              <img
                on:click={() => push(`#/u/${note.pubkey}`)}
                class="is-rounded"
                src="https://bulma.io/images/placeholders/128x128.png" />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong
                  class="pointer"
                  on:click={() => push(`#/u/${note.pubkey}`)}>
                  {abbr(note.pubkey)}
                </strong>
                <br />
                <small>{humanDate(note.created_at)}</small>
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content">
        {note.content}
        <div class="post my-5">
          <div class="block">
            <textarea class='textarea' placeholder='Send a comment...' bind:value={replyMsg}></textarea>
          </div>
        </div>
      </div>
      <div class="card-footer is-justify-content-flex-end">
          <button class='button is-primary is-rounded' on:click={sendReply} >Send</button>
      </div>
    </article>
  {/if}
  {#if comments.length}
    <div class='block'>
      {#each comments as comment}
        <NoteCard note={comment} />
      {/each}
    </div>
  {/if}
  
</section>
