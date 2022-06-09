<template>
  <div v-if="utente" class="loginForm">
    <span><h2>{{utente.nome}}</h2> {{utente.email}} </span>
    <ul>
      <h4>Cataloghi</h4>
      <li v-for="cat in utente.listaCataloghi" :key="cat.getCurrentId()">
        <b>Titolo:</b> {{cat.titolo}} <span v-if="utente.isCurrentCatalog(cat.getCurrentId())"> 👈 </span>
      </li>
    </ul>
    <button @click="logOut(utente)">🚪 Log Out</button>
  </div>
  <div v-else class="loginForm">
    <input type="text" v-model.lazy="userName" placeholder="Username..." /><br />
    <input type="text" v-model.lazy="email" placeholder="Email..." /><br />
    <input type="text" v-model.lazy="passWord" placeholder="Password..." /><br />
    <input type="checkbox" id="checkbox" v-model="keepLogIn" />
    <label for="checkbox">Keep me logged</label><br />
    <button class="altoDxBtn" @click="logIn()">Log In!</button>
  </div>
</template>
<script lang="ts">
//import { ref } from 'vue'
import Utente from '@/types/Utente';
import Catalogo from '@/types/Catalogo';

import EventEmitter from "events";
const eventEmitter = new EventEmitter();
eventEmitter.on("userHasLoggedOut", (user: Utente) => {
  console.log("userHasLoggedOut 🌓 ");
})

export default {
  props: {
    utente: {
      type: Utente,
      require: false
    }
  },
  setup(props){
    const eventEmitter = new EventEmitter();
    
    let utente: any | Utente
    if( props.utente ) utente = props.utente

    let userName = ""
    let email = ""
    let passWord = ""
    let keepLogIn = true

    //let utenteRef = props.utente ? ref<Utente>(props.utente) : ref<Utente>();

    function logIn() {
        console.log(`${userName} ${email} try to log in with psw: ${passWord}, keep logged: ${keepLogIn ? "yes" : "no"}`);
        let newUser = new Utente(userName,passWord, new Array<Catalogo>())
        //newUser.setKeepLogin(keepLogIn)
        eventEmitter.emit("userHasLoggedSuccesful()", newUser);
    }

    function logOut(_utente){
        console.log(`logOut( ${utente.nome} )`)
        // props è readOnly!
        eventEmitter.emit("userHasLoggedOut()", _utente);
        _utente = undefined;
    } 

    return{ /*utenteRef,*/ utente, userName, email, passWord, keepLogIn, logIn, logOut }
  }
};
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
.loginForm > span{ border-bottom: 1px solid gray }
.loginForm > span > h2 { display: inline-block; margin-right: 1rem; }
.loginForm > input {
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
}
.loginForm > button {
  padding: 1rem 25%;
  background: rgba(0, 0, 0, 0.2);
  color: var(--mainText);
  border-radius: .3rem;
}

.loginForm > ul > li > b { float: left }
.loginForm > ul > li { text-align: right; margin: 1rem 0; }
.loginForm > ul > li:last-child{ margin-bottom: 3rem }
</style>

  <!-- <br>
        <input id="registerName" type="text" ref="name" @keyup.enter="registerName"><br>
        <button @click.shift="handleClick">click me with shift</button> 
        <div v-if="hearts > 0" class="heartContainer">
            <span v-for="heart in hearts">❤️</span>
        </div>
    -->