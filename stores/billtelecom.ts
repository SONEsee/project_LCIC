import axios from "~/helpers/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { billtelecomModel } from "~/types";

export const useBillTelecom = defineStore("billtelecom", {
  state() {
    return {
      // ຂໍ້ມູນທີ່ດຶງມາຈາກ API
      respons_data_billtelecom_list: null as billtelecomModel.BillTelecomRespons | null,
      
      // ຕົວເລືອກການດຶງຂໍ້ມູນ
      query_list: {
        page: 1,
        limit: 20
      },
      
      // ຟອມສຳລັບອັບໂຫຼດໄຟລ໌
      form_insert_json: {
        file: null as File | null,
        user_id: "",
        period: ""
      },
      
      // ສະຖານະການໂຫຼດ
      isLoading: false
    }
  },

  actions: {
    // 📥 ດຶງຂໍ້ມູນບິນ
    async GetdataBillTelecom() {
      this.isLoading = true;
      try {
        const res = await axios.get<billtelecomModel.BillTelecomRespons>(
          `/api/telecom_bill/`,
          {
            params: {
              ...this.query_list
            }
          }
        );
        
        if (res.status === 200) {
          this.respons_data_billtelecom_list = res.data;
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້"
        });
      } finally {
        this.isLoading = false;
      }
    },

    // 📤 ອັບໂຫຼດໄຟລ໌ JSON
    async CreateBill() {
  if (!this.form_insert_json.file) {
    Swal.fire({
      icon: "error",
      title: "ຂໍ້ຜິດພາດ",
      text: "ກະລຸນາເລືອກໄຟລ໌"
    });
    return;
  }

  this.isLoading = true;

  const formData = new FormData();
  formData.append("file", this.form_insert_json.file);
  formData.append("user_id", this.form_insert_json.user_id);
  formData.append("telecomType", "Bill");
  formData.append("period", this.form_insert_json.period);

  try {
    const res = await axios.post("/api/upload-bill/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200 || res.status === 201) {
      const { fileName, fileSize, summary } = res.data;

      await Swal.fire({
        icon: "success",
        title: "ອັບໂຫຼດສຳເລັດ!",
        html: `
          <div class="swal-result">
            <div class="result-item">
              <span class="label">ໄຟລ໌:</span>
              <span class="value">${fileName} (${fileSize})</span>
            </div>
            <hr>
            <div class="result-item">
              <span class="label">ທັງໝົດ:</span>
              <span class="value">${summary.total_in_file} ແຖວ</span>
            </div>
            <div class="result-item success">
              <span class="label">ເພີ່ມໃໝ່:</span>
              <span class="value">${summary.new_bills_added} ແຖວ</span>
            </div>
            <div class="result-item warning" >
              <span class="label">ຂ້າມຊ້ຳ:</span>
              <span class="value">${summary.duplicates_skipped} ແຖວ</span>
            </div>
          </div>
          <style>
            .result-item {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 8px;
              border-radius: 4px;
              background: #f5f5f5;
            }
            .result-item.success {
              background: #e8f5e9;
            }
            .result-item.warning {
              background: #fff3e0;
            }
            .result-item .label {
              font-weight: 600;
            }
            .result-item .value {
              color: #666;
            }
            hr {
              margin: 15px 0;
              border: none;
              border-top: 1px solid #ddd;
            }
          </style>
        `,
        confirmButtonText: "ຕົກລົງ",
        width: '500px'
      });

      // ລ້າງຟອມ
      this.form_insert_json.file = null;
      this.form_insert_json.user_id = "";
      this.form_insert_json.period = "";

      // ດຶງຂໍ້ມູນໃໝ່
      await this.GetdataBillTelecom();
    }
  } catch (error: any) {
    console.error('Upload Error:', error);
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: error.response?.data?.message || "ບໍ່ສາມາດອັບໂຫຼດໄຟລ໌ໄດ້"
    });
  } finally {
    this.isLoading = false;
  }
}

  }
});