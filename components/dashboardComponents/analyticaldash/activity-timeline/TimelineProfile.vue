<script setup lang="ts">
import serchinImage from "@/assets/images/feed/faifa.jpg";
import loginImage from "@/assets/images/feed/Water-Charges-2.jpg";
import loginImag2 from "@/assets/images/feed/internet.jpg";
const items = [
  { title: "ໄຟຟ້າ ", url: "#", backgroundImage: serchinImage },
  { title: "ນໍ້າປະປາ", url: "#"  , backgroundImage: loginImage },
  { title: "ໂທລະຄົມ", url: "#" , backgroundImage: loginImag2  },
];
</script>
<template>
  <v-card class="hovering-zoom bg-" 
    color="rgba(255, 255, 255, 0.6)"
    style="border-radius: 2px; border: 2px solid #9FA8DA">
    <div>
      <p style="color: #01579b"><b># ສາທານຸປະໂພກ</b></p>
    </div>
    <div class="text-center">
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            md="4"
            class="h"
            v-for="(item, index) in items"
            :key="index"
          >
            <nuxt-link :to="item.url" style="text-decoration: none">
          
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card
                    class="d-flex justify-center align-center"
                    height="100%"
                    width="100%"
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
                        <v-col cols="12" md="">
                          <img
                            :src="item.backgroundImage"
                            alt=""
                            width="100%"
                            height="100%"
                            class="rounded-lg"
                          />
                        </v-col>
                        <v-col cols="12" md="6"  class="d-flex justify-center align-center">
                          <p>
                            {{ item.title }}
                          </p>
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
<style lang="scss"></style>
