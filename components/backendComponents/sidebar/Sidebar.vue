<script setup lang="ts">
import sidebarItems from "./sidebarItems";
const sidebarMenu = ref(sidebarItems);
</script>

<template>
  <div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <div class="scrollnavbar">
      <div class="profile"> 
        <div class="profile-pic">
         
          <v-avatar size="45">
            <img
              src="https://scontent.fvte5-1.fna.fbcdn.net/v/t39.30808-6/336459776_153661590945312_5540260982228972360_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHbCc56PQxjS3k_XhIx7vTwmmmVo4VN6lSaaZWjhU3qVPR9MVFFf8V3lFpkg0d_D1qcp0HH4YSSCKVX2MQXLeQM&_nc_ohc=4bpEgBP5EE0Q7kNvgFUy8xe&_nc_ht=scontent.fvte5-1.fna&oh=00_AfBnTmVNQHS-Qk62HxFyioKt-H-3NfkGEhKaj0h6TiZizQ&oe=6634FDD4"
              width="50"
              alt="sone"
            />
          </v-avatar>
        </div>
        <div class="profile-name">
          <h3 style="color: aliceblue;">Sone SEEDAVANH</h3>
        </div>
      </div>
      <v-list class="pa-4">
        <!-- ---------------------------------------------- -->
        <!---Menu Loop -->
        <!-- ---------------------------------------------- -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!-- ---------------------------------------------- -->
          <!---Single Item-->
          <!-- ---------------------------------------------- -->
          <v-list-item :to="item.to" rounded="lg" class="mb-1">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </div>
  </div>
</template>

<style scoped>
.profile-name {
  font-size: 18px;
}
</style>
