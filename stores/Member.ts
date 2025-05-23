import { defineStore } from "pinia";
import axios from "axios";
import { MemberModel } from "~/types";

export const useMemberStore = defineStore("member", {
  state() {
    return {
      
    
      response_query_data: null as MemberModel.MemberResponsItems[] | null,
      config:useRuntimeConfig(),
      isLoading: false,
    };
  },
  actions: {
    async Resdata() {
      try {
        const config = useRuntimeConfig();
        this.isLoading = true;
        const res = await axios.get<MemberModel.MemberResponsItems[]>(
          `${config.public.strapi.url}api/api/get_login3/`
        );
        this.response_query_data = res.data;
        console.log("Members fetched:", this.response_query_data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }finally {
        this.isLoading = false;
      }
    },
    async Createdata(){

    }
  },
});
