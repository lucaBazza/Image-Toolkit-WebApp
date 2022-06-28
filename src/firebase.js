/** 
 *    FILE GENERALE FIREBASE   
 * 
*/


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  apiKey: "AIzaSyDbPN5NRUzz7Vx3aDTd_CO1PkqRNVD5EZg",
  authDomain: "image-toolkit-app.firebaseapp.com",
  projectId: "image-toolkit-app",
  storageBucket: "image-toolkit-app.appspot.com",
  messagingSenderId: "1085638783123",
  appId: "1:1085638783123:web:1766dcac980664b73b5d66",
  measurementId: "G-KL2DRYDLE8"
} 


// IMPORTS firebase v9  TODO: import analytics
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { getApp } from "firebase/app"

const firebaseApp = firebase.initializeApp(firebaseConfig)
export const db = firebaseApp.firestore()
export const storage = getStorage()
export const auth = firebase.auth()
export const functions = getFunctions(getApp())


const EMULATOR_ENABLED = process.env.NODE_ENV === 'development'

/**
 *    Emulator    https://stackoverflow.com/questions/58260877/access-firebase-emulator-from-local-network
 */
 import { connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
import { connectAuthEmulator } from "firebase/auth"
const isEmulator = ()=>{ return location.hostname === 'localhost' || location.hostname === '192.168.1.78' }
if( EMULATOR_ENABLED && isEmulator ){
  const addr = 'localhost'
  connectFirestoreEmulator(db, addr, 8081)
  connectStorageEmulator(storage, addr, 9199)
  connectAuthEmulator(auth, `http://${addr}:9099`,{ disableWarnings: true })
  connectFunctionsEmulator(functions, addr, 5001)
  console.log("%c" + "Firebase Emulator Mode", "color: #7289DA; -webkit-text-stroke: 2px black; font-size: 48px; font-weight: bold;");
}



/**
 *    { ... }  useAuth()  destrutturare
 *    from firechat example
 */
import {ref, onUnmounted, computed} from 'vue'
import Settings from './types/Settings'
export function useAuth(){
  const user = ref(null)

  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))

  onUnmounted(unsubscribe)

  const isLogin = computed( ()=> user.value !== null )

  const signIn = async () =>{
      const googleProvider = new firebase.auth.GoogleAuthProvider()
      await auth.signInWithPopup(googleProvider)
  }
  const signOut = () => auth.signOut()

  return { user, isLogin, signIn, signOut }
}





/*
const userCollection = db.collection('users')

export const createUser = user => {
  return userCollection.add(user)
}

export const getUser = async id =>{
  const user = await userCollection.doc(id).get()
  return user.exist ? user.data() : null
}

export const updateUser = (id, user) => {
  return userCollection.doc(id).update(user)
}

export const deleteUser = id => {
  return userCollection.doc(id).delete
}

export const useLoadUsers = ()=>{
  const users = ref([])
  const close = userCollection.onSnapshot(snapshot =>{
    users.value = snapshot.docs.map(doc =>({id: doc.id, ...doc.data() }))
  })
  onUnmounted(close)
  return users
}
*/



/**
 *  Gestisce stato log in/out
 *    - aggiorna Utente con dati di firebase
 *    - quando slogga toglie le refs utente a firebase
 */
/*export function onAuthStateChanged_luca(){ 
  console.log('onAuthStateChanged_luca()')
  auth.onAuthStateChanged(user =>{
    if(user){
      let u = user
      console.log('Auth status changed, user logged: ', user['displayName'])
      console.log(user)

      let displayName = this?.user['displayName']
      let email = this?.user['email']
      let photoURL = this?.user['photoURL']
      let uid = this?.user['uid']
      

      this.utenteSng = new Utente(displayName,'psw Google',[]).setEmail(email).setPhotoURL(photoURL).setUID(uid)

      getCataloghi_B(uid)
                  .then(datas => this.utenteSng.setListaCataloghi(datas) )
                  .catch(ex => console.log('getCataloghi error: ', ex) )
      
    }
    else {
      console.log('Auth status changed, user log out!')
      unsub_refCatalogs && unsub_refCatalogs()
    }
  }) 
}*/


/**
 *    Firebase basics https://youtu.be/q5J5ho7YUhA
 *      login con pop-up google e logout
 */
 
/*
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export const signInGoogle = async () => auth.signInWithPopup(provider)
export const signOutGoogle = async () => auth.signOut()
*/


/**
 *    logica: quando l'utente cambia di stato -loggato o meno- vado a mostrare alcuni componenti 
*/

/*
let cataloghi;
let unsub_refCatalogs;
export const onAuthStateChanged = auth.onAuthStateChanged( user =>{
  if(user){
    
    cataloghi = db.collection('cataloghi')

    const addCatalogo = () =>{
      const { serverTimestamp } = firebase.firestore.FieldValue;

      cataloghi.add({
        uid: user.uid,
        name: 'test add catalogo',
        createdAt: serverTimestamp()
      })
    }

    unsub_refCatalogs = cataloghi
                                .where('uid', '==', user.uid)
                                .orderBy('createdAt')
                                .onSnapshot( querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return console.log(doc.data())
                })
    })
    
  }
  else {
    unsub_refCatalogs && unsub_refCatalogs()
  }
})
*/

//export const addCatalogo = ( catalogo )=>{
//  db.collection('cataloghi').doc(user_id).set({catalogo}, {merge: true})
//}
