import Utente from "./Utente"
import Catalogo from "./Catalogo"
import Immagine from './Immagine'

/**
 *    C L A S S   C O N V E R T E R
 */

const alsoEmpty = (v:any)=>{ return v ? v : ''}
export const utenteConverter = {
    toFirestore: (utente) => {
        //console.log('utenteConverter() - user toFirestore() ', utente)
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
        out.uid = data.uid  // -> ! ! ! campo doppio di snapshot.id ! ! !
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
        // out.id = data.id
        out.createdAt = data.createdAt
        out.cid = snapshot.id
        return out
    }
}
 
export const immagineConverter = {
    toFirestore: (immagine) => {
        return {
            nomeFile: immagine.nomeFile,
            src: immagine.src.length > 2048 ? '' : immagine.src,
            realURL: immagine.realURL,
            id: immagine.id,
            exifDatas: alsoEmpty(immagine.exifData),
            imgID: immagine.imgID,
            alt: alsoEmpty(immagine.alt),
            catalogoID: immagine.catalogoID,
            createdAt: immagine.createdAt,
            adjustmentID: immagine.adjustmentID,
            width: immagine.width,
            height: immagine.height,
            size: immagine.size
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let out = new Immagine('')
        out.nomeFile = data.nomeFile
        out.src = data.src
        out.realURL = data.realURL
        out.id = data.id
        out.exifDatas = data.exifDatasID
        out.imgID = snapshot.id
        out.alt = snapshot.alt
        out.catalogoID = data.catalogoID //data.nomefile // TODO occorre usare il nome dello snapshot? (dovrebbe combaciare dal caricamento)
        out.createdAt = data.createdAt
        out.adjustmentID = data.adjustmentID
        out.width = data.width
        out.height = data.height
        out.size = data.size
        return out
    }
}