<script setup lang="ts">
const items = [
  {title:"ໄຟຟ້າ ", url: "#"},
  {title:"ໂທລະຄົມນໍ້າປະປາ", url: "#"},

]
</script>
<template>
  <v-card class="hovering-zoom">
     <div>
      <p style="color:#01579B ;"> <b># ຄະແນນສິນເຊືອ</b></p>
    </div>
    <div class="text-center">
      <v-col cols="12">
        <v-row >
          <v-col cols="12" md="6" class="h" v-for="(item, index) in items " :key="index">
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
