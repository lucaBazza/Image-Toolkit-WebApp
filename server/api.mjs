//module.export = {
//    science: '🍥' 
//}
//const { readFile } = require('fs').promises;


import { readFile } from 'fs';                      // Read Write files
import { stat } from 'fs/promises';                 // Check file exist
import formidable from 'formidable';

import { createRequire } from "module";
const require = createRequire(import.meta.url);     // Define "require"

var fs = require('fs');                             // Move files


export function zabbaApiModule(app){

/**
 *  adesso si fa con express gli url endpoints
*           request = dati che arrivano dall'utente
*           response = quello che rispondo
*/
    app.get('/', async (request, response)=>{
        const htmlfilePath = 'paginaHome.html';

        /*
                /// listo i file nella cartella del server Current Working Directory
        scannerizzaCWD();
        
                /// controllo file esiste
        controllaFileExist(htmlfilePath);

                /// invio file sincrono
        fs.readFile(htmlfilePath, 'utf8', (err, data) => {
            if (err) { console.error(err); return; }
            response.send( data );
        });
        */        

                /// invio file asincrono
        response.send( await fs.promises.readFile(htmlfilePath, { encoding: 'utf8' }) );  //response.send( await readFile(htmlfilePath) ); // readFile(htmlfilePath,'utf8')
        console.log(`Request page ${htmlfilePath} \t from ${request.rawHeaders[1]}`);
    });


/**
 * 
*/
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


/**
 *          EXIFS
*/
    app.get('/exifs', async (req, res)=>{
        var ExifImage = require('exif').ExifImage;
        
        const srcImage = './upload/' + 'DSC06211_ps.jpg';
        await stat(srcImage)
            //.then(()  => res.send(`${srcImage} exist`) )
            .catch(() => res.send(`${srcImage} not exist`) )

        try {
            new ExifImage({ image : srcImage }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else{
                    console.log(exifData);
                    res.send(exifData);
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
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

function scannerizzaCWD(){
    /// listo i file nella cartella del server
    fs.promises.readdir(process.cwd())
    .then(filenames => { for (let filename of filenames) console.log(filename) })   // If promise resolved and datas are fetched
    .catch(err => {  console.log(err) })                                            // If promise is rejected
}

function controllaFileExist(file){
    /*await*/ stat(file)
        .then(()  => console.log(`${file} exist`) )         // response.send(readFile(file,'utf8') )
        .catch(() => console.log(`${file} not exist`) );    // response.send(`${file} not exist`)
}