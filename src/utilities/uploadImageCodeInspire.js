/*
*  https://www.youtube.com/watch?v=wuShuZYtJ0w
*/

import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { db } from '@/firebase'

export default async function uploadImageCodeInspire(e, catalogID){
    //let catalogID = "K15HaA6TdJNBAuaUwOSj"
    //console.log(e.target.files, catalogID)

    Array.from(e.target.files).forEach(file => uploadSingleFile_firestore(file, catalogID) )
}


function uploadSingleFile_firestore(file, catalogID){
    //console.log("uploadImageCodeInspire() ", file)
    var storageRef = firebase.storage().ref(`immagini/${file.name}`)
    let uploadTask = storageRef.put(file)
    uploadTask.on('state_changed', snapshot => {
          var progress = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
          if( progress % 5 == 0 ) console.log(`Upload progress: ${progress} %`)
        },
        error => console.log('Upload error ❌ \n'+ error),
        () => uploadTask.snapshot.ref.getDownloadURL()
                                        .then( downloadURL => /* { */ { updateCollection(file.name, downloadURL, catalogID) })
                                                                //console.log(`Completed upload 🎉 \n File aviable at: ${downloadURL}`)
                                                                //updateCollection(file.name, downloadURL, catalogID)
                                                            //}) 
                                        .catch( ex => console.log('uploadSingleFile_firestore() ',ex) )
        
    )
}

//function uploadDone(imgname,downloadURL, catalogID ){
//    
//    updateCollection(imgname, downloadURL, catalogID)
//}


/**
 *  Dopo che l'immagine è stata caricata su FS storage, viene inserito un sotto documento nel catalogo con info dell'immagine
 *      -> viene inserito un documento nel catalogo selezionato con nome uguale all'immagine, all'intenro i dati
 *      -> vedere se tramite FS function è possibile triggerare l'inserimento automatico
 */
function updateCollection(imgName, downloadURL, catalogID){
    console.log(`updateCollection() Completed file upload 🎉 \n img: ${imgName} \t catId: ${catalogID} \n File aviable at : \n ${downloadURL}`)
    //console.log('updateCollection() : ', imgName)

    //let docID = 'i9gSEAz9EXb94OqdjwwY2bQMQ3w1'  // TODO caricare dinamicamente

    let imgDatas = {
        nomefile: imgName,
        src: downloadURL,
        exifs: '',
        alt: '',
        catalogoID: catalogID,
        adjustmentID: 'todo'
    }

    let messageRef = db
        .collection("cataloghi").doc(catalogID)
        .collection("immagini").doc(imgName)

    messageRef.set(imgDatas).then( ()=> console.log('updateCollection() Document Added : ', imgName) )
                .catch( ex => console.error('updateCollection() Error adding document: ', ex) )
        
}





/**
 * 
 * -
 * 
 * -        UN USED    FUNCTIONS 
 * 
 * -
 * 
 */
function uploadImageCodeInspire_singleFile(e){
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
}
