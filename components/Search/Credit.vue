<template>
  <div class="image-background">
    <v-card
      class="text-center"
      color="rgba(255, 255, 255, 0.1)"
      :style="{
        border: '1px #0D47A1 solid',
      }"
      ><div class="mt-5 mb-5">
        <h3>ຄະແນນສິນເຊື່ອ</h3>
      </div>
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
              <v-container>
                <v-card
                  class="rounded-lg d-flex justify-center align-center"
                  height="200"
                  :style="{
                    border: '1px #0D47A1 solid',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: isHovering
                      ? '0 6px 12px rgba(#FFFFFF)'
                      : '0 4px 8px rgba(0, 0, 0, 0.4)',
                    transition: 'box-shadow 0.3s',
                    transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                  }"
                  :color=" isHovering ? '#90CAF9' : undefined "
                 
                  v-bind="props"
                >
                  <v-col cols="12">
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                        class="d-flex justify-center align-center"
                        ><img
                          :src="item.backgroundImage"
                          alt=""
                          height="150"
                          :style="{
                            backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid #01579B',
                      boxShadow: isHovering
                        ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 8px rgba(0, 0, 0, 0.4)',
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                          }"
                          class="rounded-lg"
                      /></v-col>
                      <v-col
                        cols="12"
                        md="6"
                        class="d-flex justify-center align-center"
                        ><p>{{ item.title }}</p></v-col
                      >
                    </v-row>
                  </v-col>
                </v-card></v-container
              >
            </v-hover>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style scoped lang="scss"></style>
<script setup lang="ts">
import serchinImage from "@/assets/images/serch/saerch.png";
import loginImage from "@/assets/images/serch/individual.png";

const items = [
  {
    url: "../backend/individualssearch",
    backgroundImage: serchinImage,
    title: "ບຸກຄົນ",
  },
  {
    url: "../backend/searchuser",
    backgroundImage: loginImage,
    title: "ນິຕິບຸກຄົນ",
  },
];
</script>
