import { defineStore } from "pinia";
import axios from "axios";
import { MemberModel } from "~/types";

export const useMemberStore = defineStore("member", {
  state: () => ({
    response_query_data: null as MemberModel.MemberRespons | null,
  }),

  actions: {
    async Getdata() {
      try {
        const response = await axios.get<MemberModel.MemberRespons>(
          "http://192.168.45.54:35729/api/api/get_login3/"
        );
        this.response_query_data = response.data;
        console.log("Members fetched:", this.response_query_data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    },
  },
});