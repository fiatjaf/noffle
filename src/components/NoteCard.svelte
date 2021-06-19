<script>
  import {fly} from 'svelte/transition'

  import {publish} from '../lib/relay'
  import {getMetadataStore} from '../lib/metadata'
  import {humanDate, abbr} from '../lib/helpers'
  import ProfileName from './ProfileName.svelte'

  export let note
  export let ref = false

  let inReplyTo = note.tags.find(
    ([tag, id]) => tag === 'e' && typeof id === 'string'
  )
  let replying = false
  let replyMsg = ''

  $: author = getMetadataStore(note && note.pubkey)

  const sendReply = id => {
    try {
      publish({
        tags: [['e', id]],
        kind: 1,
        content: replyMsg.trim()
      })
    } catch (e) {
      console.error('error publishing reply', e)
    }
    replyMsg = ''
    replying = false
  }
</script>

<article class="card p-3" class:ref in:fly={{y: 200, duration: 300}}>
  <header class="card-header is-shadowless">
    <div class="media">
      <figure class="media-left">
        <a href={`#/u/${note.pubkey}`}>
          <img
            alt="~"
            class="image"
            class:is-48x48={!ref}
            class:is-24x24={ref}
            src={$author.picture ||
              'https://bulma.io/images/placeholders/128x128.png'}
          />
        </a>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <ProfileName meta={$author} />
            <a class="abbr" href={`#/u/${note.pubkey}`}>
              <strong>
                {note.pubkey}
              </strong>
            </a>
            <small>
              <a href={`#/n/${note.id}`}>
                {humanDate(note.created_at)}
              </a>
            </small>
            <br />
            {#if inReplyTo}
              <a href={`#/n/${inReplyTo[1]}`}>
                <small>In reply to {abbr(inReplyTo[1])}</small>
              </a>
            {/if}
          </p>
        </div>
      </div>
    </div>
  </header>
  <div class="card-content">
    <div class="content">
      {note.content}
    </div>
  </div>
  {#if !ref}
    <footer class="card-footer">
      <span
        class="icon is-medium"
        on:click={() => (replying = !replying)}
        title="Reply"
      >
        <i class="icon ion-md-chatboxes" />
      </span>
      {#if replying}
        <div class="field is-grouped">
          <p class="control is-expanded">
            <textarea
              class="textarea reply"
              placeholder="Send a reply..."
              bind:value={replyMsg}
            />
          </p>
          <p class="control">
            <button
              class="button"
              on:click|preventDefault={() => sendReply(note.id)}
            >
              Reply
            </button>
          </p>
        </div>
      {/if}
    </footer>
  {/if}
</article>

<style>
  article {
    margin-bottom: 2rem;
  }

  a {
    color: inherit;
  }

  .ref {
    box-shadow: none;
    margin: 0 20px;
    background-color: #f8f8f8;
    border: 1px dotted black;
    font-size: 70%;
  }

  .card-footer {
    display: flex;
    align-items: center;
    border: none;
    justify-content: flex-end;
  }
  .card-footer > span {
    cursor: pointer;
  }
  .card-content {
    word-break: break-all;
  }
  .ref .card-content {
    padding: 0.25rem;
  }

  :global(.card-footer > .field) {
    width: 100%;
    align-items: flex-end;
  }

  :global(.reply) {
    min-height: 4rem;
    overflow: hidden;
    resize: vertical;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid gray;
    box-shadow: none;
  }

  .abbr {
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
</style>
