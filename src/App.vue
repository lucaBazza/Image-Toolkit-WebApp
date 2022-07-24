<template>
  <img class="headerImg" />
  <component :is="TheCover" />

  <AvatarUser v-if="isLogin" :nome="user.displayName" :photoURL="user.photoURL" @logout="user=auth.signOut()" @click="toggleUserSettings"/>
  <button v-else @click="signIn" class="googleSignIn"><img src='./assets/logoGoogle.svg'/>Sign In</button>

  <nav class="controlBtns">
      <button @click="toggleDarkModeBtn"></button>
      <button @click="toggleUploadMode" v-if="isLogin" >☁️</button>
      <button @click="toggleModalInfos">ℹ️</button>
  </nav>

  <h1 id="mainTitle">Pic Kit App</h1>

  <LoginArea v-if="showLogInArea"/>
 
  <Modal v-if="showModalInfos" @updateCloseMain="postCloseLoggin"/>

  <TheDropzone v-if="showUploadMode" />

  <CatalogoForm v-if="showCatalogo" :catalogo="catalogoSelezionato"/>

  <TheEditorFullScreen v-if="showEditorFullScreen" :imgIdProp="selectedImageID"/>

  <notifications position="bottom center"/>
</template>


<script setup lang="ts">
import { ref,reactive, computed, onMounted, provide, defineAsyncComponent, watch } from 'vue'
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import AvatarUser from './components/AvatarUser.vue'
import Modal from "./components/Modal.vue"
import TheDropzone from './components/TheDropzone.vue'
import TheEditorFullScreen from './components/TheEditorFullScreen.vue'
import Utente from './types/Utente'
 
import { useAuth, auth } from '@/firebase'
import { loadUserSettings, updateUser } from './types/FirebaseModel'
import { loadImagesFromCatalog_firebaseA } from './types/Firebase_immagini'
import { loadCatalogo } from '@/types/App.controller'
import { notify } from '@kyvg/vue3-notification'
import getLocalizationInfos from '@/utilities/Ip-localization-api'
import useEventsBus from '@/utilities/useEmitters'

let utenteSng = reactive(Utente.getInstance())
const { user, isLogin, signIn, unsubscribe } = useAuth()

let showModalInfos = ref(false)
let showUploadMode = ref(false)
let showCatalogo = ref(false)
let showLogInArea = ref(false)

let showEditorFullScreen = ref(false)
let selectedImageID = ref()

let pageFullyLoaded = ref(false)

const toggleModalInfos = ()=>{ showModalInfos.value = ! showModalInfos.value }
const toggleUploadMode = ()=>{ showUploadMode.value = ! showUploadMode.value && utenteSng.listaCataloghi.length > 0 }
const toggleUserSettings = ()=>{ showLogInArea.value = ! showLogInArea.value }
const postCloseLoggin = ()=>{ toggleModalInfos() }
const toggleDarkModeBtn = ()=>{ document.body.classList.toggle("darkMode") }

const catalogoSelezionato = computed( () => utenteSng.getTheCatalog() )
const TheCover = computed( () => !isLogin.value && pageFullyLoaded.value && defineAsyncComponent(() => import("./components/TheCover.vue")) )

provide('utente',utenteSng)

const { bus } = useEventsBus()
watch( ()=>bus.value.get('toggleEditorFullScreen'), (imgId:string) => {
    selectedImageID.value = Array.isArray(imgId) ? imgId[0] : imgId
    showEditorFullScreen.value = ! showEditorFullScreen.value

    /** TODO: quando viene chiusa (o aperta) la editor immagine, aggiornare la thumb image relativa nel catalogForm */
})


onMounted( async () => {
        // Avvio in dark mode
  document.addEventListener("DOMContentLoaded", () => document.body.classList.toggle("darkMode") )

        // Abilita keybindings upload, user area    TODO ERRORE attiva keybind quando userarea scrive nuovo catalogo
  window.addEventListener('keydown', function(e) {
    if( e.key === 's') toggleUploadMode() 
    // if( e.key === 'a') toggleUserSettings()
  })
  
        // observer sullo stato utente firebase
  auth.onAuthStateChanged( user =>{
    if( user ){
        console.log('Auth status changed, user logged: \t', user['displayName'])
        loadUserSettings(user)
          .then( utente => utenteSng = reactive(utente) )
          .then( () => loadCatalogo(utenteSng as Utente)
                        .then( () => { 
                          showCatalogo.value = true;
                          console.log('\t Loaded catalog: ',utenteSng.getTheCatalog().titolo)
                          return utenteSng.getCataloghi_NON_sel() 
                        })
                        .then( async otherCatalgs => { 
                          console.log('Remaining catalogs to load in backgrounds: ', otherCatalgs.length)
                          let prs = otherCatalgs.map( async c => utenteSng.getCatalog_by_cid(c.cid)!.setListaImmagini(await loadImagesFromCatalog_firebaseA(c.cid)) )
                          await Promise.all(prs).then( () => console.log('\t ✅ loaded all the other catalogs: \t', otherCatalgs.map(c=>c.titolo).join(', ')) )
                        })
                        .then( async()=> getLocalizationInfos().then(loc => updateUser(utenteSng.setLocation(loc.location).setLastIp(loc.lastIp)) ))
                        .catch( err => typeof err === 'object' ? notify(err) : notify({title: 'Error', text: err, type:'error'}) )
          )
          .catch( ex => console.log(ex))
    } 
    else {
      console.log('Auth status now is un-logged')
      Utente.newInstance()
      // unsubscribe() //unsub_refCatalogs && unsub_refCatalogs()
      showLogInArea.value = false
      showCatalogo.value = false
    }
    pageFullyLoaded.value = true
  }) 

})

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
  margin: .2rem auto 1rem;
  box-shadow: var(--boxShadowCorto);
}
.upload-media { margin-left: 10%; width: 80%; height: 100%; margin-top: 5% }
.controlBtns { position: absolute; top: .5rem; right: .5rem }
.controlBtns > button { border: none; background: transparent; font-size: 1.7rem; cursor: grab }

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
.googleSignIn > img{ width: 1.7rem; margin-right: .3rem; padding: .5rem; vertical-align: middle }

.uploadImageCodeInspire{ 
  margin: 2rem auto;
  display: block;   
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: .8rem;
}
</style>

