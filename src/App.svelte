<script>
  import {onMount} from 'svelte'

  import state from './stores/state'
  import {initPool} from './lib/relay'
  import Home from './routes/Home.svelte'

  onMount(async () => {
    await state.initStore()
    await initPool()
  })
</script>

<main>
  <Home />
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
