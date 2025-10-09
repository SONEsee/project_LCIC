<script setup lang="ts">
import image from "@/assets/images/report/individual.png";
import enterprise from "@/assets/images/report/enterprise.png";
import { useI18n } from "vue-i18n";
const tab = ref(null);
const { t } = useI18n();
const items = computed(() => [
  { title: t("person"), url: "#", backgroundImage: image },
  {
    title: t("enterprise"),
    url: "../backend/chart/rrportchart",
    backgroundImage: enterprise,
  },
]);
</script>
<template>
  <v-window v-model="tab">
    <v-window-item value="one">
      <ChargeReport />
    </v-window-item>
    <v-window-item value="two">
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
                class="d-flex justify-center align-center"
                height="200px"
                v-bind="props"
                :color="isHovering ? 'primary' : undefined"
              >
                <v-col
                  color="rgba(255,255,255,0.5)"
                  cols="12"
                  class="d-flex justify-center align-center bg-indigo-lighten-5"
                >
                  <v-row>
                    <v-container></v-container>
                    <v-col cols="12" md="6" class="d-flex align-center">
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
                          transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                        }"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="d-flex justify-center align-center"
                      ><p>{{ item.title }}</p></v-col
                    >
                  </v-row>
                </v-col>
              </v-card>
            </template>
          </v-hover>
        </nuxt-link>
      </v-col></v-window-item
    >
    <v-window-item value="three"> 
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
                    class="d-flex justify-center align-center"
                    height="200px"
                    v-bind="props"
                    :color="isHovering ? 'primary' : undefined"
                  >
                    <v-col
                      color="rgba(255,255,255,0.5)"
                      cols="12"
                      class="d-flex justify-center align-center bg-indigo-lighten-5"
                    >
                      <v-row>
                        <v-container></v-container>
                        <v-col cols="12" md="6" class="d-flex  align-center">
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
                      transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                       }"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          class="d-flex justify-center align-center"
                          ><p>{{ item.title }}</p></v-col
                        >
                      </v-row>
                    </v-col>
                  </v-card>
                </template>
              </v-hover>
            </nuxt-link>
          </v-col>
    </v-window-item>
  </v-window>
  <!-- <v-window v-model="tab">
    <v-window-item value="two"> test2 </v-window-item>
  </v-window> -->

  <!-- <template>
  <v-card
    class="hovering-zoom text-center"
    style="border: 1px solid #9fa8da; max-height: 100%"
    color="rgba(255,255,255,0.4)"
  >
    <div class="mt-10 mb-10">
      <h3 style="color: #01579b"><b> {{$t('collectfees')}}</b></h3>
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
                    class="d-flex justify-center align-center"
                    height="200px"
                    v-bind="props"
                    :color="isHovering ? 'primary' : undefined"
                  >
                    <v-col
                      color="rgba(255,255,255,0.5)"
                      cols="12"
                      class="d-flex justify-center align-center bg-indigo-lighten-5"
                    >
                      <v-row>
                        <v-container></v-container>
                        <v-col cols="12" md="6" class="d-flex  align-center">
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
                      transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                       }"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          class="d-flex justify-center align-center"
                          ><p>{{ item.title }}</p></v-col
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
</template> -->
</template>
<style lang="scss"></style>
