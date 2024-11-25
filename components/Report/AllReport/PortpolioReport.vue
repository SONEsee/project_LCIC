<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const {t}= useI18n();
const items = computed(() => [
  {
    message: t('portpolio1'),
    url: "../backend/reportprint/Distribution_of_Loan_Class_By_Loan_Purpose_By_Bank",
  },
  {
    message: t('portpolio2'),
    url: "../backend/Distribtion_Of_Loan_Class_By_Loan_Purpose_For_All_Banks",
  },
  {
    message: t('portpolio3'),
    url: "../backend/reportprint/Distribution_Of_Loan_Class_By_Province_By_Bank",
  },
  {
    message: t('portpolio4'),
    url: "..//backend/reportprint/Distribution_Of_Loan_Class_By_Province_For_All_Banks",
  },
  {
    message: t('portpolio5'),
    url: "../backend/reportprint/Portfolio_Analysis_Total_Loan_Count_Per_Loan_Class",
  },
  {
    message: t('portpolio6'),
    url: "../backend/reportprint/Portfolio_Analysis_Total_Loan_Value_Per_Loan_Class",
  },
  {
    message: t('portpolio7'),
    url: "../backend/reportprint/Provision_Requirement_By_Bank",
  },
  {
    message: t('portpolio8'),
    url: "../backend/reportprint/Provision_Requirement_Report_For_All_Banks",
  },
  {
    message: t('portpolio9'),
    url: "../backend/reportprint/General_Provisions_by_Bank",
  },
  {
    message: t('portpolio10'),
    url: "../backend/reportprint/General_Provisions_For_All_Banks",
  },
]);
</script>
<template>
  <div v-for="(item, index) in items" :key="index">
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card
          v-bind="props"
          :color="isHovering ? 'indigo-lighten-2' : undefined"
        >
          <nuxt-link :to="item.url" style="text-decoration: none">
            <div
              style="width: 100%; height: 40px; text-decoration: none"
              class="mt-4 bg-"
            >
              <p class="ml-2">{{ item.message }}</p>
            </div></nuxt-link
          >
        </v-card>
      </template>
    </v-hover>
  </div>
</template>
