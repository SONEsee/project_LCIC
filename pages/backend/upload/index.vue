<template>
  <v-card>
    <v-col cols="12"> </v-col>

    <div>
      <UploadFile />
    </div>
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { Icon, UploadFile } from "~~/.nuxt/components";

export default defineComponent({
  setup() {
    definePageMeta({
      layout: "backend",
    });

    useHead({
      title: "Upload File",
      meta: [
        { name: "keywords", content: "Report, Nuxt 3, Backend" },
        {
          name: "Description",
          content: "Report Nuxt 3, IT Genius Engineering",
        },
      ],
    });
  },
});
</script>
