<template>
    <div class="coverSlide">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<style>
.coverSlide {
  width: max(90%, 250px);
  height: min(50vh, 500px);
  overflow: hidden;
  position: absolute;
  top: 30%;
  left:0;
  right: 0;
  z-index: -1;
  margin-left: auto;
  margin-right: auto;
}
.coverSlide > div {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  opacity: 0;
  animation: slide 25s infinite;
  border-radius: .5rem;  
}
.coverSlide > div:nth-child(1) { background-image: url('@/assets/cover/screen-ipad.webp') }
.coverSlide > div:nth-child(2) { background-image: url('@/assets/cover/screen-edit.webp');       animation-delay: 5s }
.coverSlide > div:nth-child(3) { background-image: url('@/assets/cover/screen-ultrawide.webp');  animation-delay: 10s }
.coverSlide > div:nth-child(4) { background-image: url('@/assets/cover/screen-upload.webp');     animation-delay: 15s }
.coverSlide > div:nth-child(5) { background-image: url('@/assets/cover/screen-user.webp');       animation-delay: 20s }
@keyframes slide {
  10% { opacity: 1 }
  20% { opacity: 1 }
  30% { opacity: 0 }
  40% { transform: scale(1.05); border-radius: .5rem;}
}
</style>