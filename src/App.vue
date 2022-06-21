<template>

  <AvatarUser v-if="isLogin" :nome="user.displayName" :photoURL="user.photoURL" @click="openUserSettings"/>
  <button v-else @click="signIn" class="googleSignIn">
      <img src='./assets/logoGoogle.svg'/>Sign In
  </button>

  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <div class="controlBtns">
      <button @click="toggleDarkModeBtn">🌓</button>
      <button @click="toggleUploadMode" v-if="isLogin" >☁️</button>
      <button @click="toggleCatalogMode" v-if="! isLoading" >📚</button>
      <button @click="toggleModalInfos">ℹ️</button>
  </div>

  <h1 id="mainTitle">Image Toolkit App</h1>

  <LoginArea v-if="showLogInArea" :utente="utenteSng" @change_catalog="change_catalog" @notificate="notificate" @add_catalog="add_catalog"/>

  <Modal v-if="showModalInfos" theme="sale" @updateCloseMain="postCloseLoggin" />
  <!-- 
  <upload-media
      v-if="showUploadMode"
      class="upload-media"
      :server="settings.urlImageServer+'/formidable'"
      error=""
      v-bind:class="{ 'upload-media': '' }"
  />
  -->
  <input v-if="showUploadMode" type="file" @change="uploadImageInput" class="uploadImageCodeInspire" accept="image/*" multiple/>

  <CatalogoForm v-if="showCatalogo && ( ! isLoading )" :catalogoProp="currentAppCatalog"/>

  <div v-if=" ! settings.isDevelopMode" class="productionMode"><h2>Aviable soon</h2></div>

  <notifications position="bottom center" />
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import CatalogoForm from "./components/CatalogoForm.vue"
import LoginArea from "./components/LoginArea.vue"
import AvatarUser from './components/AvatarUser.vue'
import Modal from "./components/Modal.vue"
import Settings from './types/Settings'
import Utente from './types/Utente'
import Catalogo from './types/Catalogo'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from "vue-media-upload"

import { useAuth } from '@/firebase'
import firebase from 'firebase/compat/app'

import { getCataloghi_C, get_firebaseID_currentCatalogo, get_firebaseID_currentCatalogo_B, loadImagesFromCatalog_firebaseA } from './types/FirebaseModel'
import uploadImageCodeInspire from '@/utilities/uploadImageCodeInspire'

/**
 *    Roadmap
 *  . connettersi al database firestore
 *  . registrare/loggare utente ( mail o google account )
 *  . prendere credenziali
 *  . visualizzarle asyncronamente sulla app
 *  . caricare la lista catalogo corrrentemente selezionata
 *  . per ogni catalogo, caricare la sotto-lista exifDatas e adjustments  TODO check it
 *  . caricato un catalogo, creare una secretKey per scaricare le foto
 *  . scaricare le foto
 *      - prima con get tradizionale
 *      - poi con post header ( secret key + user )
 * 
 *      https://www.youtube.com/watch?v=Htt8AKeF1Kw&t=283s 
 * 
 *  . quando carica un catalogo, impostare random come sfondo una delle immagini ?
*/

export default defineComponent({
  name: "App",
  components: { Modal, CatalogoForm, LoginArea, AvatarUser, UploadMedia },
  created(){ document.title = "Zabba image 🛠️ " },
  setup(){
    console.log(`app.setup()`)

    let utenteSng = new Utente('')  //ref<Utente>( new Utente('') )
    let currentAppCatalog = ref(new Catalogo('',''))
    const settings = Settings.getInstance()
    const { user, isLogin, signIn, unsubscribe} = useAuth()

    let isLoading = ref(true)
    let showModalInfos = ref(false)
    let showUploadMode = ref(false)
    let showCatalogo = ref(true)
    let showLogInArea = ref(false)
 
    const toggleModalInfos = ()=>{ showModalInfos.value = ! showModalInfos.value }
    const toggleUploadMode = ()=>{ showUploadMode.value = ! showUploadMode.value }
    const toggleCatalogMode = ()=>{ showCatalogo.value = ! showCatalogo.value }
    const openUserSettings = ()=>{ showLogInArea.value = ! showLogInArea.value }
    const postCloseLoggin = ()=>{ toggleModalInfos() }
    const toggleDarkModeBtn = ()=>{ document.body.classList.toggle("darkMode") }
    const loadingDone = ()=>{ console.log("loading user data done 😊"); isLoading.value = false }
    const signIn_utente = ()=>{ signIn() }

    return {  utenteSng, settings, isLoading,
              showModalInfos, showUploadMode, showCatalogo, showLogInArea, 
              toggleModalInfos, toggleUploadMode, toggleCatalogMode, openUserSettings, postCloseLoggin, toggleDarkModeBtn, loadingDone,
              currentAppCatalog,
              user, unsubscribe, isLogin, signIn, signIn_utente }
  },
  methods: {
      // in produzione al momento visualizzo solo il pulsante 'aviable soon'
    productionView(){
      console.log('productionView()')
      document.getElementsByClassName('catalogOwner')[0].setAttribute('hidden','');
      document.getElementsByClassName('controlBtns')[0].setAttribute('hidden','');
    },
    convertUser_Utente(u : firebase.User) : Utente{
        let displayName = u.displayName !
        let email = u.email !
        let photoURL = u.photoURL !
        let uid = u.uid
        return new Utente(displayName).setEmail(email).setPhotoURL(photoURL).setUID(uid)    
    },
    async loadUserCatalogsAsync(){
        console.log(' 🕰 App.loadUserCatalogsAsync() ')
                      
        getCataloghi_C(this.utenteSng.uid)
            .then( res => { return this.utenteSng.setListaCataloghi(res).selectFirstAviableCatalog() })
            .then( res =>{ 
              //this.load_images_by_cid(res.selected_cid) // carica usando il cid del primo elemento della lista
              this.utenteSng.listaCataloghi.forEach(c =>  this.load_images_by_cid(c.cid))
            })  

            .then( res => {
                    this.currentAppCatalog = this.utenteSng.getCurrentCatalog_cid()

                    //console.log("⚠️ \t ", this.currentAppCatalog)

                    console.log('App.load_images_by_cid() \t current catalog: ', this.utenteSng.getCurrentCatalog_cid().cid )

                    setTimeout(()=>this.loadingDone(),200) // TODO SVILUPPARE
            })

            .catch( ex => this.notificate({ title: "No catalog found", text: `Please insert a new catalog in user area <br><br>${ex.message}`, type: 'warn', duration: 20000 }) )
    },
    async load_images_by_cid(cid : string){
      //console.log('\t 📚 App.load_images_by_cid() \t cid: ',cid)

      let listaImgs = await loadImagesFromCatalog_firebaseA(cid)
      this.utenteSng.setImages_by_cid(listaImgs, cid)

      console.log('\t 📚 Loaded catalog \t ', this.utenteSng.getCatalog_by_cid(cid).titolo)
      return this.utenteSng
    },
    notificate(notify){ this.$notify(notify) },
    add_catalog(catalog : Catalogo){
        this.utenteSng.listaCataloghi.push(catalog)
        this.loadUserCatalogsAsync()
        this.notificate({ title: "Catalog added", text: catalog.titolo, type: 'info' })
    },
    /**
     *  catalogID specifica il nome del catalogo FS (quindi se custm genera una nuova entry)
     *    - ottiene l'id universale di firebase per il catalogo dove fare l'upload
     *    - se trovato, avvia l'upload delle immagini una dopo l'altra
     *    ->  TODO: dopo l'update, chiudi il file uploader e visualizza il catalogo aggiornato
     */
    async uploadImageInput(event){
      //get_firebaseID_currentCatalogo( this.utenteSng.getIndexCatalogoCurrent() )
      //  .then( x => uploadImageCodeInspire(event,x) )
      
      console.log(`upload in cid: ${this.utenteSng.getCurrentCatalog_cid().cid} \t imgs: ${event.target.files}`)
      uploadImageCodeInspire(event, this.utenteSng.selected_cid)

      setTimeout(()=>this.loadUserCatalogsAsync(),10*1000)  // TODO Implementare soluzione reale 
    },
    /**
     *    Cambia il catalogo selezionato usando il cid (aggiorna utente e catalogo aperto)
     */
    async change_catalog(cid : string){
      console.log('App.change_catalog() \t cid:', cid)
      
      //this.utenteSng.setCurrentCatalog_cid(cid)
      //console.log( this.utenteSng.getCurrentCatalog_cid() )
      this.utenteSng.selected_cid = cid

      if( ! this.utenteSng.getCatalog_by_cid(cid).listaImmagini.length){
        console.log(`Catalogo: ${cid} non immagini caricate, provvedo a scaricarle`)
        let listaImgs = await loadImagesFromCatalog_firebaseA(cid)
        this.utenteSng.setImages_by_cid(listaImgs,cid)
        console.log(`Ok caricate, verifica # ${this.utenteSng.listaCataloghi.length}`)
      }
      //this.utenteSng.listaCataloghi.
      this.currentAppCatalog = this.utenteSng.getCatalog_by_cid(cid)
      
      console.log('App.change_catalog() \t titolo: ',this.currentAppCatalog.titolo)
    }
  },
  async mounted() {
    console.log('app.mounted()')

          // Avvio in dark mode
    document.addEventListener("DOMContentLoaded", function () { document.body.classList.toggle("darkMode") })

          // Check se produzione nascondo implementazione
    if( ! this.settings.isDevelopMode() ) this.productionView()
    
          // Carico utente > Firebase
    const auth = firebase.auth()
    auth.onAuthStateChanged( user =>{
      if( user ){
          console.log('Auth status changed, user logged: \t', user['displayName'])
          this.utenteSng = this.convertUser_Utente(user as firebase.User)
          this.loadUserCatalogsAsync()
      }
      else {
        console.log('Auth status is: user un-logged')
        //unsub_refCatalogs && unsub_refCatalogs()
        this.utenteSng = new Utente('')
        this.showLogInArea = false
        this.showCatalogo = false
      }
    })


    //setTimeout(() => { console.log('\n\n\nTESTING\n\n\n'); this.change_catalog(this.utenteSng.listaCataloghi[1].cid)   }, 2000) // TESTING 
    //setTimeout(() => { console.log('\n\n\nTESTING\n\n\n'); this.change_catalog(this.utenteSng.listaCataloghi[2].cid)   }, 8000) // TESTING 


  }
})
</script>

<style>
/** questo è globale */
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
h1 {
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  background: 10rem rgba(var(--backgroundColor), .4); /*background: 10rem rgba(0, 0, 0, 0.4); */
  border-radius: 0.5rem;
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
  /*mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);*/
}
/*.darkMode > .headerImg{ filter:invert(0.5) } */
#mainTitle{ width: max(30%, 200px); margin: 0rem auto 1rem; }
.upload-media {
  margin-left: 10%;
  width: 80%;
  height: 100%;
  margin-top: 5%; /*background: var(--backgroundColor);*/
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

.catalogOwner {
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

.googleSignIn{ 
  position: absolute; 
  top: 0; left: 0; 
  background: rgba(2,2,2, .3); 
  border-radius: .5rem; 
  border: none; 
  margin: .3rem; 
  width: min(40%, 120px);
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






ON USER STATE CHANGE TRUE

          
  getCataloghi_B(this.utenteSng.uid)
    .then(datas => { 
      this.utenteSng.setListaCataloghi(datas) 
      loadImagesFromCatalog_firebaseA( this.utenteSng.getIndexCatalogoCurrent() )
        .then( resImgs => { 
          console.log(this.utenteSng.listaCataloghi.length)

          resImgs = [ new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)]
          //setImagesForCurrentCatalog(this.utenteSng, resImgs )
        })
    
    })
    .catch(ex => console.log('getCataloghi error: ', ex) )
    /*.then( ()=> {
      let catalogID = this.utenteSng.getIndexCatalogoCurrent()
      console.log('getCataloghi_B() -> then() II  \n\n ' , this.utenteSng)

      loadImagesFromCatalog_firebaseA(catalogID)
        //.then( resImgs => resImgs && this.utenteSng.getCatalogoCurrent().setListaImmagini(resImgs)  )
        .then( resImgs => { 
            let testImgs : Immagine[] = [ new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)]
            if(resImgs){
              console.log(this.utenteSng.listaCataloghi)
              //console.log('utente sng current cat: ', this.utenteSng.getCatalogoCurrent())
              //this.utenteSng.getCatalogoCurrent().setListaImmagini([ new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)]) 
              //this.utenteSng.setImagesForCurrentCatalog([ new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)]) 
              setImagesForCurrentCatalog(this.utenteSng,testImgs )
            }
            else 
              console.log('no imgs')  
        })
        .then( () => this.loadingDone() )
        .catch( ex =>  console.log('getCataloghi getImages error: ', ex) )
            }) 
            




      LOAD ASYNC DATAS

getCataloghi_B(this.utenteSng.uid)
  .then( datas => {
    console.log("\n 💀 getCataloghi_B() POST cataloghi caricati: ", datas.length , "\n\n")
    let ut : Utente = this.utenteSng.setListaCataloghi(datas as Catalogo[])
    return ut
  })
  .then( resUtente => console.log(resUtente, 
                      resUtente.listaCataloghi.length, 
                      this.utenteSng.listaCataloghi.length,
                      resUtente.getListaCataloghi().length 
                    ) 
  )
  .catch(ex => console.log(ex) )






async loadUserDatasAsync(){
    console.log(' 🕰 App.loadUserDatasAsync() ')
                  
    getCataloghi_C(this.utenteSng.uid)
        .then( res => { return this.utenteSng.setListaCataloghi(res) })
        .then( () =>{ 
            // metodo con lista immagini caricate da firestore per il catalogo corrente 
              //   - TODO : fare per i primi N cataloghi
          console.log('getCataloghi_C() II ')
          let firebase_catalogID = get_firebaseID_currentCatalogo_B(this.utenteSng.getIndexCatalogoCurrent)
          console.log('firebase_catalogID: ', firebase_catalogID)

          //testImgs = loadImagesFromCatalog_firebaseA(firebase_catalogID)

              // metodo con immagini caricate fake
          //this.utenteSng = res.setListaImmagini_currentCatalog(testImgs)

      
          this.currentAppCatalog = this.utenteSng.getCatalogoCurrent()


          console.log(`\n✅   getCataloghi_C()
                              \n\t\t cataloghi: ${this.utenteSng.listaCataloghi.length}
                              \n\t\t current images:  ${this.utenteSng.getCatalogoCurrent().listaImmagini.length}\n\n`)
          this.loadingDone()

          //console.log(this.utenteSng.listaCataloghi)

          // < = = = = =   TESTING : dopo 4 secondi, cambio catalogo da app, a cascata deve aggiornare CatalogForm, ImageExifViewer, Login Area
          //setTimeout( ()=>{ console.log('update cat'); this.update_utente(3) }, 2000 )
                //setTimeout(()=>{ this.currentAppCatalog.titolo = 'titolo aggiornato'; console.log('titolo agg')} ,1000)

          
        })
        .catch( () => this.notificate({ title: "No catalog found", text: "Please insert a new catalog in user area", type: 'warn' }) )
},



/*async loadImages_ofCatalog(id : number){
  console.log(` 🕰 App.loadImages_ofCatalog() \t id: ${id}, selected: ${this.utenteSng.indexCatalogNow}`)
  let firebase_catalogID = await get_firebaseID_currentCatalogo_B(id)
  //console.log('firebase_catalogID: ', firebase_catalogID)

  // finchè non viene implementato il caricamento del campo cid (fs) da catalogo TODO
  // lo carico da qui
  this.utenteSng.getListaCataloghi()[id].setCatalog_cid(firebase_catalogID)

  let listaImgs = await loadImagesFromCatalog_firebaseA(firebase_catalogID)
  //console.log( 'load images:  ', listaImgs)
  this.utenteSng.setImages_by_cid(listaImgs, firebase_catalogID)
  ///console.log('\n\n END load images: ', this.utenteSng.listaCataloghi.map(c=>c.listaImmagini), "\n\n")

  this.currentAppCatalog = this.utenteSng.getCatalogoCurrent()
  this.loadingDone()



  //setTimeout(() => {  this.change_catalog(this.utenteSng.listaCataloghi[1].cid)   }, 2000) // TESTING 



},*/




--> 