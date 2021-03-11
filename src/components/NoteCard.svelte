<script>
    import { humanDate, abbr } from "../lib/helpers";

  export let note
</script>
<style>
    article{
      margin-bottom: 2rem;
    }
    .card-footer {
      display: flex;
      justify-content: center;
      border: none;
  }

  .card-footer > span {
    cursor: pointer;
  }
</style>
<article class="card p-5">
    <header class="card-header is-shadowless">
        <div class="media">
            <figure class="media-left">
                <p class="image is-32x32">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>
                            {abbr(note.pubkey)}
                        </strong>
                        <br>
                            <small>
                                {humanDate(note.created_at)}
                            </small>
                        <br>
                    </p>
                </div>
            </div>
        </div>
    </header>
    <div class="card-content">
        <div class="content">
            {note.content}
        </div>
    </div>
    <footer class="card-footer">
      <span class="icon is-medium">
        <ion-icon name="chatbox-ellipses-sharp"></ion-icon>
      </span>
    </footer>
</article>