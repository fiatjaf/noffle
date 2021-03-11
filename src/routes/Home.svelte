<script>
	import { onMount } from 'svelte'
	import Router, { push } from 'svelte-spa-router'
	import state from '../stores/store'
	import { pool } from '../lib/relay'
	import List from './List.svelte'
	import Profile from './Profile.svelte'
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

    '/:profile': Profile,

    // Catch-all route last
    // '*': NotFound,
  }

</script>
<style>

  :global(.base-grid) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: 'main';
  }

  :global(.sidenav) {
    position: fixed;
    left: -100%;
    /* height: 100%; */
    transition: left 0.3s ease-in-out;
    background: #659999;
    z-index: 100;
    overflow-x: hidden;
  }

  #main {
    grid-area: main;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :global(.open) {
    left: 0;
    /* grid-template-columns: minmax(auto, 0.3fr) 1fr; */
  }


  @media screen and (min-width: 768px) {
    .base-grid {
      display: grid;
      grid-template-columns: minmax(min-content, 300px) 1fr;
      grid-template-areas: 'sidenav main';
    }
    
    #sidenav {
      grid-area: sidenav;
    }
    
    .sidenav {
      position: relative;
      left: auto;
    }
    
    #main {
      padding: 0 2rem;  
    }
  }

</style>

<section class="base-grid">
    <div id="sidenav" class='sidenav' bind:this={sidenav}>
      <Sidenav />
    </div>
    <div class='has-background-white-ter' id='main' on:click={toggleNav}>
      <Router {routes} />
    </div>
  </section>