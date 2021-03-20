<script>
  import {beforeUpdate, onMount} from 'svelte'
  import {SortedMap} from 'insort'
  import state from '../stores/store'
  import {abbr, sanitizeString} from '../lib/helpers'
  import {pool} from '../lib/relay'
  import NoteCard from '../components/NoteCard.svelte'

  export let params

  let self, following, followButton, picUrl, bio, petname //= params.profile === state.pubKeyHex($state.key)
  let _notes = new SortedMap()
  let notes = []
  let editMeta = null

  // console.log($state.metadata.get(params.profile))

  $: metadata = $state.metadata.get(params.profile)

  // $: picUrl, console.log(picUrl)
  // $: bio, console.log(bio)
  // $: petname, console.log(petname)

  function makeArray(n) {
    return Array.from(n.values())
  }

  async function setMetadata(e) {
    e.preventDefault()
    editMeta = {}
    if (picUrl) editMeta.picture = window.encodeURI(picUrl.trim())
    if (bio) editMeta.about = sanitizeString(bio)
    if (petname) editMeta.name = sanitizeString(petname)
    console.log(editMeta)
    let evObj = {
      pubkey: $state.pubKeyHex,
      created_at: Math.round(new Date().getTime() / 1000),
      kind: 0,
      content: JSON.stringify(editMeta)
    }
    try {
      await pool.publish(evObj, (status, url) => {
        if (status === 0) {
          console.log(`publish request sent to ${url}`)
        }
        if (status === 1) {
          console.log(`event published by ${url}`, ev)
        }
      })
    } catch (e) {
      console.error(e)
    }
    editMeta = null
  }

  onMount(async () => {
    _notes = new SortedMap(
      notes.map(n => [n.id + ':' + n.created_at, n]),
      (a, b) => b.split(':')[1] - a.split(':')[1]
    )
    const s = pool.sub({
      cb: event => {
        if (event.kind !== 1) return
        _notes.set(event.id + ':' + event.created_at, event)
        notes = makeArray(_notes)
        // console.log(_notes)
      },
      filter: {
        author: params.profile
      }
    })
    s.unsub()
  })

  beforeUpdate(() => {
    self = params.profile === state.pubKeyHex($state.key)
    following = $state.following.includes(params.profile)
    // metadata = $state.metadata.get(params.profile)
    followButton = following ? 'Unfollow' : 'Follow'
  })

  const handleFollow = ev => {
    ev.preventDefault()
    state.updateFollow(followButton.toLowerCase(), params.profile)
  }
</script>

<div class="px-4">
  <header class="block my-5">
    <h1 class="title">Profile</h1>
    <p class="subtitle">{metadata?.name ?? 'Anon'}</p>
    <p>{metadata?.about ?? ''}</p>
    <span class="icon-text">
      <span>{params.profile}</span>
      {#if self}
        <span class="icon">
          <ion-icon name="person-circle-sharp" />
        </span>
      {/if}
    </span>
  </header>
  {#if self}
    <div class="block">
      <form>
        <div class="field">
          <label class="label">Avatar</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Picture URL"
              bind:value={picUrl}
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Nickname</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Nickname"
              bind:value={petname}
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Bio</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Something about you..."
              bind:value={bio}
            />
          </div>
        </div>
      </form>
    </div>
    <div class="block right">
      <button class="button is-primary" on:click={setMetadata}>Save</button>
    </div>
  {:else}
    <div class="block">
      <button class="button primary" on:click={handleFollow}
        >{followButton}</button
      >
    </div>
  {/if}
  <div class="block my-5">
    <h2 class="subtitle">Notes</h2>
    {#each notes as note}
      <NoteCard {note} />
    {/each}
  </div>
</div>

<style>
  .right {
    display: flex;
    flex-flow: row-reverse;
  }
</style>
