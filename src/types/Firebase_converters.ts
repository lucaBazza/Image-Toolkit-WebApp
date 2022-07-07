import Utente from "./Utente"
import Catalogo from "./Catalogo"
import Immagine from './Immagine'
import Classification from "./Classification"
import firebase from 'firebase/compat/app'
// import { map } from "@firebase/util"

/**
 *    C L A S S   C O N V E R T E R
 */

const alsoEmpty = (v:any)=>{ return v ? v : ''}

export const utenteConverter = {
    toFirestore: (utente) => {
        return {
            nome: utente.nome,
            email: utente.email,
            password: alsoEmpty(utente.password),
            secretKey: alsoEmpty(utente.secretKey),
            photoURL: alsoEmpty(utente.photoURL),

            selected_cid: alsoEmpty(utente.selected_cid),
            subscription_date: alsoEmpty(utente.subscription_date),     // se non presente indicare data attuale?
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(), //alsoEmpty(utente.lastLogin),
            allowNotifications: utente.allowNotifications?'true':'false',
            active_plan: utente.active_plan ? utente.active_plan : 'free',
            watermark_src: alsoEmpty(utente.watermark_src),
            public_gallery: alsoEmpty(utente.public_gallery),
            lastIp: alsoEmpty(utente.lastIp),                           // last ip essendo async è meglio chiamarlo prima
            location: alsoEmpty(utente.location)                        // in fase di composizione
        }
    },
    fromFirestore: (snapshot, options) => {
        //console.log('FirebaseModel.immagineConverter() ', snapshot)
        const data = snapshot.data(options)
        let out = Utente.getInstance()
        out.setNome(data.nome)
        out.email = data.email
        out.password  = data.password
        out.secretKey  = data.secretKey
        out.photoURL = data.photoURL
        out.selected_cid  = data.selected_cid
        out.uid = snapshot.id
        
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
 
export const catalogoConverter = {
    toFirestore: (catalogo) => {
        return {
            proprietario: catalogo.proprietario,
            titolo: catalogo.titolo,
            uid: catalogo.uid,
            secretkey: catalogo.secretkey,
            // id: catalogo.id,
            createdAt: catalogo.createdAt,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let out = new Catalogo(data.proprietario, data.titolo).setCatalogUserID(data.uid)
        out.secretkey = data.secretKey
        out.createdAt = data.createdAt
        out.cid = snapshot.id
        return out
    }
}
 
export const immagineConverter = {
    toFirestore: (immagine) => {
        return {
            nomeFile: immagine.nomeFile,
            src: immagine.src.length > 2048 ? '' : immagine.src, // TODO: non salvare il campo src ? tanto c'è realURL  -> rinominare:   url
            realURL: immagine.realURL,
            id: immagine.id,
            exifDatas: alsoEmpty(immagine.exifData),
            // imgID: immagine.imgID,
            alt: alsoEmpty(immagine.alt),
            catalogoID: immagine.catalogoID,
            createdAt: immagine.createdAt ? immagine.createdAt : firebase.firestore.FieldValue.serverTimestamp(),
            adjustmentID: immagine.adjustmentID,
            width: immagine.width,
            height: immagine.height,
            size: immagine.size,
            classifier: immagine.classificatore ? classificatoreHelperTo(immagine.classificatore) : null
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let out = new Immagine(data.src)    // indicare realUrl > url   come src
        out.nomeFile = data.nomeFile
        out.realURL = data.realURL
        // out.id = snapshot.id
        out.exifDatas = data.exifDatasID
        out.imgID = snapshot.id
        out.alt = snapshot.alt
        out.catalogoID = data.catalogoID
        out.createdAt = data.createdAt
        out.adjustmentID = data.adjustmentID
        out.width = data.width
        out.height = data.height
        out.size = data.size

        if(data.classifier)
            out.classificatore = data.classifier.map( dat => dat as Classification )

        return out
    }
}

/**
 *      https://stackoverflow.com/questions/58737899/how-do-i-get-map-object-from-firebase-in-typescript  
*/
function classificatoreHelperTo( cls : Classification[] ){
    return cls.map( cl => {
        let helper = {} as Classification
        helper.label = cl.label
        helper.confidence = cl.confidence
        return helper
    })
}