<template>
  <div class="loginForm">
    <h2>{{utente.nome}}</h2><span>{{utente.email}}</span>
    <ul v-if="cataloghiLoaded">
      <h4>Catalogs</h4>
      <li v-for="cat in utente.listaCataloghi" :key="cat.cid" :imageCount="cat.listaImmagini.length"
                   @click="change_catalog(cat.cid)" :class="props.utente.selected_cid === cat.cid && 'selezionato'">
        <b>Title:</b> {{cat.titolo}}
      </li>
      <em v-if=" ! utente.listaCataloghi.length">Empty list: please add a new catalog! <br></em>
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
import { addCatalogo3 } from '@/types/FirebaseModel'
import { serverTimestamp } from '@firebase/firestore'

const props = defineProps({       utente: { type: Utente, required: true }   })
const emits = defineEmits(['change_catalog','notificate', 'add_catalog'])
const { signOut } = useAuth()

console.log('LoginArea.setup()')

let cataloghiLoaded = ref(true)   // serve per 'forzare' il reload della lista utenti, perchè la key non è reactive (?!)
const forceReloadCataloghi = () => { cataloghiLoaded.value = false; setTimeout( ()=>{ cataloghiLoaded.value = true }, 500) }

/**
 *  - creo un catalogo localmente e cancello l'input text
 *  - aggiorno la gui TODO controllare props push non va
 *  - aggiorno catalogo su firebase, se va bene aggiorno il componente padre
 */
const addNewCatalogo = (e) =>{
  if( e.target.value == '' ) return
  addCatalogo3(new Catalogo(props.utente.nome, e.target.value).setCatalogUserID(props.utente.uid))
    .then( res_cid => emits('add_catalog', res_cid) )
    .catch( ex => emits('notificate',ex))
  e.target.value = ''
}

function change_catalog(cid){ 
  forceReloadCataloghi()
  emits('change_catalog', cid)
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
.loginForm > ul > li { text-align: right; padding: .9rem .2rem .5rem; margin: 1.5rem 0; border-radius: .5rem; }
.loginForm > ul > .selezionato { padding: 0.8rem; background-color: rgba(var(--backgroundColor), .3) }
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