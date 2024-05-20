export const MonthlyChart = {
  series: [
    {
      name: "ຍອດໃນເດືອນນີ້",
      data: [10, 12, 13, 14, 15, 13, 14, 16, 9, 18, 17, 15],
    },
  ],
  chartOptions: {
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      type: "bar",
      height: 45,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["rgba(255,255,255,0.5)"],

    marker: {
      size: 0,
    },

    tooltip: {
      theme: "dark",
    },

    grid: {
      show: false,
    },

    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
      colors: ["transparent"],
    },

    plotOptions: {
      bar: {
        horizontal: false,
        startingShape: "flat",
        endingShape: "flat",
        columnWidth: "30%",
        barHeight: "100%",
      },
    },
  },
};
