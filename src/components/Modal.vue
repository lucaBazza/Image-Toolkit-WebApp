<template>
  <div class="backdrop" @v-click-away="closeModal">
    <div class="modal">
      <span>Informations</span><button @click="closeModal">❌</button><br>
      <h1>Image toolkit App</h1>
      <p>Manage easly your images:</p>
      <ul>
        <li attr="google account">Log In</li>
        <li attr="from the user area">Create catalogs</li>
        <li attr="based on your plan, with the cloud function">Upload your photos</li>
        <li attr="check the sort button">Organize / make diffs</li>
        <li attr="gps, copyright, exifs">Update your metadatas</li>
        <li attr="stylize you photo with our adjustment tools">Edit</li>
        <li attr="Combine adjustments, luts and more recursively on your catalog">Presets 🪄 </li>
        <li attr="Get back your photos locally">Export </li>
      </ul>
      <a @click="openDocumentation" href='mailto:info@lucabazzanella.com?subject=ImageToolkit'>Need more help? 📖</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ["theme"],
  methods: {
    closeModal(event) {
      console.log("closeModal");
      this.$emit("updateCloseMain");
    },
    openDocumentation(){ console.log('openDocumentation()') }
  },
})
</script>

<style>
.backdrop {
  z-index: 2;
  top: 0;
  left: 0;
  position: fixed;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100%;
}
.modal {
  color: var(--mainText);
  padding: 20px;
  margin: 15vh auto;
  border-radius: 1rem;
  overflow: visible;
  box-shadow: 10px 20px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  width: max(40%,280px);
  height: min(70vh, 800px)
}
.modal > p{ border-bottom: 2px solid var(--backText) }
.modal > span { margin-top: 1.5rem; font-size: 1.5rem }
.modal button { font-size: 1rem; background: transparent; border: none; float: right; cursor: grabbing }
.modal > button { transform: translateY(-2rem) translateX(2rem); }
.modal > button:hover{ cursor: grab }
.modal > a{ float: right }
/*.modal.sale { background: var(--background_mod); width: max(40%,280px) }*/

.modal > ul { padding-left: 0; margin:0; text-align: left; height: min(80vh, 600px); overflow-y: scroll; }
.modal > ul > li { padding: .9rem 0 }
.modal > ul > li:hover + .modal > ul > li::after{ animation: fadeIn .3s; background-color: yellow; }
.modal > ul > li::after{ display: grid; margin-left: .8rem; content: attr(attr); animation: fadeIn .3s; color: var(--backText); font-style: italic }

</style>
