<script>
  import state from '../stores/state'
  import relays from '../stores/relays'
  import following from '../stores/following'

  const configJSON = JSON.stringify(
    {
      key: $state.key,
      following: $following,
      relays: $relays
    },
    null,
    2
  )
</script>

<div class="px-4">
  <header class="my-5">
    <h1 class="title">Settings</h1>
  </header>
  <main class="block">
    <div class="field my-6">
      <div class="control">
        <label>
          Paste a private key
          <input class="input" type="text" placeholder="Private key" />
        </label>
      </div>
      <p class="help">This will reset your Nostr account.</p>
    </div>
    <div class="content my-6">
      <label for="" class="label">Relays</label>
      {#each $relays as relay}
        <div class="columns">
          <div class="column relay-host">
            <p>{relay.host}</p>
          </div>
          <div class="column">
            <div class="field is-grouped right">
              <p class="control">
                <button class="button is-small is-primary">Edit</button>
              </p>
              <p class="control">
                <button class="button is-small is-light">Ignore</button>
              </p>
              <p class="control">
                <button class="button is-small is-light">Recommend</button>
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </main>
  <pre class="help">{configJSON}</pre>
</div>

<style>
  .relay-host {
    overflow-x: auto;
  }

  .right {
    display: flex;
    justify-content: flex-start;
  }

  @media screen and (min-width: 768px) {
    .right {
      justify-content: flex-end !important;
    }
  }
</style>
