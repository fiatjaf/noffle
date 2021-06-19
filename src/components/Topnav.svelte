<script>
  import {push} from 'svelte-spa-router'
  import {keyFromDomain} from 'nostr-tools/nip05'

  import {searchInCachedMetadata} from '../lib/metadata'

  let search = ''
  const keyPress = e => {
    if (e.charCode === 13) searchUser()
  }

  async function searchUser() {
    search = search.trim()
    let key

    if (search.indexOf('.') !== -1) {
      // it's a domain?
      key = await keyFromDomain(search)
    } else if (search.length === 64) {
      key = search
    } else {
      let found = searchInCachedMetadata(search)
      if (found) key = found
      else return
    }

    push(`#/u/${key.trim()}`)
    search = ''
  }
</script>

<header class="header my-2">
  <div class="greet">
    <p class="subtitle">&nbsp;</p>
  </div>
  <div class="control has-icons-left">
    <input
      class="input"
      type="text"
      placeholder="Search..."
      bind:value={search}
      on:keypress={keyPress}
    />
    <span class="icon is-medium is-left">
      <i class="icon ion-md-search" />
    </span>
  </div>
</header>

<style>
  header {
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    align-items: flex-end;
    margin: 0 5px;
  }
</style>
