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


export function zabbaApiModule(app, server_ip, server_port){

    let prendiNome = (s) => s.substring(s.lastIndexOf('/')+1)   // utility function ottiene nome del file da path completo

/**
 *  ROOT PAGE FAKE DI TEST
 */
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
 *  VALIDA UTENTE 
 *      TODO -> leggere info user da database ! hardcoded
 */
const ___user = 'Luca'
const ___passw = 'lkjh$33ASd'
const ___SK = 'HGF475892SDG'
app.post('/user', async (req, res)=>{  //app.post('/images/Luca', async (req, res)=>{
    if( ! req.body.utente )
        return res.send({errore: 'Utente mancante'});
    
    if( ! (req.body.utente === ___user) )
        return res.send({errore: 'Utente non valido'});

    if( ! req.body.password )
        return res.send({errore: 'Password mancante'});
    
    if( ! (req.body.password === ___passw) )
        return res.send({errore: 'Password non valida'});

    if( ! req.body.secretKey )
        return res.send({errore: 'SK mancante'});
    
    if( ! (req.body.secretKey === ___SK) )
        return res.send({errore: 'Password non valida'});

    // Carico dati utente
    const utente = {
        nome: req.body.utente,
        password: req.body.password,
        secretKey: req.body.secretKey,
        email: `${req.body.utente.toLowerCase()}@icloud.com`,
        listaCataloghi: [
            { titolo: 'Go to the mountains',    proprietario: req.body.utente, secretKey: req.body.secretKey, listaImmagini: [], catalogId: 0 },
            { titolo: 'Schiazzi di mondi\'92',  proprietario: req.body.utente, secretKey: req.body.secretKey, listaImmagini: [], catalogId: 1 },
            { titolo: 'Androgenia del mare',    proprietario: req.body.utente, secretKey: req.body.secretKey, listaImmagini: [], catalogId: 2 },
            { titolo: 'Felicita sostenibile',   proprietario: req.body.utente, secretKey: req.body.secretKey, listaImmagini: [], catalogId: 3 },
        ],
        indexCatalogNow: 3
    }

    // invio la lista più le informazioni del catalogo
    res.send( utente );
    console.log(`Invio login utente ${req.body.utente} \t cataloghi: ${utente.listaCataloghi.length} \n
                   catalogo corrente: ${utente.listaCataloghi[utente.indexCatalogNow].titolo} \n`);
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
/*app.post('/image', async (req, res)=>{
    if( ! req.body.utente )
        return res.send({errore: 'Utente mancante'});
    if( ! (req.body.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});
    if( ! req.body.richiestaImg )
        return res.send({errore: 'Manca richiesta immagine'});
    //res.sendFile(req.body.richiestaImg);
    
    //const file = req.body.richiestaImg;
    
    //await stat(file)
    //    .then( ()  => { 
    //        console.log(`${file} exist`);        
    //        res.sendFile(file); 
    //    })
    //    .catch( () => { 
    //        console.log(`${file} not exist`);    
    //        //res.send({errore: `${file} non trovato`});
    //        //scannerizzaCWD();
    //    });
    
    
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
        if (err) { console.log(`File not found ${file}`); return res.status(404); }

        //res.writeHead(200, {'Content-Type': 'image/png'})
        //res.sendFile(file, { root: __dirname });
        res.sendFile(file);  
        //res.sendFile(file, {headers: hdrs, root: __dirname });
        console.log(`Image sended 📤 ${file} `);
    })
});
*/

/**
 *  invia il catalogo al frontend
 *      - check validità
 *      - se non presente il parametro id, viene assegnato di default il primo catalogo (TODO: implementare backend multi catalogo)
 *      - lista tutte le immagini NELLA CARTELLA UTENTE
 *      - invia nomecatalogo, utente, secretkey, lista immagini[{src, exifs}]
 */
app.post('/imagelist', async (req, res)=>{  //app.post('/images/Luca', async (req, res)=>{

    const useCompiled_srcUrl = false;

    if( ! req.body.utente )
        return res.send({errore: 'Utente mancante'});
    
    if( ! (req.body.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});

    let idCatalgoReq = req.body.id ? req.body.id : 0;

    // carico lista delle immagini dalla sotto dir upload/utente     TODO => caricare nome catalogo smart
    var globby = require('globby');
    const imagePaths = await globby(`./upload/${req.body.utente}/*.jpg`);
    
    const catalogName = (idCatalgoReq==0 ?`Impressioni di settembre`: ( idCatalgoReq==1 ? 'Amore tempestoso': 'Androgenia aerea' ));    // TODO : C O R R E G G E R E


    // invio la lista più le informazioni del catalogo
    res.send({ 
        catalogName: catalogName,
        catalogOwner: req.body.utente,

        // Formato delle immagini
        // { name, src: require('./../assets/loading.gif'), class:'loading', datas:this.requireExifs(), id:2, done: false, title: 'Tenda' }
        immagini: imagePaths.map( (i,index) => [{
            id: index,
            src: useCompiled_srcUrl ? `${server_ip}:${server_port}/image?utente=${req.body.utente}&richiestaImg=${prendiNome(i)}`: prendiNome(i),   // INVIO DIRETTAMENTE L'url magikko
            name: prendiNome(i),
            title: prendiNome(i).split('.')[0],
            exifDatas: ottieniExif(i),
            classStyle: 'immagineCatalogo',
            done: false
        }][0]),
        secretKey: new Date(),
        idCatalogo: idCatalgoReq
        
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
    //const useCompiled_srcUrl = false;
        // Check request datas
    if( ! req.query.utente )
        return res.send({errore: 'Utente mancante'});
    if( ! (req.query.utente === currentCatalogUser) )
        return res.send({errore: 'Utente non valido'});
    if( ! req.query.richiestaImg )
        return res.send({errore: 'Manca richiesta immagine'});
    
    let inviaImg = function(img,log){ res.sendFile(img,{ root: __dirname }); console.log(log+img) }
    let inviaErr = function(log){ res.status(404); console.log(log) }

        // Se esiste invio altrimenti lascio un messaggio di errore
    const relPath = `/upload/${req.query.utente}/${req.query.richiestaImg}`
    fs.access("./server"+relPath,fs.constants.R_OK, function (isExist) {
        //console.log('send: '+(useCompiled_srcUrl ? relPath : req.query.richiestaImg))
        //isExist ? inviaImg( useCompiled_srcUrl ? relPath : req.query.richiestaImg,"Image GET 📤 \t") : inviaErr(`File not found 😔 ${req.query.richiestaImg}`)
        isExist ? inviaImg( relPath,"Image GET 📤 \t") : inviaErr(`File not found 😔 ${req.query.richiestaImg}`)

        //inviaErr(`File not found 😔 ${req.query.richiestaImg}`)

    });
});


/**
 *      DELETE ALL -> TODO implemetation
 */
 app.post('/deleteAll', async (req, res)=>{
     res.send('Catalogo svuotato!')
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