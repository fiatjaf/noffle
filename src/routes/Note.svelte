<script>
  import {onDestroy} from 'svelte'
  import {SortedMap} from 'insort'
  import {pool} from '../lib/relay'
  import NoteCard from '../components/NoteCard.svelte'

  export let params

  let s, note, comments, refs

  let basicFilter = [{id: params.note_id}, {'#e': params.note_id}]
  let hasReceivedNote = false

  $: {
    console.log('note changed', params.note_id)
    if (s) s.unsub()
    if (params.note_id) getNote()
  }

  onDestroy(() => {
    if (s) s.unsub()
  })

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
            s.sub({
              filter: basicFilter.concat(
                note.tags.filter(([t]) => t === 'e').map(([_, v]) => ({id: v}))
              )
            })
          }
        } else if (
          event.tags.findIndex(([_, v]) => v === params.note_id) !== -1
        ) {
          comments.set(event.id + ':' + event.created_at, event)
          comments = comments
        } else if (
          note &&
          note.tags.findIndex(([_, v]) => v === event.id) !== -1
        ) {
          refs.set(event.id + ':' + event.created_at, event)
          refs = refs
        }
      },
      filter: basicFilter
    })
  }
</script>

<section>
  {#if refs}
    <div class="block">
      {#each Array.from(refs.values()) as ref}
        <NoteCard note={ref} ref />
      {/each}
    </div>
  {/if}
  {#if note}
    <NoteCard {note} />
  {/if}
  {#if comments}
    <div class="block">
      {#each Array.from(comments.values()) as comment}
        <NoteCard note={comment} ref />
      {/each}
    </div>
  {/if}
</section>

<style>
  .card-footer {
    border: none;
  }
</style>
