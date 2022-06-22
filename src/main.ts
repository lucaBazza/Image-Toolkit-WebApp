import { createApp } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import "./assets/global.css"
import Settings from "./types/Settings"
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)  //createApp(App).mount("#app");


    // report error to tracking services
if( ! Settings.getInstance().isDevelopMode() ){
    app.config.errorHandler = (err, instance, info) => {
        console.log( "app.config.errorHandler() - \n " + err )
    }
}


app.use(Notifications)


    // avvio app
app.mount("#app");
