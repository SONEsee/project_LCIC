import axios from "~/helpers/axios";
import { defineStore } from "pinia";
import { DispustCallateralModel,AlertCallateralModel } from "~/types";
import Swal from "sweetalert2";
export const useDipustCallateralStore = defineStore("dispust", {
  state() {
    return {
      respons_data_dispust: null as DispustCallateralModel.Data | null,
      respons_data_dispust_allert: null as AlertCallateralModel.Item |null,
      respons_data_dispust_allert_count: null as AlertCallateralModel.Data |null,
      respons_data_detail_confirm_dispust:null as AlertCallateralModel.Dispute | null,
      pagination: null as AlertCallateralModel.Pagination | null,
      isLoading: false,
      data_fiter: {
        isLoading: false,
        query: {
          id_file: "",
          q: null as string | null,
          page_size: 20,
          page: 1,
        },
      },
    form_create_dispust: {
        file: null as File | null,
        dispute_ids: [] as number[],
        id_dispust: "" as string,
        user_insert: "" as string,
        user_id: "" as string,
        deception: "" as string,
      },
      data_filter_dispust: {
        isLoading: false,
        query: {
          bnk_code: "",
          filter_bnk_code: "",
          id_disput_loan: "",
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
    async getDataDispush() {
      this.isLoading = true;
      try {
        const res = await axios.get<DispustCallateralModel.DispustCollateralRepues>(`/api/api/datac/`,{
        params:{
            ...this.data_fiter.query
        }
      });if(res.status ===200){
        this.respons_data_dispust = res.data.data
      }
      } catch (error) {
        Swal.fire({
            icon:"error",
            title:"ຜິດພາດ",
            text:"ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້"
        })
      }finally{
        this.isLoading = false
      }
      
    },
        async createDispust() {
      this.isLoading = true;
      try {
        if (!this.form_create_dispust.file) {
          Swal.fire({
            icon: "warning",
            title: "ແຈ້ງເຕືອນ",
            text: "ກະລຸນາເລືອກເອກະສານຢັ້ງຢືນ",
          });
          return;
        }

        if (this.form_create_dispust.dispute_ids.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "ແຈ້ງເຕືອນ",
            text: "ກະລຸນາເລືອກລາຍການ Dispute ຢ່າງໜ້ອຍ 1 ລາຍການ",
          });
          return;
        }

        const formData = new FormData();
        formData.append("file", this.form_create_dispust.file);
        formData.append(
          "dispute_ids",
          JSON.stringify(this.form_create_dispust.dispute_ids)
        );
        formData.append("id_dispust", this.form_create_dispust.id_dispust);
        formData.append("user_id", this.form_create_dispust.user_id);
        formData.append(
          "user_insert",
          String(this.form_create_dispust.user_insert)
        );

        const res = await axios.post(`/api/api/disputes/confirmc/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201 || res.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "ສຳເລັດ",
            text: res.data.message || "ບັນທຶກຂໍ້ມູນສຳເລັດ",
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            goPreviousPath();
          }, 1000);

          

          await this.getDataDispush();
        }
      } catch (error: any) {
        console.error("Upload error:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.errors?.join(", ") ||
          "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ";

        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: errorMessage,
        });
      } finally {
        this.isLoading = false;
      }
    },
        async getDataDispust() {
      this.isLoading = true;
      this.data_filter_dispust.isLoading = true;
      try {
        const res = await axios.get<AlertCallateralModel.AllertDispustCallateralRepues>(
          `/api/api/dispute-collateral/`,
          {
            params: {
              ...this.data_filter_dispust.query,
            },
          }
        );
        if (res.status === 200) {
          this.respons_data_dispust_allert = res.data.data.items;
          this.respons_data_dispust_allert_count = res.data.data
          
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
            const res  =await axios.get<AlertCallateralModel.ConfirmCallateralRepues>(`/api/api/disputes-by-confirm_collateral/`,{
                params:{
                    ...this.data_edit_filter.query
                }
            });if(res.status===200){
                this.respons_data_detail_confirm_dispust= res.data.data.disputes
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
