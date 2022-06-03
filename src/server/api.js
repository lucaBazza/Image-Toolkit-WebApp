//module.export = {
//    science: '🍥' 
//}
const { readFile } = require('fs').promises;

exports.avviaApi = function(app) {
    
    /// adesso si fa con express gli url endpoints
    app.get('/', async (request, response)=>{
        // request = dati che arrivano dall'utente
        // response = quello che rispondo
        //console.log("test");
        response.send( await readFile('./src/server/foo.html','utf8') );
    });


    // https://javascript.plainenglish.io/upload-images-in-your-node-app-e05d0423fd4a
    const multer = require('multer');
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
            const pathName = request.file.path;
            response.status(200).send(pathName); // .send(request.file , pathName);
            console.log(`upload immagine ${pathName} riuscito`);
        }
        else response.status(406).send("Not acceptable post");
    });

    app.get('/api/upload', async (request, response)=>{ console.log("No file"); response.send( "non accetto get solo POST immagini" ); });
}