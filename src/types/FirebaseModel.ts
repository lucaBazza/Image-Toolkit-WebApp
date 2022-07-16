import firebase from 'firebase/compat/app';
import { db } from '@/firebase'
import { doc, getDoc, setDoc, serverTimestamp, query, updateDoc, deleteField, deleteDoc } from "firebase/firestore"

import Utente from "./Utente"
import Catalogo from "./Catalogo"
import Immagine from './Immagine'
import getLocalizationInfos from '@/utilities/Ip-localization-api'
import { utenteConverter, catalogoConverter, immagineConverter } from '@/types/Firebase_converters'
import { deleteImageFacade } from './Firebase_immagini';

export let unsubscribeToRefs 
export const USER_COL = "utentiprefs"
export const CATALOGHI_COL = "cataloghi"
export const IMMAGINI_COL = "immagini"
export const IMPOSTAZIONI_COL = "impostazioni"



/**
 *   Inserisce nella raccolta 'cataloghi' firebase un nuovo documento catalogo
 *    - imoprta i campi della classe catalogo
 *    - NON inizializza una sotto-raccolta immagini
 *    - restituisce l'id del catalogo, oppure reject se manca uid
 *        + TODO: check preliminare se catalogo esiste già con stesso titolo
 */
export async function addCatalogo3(catalogo : Catalogo ){
  console.log('addCatalogo3 :', catalogo.setCatalog_cid(`temp-${catalogo.titolo}-${catalogo.uid}`))
  if( 2 > catalogo.uid.length) 
    return Promise.reject(`Failed to add catalog, invalid uid: ${catalogo.uid ? catalogo.uid : '-' }`)
  let cataloghiRef = db.collection(CATALOGHI_COL).withConverter(catalogoConverter)
  let res = await cataloghiRef.add(catalogo.setCreateDate_fs(serverTimestamp()))
  console.log('\n addCatalogo3() \n\n ID firebase del documento aggiunto : ', res.id, '\n\n')
  return Promise.resolve(res.id)
}


/**
 *  Carica dati extra utente, oppure crea nuovo account
 *  implementare -> https://www.youtube.com/watch?v=wvRVfyPKOA0
 */
export async function loadUserSettings(u : firebase.User) : Promise<Utente>{
  //console.log('loadUserSettings() : ', u)
  let res : Utente
  const docSnapshot = await firebase.firestore().collection(USER_COL).withConverter(utenteConverter).doc(u.uid).get()
  if( docSnapshot.exists )
    res = await docSnapshot.data() as Utente
  else 
    res = await registerNewUtenteFirestore(u)

  //console.log('loaded user settings: ', res.getDatiUtente())
  return res
}


async function registerNewUtenteFirestore(u: firebase.User){
  const ref = doc(db, USER_COL, u.uid).withConverter(utenteConverter)
    
  const newUtente = Utente.getInstance().setNome( u.displayName ! )
                                        .setEmail( u.email ! )
                                        .setPhotoURL( u.photoURL ? u.photoURL : '')
                                        .setUID(u.uid)
                                        .setSubscription_date(serverTimestamp())
                                        .setAllowNotifications(false)                      
  await setDoc(ref, newUtente)
  console.log('\n\n \tCreate new userprefs for: ', newUtente.getDatiUtente() , "\n\n")
  return newUtente
}



export async function updateLocalizationUser(utente : Utente){
  const localization = await getLocalizationInfos() // la localizzazione va aggiornata dopo il caricamento / registrazione utente
  console.log('current ip is: ', localization.lastIp, localization)
  const ref = doc(db, USER_COL, utente.uid).withConverter(utenteConverter)
  setDoc(ref, utente.setLocation(localization.location).setLastIp(localization.lastIp))
    .then( () => console.log('Localization updated') )
    .catch( err => console.log(err) )
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
        console.log('Warning, dont have catalog inserted 😭')
        //return Promise.reject('Warning, dont have catalog inserted 😭')
      else
        lc = querySnapshot.docs.map(doc => { return doc.data() as Catalogo })
  })
  unsubscribeToRefs = db.collection(CATALOGHI_COL)
  //console.log('💉 getCataloghi_B() ENDS return tot: ', lc.length)
  return lc.length > 0 ? Promise.resolve(lc) : []//Promise.reject('\t ✋ Snapshot catalogs is loading...')
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
 * @param cid catalogo da caricare
 */
export async function getCatalog_fs( cid : string) : Promise<Catalogo>{
  console.log('getCatalog_fs() : ' , cid)
  const ref = doc(db, CATALOGHI_COL, cid).withConverter(catalogoConverter)
  const docSnap = await getDoc(ref)
  if (docSnap.exists())
    return Promise.resolve(docSnap.data())
  else return Promise.reject(`User has no catalog ${cid}`)
}


/**
 *   Listo i nomi dei documenti nel catalogo scelto
 */
export async function getCatalogsID_fromUserID(uid: string) : Promise<string[]>{
  let a = await db.collection(CATALOGHI_COL).where('uid','==',uid).get()
  return a.docs.map( q => { return q.id })
}


/**
 *  Aggiornamento una-tantum utente
 */
export async function updateUser(utente: Utente){
  await db.collection(USER_COL).doc(utente.uid).update( utenteConverter.toFirestore(utente) ).catch((ex: any)=>console.log(ex))
}


/**
 * https://www.youtube.com/watch?v=s1frrNxq4js
 *    TODO: delete also the images inside!
 */
export async function deleteCatalog(cid: string){
  const promiseDeleteImages = Utente.getInstance().getCatalog_by_cid(cid)!.listaImmagini.map( img => deleteImageFacade(img).catch(err=>console.log(`Fail promiseDeleteImages() ${img.nomeFile} ${err}`)) )
  return Promise.all([ deleteDoc( doc(db,CATALOGHI_COL, cid) ), promiseDeleteImages ])
}


/**
 * 
 * @param uid utente da cui caricare i cataloghi
 * @param cid catalogo da ricercare
 * @returns promessa vero/falsa se esiste o meno tale catalogo 
 */
export async function existCatalogForUtente(uid: string, cid: string) : Promise<boolean>{    
  let cats = await getCatalogsID_fromUserID(uid)
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



/**
 *   Inserisce nella raccolta 'cataloghi' firebase un nuovo documento catalogo
 *    - imoprta i campi della classe catalogo
 *    - NO inizializza una sotto-raccolta immagini
 *    - restituisce un speciale id : string che è l'identificativo firebase del documento
 *        + TODO: vedere se / come occorre usare/aggionrare tale id  nel client 
 *        + TODO: usare catalogConverter
 *        + TODO: check preliminare se catalogo esiste già con stesso titolo
 */
/* export async function addCatalogo2( catalogo : Catalogo, user_id : string ){
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
}*/