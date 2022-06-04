<template>
  <img class="headerImg" src="./assets/DSC09538-ProPs-darkMode.webp" />
  <div class="controlBtns">
    <button @click="toggleDarkMode"  > 🌓 </button>
    <button @click="toggleUploadMode"> ☁️ </button>
  </div>
  <h1>{{ title }}</h1>

  <!-- 
    <br>
    <input id="registerName" type="text" ref="name" @keyup.enter="registerName">
    <br>
    <button @click.shift="handleClick">click me with shift</button> 
    <div v-if="hearts > 0" class="heartContainer">
      <span v-for="heart in hearts">❤️</span>
    </div>
  -->
  
  <Modal 
        :header="header" 
        :text="text"
        theme="sale"
        @updateCloseMain='postCloseLoggin'
  />

  <upload-media 
      v-if="showUploadMode"
      class="upload-media"
      server="http://localhost:3000/formidable"
      error=""
      v-bind:class="{ 'upload-media': ''}"
  />

  <li v-for="img in imagesLoaded" :key="img.id">
    <ImageExifViewer
      :imageName="img.name"
      :imageSrc="img.src"
      :exifDatas="img.datas"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ExifParser } from "exif-parser";

import Modal from './components/Modal.vue'
import ImageExifViewer from './components/ImageExifViewer.vue'

// https://vuejsexamples.com/vue-3-component-for-multiple-images-upload-with-preview/
import { UploadMedia, UpdateMedia } from 'vue-media-upload';

export default defineComponent({
  name: "App",
  components: { Modal, ImageExifViewer, UploadMedia /*, UpdateMedia*/ },
  data(){
    return{
      title: "Image Toolkit App",
      header: "Manage easly your images",
      text: "Create a catalog, upload your photos and edit them",
      hearts: 0,
      errMessage: 'asd',
      showUploadMode: false,
      imagesLoaded: [
        { name: 'Passo Sella', src: require('./assets/DSC08174_ps.jpg'), datas:this.requireExifs(), id:0, done: false },
        { name: 'Corvo', src: require('./assets/DSC08271_ps_5x7.jpg'), datas:this.requireExifs(), id:1, done: false },
        { name: 'Tenda', 
          src: require('./assets/DSC08158_ps_5x7.jpg'), 
          datas: this.requireExifs(),
          id:2,
          done: false }
      ]
    }
  },
  methods: {
    handleClick(){
      let refName:any = this.$refs.name
      refName.classList.add('active')
      refName.focus()
      this.hearts++
    },
    postCloseLoggin(){ console.log("postCloseLoggin()\t\n azione modal")},
    registerName(){ 
      const input = this.$refs.name as HTMLInputElement | null;
      console.log( input != null ? input.value : "Catalog name missing" )
    },
    toggleDarkMode(){
      document.body.classList.toggle('darkMode')
      console.log("toggleDark mode")
    },
    toggleUploadMode(){
      this.showUploadMode = ! this.showUploadMode;
    },
    requireExifs(){
      return [
              { label:'ImageWidth', val: '4072' }, 
              { label:'ImageHeight', val: '6108' },
              { label:'Software', val: 'Adobe Photoshop 22.1 (Macintosh)' },
              { label:'ModifyDate', val: '2021:05:24 16:07:10' },
              { label:'Copyright', val: 'zabba.lucabazzanella.com' },
              { label:'Aspect ratio', val: '4/5' },
              { label:'gps', val: "/"},
              { label:'classificazione', val: "⭐⭐⭐"},
              { label:'note', val: "..."}
            ]
    }
  },
  mounted() {
    document.addEventListener('DOMContentLoaded', function () {
      console.log("App launched in dark mode")
      document.body.classList.toggle('darkMode')

      // DSC09538-ProPs.webp
      const src = './assets/DSC09538-ProPs' 
                      + (document.body.classList.contains('darkMode') ? '-darkMode':'') + '.webp';
      //document.getElementsByClassName('headerImg')[0].setAttribute('src',require(src));
    });
}
});
</script>

<style>
/** questo è globale */
/*.darkMode > .darkModeBtn::before{ content: 'asdf' } */
.darkMode{
    --backgroundColor: #111;
    --mainText: #fff;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1{
  border-bottom: 1px solid #aaa;
  display: inline-block;
  padding-bottom: 10ox;
  padding: 1rem;
  color: white; 
  background: 10rem rgba(0,0,0,.4);
  border-radius: .5rem;
}
.headerImg{ 
  z-index: -1;
  position: fixed;
  left:0;
  top: 0;
  height: 30vh;
  width: 100%;
  object-fit: cover;
  /*mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);*/
}
/*.darkMode > .headerImg{ filter:invert(0.5) } */
.heartContainer{ padding: 1rem }
.upload-media{
  margin-left:10%;
  width: 80%;
  height: 100%;
  margin-top: 5%;
  /*background: var(--backgroundColor);*/
}

.controlBtns{
  position: absolute;
  top: 0.2rem;
  right: 3.5rem;
}
.controlBtns > button{
  border: none;
  background: transparent;
  font-size: 1.7rem;
  cursor: grab;
}

li{ list-style-type: none }
</style>
