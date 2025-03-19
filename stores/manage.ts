import axios from "axios";
import { defineStore } from "pinia";
import { ManageUser } from "~/types";
export const useManageUser = defineStore("manage", {
  state() {
    return {
      response_query_data: null as ManageUser.UserDataRespons[] | null,
    };
  },
  actions: {
    async Getdata() {
      try {
        const config = useRuntimeConfig();
        const res = await axios.get<ManageUser.UserDataRespons[]>(
          `${config.public.strapi.url}api/distinct-bnk-codes/`
        );
        this.response_query_data = res.data;
        console.log("Members fetched:", this.response_query_data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    },
  },
});
