/**
 * 
 *  NODE SERVER
 *  
 *      node ./src/server  || npm run devserver
 * 
 */


/*      ROADMAP
    - fare la funzione che genera gli exif e li allega alle foto
    - fare api che invia le foto con gli exif
    - fare api che dato un'id foto ne cambia una proprieta
*/

console.log(".\n\n.\n\n.\t\t 👑 Server Zabba NodeJS 👑 \n\n.\n\n.")
console.log("\t\t 👨 processo node: " + process.env.USER +"\n")

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const cors = require('cors')                // Cross-Origin Resource Sharing(CORS) configure Express to combine headers specifying that your Rest API accepts requests from any source. 
const bodyParser = require('body-parser')   // convert the base of incoming applications into JavaScript objects
const Sequelize = require('sequelize')
const finale = require('finale-rest')
const express = require('express')

var ip = require("ip");
const server_ip = "http://" + ip.address()
const server_port = 3000 || process.env.PORT

let app = express()
app.use(cors())
app.use(bodyParser.json())

// evento callback DOPO la che node ha terminato l'esecuzione 
process.on('exit', function(){
    console.log("\n\n callback post exit del processo node \n\n \t💣 endgame 💣 \n\n\n\n")
})


import {zabbaApiModule} from './api.mjs';
zabbaApiModule(app, server_ip, server_port);


app.listen( server_port, ()=> console.log(`\tHost in ascolto, raggiungibile a ${server_ip}:${server_port} \n\n`))




/*
/// esempio di variabile globale
global.valoreMassimo = 12

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
//leggiText('./src/server/testDaLeggere.txt');
*/