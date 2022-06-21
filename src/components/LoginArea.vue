<template>
  <div class="loginForm">
    <h2>{{utente.nome}}</h2><span>{{utente.email}}</span>
    <ul v-if="cataloghiLoaded">
      <h4>Catalogs</h4>
      <li v-for="cat in utente.listaCataloghi" :key="cat.cid" :imageCount="cat.listaImmagini.length"
                   @click="change_catalog(cat.cid)" :class="props.utente.selected_cid === cat.cid && 'selezionato'">
        <b>Titolo:</b> {{cat.titolo}}
      </li>
      <em v-if=" ! utente.listaCataloghi.length">Empty list: please add a new catalog! </em>
      <input type="text" @keyup.enter="addNewCatalogo" placeholder="➕ Enter a new catalog"/>
    </ul>
    <button @click="signOut">🚪 Log out</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Utente from '@/types/Utente'
import Catalogo from '@/types/Catalogo'
import { useAuth } from '@/firebase'
import { addCatalogo2 } from '@/types/FirebaseModel'

const props = defineProps({       utente: { type: Utente, required: true }   })
const emits = defineEmits(['change_catalog','notificate', 'add_catalog'])
const { signOut } = useAuth()

console.log('LoginArea.setup()')

let cataloghiLoaded = ref(true) // occorre per 'forzare' il reload della lista utent
const forceReloadCataloghi = () => { cataloghiLoaded.value = false; setTimeout( ()=>{ cataloghiLoaded.value = true },0) }

const addNewCatalogo = (e) =>{
  if( e.target.value == '' ) return
  let newCatalogo = new Catalogo(props.utente.nome, e.target.value)
  e.target.value = ''
  props.utente.listaCataloghi.push(newCatalogo)
  addCatalogo2(newCatalogo, props.utente.uid)
    .then( ()=>{ emits('add_catalog', newCatalogo) })
}

function change_catalog(cid){
  emits('change_catalog', cid)
  forceReloadCataloghi()
}
</script>

<style>
.loginForm {
  display: block;
  box-shadow: 10px 20px 30px black;
  border-radius: 0.5rem;
  width: min(50%, 650px);
  margin: 0 auto;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
}
.loginForm > h2 { display: inline-block; margin-right: 1rem; }
.loginForm > span{ border-bottom: 1px solid gray }
.loginForm > ul { padding:0 }
.loginForm > ul > input[type=text] {
  padding: 1.1rem;
  color: var(--mainText);
  border-radius: .3rem;
  border-style: groove;
  background-color: transparent;
  margin: 1rem auto;
}
.loginForm > button > img { width: 1.5rem; margin-right: .8rem; vertical-align:middle; }
.loginForm > button {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  color: var(--mainText);
  border-radius: .4em;
  display: inline-block;
  width: 40%;
  margin: .5rem;
}
.loginForm > ul > li { text-align: right; padding: .9rem 0 .4rem; margin: 1.5rem 0; border-radius: .5rem; }
.loginForm > ul > .selezionato { background-color: rgba(var(--backgroundColor), .2) }
.loginForm > ul > li::after { 
  content: attr(imageCount) ' ';
  padding: .3rem;
  background-color: rgba(7,7,7, .4);
  border-radius: 50%;
  font-size: 60%;
  bottom: 0.5rem;
  left: 0.4rem;
  position: relative;
}
.loginForm > ul > li:hover{ text-decoration: underline; } 
.loginForm > ul > li:last-child{ margin-bottom: 3rem }
.loginForm > ul > li > b { float: left }
.loginForm > ul > li:hover { cursor: grab }
.loginForm > ul > em { color: var(--backText) }
</style>




<!-- 
<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import Utente from '@/types/Utente'
import Catalogo from '@/types/Catalogo'

import { useAuth } from '@/firebase'
import { addCatalogo2 } from '@/types/FirebaseModel'

export default defineComponent({
  name: "LoginArea",
  props: {
    utente: {
      type: Utente,
      require: true
    }
  },
  setup(props){
    console.log('LoginArea.setup()')
    const { signOut } = useAuth()

    // TODO: controllare perchè props.utente può essere undefined
    let utente: Utente = props.utente ? props.utente : new Utente('unkonw') //? props.utente : Utente.getInstance() //new Utente('user.name','',null);
    /*const form = reactive({name:'',email: '', password: ''})*/

    const addNewCatalogo = (e)=>{
        console.log('LoginArea.addNewCatalogo() \n', e.target.value)
        addCatalogo2(new Catalogo(utente.nome, e.target.value), utente.uid)
    }

    function changeSelectedCatalog(e){
      console.log('changeSelectedCatalog() ', e)
      let newSelectedCatalog = 99
      utente.setCurrentCatalog(newSelectedCatalog)
    }

    return{ addNewCatalogo, utente, signOut, changeSelectedCatalog }
  }
})
</script>
-->



<!--  

<br>
<input id="registerName" type="text" ref="name" @keyup.enter="registerName"><br>
<button @click.shift="handleClick">click me with shift</button> 
<div v-if="hearts > 0" class="heartContainer">
    <span v-for="heart in hearts">❤️</span>
</div>


//let utente: Utente | any
//if( props.utente ) 
//  utente = props.utente
//else 
//  utente = new Utente('','',[])    

-->





<!-- 
.loginForm > input {
  margin: 1rem 4rem;
  width: min(80%, 200px);
  background-color: transparent;
}

.loginForm > input[type=checkbox] {
  width: 1rem;
  margin-right: 1rem;
}
-->