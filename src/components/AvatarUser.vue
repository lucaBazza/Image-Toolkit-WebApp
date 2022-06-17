<template>
    <div class="avatar">
        <img :src="photoURL">
        <span>{{nameOnly(nomeUtente)}}</span>
    </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'

export default defineComponent({
  name: "AvatarUser",
  props: {
    /*utente: {
      type: Utente,
      require: true
    },
    userFS: {
      type: FirebaseUser,
      require: true
    }*/
    /*utente: {
      type: FirebaseUser,
      require: true
    }*/
    nome: { type: String },
    photoURL: { type: String }
  },
  setup(props){
    //console.log( props.utente )
    let nomeUtente = props.nome !

    //console.log('AvatarUser.setup() : ', nomeUtente, props.photoURL)

    const nameOnly = (nomeCompleto:string)=>{
      return nomeCompleto ? nomeCompleto.split(' ')[0] : ''
    }

    return { nameOnly, nomeUtente }
  }
})
</script>

<style>
.avatar{
  position: absolute;
  top: 0; 
  left: 0; 
  color: var(--mainText);
  border-radius: 0.5rem;
  width: max(40%, 120px);
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
  vertical-align: middle;
}
</style>

