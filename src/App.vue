<template>
  <p class="catalogOwner" @click="openUserSettings">👤 {{initialCatalog.catalogOwner}}</p>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp" />
  <div class="controlBtns">
    <button @click="toggleDarkModeBtn"> 🌓 </button>
    <button @click="toggleUploadMode"> ☁️ </button>
    <button @click="toggleCatalogMode"> 📚 </button>
    <button @click="toggleModalInfos">ℹ️</button>
  </div>
  <h1>{{ title }}</h1>

  <LoginArea v-if="showLogInArea" />  

  <Modal 
        v-if="showModalInfos"
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

  <Catalogo
    v-if="showCatalogo"
    :catalogName="initialCatalog.catalogName"
    :listaImmagini="initialCatalog.listaImmagini"
    :catalogOwner="initialCatalog.catalogOwner"
    :secretKey="initialCatalog.secretKey"
    :class="initialCatalog.class"
  />

</template>

<script lang="ts">
import { defineComponent } from "vue";  // QUESTO E' IL MAIN APP
import Modal from './components/Modal.vue'
import Catalogo from './components/Catalogo.vue'
import LoginArea from './components/LoginArea.vue'
//import ImageExifViewer from './components/ImageExifViewer.vue'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from 'vue-media-upload';

import EventEmitter from 'events'
const eventEmitter = new EventEmitter()

eventEmitter.on('toggleDarkMode',()=>{
    console.log("toggleDark mode 🍔")
    document.body.classList.toggle('darkMode')
    const hasDarkMode = document.body.classList.contains('darkMode') ? '-darkMode':''
    const reqSrc = require(`./assets/DSC09538-ProPs${hasDarkMode}.webp`);
    document.getElementsByClassName('headerImg')[0].setAttribute('src',reqSrc);
})

export default defineComponent({
  name: "App",
  components: { Modal, Catalogo, LoginArea, UploadMedia },
  created: function(){ document.title = "Zabba image 🛠️ " },
  data(){
    return{
      title: "Image Toolkit App",
      header: "Manage easly your images",
      text: "Create a catalog, upload your photos and edit them",
      hearts: 0,
      errMessage: 'asd',
      showModalInfos: false,
      showUploadMode: false,
      showCatalogo: true,
      showLogInArea: false,
      // restituisce un catalogo faked mentre carica async
      //  -> TODO: check local or init new catalog
      initialCatalog: this.initCatalogDatas(),

      //_urlServerImage: urlServerImage
    }
  },
  methods: {
    postCloseLoggin(){
      console.log("postCloseLoggin()\t\n azione modal")
      this.showModalInfos = false
    },
    registerName(){ 
      const input = this.$refs.name as HTMLInputElement | null;
      console.log( input != null ? input.value : "Catalog name missing" )
    },
    toggleDarkModeBtn(){
      eventEmitter.emit('toggleDarkMode')
    },
    toggleModalInfos(){
      this.showModalInfos = ! this.showModalInfos
    },
    toggleUploadMode(){
      this.showUploadMode = ! this.showUploadMode
    },
    toggleCatalogMode(){
        this.showCatalogo = ! this.showCatalogo
    },
    openUserSettings(){
        this.showLogInArea = ! this.showLogInArea; console.log("TODO openUserSettings()");
    },
    // ritorna l'oggetto catalogo che viene letto da data, secretKey da definire
    initCatalogDatas(){
      console.log('AppVue initCatalogDatas()');
      var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
      
      //var x = ___urlServerImage;
      //console.log(this.___MD5());
      return {  catalogName:'',
                //listaImmagini: [], 
                //numeroImmagini: 0, 
                catalogOwner: 'Luca',     // parametro verrà letto da cookies/ localstorage / mail val insieme a key
                secretKey: MD5(new Date()), 
                //secretKey: this.$.___MD5()(new Date()),  // TODO usare metodo globale
                class: 'catalogClass'
      }
    }
  }, // END METHODS
  async mounted() {
      // TODO: non usare eventEmitter ma basterebbe avere l'istanza di app.toggleDarkModeBtn()
      // https://stackoverflow.com/questions/54390842/how-to-access-a-property-of-the-inital-app-instance-in-a-vue-component-templat
      document.addEventListener('DOMContentLoaded', function () { eventEmitter.emit('toggleDarkMode') });
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
h1{
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  background: 10rem rgba(0,0,0,.4);
  border-radius: .5rem;
}
h3{ margin: 0 }

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
  right: .2rem;
}
.controlBtns > button{
  border: none;
  background: transparent;
  font-size: 1.7rem;
  cursor: grab;
}

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

<!--

//const urlServerImage = 'localhost:3000';
//console.log(urlServerImage) 
//eventEmitter.on('asyncFetchServer',()=>{
//    requestCatalogForUser(`http://${urlServerImage}/imagelist`,'Luca');
//})

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

  data.immagini.forEach((img,index) => {
      console.log(" - Immagine: " + img[0].imgFile);
      requestImageForUser(`http://${url}/image`, img[0].imgFile, _catalogOwner, index );
  });
  
}

/**
 *  - scarica l'immagine direttamente dalla POST (TODO: era più bello l'altro metodo usando i params ma è complicato estrarre la stream response)
 *  - se presente nel catalogo la aggiorna
 *  - se serve aggiorna visualizzazione
 */
async function requestImageForUser(urlServer, img, _catalogOwner, index) {
    //const requestOptions = {
    //  method: "POST",
    //  headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ utente: _catalogOwner, richiestaImg: img })
    //};
    //const response = await fetch(url, requestOptions); //const data = await response.json();

    console.log(`\t requestImageForUser() ${_catalogOwner} - ${img}`)
    
    // non selezionare l'immagine dall'id, ma dall'attributo ALT
    let el_id = `img_${index}`;
    let el :  HTMLImageElement = (document.getElementById(el_id) as HTMLImageElement);
    if(el && el.src){
      el.src = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img}`;
      el.classList.remove('loading');
    }
    else console.log(`Element ${el_id} missing in DOM`);


    //[...document.getElementsByTagName('img')].forEach(imgEl => {
    //  if( imgEl.getAttribute('alt') === img )
    //    imgEl.src = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img}`;
    //});   
}


    // avvia una richiesta asincrona al server, intanto restituisce nullo e poi aggionra con i dati ricevuti
    //getImagesFromServer(){
    //    console.log("getImagesFromServer()")
    //    eventEmitter.emit('asyncFetchServer')
    //    // ritorno un array fake, ma: TODO inserire nomi/titolo da catalogo, TODO quando caricato togliere classe loading
    //    return [
    //      { name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:0, done: false, title: 'Passo Sella' }
    //      //{ name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
    //      //{ name:'indef', src: require('./assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
    //    ] 
    //}


-->