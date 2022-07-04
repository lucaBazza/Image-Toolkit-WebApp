<template>
  <img class="headerImg" />

  <AvatarUser v-if="isLogin" :nome="user.displayName" :photoURL="user.photoURL" @showSettings="openUserSettings" @logout="user=auth.signOut()"/>
  <button v-else @click="signIn" class="googleSignIn" :disabled="isProductionBuild">
      <img src='./assets/logoGoogle.svg'/>Sign In
  </button>

  <nav class="controlBtns">
      <button @click="toggleDarkModeBtn">🌓</button>
      <button @click="toggleUploadMode" v-if="isLogin" >☁️</button>
      <!-- <button @click="toggleCatalogMode" v-if="isLogin" >📚</button> -->
      <button @click="toggleModalInfos">ℹ️</button>
  </nav>

  <h1 id="mainTitle">Image Toolkit App</h1>

  <!-- <LoginArea v-if="showLogInArea" @change_catalog="change_catalog" @notificate="notificate" @add_catalog="add_catalog"/> -->
  <LoginArea v-if="showLogInArea" :utente="utenteSng" @change_catalog="change_catalog" @notificate="notificate" @add_catalog="add_catalog"/>

  <Modal v-if="showModalInfos" @updateCloseMain="postCloseLoggin" />

  <TheDropzone v-if="showUploadMode" @requestImageUpload="requestImageUpload"/>

  <!-- <CatalogoForm v-if="showCatalogo" :catalogoProp="currentAppCatalog" @deleteCatalog="deleteCatalog"/> -->
  <!-- <CatalogoForm v-if="catalogoRef" :catalogoProp="catalogoRef" @deleteCatalog="deleteCatalog"/> -->
  <CatalogoForm v-if="/* catalogoRef && */ showCatalogo" :catalogoProp="catalogoSelezionato" @deleteCatalog="deleteCatalog"/>

  <div v-if="isProductionBuild" class="productionMode"><h2>Aviable soon</h2></div>

  <notifications position="bottom center" />
</template>


<script setup lang="ts">
import { ref,reactive, computed, onMounted } from 'vue'
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import AvatarUser from './components/AvatarUser.vue'
import Modal from "./components/Modal.vue"
import TheDropzone from './components/TheDropzone.vue'
import Settings from './types/Settings'
import Utente from './types/Utente'
import Catalogo from './types/Catalogo'
import Immagine from './types/Immagine'
import { ImageSize } from  './types/Immagine'
 
import { useAuth, auth } from '@/firebase'
import { uploadSingleFile_firestore } from '@/utilities/uploadImageCodeInspire'
import { loadUserSettings, updateUser } from './types/FirebaseModel'
import { loadImagesFromCatalog_firebaseA } from './types/Firebase_immagini'
import { add_catalog_logic, delete_catalog_logic, change_catalog_logic,loadCatalogo } from '@/types/App.controller'
import { notify } from '@kyvg/vue3-notification'
import getLocalizationInfos from '@/utilities/Ip-localization-api'

let utenteSng
const isProductionBuild = Settings.getInstance().isProductionMode()
const { user, isLogin, signIn, unsubscribe} = useAuth()

let showModalInfos = ref(false)
let showUploadMode = ref(false)
let showCatalogo = ref(false)
let showLogInArea = ref(false)

const toggleModalInfos = ()=>{ showModalInfos.value = ! showModalInfos.value }
const toggleUploadMode = ()=>{ showUploadMode.value = ! showUploadMode.value }
const toggleCatalogMode = ()=>{ showCatalogo.value = ! showCatalogo.value }
const openUserSettings = ()=>{ showLogInArea.value = ! showLogInArea.value }
const postCloseLoggin = ()=>{ toggleModalInfos() }
const toggleDarkModeBtn = ()=>{ document.body.classList.toggle("darkMode") }

function notificate(data){ notify(data) }
const catalogoSelezionato = computed( ()=>{ return Utente.getInstance().getCurrentCatalog_cid() })



// T E STING
/* setTimeout(() => {
  console.log('\n\nTEST ING agigunge un immagine fake per vedere se viene renderizzata con reactivity\n\n')
  const i = new Immagine('https://zabba.lucabazzanella.com/img/estate/DSC04881_ps.webp').setCatalogID(utenteSng.getCid()).setClassStyle('imageLoaded')
  Utente.getInstance().getCurrentCatalog_cid().listaImmagini.push(i)
  showCatalogo.value = false
  setTimeout(()=> showCatalogo.value = true, 500)
}, 1200); */



onMounted( async () => {
  console.log('app.mounted()')

        // Avvio in dark mode
  document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })
  
        // watcher sullo stato utente firebase
  auth.onAuthStateChanged( user =>{
    if( user ){
        console.log('Auth status changed, user logged: \t', user['displayName'])
        loadUserSettings(user)
          .then( utente => utenteSng = reactive(utente) )
          .then( () => loadCatalogo(utenteSng)
                          .then( () => { showCatalogo.value = true; return utenteSng.getCataloghi_NON_sel() })
                          .then( otherCatalgs => otherCatalgs.forEach( c => loadImagesFromCatalog_firebaseA(c.cid)) )
                          .then( async()=> getLocalizationInfos().then(loc => updateUser(utenteSng.setLocation(loc.location).setLastIp(loc.lastIp)) ))
                          .catch( err =>{ console.log(' 🕷  : ',err); notificate(err) })
                )
          .catch( ex => console.log(ex))
    }
    else {
      console.log('Auth status new is un-logged')
      //unsub_refCatalogs && unsub_refCatalogs()
      utenteSng = null
      showLogInArea.value = false
      showCatalogo.value = false
    }
  }) 
})

async function add_catalog(cid : string){
    add_catalog_logic(Utente.getInstance(), cid)
}
function deleteCatalog(cid){ 
  delete_catalog_logic(Utente.getInstance(), cid)
}
async function change_catalog(cid : string){
  change_catalog_logic(cid)
}
/**
 *    Metodo call back di TheDropZone: ho la 
 */
async function requestImageUpload(file: HTMLInputElement, previewImgBase64: string, imageSizes: ImageSize){
  let u = Utente.getInstance()
  // const current_cid = Utente.getInstance().getCid()
  let i = new Immagine(previewImgBase64).setNomeFile(file.name).setClassStyle('imgUploadRequest')
                                          .setCatalogID(u.getCid()).setImageDimension(imageSizes).setSize(file.size)
  u.getCurrentCatalog_cid().listaImmagini.push(i)
  uploadSingleFile_firestore(file, i.catalogoID, i)
}


</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.headerImg {  /* default state: portrait, change with media @portrait */
  z-index: -2;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px);
  transform: scale(1.05);
}
#mainTitle{ 
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  background: 10rem rgba(var(--backgroundColor), .4);
  border-radius: 0.5rem;
  width: max(35%, 200px); 
  margin: 0rem auto 1rem;
  box-shadow: var(--boxShadowCorto);
  /*font-size: 1.5rem;  text-transform: uppercase; -webkit-text-fill-color: transparent; -webkit-background-clip: text;*/
}
.upload-media {
  margin-left: 10%;
  width: 80%;
  height: 100%;
  margin-top: 5%;
}

.controlBtns {
  position: absolute;
  top: .5rem;
  right: .5rem;
}
.controlBtns > button {
  border: none;
  background: transparent;
  font-size: 1.7rem;
  cursor: grab;
}

.googleSignIn{ 
  position: absolute; 
  top: 0; left: 0; 
  background: rgba(var(--backgroundColor), .5);
  border-radius: .5rem; 
  border: none; 
  margin: .3rem; 
  width: min(40%, 120px);
  box-shadow: 5px 5px 10px #0005;
}
.googleSignIn > img{ width: 1.7rem; margin-right: .3rem; padding: .5rem; vertical-align: middle; }

.uploadImageCodeInspire{ 
  margin: 2rem auto;
  display: block;   
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: .8rem;
}
</style>


<!--

/**
*  catalogID specifica il nome del catalogo FS (quindi se custm genera una nuova entry)
*    - ottiene l'id universale di firebase per il catalogo dove fare l'upload
*    - se trovato, avvia l'upload delle immagini una dopo l'altra
*    ->  TODO: dopo l'update, chiudi il file uploader e visualizza il catalogo aggiornato
*/
async uploadImageInput(event){      
  console.log(`upload in cid: ${this.utenteSng.getCurrentCatalog_cid().cid} \t imgs: ${event.target.files}`)
  uploadImageCodeInspire(event, this.utenteSng.selected_cid)

  // preparo la visualizzazione delle n-immagini (poi se sono caricate e vanno mejo)
  Array.from(event.target.files).forEach( file =>{ console.log(file); this.currentAppCatalog.listaImmagini.push(new Immagine('') ) })
},

-->





<!-- 
<script lang="ts">
import { defineComponent, ref,reactive, provide, computed, onMounted } from 'vue'
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import AvatarUser from './components/AvatarUser.vue'
import Modal from "./components/Modal.vue"
import TheDropzone from './components/TheDropzone.vue'
import Settings from './types/Settings'
import Utente from './types/Utente'
import Catalogo from './types/Catalogo'
import Immagine from './types/Immagine'
 
import { useAuth, auth } from '@/firebase'
import { uploadSingleFile_firestore } from '@/utilities/uploadImageCodeInspire'
import { loadUserSettings } from './types/FirebaseModel'
import { loadImagesFromCatalog_firebaseA } from './types/Firebase_immagini'
import { add_catalog_logic, delete_catalog_logic, change_catalog_logic,loadCatalogo } from '@/types/App.controller'
import { notify } from '@kyvg/vue3-notification'

/**
 *    Roadmap
 *  . per ogni catalogo, caricare la sotto-lista exifDatas e adjustments  TODO check it
 *  x caricato un catalogo, creare una secretKey per scaricare le foto
 *  . scaricare le foto
 *      - prima con get tradizionale
 *      - poi con post header ( secret key + user )     https://www.youtube.com/watch?v=Htt8AKeF1Kw&t=283s 
 * 
 *  . TODO quando carica un catalogo, impostare random come sfondo una delle immagini ?
 *  . TODO registrazione by mail
 *  . Implementare ML5.js per classificare immagini
*/

export default defineComponent({
  name: "App",
  components: { Modal, CatalogoForm, LoginArea, AvatarUser, TheDropzone },
  setup(){
    let utenteSng
    const isProductionBuild = Settings.getInstance().isProductionMode()
    const { user, isLogin, signIn, unsubscribe} = useAuth()

    let showModalInfos = ref(false)
    let showUploadMode = ref(false)
    let showCatalogo = ref(false)
    let showLogInArea = ref(false)
 
    const toggleModalInfos = ()=>{ showModalInfos.value = ! showModalInfos.value }
    const toggleUploadMode = ()=>{ showUploadMode.value = ! showUploadMode.value }
    const toggleCatalogMode = ()=>{ showCatalogo.value = ! showCatalogo.value }
    const openUserSettings = ()=>{ showLogInArea.value = ! showLogInArea.value }
    const postCloseLoggin = ()=>{ toggleModalInfos() }
    const toggleDarkModeBtn = ()=>{ document.body.classList.toggle("darkMode") }
    const signIn_utente = ()=>{ signIn() }

    // function loadingDone(){ console.log("loading user data done 😊"); showCatalogo.value = true }
    function notificate(data){ notify(data) }
    // const catalogoRef = ref<Catalogo>()//(new Catalogo('Stuartino', 'banane test'))
    const catalogoSelezionato = computed(()=>{ return Utente.getInstance().getCurrentCatalog_cid() })

    onMounted( async () => {
          console.log('app.mounted()')

                // Avvio in dark mode
          document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })
          
                // watcher sullo stato utente firebase
          auth.onAuthStateChanged( user =>{
            if( user ){
                console.log('Auth status changed, user logged: \t', user['displayName'])
                loadUserSettings(user)
                  .then( utente => utenteSng = reactive(utente) )
                  .then( () => loadCatalogo(utenteSng)
                                  .then( res => {
                                                  console.log(' 🍎 : ',res, 
                                                      '\nUtente cat: ', utenteSng.value.getCurrentCatalog_cid().titolo,
                                                      '\n Cataloghi: ', utenteSng.value.listaCataloghi.map(c => c.titolo)
                                                      );
                                                  // catalogoRef.value = utenteSng.value.getCurrentCatalog_cid()
                                                  // loadingDone() 
                                                  return utenteSng.getCataloghi_NON_sel()
                                  })
                                  .then( otherCatalgs => otherCatalgs.forEach(c => loadImagesFromCatalog_firebaseA(c.cid)) )
                                  .catch( err =>{ console.log(' 🕷  : ',err); notificate(err) })
                        )
                  .catch( ex => console.log(ex))
            }
            else {
              console.log('Auth status is: user un-logged')
              //unsub_refCatalogs && unsub_refCatalogs()
              utenteSng = null
              showLogInArea.value = false
              showCatalogo.value = false
            }
          }) 
    })

    return {  
        showModalInfos, showUploadMode, showCatalogo, showLogInArea, 
        toggleModalInfos, toggleUploadMode, toggleCatalogMode, postCloseLoggin, toggleDarkModeBtn, openUserSettings,
        /* catalogoRef, */ catalogoSelezionato, isProductionBuild,
        utenteSng, user, unsubscribe, isLogin, signIn, signIn_utente, notificate,
    }
  },
  methods: {
/*     async loadUserCatalogsAsync(){
      loadCatalogo(this.utenteSng, this)
    }, */

/*     async load_images_by_cid(cid : string){
      console.log('load_images_by_cid()')
      let listaImgs = await loadImagesFromCatalog_firebaseA(cid)
      this.utenteSng.setImages_by_cid(listaImgs, cid)
      console.log('\t 📚 Loaded catalog \t ', this.utenteSng.getCatalog_by_cid(cid).titolo)
      return this.utenteSng.getCurrentCatalog_cid()
    }, */
    /* notificate(notify){ this.$notify(notify) }, */
    async add_catalog(cid : string){
        add_catalog_logic(this, cid)
    },
    deleteCatalog(cid){ 
      delete_catalog_logic(this, cid)
    },
    // loadingDone(){ console.log("loading user data done 😊"); this.showCatalogo = true },
    async requestImageUpload(file: HTMLInputElement, imgBase64: string, imageSizes: object){
      let i = new Immagine(imgBase64).setNomeFile(file.name).setClassStyle('imgUploadRequest').setCatalogID(this.utenteSng.value.selected_cid)
      i.width = imageSizes['width']
      i.height = imageSizes['height']
      i.size = file.size
      // this.catalogoRef!.listaImmagini.push(i)
      this.utenteSng.getCurrentCatalog_cid().listaImmagini.push(i)
      uploadSingleFile_firestore(file, i.catalogoID, i)
    },
    async change_catalog(cid : string){
      change_catalog_logic(this, cid)
    }
  },
  provide(){ 
    return{ utente : computed( ()=> this.utenteSng ) }
  },
})
</script>
-->