<script>
  import {publish} from '../lib/relay'
  import {fly} from 'svelte/transition'
  import metadata from '../stores/metadata'
  import {humanDate, abbr} from '../lib/helpers'
  import {push} from 'svelte-spa-router'

  export let note

  let replying = false
  let replyMsg = ''
  let isReply = note.tags.length
  let originalNote

  if (isReply) {
    originalNote = note.tags[0][1]
  }

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

<article class="card p-5" in:fly={{y: 200, duration: 300}}>
  <header class="card-header is-shadowless">
    <div class="media">
      <figure class="media-left is-clickable">
        <img
          alt="~"
          class="is-48x48 image"
          on:click={() => push(`#/u/${note.pubkey}`)}
          src={$metadata.picture ||
            'https://bulma.io/images/placeholders/128x128.png'}
        />
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong
              class="is-clickable"
              on:click={() => push(`#/u/${note.pubkey}`)}
            >
              {abbr(note.pubkey)}
            </strong>
            <br />
            <small>{humanDate(note.created_at)}</small>
            <br />
            {#if isReply}
              <a href={`#/n/${originalNote}`}>
                <small>In reply to {abbr(originalNote)}</small>
              </a>
            {/if}
          </p>
        </div>
      </div>
    </div>
  </header>
  <div class="card-content">
    <div class="content" on:click={() => push(`#/n/${note.id}`)}>
      {note.content}
    </div>
  </div>
  <footer class="card-footer">
    <span
      class="icon is-medium"
      on:click={() => (replying = !replying)}
      title="Reply"
    >
      <ion-icon name="chatbox-ellipses-sharp" />
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
          <a
            href="_"
            class="button is-ghost"
            on:click|preventDefault={() => sendReply(note.id)}
          >
            Reply
          </a>
        </p>
      </div>
    {/if}
  </footer>
</article>

<style>
  article {
    margin-bottom: 2rem;
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
</style>
