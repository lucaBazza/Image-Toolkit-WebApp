import { createApp } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import './assets/global.css'

//createApp(App).mount("#app");
let app = createApp(App)

// Assegno variabili e funzioni globali
app.config.globalProperties.___urlServerImage = 'localhost:3000'
//app.config.globalProperties.$http = () => {}

// avvio app
app.mount('#app')

