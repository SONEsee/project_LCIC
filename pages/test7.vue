<template>
  <v-data-table
    :headers="headers"
    :items="filteredItems"
    item-value="name"
  >
    <template v-slot:top>
      <v-text-field
        v-model="search"
        class="pa-2"
        label="Search in 'CPU Model'"
      ></v-text-field>
    </template>
  </v-data-table>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'SingleColumnSearchTable',
  setup() {
    const search = ref('');
    const items = ref([
      {
        name: 'Intel Core i9-11900K',
        cores: 8,
        threads: 16,
        baseClock: '3.5 GHz',
        boostClock: '5.3 GHz',
        tdp: '125W',
      },
      {
        name: 'AMD Ryzen 9 5950X',
        cores: 16,
        threads: 32,
        baseClock: '3.4 GHz',
        boostClock: '4.9 GHz',
        tdp: '105W',
      },
      
    ]);

    const headers = ref([
      { title: 'CPU Model', align: 'start', key: 'name' },
      { title: 'Cores', align: 'end', key: 'cores' },
      { title: 'Threads', align: 'end', key: 'threads' },
      { title: 'Base Clock', align: 'end', key: 'baseClock' },
      { title: 'Boost Clock', align: 'end', key: 'boostClock' },
      { title: 'TDP (W)', align: 'end', key: 'tdp' },
    ]);

   
    const filteredItems = computed(() =>
      items.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    return {
      search,
      headers,
      items,
      filteredItems,
    };
  },
});
</script>
