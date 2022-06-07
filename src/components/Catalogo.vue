<template>
    <div class="catalogDiv">
        <img v-if=" ! catalogIsReady" src="@/assets/loading-io-spinner.gif" alt="Catalog loading spinner" class="isReadySpinner"/>
        <h3 v-if="catalogoDB.catalogName">{{catalogoDB.catalogName}}</h3>
        <p v-if="catalogIsOffline"> 😭 Image catalog server is offline 😭 </p>
        <ul v-else>
            <li v-for="img in catalogoDB.listaImmagini" :key="img.id">
                <ImageExifViewer
                    :imageName="img.name"
                    :imageTitle="img.title"
                    :imageSrc="img.src"
                    :exifDatas="img.exifDatas || img.datas"
                    :class="img.class"
                    :id="img.id"
                />
            </li>
        </ul>
        <button v-if=" ! catalogIsOffline" @click="deleteAllImages()"> 🗑️ </button>
    </div>
</template>
<script>
import ImageExifViewer from './ImageExifViewer.vue'

// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists
  export default {
    name: "CatalogComponent",
    components: { ImageExifViewer },
    // PROPS SONO SOLO IN LETTURA PER IL COMPONENTE     TODO: VEDERE COME PASSARE IL V-BIND CORRETTAMENTE
    //props: [ 'initialCatalog' ],  props: { initialCatalog: {} },
    props: {
        catalogName: String,
        //numeroImmagini: Number,
        //listaImmagini: {},
        catalogOwner: String,
        secretKey: String,
        class: String,
    },
    data(){  
        // counter only uses this.initialCounter as the initial value;
        // it is disconnected from future prop updates.
        return{
            //catalogoDB: this.initialCatalog // this.initialCatalog();
            catalogoDB: { 
                catalogName: this.catalogName,
                listaImmagini: this.getImagePlaceHolder(),
                catalogOwner: this.catalogOwner, 
                secretKey: this.secretKey, 
                class: this.class,
                //isOffline: 
            },
            catalogIsReady: false,
            catalogIsOffline: {},
            urlServerImage: this.___urlServerImage
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
        getImagePlaceHolder(){
             return [
                { name:'loading', src: require('./../assets/loading.gif'), class:'loading', datas: this.requireExifs(), id:0, done: false, title: 'Passo Sella' }
                //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
                //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
            ]
        },
        // metodo fake che ristituisce i dati exif di ogni immagine
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
        // POST request using fetch with async/await
        async requestCatalogForUser(url, _catalogOwner) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "richiesta immagini utente", utente: _catalogOwner })
            };

            const response = await fetch(url, requestOptions)
                                        .then(async response => {
                                            const isJson = response.headers.get('content-type')?.includes('application/json');

                                            // check for error response
                                            if (!response.ok) {
                                                const error = (data && data.message) || response.status;    // get error message from body or default to response status
                                                return Promise.reject(error);
                                            }

                                            this.catalogIsOffline = false;

                                            return response
                                        })
                                        .catch(err => { console.log(`Server api ${url} is down 😭`); this.catalogIsOffline = true; });

            if( ! response ) return { catalogName: 'Catalog unaviable', listaImmagini:[] };

            const data = await response.json();
            console.log(`\n\t ${data.catalogName} \n\n`);

            return data;
        },

        /**
         *  - scarica l'immagine direttamente dalla GET 
         *       - TODO: era più bello l'altro metodo con POST usando i params ma è complicato estrarre la stream response
         *  - se presente nei placeholder la aggiorna, altrimenti assegna unviable
         *  - se serve aggiorna visualizzazione
         */
        async requestImageForUser(urlServer, img, _catalogOwner) {
            //const requestOptions = {
            //  method: "POST",
            //  headers: { "Content-Type": "application/json" },
            //  body: JSON.stringify({ utente: _catalogOwner, richiestaImg: img })
            //};
            //const response = await fetch(url, requestOptions); //const data = await response.json();

            //console.log(`\t requestImageForUser() ${_catalogOwner} - ${img.name} - id: ${img.id}`)
            let urlImageRes = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img.src}`;
            console.log(urlImageRes);
            document.addEventListener('DOMContentLoaded', function () { 
                document.getElementById(`img_${img.id}`).src = urlImageRes;
                el.classList.remove('loading');
            })

            /*
            // non selezionare l'immagine dall'id, ma dall'attributo ALT
            let el_id = `img_${img.id}`;
            //let el :  HTMLImageElement = (document.getElementById(el_id) as HTMLImageElement);
            let el = document.getElementById(el_id);
            if(el){
                let urlImageRes = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img.src}`
                // TODO : impleentare caso in cui la risorsa non c'è e quindi dà unviable
                el.src = urlImageRes;
                el.classList.remove('loading');
            }
            else{ 
                
                console.log(`Element ${el_id} missing in DOM`);
            }
            */

            //[...document.getElementsByTagName('img')].forEach(imgEl => {
            //  if( imgEl.getAttribute('alt') === img )
            //    imgEl.src = `${urlServer}?utente=${_catalogOwner}&richiestaImg=${img}`;
            //});   
        },
        async deleteAllImages(){
            console.log('deleteAllImages()')
            var r = confirm("Are you sure you want to delete all images?");
            if (r==true){
                console.log("Post delete");
                const res = await fetch(`${this.___urlServerImage}/deleteAll`, 
                                            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ utente: this.catalogoDB.catalogOwner }) })
                                    .catch(err => { console.log(`Server api ${url} is down 😭`); catalogIsOffline = true; });
            }
            else console.log("Images saved from destruction");
        }
    }, // END METHODS
    /* 
    *   mounted avviene dopo che datas sono stati caricati
    *       -> richiede il catalogo reale dal server
    *       -> TODO: controlla la validità utente, secret key, class
    *       -> aggiorna la listaImmagini inserendo solo i metas
    *       -> per ogni immagine-meta nel db, la richiede al server e visualizza
    *
    */
    async mounted(){ 
        console.log('Catalogo: mounted()')

        if(this.catalogIsReady) return;

            // RICHIEDE CATALOGO
        const updateDatasCatalog = await this.requestCatalogForUser(`${this.___urlServerImage}/imagelist`, this.catalogoDB.catalogOwner)
        if(this.catalogIsOffline)
            return;

            // SALVO LISTA IMMAGINI SRC PER AGGIUNGERLA DOPO IL PLACEHOLDER
        let listUrlImgs = updateDatasCatalog.immagini.map(img => img.src)

            // TODO VALIDITA
        console.log(`TODO check validità database todo ${updateDatasCatalog.catalogName} \t dimensione: ${updateDatasCatalog.immagini.length} 🌁`)
        this.catalogoDB.catalogName = updateDatasCatalog.catalogName
        this.catalogoDB.catalogOwner = updateDatasCatalog.catalogOwner
        this.catalogoDB.secretKey = updateDatasCatalog.secretKey

            // Aggiorna il catalogo, ma le immagini reali sono in stato di loading
        const loadingSrc = require('./../assets/loading.gif')
        this.catalogoDB.listaImmagini = updateDatasCatalog.immagini;
        this.catalogoDB.listaImmagini.forEach(function(v){ v.src = loadingSrc; v.class="loading" });



            // richiede img al server e visualizzala ( in lazy mode )   
            // https://nicholasmarmonti.com/tutorial/image-lazy-load-metodo-semplice-leggerissimo/

            // https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/

        this.catalogoDB.listaImmagini.forEach((img,i) => {
            img.src = listUrlImgs[i];
            img.class = ''
            //img.datasrc = listUrlImgs[i];
        });

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

        this.catalogIsReady = true
    }
  }
</script>

<style> /** style scooped */
ul{ padding: 0 }
li{ list-style-type: none }
h2, p { color: var(--mainText) }
h3{ border-bottom: 1px solid gray; }
.isReadySpinner{ width:3rem; position: absolute; top:0.5rem; left:50% }
.catalogDiv > button{
    background: transparent;
    border:none;
    font-size: 2rem;
    margin:2rem;
    opacity: .9;
    backdrop-filter: blur(2px);
}
.catalogDiv > button:hover{ cursor: grab; box-shadow: 20px 20px 20px 20px #888888 }

.catalogDiv > p{ background-color: var(--backgroundColor); text-align: center; margin: 0 20%; padding: 1rem; border-radius: 1rem; }

</style>