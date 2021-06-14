<script>
  import {push} from 'svelte-spa-router'

  import {getMetadata} from '../lib/metadata'
  import following from '../stores/following'
  import {pubkey} from '../stores/state'

  $: profiles = $following
    .filter(f => f !== pubkey)
    .map(pubkey => ({...getMetadata(pubkey), pubkey}))
</script>

<section class="px-4">
  <header class="my-5">
    <h1 class="title">Following</h1>
  </header>
  <div class="following">
    {#each profiles as profile}
      <div class="block">
        <div class="media">
          <figure class="media-left is-clickable">
            <img
              alt=""
              class="is-rounded image is-64x64"
              src={profile.picture ??
                'https://bulma.io/images/placeholders/128x128.png'}
              on:click={() => push(`#/u/${profile.pubkey}`)}
            />
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong
                  class="is-clickable"
                  on:click={() => push(`#/u/${profile.pubkey}`)}
                  >{profile.name || profile.pubkey}</strong
                >
                <br />
                <small>
                  {profile.about || ''}
                </small>
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
