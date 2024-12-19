<script setup lang="ts">
import bank from "@/assets/images/report/bank.png";
import mfi from "@/assets/images/report/mfi.png";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const items = computed(() => [
  { title: t("bank"), url: "#", backgroundImage: bank },
  { title: t("institution"), url: "#", backgroundImage: mfi },
]);
</script>
<template>
  <v-card
    class="hovering-zoom mt-10 text-center"
    style="border: 1px #01579b solid"
    color="rgba(255,255,255,0.4)"
  >
    <!-- <div class="mt-5 mb-5">
      <p style="color: #01579b"><b> {{$t("transmissionreport")}}</b></p>
    </div> -->
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
                {{ item.title }}</v-card
              > -->
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card
                    :style="{
                      border: '1px #01579B solid',
                    }"
                    class="d-flex justify-center align-center"
                    height="200px"
                    v-bind="props"
                    :color="isHovering ? 'primary' : undefined"
                  >
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="12" md="6">
                          <img
                            class="rounded-lg"
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
                              transform: isHovering
                                ? 'scale(1.05)'
                                : 'scale(1)',
                            }"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          class="d-flex justify-center align-center"
                          ><h2>{{ item.title }}</h2></v-col
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
