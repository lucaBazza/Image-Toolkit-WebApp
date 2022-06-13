import { createApp } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import "./assets/global.css"

const app = createApp(App)  //createApp(App).mount("#app");


    // Assegno variabili e funzioni globali
//app.config.globalProperties.___urlServerImage //= window.location.protocol + "//" + window.location.hostname + ":3000" //'localhost:3000'
//app.config.globalProperties.___urlServerImage = new String(window.location.protocol +"//"+window.location.hostname+":3000")

    // report error to tracking services
app.config.errorHandler = (err, instance, info) => {
    console.log( "app.config.errorHandler() - \n " + err )  //console.log(`${err} \n ${instance} \n ${info}`)
}

    // inserire main.test.ts per testare loading app
// https://v1.test-utils.vuejs.org/guides/#getting-started
// https://github.com/facebook/jest


    // avvio app
app.mount("#app");
