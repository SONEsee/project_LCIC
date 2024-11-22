<script setup lang="ts">
import individaul from "@/assets/images/report/saerch.png";
import searchenterprise from '@/assets/images/report/enterprise1.png'
import { useI18n } from "vue-i18n";

const {t}= useI18n();
const items = computed(() =>[
  { title: t('person'), url: "#", backgroundImage: individaul },
  { title: t('enterprise'), url: "../backend/reportchart/enterprise" ,backgroundImage:searchenterprise },
]);
</script>
<template>
  <v-card class="hovering-zoom text-center mt-5" style="border: 1px solid #00B0FF">
    <div class="mt-5 mb-5">
      <p style="color: #01579b"><b> {{$t("searchreport")}}</b></p>
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
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card
                    class="d-flex justify-center align-center"
                    height="200px"
                    v-bind="props"
                    :color="isHovering ? 'primary' : undefined"
                    style="border: 1px #01579B solid"
                    
                  >
                    <v-col cols="12" md="6" class="text-start">
                      <img
                      height="150"
                        :src="item.backgroundImage"
                        alt=""
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
                      />
                    </v-col>
                    <v-col cols="12" md="6"
                      ><h2>{{ item.title }}</h2></v-col
                    >
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
