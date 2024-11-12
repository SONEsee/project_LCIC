<script setup lang="ts">
import addmin from "@/assets/images/manage/pngtree-vector-user-management-icon-png-image_4102332.jpg";
import memberadmin from '@/assets/images/manage/addmin.png'
import member from '@/assets/images/manage/member.png'
const items = [
  { title: "Admin ", url: "#", backgroudImage: addmin },
  { title: "Admin member", url: "#" , backgroudImage: memberadmin},
  { title: "member", url: "#" ,  backgroudImage: member},
];
</script>
<template>
  <v-card class="hovering-zoom text-center mt-5" style="border: 1px #1A237E solid"
  color="rgba(255,255,255,0.2)"
  >
    <div class="mt-5 mb-5">
      <p style="color: #01579b"><b># ຄ່າທຳນຽມ</b></p>
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
              <!-- <v-card
                height="200px"
                class="d-flex align-center justify-center border hovering-zoom"
              >
                </v-card
              > -->

              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card
                    class="d-flex justify-center align-center"
                    height="200px"
                    v-bind="props"
                    :color="isHovering ? 'primary' : undefined"
                    :style="{
                      border: '1px #0D47A1 solid',
                      transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                      transition: 'box-shadow 0.3s, transform 0.3s',

                    }"
                  >
                    <v-col cols="12" md="6">
                      <img
                        :src="item.backgroudImage"
                        alt=""
                        height="150"
                        :style="{
                          border: '1px #0D47A1 solid',
                        }"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <p>{{ item.title }}</p>
                    </v-col>
                  </v-card>
                </template>
              </v-hover>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
    </div>
    <v-container>
      <v-row> <v-col cols="12" md="4"> </v-col> </v-row
    ></v-container>
  </v-card>
</template>
<style lang="scss"></style>
