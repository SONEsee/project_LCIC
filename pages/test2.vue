<script lang = "ts">
import { defineComponent ,ref , onMounted , computed } from 'vue'
export default defineComponent({
  setup() {
    const tab = ref(0)
    const b = ref('b')
    const c = ref('c')

    return {
      b,
      c
    }
  }
})
</script>
<template>
<v-container>
  <v-tabs v-model="tab" fixed-tabs color="primary">
    <v-tab v-model="b"></v-tab>
    <v-tab v-model="c"></v-tab>
  </v-tabs>
  <v-card-text>
    <v-window v-model="tab">
<v-window-item value="b"></v-window-item>
    </v-window>
    <p>test2</p>
  </v-card-text>
</v-container>
</template>
