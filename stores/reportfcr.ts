import { defineStore } from "pinia";
import { ref } from "vue";
import { ReportModel } from "~/types";
import axios from "axios";

export const useReeportFCRStore = defineStore("reportFCR", {
  state() {
    return {
      config: useRuntimeConfig(),
      respon_data_activeloan: null as ReportModel.ActiveLoan[] | null,
      respon_data_enterprisinfo: null as ReportModel.EnterpriseInfo[] | null,
      respon_data_invesinfo: null as ReportModel.InvesInfo[] | null,
      respon_data_loaninfo: null as ReportModel.LoanInfo[] | null,
      respon_data_searchhistory: null as ReportModel.SearchHistory[] | null,
      loading: ref(false),
      error: ref(false),
    };
  },
  actions: {
    async GetdataReportFCR(enterpriseID: string, LCIC_code: string ,CatalogID: string) {
      this.loading = true;
      this.error = false;
      try {
        const res = await axios.get(
          `${this.config.public.strapi.url}api/report/?EnterpriseID=${enterpriseID}&LCIC_code=${LCIC_code}`
        );
        if(res.status ===200){
          this.respon_data_activeloan = res.data.data.active_loans;
          console.log("respon_data_activeloan", this.respon_data_activeloan);
          this.respon_data_enterprisinfo = res.data.data.enterprise_info;
          console.log("respon_data_enterprisinfo", this.respon_data_enterprisinfo);
          this.respon_data_invesinfo = res.data.data.inves_info;
            console.log("respon_data_invesinfo", this.respon_data_invesinfo);
          this.respon_data_loaninfo = res.data.data.loan_info;
            console.log("respon_data_loaninfo", this.respon_data_loaninfo);
          this.respon_data_searchhistory = res.data;
            console.log("respon_data_searchhistory", this.respon_data_searchhistory);
        }
        this.loading = false;
      } catch (error: any) {
        this.error = true;
        console.error("Error fetching data:", error);
      }
    },
  },
});
