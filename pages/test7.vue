<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const currentLocale = ref(locale.value);

function toggleLocale() {
  const newLocale = currentLocale.value === 'en' ? 'lo' : 'en';
  currentLocale.value = newLocale;
  locale.value = newLocale;
}

// Watch ເພື່ອໃຫ້ສະແດງພາສາທັນທີໂດຍບໍ່ຕ້ອງ reload ໜ້າ
watch(currentLocale, (newLocale) => {
  locale.value = newLocale;
});
</script>

<template>
  <v-btn icon class="mx-3" color="white" @click="toggleLocale">
    {{ currentLocale }}
  </v-btn>
  {{ $t("hello") }}
</template>
