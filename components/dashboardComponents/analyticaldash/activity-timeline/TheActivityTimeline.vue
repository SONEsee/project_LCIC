<template>
  <v-card class="bg-lighten-2 card-with-image full-screen-card">
    
    <div class="card-content">
      <div>
        <p class="ml-3 pt-4"><b style="color: #01579B;">- ເກັບຄ່າທຳນຽມ</b></p>
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
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TimelineView from "./TimelineView.vue";
import TimelineProfile from "./TimelineProfile.vue";
import TimelineSettings from "./TimelineSettings.vue";

const tab = ref(null);
</script>

<style scoped>
.card-with-image {
  position: relative;
  background-image: url("@/assets/images/feed/logo.png");
  background-size: cover;
  background-position: center;
}
.full-screen-card {
  height: 100vh;  
    
 
}
.card-with-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffffee; 
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
}
</style>
