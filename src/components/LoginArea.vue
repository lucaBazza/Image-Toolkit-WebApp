<template>
  <div class="loginForm">
    <h2>{{utente.nome}}</h2><span>{{utente.email}}</span>
    <ul>
      <h4>Cataloghi <button @click="addNewCatalogo">+</button></h4>
      <li v-for="cat in utente.listaCataloghi" :key="cat.id">
        <b>Titolo:</b> {{cat.titolo}} <span v-if="utente.isCurrentCatalog(cat.id)"> 👈 </span>
      </li>
      <span v-if=" ! utente.listaCataloghi">Empty list: please add a new catalog!</span>
    </ul>
    <button @click="signOut">🚪 Log out</button>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import Utente from '@/types/Utente';
import Catalogo from '@/types/Catalogo';

import { useAuth } from '@/firebase'
import { addCatalogo } from '@/types/FirebaseModel';
import Immagine from '@/types/Immagine';

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

    const addNewCatalogo = ()=>{
        console.log('LoginArea.addNewCatalogo()')        
        addCatalogo(new Catalogo(utente.nome,'New catalog'), utente.uid)
    }

    return{ addNewCatalogo, utente, signOut }
  }
})
</script>

<style>
.loginForm {
  display: block;
  color: var(--mainText);
  box-shadow: 10px 20px 30px black;
  border-radius: 0.5rem;
  width: min(50%, 650px);
  margin: 0 auto;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
}
.loginForm > h2 { display: inline-block; margin-right: 1rem; }
.loginForm > span{ border-bottom: 1px solid gray }

/*.loginForm > input {
  margin: 1rem 4rem;
  width: min(80%, 200px);
  background-color: transparent;
}
.loginForm > input[type=text] {
  padding: 1.1rem;
  color: var(--mainText);
  border-radius: .3rem;
  border-style: groove;
}
.loginForm > input[type=checkbox] {
  width: 1rem;
  margin-right: 1rem;
}*/
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

.loginForm > ul > li { text-align: right; margin: 1rem 0; }
.loginForm > ul > li:hover{ /*border-bottom: 1px gray solid*/ text-decoration: underline; } 
.loginForm > ul > li:last-child{ margin-bottom: 3rem }
.loginForm > ul > li > b { float: left }
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