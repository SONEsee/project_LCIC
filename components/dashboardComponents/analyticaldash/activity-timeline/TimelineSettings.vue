<script setup lang="ts">
import serchinImage from "@/assets/images/serch/faifar.png";
import loginImage from "@/assets/images/serch/water.jpg";

const items = [
  { title: "ໄຟຟ້າ", url: "#", backgroundImage: serchinImage },
  { title: "ນໍ້າປະປາ", url: "#", backgroundImage: loginImage },
];
</script>

<template>
  <v-card
    class="hovering-zoom mt-10 text-center"
    color=""
    :style="{
      border: '2px #00B0FF solid',
      color: 'rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(255,255,255,0.1)',
    }"
  >
    <v-container>
      <div class="mt-3 mb-3">
        <p style="color: #01579b"><b>ຄະແນນສິນເຊືອ</b></p>
      </div>
      <div class="text-center">
        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="6" v-for="(item, index) in items" :key="index">
              <nuxt-link :to="item.url" style="text-decoration: none">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="d-flex justify-center align-center text-stsrt"
                      height="100%"
                      width=""
                      v-bind="props"
                      :color="isHovering ? '#B3E5FC' : ''"
                      :style="{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: isHovering
                          ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                          : '0 4px 8px rgba(0, 0, 0, 0.4)',
                        transition: 'box-shadow 0.3s',
                        transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                        border: '1px #00B0FF solid',
                      }"
                    >
                      <v-col cols="12">
                        <v-row>
                          <v-col cols="12" md="6" class="text-start"
                            ><img
                              :src="item.backgroundImage"
                              alt=""
                              height="150"
                              class="rounded-lg"
                              :style="{
                                border: '1px #00B0FF solid',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                boxShadow: isHovering
                                  ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                                  : '0 4px 8px rgba(0, 0, 0, 0.4)',
                                transition: 'box-shadow 0.3s',
                                transform: isHovering
                                  ? 'scale(1.05)'
                                  : 'scale(1)',
                              }"
                          /></v-col>
                          <v-col
                            cols="12"
                            md="6"
                            class="d-flex justify-center align-center"
                            ><p style="color: ">{{ item.title }}</p>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-card>
                  </template>
                </v-hover>
              </nuxt-link>
            </v-col>
          </v-row>
        </v-col>
      </div></v-container
    >
  </v-card>
</template>

<style lang="scss">
.hovering-zoom {
  .v-card {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
