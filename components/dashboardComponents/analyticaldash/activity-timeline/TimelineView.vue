<script setup lang="ts">
import serchinImage from "@/assets/images/serch/one.jpg";
import loginImage from "@/assets/images/serch/numpapa.webp";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { onMounted, watch } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

onMounted(() => {
  document.body.classList.toggle("dark-mode", isDark.value);
});

watch(isDark, (newVal) => {
  document.body.classList.toggle("dark-mode", newVal);
});

const {t}= useI18n();
const items = computed (() => [
  { title: t("person"), url: "", backgroundImage: serchinImage },
  { title: t ('enterprise'), url: "../searchlogreport", backgroundImage: loginImage },
]);
</script>

<template>
  <v-card
    class="hovering-zoom mt-10 text-center rounded-lg"
    color="rgba(255, 255, 255, 0.1)"
    style="border-radius: 2px; border: 2px solid #00B0FF"
  >
  <v-container>
    <div class="mt-3 mb-3">
      <h3 style="color: "><b>{{ $t('collectloanfees') }}</b></h3>
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
                    height="100%"
                    width="100%"
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
                      border:'1px #00B0FF solid'
                    }"
                  >
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="12" md="6"
                        class="text-start"
                          ><img
                          :style="{
                            border:'1px #00B0FF solid',
                            transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                            backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: isHovering
                        ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 8px rgba(0, 0, 0, 0.4)',
                      transition: 'box-shadow 0.3s',
                      
                          }"
                            :src="item.backgroundImage"
                            alt=""
                            width=""
                            height="150"
                            class="rounded-lg" /></v-col
                        >
                        <v-col
                          cols="12"
                          md="6"
                          class="d-flex justify-center align-center"
                          ><h3 style="color: "><b>{{ item.title }}</b></h3>
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
    </div></v-container>
  </v-card>
</template>

<style lang="scss">
.hovering-zoom {
  .v-card {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
