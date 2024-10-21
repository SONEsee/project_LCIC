export const RevenueChart = {
  series: [
    {
      name: "ທະນາຄານ",
      data: [] as number[],
    },
    {
      name: "ສະຖາບັນ",
      data: [] as number[],
    },
  ],
  chartOptions: {
    colors: ["#3949AB", "#4A148C"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      toolbar: {
        show: false,
      },
      type: "line",
      foreColor: "#adb0bb",
      fontFamily: "'noto sans lao',sans-serif",
      height: 300,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      border: 1,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "ມັງກອນ",
        "ກຸມພາ",
        "ມີນາ",
        "ເມສາ",
        "ພຶດສະພາ",
        "ມິຖຸນາ",
        "ກໍລະກົດ",
        "ສິງຫາ",
      ],
    },
    grid: {
      show: true,
      borderColor: "rgba(0, 0, 0, .2)",
      color: "#777e89",
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      theme: "dark",
    },
  },
  
  async loadDataFromAPI() {
    try {
      const response = await fetch("http://127.0.0.1:35729/api/searchlog_chart/2024-10");
      const data = await response.json();
  
      this.series[0].data = data.chart_data.map((item: any) => item["2024-10"]);
      const bankCodes = data.chart_data.map((item: any) => item.bnk_code);
      console.log("ລາຍຊື່ທັງຫມົດຂອງທະນາຄານ", bankCodes);
      this.series[1].data = data.institution_data.map((item: any) => item["2024-10"]);
  
    } catch (error) {
      console.error("ການດຶງຂໍ້ມູນຈາກ API ຜິດພາດ:", error);
    }
  }
  
};


RevenueChart.loadDataFromAPI();
