<template>
    <v-container>
      <v-data-table :headers="headers" :items="items" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>ຂໍ້ມູນການຄົ້ນຫາ</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  
  export default defineComponent({
    setup() {
      const items = ref([]);
      const headers = ref([
        { text: 'ID', value: 'LCICID' },
        { text: 'Enterprise ID', value: 'EnterpriseID' },
        { text: 'Name Lao', value: 'enterpriseNameLao' },
        { text: 'Name English', value: 'eneterpriseNameEnglish' },
        { text: 'Registration Certificate', value: 'regisCertificateNumber' },
        { text: 'Registration Date', value: 'regisDate' },
        { text: 'Location', value: 'enLocation' },
        { text: 'Legal Structure', value: 'enLegalStrature' },
        { text: 'Investment Amount', value: 'investmentAmount' },
        { text: 'Investment Currency', value: 'investmentCurrency' },
        { text: 'Nationality', value: 'representativeNationality' },
        { text: 'Last Update', value: 'LastUpdate' },
        { text: 'Cancellation Date', value: 'CancellationDate' },
        { text: 'Insert Date', value: 'InsertDate' },
        { text: 'Update Date', value: 'UpdateDate' },
      ]);
  
      onMounted(async () => {
        try {
          const response = await fetch('http://127.0.0.1:35729/api/api2/enterpriseinfo/');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          items.value = data;
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      });
  
      return { items, headers };
    },
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  