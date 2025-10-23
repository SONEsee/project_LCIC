import { goPreviousPath } from "./../composables/global";
import { defineStore } from "pinia";
import axios from "~/helpers/axios";
import pinia from "~/plugins/pinia";
import Swal from "sweetalert2";
import { LoanDataModel } from "~/types";

export const useLoanStore = defineStore("loan", {
  state() {
    return {
      isLoading: false,
      respons_data_loan_list: null as LoanDataModel.Data | null,
      pagination: {
        current_page: 1,
        page_size: 20,
        total_pages: 0,
        total_items: 0,
        has_next: false,
        has_previous: false,
      },
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
        deception: "test" as string,
      },
      from_confirm_dispust: {
        id_dispust_list: [] as number[],
      },
      update_status: {
        status: "APPROVED",
        user_update: "",
      },
    };
  },
  actions: {
    async UpdateStatus(id: string) {
      this.isLoading = true;
      try {
       const req = await axios.patch(
        `/api/api/dispute-loan/${id}/status/`,
        this.update_status
      );if(req.status ===201 || req.status ===200 || req.status ===203) {
         this.isLoading = false;
      }
      } catch (error) {
        Swal.fire({
          icon:"error",
          title:"ຜິດພາດ",
          text:"ບໍ່ສາມາດອັບເດດຂໍ້ມູນໄດ້"
        })
      }finally{
         this.isLoading = false;
      }
      
    },
    async getDataLoan() {
      this.isLoading = true;
      try {
        const res = await axios.get<LoanDataModel.LoanDataRespons>(
          `/api/api/data/`,
          {
            params: {
              ...this.data_fiter.query,
            },
          }
        );
        if (res.status === 200) {
          this.respons_data_loan_list = res.data.data;
          console.log("check data", this.respons_data_loan_list);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: `ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້ເນື້ອງຈາກ ${error}`,
        });
      } finally {
        this.isLoading = false;
      }
    },
    // ໃນ Store
    async confirmDitpust() {
      this.isLoading = true;
      try {
        const req = await axios.post(
          `/api/process-multiple-disputes/`,
          this.from_confirm_dispust
        );

        if (req.status === 200 || req.status === 201) {
          const data = req.data;

          await Swal.fire({
            icon: "success",
            title: "ສຳເລັດ",
            html: `
          <p>ປະມວນຜົນສຳເລັດ ${data.summary.success}/${
              data.summary.total
            } ລາຍການ</p>
          ${
            data.summary.failed > 0
              ? `<p style="color: red;">ຜິດພາດ: ${data.summary.failed} ລາຍການ</p>`
              : ""
          }
        `,
          });

          this.isLoading = false;

          await this.getDataLoan();
        }
      } catch (error: any) {
        this.isLoading = false;

        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text:
            error?.response?.data?.message || `ບໍ່ສາມາດປະມວນຜົນໄດ້: ${error}`,
        });
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

        const res = await axios.post(`/api/api/disputes/confirm/`, formData, {
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

          this.resetForm();

          await this.getDataLoan();
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

    // ລ້າງຟອມຫຼັງບັນທຶກສຳເລັດ
    resetForm() {
      this.form_create_dispust = {
        file: null,
        dispute_ids: [],
        id_dispust: "",
        user_id: "",
        user_insert: "",
        deception: "",
      };
    },
  },
});
// stores/loan.ts
// import { defineStore } from "pinia";
// import axios from "~/helpers/axios";
// import pinia from "~/plugins/pinia";
// import Swal from "sweetalert2";
// import { LoanDataModel } from "~/types";

// export const useLoanStore = defineStore("loan", {
//   state() {
//     return {
//       isLoading: false,
//       respons_data_loan_list: null as LoanDataModel.Data | null,

//       counts: {
//         data_edit: 0,
//         b_data_damaged: 0,
//         disputes: 0,
//         b1_monthly: 0,
//       },

//       currentData: [] as any[],
//       pagination: {
//         current_page: 1,
//         page_size: 20,
//         total_pages: 0,
//         total_items: 0,
//         has_next: false,
//         has_previous: false,
//       },

//       data_fiter: {
//         isLoading: false,
//         query: {
//           id_file: "",
//           type: "counts",
//           page: 1,
//           page_size: 20,
//         },
//       },
//     };
//   },

//   actions: {
//     async getCounts() {
//       this.isLoading = true;
//       try {
//         const res = await axios.get(`/api/api/data/`, {
//           params: {
//             id_file: this.data_fiter.query.id_file,
//             type: "counts",
//           },
//         });

//         if (res.status === 200) {
//           this.counts = res.data.counts;
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "ຜິດພາດ",
//           text: `ບໍ່ສາມາດດຶງຂໍ້ມູນນັບໄດ້: ${error}`,
//         });
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async getDataByType(type: string, page: number = 1, pageSize: number = 20) {
//       this.isLoading = true;
//       try {
//         const res = await axios.get<LoanDataModel.LoanDataRespons>(
//           `/api/api/data/`,
//           {
//             params: {
//               ...this.data_fiter.query,
//             },
//           }
//         );

//         if (res.status === 200) {
//           this.respons_data_loan_list = res.data.data;
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "ຜິດພາດ",
//           text: `ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້: ${error}`,
//         });
//         this.currentData = [];
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async getDataLoan() {
//       await this.getCounts();
//     },
//   },
// });
