<script>
	import state from '../stores/store'
	import {abbr} from '../lib/helpers'

	let pubKey = state.pubKeyHex($state.key)

    function getMeta(key) {
        let meta = $state.metadata.get(key)
        console.log('get')
        return meta
    }

</script>

<section class='px-4'>
	<header class="my-5">
		<h1 class='title'>Following</h1>
	</header>
	<div class="following">
		{#each $state.following.filter(f => f !== pubKey) as follow}
			<div class="block">
				<div class="media">
            <figure class="media-left">
                <p class="image is-64x64">
                    <img class="is-rounded" src={getMeta(follow)?.picture ?? "https://bulma.io/images/placeholders/128x128.png"}/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>Petname</strong>
                        <br>
                            <small>
                                {follow}
                            </small>
                        <br>
                    </p>
                </div>
            </div>
        </div>
			</div>
		{/each}
	</div>
</section>