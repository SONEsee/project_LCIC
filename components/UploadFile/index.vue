<template>
  <!-- <v-col cols="12">
     
    </v-col> -->
 <h3 class="text-primary ml-3">{{ $t("upload") }}</h3>
  <v-tabs v-model="tab" fixed-tabs color="primary" stacked density="compact">
    <v-tab value="one">{{ $t("loaninformation") }} </v-tab>
    <v-tab value="three">{{ $t("uploadsecuritiesdata") }}</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="one">
      <UploadFileUploadB />
    </v-window-item>

    <v-window-item value="three">
      <UploadFileUploadC />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import { UploadFile, UploadFileUploadB } from "#build/components";
import { defineComponent, ref, onMounted, computed } from "vue";

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

    const tab = ref("one");
    const subTab = ref("two-one");

    return {
      tab,
      subTab,
    };
  },
});
</script>
