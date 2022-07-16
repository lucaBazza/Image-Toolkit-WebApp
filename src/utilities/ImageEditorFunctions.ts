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


export function filterImage_LUT(cnvs, ctx, canvasLutToApply, ctxLutToApply, opacity){
    if(0 > opacity || opacity > 255) throw Error('Invald opacity value! \t-> range : 0-255)')

    var lutWidth = canvasLutToApply.width
    var imgData = ctx.getImageData(0,0,cnvs.width,cnvs.height)
    var filterData = ctxLutToApply.getImageData(0,0,canvasLutToApply.width,canvasLutToApply.height)
      
    for (var i=0;i<imgData.data.length;i+=4){   // invert colors
      var r=Math.floor(imgData.data[i]/4);
      var g=Math.floor(imgData.data[i+1]/4);
      var b=Math.floor(imgData.data[i+2]/4);
   
      var lutX = (b % 8) * 64 + r;
      var lutY = Math.floor(b / 8) * 64 + g;
      var lutIndex = (lutY * lutWidth + lutX)*4;
  
      var Rr =  filterData.data[lutIndex];
      var Gg =  filterData.data[lutIndex+1];    
      var Bb =  filterData.data[lutIndex+2];
        
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
 */
export function exportImage(img: ImageBitmap, adjustments: any){
    console.log('exportImage TODO')
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



export async function generateThumb(canvas : HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    console.log('generateThumb')
    const originalWidth = canvas.width
    //canvas.width = originalWidth / 10

    //const thumbIMG = downScaleImage(new HTMLImageElement(), .1, ctx )
    
    return canvas.toDataURL()
}



/**
 *  https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
 * @param img 
 * @param scale 
 * @param imgCtx 
 * @returns 
 */
// scales the image by (float) scale < 1
// returns a canvas containing the scaled image.
function downScaleImage(img :HTMLImageElement, scale, imgCtx : CanvasRenderingContext2D ) {
    var imgCV = document.createElement('canvas') as HTMLCanvasElement
    imgCV.width = img.width
    imgCV.height = img.height
    imgCtx.drawImage(img, 0, 0)
    return downScaleCanvas(imgCV, scale/* , imgCtx */)
}

// scales the canvas by (float) scale < 1
// returns a new canvas containing the scaled image.
function downScaleCanvas(cv, scale/* , resCtx */) {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    var sqScale = scale * scale; // square scale = area of source pixel within target
    var sw = cv.width; // source image width
    var sh = cv.height; // source image height
    var tw = Math.floor(sw * scale); // target image width
    var th = Math.floor(sh * scale); // target image height
    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').
    getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
    var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b
    /* untested !
    var sA = 0;  //source alpha  */    

    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; // y src position within target
        tY = 0 | ty;     // rounded : target pixel's y
        yIndex = 3 * tY * tw;  // line index within target array
        crossY = (tY != (0 | ty + scale)); 
        if (crossY) { // if pixel is crossing botton target pixel
            wy = (tY + 1 - ty); // weight of point within target pixel
            nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale; // x src position within target
            tX = 0 |  tx;    // rounded : target pixel's x
            tIndex = yIndex + tX * 3; // target pixel index within target array
            crossX = (tX != (0 | tx + scale));
            if (crossX) { // if pixel is crossing target pixel's right
                wx = (tX + 1 - tx); // weight of point within target pixel
                nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
            }
            sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

            /* !! untested : handling alpha !!
               sA = sBuffer[sIndex + 3];
               if (!sA) continue;
               if (sA != 0xFF) {
                   sR = (sR * sA) >> 8;  // or use /256 instead ??
                   sG = (sG * sA) >> 8;
                   sB = (sB * sA) >> 8;
               }
            */
            if (!crossX && !crossY) { // pixel does not cross
                // just add components weighted by squared scale.
                tBuffer[tIndex    ] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) { // cross on X only
                w = wx * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tX+1) px                
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) { // cross on Y only
                w = wy * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tY+1) px                
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else { // crosses both x and y : four target points involved
                // add weighted component for current px
                w = wx * wy;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // for tX + 1; tY px
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                // for tX ; tY + 1 px
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                // for tX + 1 ; tY +1 px
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        } // end for sx 
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d')!;
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
}