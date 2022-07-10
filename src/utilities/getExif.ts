/**
 *      npm install exif-js
 *          
 *  bugs: 
 *      - non legge tutti i campi -es. exif.nome proprietario
 *      - ?e non li sovrascrive?
*/

// altenative https://github.com/MikeKovarik/exifr

import EXIF from 'exif-js'
import Exif from '@/types/Exif'

export default async function getExif(imgFile) : Promise<Exif>{
    let out

    EXIF.getData(imgFile, function(){
            var allMetaData = EXIF.getAllTags(imgFile)
            // console.log(imgFile, JSON.stringify(allMetaData, null, "\t"))
            delete allMetaData['MakerNote']
            delete allMetaData['UserComment']
            delete allMetaData['thumbnail']
            out = allMetaData as Exif
        }
    )
    
    // TRICK: wait until callback function has filled out variable
    while( ! out )
        await new Promise( res=> setTimeout(res,0) )    

    return out
}

















/* 
export default async function getExif(imgFile){
    console.log('getExif() ',imgFile.name)
    
    let out

    // Base implementation
    EXIF.getData(imgFile, ()=>{
            //console.log('\n\ncallback zone!\n\n')
            var allMetaData = EXIF.getAllTags(imgFile)
            delete allMetaData['MakerNote']
            delete allMetaData['UserComment']
            delete allMetaData['thumbnail']
            out = JSON.stringify(allMetaData, null, "\t")
            //console.log('getExif callback() ',out)
        }
    )
    
    console.log('Wait callback finish to process...')
    while( ! out )
        await new Promise(res=> setTimeout(res,0))
    console.log('Callback has setted exif datas! 🤗 \n ', EXIF.getAllTags(imgFile) )


    return out
} 
*/




/*     
    console.log('imgFile.meta: ', a)
    var allMetaData = EXIF.getAllTags(imgFile)
    delete allMetaData['MakerNote']
    delete allMetaData['UserComment']
    delete allMetaData['thumbnail'] 
    return  allMetaData 
*/


/* function convertExitTags(imgFile){
    console.log('\n\ncallback zone!\n\n')
    var allMetaData = EXIF.getAllTags(imgFile)
    delete allMetaData['MakerNote']
    delete allMetaData['UserComment']
    delete allMetaData['thumbnail']
    let out = JSON.stringify(allMetaData, null, "\t")
    console.log('getExif callback() ',out)
}
 */



/* 
    let data = files[0] // getImageStream(files[0])
    console.log('exif parser factiry() \t data: ',data,files)
    const parser = ExifParserFactory.create(data)
    parser.enableReturnTags(false)
    parser.enablePointers(true)
    const resData = parser.parse()
    
    console.log('parser: ',parser)
    console.log('resData: ',resData)
    console.log('resData-tags: ',resData.tags)
 */




    /*     
    await EXIF.getData(imgFile, ()=>{
            
        console.log('\n\n callback zone! \n\n');
           
        (async() => {
            console.log('stat async...')
            while( ! EXIF.getAllTags(imgFile) )
                await new Promise(res=> setTimeout(res,0))
            console.log('var is defined! ☺ \n ',
                            JSON.stringify( EXIF.getAllTags(imgFile), null, "\t").substring(0,100))
        })()

        var allMetaData = EXIF.getAllTags(imgFile)
        delete allMetaData['MakerNote']
        delete allMetaData['UserComment']
        delete allMetaData['thumbnail']
        out = JSON.stringify(allMetaData, null, "\t")
        console.log('getExif callback() ',out.substring(0,100))

    })
    console.log('function finished: ', out)
 */


/* 
    console.log('stat async...')
    while( ! EXIF.getAllTags(imgFile) )
        await new Promise(res=> setTimeout(res,10))
    console.log('var is defined! ☺ \n ', EXIF.getAllTags(imgFile) )
                    //JSON.stringify( EXIF.getAllTags(imgFile), null, "\t").substring(0,100))
    out = JSON.stringify( EXIF.getAllTags(imgFile), null, "\t")
 */