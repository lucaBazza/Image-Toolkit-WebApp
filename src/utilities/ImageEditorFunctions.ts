import LUT from "@/types/LUT"
import { filter } from "jszip"
import { getBase64_fromUrl } from "./convertBase64"


let degrees = 0
export function rotate90(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, img : any ){ /* Image |  ImageBitmap */
    degrees += 90

    context.clearRect(0,0,canvas.width,canvas.height)
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save()
    // move to the center of the canvas
    context.translate(canvas.width/2,canvas.height/2)
    // rotate the canvas to the specified degrees
    context.rotate(degrees*Math.PI/180)
    // draw the image
    // since the context is rotated, the image will be rotated also
    context.drawImage(img,-img.width/2,-img.width/2)
    // we’re done with the rotating so restore the unrotated context
    context.restore()
}


export function downloadTest( canvas : HTMLCanvasElement, nomeFile: string){
    var link = document.createElement('a')
    link.download = nomeFile
    link.href = canvas.toDataURL()
    link.click()
}

/**
 *  se LUT unset, renderizza l'immagine dry
 *  controlla se il lut va invertito
 * @param _LUT indirizzo del LookUpTable
 * @param canvasToAppy target del filtro
 * @param image target del cavans, per ridisegnarla prima di applicare il lut
 *  
 */
export function updateLUT(canvasToAppy : HTMLCanvasElement, image : HTMLImageElement, _LUT: LUT){
    if( ! _LUT || ! _LUT.url ) 
        return canvasToAppy.getContext('2d')!.drawImage(image,0,0);
    
    // console.log(`LUt ${JSON.stringify(_LUT)}`)

    let imgLut = new Image()
    let canvasLut = document.createElement('canvas') as HTMLCanvasElement
    let ctxLut = canvasLut.getContext("2d")!
    imgLut.crossOrigin = "Anonymous"
    imgLut.onload = ()=>{
        canvasLut.width = imgLut.width
        canvasLut.height = imgLut.height
        if(_LUT.invert)
            ctxLut.filter = 'invert(1)'

        ctxLut.drawImage(imgLut, 0, 0)

        resetImageBeforeLutFilter(canvasToAppy, image)
        filterImage_LUT(canvasToAppy, canvasToAppy.getContext('2d')!, canvasLut , ctxLut , 255)   
    }

    toDataURL( _LUT.url ) //getBase64_fromUrl( _LUT )
        .then( srcLutbyte => imgLut.src = String(srcLutbyte) ) 
}


export function filterImage_LUT(cnvs, ctx, canvasLutToApply, ctxLutToApply, opacity){
    // console.log('filterImage_LUT()')
    if(0 > opacity || opacity > 255) throw Error('Invald opacity value! \t-> range : 0-255)')

    var lutWidth = canvasLutToApply.width
    var imgData = ctx.getImageData(0,0,cnvs.width,cnvs.height)
    var filterData = ctxLutToApply.getImageData(0,0,canvasLutToApply.width,canvasLutToApply.height)
      
    for (var i=0;i<imgData.data.length;i+=4){           // invert colors
      var r=Math.floor(imgData.data[i]/4);
      var g=Math.floor(imgData.data[i+1]/4);
      var b=Math.floor(imgData.data[i+2]/4);
   
      var lutX = (b % 8) * 64 + r;
      var lutY = Math.floor(b / 8) * 64 + g;
      var lutIndex = (lutY * lutWidth + lutX)*4;
  
      var Rr = filterData.data[lutIndex];
      var Gg = filterData.data[lutIndex+1];    
      var Bb = filterData.data[lutIndex+2];
        
      imgData.data[i] = filterData.data[lutIndex];      // Rr
      imgData.data[i+1] = filterData.data[lutIndex+1];  // Gg
      imgData.data[i+2] = filterData.data[lutIndex+2];  // Bb
      imgData.data[i+3] = opacity;                      // Alpha
    }
    ctx.putImageData(imgData,0,0);
}


export function resetImageBeforeLutFilter(canvas :HTMLCanvasElement, image){
    canvas.getContext('2d')!.clearRect(0,0,canvas.width,canvas.height)
    canvas.getContext('2d')!.drawImage(image, 0,0)
}
  

/**
 *  Crea un backgorund canvas, dimensione reale immagine (naturalHeight, naturalWidth), applica gli ajustments e chiama il download
 *  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
 */
export function exportImage(img: ImageBitmap, adjustments: any){
    console.log('exportImage TODO')

    // https://www.npmjs.com/package/@types/offscreencanvas         package.json >      "@types/offscreencanvas": "^2019.7.0",
    //const offscreen = new OffscreenCanvas(256,256)
    //const cvx = offscreen.getContext('2d')! as OffscreenCanvasRenderingContext2D
    
    //let canvas = document.createElement('canvas') as HTMLCanvasElement;
    //let offscreenCanvas = canvas.transferControlToOffscreen();
}


/* 
// ERRORE, non request animation frame non viene chiamato subito (occorre repaint successivo)
export function updateImage(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, img: any, styles: string){  // img: Image
    context.clearRect(0, 0, canvas.width, canvas.height)
    window.requestAnimationFrame(()=>{          //  the browser calls a specified function to update an animation before the next repaint
        context.filter = styles
        context.drawImage(img,0,0)
    })
}
*/



/*              BASE64 da url    -> use utils !!            */
const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
}))
