const functions = require("firebase-functions");
/**
 *      ROADMAP
 *  - backgorund trigger per creare exif datas quando viene caricata una nuova immagine in storage
 *  - creare invio email/notifica quando un'utente si iscrive
 *  
 *      https://firebase.google.com/docs/functions/write-firebase-functions
 */

const sendEmail = require('./nodemailer')


/**
 *      redirect 
 */
exports.toThePortfolio = functions.https.onRequest((request, response)=>{
    response.redirect('https://lucabazza.github.io/')
})


/**
 *      http://0.0.0.0:5001/image-toolkit-app/us-central1/sendMailToBoss
 */
exports.sendMailToBoss = functions.https.onRequest((request, response)=>{
    console.log('sendMailToBoss chiamata')
    sendEmail.sendEmailZabba({to:'info@lucabazzanella.com',subject:'test invio', body:'test-body function'})
})



/**
 *  
 */
exports.generateExifs = functions.storage.object().onFinalize(async (object) => {
    console.log('\n\n\ngenerateExifs() C \n\n\n')
    console.log(object.name, '\n\n')

    var parser = require('exif-parser')
    const fs = require('fs')

    let buffer
    try{ buffer = await fs.readFileSync(object.mediaLink) }
    catch(ex){ console.log(ex.message) }

    buffer ? console.log(JSON.stringify(parser.parse(buffer), null, 2)) : console.log('\n\n\n 😭 image not loaded 😭 \n\n\n') 
})



/*

{
  kind: '#storage#object',
  name: 'immagini/DSC09183-ProPs.webp',
  bucket: 'image-toolkit-app.appspot.com',
  generation: '1656437614450',
  metageneration: '1',
  contentType: 'image/webp',
  contentDisposition: 'inline',
  timeCreated: '2022-06-28T19:33:34.449Z',
  updated: '2022-06-28T19:33:34.460Z',
  storageClass: 'STANDARD',
  size: '730202',
  md5Hash: 'YmDinerOO1hNPPUCkVLomg==',
  etag: 'HHqg9T1xn4LTFcufDo5cnIXYN6g',
  cacheControl: 'public, max-age=3600',
  contentEncoding: 'identity',
  crc32c: '----1g==',
  timeStorageClassUpdated: '2022-06-28T19:33:34.449Z',
  id: 'image-toolkit-app.appspot.com/immagini/DSC09183-ProPs.webp/1656437614450',
  selfLink: 'http://0.0.0.0:9199/storage/v1/b/image-toolkit-app.appspot.com/o/immagini%2FDSC09183-ProPs.webp',
  mediaLink: 'http://0.0.0.0:9199/download/storage/v1/b/image-toolkit-app.appspot.com/o/immagini%2FDSC09183-ProPs.webp?generation=1656437614450&alt=media'
}
  
*/



/**
 *  https://firebase.google.com/docs/functions/get-started
 * 
 */
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
/*
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase()
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true})
});
*/



/**
 *  NetNinja #4 Deploying function
 *        https://www.youtube.com/watch?v=gYF32BrHVlA
 *  
 *  Genera un numero random
 * 
 *  endpoint: 
 *      firebase emulator GUI > cloud function log
 *      http://0.0.0.0:5001/image-toolkit-app/us-central1/randomNumber
 */
/*  exports.randomNumber = functions.https.onRequest((request, response)=>{
    const number = Math.round(Math.random() * 100)
    response.send(number.toString())
}) */