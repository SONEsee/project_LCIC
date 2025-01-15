<template>
  <div>
    <h1>Report Details</h1>
    <p><strong>Enterprise ID:</strong> {{ enterpriseID }}</p>
    <p><strong>LCIC ID:</strong> {{ lcicID }}</p>
    <p><strong>Catalog ID:</strong> {{ catalogID }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const enterpriseID = ref<string | null>(null);
    const lcicID = ref<string | null>(null);
    const catalogID = ref<string | null>(null);

    onMounted(() => {
      enterpriseID.value = route.query.EnterpriseID as string;
      lcicID.value = route.query.LCICID as string;
      catalogID.value = route.query.CatalogID as string;
    });

    return {
      enterpriseID,
      lcicID,
      catalogID,
    };
  },
});
</script>