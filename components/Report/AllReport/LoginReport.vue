<script setup lang="ts">
const items = [
  { title: "Admin ", url: "#" },
  { title: "Admin member", url: "#" },
  { title: "member", url: "#" },
];
</script>
<template>
  <v-card class="hovering-zoom">
    <div>
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
                    ><p>{{ item.title }}</p></v-card
                  >
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
