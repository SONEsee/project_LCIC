<script setup lang="ts">
const items = [
  { title: "ບຸກຄົນ ", url: "../backend/individualssearch" },
  { title: "ນິຕິບຸກຄົນ", url: "../backend/searchuser" },
];
</script>
<template>
  <v-card class="hovering-zoom mt-10">
    <div>
      <p style="color: #01579b"><b># ເກັບຄ່າທຳນຽມສິນເຊືອ</b></p>
    </div>
    <div class="text-center">
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            md="6"
            class="h"
            v-for="(item, index) in items"
            :key="index"
          >
            <nuxt-link :to="item.url" style="text-decoration: none">
              <!-- <v-card
                height="200px"
                class="d-flex align-center justify-center border hovering-zoom"
              >
                <b style="color: #1a237e"> {{ item.title }}</b></v-card
              > -->
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card
                  class="d-flex justify-center align-center"
                    height="200px"
                    v-bind="props"
                    :color="isHovering ? 'primary' : undefined"
                    ><p>{{ item.title }}</p></v-card
                  >
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
