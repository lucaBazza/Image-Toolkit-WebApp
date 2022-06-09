<template>
  <p class="catalogOwner" v-if="isLoading">👤 Loading...</p>
  <p class="catalogOwner" v-else @click="openUserSettings">
    👤 {{ utenteSng.nome }}
  </p>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <div class="controlBtns">
    <button @click="toggleDarkModeBtn()">🌓</button>
    <button @click="toggleUploadMode()">☁️</button>
    <button @click="toggleCatalogMode()">📚</button>
    <button @click="toggleModalInfos()">ℹ️</button>
  </div>
  <h1 id="mainTitle">{{ title }}</h1>

  <LoginArea v-if="showLogInArea" :utente="utenteSng" />

  <Modal
    v-if="showModalInfos"
    :header="header"
    :text="text"
    theme="sale"
    @updateCloseMain="postCloseLoggin"
  />

  <upload-media
    v-if="showUploadMode"
    class="upload-media"
    :server="settings.urlImageServer+'/formidable'"
    error=""
    v-bind:class="{ 'upload-media': '' }"
  />

  <CatalogoForm
    v-if="showCatalogo && ! isLoading"
    :catalogName="initialCatalog.catalogName"
    :catalogOwner="initialCatalog.catalogOwner"
    :secretKey="initialCatalog.secretKey"
    :class="initialCatalog.class"
    :urlServerImage="settings.urlImageServer"
    :catalogoRef="utenteSng.getCatalogoCurrent()"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EventEmitter from "events"
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import Modal from "./components/Modal.vue"
import MD5 from "./utilities/MD5.js"
import Settings from './types/Settings'
import Utente from './types/Utente'
import Catalogo from './types/Catalogo'
import Immagine from './types/Immagine'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from "vue-media-upload"

// Necessario per fetch function in test
/*import fetch from "node-fetch"
import { unwatchFile } from 'fs'*/

const eventEmitter = new EventEmitter();
eventEmitter.on("toggleDarkMode", () => {
  console.log("toggleDark mode 🌓 ");
  document.body.classList.toggle("darkMode");
});

export default defineComponent({
  name: "App",
  components: { Modal, CatalogoForm, LoginArea, UploadMedia },
  created: function () { document.title = "Zabba image 🛠️ " },
  data() {
    console.log('appvue - data()')
    return {
      title: "Image Toolkit App",
      header: "Manage easly your images",
      text: "Create a catalog, upload your photos and edit them",
      // restituisce un catalogo faked mentre carica async
      //  -> TODO: check local or init new catalog
      initialCatalog: { catalogName: "", catalogOwner: "Luca", secretKey: MD5(new Date()), class: "catalogClass" },
      //urlServerB: this.___urlServerImage
    };
  },
  computed: {
    //getUrlServer(){ return new String(window.location.protocol +"//"+window.location.hostname+":3000") as string /*this.___urlServerImage*/ },
    // ritorna l'oggetto catalogo che viene letto da data, secretKey da definire. TODO usare classe catalogo
    /*initCatalogDatas(){
      console.log("AppVue initCatalogDatas()");
      return {
        //catalogName: "",
        //catalogOwner: "Luca", // parametro verrà letto da cookies/ localstorage / mail val insieme a key
        secretKey: MD5(new Date()),
        class: "catalogClass",
      }
    }*/
  },
  setup(){
    // Create Fake datas
    //let _listaCataloghi = getUserFromServer('Luca', 'Yhsdg654@as','ASKJ23487');
    
    /*
    const utenteSng = ref(new Utente('Luca', 'Yhsdg654@as', new Array<Catalogo>(
                                new Catalogo('Luca','Go to the mountas',0), new Catalogo('Luca','Schiazzi di mondi',1), new Catalogo('Luca','Androgenia del mare',2)) ));
    utenteSng.value.setEmail('luca@xyz.com')
    //utenteSng.value.setKeepLogin(true)
    utenteSng.value.getCatalogoCurrent().titolo = 'Amici della natura'
    utenteSng.value.getCatalogoCurrent().setListaImmagini([
      new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)
    ]);
    */

    //const utenteSng : Utente = ref( new Utente('Luca', 'Yhsdg654@as', new Array<Catalogo>()) )
    let utenteSng : any | Utente = ref(new Utente('','',''))
    const settings = Settings.getInstance();

    let isLoading = ref(true)
    let showModalInfos = ref(false)
    let showUploadMode = ref(false)
    let showCatalogo = ref(true)
    let showLogInArea = ref(false)
 
    const toggleModalInfos = ()=>{
      showModalInfos.value = ! showModalInfos.value
    }
    const toggleUploadMode = ()=>{
      showUploadMode.value = ! showUploadMode.value
    }
    const toggleCatalogMode = ()=>{
      showCatalogo.value = ! showCatalogo.value;
    }
    const openUserSettings = ()=>{
      showLogInArea.value = ! showLogInArea.value;
    }
    const postCloseLoggin = ()=>{
      toggleModalInfos(); console.log("postCloseLoggin()\t\n azione modal"); 
    }
    const toggleDarkModeBtn = ()=>{
      eventEmitter.emit("toggleDarkMode");
    }

    const loadingDone = ()=>{ console.log("loadingDone()"); isLoading.value = false }
    //const registerName = ()=>{ const input = this.$refs.name as HTMLInputElement | null; console.log(input != null ? input.value : "Catalog name missing") }

    return {  utenteSng, settings, isLoading,
              showModalInfos, showUploadMode, showCatalogo, showLogInArea, 
              toggleModalInfos, toggleUploadMode, toggleCatalogMode, openUserSettings, postCloseLoggin, toggleDarkModeBtn, loadingDone }
  },
  methods: {
    async getUserFromServer(user, password, secretKey){
      console.log("getUserFromServer()")
      
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utente: user,
          password: password,
          secretKey: secretKey
        })
      }

      const res = await fetch(this.settings.urlImageServer+"/user", requestOptions)
                          .then(response => response.json())
                          .then(data => {
                            //console.log('Success:', data);
                            return data
                          })
                          .catch((error) => {
                            console.error('Error:', error);
                            //return null;
                          })

      //if (!res.ok) {
      //  return null //throw new Error(`HTTP error! status: ${res.status}`);
      //}
      const data = res
      if( !data ) return null //if( !res.ok) return null

      const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo, cat.secretKey ))
      const helpUser : Utente = new Utente(data.nome, data.password, helpListaCat ).setEmail(data.email)
      helpUser.setCurrentCatalog(data.indexCatalogNow)     

      return helpUser

  /*
      const response = await fetch(this.settings.urlImageServer+"/user", requestOptions)
                              .then(async (response) => {
                                  const isJson = response.headers.get("content-type")?.includes("application/json");
                                  if( ! isJson ){
                                    console.log('API /user has not JSON response')
                                    return Promise.reject('API /user has not JSON response')
                                  }

                                  if ( ! response.ok ) {
                                    //const error = (data && data.message) || response.status;
                                    //console.log('API /user ! response.ok')
                                    return Promise.reject(response.status);
                                  }
                                  return response.json();
                              })
                              .catch((err) => {
                                //console.log(`Server api ${this.settings.urlImageServer} is down 😭`);
                                throw new Error(`Server api ${Settings.getInstance().urlImageServer} is down 😭 \n ${err}`);
                              });

        if( ! response )
          return null 
      //try{
          const data  =  await response.json();
          const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo, cat.secretKey ))
          const helpUser : Utente = new Utente(data.nome, data.password, helpListaCat ).setEmail(data.email)
          helpUser.setCurrentCatalog(data.indexCatalogNow)
          return helpUser
      //}
      //catch(ex){
        //console.log(ex);
        //return null; ///new Utente('','',[])
      //}
*/
      //const data = await response;
      //if( ! data ){ console.log("getUserFromServer() has no data"); return; }
      /*
      const helpListaCat : Array<Catalogo> = data.listaCataloghi.map(cat => new Catalogo(cat.proprietario, cat.titolo, cat.secretKey ))
      const helpUser : Utente = new Utente(data.nome, data.password, helpListaCat ).setEmail(data.email)
      helpUser.setCurrentCatalog(data.indexCatalogNow)
      return helpUser
      */
    }
  },
  async mounted() {
    // TODO: non usare eventEmitter ma basterebbe avere l'istanza di app.toggleDarkModeBtn()
      // https://stackoverflow.com/questions/54390842/how-to-access-a-property-of-the-inital-app-instance-in-a-vue-component-templat
    document.addEventListener("DOMContentLoaded", function () { eventEmitter.emit("toggleDarkMode"); })
    // invio credenziali mandate al server
    this.utenteSng = await this.getUserFromServer('Luca','lkjh$33ASd','HGF475892SDG')
    //console.log(this.utenteSng)

    if( this.utenteSng )
      this.loadingDone()
  }
});
</script>

<style>
/** questo è globale */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1 {
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  background: 10rem rgba(0, 0, 0, 0.4);
  border-radius: 0.5rem;
}
h3 {
  margin: 0;
}

.headerImg {
  z-index: -1;
  position: fixed;
  left: 0;
  top: 0;
  height: 30vh;
  width: 100%;
  object-fit: cover;
  filter: blur(2px);
  /*mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);*/
}
/*.darkMode > .headerImg{ filter:invert(0.5) } */
.heartContainer {
  padding: 1rem;
}
.upload-media {
  margin-left: 10%;
  width: 80%;
  height: 100%;
  margin-top: 5%;
  /*background: var(--backgroundColor);*/
}

.controlBtns {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}
.controlBtns > button {
  border: none;
  background: transparent;
  font-size: 1.7rem;
  cursor: grab;
}

.catalogOwner {
  color: var(--mainText);
  position: absolute;
  padding: 0.7rem;
  margin: 0;
  top: 0.4rem;
  left: 0.4rem;
  line-height: 1;
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.catalogOwner:hover {
  font-size: 150%;
  transition: 0.4s;
  cursor: cell;
}
</style>