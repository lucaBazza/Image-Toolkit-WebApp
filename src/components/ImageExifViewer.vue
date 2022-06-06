<template>
    <div class="mainViewer">

        <!-- https://quasar.dev/vue-components/img#example--native-lazy-loading -->
        <img :src="imageSrc" :class="class" :id="'img_'+id" :alt="imageName" @error="imageLoadError"/>
        
        <span>
            Exif datas <button @click="reqEdit">🖊️</button>  {{imageTitle}}
            <li v-for="ex in exifDatas">
                    <b>{{ex.label}}</b> {{ex.val}}
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
        id: {}
    },
    data(){
        return{ 
            isShowed: false,
            isEditing: false
        }
    },
    methods: {
        aspect_ratioZab(width,height){ aspect_ratio(width/height, 50) },
        aspect_ratio(val, lim) { // ritorna array coppia    [ 16, 9 ]
            var lower = [0, 1];
            var upper = [1, 0];
            while (true) {
                var mediant = [lower[0] + upper[0], lower[1] + upper[1]];

                if (val * mediant[1] > mediant[0]) {
                    if (lim < mediant[1]) { return upper; }
                    lower = mediant;
                } else if (val * mediant[1] == mediant[0]) {
                    if (lim >= mediant[1]) {
                        return mediant;
                    }
                    if (lower[1] < upper[1]) { return lower; }
                    return upper;
                } else {
                    if (lim < mediant[1]) { return lower; }
                    upper = mediant;
                }
            }
        },
        reqEdit(){
            console.log('reqEdit()');
        }
    }
  }
</script>

<style>
.mainViewer{
    margin: 5%; /*margin-left: 5%; margin-top: 5%;*/
    width: 90%;
    height: 30vh;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 10s ease infinite;
    border-radius: .8rem;
	/*height: 100vh;*/
    display: flex;
}
.mainViewer > img{
    flex: 50%;
    float: left;
    margin: 1rem;
    border-radius: .5rem;
    object-fit: cover;
    /*width: ;
    /*height: 80%; */
}
/*.mainViewer > img[data-src]{ opacity: 1 }*/

.mainViewer > span > button{ background: transparent; border: none; cursor: crosshair;}

.mainViewer > span{
    flex: 50%;
    margin: 1rem;
}
.mainViewer > span::first-line{ line-height: 2rem; font-weight: bolder; }
.mainViewer > span > li{
    list-style-type: none;
    text-align: left;
}

.loading{
    mix-blend-mode: multiply;
    mask-image: linear-gradient(black, transparent);
    mask-mode: luminance;
}

@keyframes gradient {
	0% { background-position: 0% 50% }
	50% { background-position: 100% 50% }
	100% { background-position: 0% 50% }
}

</style>