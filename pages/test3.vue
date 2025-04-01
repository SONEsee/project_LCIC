<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <p>ຈຳນວນລາຍການ: {{ itemCount }}</p>
    <p>ອັບໂຫຼດ: {{ uploadPercent }}%</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const itemCount = ref(0);
    const uploadPercent = ref(0);

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const jsonData = JSON.parse(e.target?.result as string);
          console.log(jsonData);
          itemCount.value = Array.isArray(jsonData) ? jsonData.length : 0;
          uploadPercent.value = 100; 
        };
        reader.readAsText(file);
      }
    };

    return { itemCount, uploadPercent, handleFileUpload };
  },
});
</script>