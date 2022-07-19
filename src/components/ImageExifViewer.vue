<template>
  <div class="mainViewer">
    <img
        v-if="showImageRef"
        :src="src_real"
        :class="imageRf.classStyle"
        :id="imageRf.imgID"
        :alt="imageRf.alt"
        @error="imageLoadError"
        @click="emit('toggleEditorFullScreen', props.imageRf.imgID)"
    />
    <span>
      {{ hideExtension(imageRf.nomeFile) }}
      <div class="cntimgSettingsBtns">
        <button id="imgSettings"> &nbsp; </button>
        <button class="imgSettingsBtns" attr="rename"> 📋 </button>
        <button class="imgSettingsBtns" attr="delete" @click="deleteImg"> 🗑️ </button>
        <button class="imgSettingsBtns" attr="edit" @click="reqEdit">🖊️</button>
        <button class="imgSettingsBtns" attr="reset adj" @click="resetAdj"> 🔄 </button>
        <button class="imgSettingsBtns" attr="download image" @click="downloadImg"> ⬇️ </button>
        <button class="imgSettingsBtns" attr="fix" v-if="showFixButton" @click="fixLinkImage"> 🔧 </button>
      </div>
      <ul>        
        <li>
            <b>&#10064; Dimension</b> {{imageRf.width}} &#8226; {{imageRf.height}} pixel 
        </li>
        <li>
            <b>&#9777; Size</b> {{imageRf.getSizeString()}}
        </li>
        <li @click="runClassifier">
          <b>&#9826; Tags </b>
            <span v-if="imageRf.hasClassificatore()">{{imageRf.getClassificatoreString()}}</span>
            <component v-else :is="classifierComp" :immagine="imageRf"/>
        </li>
        <li>
          <b>Aspect ratio </b> {{aspectRatio(imageRf.width!/imageRf.height!,50)}}
        </li>
        <li v-for="ex in getExifDatas" :key="ex.label"> 
          <b>{{ ex.label }}</b> {{ ex.val }}
        </li>
      </ul>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, defineAsyncComponent, computed } from 'vue'
import Immagine from '@/types/Immagine'
import { deleteImageFacade, updateImage } from '@/types/Firebase_immagini'
import Utente from '@/types/Utente'
import { notify } from '@kyvg/vue3-notification'
import aspectRatio from '@/utilities/AspectRatio'
import useEventsBus from '@/utilities/useEmitters'
import Exif from '@/types/Exif'
import { generateLocalStorageThumb } from '@/utilities/ThumbnailStorage'
import { getBase64_fromUrl } from '@/utilities/convertBase64'
import EXIF from 'exif-js'

const props = defineProps({   imageRf: { type: Immagine, required: true }   })
const { emit } = useEventsBus()

let src_real = ref(props.imageRf.src)
let showFixButton = ref(false)
let showImageRef = ref(true)
let showClassifier = ref(false)
let utente = inject('utente') as Utente

const classifierComp = computed(() => showClassifier.value && defineAsyncComponent(() => import("./TheClassifier.vue")) )
const getExifDatas = computed(() => props.imageRf.getCustomExifDatas() )

function imageLoadError(e){
  console.log('ImageExifViewer.imageLoadError() ❌  : ', e.target.id)
  src_real.value = require("@/assets/noImg.jpg")
  props.imageRf.src = require("@/assets/noImg.jpg")
  props.imageRf.classStyle = 'loadingError'
  showFixButton.value = true
  showImageRef.value = false
  setTimeout(() => { showImageRef.value = true }, 500)
}

function isImgLoaded(){ return src_real.value !== require("@/assets/loading.gif") && src_real.value !== require("@/assets/noImg.jpg") }

/**
 *    se presente la thumb la visualizza
 *    - altrimenti visualizza l'immagine reale e in background genera la thumb
 *    alla fine setta il css dell'immagine come caricata
 */
function swapRealImage(){
  const thumbImg = localStorage.getItem(`thumb-${props.imageRf.imgID}`)
  if( thumbImg ){
    console.log(`\t\t 💾 ImageExifViewer hit thumb cache() ${props.imageRf.nomeFile}`)
    src_real.value = thumbImg
  }
  else { 
    src_real.value = props.imageRf.realURL
    getBase64_fromUrl(props.imageRf.realURL).then( base64 => generateLocalStorageThumb(base64, props.imageRf.imgID) )
  }

  props.imageRf.setClassStyle('imageLoaded')
  // props.imageRf.setClassStyle('imgUploadRequest')
  // classe è triggerata subito da isImgLoaded nel tempalate    => TODO: inserire animazione CSS che copre il passaggio
}

function reqEdit() {
    console.log("ImageExifViewer.reqEdit() - ", isImgLoaded() ? 'pass' : 'No' );
}

/**
 *  reset thumb, adjustments and classifier
 *    TODO: not refresh GUI
 */
function resetAdj(){ 
  console.log("ImageExifViewer.resetAdj() + classifier + exifs ")
  localStorage.removeItem(`thumb-${props.imageRf.imgID}`)

  let currentImg = Utente.getInstance().getCatalog_by_cid(props.imageRf.catalogoID)!.getImmagineByID(props.imageRf.imgID).setExifDatas({} as Exif).setClassificatore([]/*  as Classification[] */)
  updateImage(currentImg)
}

function downloadImg(){ 
  console.log('donwload image')
  notify({ title: "Download image", text: `processing ${props.imageRf.getNomeFile()}...` })

  fetch(props.imageRf.realURL)
      .then(response => response.blob())
      .then(function(myBlob) {
          var fileLink = document.createElement('a')
          fileLink.setAttribute('href', URL.createObjectURL(myBlob))
          fileLink.setAttribute('download',props.imageRf.nomeFile)
          fileLink.click()
      })
      .catch(err=> notify({ title: "Error", text: `Download failed ${err}` }))
}

/**
 *  - backuppa lista attuale (se fallisse la cancellazione)
 *  - cancella dalla gui l'immagine
 *  - cancella parallelamente da firebase e firestore
 */
async function deleteImg(){
  let cat = utente.getCatalog_by_cid(props.imageRf.catalogoID)
  if( ! cat )
    return Promise.reject()

  const listBefore = cat.listaImmagini
  const listRemoved = listBefore.filter( i => i.imgID !== props.imageRf.imgID )
  cat.listaImmagini = listRemoved

  deleteImageFacade(props.imageRf)
      .then( ()=> notify({title:'Success', text: `${props.imageRf.getNomeFile()} deleted`}) )
      .catch( ()=> {
          notify({title: "Error",text:`Can't remove ${props.imageRf.getNomeFile()}`, type:'error' })
          setTimeout( ()=> utente.getCatalog_by_cid(props.imageRf.catalogoID)!.listaImmagini = listBefore, 500)
      })
}


/**
 *  Se l'immagine non è disponibile, proponi ricaricamento
 *    - TODO: implementare anche caricamento immagine direttamente da qui    
 */
function fixLinkImage(){
  console.log('fixLinkImage')
}

function hideExtension(str: string){ return str.replace(/\.[^/.]+$/, "") }

function runClassifier(){ showClassifier.value = true }

onMounted( async () => {
  props.imageRf.setClassStyle('loadingBG')

  swapRealImage()

  if( ! props.imageRf.classificatore ) setTimeout( () => runClassifier(), 300)
  if( ! props.imageRf.exifDatas ) setTimeout( () => console.log(`Image ${props.imageRf.nomeFile} missing Exif`), 500)  
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
  background: var(--lighWarmGradinet);
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
.mainViewer > span {
  flex: 50%;
  margin: 1rem;
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: thin;
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
  color: var(--backText);
  font-size: 90%;
}

/*
*     http://css3.bradshawenterprises.com/cfimg/
*/
.loadingBG{
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
.imgUploadRequest + .imgOverlaySpinner{ opacity: 1; }
.imgOverlaySpinner{ 
  opacity: 0;
}
/*  
.imgOverlaySpinner{ width: 50%; position: initial 
    position: absolute;
    top: 30%;   left: 30%;
    position: relative;
    width: 10rem;
    height: 10rem;
} 
*/

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


/*
*    Pulsanti azione a sinistra
*/
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
.cntimgSettingsBtns:hover .imgSettingsBtns:nth-child(6){ /* animation: fadeInBtns .3s; */ opacity: 1; transition: 3.5s; }
.cntimgSettingsBtns:hover .imgSettingsBtns:nth-child(7){ /* animation: fadeInBtns .3s; */ opacity: 1; transition: 4s; }

/* @keyframes fadeInBtns {    0% { opacity: 0 }     100% { opacity: 1 }      } */

/* .iconSVG{ width: 1rem; height: 1rem; object-fit: cover; } */

</style>


 
<!--  

function getInfoSize() : {label:string, val:string}[]{
  const obi : any = (l:string, v: undefined | any ) => { 
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

 -->