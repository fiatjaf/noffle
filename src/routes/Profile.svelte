<script>
	import { beforeUpdate, onMount } from 'svelte'
	import { SortedMap } from "insort";
	import state from '../stores/store'
	import { abbr } from '../lib/helpers'
	import { pool } from '../lib/relay'
	import NoteCard from '../components/NoteCard.svelte'

	export let params

	let self, following, followButton  //= params.profile === state.pubKeyHex($state.key)
	let _notes = new SortedMap()
	let notes = []

	function makeArray(n) {
		return Array.from(n.values())
	}

	onMount(() => {
		_notes = new SortedMap(notes.map(n => [n.id + ':' + n.created_at, n]), (a, b) => b.split(':')[1] - a.split(':')[1])
		const s = pool.sub({
			cb: (event) => {
				_notes.set(event.id + ':' + event.created_at, event)
				notes = makeArray(_notes)
				// console.log(_notes)
			},
			filter: {
				author: params.profile
			}
		})
		s.unsub()
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
		<form class='my-5'>
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
	<div class="block my-5">
		<h2 class="subtitle">Notes</h2>
		{#each notes as note}
			<NoteCard {note} />
		{/each}
	</div>
</section>