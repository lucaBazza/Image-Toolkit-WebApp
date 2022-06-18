<template id="imageEditorModalVue_tmpl">
    <div class="backdropModal">
        <div class="imgEditorModal"> <!-- @mouseleave="$emit('toggle-editor-fn')" -->
            <button @click="$emit('toggle-editor-fn')"> ❌ </button>
            <img :src="image_ref.src" :style="getStyles()">
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
                    <h2>Fusion mode</h2>
                    <select name="FusionModes">
                        <option value="volvo">Normal</option>
                        <option value="saab">Multiply</option>
                        <option value="opel">Screen</option>
                        <option value="audi">Overlay</option>
                        <option value="audi">HardLight</option>
                        <option value="audi">Luminosity</option>
                    </select>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import Immagine from '@/types/Immagine'
import Slider from '@vueform/slider'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists

// https://codepen.io/manifoldkaizen/pen/BJNJgr

export default defineComponent({
    name: 'ImageEditorModal',
    components: { Slider },
    props: {
        imageProp: { required: true, type: Immagine},
    },
    emits: ['toggle-editor-fn'],
    computed: {
        //saturationVal() : string{
        //    return Math.floor($data.valueSat / 100).toString();
        //},
        updatedStyleFilters() : string{
            return ''
        }
    },
    setup(props){
        const image_ref = props.imageProp;
        
        let temperatureValue = ref({
            value: 0,
            default: 0,
            min: 0,
            max: 100,
            tooltipPosition: 'bottom',
            format: function (value) {
                return `${Math.round(value)}%`
            }
        })

        let saturationValue = ref({
            value: 0,
            default: 0,
            min: -100,
            max: 100,
            tooltipPosition: 'bottom',
            format: function (value) {
                return `${Math.round(value)}%`
            }
        })

        let contrastValue = ref({
            value: 100,
            default: 100,
            min: 0,
            max: 200,
            tooltipPosition: 'bottom',
            format: function (value) {
                return `${Math.round(value)}%`
            }
        })

        let brightnessValue = ref({
            value: 0,
            default: 0,
            min: -100,
            max: 100,
            tooltipPosition: 'bottom',
            format: function (value) {
                return `${Math.round(value)}%`
            }
        })

        const getStyles = ()=>{
            const filterOutput = `filter: saturate(${saturationValue.value.value + 100}%) contrast(${contrastValue.value.value}%) sepia(${temperatureValue.value.value}%) brightness(${brightnessValue.value.value +100}%); `
            //console.log(filterOutput)
            return filterOutput
        }

        // non aggiorna la gui
        const parameterReset = (slider : any)=>{
            console.log('parameterReset()')
            console.log(slider)
            slider = 0 
        }

        return{ image_ref, getStyles, parameterReset, saturationValue, contrastValue, temperatureValue, brightnessValue }
    }
})
</script>


<style src="@vueform/slider/themes/default.css"></style>

<style>
.backdropModal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
}
.imgEditorModal{
    background-color: rgba(0, 0, 0, 0.5);
    margin: 2rem;
    border-radius: 1rem;
    /*position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);*/
    /*width: max(90%, 400px ); height: 90%; margin: max(2%, 50px); */
}
.imgEditorModal > button {
    background: transparent;
    font-size: 1.5rem;
    position: absolute;
    float: right;
    right: 2rem;
    border: transparent;
}
.imgEditorModal > div{ width: 90%; margin: 0 auto; }
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
}
.imgEditorModal > ul > li{
    padding: 1rem;
}
.imgEditorModal > ul > li:last-child{ height: 20rem; }
.imgEditorModal > ul > li > h2 { margin-bottom: .1rem; }
.imgEditorModal > ul > li > select { 
    padding: 1rem; 
    color: var(--mainText); 
    width: 100%;
    background: transparent;
}
.imgEditorModal > ul > li > select:hover{ background-color: rgba(0, 0, 0, 0.1) }
.imgEditorModal > img{
    width: 60%;
    margin: min(50%, 4rem) 0;
    object-fit: contain;
    border-radius: .4rem;
    /*height: 80%;*/
    /*background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #fff 100%);*/
}
/*.imgEditorModal > img::before{
    display: block;
    position: relative;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #DE0 100%);
    width: 100%;
    content: '';
}*/

</style>
