<script>
  import state from '../stores/state'
  import {relays} from '../lib/relay'
</script>

<div class="px-4">
  <header class="my-5">
    <h1 class="title">Settings</h1>
  </header>
  <main class="block">
    <div class="field my-6">
      <div class="control">
        <label>
          Import a private key
          <input class="input" type="text" placeholder="Private key" />
        </label>
      </div>
      <p class="help">This will reset your Nostr account</p>
    </div>
    <div class="field my-6">
      <div class="columns">
        <div>
          Import/Export account
          <div class="column">
            <div class="file is-normal">
              <label class="file-label">
                <input class="file-input" type="file" name="resume" />
                <span class="file-cta">
                  <span class="file-icon">
                    <ion-icon name="cloud-upload-sharp" />
                  </span>
                  <span class="file-label">Upload</span>
                </span>
              </label>
            </div>
            <p class="help">Upload JSON backup</p>
          </div>
        </div>
        <div class="column">
          <button class="button">
            <span class="icon">
              <ion-icon name="cloud-download-sharp" />
            </span>
            <span>Download</span>
          </button>
          <p class="help">Download JSON account backup</p>
        </div>
      </div>
    </div>
    <div class="content my-6">
      <label for="" class="label">Relays</label>
      {#each relays as relay}
        <div class="columns">
          <div class="column relay-host">
            <p>{relay.host}</p>
          </div>
          <!-- <div class="column is-1" /> -->
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
  <pre
    class="help">{JSON.stringify( {
      key: $state.key,
      following: $state.following,
      relays
} , null, 2)}</pre>
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
