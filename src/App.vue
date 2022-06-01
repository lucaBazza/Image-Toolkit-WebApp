<template>
  <h1>{{ title }}</h1>
  <img class="headerImg" src="./assets/DSC09538-ProPs.webp"/>
  <input type="text" ref="name">
  <br>
  <button @click="handleClick">click me</button>
  <Modal />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Modal from './components/Modal.vue'
//import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  name: "App",
  components: { Modal },
  data(){
    return{
      title: "My first image toolkit app"
    }
  },
  methods: {
    handleClick(){
      console.log(this.$refs.name)
      let refName:any = this.$refs.name
      refName.classList.add('active')
      refName.focus();
    }
  }
  //components: {
  //    HelloWorld,
  //},
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
</style>
