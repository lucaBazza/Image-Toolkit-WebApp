<template>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp"/>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ExifParser } from "exif-parser";

import Modal from './components/Modal.vue'


export default defineComponent({
  name: "App",
  components: { Modal },
  data(){
    return{
      title: "My first image toolkit app",
      header: "Sign up for the giveaway!",
      text: "Grab your ninka swa for half price",
      hearts: 0
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
    }
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
}
.heartContainer{ padding: 1rem }
</style>
