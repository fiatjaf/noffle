<script>
	import { beforeUpdate, onMount } from 'svelte'
	import state from '../stores/store'
	import { abbr } from '../lib/helpers'
	import { pool } from '../lib/relay'

	export let params
	let self, following, followButton //= params.profile === state.pubKeyHex($state.key)

	onMount(() => {
		pool.sub({
			cb: (event) => {
				console.log(event)
			},
			filter: {
				author: params.profile
			}
		})
	})
	

	beforeUpdate(() => {
		self = params.profile === state.pubKeyHex($state.key)
		following = $state.following.includes(params.profile)
		followButton = following ? 'Unfollow' : 'Follow'
	})

	const handleFollow = (ev) => {
		ev.preventDefault()
		state.updateFollow(followButton.toLowerCase(), params.profile)
	}


</script>

<style>
		
</style>

<section class='px-4'>
	<header class="my-5">
		<h1 class='title'>Profile</h1>
		<p class="subtitle">{self}</p>
		<span class="icon-text">
		  <span>{params.profile}</span>
		  	{#if self}
			  <span class="icon">
			    <ion-icon name="pencil-sharp"></ion-icon>
			  </span>
		  	{/if}
		</span>
	</header>
	{#if self}
		<form>
			<div class="field">
			  <label class="label">Avatar</label>
			  <div class="control">
			    <input class="input" type="text" placeholder="Picture URL" />
			  </div>
			</div>
			<div class="field">
			  <label class="label">Nickname</label>
			  <div class="control">
			    <input class="input" type="text" placeholder="Nickname" />
			  </div>
			</div>
			<div class="field">
			  <label class="label">Bio</label>
			  <div class="control">
			    <textarea class="textarea" placeholder="Something about you..." />
			  </div>
			</div>
		</form>
	{:else}
		<div class="block">
			<button class="button primary" on:click={handleFollow}>{followButton}</button>
		</div>
	{/if}
	<pre>{JSON.stringify($state, null, 2)}</pre>
</section>