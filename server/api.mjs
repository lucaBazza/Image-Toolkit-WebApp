//module.export = {
//    science: '🍥' 
//}
//const { readFile } = require('fs').promises;

//const formidable = require('formidable');
//import {IncomingForm} from "formidable";
import { readFile } from 'fs';                      // Read Write files
import { stat } from 'fs/promises';                 // Check file exist
import formidable from 'formidable';

import { createRequire } from "module";
const require = createRequire(import.meta.url);     // Define "require"

var fs = require('fs');                             // Move files

//var formidable = require('formidable').promises;
/*,     http = require('http'),
        util = require('util');
*/
export function zabbaApiModule(app){
//exports.zabbaApiModule = function(app) {

    /// adesso si fa con express gli url endpoints
    app.get('/', async (request, response)=>{
        // request = dati che arrivano dall'utente
        // response = quello che rispondo
        const htmlFilePath = './foo.html';
        await stat(htmlFilePath)
            .then(() => response.send(readFile(htmlFilePath,'utf8') ) )
            .catch(() => response.send(`${htmlFilePath} not exist`) );
        //response.send( await readFile('foo.html'/*,'utf8'*/) );
    });




    const folderUploads = './upload/';
    app.post('/formidable', async (req, res)=>{
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.image.filepath;
            var newpath = folderUploads + files.image.originalFilename;
            fs.rename(oldpath, newpath, function (err) { if (err) throw err; });

            console.log(`${newpath} \t\tcaricato 🌅`);
            res.send('File uploaded'); //res.write('File uploaded'); //res.end();
        });
    });
    
    // https://javascript.plainenglish.io/upload-images-in-your-node-app-e05d0423fd4a
    /*const multer = require('multer');
    const folderUploads = './upload/';

    //images to be stored in uploads
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folderUploads)
        },
        filename: function (req, file, cb) {
            cb(null,Date.now() +"_"+ file.originalname)
        }
    })
    const fileFilter=(req, file, cb)=>{
        cb(null, (file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png') );
    }
    var upload = multer({ storage: storage, fileFilter:fileFilter });

    app.post('/api/upload', upload.single('myImg'), async (request, response)=>{
        //console.log("Arrivata POST per: \t api/upload");
        if(request.file){
            const originalname = request.file.originalname
            const pathName = request.file.path;
            response.status(200).send(originalname); // .send(request.file , pathName);
            console.log(`upload immagine ${pathName} riuscito`);
        }
        else response.status(406).send("Not acceptable post");
    });
    
    app.get('/api/upload', async (request, response)=>{ console.log("No file"); response.send( "non accetto get solo POST immagini" ); });
    */
}