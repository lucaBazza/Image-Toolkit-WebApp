/***    
 *          API FUNCTIONS 
 *              express gestisce gli url endpoints
 * 
 */
import { readFile } from 'fs';                      // Read Write files
import { stat } from 'fs/promises';                 // Check file exist
import formidable from 'formidable';                // Formattazione POST del media uploader
import path from 'path';                            // Ottenere directory assoluta
import {fileURLToPath} from 'url';                  // Ottenere directory assoluta

import { createRequire } from "module";
const require = createRequire(import.meta.url);     // Define "require"

var fs = require('fs');                             // Move files

const currentCatalogUser = 'Luca';

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);         // Definisco variabile per exist()
//console.log('directory-name 👉️', __dirname); 


export function zabbaApiModule(app){

    app.get('/', async (request, response)=>{
        const htmlfilePath = 'paginaHome.html';
                /// invio file asincrono
        response.send( await fs.promises.readFile(htmlfilePath, { encoding: 'utf8' }) );  //response.send( await readFile(htmlfilePath) ); // readFile(htmlfilePath,'utf8')
        console.log(`Request page ${htmlfilePath} \t from ${request.rawHeaders[1]}`);
    });


/**
 *  FORMIDABLE FOR IMAGE UPLOAD CACHE
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

/**
 *          invio per l'utente selezionato la foto che ha richiesto
 *              parametri richiesti:    utente, richiestaImg
*/
app.post('/image', async (req, res)=>{

    if( ! req.body.utente )
        return res.send({errore: 'Utente mancante'});
    if( ! (req.body.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});
    if( ! req.body.richiestaImg )
        return res.send({errore: 'Manca richiesta immagine'});

    
    //res.sendFile(req.body.richiestaImg);
    
    //const file = req.body.richiestaImg;
    /*
    await stat(file)
        .then( ()  => { 
            console.log(`${file} exist`);        
            res.sendFile(file); 
        })
        .catch( () => { 
            console.log(`${file} not exist`);    
            //res.send({errore: `${file} non trovato`});
            //scannerizzaCWD();
        });
    */
    
    //let hdrs = {    
    //    'X-Custom-Header': '123',
    //    'Content-Type': 'image/png',
    //    'bodyUsed': true
    //};

    //var filename = 'DSC01448_ps.jpg';
    var filename = req.body.richiestaImg.substring(req.body.richiestaImg.lastIndexOf('/')+1);
    const file = __dirname + "/upload/" + filename;
    //console.log(file);
    fs.access(file, fs.F_OK, (err) => {
        if (err) { console.log(`File not found ${file}`); /*console.error(err);*/ return res.status(404); }

        //res.writeHead(200, {'Content-Type': 'image/png'})
        //res.sendFile(file, { root: __dirname });
        res.sendFile(file);  
        //res.sendFile(file, {headers: hdrs, root: __dirname });
        console.log(`Image sended 📤 ${file} `);
    })
});

/**
 *  invia il catalogo al frontend
 *      - check validità
 *      - lista tutte le immagini
 *      - invia nomecatalogo, utente, secretkey, lista immagini[{src, exifs}]
 */
app.post('/imagelist', async (req, res)=>{  //app.post('/images/Luca', async (req, res)=>{
    if( ! req.body.utente )
        return res.send({errore: 'Utente mancante'});
    
    if( ! (req.body.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});

    // ottengo la lista delle immagini e i loro exifs, TODO caricare nome catalogo smart
    var globby = require('globby');
    const imagePaths = await globby("./upload/*.jpg");
    const catalogName = `Album impressioni di settembre`;

    // invio la lista più le informazioni del catalogo
    res.send({ 
        catalogName: catalogName,
        catalogOwner: req.body.utente,
        secretKey: new Date(),
        //cacheNumeroImmagini: imagePaths.length,

        // Formato delle immagini
        // { name, src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
        immagini: imagePaths.map( (i,index) => [{
            id: index,
            src: i, // "./upload/DSC06211_ps.jpg"
            src: `http://localhost:3000/image?utente=${req.body.utente}&richiestaImg=${i}`, // INVIO DIRETTAMENTE L'url magikko
            //name: `nomefile ${i} ${index}`, 
            name: i.substring(i.lastIndexOf('/')+1),    //var filename = req.query.richiestaImg.substring(req.query.richiestaImg.lastIndexOf('/')+1);
            title: `titolo ${i.substring(i.lastIndexOf('/')+1)} `,
            exifDatas: ottieniExif(i),
            class: 'immagineCatalogo',
            done: false
        }][0])
        
        //immagini: imagePaths.map( i => [{imgFile: i, exifDatas: ottieniExif('img')}][0] )
        /*[ { imgFile: 'imgFileA', exifDatas: ottieniExif('img') },
            { imgFile: 'imgFileB', exifDatas: ottieniExif('img') },
            { imgFile: 'imgFileC', exifDatas: ottieniExif('img') },
            { imgFile: 'imgFileD', exifDatas: ottieniExif('img') }
        ]*/
    });
    console.log(`Invio a utente ${req.body.utente} catalogo ${catalogName}  | tot ${imagePaths.length} \n`);
});

/**
 *         GET IMAGE with params
*/
app.get('/image', async (req, res)=>{
    if( ! req.query.utente )
        return res.send({errore: 'Utente mancante'});
    if( ! (req.query.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});
    if( ! req.query.richiestaImg )
        return res.send({errore: 'Manca richiesta immagine'});

    //var filename = 'DSC01448_ps.jpg';
    var filename = req.query.richiestaImg.substring(req.query.richiestaImg.lastIndexOf('/')+1);
    const file = __dirname + "/upload/" + filename;
    fs.access(file, fs.F_OK, (err) => {
        //if (err) { console.error(err); return; }
        if (err) { console.log(`File not found ${file} \n ${req.query.richiestaImg}`); /*console.error(err);*/ return res.status(404); }
        res.sendFile(file);
        console.log(`Image GET sended 📤 ${file} `);
    })
});


}   // END OF MODULE


function scannerizzaCWD(){
    /// listo i file nella cartella del server
    fs.promises.readdir(process.cwd())
    .then(filenames => { for (let filename of filenames) console.log(filename) })   // If promise resolved and datas are fetched
    .catch(err => {  console.log(err) })                                            // If promise is rejected
}

function controllaFileExist(file){
    /*await*/ stat(file)
        .then(()  => { console.log(`${file} exist`);        return true; } )         // response.send(readFile(file,'utf8') )
        .catch(() => { console.log(`${file} not exist`);    return false; } );    // response.send(`${file} not exist`)
}

function ottieniExif(img){
    var sizeOf = require('image-size');
    var dimensions = sizeOf(img);
    return [
            { label:'ImageWidth', val: dimensions.width }, 
            { label:'ImageHeight', val: dimensions.height },
            { label:'Software', val: 'Adobe Photoshop 22.1 (Macintosh)' },
            { label:'ModifyDate', val: '2021:05:24 16:07:10' },
            { label:'Copyright', val: 'zabba.lucabazzanella.com' },
            { label:'Aspect ratio', val: '4/5' },
            { label:'gps', val: "/"},
            { label:'classificazione', val: "⭐⭐⭐"},
            { label:'note', val: "..."}
    ]
}



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

//module.export = {
//    science: '🍥' 
//}
//const { readFile } = require('fs').promises;




/**
 *          ottiene lista immagini per utente
*/
/*
app.post('/imagelist', async (req, res)=>{  //app.post('/images/Luca', async (req, res)=>{
    if( ! req.body.utente )
        return res.send({errore: 'Utente mancante'});
    
    if( ! (req.body.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});

    // ottengo la lista delle immagini e i loro exifs
    var globby = require('globby');
    const imagePaths = await globby("./upload/*.jpg");

    // invio la lista più le informazioni del catalogo
    res.send({ 
        catalogName: `Carico catalogo di ${req.body.utente}`,
        numeroImmagini: imagePaths.length,
        immagini: imagePaths.map( i => [{imgFile: i, exifDatas: ottieniExif('img')}] )
        //[ { imgFile: 'imgFileA', exifDatas: ottieniExif('img') },
        //    { imgFile: 'imgFileB', exifDatas: ottieniExif('img') },
        //    { imgFile: 'imgFileC', exifDatas: ottieniExif('img') },
        //    { imgFile: 'imgFileD', exifDatas: ottieniExif('img') }
        //]
    });
    console.log(`Carico catalogo di ${req.body.utente} \n`);
});
*/