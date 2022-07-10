import { createApp } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import "./assets/global.css"
import Settings from "./types/Settings"
import Notifications from '@kyvg/vue3-notification'
import mitt from 'mitt'


const app = createApp(App)


    // report error to tracking services
if( ! Settings.getInstance().isDevelopMode() )
    app.config.errorHandler = (err, instance, info) => console.log( "app.config.errorHandler() - \n " + err )
    
    
app.use(Notifications)

    
const emitter = mitt()
app.config.globalProperties.emitter = emitter


app.config.globalProperties.selectedImageID = 'fYJQmNZ9WJfsQjm1rqe3'


app.mount("#app")
