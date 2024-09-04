<template>
  <button @click="IsSet=!IsSet" class="GoodDay">  {{ IsSet ? 'Push me' : prop1 }}</button>  
  <!-- HW задание 4 VUE -->
</template>



<script>
  export default {
    name: 'ButtonChange',
    props: {
      prop1: String,
    },

    data() {
      return {
        IsSet: true
      }
    }
  }
  

</script>



<style>
.GoodDay {
  
 height: 50px;
 width: 100px;
}
</style>