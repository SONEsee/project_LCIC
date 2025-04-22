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
      respons_lon_class_history: null as ReportModel.LonClassHistory[] | null,
      loading: ref(false),
      error: ref(false),
    };
  },
  actions: {
    
    async GetdataReportFCR(
      enterpriseID: string,
      LCIC_code: string,
      CatalogID: string
    ) {
      this.loading = true;
      this.error = false;
      try {
        const res = await axios.get<ReportModel.ReportRespose>(
          `${this.config.public.strapi.url}api/report/?EnterpriseID=${enterpriseID}&LCIC_code=${LCIC_code}&CatalogID=${CatalogID}`
        );
        if (res.status === 200) {
          this.respon_data_activeloan = res.data.active_loans;
          this.respon_data_enterprisinfo = res.data.enterprise_info;
          this.respon_data_invesinfo = res.data.inves_info;
          this.respon_data_loaninfo = res.data.loan_info;
          this.respon_data_searchhistory = res.data.search_history;
        }
        this.loading = false;
        return res.data;
      } catch (error: any) {
        this.error = true;
        console.error("Error fetching data:", error);
        throw error;
      }
    },

    async GetBatchReportsFCR(items: any[]) {
      this.loading = true;
      this.error = false;

      try {
        const params = items
          .map(
            (item) =>
              `items[]=${encodeURIComponent(
                JSON.stringify({
                  enterpriseId: item.enterpriseId,
                  lcicCode: item.lcicCode,
                  catalogId: item.catalogId,
                })
              )}`
          )
          .join("&");

        const res = await axios.get<ReportModel.ReportRespose>(
          `${this.config.public.strapi.url}api/report/?${params}`
        );

        if (res.status === 200) {
          return res.data.active_loans;
          console.log("Batch data:", res.data.active_loans);
        }

        this.loading = false;
        return [];
      } catch (error: any) {
        this.error = true;
        console.error("Error fetching batch data:", error);
        throw error;
      }
    },
  },
});
