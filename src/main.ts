import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

// FlyonUI: import variants CSS and JS so Vite bundles them (per quick-start)
import 'flyonui/variants.css'
import 'flyonui/dist/index.js'

const app = createApp(App)
app.mount('#app')

// Allow FlyonUI to initialize any JS-driven components after mount.
// A short timeout ensures the DOM is attached before autoInit runs.
setTimeout(() => {
	try {
		// call autoInit if available; safe no-op otherwise
		// @ts-ignore - window global from FlyonUI
		window.HSStaticMethods?.autoInit?.()
		// console.debug('[init] FlyonUI autoInit called')
	} catch (e) {
		// fail silently; dev console will show errors if any
		// console.warn('[init] FlyonUI autoInit failed', e)
	}
}, 50)
