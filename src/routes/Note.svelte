<script>
  import {onMount} from 'svelte'
  import {SortedMap} from 'insort'
  import {push} from 'svelte-spa-router'
  import {pool} from '../lib/relay'
  import {abbr, humanDate} from '../lib/helpers'
  import NoteCard from '../components/NoteCard.svelte'

  export let params

  let s, note, comments, refs
  let replyMsg = ''

  const sendReply = () => {
    return
  }

  let basicFilter = [{id: params.note_id}, {'#e': params.note_id}]
  let hasReceivedNote = false

  function getNote() {
    let cmp = (a, b) => b.split(':')[1] - a.split(':')[1]
    comments = new SortedMap([], cmp)
    refs = new SortedMap([], cmp)
    s = pool.sub({
      cb: (event, _relay) => {
        if (event.id === params.note_id) {
          note = event

          if (!hasReceivedNote) {
            hasReceivedNote = true
            sub.sub({
              filter: basicFilter.concat(
                note.tags.filter(([t]) => t === 'e').map(([_, v]) => v)
              )
            })
          }
        } else if (
          event.id.tags.findIndex(([_, v]) => v === params.note_id) !== -1
        ) {
          comments.set(event.id + ':' + event.created_at, event)
        } else {
          refs.set(event.id + ':' + event.created_at, event)
        }
      },
      filter: basicFilter
    })
  }

  onMount(() => {
    getNote()
    return () => {
      if (s) s.unsub()
    }
  })
</script>

<section>
  {#if refs}
    <div class="block">
      {#each Array.from(refs.values()) as ref}
        <NoteCard note={ref} />
      {/each}
    </div>
  {/if}
  {#if note}
    <article class="card p-5 my-5">
      <div class="card-header is-shadowless">
        <div class="media">
          <figure class="media-left pointer">
            <p class="image is-32x32">
              <img
                alt=""
                on:click={() => push(`#/u/${note.pubkey}`)}
                class="is-rounded"
                src="https://bulma.io/images/placeholders/128x128.png"
              />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong
                  class="pointer"
                  on:click={() => push(`#/u/${note.pubkey}`)}
                >
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
            <textarea
              class="textarea"
              placeholder="Send a comment..."
              bind:value={replyMsg}
            />
          </div>
        </div>
      </div>
      <div class="card-footer is-justify-content-flex-end">
        <button class="button is-primary is-rounded" on:click={sendReply}
          >Send</button
        >
      </div>
    </article>
  {/if}
  {#if comments}
    <div class="block">
      {#each Array.from(comments.values()) as comment}
        <NoteCard note={comment} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .card-footer {
    border: none;
  }
</style>
