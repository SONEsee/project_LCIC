import { defineStore } from "pinia";
import axios from "~/helpers/axios";
import pinia from "~/plugins/pinia";
import Swal from "sweetalert2";
import { CollateralModel, CollateralResponsModel } from "~/types";
export const CollateralStore = defineStore("collateral", {
  state() {
    const userString = localStorage.getItem("user");
    const userLogin = userString ? JSON.parse(userString) : null;
    return {
      user_login: userLogin,
      response_data_collateral_detail:
        null as CollateralResponsModel.Data | null,
      response_data_collateral_detail_count:
        null as CollateralResponsModel.Summary | null,
      query_data_detail: {
        query:{
          CID: "",
        page: 1,
        page_size: 20,
        },
        isLoading: false,
        
      },

      response_data_collateral_list:
        null as CollateralModel.CollateralRespons | null,
      response_data_collateral_list_all:
        null as CollateralModel.CollateralRespons | null,
      isLoading: false,
      filter_data: {
        isLoading: false,
        query: {
          user_id: "",
          year: "",
          month: "",
          start_date: "",
          end_date: "",
          day: "",
          current_user_id: "",
        },
      },
      pagination: {
        current_page: 1,
        page_size: 20,
        total_pages: 0,
        total_items: 0,
        has_next: false,
        has_previous: false,
      },
    };
  },
  actions: {
    async GetdsatCollateral() {
      this.isLoading = true;
      try {
        const res = await axios.get<CollateralModel.CollateralRespons>(
          `api/api/get_collaterals/`,
          {
            params: {
              ...this.filter_data.query,
            },
          }
        );
        if (res.status === 200) {
          this.response_data_collateral_list = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້",
        });
      }
    },
    async GetdsatCollateralall() {
      this.isLoading = true;
      try {
        const res = await axios.get<CollateralModel.CollateralRespons>(
          `api/api/get_collaterals/`,
          {
            params: {
              ...this.filter_data.query,
            },
          }
        );
        if (res.status === 200) {
          this.response_data_collateral_list_all = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້",
        });
      }
    },
    async GetdataCollateralDetail(){
      this.isLoading = true;
      try {
        const res = await axios.get<CollateralResponsModel.ColltateralDataRespons>(`/api/api/productinfoc3/`,{
          params:{
            ...this.query_data_detail.query
          }
        });if(res.status === 200){
          this.response_data_collateral_detail = res.data.data;
          this.response_data_collateral_detail_count = res.data.summary;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້",
        })
      }finally{
        this.isLoading = false;
      }
    }
  },
});
