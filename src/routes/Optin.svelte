<script>
  import {createEventDispatcher} from 'svelte'
  import {pool, setRelays, getNewKey, subscribeRelays} from '../lib/relay'
  import {idbGetMany, initDB} from '../lib/db'
  import state from '../stores/store'
  // import Sidenav from '../components/Sidenav.svelte'
  // import List from '../components/List.svelte'
  // import Profile from '../routes/Profile.svelte'

  const dispatch = createEventDispatcher()

  async function initialize() {
    await initDB()
    await setRelays()
    const key = getNewKey()
    state.setKey(key)
    await subscribeRelays()
    let data = await idbGetMany([
      'following',
      'mynotes',
      'events',
      'contaclist'
    ])
    state.initStore(data)
    state.initApp()
    dispatch('start')
    // push('#/')
  }
</script>

<section class="hero is-fullheight">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="column is-6 is-offset-3">
        <h1 class="title">CRUDE</h1>
        <h2 class="subtitle">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam,
          rerum? ☰
        </h2>
        <div class="buttons">
          <button class="button is-outlined">
            <span class="icon is-small">
              <ion-icon name="logo-github" />
            </span>
            <span>Nostr</span>
          </button>
          <button class="button is-success" on:click={initialize}>
            I'm in
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .is-fullheight {
    background: #659999;
    background: linear-gradient(45deg, #f4791f, #659999);
    background-size: cover;
  }

  .title,
  .subtitle {
    color: #fff;
  }

  .subtitle {
    padding: 3rem 0;
    line-height: 1.5;
  }
  .buttons {
    justify-content: center;
  }

  .buttons > .button {
    margin-right: 1rem;
  }
  .is-outlined {
    background: none;
    color: #fff;
  }
</style>
