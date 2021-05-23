<script>
  import metadata from '../stores/metadata'
  import following from '../stores/following'
  import {pubkey} from '../stores/state'
  import {abbr} from '../lib/helpers'
</script>

<aside>
  <div class="block">
    <h2 class="title has-text-light">Nostrept</h2>
  </div>
  <div class="block">
    <div class="media">
      <figure class="media-left">
        <img
          alt="~"
          class="is-64x64 image"
          src={$metadata.picture ||
            'https://bulma.io/images/placeholders/128x128.png'}
        />
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong class="has-text-light">{$metadata.name || 'Anon'}</strong>
            <br />
            <small>{abbr(pubkey)}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="block">
    <div class="menu">
      <ul class="menu-list">
        <li>
          <a class="has-text-light" href={`#/u/${pubkey}`}>Profile</a>
        </li>
        <li><a class="has-text-light" href="#/">News</a></li>
        <li>
          <a class="has-text-light" href="#/following">
            Following
            {#if $following.length > 1}
              <sup class="tag is-info is-light ml-2"
                >{$following.length - 1}</sup
              >
            {/if}
          </a>
        </li>
        <br />
        <li><a class="has-text-light" href="#/settings">Settings</a></li>
      </ul>
    </div>
  </div>
</aside>

<style>
  /* width */
  ::-webkit-scrollbar {
    width: 3px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  aside {
    position: relative;
    padding: 1rem;
    height: 100vh;
    overflow: hidden;
    color: #fff;
  }
  @media screen and (min-width: 768px) {
    aside {
      position: fixed;
    }
  }
</style>
