<template>
<div style="display: flex; align-items: center;">
<div class="city-search search-input"> <!-- 6 ex -->
    <Form />
        </div>
  <div>
    <ButtonChange :prop1="push" />
  </div>
</div> 
</template>

<script>
import ButtonChange from "./components/ButtonChange.vue";
import Form from "./components/Form.vue"; // ex 7

export default {
  name: "App",
  components: {
    ButtonChange,
    Form,
  },
  data() {
    return {
      push: "Good Day!",
      username: "",
    };
  },
};
</script>

<style scoped>

</style>
