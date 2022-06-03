/**
 * 
 *  NODE SERVER
 *  
 *      node ./src/server  || npm run devserver
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


var zabbaApiModule = require('./server/api.js')
zabbaApiModule.avviaApi(app);


const server_port = 3000 || process.env.PORT;
app.listen( server_port, ()=> console.log(`\tHost in ascolto, raggiungibile a http://localhost:${server_port} \n\n`))

// TODO IMPLEMENTARE HOT RELOAD demon
// https://stackoverflow.com/questions/1972242/how-to-auto-reload-files-in-node-js

// TODO IMPLEMETARE DEBUGGER