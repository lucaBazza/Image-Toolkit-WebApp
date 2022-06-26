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