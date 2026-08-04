// src/main.js

// createApp is the entry point for building a Vue application instance
import { createApp } from 'vue'

// Global stylesheet — applies to the whole app
import './style.css'

// The root component — everything else renders inside this
import App from './App.vue'

// Import the router instance we configured in router.js
import router from './router'
// in App.vue or main.js
import { state, closeModal, submitModal } from './store.js'

// Create the Vue app, giving it App.vue as the root component
const app = createApp(App)

// Register the router as a "plugin" on the app — this is what makes
// <RouterView> and <RouterLink> work anywhere in the component tree,
// and makes useRoute()/useRouter() available.
app.use(router)

// Actually render the app into the <div id="app"> element in index.html
app.mount('#app')