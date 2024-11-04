<script setup lang="ts">
import serchinImage from "@/assets/images/feed/ff.jpg";
import loginImage from "@/assets/images/feed/Water-Charges-2.jpg";

const items = [
  { title: "ໄຟຟ້າ", url: "#", backgroundImage: serchinImage },
  { title: "ນໍ້າປະປາ", url: "#", backgroundImage: loginImage },
];
</script>

<template>
  <v-card
    class="hovering-zoom mt-10 text-center"
    color="rgba(255, 255, 255, 0.3)"
    style="border-radius: 2px; border: 2px solid #9FA8DA"
  >
    <div class="mt-3 mb-3">
      <p style="color: #01579b"><b>ເກັບຄ່າທຳນຽມສິນເຊືອ</b></p>
    </div>
    <div class="text-center">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="6" v-for="(item, index) in items" :key="index">
            <nuxt-link :to="item.url" style="text-decoration: none">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card
                    class="d-flex justify-center align-center"
                    height="50%"
                    width=""
                    v-bind="props"
                    :color="isHovering ? 'indigo-accent-1' : 'blue-darken-4'"
                    :style="{
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: isHovering
                        ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 8px rgba(0, 0, 0, 0.4)',
                      transition: 'box-shadow 0.3s',
                      transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                    }"
                  >
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="12" md="6"
                          ><img
                            :src="item.backgroundImage"
                            alt=""
                            width="100%"
                            height="100%"
                            class="rounded-lg" /></v-col
                        >
                        <v-col
                          cols="12"
                          md="6"
                          class="d-flex justify-center align-center"
                          ><p style="color: white">{{ item.title }}</p>
                          </v-col
                        >
                      </v-row>
                    </v-col>
                  </v-card>
                </template>
              </v-hover>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </v-card>
</template>

<style lang="scss">
.hovering-zoom {
  .v-card {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
