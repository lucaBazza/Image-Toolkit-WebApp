<template>
  <div class="loginForm" v-if="utente">
    <h2>{{utente.nome}}</h2><span>{{utente.email}}</span>
    <transition-group tag="ul" name="list"> <!-- <transition-group v-if="cataloghiLoaded" tag="ul" name="list"> -->
      <h4 key="title">Catalogs</h4>
      <li v-for="cat in utente.listaCataloghi" :key="cat.cid" :imageCount="cat.listaImmagini.length"
                   @click="change_catalog(cat.cid)" :class="utente.selected_cid === cat.cid && 'selezionato'">
        <b>Title:</b> {{cat.titolo}}
      </li>
      <em v-if=" ! utente.listaCataloghi.length" key="emptyList">Empty list: please add a new catalog! <br></em>
      <input type="text" @keyup.enter="addNewCatalogo" placeholder="➕ Enter a new catalog" key="inputCatalogs"/>
    </transition-group>
  </div>
  <span v-else>No user logged</span>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Utente from '@/types/Utente'
import Catalogo from '@/types/Catalogo'
import { addCatalogo3, updateUser } from '@/types/FirebaseModel'
import { notify } from '@kyvg/vue3-notification'

let utente = reactive(Utente.getInstance())

const emits = defineEmits(['change_catalog','notificate'/* , 'add_catalog' */])

/**
 *  - creo un catalogo localmente e cancello l'input text
 *  - aggiorno la gui TODO controllare props push non va
 *  - aggiorno catalogo su firebase, se va bene aggiorno il componente padre
 *    TODO: mettere limite per userplan di cataloghi
 */
const addNewCatalogo = (e) =>{
  if( e.target.value == '' || ! utente ) return

  let cat = new Catalogo(utente.nome, e.target.value).setCatalogUserID(utente.uid)
  e.target.value = ''

  addCatalogo3(cat)
    .then( res_cid => {
        utente.listaCataloghi.push(cat)   // console.log('Lista cataloghi aggiornata: ', utente.listaCataloghi.map(c=>c.titolo).join(','))
        updateUser(utente.setSelected_cid(res_cid))
          .then( ()=> notify({ title: "Catalog added", text: cat.titolo, type: 'info' }) )
    })
    .catch( err => emits('notificate',{ title: 'Error', text: `${cat.titolo} \n ${err}`, type: 'error' }))
  
}

function change_catalog(cid){ 
  updateUser( utente.setSelected_cid(cid) )
}
</script>

<style>
.loginForm {
  display: block;
  box-shadow: var(--boxShadowCorto);
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
.loginForm > ul > input[type=text]::placeholder{ color: gray; opacity: 1; /* Firefox */ }
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