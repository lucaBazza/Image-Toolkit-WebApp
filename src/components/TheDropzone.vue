<template>
    <input type="file" @change="drop" ref="imgBackgroundUpload_ref" hidden accept="image/*" multiple /> 
    <div class="dropzone"
        @dragover.prevent="dragOver" 
        @dragleave.prevent="dragLeave"
        @drop.prevent="drop($event)"
        @click="clickUpload">
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ImageSize } from '@/types/Immagine'
import getBase64 from '@/utilities/convertBase64'
import getExif from '@/utilities/getExif'
import Exif from '@/types/Exif'
import Immagine from '@/types/Immagine'
import Utente from '@/types/Utente'
import { uploadImage_2 } from '@/types/Firebase_immagini'

/**
 *      ROADMAP
 *  - il componente ha l'area di drop immagini
 *  - quando vengono droppate le n-immagini, per ogniuna:
 *      + si genera la preview (base64)
 *      + si emette un'evento 'addImageToCatalog' inviando il file e l'anteprima base64
 *  - l'evento nel parent crea il componente imageViewer con la preview con uno stile di loading dedicato
 *  - parallelamente, viene 
 *      + caricata l'immagine su storage
 *      + viene aggiunto il record nel database
 *      + viene aggiornato utente.catalogoXYZ.listaImgs
 *  - TODO indicare dimensione massima file da caricare (100MB per full, 15mb sotto utenti pro)
*/

const emit = defineEmits<{(e: 'requestImageUpload', file: HTMLInputElement, imgBase64: string, imageSizes: ImageSize, exifs: Exif): void}>()
let isDragging = ref(false)
let imgBackgroundUpload_ref = ref(null)

let utente = reactive(Utente.getInstance())

/**
 *  funzione principale: 
 *      - ottiene preview e dimensione, 
 *      - ottiene exif 
 *      - invia il pacco al componente principale > !! invia alla funzione che aggiorna GUI e Firebase
 */
async function drop(e){
    let files = e.dataTransfer ? [...e.dataTransfer.files] : [...e.srcElement.files]
    let images : File[] = files.filter(file => file.type.indexOf('image/') >= 0)
    let sourcesBase64 = await Promise.all( images.map(i => getBase64(i)) )
    let imageSizes = await Promise.all( sourcesBase64.map(i => imageSize(i)) )



    // console.log('start pre exif()..')
    let imagesExifs = await Promise.all( images.map( i => getExif(i) ) )    // await getExif(images[0])
    // let imageSizes = imagesExifs.map( ex => <ImageSize>{width: ex.PixelXDimension, height: ex.PixelYDimension})  // !!! la dimenisone immagine di PixelXDimension può essere sbagliata
    // console.log('\n\n\n FINAL meta res: ', imagesExifs, '\n\n\n\n')



    isDragging.value = false
    //sourcesBase64.forEach( (img,index) => emit('requestImageUpload', files[index], img, imageSizes[index], imagesExifs[index]) )

    images.forEach( (imgFile, idx) => handleImageUpload(imgFile,sourcesBase64[idx], imageSizes[idx], imagesExifs[idx]) )
}

function dragOver(){
    isDragging.value = true
}
function dragLeave(){
    isDragging.value = false
}
function clickUpload(){
    imgBackgroundUpload_ref.value && (imgBackgroundUpload_ref.value as HTMLInputElement).click()    
}

function imageSize(imgBase64){
    const img = document.createElement("img") as HTMLImageElement
    img.src = imgBase64                     // Setting the source makes it start downloading and eventually call `onload`
    return new Promise<ImageSize>((resolve, reject) => {
      img.onload = () => {
        const width  = img.naturalWidth     // Natural size is the actual image size regardless of rendering. 
        const height = img.naturalHeight    // The 'normal' `width`/`height` are for the **rendered** size.
        resolve( {width,height} as ImageSize)
      }
      img.onerror = reject                  // Reject promise on error
    })
}

/**
 *  - crea l'oggetto Immagine con i dati
 *  - aggiorna 'temporaneamente' la GUI inserendo in cima tale immagine
 *  - procede con l'aggiornamento su Firestore: se accade, aggiorna l'idImg, altrimenti cancella immagine GUI
 */
async function handleImageUpload(file: File, previewBase64: string, imageSizes: ImageSize, exif: Exif){
    let img = new Immagine(previewBase64)
                    .setNomeFile(file.name)
                    .setClassStyle('imgUploadRequest')
                    .setCatalogID( Utente.getInstance().getCid() )
                    .setImageDimension(imageSizes)
                    .setSize(file.size)
                    .setTempImgId(file.name)
                    .setExifDatas(exif)
    utente.getCurrentCatalog_cid().listaImmagini.unshift(img)
    
    const imgId = await uploadImage_2(file, img.clearSrc())
    
    imgId ? utente.getCurrentCatalog_cid().getImmagineByTempID(img.imgID).imgID = imgId : rollbackGuiUpload(img)       
}

function rollbackGuiUpload(img: Immagine){
    setTimeout(()=>{  
        console.log('handleImageUpload() failed, rollback gui \t imgId:', img.imgID)
        utente.getCurrentCatalog_cid().listaImmagini = utente.getCurrentCatalog_cid().getListaImmagini_without(img.imgID)
    },1000) 
}

</script>

<style>
.dropzone{
    width: min(50%, 300px);
    backdrop-filter: blur(5px);
    margin: 2rem auto;
    border-radius: 1rem;
    content: url('./../assets/drop-file-here_lottiefiles22299-rev.gif');
    mix-blend-mode: multiply;
    object-fit: contain;
    mask-image: var(--mascheraCircolare);
    -webkit-mask-image: var(--mascheraCircolare);
}
.dropzone:hover{ 
    border-left: .2rem solid black; 
    border-right: .2rem solid black; 
    cursor:crosshair; 
    transition: .2s ease-in; 
}
</style>
