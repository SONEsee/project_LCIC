import { defineStore } from "pinia";
import axios from "~/helpers/axios";
import pinia from "~/plugins/pinia";
import Swal from "sweetalert2";
import { LoanDataModel } from "~/types";
export const useLoanStore = defineStore("loan", {
  state() {
    return {
      isLoading: false,
      respons_data_loan_list: null as LoanDataModel.Data | null,
      pagination:{
        current_page: 1,
        page_size: 20,
        total_pages: 0,
        total_items: 0,
        has_next: false,
        has_previous: false,
      },
      data_fiter: {
        isLoading: false,
        query: {
          id_file: "",
          q: null as string | null,
          page_size: 20,
          page: 1
          ,
          
          
        },
      },
    };
  },
  actions: {
    async getDataLoan() {
      this.isLoading = true;
      try {
        const res = await axios.get<LoanDataModel.LoanDataRespons>(
          `/api/api/data/`,
          {
            params: {
              ...this.data_fiter.query,
            },
          }
        );
        if (res.status === 200) {
          this.respons_data_loan_list = res.data.data;
          console.log("check data",this.respons_data_loan_list);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: `ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້ເນື້ອງຈາກ ${error}`,
        });
      }finally{
        this.isLoading = false
      }
    },
  },
});
// stores/loan.ts
// import { defineStore } from "pinia";
// import axios from "~/helpers/axios";
// import pinia from "~/plugins/pinia";
// import Swal from "sweetalert2";
// import { LoanDataModel } from "~/types";

// export const useLoanStore = defineStore("loan", {
//   state() {
//     return {
//       isLoading: false,
//       respons_data_loan_list: null as LoanDataModel.Data | null,

//       counts: {
//         data_edit: 0,
//         b_data_damaged: 0,
//         disputes: 0,
//         b1_monthly: 0,
//       },

//       currentData: [] as any[],
//       pagination: {
//         current_page: 1,
//         page_size: 20,
//         total_pages: 0,
//         total_items: 0,
//         has_next: false,
//         has_previous: false,
//       },

//       data_fiter: {
//         isLoading: false,
//         query: {
//           id_file: "",
//           type: "counts",
//           page: 1,
//           page_size: 20,
//         },
//       },
//     };
//   },

//   actions: {
//     async getCounts() {
//       this.isLoading = true;
//       try {
//         const res = await axios.get(`/api/api/data/`, {
//           params: {
//             id_file: this.data_fiter.query.id_file,
//             type: "counts",
//           },
//         });

//         if (res.status === 200) {
//           this.counts = res.data.counts;
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "ຜິດພາດ",
//           text: `ບໍ່ສາມາດດຶງຂໍ້ມູນນັບໄດ້: ${error}`,
//         });
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async getDataByType(type: string, page: number = 1, pageSize: number = 20) {
//       this.isLoading = true;
//       try {
//         const res = await axios.get<LoanDataModel.LoanDataRespons>(
//           `/api/api/data/`,
//           {
//             params: {
//               ...this.data_fiter.query,
//             },
//           }
//         );

//         if (res.status === 200) {
//           this.respons_data_loan_list = res.data.data;
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "ຜິດພາດ",
//           text: `ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້: ${error}`,
//         });
//         this.currentData = [];
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async getDataLoan() {
//       await this.getCounts();
//     },
//   },
// });
