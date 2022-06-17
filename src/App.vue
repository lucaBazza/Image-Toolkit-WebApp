<template>

  <AvatarUser v-if="isLogin" :utente="utenteSng" :userFS="user" :nome="user.displayName" :photoURL="user.photoURL" @click="openUserSettings"/>
  <button v-else @click="signIn" class="googleSignIn">
      <img src='./assets/logoGoogle.svg'/>Sign In
  </button>

  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <div class="controlBtns">
      <button @click="toggleDarkModeBtn">🌓</button>
      <button @click="toggleUploadMode" v-if="isLogin" >☁️</button>
      <button @click="toggleCatalogMode" v-if="isLogin" >📚</button>
      <button @click="toggleModalInfos">ℹ️</button>
  </div>

  <h1 id="mainTitle">Image Toolkit App</h1>

  <LoginArea v-if="showLogInArea" :utente="utenteSng" />

  <Modal v-if="showModalInfos" theme="sale" @updateCloseMain="postCloseLoggin" />

  <upload-media
      v-if="showUploadMode"
      class="upload-media"
      :server="settings.urlImageServer+'/formidable'"
      error=""
      v-bind:class="{ 'upload-media': '' }"
  />

  <CatalogoForm
      v-if="showCatalogo && ! isLoading"
      :urlServerImage="settings.urlImageServer"
      :catalogoRef="utenteSng.getCatalogoCurrent()"
  />

  <div v-if=" ! settings.isDevelopMode()" class="productionMode"><h2>Aviable soon</h2></div>

</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import Modal from "./components/Modal.vue"
import Settings from './types/Settings'
import Utente from './types/Utente'
import Catalogo from './types/Catalogo'
import Immagine from './types/Immagine'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from "vue-media-upload"

import { useAuth } from '@/firebase'
import firebase from 'firebase/compat/app';
import AvatarUser from './components/AvatarUser.vue';
import { getCataloghi, addCatalogo, cataloghiCollection, getCataloghi_B, onAuthStateChanged_luca, onAuthStateChanged_lucaB } from './types/FirebaseModel'
import { getDoc, getDocs } from '@firebase/firestore'

/**
 *    Roadmap
 *  . connettersi al database fire
 *  . registrare/loggare utente ( mail o google account )
 *  . prendere credenziali
 *  . visualizzarle asyncronamente sulla app
 *  . caricare la lista catalogo corrrentemente selezionata
 *  . per ogni catalogo, caricare la sotto-lista exifDatas e adjustments
 *  . caricato un catalogo, creare una secretKey per scaricare le foto
 *  . scaricare le foto
 *      - prima con get tradizionale
 *      - poi con post header ( secret key + user )
 * 
 *      https://www.youtube.com/watch?v=Htt8AKeF1Kw&t=283s 
 */

export default defineComponent({
  name: "App",
  components: { Modal, CatalogoForm, LoginArea, UploadMedia, AvatarUser },
  created(){ document.title = "Zabba image 🛠️ " },
  setup(){
    //const utenteSng = ref<Utente>(new Utente('','',''))
    let utenteSng = new Utente(''/*,'',''*/)
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

    const { user, isLogin, signIn, unsubscribe} = useAuth()

    const signIn_utente = ()=>{
      console.log("App.signIn_utente()")
      signIn()
    }

    /*const getUtente = () : Utente =>{
      return utenteSng
    }*/

    function setUtente(utente: Utente){
      utenteSng = utente
    }

    console.log(`app.setup() \t isLogin is : ${ isLogin ? 'true ' : 'false'}`)

    return {  utenteSng, settings, isLoading,
              showModalInfos, showUploadMode, showCatalogo, showLogInArea, 
              toggleModalInfos, toggleUploadMode, toggleCatalogMode, openUserSettings, postCloseLoggin, toggleDarkModeBtn, loadingDone, /*getUtente,*/
              setUtente,
              user, unsubscribe, isLogin, signIn, signIn_utente }
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
    console.log('app.mounted()')

          // Avvio in dark mode
    document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })

          // Check se produzione nascondo implementazione
    if( ! this.settings.isDevelopMode() ) this.productionView()

          // Carico utente > invio credenziali mandate al server  MODO A    
    //let helperUtente : Utente = await FetchUser('Luca','lkjh$33ASd','HGF475892SDG')
    //if( helperUtente.nome !== "" ){
    //  this.utenteSng = helperUtente
    //  this.loadingDone()
    //}
    
          // Carico utente > Firebase
    //onAuthStateChanged_luca( this.utenteSng )
    //onAuthStateChanged_lucaB()
    //  .then( (res)=>{ console.log('utente caricato, ora carico cataloghi!', res) })
    //  .catch( err => console.log(err) )

    function convertUser_Utente(u : firebase.User) : Utente{
        let displayName :string = u.displayName !
        let email = u.email !
        let photoURL = u.photoURL !
        let uid = u.uid
        return new Utente(displayName/*,'psw Google',[]*/)
                                  .setEmail(email).setPhotoURL(photoURL).setUID(uid).setCurrentCatalog(0)        
    }
    const auth = firebase.auth()
    auth.onAuthStateChanged( user =>{
      if( user ){
          console.log('Auth status changed, user logged: ', user['displayName'])
          this.utenteSng = convertUser_Utente(user as firebase.User)
          getCataloghi_B(this.utenteSng.uid)
            .then(datas => this.utenteSng.setListaCataloghi(datas) )
            .catch(ex => console.log('getCataloghi error: ', ex) )
      }
      else {
        console.log('Auth status is: user un-logged')
        //unsub_refCatalogs && unsub_refCatalogs()
        this.utenteSng = new Utente(''/*,'',[]*/)
        this.showLogInArea = false
        this.showCatalogo = false
      }
    })
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

.googleSignIn{ position: absolute; top: 0; left: 0; background: rgba(2,2,2, .3); border-radius: .5rem; border: none; margin: .3rem;   width: min(40%, 120px); color: var(--mainText)}
.googleSignIn > img{ width: 1.7rem; margin-right: .3rem; padding: .5rem; vertical-align: middle; }
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