/*
*  https://www.youtube.com/watch?v=wuShuZYtJ0w
*/

import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { addImageToCatalog2 } from './../types/Firebase_immagini'
import { generateLocalStorageThumb } from './ThumbnailStorage'
// import Utente from '../types/Utente'

/*
export default async function uploadImageCodeInspire(e, cid){
    //console.log(e.target.files, catalogID)
    Array.from(e.target.files).forEach(file => uploadSingleFile_firestore(file, cid, null) )
}
*/


/**
 *      UPLOAD ONE IMAGE TO FIRESTORE   > storage + firestore <
 *  - TODO: implementare aggiornamento UI man mano che la progress bar aumenta
 * 
 * 
 *      ATTENZIONE NON USATO
 * 
 * 
 */
export function uploadSingleFile_firestore(file,/*  cid, */ image, base64preview){
    //console.log("uploadSingleFile_firestore() ", file)
    var storageRef = firebase.storage().ref(`immagini/${file.name}`)
    let uploadTask = storageRef.put(file)
    uploadTask.on('state_changed', snapshot => {
          var progress = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
          if( progress % 5 == 0 ) console.log(`Upload progress: ${progress} %`)
        },
        error => console.log('Upload error ❌ \n'+ error),
        () => done_addImageToCatalog(uploadTask, image, base64preview)
        //() => uploadTask.snapshot.ref.getDownloadURL()
        //                                //.then( downloadURL => updateCollection(file.name, downloadURL, cid) )
        //                                //.then( downloadURL => prepareToFirestore(image, downloadURL))
        //                                .catch( ex => console.log('uploadSingleFile_firestore() error: ', ex) )
        //                                .then( downloadURL => addImageToCatalog2(image.setRealURL(downloadURL)) )
    )
}

async function done_addImageToCatalog(uploadTask, image, base64preview){
    console.log('done_addImageToCatalog() \t', image.nomeFile)
    uploadTask.snapshot.ref.getDownloadURL()
        .catch( ex => console.log('uploadSingleFile_firestore() error: ', ex) )
        .then( downloadURL => addImageToCatalog2(image.setRealURL(downloadURL)) )
        .then( imgID => { 
            console.log('imgId uploaded: ', imgID, '\t now generate the thumb')
            generateLocalStorageThumb(base64preview, imgID)
        })
}




/**
 *  prepara 
 */
/* 
function prepareToFirestore(image, downloadURL){
    image.realURL = downloadURL
    addImageToCatalog2(image.setRealURL(downloadURL))
        //.then( res => console.log('prepareToFirestore().addImageTocatlaog2().then() res: ', res) )
        .then( imgId =>{
            console.log('prepareToFirestore().addImageTocatlaog2().then() res: ', imgId)


        })
}
 */

/**
 *  Dopo che l'immagine è stata caricata su FS storage, viene inserito un sotto documento nel catalogo con info dell'immagine
 *      -> viene inserito un documento nel catalogo selezionato con nome uguale all'immagine, all'intenro i dati
 *      -> vedere se tramite FS function è possibile triggerare l'inserimento automatico
 */
/*import { CATALOGHI_COL } from './../types/FirebaseModel'
import Immagine from '../types/Immagine'
function updateCollection(imgName, downloadURL, cid){
    //console.log(`updateCollection() Completed file upload 🎉 \n img: ${imgName} \t cid: ${cid} \n File aviable at : \n ${downloadURL}`)

    const { serverTimestamp } = firebase.firestore.FieldValue

    let imgDatas = {
        nomefile: imgName,
        src: downloadURL,
        realURL: downloadURL,
        exifs: '',
        alt: '',
        cid: cid,
        adjustmentID: 'todo',
        createdAt: serverTimestamp()
    }

    let messageRef = db
        .collection(CATALOGHI_COL).doc(cid)
        .collection("immagini").doc(imgName)
    
    messageRef.set(imgDatas)
                .then( ()=> console.log(`updateCollection() Completed file upload 🎉 \n\t img: ${imgName} \n\t cid: ${cid} \n\t File aviable at : \n ${downloadURL}`) )
                 .catch( ex => console.error('updateCollection() Error adding document: ', ex) )
        
}
*/




/**
 * 
 * -
 * 
 * -        UN USED    FUNCTIONS 
 * 
 * -
 * 
 */
/*function uploadImageCodeInspire_singleFile(e){
    let file = e.target.files[0]
    console.log("uploadImageCodeInspire() ", file)

    var storageRef = firebase.storage().ref(`immagini/${file.name}`)
    let uploadTask = storageRef.put(file)
    uploadTask.on('state_changed', snapshot => {
          var progress = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
          if( progress % 5 == 0 ) console.log(`Upload progress: ${progress} %`)
      },
      error => console.log('Upload error ❌ ', error),
      () => { uploadTask.snapshot.ref.getDownloadURL().then( downloadURL =>{ console.log(`Completed upload 🎉 \n File aviable at: ${downloadURL}`)}) } // this.immagineUload = donwloadURL
    )
}




function updateCollection_old(imgName, downloadURL){
    db.collection('cataloghi').doc(docID).collection('immagini').doc(imgName).set({
        nomefile: imgName,
        src: imgName,
        exifs: '',
        alt: '',
        catalogoID: docID,
        adjustmentID: 'todo'
    }).then( res => console.log('updateCollection() completed :) ',res) ).catch(ex => console.log('updateCollection() ',ex) )
    
    
    
    db.collection('cataloghi').doc(docID).get()
        .then( snapshot => console.log(snapshot) 

        )
        .catch(ex => console.log(ex))
    

    
    var imgRef = db.collection('cataloghi') //.doc(docID).collection('immagini')
    imgRef.whereArrayContains('id', 0)
    console.log(imgRef)
    imgRef.set(imgDatas).then(function () {
        console.log('Document Added ');
    })
    .catch(function (error) {
        console.error('Error adding document: ', error);
    })
}*/
