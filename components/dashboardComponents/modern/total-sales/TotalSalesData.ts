export const TotalSales = {
  series: [40000, 20000, 600, 1000],
  chartOptions: {
    labels: ["ທະນາຄານ", "ສະຖາບັນ", "ໂຮງຊວດຈຳ", "ກະສິກອນ"],
    chart: {
      height: 280,
      type: "donut",
      foreColor: "#adb0bb",
      fontFamily: "Noto Sans Lao",
    },
    colors: ["#03c9d7", "#1e88e5", "#880E4F", "#6A1B9A"],
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      show: false,
      borderColor: "transparent",
      padding: { top: 0, right: 0 },
    },
    stroke: { colors: ["transparent"] },
    plotOptions: {
      pie: {
        donut: {
          size: "78%",
          background: "transparent",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "18px",
              color: undefined,
              offsetY: -10,
            },
            value: { show: false, color: "#98aab4" },
            total: { show: false, label: "Our Visitors", color: "#98aab4" },
          },
        },
      },
    },
    tooltip: { theme: "dark", fillSeriesColor: false },
    responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }],
  },
};
