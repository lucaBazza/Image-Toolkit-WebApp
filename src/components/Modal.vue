<template>
  <div class="backdrop" @v-click-away="closeModal">
    <div class="modal" :class="{ sale: theme === 'sale' }">
      <!-- <button class="altoDxBtn" @click="closeModal">❌</button> -->
      <span>Tutorial</span><button @click="closeModal">❌</button><br>
      <h1>Image toolkit App</h1>
      <p>Manage easly your images:</p>
      <ul>
        <li>Log In</li>
        <li>Create a catalog</li>
        <li>Upload your photos</li>
        <li>Organize / make diffs</li>
        <li>Check your metadatas</li>
        <li>Edit</li>
        <li>Presets 🪄 </li>
        <li>Export </li>
      </ul>
      <button @click="openDocumentation">Need help? 📖</button>
    </div>
  </div>
  <!--  <div v-else>
            <button class="altoDxBtn" @click="closeModal">ℹ️</button>
        </div> -->
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  props: ["theme"],
  methods: {
    closeModal(event) {
      console.log("closeModal");
      this.$emit("updateCloseMain");
    },
    openDocumentation(){
      console.log('openDocumentation()')
    }
  },
})
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
  padding: 20px;
  margin: 25vh auto 0;
  border-radius: 1rem;
  overflow: visible;
}
.modal > p{ border-bottom: 1px solid rgba(8,8,8,.5) }
.modal > span { margin-top: 1.5rem; font-size: 1.5rem }
.modal > button {
  font-size: 1rem;
  background: transparent;
  border: none;
  float: right;
  cursor: grabbing;
  color: var(--mainText)
}
.modal > button:hover{ cursor: grab }  
.modal > button:last-child{ margin: -2rem auto }  

.modal.sale { background: var(--background_mod);  width: max(40%,280px) }

.modal > ul { margin-left:10%; text-align: left; }
.modal > ul > li{ list-style-type: disclosure-closed; padding: .5rem 0 }

@media screen and ( max-width: 650px ){   
  .modal { margin-top: 5vh }
  .modal > ul > li{ padding: .2rem 0 }
}
</style>
