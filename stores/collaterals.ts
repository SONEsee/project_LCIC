import { defineStore } from "pinia";
import axios from "~/helpers/axios";
import pinia from "~/plugins/pinia";
import Swal from "sweetalert2";
import { CollateralModel } from "~/types";
export const CollateralStore = defineStore("collateral", {
  state() {
    return {
      response_data_collateral_list:
        null as CollateralModel.CollateralRespons | null,
      isLoading: false,
      filter_data:{
        isLoading:false,
        query:{
            user_id:"",
            year:"",
            month:"",
            start_date:"",
            end_date:"",
            day:"",

        }
      }
    };
  },
  actions: {
    async GetdsatCollateral() {
      this.isLoading = true;
      try {
        const res = await axios.get<CollateralModel.CollateralRespons>(`api/api/get_collaterals/`,{
            params:{
                ...this.filter_data.query
            }
        });if(res.status === 200){
            this.response_data_collateral_list =  res.data
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້",
        });
      }
    },
  },
});
