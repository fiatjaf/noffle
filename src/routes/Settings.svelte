<script>
  import state from '../stores/store'
  import {idbGet} from '../lib/db'

  async function accountJSON() {
    const relays = await idbGet('relays')
    return {
      key: $state.key,
      following: $state.following,
      relays
    }
  }
</script>

<div class="px-4">
  <header class="my-5">
    <h1 class="title">Settings</h1>
  </header>
  <main class="block">
    <div class="field">
      <label class="label">Import a private key</label>
      <div class="control">
        <input class="input" type="text" placeholder="Private key" />
      </div>
      <p class="help">This will reset your Nostr account</p>
    </div>
    <div class="field">
      <div class="field-body">
        <div class="field">
          <label class="label">Import/Export account</label>
          <div class="control">
            <div class="file">
              <label class="file-label">
                <input class="file-input" type="file" name="resume" />
                <span class="file-cta">
                  <span class="file-icon">
                    <ion-icon name="cloud-upload-sharp" />
                  </span>
                  <span class="file-label"> Choose a file… </span>
                </span>
              </label>
            </div>
          </div>
          <div class="field">
            <button class="button">Download</button>
          </div>
        </div>
      </div>
    </div>
  </main>
  {#await accountJSON() then json}
    <pre>{JSON.stringify(json, null, 2)}</pre>
  {/await}
</div>
