<template>
  <div class="catalogDiv">
    <img v-if="!catalogIsReady" src="@/assets/loading-io-spinner.gif" alt="Catalog loading spinner" class="isReadySpinner"/>
    <h3 v-if="cataRef.titolo">{{ cataRef.titolo }}</h3>
    <p v-if="catalogIsOffline">😭 Image catalog server is offline 😭</p>
    <ul v-else>
      <li v-for="img in cataRef.listaImmagini" :key="img.id">
        <ImageExifViewer :imageRf="img" />
      </li>
    </ul>
    <button v-if="!catalogIsOffline" @click="deleteAllImages()">🗑️</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue"
import Settings from '@/types/Settings';
import ImageExifViewer from "@/components/ImageExifViewer.vue"
import Catalogo from "@/types/Catalogo"
import Immagine from '@/types/Immagine'
//import fetch from "node-fetch"

// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists
export default defineComponent({
  name: "CatalogoForm",
  components: { ImageExifViewer },
  // PROPS SONO SOLO IN LETTURA PER IL COMPONENTE
  props: {
    //urlServerImage: { required: true, type: String},
    catalogoRef: { required: true, type: Catalogo }
  },
  setup(props){
    let cataRef = props.catalogoRef

    cataRef.titolo = '. . . loading catalog . . .' //console.log("setup titolo: " + cataRef.titolo);

    return { cataRef }
  },
  data() {
    // counter only uses this.initialCounter as the initial value;
    // it is disconnected from future prop updates.
    return {
      catalogIsReady: false,
      catalogIsOffline: true,
    }
  },
  computed: {
    isServerOffline(){ return fetch(Settings.getInstance().urlImageServer) //return fetch(this.___urlServerImage)
                                .then(function(res){ return res.status!==200})
                                .catch((err) => { return false });
    }
  },
  // created avviene prima che i data() siano caricati
  //created: function () { catalogoDB.listaImmagini = this.getImagesFromServer() },
  methods: {
    /**
     *  avvia una richiesta asincrona al server,
     *      - intanto restituisce una image placeholder di loading
     *      - poi aggionra con i dati ricevuti
     */
    getImagePlaceHolder() {
      return [
        {
          name: "loading",
          src: require("./../assets/loading.gif"),
          class: "loading",
          datas: [], //this.requireFakeExifs(),
          id: 0,
          done: false,
          title: "Passo Sella",
        },
        //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
        //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
      ];
    },
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
      


      /*try {
        const response = await fetch(Settings.getInstance().urlImageServer,
                                      { method: 'POST', headers: { accept: 'application/json' }});

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (err) { console.log(err); }
      return { catalogName: "Catalog unaviable", listaImmagini: [] } */

    },

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
    async deleteAllImages() {
      console.log("deleteAllImages()");
      var r = confirm("Are you sure you want to delete all images?");
      if (r == true) {
        console.log("Post delete");
        const res = await fetch(`${Settings.getInstance().urlImageServer}/deleteAll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ utente: this.cataRef.proprietario /*this.catalogoDB.catalogOwner*/ }),
        }).catch((err) => {
          console.log(`Server api ${Settings.getInstance().urlImageServer} is down 😭`);
          this.catalogIsOffline = true;
        });
      } else console.log("Images saved from destruction");
    },
  }, // END METHODS
  /*
   *   mounted avviene dopo che datas sono stati caricati
   *       -> richiede il catalogo reale dal server
   *       -> TODO: controlla la validità utente, secret key, class
   *       -> aggiorna la listaImmagini inserendo solo i metas
   *       -> per ogni immagine-meta nel db, la richiede al server e visualizza
   *
   */
  async mounted() {
    console.log("Catalogo: mounted()");

    if (this.catalogIsReady) return;

    // RICHIEDE CATALOGO
    const updateDatasCatalog = await this.requestCatalogForUser(/*`${Settings.getInstance().urlImageServer}/imagelist`,*/ this.cataRef.proprietario, Catalogo.id/*this.cataRef.id*/ );
    if (this.catalogIsOffline) return;

    // SALVO LISTA IMMAGINI SRC PER AGGIUNGERLA DOPO IL PLACEHOLDER
    let listUrlImgs = updateDatasCatalog.immagini.map((img) => img.src);

    // TODO VALIDITA
    console.log(`TODO check validità database todo ${updateDatasCatalog.catalogName} \t dimensione: ${updateDatasCatalog.immagini.length} 🌁`);
    this.cataRef.titolo = updateDatasCatalog.catalogName;       //this.catalogoDB.catalogName = updateDatasCatalog.catalogName;
    this.cataRef.proprietario = updateDatasCatalog.catalogOwner //this.catalogoDB.catalogOwner = updateDatasCatalog.catalogOwner;
    this.cataRef.secretkey = updateDatasCatalog.secretKey       //this.catalogoDB.secretKey = updateDatasCatalog.secretKey;

    // Aggiorna il catalogo, ma le immagini reali sono in stato di loading
    //const li : Immagine[] = []
    //listUrlImgs.forEach(i => li.push(new Immagine(i.src,i.id)));
      //listUrlImgs.map((img,idx) => new Immagine(img.src,img.id).setExifDatas(updateDatasCatalog.immagini[idx].exifDatas));
    
    const li : Immagine[] = listUrlImgs.map((img,idx) => { 
        //console.log(img); 
        let helpImg : Immagine = new Immagine(img,idx)
        helpImg.setExifDatas(updateDatasCatalog.immagini[idx].exifDatas)
        return helpImg;
    });
    this.cataRef.setListaImmagini(li)

    // in base al tipo di url che ho nel catalogo, vado a richiedere al server
    this.cataRef.listaImmagini.forEach((img, i) => {
      const useCompiledURL = false;
      
          // Metodo con server che invia indirizzo assoluto
      //img.src = listUrlImgs[i];
          // Metodo con server che invia solo nomefile relativo
      img.src = useCompiledURL ? listUrlImgs[i] : `${Settings.getInstance().urlImageServer}/image?utente=${this.cataRef.proprietario}&richiestaImg=${listUrlImgs[i]}`

      img.classStyle = "";
    });
    
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

    this.catalogIsReady = true;
  },
})
</script>

<style>
/** style scooped */
ul {
  padding: 0;
}
li {
  list-style-type: none;
}
h2, p {
  color: var(--mainText);
}
h3 {
  border-bottom: 1px solid gray;
}
.isReadySpinner {
  width: 3rem;
  position: absolute;
  top: 0.5rem;
  left: 50%;
}
.catalogDiv{ margin: 4rem 0 }
.catalogDiv > button {
  background: transparent;
  border: none;
  font-size: 2rem;
  margin: 2rem;
  opacity: 0.9;
  backdrop-filter: blur(2px);
}
.catalogDiv > button:hover {
  cursor: grab;
  box-shadow: 20px 20px 20px 20px #888888;
}

.catalogDiv > p {
  background-color: var(--backgroundColor);
  text-align: center;
  margin: 0 20%;
  padding: 1rem;
  border-radius: 1rem;
}
</style>
