<template>
  <img class="headerImg" />

  <AvatarUser v-if="isLogin" :nome="user.displayName" :photoURL="user.photoURL" @showSettings="openUserSettings" @logout="user=auth.signOut()"/>
  <button v-else @click="signIn" class="googleSignIn" :disabled="isProductionBuild">
      <img src='./assets/logoGoogle.svg'/>Sign In
  </button>

  <nav class="controlBtns">
      <button @click="toggleDarkModeBtn">🌓</button>
      <button @click="toggleUploadMode" v-if="isLogin" >☁️</button>
      <button @click="toggleModalInfos">ℹ️</button>
  </nav>

  <h1 id="mainTitle">Pic Kit App</h1>

  <LoginArea v-if="showLogInArea" @change_catalog="change_catalog" @notificate="notificate"/>
 
  <Modal v-if="showModalInfos" @updateCloseMain="postCloseLoggin" />

  <TheDropzone v-if="showUploadMode" @requestImageUpload="requestImageUpload"/>

  <CatalogoForm v-if="showCatalogo" :catalogo="catalogoSelezionato" />

  <div v-if="isProductionBuild" class="productionMode"><h2>Aviable soon</h2></div> 

  <notifications position="bottom center" />
</template>


<script setup lang="ts">
import { ref,reactive, computed, onMounted, provide } from 'vue'
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
import { change_catalog_logic,loadCatalogo } from '@/types/App.controller'
import { notify } from '@kyvg/vue3-notification'
import getLocalizationInfos from '@/utilities/Ip-localization-api'

let utenteSng = reactive(Utente.getInstance())
const isProductionBuild = Settings.getInstance().isProductionMode()
const { user, isLogin, signIn, unsubscribe } = useAuth()

let showModalInfos = ref(false)
let showUploadMode = ref(false)
let showCatalogo = ref(false)
let showLogInArea = ref(false)

const toggleModalInfos = ()=>{ showModalInfos.value = ! showModalInfos.value }
const toggleUploadMode = ()=>{ showUploadMode.value = ! showUploadMode.value }
const openUserSettings = ()=>{ showLogInArea.value = ! showLogInArea.value }
const postCloseLoggin = ()=>{ toggleModalInfos() }
const toggleDarkModeBtn = ()=>{ document.body.classList.toggle("darkMode") }

function notificate(data){ notify(data) }
const catalogoSelezionato = computed( () => utenteSng.getCurrentCatalog_cid() )

provide('utente',utenteSng)


onMounted( async () => {
        // Avvio in dark mode
  document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })
  
        // watcher sullo stato utente firebase
  auth.onAuthStateChanged( user =>{
    if( user ){
        console.log('Auth status changed, user logged: \t', user['displayName'])
        loadUserSettings(user)
          .then( utente => utenteSng = reactive(utente) )
          .then( () => loadCatalogo(utenteSng)
                        .then( () => { 
                          showCatalogo.value = true;
                          console.log('\t Loaded catalog: ',utenteSng.getCurrentCatalog_cid().titolo)
                          return utenteSng.getCataloghi_NON_sel() 
                        })
                        .then( async otherCatalgs => { 
                          console.log('Remaining catalogs to load in backgrounds: ', otherCatalgs.length)
                          let prs = otherCatalgs.map( async c => utenteSng.getCatalog_by_cid(c.cid).setListaImmagini(await loadImagesFromCatalog_firebaseA(c.cid)) )
                          await Promise.all(prs).then( () => console.log('\t ✅ loaded all the other catalogs: \t', otherCatalgs.map(c=>c.titolo).join(', ')) )
                        })
                        .then( async()=> getLocalizationInfos().then(loc => updateUser(utenteSng.setLocation(loc.location).setLastIp(loc.lastIp)) ))
                        .catch( err =>{ console.log(' 🕷  : ',err); notificate(err) })
                )
          .catch( ex => console.log(ex))
    }
    else {
      console.log('Auth status new is un-logged')
      Utente.newInstance()
      // unsubscribe() //unsub_refCatalogs && unsub_refCatalogs()
      showLogInArea.value = false
      showCatalogo.value = false
    }
  }) 
})

async function change_catalog(cid : string){
  change_catalog_logic(cid)
}

/**
 *    Metodo call back di TheDropZone
 *  - creo l'oggetto immagine inserendo base64 come src, etc.etc
 *  - mostro l'anteprima nella gui
 *  - faccio l'upload dell'immagine
 */
async function requestImageUpload(file: HTMLInputElement, previewImgBase64: string, imageSizes: ImageSize){
  const current_cid = Utente.getInstance().getCid()
  let img = new Immagine(previewImgBase64).setNomeFile(file.name).setClassStyle('imgUploadRequest')
                                          .setCatalogID(current_cid)
                                          .setImageDimension(imageSizes).setSize(file.size)
                                          .setTempImgId(file.name)
  utenteSng.getCurrentCatalog_cid().listaImmagini.unshift(img)
  uploadSingleFile_firestore(file, img.catalogoID, img.clearSrc() )
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

