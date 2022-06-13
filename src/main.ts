import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./assets/global.css";
//import VueClickAway from 'vue3-click-away'
//import Cors from 

//createApp(App).mount("#app");
const app = createApp(App)

///app.use(VueClickAway)

//console.log("Is node in: " + process.env.NODE_ENV)

// Assegno variabili e funzioni globali
//app.config.globalProperties.___urlServerImage //= window.location.protocol + "//" + window.location.hostname + ":3000" //'localhost:3000'
//app.config.globalProperties.___urlServerImage = new String(window.location.protocol +"//"+window.location.hostname+":3000")

    // report error to tracking services
app.config.errorHandler = (err, instance, info) => {
    console.log( "app.config.errorHandler() - \n " + err )  //console.log(`${err} \n ${instance} \n ${info}`)
}


//app.config.globalProperties.$http = () => {}
//app.config.globalProperties.___MD5 = MD5;

// inserire main.test.ts per testare loading app
// https://v1.test-utils.vuejs.org/guides/#getting-started
// https://github.com/facebook/jest
//(window as any).

//global.country = 'Germany';
//console.log(global.country)

// avvio app
app.mount("#app");
