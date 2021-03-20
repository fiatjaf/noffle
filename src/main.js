import App from './App.svelte'
import './globals.scss'

const app = new App({
  target: document.body,
  props: {
    isuser: localStorage.getItem('key')
  }
})

export default app
