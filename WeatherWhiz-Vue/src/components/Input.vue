<template>
<p style="color:white; display: flex; justify-content: center; flex-direction: row;">Hello, {{ store.username }} {{ (store.username == "Vlad")? 'Welcome' : '' }}</p>
</template>

<script>
import { store } from '../storage.js'; 


export default {
    name: 'Input',
    data() {
        return {
            store
        }
    },

}
</script>