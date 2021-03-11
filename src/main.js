import './globals.scss'
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		isuser: localStorage.getItem("key")
	}
});

export default app;
