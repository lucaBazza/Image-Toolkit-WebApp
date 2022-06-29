<template>
  <AvatarUser v-if="isLogin" :nome="user.displayName" :photoURL="user.photoURL" @click="openUserSettings"/>
  <button v-else @click="signIn" class="googleSignIn" :disabled="isProductionBuild">
      <img src='./assets/logoGoogle.svg'/>Sign In
  </button>

  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <nav class="controlBtns">
      <button @click="toggleDarkModeBtn">🌓</button>
      <button @click="toggleUploadMode" v-if="isLogin" >☁️</button>
      <button @click="toggleCatalogMode" v-if="isLogin" >📚</button>
      <button @click="toggleModalInfos">ℹ️</button>
  </nav>

  <h1 id="mainTitle">Image Toolkit App</h1>

  <LoginArea v-if="showLogInArea" :utente="utenteSng" @change_catalog="change_catalog" @notificate="notificate" @add_catalog="add_catalog"/>

  <Modal v-if="showModalInfos" @updateCloseMain="postCloseLoggin" />

  <TheDropzone v-if="showUploadMode" @requestImageUpload="requestImageUpload"/>

  <CatalogoForm v-if="showCatalogo" :catalogoProp="currentAppCatalog" @deleteCatalog="deleteCatalog"/>

  <div v-if="isProductionBuild" class="productionMode"><h2>Aviable soon</h2></div>

  <notifications position="bottom center" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
import { getCataloghi_C, loadUserSettings, updateUser, existCatalogForUtente } from './types/FirebaseModel'
import { loadImagesFromCatalog_firebaseA } from './types/Firebase_immagini'
import { add_catalog_logic, delete_catalog_logic, change_catalog_logic } from '@/types/App.controller'
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
    let utenteSng = new Utente('')
    let currentAppCatalog = ref(new Catalogo('',''))
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

    return {  showModalInfos, showUploadMode, showCatalogo, showLogInArea, 
              toggleModalInfos, toggleUploadMode, toggleCatalogMode, postCloseLoggin, toggleDarkModeBtn, openUserSettings,
              currentAppCatalog, isProductionBuild,
              utenteSng, user, unsubscribe, isLogin, signIn, signIn_utente }
  },
  methods: {
    /**
     *  Ottiene lista cataloghi per utente corrente:
     *    - dopo la login autentication
     *    - imposta il primo catalogo disponibile
     *    - carica tutti i cataloghi
     *    - setta il catalogo corrente nella CatalogForm -inattiva
     *    - segnale di loaded
     */
    async loadUserCatalogsAsync(){
        console.log('🕰 App.loadUserCatalogsAsync() ')

       const cataloghi = await getCataloghi_C( this.user.uid ).catch( ()=> this.notificate({ title: "No catalog found", text: `Please insert a new catalog in user area`, type: 'warn', duration: 10000 }) )  // TODO: mostrare immagine-messaggio fisso in background
       if( cataloghi ){
        this.utenteSng.setListaCataloghi(cataloghi)
        if( ! this.utenteSng.selected_cid )
          { console.log('❌ utente senza cid nei cataloghi, assegno il primo disponibile'); this.utenteSng.selectFirstAviableCatalog() }

        if( ! await existCatalogForUtente(this.utenteSng.uid, this.utenteSng.selected_cid) )
          { console.log(`❌ utente con cid invalido, assegno il primo disponibile\n user: ${this.utenteSng.uid} \t req: ${this.utenteSng.selected_cid}`); this.utenteSng.selectFirstAviableCatalog() }
        
          // carico immagini catalogo selezionato
        this.load_images_by_cid(this.utenteSng.selected_cid)
              .then( (current_catalog) => { 
                            this.currentAppCatalog = current_catalog
                            this.loadingDone()
                            return this.utenteSng.getCataloghi_NON_sel()
                          })
              .then( otherCatalgs => otherCatalgs.forEach(c => this.load_images_by_cid(c.cid)) )
       }
    },
    async load_images_by_cid(cid : string){
      let listaImgs = await loadImagesFromCatalog_firebaseA(cid)
      this.utenteSng.setImages_by_cid(listaImgs, cid)
      console.log('\t 📚 Loaded catalog \t ', this.utenteSng.getCatalog_by_cid(cid).titolo)
      return this.utenteSng.getCurrentCatalog_cid()
    },
    notificate(notify){ this.$notify(notify) },
    async add_catalog(cid : string){
        add_catalog_logic(this, cid)
    },
    deleteCatalog(cid){ 
      delete_catalog_logic(this, cid)
    },
    loadingDone(){ console.log("loading user data done 😊"); this.showCatalogo = true },
    async requestImageUpload(file: HTMLInputElement, imgBase64: string, imageSizes: object){
      let i = new Immagine(imgBase64).setNomeFile(file.name).setClassStyle('imgUploadRequest').setCatalogID(this.utenteSng.selected_cid)
      i.width = imageSizes['width']
      i.height = imageSizes['height']
      i.size = file.size
      this.currentAppCatalog.listaImmagini.push(i)
      uploadSingleFile_firestore(file, i.catalogoID, i)
    },
    async change_catalog(cid : string){
      change_catalog_logic(this, cid)
    }
  },
  async mounted() {
    console.log('app.mounted()')

          // Avvio in dark mode
    document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })
    
          // watcher sullo stato utente firebase
    auth.onAuthStateChanged( user =>{
      if( user ){
          console.log('Auth status changed, user logged: \t', user['displayName'])
          loadUserSettings(user)
            .then( u => this.utenteSng = u )
            .then( () => this.loadUserCatalogsAsync() )
            .catch( ex => console.log(ex))
      }
      else {
        console.log('Auth status is: user un-logged')
        //unsub_refCatalogs && unsub_refCatalogs()
        this.utenteSng = new Utente('')
        this.showLogInArea = false
        this.showCatalogo = false
      }
    }) 

  }
})
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
  transform: scale(1.05);
}
#mainTitle{ 
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  background: 10rem rgba(var(--backgroundColor), .4);
  border-radius: 0.5rem;
  width: max(30%, 200px); 
  margin: 0rem auto 1rem;
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