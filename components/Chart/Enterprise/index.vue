<template>
    <table>
      <thead>
        <tr>
          <th>Bank Code</th>
          <th>Jan-Amount</th>
          <th>Feb-Amount</th>
          <th>Mar-Amount</th>
          <th>Apr-Amount</th>
          <th>May-Amount</th>
          <th>Jun-Amount</th>
          <th>Jul-Amount</th>
          <th>Aug-Amount</th>
          <th>Sep-Amount</th>
          <th>Oct-Amount</th>
          <th>Nov-Amount</th>
          <th>Dec-Amount</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in chartData" :key="row.bnk_code">
          <td>{{ row.bnk_code }}</td>
         
          <td v-for="month in months" :key="month">
            {{ row[month] !== undefined ? row[month] : '-' }}
          </td>
          <td>{{ getTotalAmount(row) }}</td> 
        </tr>
      </tbody>
    </table>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const chartData = ref<any[]>([]);
      const months = ref<string[]>([
        '01-2024', '02-2024', '03-2024', '04-2024', '05-2024', '06-2024',
        '07-2024', '08-2024', '09-2024', '10-2024', '11-2024', '12-2024'
      ]);
  
      // Fetch the data from the backend
      const fetchData = async () => {
        try {
            const config = useRuntimeConfig();
            const response = await fetch(`${config.public.strapi.url}api/charge_chart/`);
          const data = await response.json();
  
          // Since your response already has the month-year structure, assign it directly
          chartData.value = data.chart_data.map((entry: any) => {
            const monthYearData = {
              bnk_code: entry.bnk_code,
              ...entry // Spread the existing data (which contains month-year keys like '10-2024')
            };
            return monthYearData;
          });
        } catch (error) {
          console.error('Error fetching charge data:', error);
        }
      };
  
      // Calculate total amount for each row
      const getTotalAmount = (row: any) => {
        return months.value.reduce((total, month) => {
          return total + (row[month] !== undefined ? row[month] : 0);
        }, 0);
      };
  
      onMounted(() => {
        fetchData();
      });
  
      return { chartData, months, getTotalAmount };
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  