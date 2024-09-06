<template>
  <div>
   
    <p>{{ cidData }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const cidData = ref(null);

    onMounted(() => {
      const data = route.query.data;
      if (typeof data === 'string') {
        cidData.value = JSON.parse(data);
      } else if (Array.isArray(data)) {
        cidData.value = JSON.parse(JSON.stringify(data));
      }
    });

    return {
      cidData,
    };
  }
});
</script>
