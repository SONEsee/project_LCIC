import axios from "~/helpers/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { telecomModel } from "~/types";

export const useTelecom = defineStore("telecom", {
  state() {
    return {
        respons_data_tecom_file_list: null as telecomModel.UploadTelecomRespons | null,
        query_limit:{
            page:1,
            limit:20
        },
        isLoading: false,
      form_insert_json: {
        file: null as File | null,
        user_id: "",
        telecomType: "",
        period: "2025-01",
      },
    };
  },
  actions: {
    async CreateCustomer() {
      try {
        const notification = await Swal.fire({
          icon: "question",
          title: "ຢືນຢັນ",
          text: "ທ່ານຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ແທ້ບໍ",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ"
        });
        
        if (notification.isConfirmed) {
          // ສະແດງ Loading ກຳລັງອັບໂຫຼດ
          Swal.fire({
            title: "ກຳລັງອັບໂຫຼດ...",
            html: "ກະລຸນາລໍຖ້າ",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const formData = new FormData();
          formData.append("file", this.form_insert_json.file as Blob);
          formData.append("user_id", this.form_insert_json.user_id);
          formData.append("telecomType", this.form_insert_json.telecomType);
          formData.append("period", this.form_insert_json.period);

          const req = await axios.post(`/api/upload-json-telecom/`, formData);
          
          if (req.status === 201) {
            // ປິດ Loading ແລະສະແດງຜົນສຳເລັດ
            await Swal.fire({
              icon: "success",
              title: "ສຳເລັດ",
              text: "ອັບໂຫຼດຂໍ້ມູນສຳເລັດ",
              showConfirmButton: false,
              timer: 1500
            });
            
            // ຣີໂຫຼດຕາຕະລາງຫຼັງອັບໂຫຼດສຳເລັດ
            await this.GetdataTelecom();
            
            // ລ້າງຟອມ (ຖ້າຕ້ອງການ)
            this.form_insert_json = {
              file: null,
              user_id: "",
              telecomType: "",
              period: "2025-01",
            };
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນໄດ້",
        });
      }
    },
    
    async GetdataTelecom(){
      this.isLoading = true;
      try {
        const res = await axios.get<telecomModel.UploadTelecomRespons>(`/api/telecom-file/`, {
          params: {
            ...this.query_limit
          }
        });
        
        if(res.status === 200){
          this.respons_data_tecom_file_list = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້"
        });
      } finally {
        this.isLoading = false;
      }
    }
  },
});