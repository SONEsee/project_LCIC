<template>
  <div class="container">
    <h1>Histogram Example</h1>
    <div v-if="isClient">
      <apexchart
        type="histogram"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <div v-else>
      <p>Loading chart...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      isClient: false, // ກວດສອບວ່າໂຫຼດຝັ່ງ client ສຳເລັດຫຼືຍັງ
      series: [
        {
          name: 'Frequency',
          data: [
            { x: 'Bin 1', y: 524 }, // ຄ່າຈາກຮູບ
            { x: 'Bin 2', y: 687 }, // ຄ່າຈາກຮູບ
            { x: 'Bin 3', y: 312 }, // ຂໍ້ມູນຈຳລອງ
            { x: 'Bin 4', y: 450 }, // ຂໍ້ມູນຈຳລອງ
            { x: 'Bin 5', y: 789 }, // ຂໍ້ມູນຈຳລອງ
          ],
        },
      ],
      chartOptions: {
        chart: {
          type: 'histogram',
          height: 350,
        },
        plotOptions: {
          bar: {
            columnWidth: '80%',
            distributed: false,
          },
        },
        colors: ['#00C4B4'], 
        xaxis: {
          title: {
            text: 'Bins',
          },
          labels: {
            show: true,
          },
        },
        yaxis: {
          title: {
            text: 'Frequency',
          },
          max: 1000, // ກຳນົດຄ່າສູງສຸດຂອງແກນ y
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => val,
          style: {
            colors: ['#000'],
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  },
  mounted() {
    
    this.isClient = process.client;
  },
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>