<template>
  <p class="catalogOwner" v-if="isLoading">👤 Loading...</p>
  <p class="catalogOwner" v-else @click="openUserSettings">
    <img v-if="utenteSng.nome" src="./assets/test-userProf-pic.jpg"/>
    <span v-else> 👤  </span>
    <span>{{ utenteSng.nome }}</span>
  </p>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <div class="controlBtns">
    <button @click="toggleDarkModeBtn">🌓</button>
    <button @click="toggleUploadMode">☁️</button>
    <button @click="toggleCatalogMode">📚</button>
    <button @click="toggleModalInfos">ℹ️</button>
  </div>
  <h1 id="mainTitle">Image Toolkit App</h1>

  <LoginArea v-if="showLogInArea" :utente="utenteSng" />

  <Modal
    v-if="showModalInfos"
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
  <div v-if=" ! settings.isDevelopMode()" class="productionMode"><h2>Aviable soon</h2></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import Modal from "./components/Modal.vue"
import MD5 from "./utilities/MD5.js"
import FetchUser from './utilities/FetchUser'
import Settings from './types/Settings'
import Utente from './types/Utente'
import Catalogo from './types/Catalogo'
import Immagine from './types/Immagine'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from "vue-media-upload"

export default defineComponent({
  name: "App",
  components: { Modal, CatalogoForm, LoginArea, UploadMedia },
  created: function () { document.title = "Zabba image 🛠️ " },
  data() {
    console.log('appvue - data()')
    return {
      // restituisce un catalogo faked mentre carica async
      initialCatalog: { catalogName: "", catalogOwner: "Luca", secretKey: MD5(new Date()), class: "catalogClass" },
    };
  },
  setup(){
    const utenteSng = ref<Utente>(new Utente('','',''))
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
      console.log('App.toggleDarkModeBtn()')
      document.body.classList.toggle("darkMode");
    }

    const loadingDone = ()=>{ 
      console.log("loading user data done 😊")
      isLoading.value = false
    }

    return {  utenteSng, settings, isLoading,
              showModalInfos, showUploadMode, showCatalogo, showLogInArea, 
              toggleModalInfos, toggleUploadMode, toggleCatalogMode, openUserSettings, postCloseLoggin, toggleDarkModeBtn, loadingDone }
  },
  methods: {
      // in produzione al momento visualizzo solo il pulsante 'aviable soon'
    productionView(){
      console.log('productionView()')
      document.getElementsByClassName('catalogOwner')[0].setAttribute('hidden','');
      document.getElementsByClassName('controlBtns')[0].setAttribute('hidden','');
    }
  },
  async mounted() {
          // Avvio in dark mode
    document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })

        // Check se produzione nascondo implementazione
    if( ! this.settings.isDevelopMode() ) this.productionView()

        // Carico utente > invio credenziali mandate al server
    let helperUtente : Utente = await FetchUser('Luca','lkjh$33ASd','HGF475892SDG')
    if( helperUtente.nome !== "" ){
      this.utenteSng = helperUtente
      this.loadingDone()
    }
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
h3 { margin: 0 }

.headerImg {
  z-index: -1;
  position: fixed;
  left: 0;
  top: 0;
  height: 30vh;
  width: 100%;
  object-fit: cover;
  filter: blur(2px);
  transform: scale(1.05);
  /*mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);*/
}
/*.darkMode > .headerImg{ filter:invert(0.5) } */
.heartContainer { padding: 1rem }
.upload-media {
  margin-left: 10%;
  width: 80%;
  height: 100%;
  margin-top: 5%; /*background: var(--backgroundColor);*/
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
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  text-align: right;
  vertical-align: middle;
}
.catalogOwner:hover {
  font-size: 150%;
  transition: 0.4s;
  cursor: cell;
}
.catalogOwner > img { 
  width: 1.7rem;
  border-radius: 100%;
  margin-right: .5rem;
}
.catalogOwner > span {
  margin: 0 0 10rem 0;
  translate: transposeY(20px);
}

</style>

<!-- 

    // Create Fake datas
    //let _listaCataloghi = getUserFromServer('Luca', 'Yhsdg654@as','ASKJ23487');
    
    /*
    const utenteSng = ref(new Utente('Luca', 'Yhsdg654@as', new Array<Catalogo>(
                                new Catalogo('Luca','Go to the mountas',0), new Catalogo('Luca','Schiazzi di mondi',1), new Catalogo('Luca','Androgenia del mare',2)) ));
    utenteSng.value.setEmail('luca@xyz.com')
    //utenteSng.value.setKeepLogin(true)
    utenteSng.value.getCatalogoCurrent().titolo = 'Amici della natura'
    utenteSng.value.getCatalogoCurrent().setListaImmagini([
    */
      new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)
    ]);


--> 