import { ref } from 'vue';
import axios from 'axios';

interface SeriesData {
  name: string;
  data: string[];
}

export const series = ref<SeriesData[]>([
  {
    name: "ຄ່າທຳນຽມຂອງທະນາຄານ",
    data: []
  },
  {
    name: "ຄ່າທຳນຽມຂອງສະຖາບັນ",
    data: []
  },
  {
    name: "ລວມທັງໝົດ",
    data: []
  }
]);

export const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454', '#D50000'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'ຄ່າທຳນຽມຂອງການຄົ້ນຫາ',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: ['ມັງກອນ','ກຸມພາ','ມີນາ','ເມສາ','ພຶດສະພາ','ມິຖຸນາ','ກໍລະກົດ','ສິງຫາ','ກັນຍາ','ຕຸລາ','ພະຈິກ','ທັນວາ'],
    title: {
      text: 'ຂໍ້ມູນເປັນປີ'
    }
  },
  yaxis: {
    title: {
      text: 'Amount'
    },
    min: 0,
    labels: {
      formatter: (value: number) => value.toLocaleString()
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
});

export const fetchData = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await axios.get(`${config.public.strapi.url}api/sumbanktype_chargeamount/anymonth/`);
    const data = response.data.data;

    const months = Object.keys(data);
    const bankAmounts = months.map(month => data[month].Bank_TotalChgAmount.toString());
    const mfiAmounts = months.map(month => data[month].MFI_TotalChgAmount.toString());
    const totalAmounts = months.map(month => data[month].Overall_TotalChgAmount.toString());

    chartOptions.value.xaxis.categories = months;

    series.value[0].data = bankAmounts;
    series.value[1].data = mfiAmounts;
    series.value[2].data = totalAmounts;
    console.log('series:', series.value);
    console.log('chartOptions:', chartOptions.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
