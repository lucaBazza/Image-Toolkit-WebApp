<template>
    <div class="avatar">
        <img :src="photoURL" @error="imageLoadError" @click="emits('showSettings')">
        <span @click="emits('showSettings')">{{nomeShorted}}</span>
        <button @click="emits('logout')"> 🚪 </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  nome: {     type: String, default: 'Unknown' },
  photoURL: { type: String, default: require('@/assets/logo-user-abstract.svg') }
})

const emits = defineEmits(['showSettings','logout'])

function imageLoadError(){ photoURL.value = require('@/assets/logo-user-abstract.svg') }

const nameOnly = (nomeCompleto:string) => { return nomeCompleto.includes(' ') ? nomeCompleto.split(' ')[0] : '' }

let nomeShorted = nameOnly( props.nome )
let photoURL = ref(props.photoURL)

</script>

<style>
.avatar{
  position: absolute;
  top: 0; 
  left: 0; 
  color: var(--mainText);
  border-radius: 0.5rem;
  width: max(15%, 120px);
  padding: .5rem;
  margin: .5rem;
  box-shadow: var(--boxShadowCorto);
  backdrop-filter: blur(5px);
}
.avatar:hover{ cursor: grab }
.avatar > img {
  border-radius: 50%;
  width: 2rem;
  margin-right: .6rem;
  float: left;
}
.avatar > span{ float: left; margin-top: 0.3rem; }
.avatar > button {
  opacity: .01;
  background-color: transparent;
  text-shadow: 0 0 20px rgba(0,0,0,.9);
  border-radius: 50%;
  padding: .4rem;
  border: none; 
  position: absolute;
  top: .3rem;
  right: -3rem;
  font-size: 1.5rem;
}
.avatar:hover > button{ opacity: 1; transition: .2s ease; }
.avatar > button:hover{ cursor: not-allowed }
</style>

