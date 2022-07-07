<template>
    <div class="theClassifier">
      <img :src="immagine.realURL" ref="imgRef" crossorigin="anonymous" hidden/>
      {{imageClass}}
      <div v-if="status==''"><span class="morph-spinner"></span></div>
      <div v-else><div>{{status}}</div></div>
    </div>
</template>

<script setup lang="ts">
/**
 *   Componente richiamato dal visualizzatore immagine (quando non presente già una catalogazione)
 *   controlla 
 *      - se c'è un volto face-api
 *      - se c'è oggetto ML5  
 *  
 *    https://anilmaharjan.com.np/blog/ml5-with-webpack-and-typescript
 *    https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html
 *    https://github.com/justadudewhohacks/face-api.js/blob/master/README.md#tiny-face-detector
 * 
 */
import { onMounted, ref, inject } from 'vue'
import Utente from '@/types/Utente'
import Immagine from '@/types/Immagine'
import ml5 from 'ml5'
import Classification from '@/types/Classification'
import { updateImage } from '@/types/Firebase_immagini'

const props = defineProps({ immagine: {  type: Immagine, required: true }/* , nodeImg: { type: Image, required: true } */ })

let imgRef = ref()
let imageClass = ref('')
let status = ref('')
let classifier
let faceApi
const number_of_showResults = 3

let utente = inject('utente') as Utente

/**
 *  result è di tipo interfaccia classification
 *  visualizzo su status la lista degli n più probabili risultati (unisco tutto e poi prendo i primi)
 *  aggiorno il database salvando la classificazione nell'immagine come map
 */
async function classify(){
  let result = ({label: '', confidence: 0})
  classifier.classify(imgRef.value, (error : string, results : any)=>{
    if(error)
      { console.log(error); status.value = 'Error in prediction'; return }

    result.label = results[0].label
    result.confidence = Number((results[0].confidence * 100).toFixed(2))


    let img = utente.getCurrentCatalog_cid().listaImmagini.filter(i=>i.imgID===props.immagine.imgID)[0]
    const cl = results.map( res => { return { label: res.label, confidence: res.confidence} as Classification })
    img.setClassificatore(cl)
    updateImage(img).then(()=>console.log('😀')).catch(err => console.log(' 😭 ',err, img))


    status.value = results.map( (r: { label: number | string }) => r.label ).join(',').split(',').slice(0,number_of_showResults).join(',')
    console.log(`\nClassified as : ${status.value} \n`, results, '\n\n')
  })
  .catch( err => status.value = err.toString().split('.')[0] )
}

async function detectFaceApi(){
    console.log('Model Loaded!');


    faceApi.detect(imgRef.value, (err, results) => {
      console.log(results)
      console.log(err)
    })
}

onMounted( async () => {
  if( ! imgRef.value /* props.nodeImg */ )
    { status.value = 'Missing image'; return }

  classifier = ml5.imageClassifier('MobileNet', classify)  // MobileNet, Darknet, DoodleNet, ...

  // => https://www.npmjs.com/package/@vladmandic/face-api
  //faceApi = ml5.faceApi( {withLandmarks: false, withDescriptors: false }, detectFaceApi);


})

</script>

<style>
  .theClassifier { display: inline-block }
  .morph-spinner { margin-left: .7rem }
</style>
