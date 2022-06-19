<template>
    <div class="avatar">
        <img :src="photoURL">
        <span>{{nomeShorted}}</span>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    nome: {     type: String, default: 'Unknown' },
    photoURL: { type: String, default: require('@/assets/loading-io-spinner.gif') }
})

const nameOnly = (nomeCompleto:string) => { return nomeCompleto.includes(' ') ? nomeCompleto.split(' ')[0] : '' }

let nomeShorted = nameOnly( props.nome )
let photoURL = props.photoURL

</script>

<style>
.avatar{
  position: absolute;
  top: 0; 
  left: 0; 
  color: var(--mainText);
  border-radius: 0.5rem;
  width: max(25%, 120px);
  padding: .5rem;
  margin: .5rem;
  box-shadow: 10px 20px 30px rgba(0,0,0,.4);
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
</style>

