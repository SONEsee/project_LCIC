<template>
  <div>
    test
  </div>
<<<<<<< HEAD
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  setup() {
    const products = ref<any[]>([]);

    const fetchProducts = async (code: string) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:35729/api/productinfo2/?code=${code}`
        );
        const data = await response.json();
        products.value = data;
      } catch (error) {
        console.error("Error fetching product info:", error);
      }
    };

    onMounted(() => {
      fetchProducts("p002");
    });

    return {
      products,
    };
  },
});
</script>
=======
</template>
>>>>>>> 8b48fd2a1696bc13a6659c284560aa69db42d491
