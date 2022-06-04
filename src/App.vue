<template>
  <p class="catalogOwner" @click="openUserSettings">👤 {{catalogOwner}}</p>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <div class="controlBtns">
    <button @click="toggleDarkModeBtn"  > 🌓 </button>
    <button @click="toggleUploadMode"> ☁️ </button>
  </div>
  <h1>{{ title }}</h1>

  <!-- <br>
    <input id="registerName" type="text" ref="name" @keyup.enter="registerName"><br>
    <button @click.shift="handleClick">click me with shift</button> 
    <div v-if="hearts > 0" class="heartContainer">
      <span v-for="heart in hearts">❤️</span>
    </div>
  -->

  <Modal 
        :header="header" 
        :text="text"
        theme="sale"
        @updateCloseMain='postCloseLoggin'
  />

  <upload-media 
      v-if="showUploadMode"
      class="upload-media"
      server="http://localhost:3000/formidable"
      error=""
      v-bind:class="{ 'upload-media': ''}"
  />

  <li v-for="img in imagesLoaded" :key="img.id">
    <ImageExifViewer
      :imageName="img.name"
      :imageTitle="img.title"
      :imageSrc="img.src"
      :exifDatas="img.datas"
      :class="img.class"
      :id="img.id"
    />
  </li>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from './components/Modal.vue'
import ImageExifViewer from './components/ImageExifViewer.vue'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from 'vue-media-upload';

const urlServerImage = 'localhost:3000';

const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
eventEmitter.on('toggleDarkMode',()=>{
    console.log("toggleDark mode 🍔")
    document.body.classList.toggle('darkMode')
    const hasDarkMode = document.body.classList.contains('darkMode') ? '-darkMode':''
    const reqSrc = require(`./assets/DSC09538-ProPs${hasDarkMode}.webp`);
    document.getElementsByClassName('headerImg')[0].setAttribute('src',reqSrc);
})

eventEmitter.on('asyncFetchServer',()=>{
    requestCatalogForUser(`http://${urlServerImage}/imagelist`,'Luca');
})

// POST request using fetch with async/await
async function requestCatalogForUser(url, _catalogOwner) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "richiesta immagini utente", utente: _catalogOwner })
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();

  console.log(`\n${data.catalogName} \t #${data.numeroImmagini} \n\n`);
  //aggiornaMetasCatalogo(data);
  //this.aggiornaMetasCatalogo(data);

  data.immagini.forEach(img => {
      console.log(" - Immagine: " + img[0].imgFile);
      requestImageForUser(`http://${urlServerImage}/image`, img[0].imgFile, _catalogOwner );
  });
  
}

/**
 *  - scarica l'immagine direttamente dalla POST (TODO: era più bello l'altro metodo usando i params ma è complicato estrarre la stream response)
 *  - se presente nel catalogo la aggiorna
 *  - se serve aggiorna visualizzazione
 */
async function requestImageForUser(urlServer, img, _catalogOwner) {
    //const requestOptions = {
    //  method: "POST",
    //  headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ utente: _catalogOwner, richiestaImg: img })
    //};
    //const response = await fetch(url, requestOptions); //const data = await response.json();

    console.log(`\t requestImageForUser() ${_catalogOwner} - ${img}`)
    
    // non selezionare l'immagine dall'id, ma dall'attributo ALT
    let el :  HTMLImageElement = (document.getElementById('img_0') as HTMLImageElement);
    el.src = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img}`;


    //[...document.getElementsByTagName('img')].forEach(imgEl => {
    //  if( imgEl.getAttribute('alt') === img )
    //    imgEl.src = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img}`;
    //});

    
    el.classList.remove('loading');
}

export default defineComponent({
  name: "App",
  components: { Modal, ImageExifViewer, UploadMedia /*, UpdateMedia*/ },
  data(){
    return{
      title: "Image Toolkit App",
      header: "Manage easly your images",
      text: "Create a catalog, upload your photos and edit them",
      catalogOwner: 'Luca',
      hearts: 0,
      errMessage: 'asd',
      showUploadMode: false,
      postId: -1,
      imagesLoaded: this.getImagesFromServer() // ritorna [{name, src ..}..]
    }
  },
  methods: {
    handleClick(){
      let refName:any = this.$refs.name
      refName.classList.add('active')
      refName.focus()
      this.hearts++
    },
    postCloseLoggin(){ 
      console.log("postCloseLoggin()\t\n azione modal")
    },
    registerName(){ 
      const input = this.$refs.name as HTMLInputElement | null;
      console.log( input != null ? input.value : "Catalog name missing" )
    },
    toggleDarkModeBtn(){
      eventEmitter.emit('toggleDarkMode')
    },
    toggleUploadMode(){
      this.showUploadMode = ! this.showUploadMode;
    },
    openUserSettings(){
      console.log("TODO openUserSettings()");
    },
    requireExifs(){
      return [
              { label:'ImageWidth', val: '4072' }, 
              { label:'ImageHeight', val: '6108' },
              { label:'Software', val: 'Adobe Photoshop 22.1 (Macintosh)' },
              { label:'ModifyDate', val: '2021:05:24 16:07:10' },
              { label:'Copyright', val: 'zabba.lucabazzanella.com' },
              { label:'Aspect ratio', val: '4/5' },
              { label:'gps', val: "/"},
              { label:'classificazione', val: "⭐⭐⭐"},
              { label:'note', val: "..."}
      ]
    },
    aggiornaMetasCatalogo(data){
        console.log('aggiorna catalogo()');
        // TODO aggiornare (attenzione che siamo fuori da app.data ! )
        //console.log(this.imagesLoaded);
    },
    // avvia una richiesta asincrona al server, intanto restituisce nullo e poi aggionra con i dati ricevuti
    getImagesFromServer(){
        console.log("getImagesFromServer()")
        eventEmitter.emit('asyncFetchServer')
        // ritorno un array fake, ma: TODO inserire nomi/titolo da catalogo, TODO quando caricato togliere classe loading
        return [
          { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:0, done: false, title: 'Passo Sella' },
          { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
          { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
        ] 
    }
  },
  async mounted() {
    document.addEventListener('DOMContentLoaded', function () {
        document.title = "Zabba image 🛠️ "
        eventEmitter.emit('toggleDarkMode')
    });
}
});
</script>

<style>
/** questo è globale */
/*.darkMode > .darkModeBtn::before{ content: 'asdf' } */
.darkMode{
    --backgroundColor: #111;
    --mainText: #fff;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1{
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  color: white; 
  background: 10rem rgba(0,0,0,.4);
  border-radius: .5rem;
}
.headerImg{ 
  z-index: -1;
  position: fixed;
  left:0;
  top: 0;
  height: 30vh;
  width: 100%;
  object-fit: cover;
  filter: blur(2px);
  /*mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);*/
}
/*.darkMode > .headerImg{ filter:invert(0.5) } */
.heartContainer{ padding: 1rem }
.upload-media{
  margin-left:10%;
  width: 80%;
  height: 100%;
  margin-top: 5%;
  /*background: var(--backgroundColor);*/
}

.controlBtns{
  position: absolute;
  top: 0.2rem;
  right: 3.5rem;
}
.controlBtns > button{
  border: none;
  background: transparent;
  font-size: 1.7rem;
  cursor: grab;
}

li{ list-style-type: none }

.catalogOwner{ 
  color: var(--mainText);
  position: absolute;
  padding: .7rem;
  margin:0;
  top: .4rem;
  left: .4rem;
  line-height: 1;
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.3);
   -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.catalogOwner:hover{
  font-size: 150%;
  transition: .4s;
  cursor: cell;
}
</style>

<!-- 

 // avvia una richiesta asincrona al server, intanto restituisce nullo e poi aggionra con i dati ricevuti
    getImagesFromServer(){
        // Simple POST request with a JSON body using fetch
        /*
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Vue POST Request Example" })
        };
        //fetch(`http://${urlServerImage}/images/${this.catalogOwner}`, requestOptions)
        fetch(`http://${urlServerImage}/images/Luca`, requestOptions)
          .then(response => response.json())
          .then(data => { 
            console.log(data);
            (this.postId = data.id)
          })
          .catch(error => { console.log('getImagesFromServer() \t There was an error! \n' + error); });
        */

        

        //return [
        //  { name: 'Passo Sella',  src: require('./assets/DSC08174_ps.jpg'), datas:this.requireExifs(), id:0, done: false },
        //  { name: 'Corvo',        src: require('./assets/DSC08271_ps_5x7.jpg'), datas:this.requireExifs(), id:1, done: false },
        //  { name: 'Tenda',        src: require('./assets/DSC08158_ps_5x7.jpg'), datas: this.requireExifs(), id:2, done: false }
        //]

        console.log("getImagesFromServer()")
        eventEmitter.emit('asyncFetchServer')
        // ritorno un array fake, ma: TODO inserire nomi/titolo da catalogo, TODO quando caricato togliere classe loading
        return [
          { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:0, done: false, title: 'Passo Sella' },
          { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
          { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
        ] 
    }

-->