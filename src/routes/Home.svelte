<script>
	import { onMount } from 'svelte'
  import { fly } from 'svelte/transition';
	import Router, { push } from 'svelte-spa-router'
	import state from '../stores/store'
	// import { pool } from '../lib/relay'
	import List from './List.svelte'
  import Note from './Note.svelte'
	import Profile from './Profile.svelte'
  import Following from './Following.svelte'
  import Settings from './Settings.svelte'
	import Sidenav from '../components/Sidenav.svelte'

	let sidenav

  onMount(() => {
    console.log('home')
    
  })

	const toggleNav = () => {
    sidenav.classList.toggle('open')
  }

	const routes = {
    '/': List,
    '/following': Following,
    '/n/:note_id': Note,
    '/u/:profile': Profile,
    '/settings': Settings,


    // Catch-all route last
    // '*': NotFound,
  }

</script>
<style>
  :global(.pointer) {
    cursor: pointer;
  }

  :global(.base-grid) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: 'main';
  }

  :global(.sidenav) {
    position: fixed;
    left: -100%;
    transition: left 0.3s ease-in-out;
    background: #1a546d;
    z-index: 100;
    overflow-x: hidden;
    width: 300px;
  }

  #main {
    grid-area: main;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :global(.open) {
    left: 0;
    /* grid-template-columns: minmax(auto, 0.3fr) 1fr; */
  }

  .float {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    font-size: 1.5rem;
    color: #fff;
  }


  @media screen and (min-width: 768px) {
    .base-grid {
      grid-template-columns: minmax(min-content, 300px) 1fr;
      grid-template-areas: 'sidenav main';
    }
    
    #sidenav {
      grid-area: sidenav;
    }
    
    .sidenav {
      position: relative;
      left: 0;
    }
    
    #main {
      padding: 0 2rem;
    }

    .float {
      display: none;
    }
  }

</style>

<section class="base-grid">
    <div id="sidenav" class='sidenav' bind:this={sidenav}>
      <Sidenav />
    </div>
    <div class='has-background-white-ter' id='main'>
      {#if $state.initialised}
        <Router {routes} />
        <span class="icon is-large has-background-primary is-clickable float" on:click={toggleNav} in:fly="{{ y: 200, duration: 500 }}" >
            <ion-icon name="menu-sharp"></ion-icon>           
          
        </span>
      {:else}
        <p class='subtitle my-5'>Loading...</p>
      {/if}
    </div>
  </section>