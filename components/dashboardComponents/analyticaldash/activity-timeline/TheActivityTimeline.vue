<template>
  <v-card>
    <div>
      <p class="ml-3 pt-4"> <b style="color:#01579B ;">- ເກັບຄ່າທຳນຽມ</b></p>
    </div>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ສິນເຊື້ອ</v-tab>
      <v-tab value="two">ສາທານຸປະໂພກ</v-tab>
      <v-tab value="three">ຄະແນນສິນເຊືອ</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <TimelineView />
        </v-window-item>

        <v-window-item value="two">
          <TimelineProfile />
        </v-window-item>

        <v-window-item value="three">
          <TimelineSettings />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import TimelineView from "./TimelineView.vue";
import TimelineProfile from "./TimelineProfile.vue";
import TimelineSettings from "./TimelineSettings.vue";

const tab = ref(null);
</script>
