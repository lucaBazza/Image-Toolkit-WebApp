<template>
    <div class="dropAreaDragging">
        <multiple-file-uploader 
            postURL="http://.." 
            successMessagePath="" 
            errorMessagePath="">
        </multiple-file-uploader>
    </div>
</template>
<script>
    // https://www.npmjs.com/package/@updivision/vue2-multi-uploader
    import MultipleFileUploader from '@updivision/vue2-multi-uploader'
    export default {
       /* props: [ 'isEnabled' ],*/
        components: {
            MultipleFileUploader
        },
        data(){
            return{ p: false }
        }
        //,
    }
</script>

<style scoped>
    .dropAreaDragging{
        width: 100%;
        height: 20rem;
        background-color:rgba(204, 204, 204, 0.759);
    }
</style>
