import { UploadFile } from "~/types";
import axios from "~/helpers/axios";
import Swal from "sweetalert2";
import { defineStore } from "pinia";
export const useUploadFile = defineStore("upload", {
  state() {
    return {
      respose_uploadfile_b: null as UploadFile.Result | null,
      respose_uploadfile_c: null as UploadFile.ResultC | null,
      response_total_b:null as UploadFile.UploadFileBRespons | null,
      isLoading: false,
      filter_data_b:{
        isLoading:false,
        query:{
            period:"",
            user_id:"",
            request_user_id:"",
            status:"",
            file_type:""
        },
        
      }
    };
  },
  actions: {
    async getDataUplodB() {
      this.isLoading = true;
      try {
        const config = useRuntimeConfig();
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await axios.get<UploadFile.UploadFileBRespons>(`/api/upload-files2/`,{
            headers:{
                 Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params:{
                ...this.filter_data_b.query
            }
        });

        if(res.status===200){
            this.respose_uploadfile_b = res.data.results
        }

      } catch (error) {
        Swal.fire({
            icon:"error",
            title:"ຜິດພາດ",
            text:"ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້"
        })
      } finally {
        this.isLoading = false;
      }
    },
    async getTotalData() {
      this.isLoading = true;
      try {
        const config = useRuntimeConfig();
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await axios.get<UploadFile.UploadFileBRespons>(`/api/upload-files2/`,{
            headers:{
                 Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params:{
                ...this.filter_data_b.query
            }
        });

        if(res.status===200){
            this.response_total_b = res.data
        }

      } catch (error) {
        Swal.fire({
            icon:"error",
            title:"ຜິດພາດ",
            text:"ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້"
        })
      } finally {
        this.isLoading = false;
      }
    },
    async getDataUplodC() {
      this.isLoading = true;
      try {
        const config = useRuntimeConfig();
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await axios.get<UploadFile.UploadFileCRespons>(`/api/upload-files2/`,{
            headers:{
                 Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params:{
                ...this.filter_data_b.query
            }
        });

        if(res.status===200){
            this.respose_uploadfile_c = res.data.results
        }

      } catch (error) {
        Swal.fire({
            icon:"error",
            title:"ຜິດພາດ",
            text:"ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້"
        })
      } finally {
        this.isLoading = false;
      }
    },
  },
});
