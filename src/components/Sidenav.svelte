<script>
  import state from "../stores/store"
  import { abbr } from "../lib/helpers"

  let pubKey = state.pubKeyHex($state.key)
</script>

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
    padding: 1rem;
    height: 100vh;
    overflow-y: scroll;
    color: #fff;
  }
</style>

<aside>
  <div class="block">
    <h2 class="title">Crude</h2>
  </div>
  <div class="block">
    <div class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img class='is-rounded' src="https://bulma.io/images/placeholders/128x128.png" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>John Smith</strong>
            <br>
            <small>{abbr(pubKey)}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="block">
    <div class="menu">
      <ul class="menu-list">
        <li><a href={`#/${pubKey}`}>Profile</a></li>
        <li><a href='#/'>News</a></li>
        <li><a>Following</a></li>
        <br>
        <li><a href="#/">Settings</a></li>
      </ul>
    </div>
  </div>
</aside>
