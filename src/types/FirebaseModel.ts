import firebase from 'firebase/compat/app';
import { db } from '@/firebase'
import { doc, getDoc, setDoc, serverTimestamp, query, updateDoc, deleteField, deleteDoc } from "firebase/firestore"

import Utente from "./Utente"
import Catalogo from "./Catalogo"
import Immagine from './Immagine'
import getLocalizationInfos from '@/utilities/Ip-localization-api'

export let unsubscribeToRefs 
export const USER_COL = "utentiprefs"
export const CATALOGHI_COL = "cataloghi"
export const IMMAGINI_COL = "immagini"

/**
 *    C L A S S   C O N V E R T E R
 */

const alsoEmpty = (v:any)=>{ return v ? v : ''}
const utenteConverter = {
  toFirestore: (utente) => {
    //console.log('utenteConverter() - user toFirestore() ')
      return {
          uid: utente.uid,
          selected_cid: alsoEmpty(utente.selected_cid),
          subscription_date: alsoEmpty(utente.subscription_date),
          lastLogin: alsoEmpty(utente.lastLogin),
          allowNotifications: utente.allowNotifications?'true':'false',
          active_plan: alsoEmpty(utente.active_plan),
          watermark_src: alsoEmpty(utente.watermark_src),
          public_gallery: alsoEmpty(utente.public_gallery),
          lastIp: alsoEmpty(utente.lastIp),
          location: alsoEmpty(utente.location)
      }
  },
  fromFirestore: (snapshot, options) => {
      //console.log('FirebaseModel.immagineConverter() ', snapshot)
      const data = snapshot.data(options)
      let out = new Utente('')
      out.nome = data.nomefile
      out.email = data.email
      out.password  = data.password
      out.secretKey  = data.secretKey
      out.photoURL = data.photoURL
      out.selected_cid  = data.selected_cid
      out.uid = data.uid
      // dati salvati da userspace
      out.subscription_date = data.subscription_date
      out.lastLogin = data.lastLogin
      out.allowNotifications = data.allowNotifications
      out.active_plan = data.active_plan
      out.watermark_src = data.watermark_src
      out.public_gallery = data.public_gallery
      out.lastIp = data.lastIp
      out.location = data.location
      return out
  }
}

const catalogoConverter = {
    toFirestore: (catalogo) => {
        return {
            proprietario: catalogo.proprietario,
            titolo: catalogo.titolo,
            uid: catalogo.uid,
            secretkey: catalogo.secretkey,
            id: catalogo.id,
            createdAt: catalogo.createdAt,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let out = new Catalogo(data.proprietario, data.titolo).setCatalogUserID(data.uid)
        out.secretkey = data.secretKey
        out.id = data.id
        out.createdAt = data.createdAt
        out.cid = snapshot.id
        return out
    }
}

const immagineConverter = {
  toFirestore: (immagine) => {
      return {
          nomeFile: immagine.nomeFile,
          src: immagine.src.length > 2048 ? '' : immagine.src,
          realURL: immagine.realURL,
          id: immagine.id,
          alt: alsoEmpty(immagine.alt),
          catalogoID: immagine.catalogoID,
          adjustmentID: immagine.adjustmentID,
          width: immagine.width,
          height: immagine.height,
          size: immagine.size
      }
  },
  fromFirestore: (snapshot, options) => {
      //console.log('FirebaseModel.immagineConverter() ', snapshot)
      const data = snapshot.data(options)
      let out = new Immagine('')
      out.nomeFile = data.nomeFile
      out.src = data.src
      out.realURL = data.realURL
      out.id = data.id
      out.catalogoID = data.catalogoID //data.nomefile // TODO occorre usare il nome dello snapshot? (dovrebbe combaciare dal caricamento)
      out.createdAt = data.createdAt
      out.adjustmentID = data.adjustmentID
      out.size = data.size
      out.width = data.width
      out.height = data.height
      return out
  }
}


/**
 *   Inserisce nella raccolta 'cataloghi' firebase un nuovo documento catalogo
 *    - imoprta i campi della classe catalogo
 *    - NO inizializza una sotto-raccolta immagini
 *    - restituisce un speciale id : string che è l'identificativo firebase del documento
 *        + TODO: vedere se / come occorre usare/aggionrare tale id  nel client 
 *        + TODO: usare catalogConverter
 *        + TODO: check preliminare se catalogo esiste già con stesso titolo
 */
export async function addCatalogo2( catalogo : Catalogo, user_id : string ){
  //console.log('\n addCatalogo2() \n\n')
  let cataloghiRef = db.collection(CATALOGHI_COL)
  let resp = await cataloghiRef.add({
      titolo: catalogo.titolo,
      proprietario: catalogo.proprietario,
      uid: user_id,
      secretKey: catalogo.secretkey,
      id: catalogo.id,
      createdAt: serverTimestamp()
  })
  console.log('\n addCatalogo2() \n\n ID firebase del documento aggiunto : ', resp.id, '\n\n')
  return Promise.resolve(resp.id)
}


/**
 *  Carica dati extra utente, oppure crea nuovo account
 *  implementare -> https://www.youtube.com/watch?v=wvRVfyPKOA0
 */
export async function loadUserSettings(u : firebase.User) : Promise<Utente>{
  const displayName = u.displayName !
  const localization = await getLocalizationInfos()
  //console.log('loadUserSettings()')
  const loadFromFirebase = async () => {
    const docSnapshot = await firebase.firestore().collection(USER_COL).withConverter(utenteConverter).doc(u.uid).get()
    if(docSnapshot.exists){
      //console.log('\tUser found: ', displayName)
      updateUser((docSnapshot.data() as Utente)
        .setLastLogin(serverTimestamp())                                                  
        .setLastIp(localization.lastIp)
        .setLocation(localization.location))
      return docSnapshot.data()
    }
    else{
      const ref = doc(db, USER_COL, u.uid).withConverter(utenteConverter)
      
      const newUtente = new Utente(displayName).setUID(u.uid)
                                                  .setSubscription_date(firebase.firestore.FieldValue.serverTimestamp())
                                                  .setLastLogin(firebase.firestore.FieldValue.serverTimestamp())
                                                  .setActive_plan('free')
                                                  .setAllowNotifications(false)
                                                  .setLastIp(localization.lastIp)
                                                  .setLocation(localization.location)
                                                  
      await setDoc(ref, newUtente)
      console.log('\tCreate new userprefs for: ', displayName)
      return newUtente
    }
  }
  let res = await loadFromFirebase()

  return (res as Utente).setNome(displayName).setEmail( u.email !).setPhotoURL( u.photoURL !)
}


/**
 *      Restituisce promessa di array di cataloghi per l'utente selezionato          - version C
 *          - Promise viene soddisfatta solo quando l'array catalogo è riempito
 *          - Uso q.get()  le risorse vengono caricate one-shot-time !
 *          - I cataloghi caricati NON comprendono la lista delle immagini
 */
export async function getCataloghi_C(user_id: string) : Promise<Catalogo[]> {
  let lc : Catalogo[] = []
  const q = db.collection(CATALOGHI_COL).withConverter(catalogoConverter).where("uid", "==", user_id)
  await q.get().then(querySnapshot => {
      if ( querySnapshot.empty )
        return Promise.reject('getCataloghi_C() Error, query found empty 😭 ')
      lc = querySnapshot.docs.map(doc => { return doc.data() as Catalogo })
  })
  unsubscribeToRefs = db.collection(CATALOGHI_COL)
  //console.log('💉 getCataloghi_B() ENDS return tot: ', lc.length)
  return lc.length > 0 ? Promise.resolve(lc) : Promise.reject('\t ✋ Snapshot catalogs is loading...')
}


/**
 *  ottiene l'idFirebase del catalogo matchando l'id
 */
export async function get_firebaseID_currentCatalogo(catalogID){
  const q = db.collection(CATALOGHI_COL).where("id", "==", catalogID)
  const out = await q.get().then( qs => qs.docs[0].id ).catch(ex => console.log(ex))  
  return out
}


/**
 *  Dall'id catalogo di vuejs, restituisce l'ID di firebase             D O P P I O N E ? ?
 */
export async function get_firebaseID_currentCatalogo_B(catalogID){
  const q = db.collection(CATALOGHI_COL).where("id", "==", catalogID)
  const out = await q.get().then( qs => qs.docs[0].id ).catch(ex => console.log(ex))
  return out
}

/**
 *   carica un catalogo da firebase
 */
export async function getCatalog_fs( cid : string) : Promise<Catalogo>{
  console.log('getCatalog_fs() : ' , cid)
  const ref = doc(db, CATALOGHI_COL, cid).withConverter(catalogoConverter)
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    const cat = docSnap.data()
    return Promise.resolve(cat)
  }
  else return Promise.reject(`User has no catalog ${cid}`)
}


/**
 *  Richiede a firestore la lista delle immagini di un catalogo specifico, usando l'id catalogo di fs stesso
 */
export async function loadImagesFromCatalog_firebaseA(cid){
  //console.log('loadImagesFromCatalog_firebaseA() \n\t request catalog id:', cid )
  let res = await db.collection(`${CATALOGHI_COL}/${cid}/${IMMAGINI_COL}/`).withConverter(immagineConverter).get()
  return res.docs.map(imgQuery => imgQuery.data())
}

// Listo i nomi dei dicumenti nel catalogo scelto
export async function getCatalogNames_fromUID(uid: string) : Promise<string[]>{
  let a = await db.collection(CATALOGHI_COL).where('uid','==',uid).get()
  return a.docs.map( q => { return q.id })
}


// Listo i nomi dei dicumenti nel catalogo scelto
export async function getImageNames_fromCID(cid: string){
  let a = await db.collection(`${CATALOGHI_COL}/${cid}/${IMMAGINI_COL}`).get()
  return a.docs.map(imgQuery => { return imgQuery.id }) //a.docs.forEach(imgQuery => { console.log(imgQuery.id) })
}

//
export async function updateUser(utente: Utente){
  await db.collection(USER_COL).doc(utente.uid).update( utenteConverter.toFirestore(utente) ).catch((ex: any)=>console.log(ex))
}

/**
 *  ritorna object {location, lastIp}
 */
/* export async function getLocalizationInfos(){
  const ip_apiReq = `http://ip-api.com/json/?fields=country,city,query` // status,message,countryCode,region,regionName,timezone,isp,org,as,zip,lat,lon
  const res = await fetch(ip_apiReq).then(res => res.json()).catch(ex=>console.log(ex))
  return {location: `${res.country} | ${res.city}` , lastIp: `${res.query}`}
} */


/**
 *  TODO togliere il img.nomeFile e usare l'id autogenerato di fs?
 *    > se viene caricato un file con lo stesso nome non viene fatto il merge
*/
export async function addImageToCatalog(img : Immagine){
  let imgRef = db.collection(CATALOGHI_COL).doc(img.catalogoID).collection(IMMAGINI_COL).withConverter(immagineConverter).doc(img.nomeFile)

  imgRef.set(img)
            //.then( ()=> console.log(`updateCollection() Completed file upload 🎉 \n\t img: ${img.nomeFile} \n\t cid: ${img.catalogoID} \n\t File aviable at : \n ${img.realURL}`) )
            .catch( ex => console.error('updateCollection() Error adding document: ', ex) )

}


/**
 * https://www.youtube.com/watch?v=s1frrNxq4js
 */
export async function deleteCatalog(cid: string){
  const docRef = doc(db,CATALOGHI_COL, cid)
  return deleteDoc(docRef).then( ()=> Promise.resolve('callback delete catalog, update form')).catch(ex => Promise.reject(ex))
}


export async function deleteImage(nomeDocImg: string, cid: string) : Promise<boolean>{
  console.log('Delete image: ', nomeDocImg, " | ", cid)
  //const imgRef = db.collection(`${CATALOGHI_COL}/${cid}/${nomeDocImg}`)
  //await updateDoc(imgRef, deleteField() )

  
  const exist = await existImageInsideCatalog(nomeDocImg, cid)
  console.log(exist)
  
  if(exist){
    // netnina firebase9 #5
    const docRef = doc(db,CATALOGHI_COL,cid)
    
  }
  else return Promise.reject('cid not found')

  //const imgRef = db.collection(CATALOGHI_COL).doc(cid).collection(IMMAGINI_COL).withConverter(immagineConverter).doc(nomeDocImg)
  
  //await deleteDoc(imgRef)
  // await deleteDoc(doc(db, CATALOGHI_COL, cid, nomeDocImg));
  return Promise.reject('rejected, last return')
}


/**
 *  Return true false
 */
export async function existImageInsideCatalog(nomeDocImg: string, cid: string) {
  const errorlogReturn = (log: string) => { console.log(log); return false }
  const docSnapshot = await db.collection(CATALOGHI_COL).withConverter(catalogoConverter).doc(cid).get()
  if(docSnapshot.exists){
    console.log( docSnapshot.data() as Catalogo )
  }
  else return errorlogReturn(`existImageInsideCatalog() - catalog ${cid} not found`)
}


export async function existCatalogForUtente(uid: string, cid: string) : Promise<boolean>{    
  let cats = await getCatalogNames_fromUID(uid)
  return cats.filter( c => c === cid ).length > 0
}


/**
 *      Carica da firestore la lista cataloghi e in un simil-DAO per convertirlo in oggetto Catalogo[]
 *      Ritorna array vuoto se non presente (non la genera in quanto viene fatto nell'add)
 *          // TODO muovere come metodo statico nella classe catalogo?
 */
/*export const getCataloghi = async (user_id: string) : Promise<Catalogo[]> => {
    console.log('getCataloghi() \t for uid: ' + user_id)

    let cataloghiRef = db.collection('cataloghi')
    
    let cat : Catalogo[] = []

    unsubscribeToRefs = await cataloghiRef
                                .where('uid', '==', user_id)
                                .orderBy('createdAt')
                                .onSnapshot(querySnapshot => {
                                    cat = querySnapshot.docs.map(doc =>{
                                        console.log('catalogo 🌄 \t',doc.data())
                                        return new Catalogo(doc.proprietario,doc.titolo)
                                    })
                                })

    console.log(`getCataloghi() - firestore cats `, cat)

    return cat
}*/





/*
export const getUser = () : Utente =>{
    return auth.onAuthStateChanged.asyncMap((firebaseUser) async {
      final snapshot = await Firestore.instance
          .collection("users")
          .document(firebaseUser.uid)
          .get();
      return User(
          uid: firebaseUser.uid,
          name: snapshot.data['name'],
          email: firebaseUser.email,
          age: snapshot.data['age'],
          gender: snapshot.data['gender'] 
      );
    });
}
*/


/*
export async function onAuthStateChanged_lucaB() { 
  console.log('onAuthStateChanged_lucaB() ')
  
  const auth = firebase.auth()

  auth.onAuthStateChanged( user =>{
      //console.log('check user fs: ', user)
            if( user ){
               let u = user as firebase.User
            //    console.log('Auth status changed, user logged: ', u['displayName'])
            //    let displayName :string = u.displayName ! //u['displayName']
            //    let email = u.email !
            //    let photoURL = u.photoURL !
            //    let uid = u.uid
            //    
            //    //return Promise.resolve( new Utente(displayName,'psw Google',[])
            //    //                          .setEmail(email).setPhotoURL(photoURL).setUID(uid).setCurrentCatalog(0))
            //    return new Utente(displayName,'psw Google',[])
            //                              .setEmail(email).setPhotoURL(photoURL).setUID(uid).setCurrentCatalog(0)
          return convertUser_Utente(u)
                              
    }
    else {
      console.log('Auth status is: user un-logged')
      //unsub_refCatalogs && unsub_refCatalogs()
      return Promise.reject('Auth status is: user un-logged')
    }
  }) 

  //return outUtente ? Promise.resolve(outUtente) : Promise.reject('Auth status is passed without Utente')

}
*/



/*
function convertUser_Utente(u : firebase.User) : Utente{
  let displayName :string = u.displayName !
  let email = u.email !
  let photoURL = u.photoURL !
  let uid = u.uid
  return new Utente(displayName).setEmail(email).setPhotoURL(photoURL).setUID(uid).setCurrentCatalog(0)        
}
*/

/*
export const addCatalogoB = ( catalogo : Catalogo, user_id : string )=>{

  console.log('\n addCatalogo() \n\n')

  console.log(catalogo)
  let titoloCat = catalogo.titolo
  let proprietario = catalogo.proprietario
  let catId = catalogo.getCurrentId()
  const catalogConverter = {
      toFirestore(cat: Catalogo): firebase.firestore.DocumentData {
        return {titolo: titoloCat, proprietario: proprietario, catId: catId};
      },
      fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Catalogo {
        const data = snapshot.data(options)!;
        return new Catalogo(proprietario, titoloCat);
      }
    };
  
  db.collection('cataloghi').withConverter(catalogConverter).doc(user_id)
          .set({catalogo}
          ,{merge: true})


}
*/





/**
 *  Gestisce stato log in/out
 *    - aggiorna Utente con dati di firebase
 *    - quando slogga toglie le refs utente a firebase
 */
/*
export async function onAuthStateChanged_luca(utenteSng : Utente){ 
    console.log('onAuthStateChanged_luca() ', utenteSng)

    const auth = firebase.auth()

    auth.onAuthStateChanged( user =>{
        //console.log('check user fs: ', user)
        if( user ){
            let u = user as firebase.User
            console.log('Auth status changed, user logged: ', user['displayName'])
            //console.log(user)
    
            let displayName :string = u.displayName! //u['displayName']
            let email = u.email!
            let photoURL = u.photoURL!
            let uid = u.uid
            
            utenteSng = new Utente(displayName) // ,'psw Google',[]
                                .setEmail(email).setPhotoURL(photoURL).setUID(uid).setCurrentCatalog(0)
    
            getCataloghi_B(uid)
                        .then(datas => utenteSng.setListaCataloghi(datas) )
                        .catch(ex => console.log('getCataloghi error: ', ex) )
        
      }
      else {
        console.log('Auth status is: user un-logged')
        //unsub_refCatalogs && unsub_refCatalogs()
      }
    }) 
}
*/




/**
 *      Restituisce promessa di array di cataloghi per l'utente selezionato
 *        !! attenzione: onSnaphot è reattivo al database firestore, TODO async push
 */
/*export async function getCataloghi_B(user_id: string) : Promise<Catalogo[]>{
    console.log('\ngetCataloghi_B : ', user_id, " \n\n")
    
    let lc : Catalogo[] = []

    let cataloghiRef = await db.collection('cataloghi').where('uid', '==', user_id).orderBy('createdAt')

    unsubscribeToRefs = cataloghiRef

    console.log('💉 getCataloghi_B() test async: cataloghiRef : ', cataloghiRef)

    cataloghiRef.onSnapshot( querySnapshot =>{
        querySnapshot.docs.forEach(doc => {
            const datiCat =  doc.data()
            //console.log('querySnapshot.docs : ', datiCat)

            let c : Catalogo = new Catalogo(datiCat.proprietario, datiCat.titolo)
            c.createdAt = datiCat.createdAt
            c.secretkey = datiCat.secretKey
            c.uid = datiCat.uid
            c.id = datiCat.id

            lc.push(c)
            console.log('💉 getCataloghi_B() push: ', c.titolo)
        })
        console.log('💉 getCataloghi_B() complete push, tot: ', lc.length)
    })
    console.log('💉 getCataloghi_B() ENDS return tot: ',lc.length)

    return lc
}
*/



/*
export const addCatalogo = ( catalogo : Catalogo, user_id : string )=>{

  console.log('\n addCatalogo() \n\n')

   let cataloghiRef = db.collection('cataloghi')

   const { serverTimestamp } = firebase.firestore.FieldValue

   cataloghiRef.add({
        titolo: catalogo.titolo,
        proprietario: catalogo.proprietario,
        uid: user_id,
        // Lista immagini has one to many relationship with catalogId
        secretKey: catalogo.secretkey,
        id: catalogo.id,
        createdAt: serverTimestamp()
   })

}
*/


/* 
// move to class utente
export function setImagesForCurrentCatalog(utente: Utente, immagini : Immagine[]) : Utente{
  //console.log(utente.listaCataloghi)
  //console.log(utente.listaCataloghi.length)
  //utente.listaCataloghi.forEach(cat => console.log(cat))
  //utente.listaCataloghi[utente.indexCatalogNow].listaImmagini = immagini 
  utente.getCurrentCatalog_cid().listaImmagini = immagini
  return utente
} */

