<template>
  <div class="mainViewer">
    <!--   :class="{ sale: theme === 'sale' }  -->
    <img
        :src="imageRf.realURL"
        :class="imageRf.classStyle"
        :id=" 'img_' + imageRf.id"
        :alt="imageRf.alt"
        @error="imageLoadError"
        @click="toggleEditorFn"
    />
    <span>
      {{ imageRf.nomeFile }}<button @click="reqEdit">🖊️</button><br/>
      <ul>
        <li v-for="ex in imageRf.exifDatas" :key="ex.label"> 
          <b>{{ ex.label }}</b> {{ ex.val }}
        </li>
      </ul>
      <button v-if="showFixButton" @click="fixLinkImage"> 🔧 </button>
    </span>
  </div>
  <ImageEditorModalVue 
      v-if="showImgEditModal" 
      :imageProp="imageRf"
      @toggle-editor-fn="toggleEditorFn" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Immagine from '@/types/Immagine'
import ImageEditorModalVue from './ImageEditorModal.vue'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists

const props = defineProps({   imageRf: { type: Immagine, required: true }   })

let src_real = ref(props.imageRf.src)
let showImgEditModal = ref(false)
let showFixButton = ref(false)

function imageLoadError(e){
  console.log('ImageExifViewer.imageLoadError() ❌  : ', e.target.id)
  src_real.value = require("@/assets/noImg.jpg")
  props.imageRf.classStyle = 'loadingError'
  showFixButton.value = true
}

function isImgLoaded(){ return src_real.value !== require("@/assets/loading.gif") && src_real.value !== require("@/assets/noImg.jpg") }

function swapRealImage(res){
  //console.log(`\t\t\✅ ${props.imageRf.nomeFile} \t`, res.ok ? ":-)" : ":.(" )
  src_real.value = props.imageRf.realURL
  props.imageRf.classStyle = 'imageLoaded'
      // classe è triggerata subito da isImgLoaded nel tempalate    => TODO: inserire animazione CSS che copre il passaggio
  //setTimeout( () => { props.imageRf.classStyle = ''}, 50 * 1000) 
}

function reqEdit() {
    console.log("ImageExifViewer.reqEdit() - ", isImgLoaded() ? 'pass' : 'No' );
}

function toggleEditorFn(){
    console.log("ImageExifViewer.toggleEditorFn() ", props.imageRf.nomeFile)
    isImgLoaded() ? showImgEditModal.value = ! showImgEditModal.value : console.log('No image loaded, cant edit')
}

/**
 *  Se l'immagine non è disponibile, proponi ricaricamento
 *    - TODO: implementare anche caricamento immagine direttamente da qui    
 */
function fixLinkImage(){
  console.log('fixLinkImage')
}

onMounted( async () => {
  //console.log(`ImageExifViewer.mounted() - ${props.imageRf.nomeFile}`)
  
  props.imageRf.classStyle = 'loadingBG'
  
  // ATTENZIONE FETCH non è detto che funzioni correttamente, la risposta dal server è false ???
  await fetch(props.imageRf.realURL, { mode: 'no-cors'})
      .then(res => swapRealImage(res) )
      .catch(ex => console.log(ex.message))
  
})
</script>

<style>
.mainViewer{
  --lighWarmGradinet: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  /*--darkColdGradinet: linear-gradient(-45deg, #4E156C, #831838, #975038, #213892);*/
}
.mainViewer {
  margin: 5%;
  width: 90%;
  min-width: 550px;
  max-width: 1200px;
  height: 30vh;
  background: var(--lighWarmGradinet); /*linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);*/
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  -moz-animation: gradient 10s ease infinite;
  border-radius: 0.8rem;
  display: flex;
}
.darkMode .mainViewer{ box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .7) }
.mainViewer > img {
  flex: 50%;
  float: left;
  margin: 1rem;
  border-radius: 0.5rem;
  max-width: max( 50%, 300px );
}
.mainViewer > img:hover {
  cursor: move;
  margin: 0.4rem;
  transition: 0.2s;
}
/*.mainViewer > img[data-src]{ opacity: 1 }*/
.mainViewer > span {
  flex: 50%;
  margin: 1rem;
  overflow: hidden;
  overflow-y: scroll;
}
.mainViewer > span::first-line {
  line-height: 2rem;
  font-weight: bolder;
  margin: 2rem 0;
}
.mainViewer > span > button {
  background: transparent;
  border: none;
  cursor: crosshair;
}
.mainViewer > span > ul { padding-left: 0; }
.mainViewer > span > ul > li {
  list-style-type: none;
  text-align: left;
  padding: .2rem 0;
}
/*
*     http://css3.bradshawenterprises.com/cfimg/
*/
.loadingBG{ 
  /*background-blend-mode: multiply;
  background-image: url('./../assets/loading.gif');
  background: url('./../assets/loading.gif');
  background-blend-mode: multiply;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;*/
  content: url('./../assets/loading.gif');
  object-fit: contain;
  mix-blend-mode: multiply;
  
  mask-image: var(--mascheraCircolare);
  -webkit-mask-image: var(--mascheraCircolare);
}
.imageLoaded{ object-fit: cover }

.loading, .loadingError { mix-blend-mode: multiply }
.loading{
  -webkit-mask-image: var(--mascheraCircolare);
  mask-image: var(--mascheraCircolare);
}
</style>
