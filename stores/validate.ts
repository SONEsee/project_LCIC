import { defineStore } from "pinia";
import axios from "axios";
import { ValidateResponse } from "~/types";

export const useValidateStore = defineStore("validate", {
  state: () => {
    return {
      response_data_validate: null as ValidateResponse.items[] | null,
      loading: false,
      error: null as string | null,
    };
  },
  actions: {
    async Getdata() {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      try {
        console.log("API URL:", `${config.public.strapi.url}api/upload-filesc2/`);
        
        const res = await axios.get<ValidateResponse.ValidateResponse>(
          `${config.public.strapi.url}api/api/upload-filesc2/`
        );
        
        console.log("Full API response:", res);
        
        if (res.data && res.data.items) {
          this.response_data_validate = res.data.items;
          console.log("Parsed data:", this.response_data_validate);
        } else {
          console.error("API response missing expected format:", res.data);
          this.error = "API response format incorrect";
        }
        
        this.loading = false;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          this.error = "Error fetching data: " + (error.response?.data?.message || error.message);
        } else {
          console.error("Unexpected error:", error);
          this.error = "Unexpected error: " + error;
        }
        this.loading = false;
      }
    },
  }
});