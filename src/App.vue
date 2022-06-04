<template>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp"/>
  <button class="darkModeBtn" @click="toggleDarkMode"> 🌓 </button>
  <h1>{{ title }}</h1>
  <br>
  <input id="registerName" type="text" ref="name" @keyup.enter="registerName">
  <br>
  <button @click.shift="handleClick">click me with shift</button>
  <div v-if="hearts > 0" class="heartContainer">
    <span v-for="heart in hearts">❤️</span>
  </div>
  
  <Modal 
        :header="header" 
        :text="text"
        theme="sale"
        @updateCloseMain='postCloseLoggin'
  />

  <upload-media 
      class="upload-media"
      server="http://localhost:3000/formidable"
      error="">
  </upload-media>

  <ImageExifViewer />
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
      title: "My first image toolkit app",
      header: "Sign up for the giveaway!",
      text: "Grab your ninka swa for half price",
      hearts: 0,
      errMessage: 'asd'
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
    }
  },
  mounted() {
    document.addEventListener('DOMContentLoaded', function () {
      console.log("App launched in dark mode")
      document.body.classList.toggle('darkMode')
    });
}
});
</script>

<style>
/** questo è globale */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1{
  border-bottom: 1px solid #ddd;
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
  height: 100%;
  margin-top: 20%;
  background: var(--backgroundColor);
}
.darkModeBtn{
  border: none;
  background: transparent;
  position: absolute;
  top: 0.2rem;
  right: 3.5rem;
  font-size: 1.7rem;
  cursor: grab;
}
/*.darkMode > .darkModeBtn::before{ content: 'asdf' } */
.darkMode{
    --backgroundColor: #111;
    --mainText: #fff;
}
</style>
