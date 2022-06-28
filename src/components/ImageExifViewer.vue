<template>
  <div class="mainViewer">
    <img
        v-if="showImageRef"
        :src="src_real"
        :class="imageRf.classStyle"
        :id=" 'img_' + imageRf.id"
        :alt="imageRf.alt"
        @error="imageLoadError"
        @click="toggleEditorFn"
    />
    <!-- <img v-if=" ! isImgLoaded()" class="imgOverlaySpinner" src="@/assets/loading-io-spinner.gif"/> -->
    <span>
      {{ hideExtension(imageRf.nomeFile) }}
      <div class="cntimgSettingsBtns">
        <button id="imgSettings"> &nbsp; </button>
        <button class="imgSettingsBtns" attr="rename"> 📋 </button>
        <button class="imgSettingsBtns" attr="delete" @click="deleteImg"> 🗑️ </button>
        <button class="imgSettingsBtns" attr="edit" @click="reqEdit">🖊️</button>
        <button class="imgSettingsBtns" attr="reset adj" @click="resetAdj"> 🔄 </button>
        <button class="imgSettingsBtns" attr="fix" v-if="showFixButton" @click="fixLinkImage"> 🔧 </button>
      </div>
      <ul>
        <li v-for="ex in imageRf.exifDatas" :key="ex.label"> 
          <b>{{ ex.label }}</b> {{ ex.val }}
        </li>
      </ul>
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
import { deleteImage } from '@/types/Firebase_immagini'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists

const props = defineProps({   imageRf: { type: Immagine, required: true }   })
const emits = defineEmits(['deleteImageCallbk'])

let src_real = ref(props.imageRf.src)
let showImgEditModal = ref(false)
let showFixButton = ref(false)
let showImageRef = ref(true)

function imageLoadError(e){
  console.log('ImageExifViewer.imageLoadError() ❌  : ', e.target.id)
  src_real.value = require("@/assets/noImg.jpg")
  props.imageRf.src = require("@/assets/noImg.jpg")
  props.imageRf.classStyle = 'loadingError'
  showFixButton.value = true
  showImageRef.value = false
  setTimeout(() => { showImageRef.value = true }, 500);
}

function isImgLoaded(){ return src_real.value !== require("@/assets/loading.gif") && src_real.value !== require("@/assets/noImg.jpg") }

function swapRealImage(res){
  //console.log(`\t\t\✅ ${props.imageRf.nomeFile} \t`, res.ok ? ":-)" : ":.(" )
  src_real.value = props.imageRf.realURL
  
  props.imageRf.classStyle = 'imageLoaded'  // TODO: controllare

  //if( ! props.imageRf.classStyle )
  //  props.imageRf.classStyle = 'imageLoaded'

  //props.imageRf.classStyle = 'imgUploadRequest'

  // classe è triggerata subito da isImgLoaded nel tempalate    => TODO: inserire animazione CSS che copre il passaggio
}

function reqEdit() {
    console.log("ImageExifViewer.reqEdit() - ", isImgLoaded() ? 'pass' : 'No' );
}

function resetAdj(){ console.log("ImageExifViewer.resetAdj() ") }

async function deleteImg(){
  //deleteImage(props.imageRf.getNomeFile(), props.imageRf.catalogoID)
  //  .then( res => console.log('ImageExifViewer().deleteimg() res: ', res) )
  //  .then( () => emits('deleteImageCallbk', props.imageRf.getNomeFile()) )
  //  .catch( ex => console.log('ImagViewer err: ',ex) )
  emits('deleteImageCallbk', props.imageRf.imgID)
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

function hideExtension(str: string){
  return str.replace(/\.[^/.]+$/, "")
}

function getInfoSize() : {label:string, val:string}[]{
  const obi /* :{label:string, val:string} */ = (l:string, v: undefined | any ) => { 
      //return v ? {label: l, value: Number(v) ? `${Math.floor(Number(v)/1000)}KB` : v } : { label:'',value:''}
      return {label: l, val: v}
    }
  //return [{label: 'Width', val: props.imageRf.width},{label: 'Height', val: props.imageRf.height},{label:'Size', val: `${Math.floor(props.imageRf.size!/1000)}KB` }]
  //return [obi('Width',props.imageRf.width),obi('Height',props.imageRf.height),obi('Size',props.imageRf.size)]
  //const w = obi('Width', props.imageRf.width)
  //return [w,obi('Height',props.imageRf.height),obi('Size',props.imageRf.size)]
  let out : {label:string, val:string}[]= []
  if(props.imageRf.width) out.push( obi('Width', props.imageRf.width) )
  if(props.imageRf.height) out.push( obi('Height', props.imageRf.height) )
  if(props.imageRf.size) out.push( obi('Size', `${Math.floor(Number(props.imageRf.size)/1000)} KB`) )
  return out
}

onMounted( async () => {
  //console.log(`ImageExifViewer.mounted() - ${props.imageRf.nomeFile}`)
  
  // ATTENZIONE FETCH non è detto che funzioni correttamente, la risposta dal server è false ???
  //await fetch(props.imageRf.realURL, { mode: 'no-cors'})
  //    .then(res => swapRealImage(res) )
  //    .catch(ex => console.log(ex.message))

  props.imageRf.classStyle = 'loadingBG'

  props.imageRf.exifDatas = [...getInfoSize(), ...Immagine.requireFakeExifs()]

  swapRealImage(props.imageRf.realURL)
  
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
.mainViewer > img:first-child {
  flex: 50%;
  float: left;
  margin: 1rem;
  border-radius: 0.5rem;
  max-width: max( 50%, 300px );
}
.mainViewer > img:first-child:hover {
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

.imgUploadRequest{ opacity: .4; z-index: 0; }
/*.imgUploadRequest::after{ 
  content: ''; 
  background-image: url('./../assets/loading-io-spinner.gif');
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  transform: skew(15deg);
  width: 75%; 
  height: 100%;
}*/

/* .overlaySpinner{ width: 4rem; height: 4rem; position: absolute; margin: 0 auto;}
.overlaySpinner{ width: 50%; position: initial; margin: 0 auto; transform: translateY(-350px) } */
.imgOverlaySpinner{ width: 50%; position: initial }

.cntimgSettingsBtns{ width: 2rem; height: 12rem; float: right; align-items: center; margin-right: -.4rem; /* background-color: rgba(0, 0, 0, .2); */ }
.cntimgSettingsBtns > button:first-child{
  background-image: url('@/assets/3-vertical-dots.svg');
  background-repeat: no-repeat;
  margin-left: 0.4rem;
}
.cntimgSettingsBtns > button:first-child:hover{ cursor: grab }
.cntimgSettingsBtns > button:not(:first-child){ opacity: 0; }

.cntimgSettingsBtns > button { background: transparent; border: none; margin-top: .7rem; }
.cntimgSettingsBtns > button:not(:first-child):hover{ text-shadow: 10px 10px 20px #555; cursor: move; }

.cntimgSettingsBtns:hover .imgSettingsBtns:nth-child(2){ /* animation: fadeInBtns .3s; */ opacity: 1; transition: .3s; }
.cntimgSettingsBtns:hover .imgSettingsBtns:nth-child(3){ /* animation: fadeInBtns .3s; */ opacity: 1; transition: 1.0s; }
.cntimgSettingsBtns:hover .imgSettingsBtns:nth-child(4){ /* animation: fadeInBtns .3s; */ opacity: 1; transition: 1.5s; }
.cntimgSettingsBtns:hover .imgSettingsBtns:nth-child(5){ /* animation: fadeInBtns .3s; */ opacity: 1; transition: 3s; }


/* @keyframes fadeInBtns {
    0% { opacity: 0 }
    100% { opacity: 1 }
} */

</style>
