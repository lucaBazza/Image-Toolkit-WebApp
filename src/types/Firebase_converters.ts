import Utente from "./Utente"
import Catalogo from "./Catalogo"
import Immagine from './Immagine'
import Classification from "./Classification"
import firebase from 'firebase/compat/app'
import Exif from "./Exif"
// import { stringLength } from "@firebase/util"

/**
 *    C L A S S   C O N V E R T E R
 */

const alsoEmpty = (v:any)=>{ return v ? v : ''}
function checkExist_stringfy(val){ return val ? ( isJson(val) ? JSON.stringify(val) : val ) : '' }
function isJson(str) { try { JSON.parse(str) } catch (e) { return false } return true }

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
    toFirestore: (immagine : Immagine) => {
        return {
            // src: immagine.src.length < 2048 ? immagine.src : '', // se troppi parametri o base64
            nomeFile: immagine.nomeFile,
            realURL: immagine.realURL,
            alt: alsoEmpty(immagine.alt),
            catalogoID: immagine.catalogoID,
            createdAt: immagine.createdAt ? immagine.createdAt : firebase.firestore.FieldValue.serverTimestamp(),
            adjustmentID: immagine.adjustmentID,
            width: immagine.width,
            height: immagine.height,
            size: immagine.size,
            uploadedAt: immagine.uploadedAt ? immagine.uploadedAt : firebase.firestore.FieldValue.serverTimestamp(),
            
            exifData: immagine.exifDatas ? exifHelperTo(immagine.exifDatas) : null,
            classifier: immagine.classificatore ? classificatoreHelperTo(immagine.classificatore) : null
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let out = new Immagine('') /* data.src */    // indicare realUrl > url   come src
        out.imgID = snapshot.id

        out.nomeFile = data.nomeFile
        out.realURL = data.realURL
        out.alt = snapshot.alt
        out.catalogoID = data.catalogoID
        out.createdAt = data.createdAt
        out.adjustmentID = data.adjustmentID
        out.width = data.width
        out.height = data.height
        out.size = data.size
        out.uploadedAt = data.uploadedAt
        
        if(data.exifData)
            out.exifDatas = data.exifData as Exif
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

function exifHelperTo( ex : Exif){
    let helper = {} as Exif

    helper.Make = checkExist_stringfy( ex.Make )
    helper.Model = checkExist_stringfy( ex.Model )
    helper.Orientation = checkExist_stringfy( ex.Orientation )
    helper.XResolution = checkExist_stringfy( ex.XResolution )
    helper.YResolution = checkExist_stringfy( ex.YResolution )
    helper.ResolutionUnit = checkExist_stringfy( ex.ResolutionUnit )
    helper.DateTime = checkExist_stringfy( ex.DateTime )
    helper.YCbCrPositioning = checkExist_stringfy( ex.YCbCrPositioning )
    helper.ExifIFDPointer = checkExist_stringfy( ex.ExifIFDPointer )
    helper.ExposureTime = checkExist_stringfy( ex.ExposureTime )
    helper.FNumber = checkExist_stringfy( ex.FNumber )
    helper.ExifVersion = checkExist_stringfy( ex.ExifVersion )
    helper.DateTimeOriginal = checkExist_stringfy( ex.DateTimeOriginal )
    helper.DateTimeDigitized = checkExist_stringfy( ex.DateTimeDigitized )
    helper.ComponentsConfiguration = checkExist_stringfy( ex.ComponentsConfiguration )
    helper.CompressedBitsPerPixel = checkExist_stringfy( ex.CompressedBitsPerPixel )
    helper.ShutterSpeedValue = checkExist_stringfy( ex.ShutterSpeedValue )
    helper.ApertureValue = checkExist_stringfy( ex.ApertureValue )
    helper.ExposureBias = checkExist_stringfy( ex.ExposureBias )
    helper.MaxApertureValue = checkExist_stringfy( ex.MaxApertureValue )
    helper.MeteringMode = checkExist_stringfy( ex.MeteringMode )
    helper.Flash = checkExist_stringfy( ex.Flash )
    helper.FocalLength = checkExist_stringfy( ex.FocalLength )
    helper.FlashpixVersion = checkExist_stringfy( ex.FlashpixVersion )
    helper.ColorSpace = checkExist_stringfy( ex.ColorSpace )
    helper.PixelXDimension = checkExist_stringfy( ex.PixelXDimension )
    helper.PixelYDimension = checkExist_stringfy( ex.PixelYDimension )
    helper.InteroperabilityIFDPointer = checkExist_stringfy( ex.InteroperabilityIFDPointer )
    helper.FocalPlaneXResolution = checkExist_stringfy( ex.FocalPlaneXResolution )
    helper.FocalPlaneYResolution = checkExist_stringfy( ex.FocalPlaneYResolution )
    helper.FocalPlaneResolutionUnit = checkExist_stringfy( ex.FocalPlaneResolutionUnit )
    helper.SensingMethod = checkExist_stringfy( ex.SensingMethod )
    helper.FileSource = checkExist_stringfy( ex.FileSource )
    helper.CustomRendered = checkExist_stringfy( ex.CustomRendered )
    helper.ExposureMode = checkExist_stringfy( ex.ExposureMode )
    helper.WhiteBalance = checkExist_stringfy( ex.WhiteBalance )
    helper.DigitalZoomRation = checkExist_stringfy( ex.DigitalZoomRation )
    helper.SceneCaptureType = checkExist_stringfy( ex.SceneCaptureType )
    helper.Author = checkExist_stringfy( ex.Author )
    helper.Artist = checkExist_stringfy( ex.Artist )

    return helper
}
