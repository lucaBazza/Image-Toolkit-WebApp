<template>
    <img  v-if=" ! catalogIsReady" src="@/assets/loading-io-spinner.gif" alt="Catalog loading spinner" class="isReadySpinner"/>
    <ul>
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
        <!-- <h2 v-if="catalogoDB.listaImmagini.lenght < 1">No images in catalog</h2>-->
    </ul>
</template>
<script>
import ImageExifViewer from './ImageExifViewer.vue'

// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists
  export default {
    name: "CatalogComponent",
    components: { ImageExifViewer },
    // PROPS SONO SOLO IN LETTURA PER IL COMPONENTE     TODO: VEDERE COME PASSARE IL V-BIND CORRETTAMENTE
    //props: [ 'initialCatalog' ], 
    //props: { initialCatalog: {} },
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

                catalogIsReady: false,
                urlServerImage: this.___urlServerImage
            }
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
                { name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas: this.requireExifs(), id:0, done: false, title: 'Passo Sella' }
                //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
                //{ name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
            ]
        },
        async getImagesFromServer(){
            console.log("getImagesFromServer()")
            //eventEmitter.emit('asyncFetchServer') // TODO

            console.log( this.urlServerImage )

            this.requestCatalogForUser(`http://${this.urlServerImage}/imagelist`, this.catalogoDB.catalogOwner);
            // ritorno un array placeholder, ma: TODO inserire nomi/titolo da catalogo, TODO quando caricato togliere classe loading
            //return [
            //    { name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas: this.requireExifs(), id:0, done: false, title: 'Passo Sella' },
            //    { name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:1, done: false, title: 'Corvo' },
            //    { name:'indef', src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
            //]
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
                                    .catch(err => { console.log(`Server api ${url} is down`); });
            //console.log('status code: ', response.status);
            if( ! response ) return { catalogName: 'Catalog unaviable', listaImmagini:[] };

            const data = await response.json();
            console.log(`\n${data.catalogName} \t #${data.numeroImmagini} \n\n`);

            return data;
            //data.immagini.forEach((img,index) => {
            //    console.log(" - Immagine: " + img[0].imgFile);
            //    this.requestImageForUser(`http://${urlServerImage}/image`, img[0].imgFile, _catalogOwner, index );
            //});
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

        const updateDatasCatalog = await this.requestCatalogForUser(`http://${this.___urlServerImage}/imagelist`, this.catalogoDB.catalogOwner)

        //console.log(updateDatasCatalog)

        // TODO VALIDITA
        console.log(`TODO check validità database todo ${updateDatasCatalog.catalogName}`)

        // aggiorna meta  lista immagini con metas ! attenzione aggiorna anche gli ! URLS !
        this.catalogoDB.listaImmagini = updateDatasCatalog.immagini

        // TODO fare un map che aggiorna la lista immagini senza toccare il parametro src (che rimane in loading)
        //this.caltalogoDB.listaImmagini = updateDatasCatalog.immagini.map( x=)
        //this.catalogoDB.listaImmagini = updateDatasCatalog.immagini.map( x => x.src=`http://${this.___urlServerImage}/image?utente=${this.catalogoDB.catalogOwner}&richiestaImg=${x.src}`)


        // richiede img al server e visualizzala
        /*
        this.catalogoDB.listaImmagini.forEach(img => {
            //console.log(" - Immagine: " + img.name);
            this.requestImageForUser(`http://${this.___urlServerImage}/image`, img, this.catalogoDB.catalogOwner);
        });
        */

        //data.immagini.forEach((img,index) => {
        //    console.log(" - Immagine: " + img[0].imgFile);
        //    requestImageForUser(`http://${urlServerImage}/image`, img[0].imgFile, _catalogOwner, index );
        //});

        //this.catalogoDB.listaImmagini = this.getImagesFromServer()

        this.catalogIsReady = true
    }
  }
</script>

<style> /** style scooped */
/*ul{ 
    width: 100%;
    height: 100%;
}*/
li{ list-style-type: none }
h2{ color: white }
.isReadySpinner{ width:3rem; position: absolute; top:0.5rem; left:50% }
</style>