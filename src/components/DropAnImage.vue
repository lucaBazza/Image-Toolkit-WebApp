<template>
    <div class="dropImage">
        <div class="dropzone" 
            @dragover.prevent="dragOver" 
            @dragleave.prevent="dragLeave"
            @drop.prevent="drop($event)">
        </div>
        <br>
        <div v-for="img in imageSources">
            <img :src="img" />
        </div>
        <h1 v-if="imageSources.length == 0 && !isDragging">Drop some images</h1>
    </div>
</template>

<script setup lang="ts">
/**
 *  https://github.com/fabiofranchino/vue-drop-image-and-preview
 */
import {  ref } from 'vue'

let isDragging = ref(false)
let imageSources = ref(new Array<string>())

async function drop(e){
    console.log('DROP')
    let files = [...e.dataTransfer.files]
    let images = files.filter(file => file.type.indexOf('image/') >= 0)
    let promises = images.map(file => getBase64(file))

    let sourcesBase64 = await Promise.all(promises)
    imageSources.value = sourcesBase64.map(x=>x)
    isDragging.value = false
}
function getBase64(file) : Promise<string>{
    const reader = new FileReader()
    return new Promise(resolve => {
        reader.onload = ev => { resolve(ev.target!.result as string) }
        reader.readAsDataURL(file)
    })
}
function dragOver(){
    isDragging.value = true
}
function dragLeave(){
    isDragging.value = false
}
</script>

<style>
.dropImage{    
    min-width: 5rem;
    min-height:10rem;
    display: block;
}
.dropzone{
    width: min(50%, 300px);
    backdrop-filter: blur(5px);
    margin: 2rem auto;
    border-radius: 1rem;
/*     box-shadow: 10px 20px 30px rgba(0,0,0,.5); */
    content: url('./../assets/drop-file-here_lottiefiles22299.gif');
    mix-blend-mode: multiply;
    object-fit: contain;
    mask-image: var(--mascheraCircolare);
    -webkit-mask-image: var(--mascheraCircolare);
}
.dropzone:hover{ border-left: .8rem solid black; border-right: .8rem solid black; cursor:crosshair }
.dropImage > div { display: inline-block; object-position: center; padding: .5rem }
.dropImage > div > img{ width: 100px; height:100px; object-fit: cover }
</style>