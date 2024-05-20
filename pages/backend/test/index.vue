<!-- Search.vue -->
<template>
  <div>
    <v-form>
      <v-text-field
        v-model="searchQuery1"
        label="Search Query 1"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="searchQuery2"
        label="Search Query 2"
        class="mb-4"
      ></v-text-field>
      <v-btn @click="performSearch" class="mb-4">Search</v-btn>
    </v-form>

    <v-row v-if="filteredItems.length > 0">
      <v-col
        v-for="(item, index) in filteredItems"
        :key="index"
        cols="12"
        md="6"
        class="h"
      >
        <nuxt-link :to="`/details/${item.id}`" style="text-decoration: none">
          <v-card
            height="200px"
            class="d-flex align-center justify-center border hovering-zoom"
          >
            {{ item.title }}
          </v-card>
        </nuxt-link>
      </v-col>
    </v-row>

    <p v-else>No information found....</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { useHead } from '@nuxtjs/composition-api';

interface Item {
  id: number;
  title: string;
  number1: string;
  number2: string;
}

const items: Item[] = [
  { id: 1, title: "Item 1", number1: "123", number2: "456" },
  { id: 2, title: "Item 2", number1: "789", number2: "012" },
  { id: 3, title: "Item 3", number1: "345", number2: "678" },
  { id: 4, title: "Item 4", number1: "901", number2: "234" },
];

const searchQuery1 = ref("");
const searchQuery2 = ref("");
const filteredItems = ref<Item[]>(items);

const performSearch = () => {
  const query1 = searchQuery1.value.trim();
  const query2 = searchQuery2.value.trim();

  filteredItems.value = items.filter(
    (item) => item.number1.includes(query1) && item.number2.includes(query2)
  );
};

useHead({
  title: "Search",
  meta: [
    {
      name: "description",
      content: "Search Page",
    },
    {
      name: "keywords",
      content: "Search, Nuxt.js, TypeScript",
    },
  ],
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
