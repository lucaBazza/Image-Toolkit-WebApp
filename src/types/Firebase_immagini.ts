import { ref, deleteObject } from "firebase/storage"
import { db, storage } from '@/firebase'
import { CATALOGHI_COL, IMMAGINI_COL  } from "./FirebaseModel"
import { catalogoConverter,  immagineConverter } from '@/types/Firebase_converters'
import Catalogo from "./Catalogo"
import Immagine from "./Immagine"
import Utente from "./Utente"



/**
 *  Return true false   TODO implement return promise
 *  - carico il catalogo indicato dal cid e se esiste ne carico le immagini
 * 
 *  @return id immagine se trovato, altrimenti reject
 */
 export async function existImageInsideCatalog(filename: string, cid: string) : Promise<string>{
    const docSnapshot = await db.collection(CATALOGHI_COL).withConverter(catalogoConverter).doc(cid).get()
    if(docSnapshot.exists){
      let cat = docSnapshot.data() as Catalogo 
      //console.log('Catalog found \t cid:', cat.cid )
      let listaIMgs = await getImages_filenames_fromCID(cat.cid)
      const out = listaIMgs.filter(img => img===filename)
      return out.length > 0 ? Promise.resolve( filename ) : Promise.reject(`existImageInsideCatalog() cant find image ${filename} in his catalog`)
    }
    else return Promise.reject(`existImageInsideCatalog() - catalog ${cid} not found`)
}



/**
 *  Metodo con promise all per cancellare immagine di utente (firestore+firebase)
 */
export async function deleteImageFacade(img : Immagine) : Promise<void>{
  Promise.all([deleteImage_firestore(`immagini/${img.nomeFile}`), deleteImage(img.imgID, img.catalogoID,Utente.getInstance().uid)])
    .then( ()=> { console.log(`Cancellazione riuscita ${img.nomeFile}`); Promise.resolve()})
    .catch( (err)=> { console.log(`Errore cancellazione ${img.nomeFile} : \n ${err}`); Promise.reject() } )
}


/**
 * cancella immagine su firestore
 *  TODO: cancellare anche da fire storage
 * @param imgID 
 * @param cid 
 * @param uid 
 * @returns vero/falso se è andato a buon fine
 */
export async function deleteImage(imgID: string, cid: string, uid: string) : Promise<void>{
  // console.log('Delete image: ', imgID, " \n\t| cid: ", cid, ' \n\t| uid: ', uid)
  const listImgID_utente = await getImagesID_byCid(cid,uid)
  if(listImgID_utente.includes(imgID)){
    let col = await db.collection(`${CATALOGHI_COL}/${cid}/${IMMAGINI_COL}`).get()
    col.forEach( snapshot => { if( snapshot.id === imgID ){ snapshot.ref.delete(); return Promise.resolve() } })
  }
  else return Promise.reject()
}

async function deleteImage_firestore(imagePath) : Promise<void>{
  const imageStoreRef = ref(storage, imagePath)
  return deleteObject(imageStoreRef)
}



/**
 *  Listo gli ID delle immagini salvate per l'utente come documento nel relativo catalogo
 * @param cid catalogo da listarne le immagini
 * @param uid utente con il filtro ricerca
 * @returns array di id-image
 */

// TODO : ERRORE ritorna la lista dei cataloghi per utente non le sue immagini!!!
export async function getImagesID_byCid(cid: string, uid: string) : Promise<string[]>{
    let a = await db.collection(`${CATALOGHI_COL}/${cid}/${IMMAGINI_COL}`).get()
    return a.docs.map(imgQuery => { return imgQuery.id })
}

/**
 *  Listo i nomi dei files delle immagini salvate come documento nel relativo catalogo
 * @param cid catalogo da listarne le immagini
 * @returns array di nomi di file immagine
 */
export async function getImages_filenames_fromCID(cid: string){
    let a = await db.collection(`${CATALOGHI_COL}/${cid}/${IMMAGINI_COL}`).get()
    return a.docs.map(imgQuery => { return (imgQuery.data() as Immagine).nomeFile })
}



/**
 *  Carica su firebase l'immagine, una volta fatto aggiorna l'imgID temporaneo con quello vero restituito dall'insert
 * @param img immagine da caricare (già specificato campo catalogo)
 * @return id dell'immagine caricata
 *    TODO check catalog id exist
 *    TOOD se viene caricato un file con lo stesso nome non viene fatto il merge
 */
export async function addImageToCatalog2(img : Immagine) : Promise<string>{
  let imgRef = db.collection(CATALOGHI_COL).doc(img.catalogoID).collection(IMMAGINI_COL).withConverter(immagineConverter)
  let imgIdReale = await imgRef.add(img)
          .then( res => { return res.id })
          .catch( ex => { return Promise.reject(`updateCollection() Error adding document: ${ex}`) })

  Utente.getInstance()
          .getCatalog_by_cid(img.catalogoID)!.listaImmagini
          .find(i=> img.imgID == `temp-${i.nomeFile}`)!.imgID = imgIdReale
          //.filter( i=> img.imgID == `temp-${i.nomeFile}`)[0].imgID = imgIdReale

  return imgIdReale
}



/**
 *  @param img immagine da aggiornare sul serve
 */
export async function updateImage( img : Immagine) : Promise<void>{
  db.collection(CATALOGHI_COL).doc(img.catalogoID).collection(IMMAGINI_COL).doc(img.imgID).update( immagineConverter.toFirestore(img))
          .then( () => console.log(`update doc completed! \t ${img.nomeFile}`))
          .catch( err => console.log(err) )
}



/**
 *  Richiede a firestore la lista delle immagini di un catalogo specifico, usando l'id catalogo di fs stesso
 */
 export async function loadImagesFromCatalog_firebaseA(cid) : Promise<Immagine[]>{
  // console.log('loadImagesFromCatalog_firebaseA() \n\t request catalog id:', cid )
  let res = await db.collection(`${CATALOGHI_COL}/${cid}/${IMMAGINI_COL}/`).withConverter(immagineConverter)
                      .get().catch((err)=>console.warn('ERROR loadImagesFromCatalog_firebaseA()\n',err))
  return res.docs.map(imgQuery => imgQuery.data())
}




/**
 *  - carica l'immagine su FireStorage e nel mentre aggiorna GUI progresso, ottiene l'url dell'immagine
 *  - poi aggiorna FireBase, restituisce l'imgId dell'immagine
 *  @return imgId dell'immagine caricata
 *  TODO: gestione progressbar
 */
export async function uploadImage_2(file : File, img: Immagine /* ,progressRef: number */ ) : Promise<string>{
  let progressRef = 0

  const realURL = await uploadImage_firestorage(file, progressRef)

  let imgRef = db.collection(CATALOGHI_COL).doc(img.catalogoID).collection(IMMAGINI_COL).withConverter(immagineConverter)
  return await imgRef.add(img.setRealURL(realURL))
                      .then( res => res.id )
                      .catch( ex => { return Promise.reject(`updateCollection() Error adding document: ${ex}`) })
}

import firebase from 'firebase/compat/app'

async function uploadImage_firestorage(file: File, progressRef: number) : Promise<string>{
  let downloadUrl

  const uploadTask = firebase.storage().ref(`immagini/${file.name}`).put(file)
  uploadTask.on('state_changed', snapshot => {
        progressRef = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
        if( progressRef % 5 == 0 ) console.log(`Upload progress: ${progressRef} %`)
      },
      error => console.log('uploadImage_firestorage(): Upload error ❌ \n'+ error),
      () => uploadTask.snapshot.ref.getDownloadURL()
                                      .then( s => downloadUrl = s )
                                      .catch( ex => console.log('uploadSingleFile_firestore() ', ex) )
  )

      // TRICK: wait until callback function has filled out variable
  while( ! downloadUrl )
      await new Promise( res => setTimeout(res,0) )

  return downloadUrl
}