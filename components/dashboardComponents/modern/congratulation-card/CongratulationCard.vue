<template>
  <v-row>
    <v-col cols="12" md="9"></v-col>
    <v-col cols="12" md="3"> 
      <v-autocomplete
        label="ເລືອກ"
        density="compact"
        width="100%"
        rounded="lg"
        variant="outlined"
        :items="['ວັນ', 'ອາທິດ', 'ເດືອນ']"
        v-model="selectedTimeframe"
        @change="fetchData"
      />
    </v-col>
  </v-row>

  <div id="chart">
    <apexchart
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "StockPriceChart",
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const series = ref([
      { name: "Charge Count", data: [] as { x: string; y: number }[] },
    ]);
    const chartOptions = ref({
      chart: {
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      title: {
        text: "ການເຄືອນໄຫວ ແລະ ການເໜັງຕີງຂອງການຄົ້ນຫາປະຈຳວັນ",
        align: "left",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => val.toFixed(0),
        },
        title: { text: "Count" },
      },
      xaxis: { type: "category" },
      tooltip: {
        shared: false,
        y: {
          formatter: (val: number) => val.toFixed(0),
        },
      },
    });

    const selectedTimeframe = ref('ວັນ');

    const fetchData = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/charge-count/`
        );
        const data = await response.json();
        console.log("Fetched data:", data);

        const timeframeKey = selectedTimeframe.value === 'ວັນ' ? 'day' :
                             selectedTimeframe.value === 'ອາທິດ' ? 'week' :
                             selectedTimeframe.value === 'ເດືອນ' ? 'month' : '';

        const timeframeData = data[timeframeKey];
        if (timeframeData) {
          series.value[0].data = Object.entries(timeframeData).map(([time, count]) => ({
            x: time,
            y: count as number,
          }));
        } else {
          console.error("Invalid timeframe data:", selectedTimeframe.value);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    onMounted(fetchData);

    watch(selectedTimeframe, fetchData);

    return { series, chartOptions, selectedTimeframe, fetchData };
  },
});
</script>

<style scoped>
#chart {
  max-width: 100%;
}

.custom-border {
  border: 2px solid #1a237e;
}
</style>