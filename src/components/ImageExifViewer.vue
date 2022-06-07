<template>
  <div class="mainViewer">
    <!-- https://quasar.dev/vue-components/img#example--native-lazy-loading -->
    <img
      :src="imageSrc"
      :class="class"
      :id="'img_' + id"
      :alt="imageName"
      @error="imageLoadError"
      @click="openEditorImage"
    />

    <span>
      {{ imageTitle }}<button @click="reqEdit">🖊️</button><br />
      <li v-for="ex in exifDatas">
        <b>{{ ex.label }}</b> {{ ex.val }}
      </li>
    </span>
  </div>
</template>
<script>
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists
export default {
  //props: [ 'imageName','imageSrc','exifDatas'],
  props: {
    imageSrc: {},
    imageName: {},
    imageTitle: {},
    exifDatas: {},
    class: {},
    id: {},
  },
  data() {
    return {
      isShowed: false,
      isEditing: false,
    };
  },
  methods: {
    aspect_ratioZab(width, height) {
      aspect_ratio(width / height, 50);
    },
    aspect_ratio(val, lim) {
      // ritorna array coppia    [ 16, 9 ]
      var lower = [0, 1];
      var upper = [1, 0];
      while (true) {
        var mediant = [lower[0] + upper[0], lower[1] + upper[1]];

        if (val * mediant[1] > mediant[0]) {
          if (lim < mediant[1]) {
            return upper;
          }
          lower = mediant;
        } else if (val * mediant[1] == mediant[0]) {
          if (lim >= mediant[1]) {
            return mediant;
          }
          if (lower[1] < upper[1]) {
            return lower;
          }
          return upper;
        } else {
          if (lim < mediant[1]) {
            return lower;
          }
          upper = mediant;
        }
      }
    },
    reqEdit() {
      console.log("reqEdit()");
    },
    openEditorImage() {
      console.log("open editor");
    },
  },
};
</script>

<style>
.mainViewer {
  margin: 5%; /*margin-left: 5%; margin-top: 5%;*/
  width: 90%;
  min-width: 550px;
  max-width: 1200px;
  height: 30vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border-radius: 0.8rem;
  display: flex;
}
.mainViewer > img {
  flex: 50%;
  float: left;
  margin: 1rem;
  border-radius: 0.5rem;
  object-fit: cover;
  max-width: max(
    50%,
    300px
  ); /* set the max-width of img to whichever value is largest, 50% or 300px: */
}
.mainViewer > img:hover {
  cursor: move;
  margin: 0.4rem;
  transition: 0.2s;
}
/*.mainViewer > img[data-src]{ opacity: 1 }*/
.mainViewer > span {
  flex: 50%;
  margin: 1rem;
  overflow: hidden;
  overflow-y: scroll;
}
.mainViewer > span::first-line {
  line-height: 2rem;
  font-weight: bolder;
  margin: 2rem 0;
}
.mainViewer > span > li {
  list-style-type: none;
  text-align: left;
}
.mainViewer > span > button {
  background: transparent;
  border: none;
  cursor: crosshair;
}

.loading {
  mix-blend-mode: multiply;
  mask-image: linear-gradient(black, transparent);
  mask-mode: luminance;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
