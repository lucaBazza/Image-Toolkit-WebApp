<template>
  <div class="catalogDiv">
    <img v-if=" ! catalogIsReady" src="@/assets/loading-io-spinner.gif" alt="Catalog loading spinner" class="isReadySpinner"/>
    <h3 v-if="catalogoProp.titolo">{{ catalogoProp.titolo }} <button @click="openSortingOptions"> ↕️ </button></h3> 
    <ul>
      <span v-if=" ! catalogIsReady">Catalog not ready</span>
      <li v-else v-for="img in catalogoProp.listaImmagini" :key="img.nomeFile">
        <ImageExifViewer :imageRf="img" />
      </li>
      <em v-if=" ! catalogoProp.listaImmagini.length">No images in this catalog, add from ☁️ </em>
    </ul>
    <button @click="deleteAllImages()"> &nbsp; &nbsp; 🗑️ &nbsp;  &nbsp; </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import ImageExifViewer from "@/components/ImageExifViewer.vue"
import Catalogo from "@/types/Catalogo"
import Immagine from "@/types/Immagine"

const props = defineProps({   catalogoProp: {type: Catalogo, required: true }    })
let catalogIsReady = ref(false)

async function deleteAllImages() {
  console.log("deleteAllImages()");
}
function openSortingOptions(){
  console.log('openSortingOptions()')
}

onMounted(() => {
  console.log("CatalogoForm.mounted()")
  /*
  let listUrlImgs = props.catalogoProp.listaImmagini.map( img => img.realURL )
  props.catalogoProp.listaImmagini.forEach((img, i) => {
    img.src = listUrlImgs[i]; 
    img.classStyle = "";   //console.log(`img.src ${img.src} \t\t new img: ${listUrlImgs[i]}`)
  })
  */
  catalogIsReady.value = true
})

</script>

<style>
.catalogDiv{ margin: 3rem 0 }
.catalogDiv > ul { padding: 0 }
.catalogDiv > ul > em  { 
  margin: .5rem auto;
  color: var(--backText)
}

.catalogDiv > h3 {
  width: 50%;
  margin: 0 auto;
  border-bottom: 1px solid gray;
}
.catalogDiv > h3 > button { float: right; background: transparent; border: none; }
.catalogDiv > h3 > button:hover { cursor: grabbing }
.isReadySpinner {
  width: 3rem;
  position: absolute;
  top: 0.5rem;
  left: 50%;
}
.catalogDiv > button {
  background: transparent;
  border: none;
  font-size: 2rem;
  opacity: 0.9;
  backdrop-filter: blur(2px);
  margin-top: 50vh;
}
.catalogDiv > button:hover {
  cursor: grab;
  transform: scale(120%);
  transition: .1s;
}
.catalogDiv > p {
  background-color: var(--backgroundColor);
  text-align: center;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 1rem;
}
</style>




<!--


    /**
     *  - scarica l'immagine direttamente dalla GET
     *       - TODO: era più bello l'altro metodo con POST usando i params ma è complicato estrarre la stream response
     *  - se presente nei placeholder la aggiorna, altrimenti assegna unviable
     *  - se serve aggiorna visualizzazione
     */
    /*
    async requestImageForUser(urlServer, img, _catalogOwner) {
          //const requestOptions = {
          //  method: "POST",
          //  headers: { "Content-Type": "application/json" },
          //  body: JSON.stringify({ utente: _catalogOwner, richiestaImg: img })
          //};
          //const response = await fetch(url, requestOptions); //const data = await response.json();

      //console.log(`\t request Image For User() ${_catalogOwner} - ${img.name} - id: ${img.id}`)
      let urlImageRes = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img.src}`;
      console.log(urlImageRes);
      document.addEventListener("DOMContentLoaded", function () {
        let el  = document.getElementById(`img_${img.id}`) as HTMLImageElement;
        el.src = urlImageRes;
        el.classList.remove("loading");
      });

      
      //      // non selezionare l'immagine dall'id, ma dall'attributo ALT
      //      let el_id = `img_${img.id}`;
      //      //let el :  HTMLImageElement = (document.getElementById(el_id) as HTMLImageElement);
      //      let el = document.getElementById(el_id);
      //      if(el){
      //          let urlImageRes = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img.src}`
      //          // TODO : impleentare caso in cui la risorsa non c'è e quindi dà unviable
      //          el.src = urlImageRes;
      //          el.classList.remove('loading');
      //      }
      //      else console.log(`Element ${el_id} missing in DOM`);

            //[...document.getElementsByTagName('img')].forEach(imgEl => {
            //  if( imgEl.getAttribute('alt') === img )
            //    imgEl.src = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img}`;
            //});
    },
    */




    async mounted(){

      ... ... ... 

      //const loadingSrc = require("./../assets/loading.gif");
      //this.catalogoDB.listaImmagini = updateDatasCatalog.immagini;
      //this.catalogoDB.listaImmagini.forEach(function (v) {
      //  v.src = loadingSrc;
      //  v.class = "loading";
      //});

          // richiede img al server e visualizzala ( in lazy mode )
      // https://nicholasmarmonti.com/tutorial/image-lazy-load-metodo-semplice-leggerissimo/
      // https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/

      
      //this.catalogoDB.listaImmagini.forEach((img, i) => {
      //  img.src = listUrlImgs[i];
      //  img.class = ""; //img.datasrc = listUrlImgs[i];
      //});
      
            /*
                document.addEventListener('DOMContentLoaded', function (){
                    
                    [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
                        console.log()
                        img.setAttribute('src', img.getAttribute('data-src'));
                        img.onload = function() {
                            img.removeAttribute('data-src');
                            img.classList.remove('loading');
                        };
                        img.onerror = function() { console.log("Error loading "+ img.getAttribute('data-src')) };
                    })
                });
                */

            //updateDatasCatalog.immagini.forEach(img => console.log(img))
            //this.catalogoDB.listaImmagini.forEach(img => console.log(img))


    }



  async mounted() {
    console.log("Catalogo: mounted()");
  
    if (this.catalogIsReady) return;

        // RICHIEDE CATALOGO
    //const updateDatasCatalog = await this.requestCatalogForUser(this.cataRef.proprietario, Catalogo.id );
    //if (this.catalogIsOffline) return;

        // SALVO LISTA IMMAGINI SRC PER AGGIUNGERLA DOPO IL PLACEHOLDER
    let listUrlImgs = updateDatasCatalog.immagini.map((img) => img.src);

        // TODO VALIDITA
    console.log(`TODO check validità database todo ${updateDatasCatalog.catalogName} \t dimensione: ${updateDatasCatalog.immagini.length} 🌁`);
    this.cataRef.titolo = updateDatasCatalog.catalogName      //this.catalogoDB.catalogName = updateDatasCatalog.catalogName;
    this.cataRef.proprietario = updateDatasCatalog.catalogOwner //this.catalogoDB.catalogOwner = updateDatasCatalog.catalogOwner;
    this.cataRef.secretkey = updateDatasCatalog.secretKey       //this.catalogoDB.secretKey = updateDatasCatalog.secretKey;

        // AGGIORNA il catalogo, ma le immagini reali sono in stato di loading    
    const li : Immagine[] = listUrlImgs.map((img,idx) => { 
        //console.log(img); 
        let helpImg : Immagine = new Immagine(img,idx)
        helpImg.setExifDatas(updateDatasCatalog.immagini[idx].exifDatas)
        return helpImg;
    });
    this.cataRef.setListaImmagini(li)

        // RICHIEDO al server le immagini in base al tipo di url che ho nel catalogo
    this.cataRef.listaImmagini.forEach((img, i) => {
      const useCompiledURL = false;
      
          // Metodo con server che invia indirizzo assoluto
      //img.src = listUrlImgs[i];
          // Metodo con server che invia solo nomefile relativo
      img.src = useCompiledURL ? listUrlImgs[i] : `${Settings.getInstance().urlImageServer}/image?utente=${this.cataRef.proprietario}&richiestaImg=${listUrlImgs[i]}`

      img.classStyle = "";
    });
    
    this.catalogIsReady = true;
  }




    /**
     *  RICHESTA CATALOGO ATTUALMENTE SELEZIONATO DALL'UTENTE
     *    - ritorna una     
     *   
     * */
    async requestCatalogForUser(_catalogOwner, idCatalogo) {
      const urlServerAPI = Settings.getInstance().urlImageServer + "/imageList"

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", mode: 'no-cors' },
        body: JSON.stringify({
          title: "richiesta immagini utente",
          utente: _catalogOwner,
          id: idCatalogo
        }),
      };

      const response = await fetch(urlServerAPI, requestOptions)
        .then(async (res) => {
          const isJson = res.headers.get("content-type")?.includes("application/json");

          // check for error response
          if (!res.ok) {
            //const error = (data && data.message) || response.status; // get error message from body or default to response status
            //return Promise.reject(response.status);
            throw new Error("res.ok error")
          }

          this.catalogIsOffline = false;

          return res;
        })
        .catch((err) => {
          let e = `Server api ${urlServerAPI} is down 😭 \n ${err}`
          //console.log(`Server api ${url} is down 😭`);
          this.catalogIsOffline = true;
          //throw new Error(`Server api ${Settings.getInstance().urlImageServer} is down 😭 \n ${err}`);
          console.log(e)
        });


      if ( ! response )
        return { catalogName: "Catalog unaviable", listaImmagini: [] };
      
      const data = await response.json();
      console.log(`\n\t Catalogo: ${data.catalogName} \n\n`);

      return data;
    },




  computed: {
    isServerOffline(){ return fetch( Settings.getInstance().urlImageServer )
                                .then( res => { return res.status !== 200 })
                                .catch( () => { return false })
    }
  },


-->