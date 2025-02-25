<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useMemberStore } from "@/stores/Member";

const store = useMemberStore();
const respons = computed(() => store.response_query_data);

onMounted(() => {
  store.Getdata();
  console.log("Response data:", respons.value);
});
</script>

<template>
  <section style="height: 100vh" class="d-flex justify-center align-center">
    
    <v-data-table 
      
      :items="respons" 
      :items-per-page="5" 
      class="elevation-1"
    ></v-data-table>
    {{ respons }}
  </section>
</template>
