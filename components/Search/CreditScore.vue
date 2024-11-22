<script setup lang="ts">
import serchinImage from "@/assets/images/serch/individual.png";
import { useI18n } from "vue-i18n";
const {t}= useI18n();
const items = computed(() => [
  {
    title: t("legalentity"),
    url: "../backend/searchindividuals",
    backgroundImage: serchinImage,
  },
]);
</script>

<template>
  <div class="image-background text-center">
    <div class="highlighted-text">
      <p style="font-size: 24px"><b>{{ $t("creditscores") }}</b></p>
    </div>
    <v-container>
      <v-card
        class="hovering-zoom"
        color="rgba(255, 255, 255, 0.4)"
        :style="{ border: '1px #0277BD solid',
        transition: 'box-shadow 0.3s', 
         
        }"
      >
        <v-container>
          <div class="text-center">
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="2"></v-col>
                <v-col
                  cols="12"
                  md="8"
                  v-for="(item, index) in items"
                  :key="index"
                >
                  <nuxt-link :to="item.url" style="text-decoration: none">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-card
                          :style="{
                            // backgroundImage: `url(${item.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            boxShadow: isHovering
                              ? '0 6px 12px rgba(0, 0, 0, 0.2)'
                              : '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'box-shadow 0.3s',
                            transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                            border: '1px #0277BD solid',
                            color:'rgba(255,255,255,0.1)'
                          }"
                          class="d-flex justify-center align-center"
                          height="200px"
                          v-bind="props"
                          :color="isHovering ? '#B3E5FC' : undefined"
                        >
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" md="6"
                                ><img
                                  :src="item.backgroundImage"
                                  alt=""
                                  width="150"
                                  :style="{
                                    
                                    
                           
                            boxShadow: isHovering
                              ? '0 6px 12px rgba(0, 0, 0, 0.2)'
                              : '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'box-shadow 0.3s',
                            transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                            border: '1px #0277BD solid',
                            color:'rgba(255,255,255,0.1)'
                                  }"
                                  class="rounded-lg"

                              /></v-col>
                              <v-col
                                cols="12"
                                md="6"
                                class="d-flex justify-center align-center"
                                ><h3 class="text-black">
                                  <p>{{ item.title }}</p>
                                </h3></v-col
                              >
                            </v-row>
                          </v-col>
                        </v-card>
                      </template>
                    </v-hover>
                  </nuxt-link>
                </v-col>
                <v-col cols="12" md="2"></v-col>
              </v-row>
            </v-col>
          </div>
        </v-container> </v-card
    ></v-container>
  </div>
</template>

<style lang="scss"></style>
