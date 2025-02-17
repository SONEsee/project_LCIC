<script setup lang="ts">
const items = computed(() => [
  { title: "ລາຍການຄົ້ນຫາ1", url: "../user" },
  { title: "ລາຍການຄົ້ນຫາ2" },
  { title: "ລາຍການຄົ້ນຫາ3" },
]);
</script>
<template>
  <v-app-bar :elevation="0" color="primary" dark>
    <template v-slot:prepend v-if="!$vuetify.display.smAndDown">
      <router-link to="home">
        <img src="/images/logo1.png" alt="" width="65" />
      </router-link>
    </template>
    <template v-slot:prepend v-if="$vuetify.display.xs">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title v-if="!$vuetify.display.smAndDown"
      ><router-link to="/home" class="text-decoration-none text-white">
        ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ
      </router-link>
    </v-app-bar-title>
    <v-app-bar-title class="d-flex justify-start">
      <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn style="border: 1px white solid" color="" v-bind="props">
              ກຽວກັບ ຂສລ
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              :value="index"
            >
              <v-list-item-title>
                <nuxt-link :to="item.url" style="text-decoration: none;">
                {{ item.title }}</nuxt-link>
            </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar-title>
  </v-app-bar>
</template>
