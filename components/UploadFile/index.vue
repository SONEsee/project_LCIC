<template>
  <v-card>
    <v-col cols="12">
      <h3 class="text-primary ml-3">#ການອັບໂຫຼດຂໍ້ມູນ</h3>
    </v-col>

    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ຂໍ້ມູນຂໍ້ມູນເງິນກູ້ </v-tab>

      <v-tab value="three">ອັບໂຫຼດຂໍ້ມູນຫຼັກຊັບ</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <UploadB />
        </v-window-item>

        <v-window-item value="three">
          <UploadC />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
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
