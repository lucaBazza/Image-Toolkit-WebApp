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
import { ref } from 'vue'
import { ImageSize } from '@/types/Immagine'

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

const emit = defineEmits<{(e: 'requestImageUpload', file: HTMLInputElement, imgBase64: string, imageSizes: ImageSize/* object */): void}>()
let isDragging = ref(false)
let imgBackgroundUpload_ref = ref(null)

async function drop(e){    
    let files = e.dataTransfer ? [...e.dataTransfer.files] : [...e.srcElement.files]
    let images = files.filter(file => file.type.indexOf('image/') >= 0)
    let promises = images.map(file => getBase64(file))

    let sourcesBase64 = await Promise.all(promises)
    let imageSizes = await Promise.all(sourcesBase64.map(i => { return imageSize(i) }))

    isDragging.value = false

    sourcesBase64.forEach( (img,index) => emit('requestImageUpload', files[index], img, imageSizes[index]) )
}
function getBase64(file) : Promise<string>{
    const reader = new FileReader()
    return new Promise(resolve => {
        reader.onload = ev => { resolve(ev.target!.result as string) }
        reader.readAsDataURL(file)
    })
}
function imageSize(imgBase64){
    const img = document.createElement("img");
    const promise = new Promise<ImageSize>((resolve, reject) => {
      img.onload = () => {
        const width  = img.naturalWidth     // Natural size is the actual image size regardless of rendering. 
        const height = img.naturalHeight    // The 'normal' `width`/`height` are for the **rendered** size.
        resolve( {width,height} as ImageSize)
      }
      img.onerror = reject                  // Reject promise on error
    })

    // Setting the source makes it start downloading and eventually call `onload`
    img.src = imgBase64
    return promise
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
.dropzone:hover{ border-left: .2rem solid black; border-right: .2rem solid black; cursor:crosshair; transition: .2s ease-in; }
</style>
