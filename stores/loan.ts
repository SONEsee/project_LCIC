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
      data_fiter: {
        isLoading: false,
        query: {
          id_file: "",
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
