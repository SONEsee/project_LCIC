export const RevenueChart = {
  series: [
    {
      name: "ທະນາຄານ",
      data: [2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
    },
    {
      name: "ສະຖາບັນ",
      data: [2000, 1000, 3000, 7000, 6000, 12000, 8000, 3000],
    },
    {
      name: "ໂຮງຊວດຈຳ",
      data: [1000, 4000, 1000, 2600, 5800, 12000, 4000, 3000],
    },
    {
      name: "ສະຫະກອນ",
      data: [3000, 4000, 6000, 1000, 9000, 11000, 4000, 4000],
    },
  ],
  chartOptions: {
    colors: ["#3949AB", "#4A148C", "#C2185B", "#D50000"],
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
};
