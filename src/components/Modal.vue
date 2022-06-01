<template>
    <div v-if="isShowed" class="backdrop">
        <div class="modal">
            <button class="altoDxBtn" @click="closeModal">❌</button>
            <p>modal content</p>
        </div>
    </div>
    <div v-else>
        <button class="altoDxBtn" @click="closeModal">ℹ️</button>
    </div>
</template>
<script>
  export default {
    data(){
        return{
            isShowed: false
        }
    },
    methods: {
      closeModal () {
        this.isShowed = ! this.isShowed;
      }
    }
  }
</script>
<style scoped>
/** scoped permette di avere solo lo stile applicato al componente/templates e non globale*/
.backdrop{
    z-index:2;
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0,0,0,.5);
    width: 100vw;
    height: 100%;
}
.modal{
    width: 200px;
    padding: 20px;
    margin: 40vh auto;
    background: white;
    border-radius: 1rem;
    overflow: visible;
}
button{
    position: absolute;
    top: 0;
    right: 0;
    float: right;
    text-align: top;
    font-size: 2rem;
    background: transparent;
    border: none;
}

button:hover{ cursor: pointer }
</style>