<template>
  <div class="dropzone" 
    @dragover.prevent="dragOver" 
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)">
        <div v-for="img in imageSources">
            <img :src="img" />
        </div>
        <h1 v-if="imageSources.length == 0 && !isDragging">Drop some images</h1>
  </div>
</template>

<script setup lang="ts">
import {  ref } from 'vue'
/**
 *  https://github.com/fabiofranchino/vue-drop-image-and-preview
 */
let isDragging = ref(false)
let imageSources = ref(new Array<string>())

async function drop(e){
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
.dropzone{
    min-width: 5rem;
    width: min(50%, 300px);
    min-height: 10rem;
    backdrop-filter: blur(5px);
    margin: 2rem auto;
    border-radius: 1rem;
    box-shadow: 10px 20px 30px rgba(0,0,0,.5);
    content: url('./../assets/drop-file-here_lottiefiles22299.gif');
    mix-blend-mode: multiply;
    object-fit: contain;
    mask-image: var(--mascheraCircolare);
    -webkit-mask-image: var(--mascheraCircolare);
}
.dropzone:hover{
    border: .5rem solid black;
}
.dropzone > div {
    display: inline-block;
    object-position: center;
    padding: 1rem
}
.dropzone > div > img{
    width: 200px;
}
</style>