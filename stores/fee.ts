import { defineStore } from "pinia";
import axios from "axios";
import { FeeModel } from "@/types";

export const useFeesStore = defineStore("fees", {
  state() {
    return {
      form_create_data: {
        chg_code: "",
        chg_type: "",
        chg_lao_type: "",
        chg_desc: "",
        chg_lao_desc: "",
        chg_amount: 0,
        chg_unit: "",
      },
      response_data_fee: null as FeeModel.FeeRespons | null,
      loading: false,
      config: useRuntimeConfig(),
      response_detail_data: null as FeeModel.FeeDetail | null,
      error: null as string | null,
    };
  },
  actions: {
    async createFee() {
      this.loading = true;
      try {
        const qes = { ...this.form_create_data };

        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        await axios.post(`${this.config.public.strapi.url}api/charges/`, qes, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        this.form_create_data = {
          chg_code: "",
          chg_type: "",
          chg_lao_type: "",
          chg_desc: "",
          chg_lao_desc: "",
          chg_amount: 0,
          chg_unit: "",
        };
      } catch (error) {
        console.error("Error creating fee:", error);
      } finally {
        this.loading = false;
      }
    },
    async Getdata() {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        this.response_data_fee = null;
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }
        const res = await axios.get<FeeModel.FeeRespons>(
          `${config.public.strapi.url}api/charges`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.response_data_fee = res.data;
        console.log("res.data", res.data);
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        console.error("Error fetching fee data:", error);
      } finally {
        this.loading = false;
      }
    },
    async Getdetail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get<FeeModel.FeeDetail>(
          `${this.config.public.strapi.url}api/charges/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.response_detail_data = res.data;
        console.log("res.data", res.data);
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        console.error("Error fetching fee details:", error);
      } finally {
        this.loading = false;
      }
    },
    async update(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const updateData = {
          chg_code: this.response_detail_data?.chg_code,
          chg_type: this.response_detail_data?.chg_type,
          chg_lao_type: this.response_detail_data?.chg_lao_type,
          chg_desc: this.response_detail_data?.chg_desc,
          chg_lao_desc: this.response_detail_data?.chg_lao_desc,
          chg_amount: this.response_detail_data?.chg_amount,
          chg_unit: this.response_detail_data?.chg_unit,
        };

        const response = await axios.put<FeeModel.FeeDetail>(
          `${this.config.public.strapi.url}api/charges/${id}/`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        this.response_detail_data = response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        console.error("Error updating fee details:", error);

        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
        }
      } finally {
        this.loading = false;
      }
    },
    async delete(id:number){
      this.loading = true;
      this.error = null;
      try {
        const del = await axios.delete(`${this.config.public.strapi.url}api/charges/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        )
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        console.error("Error deleting fee details:", error);

        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
        }
        
      }
    }
  },
});
