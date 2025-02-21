<script setup lang="ts">
const drawer = ref(false);
const group = ref(null);
const open = ref(["Users"]);
const admins = [
  ["Admins", "mdi-account-group"],
  ["Roles", "mdi-account-key"],
  ["Permissions", "mdi-account-lock"],
  ["Users", "mdi-account-circle"],
];
const cruds = [
  ["Create", "mdi-plus"],
  ["Read", "mdi-eye"],
  ["Update", "mdi-pencil"],
  ["Delete", "mdi-delete"],
];
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
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title v-if="!$vuetify.display.smAndDown"
      ><router-link to="/home" class="text-decoration-none text-white">
        ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ
      </router-link>
    </v-app-bar-title>
    <v-app-bar-title
      v-if="!$vuetify.display.smAndDown"
      class="d-flex justify-start"
    >
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
                <nuxt-link :to="item.url" style="text-decoration: none">
                  {{ item.title }}</nuxt-link
                >
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-card class="mx-auto" width="300">
      <v-list v-model:opened="open">
        <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>

        <v-list-group value="Users">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="Users"
            ></v-list-item>
          </template>

          <v-list-group value="Admin">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Admin"></v-list-item>
            </template>

            <v-list-item
              v-for="([title, icon], i) in admins"
              :key="i"
              :prepend-icon="icon"
              :title="title"
              :value="title"
            ></v-list-item>
          </v-list-group>

          <v-list-group value="Actions">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Actions"></v-list-item>
            </template>

            <v-list-item
              v-for="([title, icon], i) in cruds"
              :key="i"
              :prepend-icon="icon"
              :title="title"
              :value="title"
            ></v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-card>
  </v-navigation-drawer>
</template>
