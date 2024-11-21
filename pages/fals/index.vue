<template>
  <v-container>
    <div class="d-flex justify-end mr-10">
    <v-btn class="bg-blue-darken-4">Export</v-btn>
    </div>
    <v-col cols="12">
      <v-row> </v-row>
    </v-col>
    <v-data-table
      :items="data"
      :headers="headers"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script lang="ts" setup>
 definePageMeta({
  layout: "backend",
});

useHead({
  title: "Collect fees",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Order Nuxt 3,  IT Genius Engineering",
    },
  ],
});
import { ref } from "vue";

const data = ref([
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
  {
    lcicid: "1750",
    enterpriseid: "03000001235",
  },
]);

const headers = ref([
  { title: "LCIC ID", value: "lcicid" },
  { title: "Enterprise ID", value: "enterpriseid" },
]);
</script>

<style scoped></style>
