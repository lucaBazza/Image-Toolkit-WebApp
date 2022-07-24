<template id="imageEditorModalVue_tmpl">
    <div class="backdropModal">
        <div class="imgEditorModal">
            <button @click="onClose"> ❌ </button>
            <div class="editActionsBtns-v2">
                    <button @click="rotate90(getContextA(), getCanvasA(),img)"> 🔃 </button>
                    <button @click="downloadTest(getCanvasA(), image.nomeFile)">⬇️</button>
            </div>
            <div class="cnvs-boxs">
                <canvas ref="cnvsLayerA" style="background: url()"></canvas>
            </div>
            <ul>
                <li @click.shift="parameterReset(saturationValue.value)">
                    <h2>Saturation</h2>
                    <Slider v-model="saturationValue.value" v-bind="saturationValue" @change="updateImage2"/>
                </li>
                <li>
                    <h2>Contrast</h2>
                    <Slider v-model="contrastValue.value"  v-bind="contrastValue" @change="updateImage2"/>
                </li>
                <li>
                    <h2>Temperature</h2>
                    <Slider v-model="temperatureValue.value" v-bind="temperatureValue" @change="updateImage2"/>
                </li>
                <li>
                    <h2>Brightness</h2>
                    <Slider v-model="brightnessValue.value" v-bind="brightnessValue" @change="updateImage2"/>
                </li>
                <li>
                    <h2>LUTS</h2>
                    <select name="FusionModes" @change="refreshLUT" :value="adjusts.lut.name" defa>
                        <option value="lutUnset">Unset</option>
                        <option value="lutA-warmy+.png">Warm Contrast</option>
                        <option value="lutB-nigthty.webp">New York Night</option>
                        <!-- <option value="lutC-warmer-soft.png">Sean Warm</option> -->
                        <option value="lutD-greeny.png">Naville Greeny</option>
                        <option value="lutE-softPump.png">Color Pump</option>
                        <option value="lutF-ultraRED.png">Ultra RED</option>
                        <option value="lutG-cyan-TealOrange.png">Colder Teal & Orange</option>
                        <option value="lutH-BW-highKey.png">BW High Key</option>
                        <option value="lutI-BW-neutral.jpg">BW Neutral</option>
                        <option value="lutJ-BW-contrasted.jpg">BW Contrasted</option>
                    </select>
                </li>
                <!-- 
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
                 -->
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
import { rotate90, downloadTest, updateLUT } from '@/utilities/ImageEditorFunctions'
import { generateLocalStorageThumb } from '@/utilities/ThumbnailStorage'
import { notify } from '@kyvg/vue3-notification'
import Adjustment from '@/types/Adjustment'
import { createLut_byName } from '@/types/LUT'
import { updateImage } from '@/types/Firebase_immagini'

/**
 *  CSS-based RGB filtering with fusion modes
 *      https://codepen.io/manifoldkaizen/pen/BJNJgr
 *  
 *  VueJS select with dynamic values
 *      https://vue-select.org/guide/values.html#transforming-selections
 * 
 *  - set default adj if not present
 *  - load image and the first refresh()
*/

const props = defineProps({     imgIdProp: {type: String, required: true}   })
let utente = reactive(Utente.getInstance())
let image : Immagine = utente.getTheCatalog().getImmagineByID(props.imgIdProp)
const cnvsLayerA = ref<HTMLCanvasElement>()
const { emit } = useEventsBus()
let hasUnsavedEdits = false;

// console.log('image adji loaded: ', JSON.stringify(image.adjustment))

// setInterval( ()=> console.log("Update ref image adjusts: ", adjusts.value.saturation, " original data: ", image.adjustment?.saturation), 3000)

if( ! image.adjustment )
    image.adjustment = { lut: createLut_byName('lutUnset'), saturation: 0, contrast: 100, brightness:0, temperature:0 } as Adjustment

const adjusts = ref(image.adjustment)

let saturationValue = ref({
    value: adjusts.value.saturation,
    default: 0,
    min: -100,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

let contrastValue = ref({
    value: adjusts.value.contrast,
    default: 100,
    min: 0,
    max: 200,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

let brightnessValue = ref({
    value: adjusts.value.brightness,
    default: 0,
    min: -100,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

let temperatureValue = ref({
    value: adjusts.value.temperature,
    default: 0,
    min: 0,
    max: 100,
    tooltipPosition: 'bottom',
    format: function (value) { return `${Math.round(value)}%` }
})

function getStyles(){
    return `saturate(${saturationValue.value.value + 100}%) contrast(${contrastValue.value.value}%) 
            sepia(${temperatureValue.value.value}%) brightness(${brightnessValue.value.value +100}%) `
}

// non aggiorna la gui
function parameterReset(slider : any){
    console.log('parameterReset()')
    console.log(slider)
    slider = 0 
}

let img = new Image()
img.crossOrigin="anonymous"
img.src = image.realURL

function getCanvasA(){ if( ! cnvsLayerA.value ) throw Error('No canvas to use'); return cnvsLayerA.value! }

function getContextA() : CanvasRenderingContext2D { 
    if(getCanvasA().getContext('2d')) return getCanvasA().getContext('2d')!; throw Error('No context canvas to update image 😡')
}

/** alla chiusura, notifica e aggiorna la thumb image, salva l'immagine con i lut aggiornati  */
function onClose(){
    if(hasUnsavedEdits){
        generateLocalStorageThumb(getCanvasA(),image.imgID)
        updateImage(image)
        notify({title:'Saved', text:`${image.nomeFile}`})
        hasUnsavedEdits = false;
    }
    emit('toggleEditorFullScreen')
}

/**
 *  - cancella il frame precedente
 *  - aggiorna il LUT
 */
function updateImage2(){
    getContextA().clearRect(0, 0, getCanvasA().width, getCanvasA().height)
    window.requestAnimationFrame(()=>{          //  the browser calls a specified function to update an animation before the next repaint
        hasUnsavedEdits = true;

        updateLUT(getCanvasA(),img, createLut_byName(adjusts.value.lut.name))

        const imageLutted = document.createElement('img') as HTMLImageElement
        imageLutted.src = getCanvasA().toDataURL()

        getContextA().filter = getStyles()
        getContextA().drawImage(imageLutted,0,0)
    })
}

function refreshLUT(e){
    if( ! e  || ! e.target.value ) throw Error('No LUT to load \t 😢 ')
    
    adjusts.value.lut = createLut_byName(e.target.value);
    updateImage2()
}


onMounted( async() => {
    img.onload = ()=> {
        cnvsLayerA.value!.width = img.width
        cnvsLayerA.value!.height = img.height
        updateImage2()
        setTimeout( ()=> hasUnsavedEdits = false, 200)
    }
})

</script> 

<style src="@vueform/slider/themes/default.css"></style>

<style>

.backdropModal{
    position: fixed;    background-color: rgba(var(--backgroundColor), .6);
    top: 0;             left: 0;
    width: 100vw;       height: 100vh;
}
.imgEditorModal{
    position: static;
    background-color: rgba(var(--backgroundColor), .9);
    margin: 2rem 2rem;
    border-radius: 1rem;
}
.cnvs-boxs{ width: 60%; margin: 0 auto; padding-top: 1rem ; object-fit: contain; border-radius: .4rem;  } 
.cnvs-boxs > canvas{ width: 100%; object-fit: contain }
.imgEditorModal > button, .imgEditorModal > ul > button {
    background: transparent;
    font-size: 1.5rem;
    position: absolute;
    float: right;
    right: 2rem;
    border: transparent;
}
.imgEditorModal > button:hover{ cursor: grab }
.imgEditorModal > ul{ width: max(90%, 400px ); margin: 0 auto; padding-left: 0 }
.imgEditorModal > ul > li{ padding: .8rem; margin: 0 auto }
.imgEditorModal > ul > li:first-child{ padding-top: 0 }
.imgEditorModal > ul > li:last-child{ height: 10rem }
.imgEditorModal > ul > .editActionsBtns > button{ background: transparent; border: none; font-size: 1.4rem; padding: 0 1rem; }
.slider-target{ margin-bottom: 1rem }
.imgEditorModal > ul > li > h2{ margin-bottom: .1rem; margin-top: 0 }
.imgEditorModal > ul > li > select{ padding: 1rem; color: var(--mainText); width: 100%; background: transparent; }
.imgEditorModal > ul > li > select:hover{ background-color: rgba(0, 0, 0, 0.1) }

.editActionsBtns-v2{
    position: absolute;
    height: 15rem;
    width: 3rem;
    top: 1.2rem;
    left: 0.6rem;
}
.editActionsBtns-v2 > button{  background: transparent; font-size: 1.5rem; border: transparent }

</style>
