import axios from "~/helpers/axios";
import { DispustRequesModel, DispustEditModel } from "~/types";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
export const useRequesDispustStore = defineStore("requesdispust", {
  state() {
    return {
      response_data_dispust: null as DispustRequesModel.Data | null,
      response_data_dispust_count: null as DispustRequesModel.Pagination | null,
      response_dispust_data_edit: null as DispustEditModel.Data | null,
      isLoading: false,
      data_filter_dispust: {
        isLoading: false,
        query: {
          bnk_code: "",
          filter_bnk_code: "",
          page: 1,
          page_size: 20,
        },
      },
      data_edit_filter:{
        isLoading:false,
        query:{
            page:1,
            page_size:20,
            confirm_dispust_id:"",
        }
      }
    };
  },
  actions: {
    async getDataDispust() {
      this.isLoading = true;
      this.data_filter_dispust.isLoading = true;
      try {
        const res = await axios.get<DispustRequesModel.DispustRepues>(
          `/api/api/dispute-loans/?`,
          {
            params: {
              ...this.data_filter_dispust.query,
            },
          }
        );
        if (res.status === 200) {
          this.response_data_dispust = res.data.data;
          this.response_data_dispust_count = res.data.data.pagination;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້.",
        });
      } finally {
        this.isLoading = false;
        this.data_filter_dispust.isLoading = false;
      }
    },
    async getDataDispustEdit(){
        this.isLoading=true
        try {
            const res  =await axios.get<DispustEditModel.DispustEditRepues>(`/api/api/disputes-by-confirm/`,{
                params:{
                    ...this.data_edit_filter.query
                }
            });if(res.status===200){
                this.response_dispust_data_edit= res.data.data
            }
        } catch (error) {
           Swal.fire({
            icon:"error",
            title:"ຜິດພາດ" ,
            text:"ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້"
           }) 
        }finally{
            this.isLoading = false
        }
    }
  },
});
