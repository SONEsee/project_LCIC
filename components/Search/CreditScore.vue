<script setup lang="ts">
import serchinImage from "@/assets/images/serch/cd.png";
const items = [
  { title: "ນິຕິບຸກຄົນ", url: "../backend/searchindividuals", backgroundImage: serchinImage },
];
</script>

<template>  

  <div class="d-flex justify-center align-center image-background text-center">
   
    <div class="highlighted-text">
      <p style="color: white; font-size: 24px;">ຄະແນນສິນເຊື່ອ</p>
    </div>
    <v-card class="hovering-zoom mt-10" color="rgba(255, 255, 255, 0.4)">
      <v-container>
        <div class="text-center">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="2"></v-col>
              <v-col
                cols="12"
                md="8"
                v-for="(item, index) in items"
                :key="index"
              >
                <nuxt-link :to="item.url" style="text-decoration: none">
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <v-card
                        :style="{
                          backgroundImage: `url(${item.backgroundImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          boxShadow: isHovering
                            ? '0 6px 12px rgba(0, 0, 0, 0.2)'
                            : '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'box-shadow 0.3s',
                          transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                        }"
                        class="d-flex justify-center align-center"
                        height="200px"
                        v-bind="props"
                        :color="isHovering ? 'primary' : undefined"
                      >
                        <p class="text-overlay">{{ item.title }}</p>
                      </v-card>
                    </template>
                  </v-hover>
                </nuxt-link>
              </v-col>
              <v-col cols="12" md="2"></v-col>
            </v-row>
          </v-col>
        </div>
      </v-container>
    </v-card>
  </div>
</template>

<style lang="scss">
.image-background {
  background-image: url("@/assets/images/serch/bg.jpg");
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
}

.text-overlay {
  color: white;
  font-weight: bold;
  text-align: center;
}
.highlighted-text {
  position: absolute;
  top: 100px; 
  text-align: center;
  width: 100%;
}
</style>
