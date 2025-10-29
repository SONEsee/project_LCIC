
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "~/helpers/axios";
import { SearchIndividualModel } from "~/types";
export const IndividualStore = defineStore("individual", {
  state() {
    return {
       token : localStorage.getItem("access_token"),
      isLoading: false,
      respons_data_reques: null as SearchIndividualModel.Result | null,
      respons_list_file_insdividual_loan: null as SearchIndividualModel.IndividualFileListRespons|null,
      Pagination: null as SearchIndividualModel.IndividualFileListRespons |null,
      respons_data_reques_search:
        null as SearchIndividualModel.ResultMapsearch | null,
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
      from_insert_logserch:{
        lcic_id:"",
        CatalogID:"LOAN_PURPOSE_01"
      },
      loan_query:{
        isLoading:false,
        query:{
          user_id:"",
          user_id_filter:"",
          period:"",
          statussubmit:"",
          FileType:"",
          page:1,
          limit:2,
          
        }
      }
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
            headers:{
              "Content-Type": "application/json",
              
            }
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
        const res = await axios.get<SearchIndividualModel.IndividualFileListRespons>(
          `/api/api/individual-files/`,
          {
            params: {
              ...this.loan_query.query,
            },
            headers:{
              "Content-Type": "application/json",
              
            }
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

    async CreatInsertLog(){
        this.isLoading=true
        try {
           const req = await axios.post(`/api/api/search-individual/`, this.from_insert_logserch,{
            headers: {
              Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            },
           });
           if(req.status===200){
            this.isLoading= false
           }
            
        } catch (error) {
            Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດຄົ້ນຫາເອົາບົດລາຍງານໄດ້ ",
        });
        }finally{
            this.isLoading= false
        }
    },
  },
});
