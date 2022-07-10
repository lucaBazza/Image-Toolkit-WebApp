<template id="imageEditorModalVue_tmpl">
    <div class="backdropModal">
        <div class="imgEditorModal">
            <button @click="emit('toggleEditorFullScreen')"> ❌ </button>
            <div class="cnvs-boxs">
                <canvas ref="cnvsLayerA" style="background: url()"></canvas>
            </div>
            <ul>
                <li @click.shift="parameterReset(saturationValue.value)">
                    <h2>Saturation</h2>
                    <Slider v-model="saturationValue.value" v-bind="saturationValue"/>
                </li>
                <li>
                    <h2>Contrast</h2>
                    <Slider v-model="contrastValue.value"  v-bind="contrastValue"/>
                </li>
                <li>
                    <h2>Temperature</h2>
                    <Slider v-model="temperatureValue.value" v-bind="temperatureValue"/>
                </li>
                <li>
                    <h2>Brightness</h2>
                    <Slider v-model="brightnessValue.value" v-bind="brightnessValue"/>
                </li>
                <li>
                    <h2>LUTS</h2>
                    <select name="FusionModes">
                        <option value="lutA">Warm Contrast</option>
                        <option value="lutA">New York</option>
                        <option value="lutA">Sean</option>
                        <option value="lutA">Naville</option>
                        <option value="lutA">Contrast</option>
                        <option value="lutA">BW -</option>
                        <option value="lutA">BW +</option>
                        <option value="lutA">BW mid key</option>
                    </select>
                </li>
                <li>
                    <h2>Fusion mode</h2>
                    <select name="FusionModes">
                        <option value="Normal">Normal</option>
                        <option value="Multiply">Multiply</option>
                        <option value="Screen">Screen</option>
                        <option value="Overlay">Overlay</option>
                        <option value="HardLight">HardLight</option>
                        <option value="Luminosity">Luminosity</option>
                    </select>
                </li>
            <button @click="downloadTest">⬇️</button>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, reactive } from 'vue'
import Immagine from '@/types/Immagine'
import Slider from '@vueform/slider'
import useEventsBus from '@/utilities/useEmitters'
import Utente from '@/types/Utente'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists
// https://codepen.io/manifoldkaizen/pen/BJNJgr

let utente = reactive(Utente.getInstance())
const imgId = getCurrentInstance()?.appContext.config.globalProperties.selectedImageID
let imageProp : Immagine = utente.getCurrentCatalog_cid().getImmagineByID(imgId)
/* 
console.log('TheEditorFullScreen() \t imgId:',imgId,
                 "\n\t imgs: ", utente.getCurrentCatalog_cid().listaImmagini.map(i=>i.nomeFile).join(), imageProp )
console.log(utente.getCurrentCatalog_cid().listaImmagini.map(i=>i.nomeFile).join())
 */
const cnvsLayerA = ref<HTMLCanvasElement>()
const { emit } = useEventsBus()


let temperatureValue = ref({
    value: 0,
    default: 0,
    min: 0,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

let saturationValue = ref({
    value: 0,
    default: 0,
    min: -100,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

let contrastValue = ref({
    value: 100,
    default: 100,
    min: 0,
    max: 200,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

let brightnessValue = ref({
    value: 0,
    default: 0,
    min: -100,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

const getStyles = ()=>{
    return `filter: saturate(${saturationValue.value.value + 100}%) contrast(${contrastValue.value.value}%) sepia(${temperatureValue.value.value}%) brightness(${brightnessValue.value.value +100}%); `
}

// non aggiorna la gui
function parameterReset(slider : any){
    console.log('parameterReset()')
    console.log(slider)
    slider = 0 
}

function downloadTest(){
    var link = document.createElement('a')
    link.download = imageProp.nomeFile
    link.href = cnvsLayerA.value?.toDataURL()!
    link.click()
}

onMounted( async() => {
    if( cnvsLayerA.value && cnvsLayerA.value.getContext('2d')){
        let ctxA = cnvsLayerA.value.getContext('2d')!
        let img = new Image()
        img.crossOrigin="anonymous"
        img.src = imageProp.realURL

        img.onload = ()=> {
            cnvsLayerA.value!.width = img.width
            cnvsLayerA.value!.height = img.height
            ctxA.filter = getStyles() //'contrast(1.2)'//'contrast(5.2) sepia(.2)'
            ctxA.drawImage(img,0,0)
        }
    }
})

</script>

<style src="@vueform/slider/themes/default.css"></style>
<style>
.backdropModal{
    position: fixed;            background-color: rgba(var(--backgroundColor), .6);
    top: 0;                     left: 0;
    width: 100vw;                height: 100vh;
    /* transition: .5s ease-in; */
}
.imgEditorModal{
    position: static;
    background-color: rgba(var(--backgroundColor), .9);
    margin: 2rem 2rem;
    border-radius: 1rem;
    /*position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);*/
    /*width: max(90%, 400px ); height: 90%; margin: max(2%, 50px); */
}
.cnvs-boxs{ width: 60%; margin: 0 auto; padding-top: 1rem ; object-fit: contain; border-radius: .4rem;  } 
            /* margin: min(50%, 4rem) auto;  */  /*height: 80%; */
.cnvs-boxs > canvas{ width: 100% }

.imgEditorModal > button, .imgEditorModal > ul > button {
    background: transparent;
    font-size: 1.5rem;
    position: absolute;
    float: right;
    right: 2rem;
    border: transparent;
}
.imgEditorModal > button:hover{ cursor: grab }
/*.imgEditorModal > div > h2{ 
    margin: 0 auto; 
    margin-bottom: 2.5rem;
    border-bottom: 1px solid white;
    width: 30%; 
}*/
.imgEditorModal > ul{ 
    width: max(90%, 400px );
    margin: 0 auto;
    padding-left: 0;
}
.imgEditorModal > ul > li{ padding: .8rem; margin: 0 auto }
.imgEditorModal > ul > li:first-child{ padding-top: 0 }
.imgEditorModal > ul > li:last-child{ height: 10rem }
.slider-target{ margin-bottom: 1rem }
.imgEditorModal > ul > li > h2 { margin-bottom: .1rem; margin-top: 0; }
.imgEditorModal > ul > li > select{ padding: 1rem; color: var(--mainText); width: 100%; background: transparent; }
.imgEditorModal > ul > li > select:hover{ background-color: rgba(0, 0, 0, 0.1) }

/*.imgEditorModal > img::before{
    display: block;
    position: relative;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #DE0 100%);
    width: 100%;
    content: '';
}*/

</style>