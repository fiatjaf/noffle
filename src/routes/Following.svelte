<script>
  import following from '../stores/following'
  import {pubkey} from '../stores/state'
</script>

<section class="px-4">
  <header class="my-5">
    <h1 class="title">Following</h1>
  </header>
  <div class="following">
    {#each $following.filter(f => f.pubkey !== pubkey) as follow}
      <div class="block">
        <div class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img
                alt=""
                class="is-rounded"
                src={follow.picture ??
                  'https://bulma.io/images/placeholders/128x128.png'}
              />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Petname</strong>
                <br />
                <small>
                  {follow}
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
