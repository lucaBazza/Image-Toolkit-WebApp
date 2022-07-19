/**
 * 
 */
export default function getBase64(file : Blob) : Promise<string>{
    const reader = new FileReader()
    return new Promise(resolve => {
        reader.onload = ev => { resolve(ev.target!.result as string) }
        reader.onerror = Promise.reject
        reader.readAsDataURL(file)
    })
}


export async function getBase64_fromUrl(url : string){
    return getBase64( await fetch(url).then( res => res.blob() ) )
}
  

/**
 *  TODO INCOMPLETO - UNTESTED
 * @param image 
 * @returns 
 */
export async function getBase64_fromImage(image : HTMLImageElement){
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')!

    canvas.width = image.width
    canvas.height = image.height

    context.drawImage(image, 0,0)
    
    
    return canvas.toDataURL()
}

/* 
const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
}))
 */