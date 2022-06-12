<template>
    <div class="imgEditorModal">
        <img :src="image_ref.src" style="filter:saturate(50%)" @mouseleave="mouseLeaveEvent()"/>
        <ul>
            <li>
                <h2>Saturazione</h2>
                <Slider v-model="value"/>
            </li>
            <li>
                <label for="blueSlider">Contrasto ({{ color.blue }})</label>
                <input class="slider" id="blueSlider" type="range" min="0" max="255" step="1" v-model="color.blue"/>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { ref } from 'vue'
import Immagine from '@/types/Immagine'

import Slider from '@vueform/slider'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists

// https://codepen.io/manifoldkaizen/pen/BJNJgr

export default {
    name: 'ImageEditorModal',
    components: { Slider },
    props: {
        imageProp: { required: true, type: Immagine}
    },
    data() {
        return { 
            value: 20,
            color: {
                red: 255,
                green: 255,
                blue: 172,
                alpha: 0
            }
        }
    },
    computed: {
        //saturationVal(){
        //    value = value / 100;
        //}
    },
    setup(props){
        const image_ref = props.imageProp;
        
        /*let slider =  ref('12')*/

        return{ image_ref,  /*, slider*/ }
    },
    methods: {
        mouseLeaveEvent(){
            console.log('mouseLeaveEvent()')
            
        }
    }
}
</script>


<style src="@vueform/slider/themes/default.css"></style>
<style>
.imgEditorModal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    /*width: max(90%, 400px ); height: 90%; margin: max(2%, 50px); */
}
.imgEditorModal > div{ width: 90%; margin: 0 auto; }
/*.imgEditorModal > div > h2{ 
    margin: 0 auto; 
    margin-bottom: 2.5rem;
    border-bottom: 1px solid white;
    width: 30%; 
}*/
.imgEditorModal > ul > li > label { color: var(--mainText); display: block;}
.imgEditorModal > img{
    width: 80%;
    height: 80%;
    object-fit: contain;
}
</style>
