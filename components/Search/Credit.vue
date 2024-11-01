<template>
  <div class="image-background">
    <div class="highlighted-text">
      <p style="color: white; font-size: 24px;">ຄະແນນສິນເຊື່ອ</p>
    </div>
    <v-card
      color="rgba(255, 255, 255, 0.3)"
      max-width="90%"
      max-height="90%"
      class="p-4 rounded-lg shadow-lg"
    >
     
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="(item, index) in items"
          :key="index"
          class="text-center"
        >
          <nuxt-link :to="item.url">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-card
                class="rounded-lg"
                height="250px"
                :style="{
                  backgroundImage: `url(${item.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: isHovering
                    ? '0 6px 12px rgba(#FFFFFF)'
                    : '0 4px 8px rgba(0, 0, 0, 0.4)',
                  transition: 'box-shadow 0.3s',
                  transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                }"
                color="white"
                v-bind="props"
              >
                <div class="overlay">
                  <h3></h3>
                </div>
              </v-card>
            </v-hover>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.image-background {
  background-image: url("@/assets/images/serch/bg.jpg");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  background-color: rgba(57, 22, 212, 0.288);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
}
.highlighted-text {
  position: absolute;
  top: 100px; 
  text-align: center;
  width: 100%;
}
</style>
<script setup lang="ts">
import serchinImage from "@/assets/images/serch/serchin.png";
import loginImage from "@/assets/images/serch/srchen.png";

const items = [
  { url: "../backend/individualssearch", backgroundImage: serchinImage },
  { url: "../backend/searchuser", backgroundImage: loginImage },
];
</script>
