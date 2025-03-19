import { defineStore } from "pinia";
import axios from "axios";
import { UtilityModel } from "~/types";

export const useUtilityStore = defineStore("utility", {
  state() {
    return {
      respons_query_data_utility: null as UtilityModel.UtilityRespons | null,
      respons_query_data_customer: null as UtilityModel.CustomerIems[] | null,
      respons_query_data_bill: null as UtilityModel.BillIems[] | null,
      respons_query_data_reference: null as UtilityModel.ReferenceDatumClass[] | null,
      loading: false,
      error: false,
      errorMessage: "" as string,
    };
  },
  actions: {
    async Getdata() {
      this.loading = true;
      this.error = false;
      this.errorMessage = "";

      this.respons_query_data_utility = null;
      this.respons_query_data_customer = null;
      this.respons_query_data_bill = null;
      this.respons_query_data_reference = null;

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const config = useRuntimeConfig();
const user = localStorage.getItem("user");
console.log("user", user);
const bnk_code = user ? JSON.parse(user).bnk_code : "";
console.log("bnk_code", bnk_code);
        const response = await axios.get<UtilityModel.UtilityRespons>(
          `${config.public.strapi.url}api/utility-report/?water=10120879`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.respons_query_data_utility = response.data;
        this.respons_query_data_customer = response.data.customer;
        this.respons_query_data_bill = response.data.bill;
        this.respons_query_data_reference = response.data.reference_data;
      } catch (error: any) {
        this.error = true;
        this.errorMessage =
          error.message || "An error occurred while fetching data";
        console.error("Error fetching utility data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
