<template>
<div>
    <form>
        <!-- ex 6 -->
            <label>
              <input v-model="store.username" class="inputName" id="search-vue" placeholder="Enter your username"/>
            </label>
            <Input />
          </form>
          
          
</div>
</template>

<script>
import { store } from '../storage.js'; 
import Input from './Input.vue'; 
export default {
  name: 'Form',
  components: {
    Input
  },
  data() {
    return {
      store  //ex 9
    }
  },
  
}
</script>

<style scoped>
.inputName{
  height: 30px;
  width: 200px;
  border-radius: 5px;
  border: none;
  padding: 5px;
  margin-top: 60px;
}
</style>
