/**
 * 
 *  NODE SERVER
 *  
 *      node ./src/server
 * 
 */

console.log(".\n\n.\n\n.\t\t 👑 Server Zabba NodeJS 👑 \n\n.\n\n.")
console.log("\t\t 👨 processo node: " + process.env.USER +"\n")
//const path = require('path');

const cors = require('cors')                // Cross-Origin Resource Sharing(CORS) configure Express to combine headers specifying that your Rest API accepts requests from any source. 
const bodyParser = require('body-parser')   // convert the base of incoming applications into JavaScript objects
const Sequelize = require('sequelize')
const finale = require('finale-rest')

const express = require('express')
let app = express()
app.use(cors())
app.use(bodyParser.json())



/// esempio di variabile globale
global.valoreMassimo = 12

// evento callback DOPO la funzioone exit 
process.on('exit', function(){
    console.log("callback post exit del processo node")
})

const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('lunch',()=>{
    console.log('magna 🍔')
})

//eventEmitter.emit('lunch')
//eventEmitter.emit('lunch')



const { readFile } = require('fs').promises;
async function leggiText(path){
    const filetext = await readFile(path,'utf8');
    console.log(filetext);
}
leggiText('./src/server/testDaLeggere.txt');


// non esattamente funzionante 
const api = require('./server/api.js');
///console.log(api);


// ok adesso si fa con express gli url endpoints
app.get('/foo',(request, response)=>{
    // request = dati che arrivano dall'utente
    // response = quello che rispondo
    //readFile('./src/server/foo.html','utf8',(err, html) => {
    //    if(err)
    //        response.status(500).send('Sorry errore interno');
    //    response.send(html);
    //})
    //response.send( await readFile('./src/server/foo.html','utf8') );
    response.send("ciao");
});

app.get('/', async (request, response)=>{
    response.send( await readFile('./src/server/foo.html','utf8') );
});




// https://javascript.plainenglish.io/upload-images-in-your-node-app-e05d0423fd4a
const multer = require('multer');
const folderUploads = './upload/' //'./src/server/';

//images to be stored in uploads
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folderUploads)
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
    }
})
const fileFilter=(req, file, cb)=>{
    //if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png') cb(null,true);
    //else cb(null,false);
    cb(null, (file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png') );
}
var upload = multer({ storage: storage, fileFilter:fileFilter });
app.post('/api/upload', upload.single('myImg'), async (request, response)=>{
    console.log("Arrivata POST per: \t api/upload");
    console.log(reqest);
    //try{
    if(request.file){
        const pathName = request.file.path;
        response.status(200).send(/*request.file , */pathName);
    }
    //}
    //catch(ex){ console.log(ex) }
});
app.get('/api/upload', async (request, response)=>{ response.send( "non accetto get solo POST immagini" ); });





const server_port = 3000 || process.env.PORT;
app.listen( server_port, ()=> console.log(`\tHost in ascolto, raggiungibile a http://localhost:${server_port} \n\n`))

// TODO IMPLEMENTARE HOT RELOAD demon
// https://stackoverflow.com/questions/1972242/how-to-auto-reload-files-in-node-js

// TODO IMPLEMETARE DEBUGGER