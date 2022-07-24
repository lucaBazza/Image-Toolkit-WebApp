/**
 * prova a ottenere il require asset della risorsa che viene richiesta
 * @param lutName 
 * @returns url dell'asset scelto
 */
export default function getLutURL(lutName : string){
    let urlLut
    try{ urlLut = require(`@/assets/LUTs/${lutName}`) } catch(err){}
    if(!urlLut){ 
        console.log(`\t Cant find this LUT in assets 😢 \t ${lutName}`)
        return 
    }

    return urlLut
}