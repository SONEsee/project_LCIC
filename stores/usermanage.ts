import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { UserDataResponse } from "~/types";
import Swal from "sweetalert2";
export const useUserManageStore = defineStore("userManage", {
  state() {
    return {
      form_create_data: {
        bnk_code: "",
        branch_code: "",
        username: "",
        password: "",
        nameL: "",
        nameE: "",
        surnameL: "",
        surnameE: "",
        roles: "",
        profile_image: null,
      },
      respons_data_bnk: [] as UserDataResponse.BankRespose[],
        loading: false,
      config: useRuntimeConfig(),
    };
  },
  actions: {
    async Getbak() {
      const res = await axios.get<UserDataResponse.BankRespose[]>(
        `${this.config.public.strapi.url}api/bank`
      );
      if (res.status === 200) {
        this.respons_data_bnk = res.data;
        console.log("Bank data fetched successfully", this.respons_data_bnk);
      }
    },
    async createUser(){
        this.loading = true;
        try {
            const qes = { ...this.form_create_data};
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("No access token found");
            await axios.post(`${this.config.public.strapi.url}api/sys-add-user/`, qes, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            this.form_create_data={
                bnk_code: "",
                branch_code: "",
                username: "",
                password: "",
                nameL: "",
                nameE: "",
                surnameL: "",
                surnameE: "",
                roles: "",
                profile_image: null,
            }
        } catch (error) {
            console.error("Error creating user:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to create user.",
            });
            
        }

    }
  },
});
