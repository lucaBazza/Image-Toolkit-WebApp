<template>
  <div class="mainViewer">
    <img
        :src="image_ref.src"
        :class="image_ref.classStyle"
        :id=" 'img_' + image_ref.id"
        :alt="image_ref.alt"
        @error="imageLoadError"
        @click="toggleEditorFn"
    />
    <span>
      {{ image_ref.nomeFile }}<button @click="reqEdit">🖊️</button><br />
      <li v-for="ex in image_ref.exifDatas" :key="ex.label">
        <b>{{ ex.label }}</b> {{ ex.val }}
      </li>
    </span>
  </div>
  <ImageEditorModalVue 
      v-show="showImgEditModal" 
      :imageProp="image_ref"
      @toggle-editor-fn="toggleEditorFn" /> <!-- :isShowedEditor="showImgEditModal" -->
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Immagine from '@/types/Immagine'
import AspectRatio from '@/utilities/AspectRatio'
import ImageEditorModalVue from './ImageEditorModal.vue'

// https://quasar.dev/vue-components/img#example--native-lazy-loading
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists

export default defineComponent({
  name: 'ImageExifViewer',
  props: {
    imageRf: { required: true, type: Immagine}
  },
  components: { ImageEditorModalVue },
  setup(props){
    const image_ref = props.imageRf;

    const imageLoadError = ()=>{
      console.log('imageLoadError()')
      image_ref.src = require("@/assets/noImg.jpg")
      image_ref.classStyle = 'loading'
    }

    var showImgEditModal = ref(false)

    return{ image_ref, imageLoadError, showImgEditModal /*, toggleImageEditor*/ }
  },
  methods: {
    aspect_ratioZab(width, height) {
      AspectRatio(width / height, 50) //this.aspect_ratio(width / height, 50);
    },
    reqEdit() {
      console.log("ImageExifViewer.reqEdit()");
    },
    toggleEditorFn : function(){
      console.log("ImageExifViewer.toggleEditorFn()")
      this.showImgEditModal = ! this.showImgEditModal
    }
  },
  mounted() { 
       //this.$root.$on('a-far-away-event', (name) => {
      //  //alert('Hello ' + name)
      //  console.log("ImageExifViewer.reqEdit()"); 
      //})
      
      /*bus.$on('toggleImageEditor',(data)=>{
        console.log(data);
        //this.setup.toggleImageEditor()
      })*/
  },
})
</script>



<style>
.mainViewer{
  --lighWarmGradinet: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  /*--darkColdGradinet: linear-gradient(-45deg, #4E156C, #831838, #975038, #213892);*/
}
.mainViewer {
  margin: 5%; /*margin-left: 5%; margin-top: 5%;*/
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
.darkMode .mainViewer{ 
    box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .7);
    color: var(--mainText)
}
.mainViewer > img {
  flex: 50%;
  float: left;
  margin: 1rem;
  border-radius: 0.5rem;
  object-fit: cover;
  max-width: max(
    50%,
    300px
  ); /* set the max-width of img to whichever value is largest, 50% or 300px: */
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
.mainViewer > span > li {
  list-style-type: none;
  text-align: left;
}
.mainViewer > span > button {
  background: transparent;
  border: none;
  cursor: crosshair;
}

.loading {
  mix-blend-mode: multiply;
  /*mask-image: linear-gradient(black, transparent);
  mask-mode: luminance;*/
}
/*
@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}
*/
</style>
