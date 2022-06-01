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
<style>
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
.altoDxBtn{
    position: absolute;
    top: 0;
    right: 0;
    float: right;
    text-align: top;
    font-size: 2rem;
    background: transparent;
    border: none;
}

.altoDxBtn:hover{ cursor: pointer }
</style>