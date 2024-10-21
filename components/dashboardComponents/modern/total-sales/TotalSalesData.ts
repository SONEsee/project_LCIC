import axios from 'axios';

export const TotalSales = {
  series: [],
  chartOptions: {
    labels: ["ບຸກຄົນ-ນິຕິບຸກຄົນ & ອົງການຈັດຕັ້ງອື່ນ","ທະນາຄານທຸລະກິດ","ບໍລິສັດເຊົ່າສິນເຊື່ອ","ສະຖາບັນການເງິນຈຸລະພາກຮັບຝາກ","ສະຫະກອນສິນເຊື່ອ ແລະ ເງິນຝາກປະຢັດ","ໂຮງຊວດຈຳ","ສະຖາບັນການເງິນຈຸລະພາກບໍ່ຮັບຝາກ"],
    chart: {
      height: 280,
      type: "donut",
      foreColor: "#adb0bb",
      fontFamily: "Noto Sans Lao",
    },
    colors: ["#1e88e5", "#03c9d7", "#F50057", "#880E4F", "#76FF03" ,"#6A1B9A", "#6A1B9A"], 
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
          size: "1%",
          background: "transparent",
        },
      },
    },
    tooltip: { theme: "dark", fillSeriesColor: false },
    responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }],
  },
  
  totalCount: 0, 

  fetchData: function() {
    axios.get('http://127.0.0.1:35729/api/member-count/')
      .then((response) => {
        const memberData = response.data.member_count;
        console.log("sum", memberData);

       
        this.totalCount = memberData.reduce((acc: number, item: { count: number }) => acc + item.count, 0);
        console.log("Total Count:", this.totalCount);

        // const labelsMapping: { [key: number]: string } = {
        //   1: "ທະນາຄານ",
        //   2: "ສະຖາບັນ",
        //   4: "ໂຮງຊວດຈຳ",
        //   5: "ກະສິກອນ",
        //   6: "ອື່ນໆ",
        //   7: "7845"
        // };

        
        this.series = memberData.map((item: { count: number }) => item.count);
        this.chartOptions.labels = memberData.map((item: { memberType_id: number }) => labelsMapping[item.memberType_id]);
      })
      .catch((error) => {
        console.error("Error fetching member count data:", error);
      });
  }
};


TotalSales.fetchData();
