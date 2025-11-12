import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "~/helpers/axios";
import { SearchIndividualModel } from "~/types";

export const IndividualStore = defineStore("individual", {
  state() {
    return {
      token: localStorage.getItem("access_token"),
      isLoading: false,
      respons_data_reques: null as SearchIndividualModel.Result | null,
      type_search_response: null as SearchIndividualModel.TypeSearchRespons[] | null,
      respons_list_file_insdividual_loan:
        null as SearchIndividualModel.IndividualFileListRespons | null,
      Pagination:
        null as SearchIndividualModel.IndividualFileListRespons | null,
      respons_data_reques_search:
        null as SearchIndividualModel.ResultMapsearch | null,
      respons_data_reques_period:
        null as SearchIndividualModel.PerliodIndividualFileListRespons | null,
      
      response_insert_log: null as {
        search_log_id?: number;
        charge_id?: number;
        rec_reference_code?: string;
        rec_sys_id?: number;
        customerid?: string;
        lcic_id?: string;
        rec_insert_date?: string;
      } | null,
      
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
        CatalogID: "",
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
      insert_fid: {
        FID: "",
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
          `/api/api/scoring-individual/`,
          this.from_insert_logserch,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (req.status === 200 || req.status === 201) {
          const responseData = req.data;
          
          if (!responseData.success) {
            throw new Error("API returned success: false");
          }
          
          const createdLogs = responseData.created_logs;
          
          if (createdLogs && Array.isArray(createdLogs) && createdLogs.length > 0) {
            const firstLog = createdLogs[0];
            
            this.response_insert_log = {
              search_log_id: firstLog.search_log_id,
              charge_id: firstLog.charge_id,
              rec_reference_code: firstLog.rec_reference_code || "",
              rec_sys_id: firstLog.rec_sys_id || firstLog.charge_id,
              customerid: firstLog.customerid || "",
              lcic_id: firstLog.lcic_id || this.from_insert_logserch.lcic_id,
              rec_insert_date: firstLog.rec_insert_date || ""
            };
            
            const dataToStore = JSON.stringify(this.response_insert_log);
            sessionStorage.setItem("scoring_data", dataToStore);
            
            const verifyData = sessionStorage.getItem("scoring_data");
            
            if (verifyData) {
              await Swal.fire({
                icon: "success",
                title: "ສຳເລັດ",
                text: "ດຶງຂໍ້ມູນບົດລາຍງານສຳເລັດແລ້ວ",
                timer: 1500,
                showConfirmButton: false
              });
              
              return true;
            } else {
              throw new Error("Failed to save data to sessionStorage");
            }
            
          } else {
            throw new Error("No log data received from API");
          }
          
        } else {
          throw new Error(`Unexpected status code: ${req.status}`);
        }
        
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.details || 
                           error.message ||
                           "ບໍ່ສາມາດຄົ້ນຫາເອົາບົດລາຍງານໄດ້";
        
        await Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: errorMessage,
        });
        
        return false;
        
      } finally {
        this.isLoading = false;
      }
    },

    async getTypeSearch() {
      this.isLoading = true;
      try {
        const res = await axios.get<SearchIndividualModel.SearchIndividualRespons>(`/api/catalog-cats/`);
        if (res.status === 200 || res.status === 201) {
          this.type_search_response = res.data.typeserch || [];
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

    clearScoringData() {
      this.response_insert_log = null;
      sessionStorage.removeItem("scoring_data");
    },

    loadScoringDataFromSession() {
      try {
        const storedData = sessionStorage.getItem("scoring_data");
        if (storedData) {
          this.response_insert_log = JSON.parse(storedData);
          return this.response_insert_log;
        }
      } catch (error) {
        return null;
      }
      return null;
    }
  },
});