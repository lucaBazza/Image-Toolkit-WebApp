<template>
    <div class="theClassifier">
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
import { onMounted, ref } from 'vue'
import Immagine from '@/types/Immagine'
import ml5 from 'ml5'

const props = defineProps({ immagine: {  type: Immagine, required: true }, nodeImg: { type: Image, required: true } })

let imageClass = ref('')
let status = ref('')
let classifier
const number_of_showResults = 3

/**
 *  result è di tipo interfaccia classification
 *  visualizzo su status la lista degli n più probabili risultati (unisco tutto e poi prendo i primi)
 */
async function classify(){
  let result = ({label: '', confidence: 0})
  classifier.classify(props.nodeImg, (error : string, results : any)=>{
    if(error)
      { console.log(error); status.value = 'Error in prediction'; return }

    result.label = results[0].label
    result.confidence = Number((results[0].confidence * 100).toFixed(2))

    status.value = results.map( (r: { label: number | string }) => r.label ).join(',').split(',').slice(0,number_of_showResults).join(',')
    console.log(`Classified as : ${status.value} \n`, results)
  })
  .catch( err => status.value = err.toString().split('.')[0] )
}

onMounted( async () => {
  if( ! props.nodeImg )
    { status.value = 'Missing image'; return }

  classifier = ml5.imageClassifier('MobileNet', classify)  // Darknet, DoodleNet, ...
})

</script>

<style>
  .theClassifier { display: inline-block }
  .morph-spinner { margin-left: .7rem }
</style>
