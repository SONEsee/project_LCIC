import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "~/helpers/axios";
import { SearchIndividualModel } from "~/types";

type ErrorCode =
  | "MISSING_USER_ID"
  | "NO_FILES"
  | "INVALID_FILE_TYPE"
  | "INVALID_JSON"
  | "MISSING_BNK_CODE"
  | "MISMATCH_BNK_CODE"
  | "FILE_EXISTS"
  | "INVALID_FILE_NAME"
  | "INVALID_PERIOD_FORMAT"
  | "PERIOD_TOO_OLD"
  | "INVALID_B1_PERIOD"
  | "BANK_NOT_FOUND"
  | "UNEXPECTED_ERROR";

const ERROR_MESSAGES = {
  MISSING_USER_ID: "ກະລຸນາປ້ອນ User ID",
  NO_FILES: "ກະລຸນາເລືອກໄຟລ໌ທີ່ຕ້ອງການອັບໂຫຼດ",
  INVALID_FILE_TYPE: "ຕ້ອງເປັນໄຟລ໌ .json ເທົ່ານັ້ນ",
  INVALID_JSON: "ເນື້ອໃນ JSON ບໍ່ຖືກຕ້ອງ",
  MISSING_BNK_CODE: "ບໍ່ພົບ bnk_code ໃນໄຟລ໌",
  MISMATCH_BNK_CODE: "User ID ບໍ່ກົງກັບ bnk_code ໃນໄຟລ໌",
  FILE_EXISTS: "ໄຟລ໌ຊື່ນີ້ມີແລ້ວ ກະລຸນາປ່ຽນຊື່",
  INVALID_FILE_NAME: "ຮູບແບບຊື່ໄຟລ໌ບໍ່ຖືກຕ້ອງ",
  INVALID_PERIOD_FORMAT: "ຮູບແບບເດືອນ/ປີ ບໍ່ຖືກຕ້ອງ (ຕົວຢ່າງ: 102024)",
  PERIOD_TOO_OLD: "ບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນເດືອນໃນອະດີດ",
  INVALID_B1_PERIOD: "ຂໍ້ມູນ B1 ມີບັນຫາ",
  BANK_NOT_FOUND: "ບໍ່ພົບທະນາຄານນີ້ໃນລະບົບ",
  UNEXPECTED_ERROR: "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ",
} as const;

interface UploadSuccess {
  file_name: string;
  file_id: number;
  period: string;
  status: string;
}

interface UploadError {
  file_name: string;
  error_code: ErrorCode;
  message?: string;
}

interface UploadResponse {
  status: "success" | "partial" | "error";
  message?: string;
  uploaded?: UploadSuccess[];
  success?: UploadSuccess[];
  errors?: UploadError[];
  error_code?: ErrorCode;
}

export const IndividualStore = defineStore("individual", {
  state() {
    return {
      token: localStorage.getItem("access_token"),
      isLoading: false,
      respons_data_reques: null as SearchIndividualModel.Result | null,
      respons_list_file_insdividual_loan:
        null as SearchIndividualModel.IndividualFileListRespons | null,
      Pagination:
        null as SearchIndividualModel.IndividualFileListRespons | null,
      respons_data_reques_search:
        null as SearchIndividualModel.ResultMapsearch | null,
      respons_data_reques_period:
        null as SearchIndividualModel.PerliodIndividualFileListRespons | null,
      reques_query: {
        isLoading: false,
        query: {
          lcic_id: "",
          customerid: "",
          bnk_code: "",
        },
      },
      reques_mapsearch: {
        isLoading: false,
        query: {
          lcic_id: "",
        },
      },
      from_insert_logserch: {
        lcic_id: "",
        CatalogID: "LOAN_PURPOSE_01",
      },
      loan_query: {
        isLoading: false,
        query: {
          user_id: "",
          user_id_filter: "",
          period: "",
          statussubmit: "",
          FileType: "",
          page: 1,
          limit: 20,
        },
      },
      from_upload_file: {
        user_id: "",
        file: null as File | null,
      },
      period: {
        query: {
          user_id: "",
        },
        isLoading: false,
      },
    };
  },
  actions: {
    async saerchListIndividual() {
      this.isLoading = true;
      this.reques_query.isLoading = true;
      try {
        const res =
          await axios.get<SearchIndividualModel.SearchIndividualRespons>(
            `/api/api/searchcollateral/`,
            {
              params: {
                ...this.reques_query.query,
              },
            }
          );
        if (res.status === 200) {
          this.respons_data_reques = res.data.results;
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
    async saerchMapIndividual() {
      this.isLoading = true;
      this.reques_query.isLoading = true;
      try {
        const res = await axios.get<SearchIndividualModel.MapsearchRespons>(
          `/api/api/searchcollateral-info/`,
          {
            params: {
              ...this.reques_mapsearch.query,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          this.respons_data_reques_search = res.data.results;
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
    async getListIndividualLoan() {
      this.isLoading = true;
      this.reques_query.isLoading = true;
      try {
        const res =
          await axios.get<SearchIndividualModel.IndividualFileListRespons>(
            `/api/api/individual-files/`,
            {
              params: {
                ...this.loan_query.query,
              },
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        if (res.status === 200) {
          this.respons_list_file_insdividual_loan = res.data;
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

    async CreatInsertLog() {
      this.isLoading = true;
      try {
        const req = await axios.post(
          `/api/api/search-individual/`,
          this.from_insert_logserch,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (req.status === 200) {
          this.isLoading = false;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດຄົ້ນຫາເອົາບົດລາຍງານໄດ້ ",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async UploadFile() {
      this.isLoading = true;
      try {
        if (!this.from_upload_file.file) {
          await Swal.fire({
            icon: "warning",
            title: "ຄຳເຕືອນ",
            text: "ກະລຸນາເລືອກໄຟລ໌ທີ່ຕ້ອງການອັບໂຫຼດກ່ອນ",
          });
          return;
        }

        const formData = new FormData();
        formData.append("file", this.from_upload_file.file);
        formData.append("user_id", this.from_upload_file.user_id);

        const req = await axios.post<UploadResponse>(
          `/api/upload-files-individual-loan/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = req.data;

        if (data.status === "success") {
          await Swal.fire({
            icon: "success",
            title: "ສຳເລັດ",
            text: data.message || "ອັບໂຫຼດຂໍ້ມູນສຳເລັດແລ້ວ",
            timer: 1500,
            showConfirmButton: false,
          });
          await this.getListIndividualLoan();
          return;
        }

        if (data.status === "partial") {
          const successMsg = `ອັບໂຫຼດສຳເລັດ: ${
            data.success?.length ?? 0
          } ໄຟລ໌\n`;

          const errorMsg = (data.errors ?? [])
            .map(
              (err: UploadError) =>
                `• ${err.file_name}: ${this.getErrorMessage(err.error_code)}`
            )
            .join("\n");

          await Swal.fire({
            icon: "warning",
            title: "ອັບໂຫຼດສຳເລັດບາງສ່ວນ",
            html: `<pre style="text-align:left;font-size:14px">${successMsg}${errorMsg}</pre>`,
            width: "600px",
            confirmButtonText: "ຕົກລົງ",
          });
          await this.getListIndividualLoan();
          return;
        }
      } catch (error: any) {
        const res = error.response;
        if (res?.data) {
          const data = res.data as UploadResponse;

          if (data.error_code) {
            await Swal.fire({
              icon: "error",
              title: "ຜິດພາດ",
              text: this.getErrorMessage(data.error_code),
            });
            return;
          }

          if (data.errors && Array.isArray(data.errors)) {
            const errorList = data.errors
              .map(
                (err: UploadError) =>
                  `• ${err.file_name}: ${this.getErrorMessage(err.error_code)}`
              )
              .join("\n");

            await Swal.fire({
              icon: "error",
              title: "ການອັບໂຫຼດລົ້ມເຫຼວ",
              html: `<pre style="text-align:left;font-size:14px">${errorList}</pre>`,
              width: "600px",
            });
            return;
          }
        }

        await Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ ກະລຸນາລອງໃໝ່",
        });
      } finally {
        this.isLoading = false;
      }
    },

    getErrorMessage(code: ErrorCode | string | undefined): string {
      if (!code || !(code in ERROR_MESSAGES)) {
        return "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ";
      }
      return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
    },
    async getPeriod() {
      this.isLoading = true;
      try {
        const res = await axios.get(`/api/api/individual-file-periods/`, {
          params: {
            ...this.period.query,
          },
        });
        if (res.status === 200) {
          this.respons_data_reques_period = res.data;
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ ກະລຸນາລອງໃໝ່",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
  // async UploadFile() {
  //   this.isLoading = true;
  //   try {
  //     if(!this.from_upload_file.file){
  //       Swal.fire({
  //         icon:"warning",
  //         title:"ຄຳເຕືອນ",
  //         text:"ກະລຸນສາເລືອກຟາຍທີອັບໂຫຼດກອ່ນ"
  //       })
  //       return;
  //     }
  //     const formData = new FormData()
  //     formData.append("file", this.from_upload_file.file),
  //     formData.append("user_id",this.from_upload_file.user_id)
  //     const req = await axios.post(`/api/upload-files-individual-loan/`,formData);
  //     if(req.status===200 || req.status===201){
  //       Swal.fire({
  //         icon:"success",
  //         title:"ສຳເລັດ",
  //         text:"ອັບໂຫຼດຂໍ້ມູນສຳເລັດແລ້ວ",
  //         timer:1000,
  //         showConfirmButton:false

  //       })
  //       await this.getListIndividualLoan()
  //     }
  //   } catch (error) {

  //   } finally {
  //     this.isLoading = false;
  //   }
  // },
});
