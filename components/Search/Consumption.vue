<template>
  <div class="image-background">
    <v-container>
      <v-card
        class="mt-10 text-center"
        max-width="100%"
        max-height="100%"
        color="rgba(255, 255, 255, 0.4)"
        :style="{ border: '1px #90CAF9 solid' }"
      >
        <div style="color: ">
          <h3 class="mt-4 mb-4"><b>ຄົ້ນຫາບົດລາຍງານສາທານຸປະໂພກ</b></h3>
        </div>
        <v-row class="text-center">
          <v-col cols="12" md="4" v-for="(item, index) in items" :key="index">
            <nuxt-link :to="item.url" class="card-link">
              <v-hover v-slot:default="{ isHovering, props }">
                <v-container>
                  <v-card
                    class="d-flex justify-center align-center text-overlay rounded-lg ml-1"
                    height="200"
                    v-bind="props"
                    :style="{
                      border: '1px #90CAF9 solid',
                      transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                    }"
                    :color="isHovering ? '#C5CAE9' : undefined"
                  >
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="12" md="6">
                          <img
                            :src="item.backgroundImage"
                            alt="image"
                            height="150"
                            style="border: 1px #90caf9 solid"
                            class="rounded-lg"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          style="font-size: 12pt"
                          class="text-black d-flex align-center justify-center"
                        >
                          {{ item.title || "No Title" }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-container>
              </v-hover>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import serchffImage from "@/assets/images/serch/enterprise.png";
import serchttImage from "@/assets/images/serch/enterprise1.png";
import serchnpImage from "@/assets/images/electric/eltn.jpg";

const items = [
  { url: "#", backgroundImage: serchffImage, title: "ໄຟຟ້າ " },
  { url: "#", backgroundImage: serchttImage, title: "ນໍ້າປະປາ" },
  { url: "#", backgroundImage: serchnpImage, title: "ໂທລະຄົມ" },
];

const getCardStyle = (image: string, isHovering: boolean) => ({
  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "1px #90CAF9 solid",
  boxShadow: isHovering
    ? "0 8px 16px rgba(0, 0, 0, 0.3)"
    : "0 4px 8px rgba(0, 0, 0, 0.1)",
  transform: isHovering ? "scale(1.05)" : "scale(1)",
  transition: "box-shadow 0.3s, transform 0.3s",
});
</script>

<style scoped lang="scss">
.image-background {
  background-color: #f5f5f5e1;
  padding: 20px;
}
.card-link {
  text-decoration: none;
}
.text-overlay {
  color: #fffffff1;
  font-weight: bold;
}
</style>
