import firebase from 'firebase/compat/app';

import Utente from "./Utente"
import Catalogo from "./Catalogo"
import { db } from '@/firebase'

export let unsubscribeToRefs 

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


/**
 *      Carica da firestore la lista cataloghi e in un simil-DAO per convertirlo in oggetto Catalogo[]
 *      Ritorna array vuoto se non presente (non la genera in quanto viene fatto nell'add)
 *          // TODO muovere come metodo statico nella classe catalogo?
 */
export const getCataloghi = async (user_id: string) : Promise<Catalogo[]> => {
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
                                //.then( return cat)

    console.log(`getCataloghi() - firestore cats `, cat)

    return cat
}

/**
 *  https://javascript.plainenglish.io/using-firestore-with-typescript-in-the-v9-sdk-cf36851bb099
 * 
 */

import { getFirestore, CollectionReference, collection, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { FirebaseError } from '@firebase/util';
import Immagine from './Immagine';
// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(getFirestore(), collectionName) as CollectionReference<T>
}

// export all your collections
export const cataloghiCollection = createCollection<Catalogo[]>('cataloghi')
  



/**
 *      Restituisce promessa di array di cataloghi per l'utente selezionato
 *        !! attenzione: onSnaphot è reattivo al database firestore, TODO async push
 */
export async function getCataloghi_B(user_id: string) : Promise<Catalogo[]>{
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


// Firestore data converter per il catalogo
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
        const data = snapshot.data(options);
        let out = new Catalogo(data.proprietario, data.titolo).setCatalogUserID(data.uid)
        out.secretkey = data.secretKey
        out.id = data.id
        out.createdAt = data.createdAt
        return out
    }
}

/**
 *      Restituisce promessa di array di cataloghi per l'utente selezionato
 *        vers. C : 
 *          - Promise viene soddisfatta solo quando l'array catalogo è riempito
 *          - Uso q.get()  le risorse vengono caricate one-shot-time !
 */
 export async function getCataloghi_C(user_id: string) : Promise<Catalogo[]> {
  console.log(' \n \n getCataloghi_B : ', user_id, " \n\n")
  
  let lc : Catalogo[] = []

  const q = db.collection("cataloghi").withConverter(catalogoConverter).where("uid", "==", user_id)
  await q.get().then(querySnapshot => {
      if ( querySnapshot.empty )
        return Promise.reject('getCataloghi_C() Error, query found empty 😭 ')

      lc = querySnapshot.docs.map(doc => { return doc.data() as Catalogo }) //console.log('💉 getCataloghi_B() MAP \t tot: ', lc.length , lc)
  })

  unsubscribeToRefs = db.collection('cataloghi')
  
  //console.log('💉 getCataloghi_B() ENDS return tot: ', lc.length)

  return lc.length > 0 ? Promise.resolve(lc) : Promise.reject('Snapshoot cataloghi ancora in lavorazione...')
}





/**
 *  Gestisce stato log in/out
 *    - aggiorna Utente con dati di firebase
 *    - quando slogga toglie le refs utente a firebase
 */
export async function onAuthStateChanged_luca(utenteSng : Utente){ 
    console.log('onAuthStateChanged_luca() '/*, utenteSng*/)

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
            
            utenteSng = new Utente(displayName/*,'psw Google',[]*/)
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


export async function loadImagesFromCatalog_firebaseA(catalogID:number) : Promise<Immagine[]> {
  console.log('loadImagesFromCatalog_firebaseA() \n\t request catalog id:', catalogID , "\n\n\n")

  let out : Immagine[] = await Promise.resolve([])

  return out
}




export function setImagesForCurrentCatalog(utente: Utente, immagini : Immagine[]) : Utente{
  console.log('Utente.setImagesForCurrentCatalog(), ', immagini, utente)
  /*console.log(utente.listaCataloghi)
  console.log(utente.listaCataloghi.length)
  utente.listaCataloghi.forEach(cat => console.log(cat)) */
  utente.listaCataloghi[utente.indexCatalogNow].listaImmagini = immagini 

  return utente
}








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