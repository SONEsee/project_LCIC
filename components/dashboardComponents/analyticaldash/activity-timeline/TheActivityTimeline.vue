<template>
  <!-- card-with-image -->
  <v-card class="bg-lighten-2  full-screen-card">
    
    <div class="card-content">
      <div>
      <!-- <p class="ml-3 pt-4"><b style="color: #01579B;">- {{ $t('collectfees') }}</b></p> -->
      </div>
      <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
        <v-tab value="one">{{ $t('creditloans') }}</v-tab>
        <v-tab value="two">{{ $t('utilities') }}</v-tab>
        <v-tab value="three">{{ $t('creditscores') }}</v-tab>
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

import TimelineView from "./TimelineView.vue";
import TimelineProfile from "./TimelineProfile.vue";
import TimelineSettings from "./TimelineSettings.vue";
import { computed, ref } from "vue";
import { onMounted, watch } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

onMounted(() => {
  document.body.classList.toggle("dark-mode", isDark.value);
});

watch(isDark, (newVal) => {
  document.body.classList.toggle("dark-mode", newVal);
});
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
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.822); 
  z-index: 0;
}
.dark-mode .fullscreen::before {
  background-color: rgba(0, 0, 0, 0.7); 
}

.card-content {
  position: relative;
  z-index: 2;
}
</style>
