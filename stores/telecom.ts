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
          text: "ທ່ານຕອ້ງການບັນທຶກຂໍ້ມູນນີ້ແທ້ບໍ",
        });
        if (notification.isConfirmed) {
          const formData = new FormData();
          formData.append("file", this.form_insert_json.file as Blob),
            formData.append("user_id", this.form_insert_json.user_id),
            formData.append("telecomType", this.form_insert_json.telecomType),
            formData.append("period", this.form_insert_json.period);

          const req = await axios.post(`/api/upload-json-telecom/`,formData);
          if (req.status === 201) {
            Swal.fire({
              icon: "success",
              title: "ສຳເລັດ",
              text: "ສ້າງຂໍ້ມູນສຳເລັດ",
              showConfirmButton:false,
              timer:1500
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error", 
          title: "ຜຶດພາດ",
          text: "ບໍ່ສາມາດສ້າງຂໍ້ມູນໄດ້ ຜຶດພາດ",
        });
      }
    },
    async GetdataTelecom(){
this.isLoading = true
try {
    
    const res =await axios.get<telecomModel.UploadTelecomRespons>(`/api/telecom-file/`,{
        params:{
            ...this.query_limit
        }
    });if(res.status===200){
        this.respons_data_tecom_file_list = res.data
    }
} catch (error) {
    Swal.fire({
        icon:"error",
        title:"ຜຶດພາດ",
        text:"ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້"
    })
}finally{
    this.isLoading =false
}
    }
  },
});
