<template id="imageEditorModalVue_tmpl">
    <div class="backdropModal">
        <div class="imgEditorModal">
            <button @click="emit('toggleEditorFullScreen')"> ❌ </button>
            <div class="cnvs-boxs">
                <canvas ref="cnvsLayerA" style="background: url()"></canvas>
            </div>
            <ul>
                <li class="editActionsBtns">
                    <button @click="rotate90(getContextA(), getCanvasA(),img)"> 🔃 </button>
                    <button @click="downloadTest(getCanvasA(), imageProp.nomeFile)">⬇️</button>
                </li>
                <li @click.shift="parameterReset(saturationValue.value)">
                    <h2>Saturation</h2>
                    <Slider v-model="saturationValue.value" v-bind="saturationValue" @change="updateImage"/>
                </li>
                <li>
                    <h2>Contrast</h2>
                    <Slider v-model="contrastValue.value"  v-bind="contrastValue"  @change="updateImage"/>
                </li>
                <li>
                    <h2>Temperature</h2>
                    <Slider v-model="temperatureValue.value" v-bind="temperatureValue"  @change="updateImage"/>
                </li>
                <li>
                    <h2>Brightness</h2>
                    <Slider v-model="brightnessValue.value" v-bind="brightnessValue"  @change="updateImage"/>
                </li>
                <li>
                    <h2>LUTS</h2>
                    <select name="FusionModes" @change="testLUT">
                        <option value="lutReset">Unset</option>
                        <option value="lutA-warmy+.png">Warm Contrast</option>
                        <option value="lutB-nigthty.webp">New York Night</option>
                        <option value="lutC-warmer-soft.png">Sean Warm</option>
                        <option value="lutD-greeny.png">Naville Greeny</option>
                        <option value="lutE-softPump.png">Color Pump</option>
                        <option value="lutF-ultraRED.png">Ultra RED</option>
                        <option value="lutG-cyan-TealOrange.png">Colder Teal & Orange</option>
                        <option value="lutH-BW-highKey.png">BW High Key</option>
                        <option value="lutI-BW-neutral.jpg">BW Neutral</option>
                        <option value="lutJ-BW-contrasted.jpg">BW Contrasted</option>
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
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import Immagine from '@/types/Immagine'
import Slider from '@vueform/slider'
import useEventsBus from '@/utilities/useEmitters'
import Utente from '@/types/Utente'
import { rotate90, downloadTest, filterImage_LUT, resetImageBeforeLutFilter } from '@/utilities/ImageEditorFunctions'
import { notify } from '@kyvg/vue3-notification'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists
// https://codepen.io/manifoldkaizen/pen/BJNJgr

const props = defineProps({     imgIdProp: {type: String, required: true}   })
let utente = reactive(Utente.getInstance())
let imageProp : Immagine = utente.getCurrentCatalog_cid().getImmagineByID(props.imgIdProp)
const cnvsLayerA = ref<HTMLCanvasElement>()
const { emit } = useEventsBus()


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

let temperatureValue = ref({
    value: 0,
    default: 0,
    min: 0,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

function getStyles(){
    return `saturate(${saturationValue.value.value + 100}%) contrast(${contrastValue.value.value}%) sepia(${temperatureValue.value.value}%) brightness(${brightnessValue.value.value +100}%) `
}

// non aggiorna la gui
function parameterReset(slider : any){
    console.log('parameterReset()')
    console.log(slider)
    slider = 0 
}

let img = new Image()
img.crossOrigin="anonymous"
img.src = imageProp.realURL

function getCanvasA(){ if( ! cnvsLayerA.value) throw Error('No canvas to use'); return cnvsLayerA.value!  }

function getContextA() : CanvasRenderingContext2D { 
    if(getCanvasA().getContext('2d')) return getCanvasA().getContext('2d')!; throw Error('No context canvas to update image 😡')
}

function updateImage(){
    getContextA().clearRect(0, 0, getCanvasA().width, getCanvasA().height)
    window.requestAnimationFrame(()=>{          //  the browser calls a specified function to update an animation before the next repaint
        getContextA().filter = getStyles()
        getContextA().drawImage(img,0,0)
    })
}



/*              BASE64 da url    -> use utils !!            */
const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
}))

function testLUT(e){
    let urlLut
    if( ! e  || ! e.target.value ) throw Error('No LUT to load \t 😢 ')
    if( e.target.value==='lutReset'){ resetImageBeforeLutFilter(getCanvasA(),img); return }

    try{ urlLut = require(`@/assets/LUTs/${e.target.value}`) } catch(err){}
    if(!urlLut){ notify({title:'Error', text:'Cant find this LUT in assets 😢 ', type:'error'}); return }

    console.log('testLUt() \t', e.target.value)
    let imgLut = new Image()
    let canvasLut = document.createElement('canvas') as HTMLCanvasElement
    let ctxLut = canvasLut.getContext("2d")!
    imgLut.crossOrigin = "Anonymous"
    imgLut.onload = function() {
        canvasLut.width = imgLut.width
        canvasLut.height = imgLut.height
        ctxLut.drawImage(imgLut, 0, 0)

        resetImageBeforeLutFilter(getCanvasA(), img)
        filterImage_LUT(getCanvasA(), getContextA(),canvasLut , ctxLut , 255)
        //localStorage.setItem( "savedImageDataLut", canvasLut.toDataURL("image/png") );
    }

    toDataURL( urlLut )
        .then( srcLutbyte => imgLut.src = String(srcLutbyte) ) 
}

onMounted( async() => {
    img.onload = ()=> {
        cnvsLayerA.value!.width = img.width
        cnvsLayerA.value!.height = img.height
        updateImage()
    }
})

</script> 

<style src="@vueform/slider/themes/default.css"></style>

<style>
.backdropModal{
    position: fixed;            background-color: rgba(var(--backgroundColor), .6);
    top: 0;                     left: 0;
    width: 100vw;                height: 100vh;
}
.imgEditorModal{
    position: static;
    background-color: rgba(var(--backgroundColor), .9);
    margin: 2rem 2rem;
    border-radius: 1rem;
}
.cnvs-boxs{ width: 60%; margin: 0 auto; padding-top: 1rem ; object-fit: contain; border-radius: .4rem;  } 
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
.imgEditorModal > ul{ 
    width: max(90%, 400px );
    margin: 0 auto;
    padding-left: 0;
}
.imgEditorModal > ul > li{ padding: .8rem; margin: 0 auto }
.imgEditorModal > ul > li:first-child{ padding-top: 0 }
.imgEditorModal > ul > li:last-child{ height: 10rem }
.imgEditorModal > ul > .editActionsBtns  > button { background: transparent; border: none; font-size: 1.4rem; padding: 0 1rem; }
.slider-target{ margin-bottom: 1rem }
.imgEditorModal > ul > li > h2 { margin-bottom: .1rem; margin-top: 0; }
.imgEditorModal > ul > li > select{ padding: 1rem; color: var(--mainText); width: 100%; background: transparent; }
.imgEditorModal > ul > li > select:hover{ background-color: rgba(0, 0, 0, 0.1) }
</style>
