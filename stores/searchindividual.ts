import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "~/helpers/axios";
import { SearchIndividualModel } from "~/types";
export const IndividualStore = defineStore("individual", {
  state() {
    return {
      isLoading: false,
      respons_data_reques: null as SearchIndividualModel.Result | null,
      reques_query: {
        isLoading: false,
        query: {
          lcic_id: "",
          customerid: "",
          bnk_code: "",
        },
      },
    };
  },
  actions: {
    async saerchListIndividual() {
      this.isLoading = true;
      this.reques_query.isLoading = true;
      try {
        const res = await axios.get<SearchIndividualModel.SearchIndividualRespons>(`/api/api/searchcollateral/`,{
            params:{
                ...this.reques_query.query
            }
        });if(res.status ===200){
            this.respons_data_reques = res.data.results
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້",
        });
      } finally {
        this.isLoading = false;
        this.reques_query.isLoading = false;
      }
    },
  },
});
