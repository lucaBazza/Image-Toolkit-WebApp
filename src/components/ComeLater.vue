<template>

  <div class="productionMode productionMode-animation">
    <h2>Site Maintenance</h2>
  </div>
  <div class="productionMode">
        <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment.<br>
        If you need to you can always <a href="mailto:info@lucabazzanella.com">contact us</a>,
        or use our backup service <a href="https://pickit.nasbazza.myds.me/">pickit app</a>
        <br><br>
        otherwise we&rsquo;ll be back online shortly!</p>
  </div> 
</template>

<style>
/*

    P R O D U C T I O N     M O D E     S T Y L E

*/

.productionMode > h2, .productionMode > p {
  border: 2px solid gray;
  background: rgba(var(--backgroundColor),.3);
  border-radius: 1rem;
  padding: 1rem;
  width: max(40%,300px);
  margin: 10% auto;
}
.productionMode > h2::before, .productionMode > h2::after{ content:' 🗣️ '}
.productionMode:hover{
  transform: scale(120%);
  transition: 1s;
  animation: none;
}
.productionMode > p { /* width: min(100%, 500px); margin: 0 auto;  */text-align: justify }

.productionMode-animation{ animation: action .5s infinite  alternate }
@keyframes action {
    0% { transform: translateY(0) }
    100% { transform: translateY(-10px) }
}

</style>