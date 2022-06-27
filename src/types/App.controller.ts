import Catalogo from '@/types/Catalogo'
import { loadImagesFromCatalog_firebaseA, getCatalog_fs, deleteCatalog, updateUser } from '@/types/FirebaseModel' 


/**
 *   callback: il catalogo è già stato inserito su FS, occorre leggerlo e aggiornare la gui
 */
export async function add_catalog_logic(app: any, cid : string){
    let catalog : Catalogo = await getCatalog_fs(cid)
    app.utenteSng.listaCataloghi.push(catalog)
    app.currentAppCatalog = catalog
    updateUser(app.utenteSng.setSelected_cid(catalog.cid))

    app.showLogInArea = false
    setTimeout( () => app.showLogInArea = true, 700)
    
    app.notificate({ title: "Catalog added", text: catalog.titolo, type: 'info' })
}


/**
 *  cancella da firebase
 */
export async function delete_catalog_logic(app: any, cid : string){
    deleteCatalog(cid)
        .then( res =>{ 
            console.log(res)
            app.utenteSng.listaCataloghi = app.utenteSng.listaCataloghi.filter(c => c.cid !== cid )
            if( app.currentAppCatalog.cid === cid )
                app.currentAppCatalog = app.utenteSng.getCurrentCatalog_cid()
        })
}


/**
 *    Cambia il catalogo selezionato usando il cid (aggiorna utente e catalogo aperto)
 *      - aggiorna il cid del dell'utente su firebase
 *      - controllo se le immagini del catalogo sono state caricate
 *      - imposta sulla gui il nuovo catalogo
 */
export async function change_catalog_logic(app: any, cid : string){
    updateUser(app.utenteSng.setSelected_cid(cid))

    //if( ! this.utenteSng.getCatalog_by_cid(cid).listaImmagini.length){  // true anche quando il catalogo è correttaemnte inizializzato (ma è senza imamgini)
    if( ! app.utenteSng.getCatalog_by_cid(cid).listaImmagini){
      console.log(`Catalogo: ${cid} non ha immagini caricate, provvedo a scaricarle`)
      let listaImgs = await loadImagesFromCatalog_firebaseA(cid)
      app.utenteSng.setImages_by_cid(listaImgs,cid)
    }

    app.currentAppCatalog = app.utenteSng.getCatalog_by_cid(cid)
    
    console.log('App.change_catalog() \t titolo: ', app.currentAppCatalog.titolo)
}






















// Create Fake datas
//let _listaCataloghi = getUserFromServer('Luca', 'Yhsdg654@as','ASKJ23487');

/*
const utenteSng = ref(new Utente('Luca', 'Yhsdg654@as', new Array<Catalogo>(
                            new Catalogo('Luca','Go to the mountas',0), new Catalogo('Luca','Schiazzi di mondi',1), new Catalogo('Luca','Androgenia del mare',2)) ));
utenteSng.value.setEmail('luca@xyz.com')
//utenteSng.value.setKeepLogin(true)
utenteSng.value.getCatalogoCurrent().titolo = 'Amici della natura'
utenteSng.value.getCatalogoCurrent().setListaImmagini([

  new Immagine('img.jpg',0), new Immagine('asd.jpg',1), new Immagine('imgC.jpg',2), new Immagine('asdD.jpg',3)
]);
*/




/*
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









/*
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
*/




