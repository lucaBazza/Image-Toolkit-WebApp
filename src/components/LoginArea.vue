<template>
    <div class="loginForm">
        <input v-model.lazy="userName" placeholder="Username..." /><br>
        <input v-model.lazy="email" placeholder="Email..." /><br>
        <input v-model.lazy="passWord" placeholder="Password" /><br>
        <input type="checkbox" id="checkbox" v-model="keepLogIn" />
        <label for="checkbox">Keep me logged</label><br>
        <button class="altoDxBtn" @click="logIn">Log In!</button>
    </div>
    <!-- <br>
        <input id="registerName" type="text" ref="name" @keyup.enter="registerName"><br>
        <button @click.shift="handleClick">click me with shift</button> 
        <div v-if="hearts > 0" class="heartContainer">
            <span v-for="heart in hearts">❤️</span>
        </div>
    -->
</template>
<script>
  export default {
    ///props: [ 'header','text','theme'],
    data(){
        return{ 
            isShowed: false,
            userName: '',
            email: '',
            passWord: '',
            keepLogIn: true
        }
    },
    methods: {
        handleClick(){  // NON USATO, demo refs
            let refName = this.$refs.name
            refName.classList.add('active')
            refName.focus()
            this.hearts++
        },
        //closeModal () { 
        //    this.isShowed = ! this.isShowed
        //    //this.$emit('updateCloseMain')
        //}
        logIn(){
            console.log(`${this.userName} ${this.email} try to log in with psw: ${this.passWord}, keep logged: ${this.keepLogIn?'yes':'no'}`)
            this.$emit('userHasLoggedSuccesful()',this.userName)
        }
    }
  }
</script>
<style>
.loginForm{
    /*width: 40rem;*/
    display: block;
    background-color: #333; /*var(--background_mod);*/
    color: var(--mainText);
    box-shadow: 10px 20px 30px black;
    border-radius: .5rem;
    width: min(50%, 650px);
    margin-left: 25%;
    padding: 1.5rem;
}
.loginForm > input{
    margin: .5rem;
    padding: .4rem;
    width: min(80%, 200px);
    background-color: transparent;
}
.loginForm > input[type=checkbox]{ width: .8rem /*box-shadow: inset 1em 1em #ddd;*/ }

.loginForm > button{ padding: 1rem 25% }

</style>