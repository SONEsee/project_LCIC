import { defined } from "chart.js/helpers";
import { defineStore } from "pinia";
import axios from "~/helpers/axios";
import { InVestorInfoModels } from "~/types";
import Swal from "sweetalert2";

export const useInvestorInfoStore = defineStore("investor", {
  state() {
    return {
      isLoading: false,
      response_data_investor: null as
        | InVestorInfoModels.Datum
        | null,
      filter_enterprise: {
        filter: {
          q: "",
        },
        isLoading: false,
      },
    };
  },
  actions: {
    async getDataInvestor() {
      this.isLoading = true;
      try {
        const res = await axios.get<InVestorInfoModels.InvestorInfoRespons>(
          `/api/api/investors/search/`,
          {
            params: {
              ...this.filter_enterprise.filter,
            },
          }
        );
        if (res.status === 200) {
          this.response_data_investor = res.data.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດຶງຂໍ້ມູນຊື່ໄດ້",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
