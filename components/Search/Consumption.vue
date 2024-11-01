<template>
  <div class="image-background">
    <v-container>
      <v-card class="hovering-zoom mt-10 text-center" max-width="100%" max-height="100%"
        color="rgba(255, 255, 255, 0.4)">
        <div style="color: aliceblue;">
          <h3 class="mt-4 mb-4"><b>ຄົ້ນຫາບົດລາຍງານສາທານຸປະໂພກ</b></h3>
        </div>
        <v-row class="text-center">
          <v-col cols="12" md="6" v-for="(item, index) in items" :key="index" class="">
            <nuxt-link :to="item.url" class="card-link">
              <v-hover v-slot:default="{ isHovering, props }">
                <v-card
                  :style="getCardStyle(item.backgroundImage, isHovering)"
                  class="d-flex justify-center align-center text-overlay rounded-lg ml-1"
                  height="200px"
                  v-bind="props"
                >
                  <!-- <v-icon v-if="isHovering" size="48" color="white">mdi-information</v-icon>
                  <div v-if="isHovering" class="hover-text">ເບິ່ງລາຍລະອຽດ</div> -->
                </v-card>
              </v-hover>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import serchffImage from "@/assets/images/serch/ff.png";
import serchttImage from "@/assets/images/serch/tt.png";
import serchnpImage from "@/assets/images/serch/np.png";

const items = [
  { url: "#", backgroundImage: serchffImage },
  { url: "#", backgroundImage: serchttImage },
  { url: "#", backgroundImage: serchnpImage },
];

const getCardStyle = (image: string, isHovering: boolean) => ({
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: isHovering ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
  transform: isHovering ? 'scale(1.1)' : 'scale(1)',
  transition: 'box-shadow 0.3s, transform 0.3s',
});
</script>

<style scoped lang="scss">
.image-background {
  background-image: url("@/assets/images/serch/bg.jpg");
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
}

.section-title {
  font-size: 24px;
  margin-top: 1rem;
}

.card-link {
  text-decoration: none;
}

.text-overlay {
  position: relative;
  color: white;
  font-weight: bold;
}

.hovering-zoom {
  transition: transform 0.2s;
}

.hovering-zoom:hover {
  transform: scale(1.05);
}

.hover-text {
  position: absolute;
  color: white;
  font-size: 1.5rem;
}
</style>
