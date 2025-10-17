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
      <utility-serch/>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import serchffImage from "@/assets/images/serch/enterprise.png";
import serchttImage from "@/assets/images/serch/enterprise1.png";
import serchnpImage from "@/assets/images/electric/eltn.jpg";
import { useI18n } from "vue-i18n";
const {t}= useI18n();
const items = computed(() =>  [
  { url: "#", backgroundImage: serchffImage, title: t("electric") },
  { url: "#", backgroundImage: serchttImage, title: t("tapwater") },
  { url: "#", backgroundImage: serchnpImage, title: t("telecom") },
]);

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
