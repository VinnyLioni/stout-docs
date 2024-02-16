import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.ts'
import { createPinia } from 'pinia'

// import './style/tailwind.css'
// import "./assets/fontawesome/all.js";
import './assets/fontawesome/all.js'

const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(pinia)
app.mount('#app')
