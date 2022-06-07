<template>
  <div class="backdrop" @v-click-away="closeModal">
    <div class="modal" :class="{ sale: theme === 'sale' }">
      <!-- <button class="altoDxBtn" @click="closeModal">❌</button> -->
      <span>Tutorial</span><button @click="closeModal">❌</button>
      <h1>{{ header }}</h1>
      <p>{{ text }}</p>
    </div>
  </div>
  <!--
        <div v-else>
            <button class="altoDxBtn" @click="closeModal">ℹ️</button>
        </div>
    -->
</template>
<script>
export default {
  props: ["header", "text", "theme"],
  data() {
    return {
      //isShowed: false
    };
  },
  methods: {
    closeModal(event) {
      ///this.isShowed = ! this.isShowed
      console.log("closeModal");
      this.$emit("updateCloseMain");
    },
  },
};
</script>
<style scoped>
/** scoped permette di avere solo lo stile applicato 
                al componente/templates e non globale*/
.backdrop {
  z-index: 2;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100%;
}
.modal {
  width: 200px;
  padding: 20px;
  margin: 40vh auto;
  background: white;
  border-radius: 1rem;
  overflow: visible;
}
.modal > span {
  margin-top: 1.5rem;
  font-size: 1.5rem;
}
.modal > button {
  font-size: 1rem;
  background: transparent;
  border: none;
  float: right;
  cursor: grabbing;
}
/*button{
    position: absolute;
    top: 0;
    right: 0;
    float: right;
    text-align: top;
    font-size: 2rem;
    background: transparent;
    border: none;
}

button:hover{ cursor: pointer }*/

.modal.sale {
  background: #222;
  color: white;
}
.modal.sale h1 {
  color: white;
}
</style>
