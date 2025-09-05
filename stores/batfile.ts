import { defineStore } from "pinia";
import axios from "~/helpers/axios";
import { BafileModel } from "~/types";
export const useBastFileStore = defineStore("bastfile", {
  state() {
    return {
      isLoading: false,
      respons_data_batefile: null as BafileModel.BatfileRespons | null,
      filter_data_userid: {
        isLoading: false,
        filter_user: {
          user_id: "",
          filter_user_id: "",
        },
      },
    };
  },
  actions: {
    async getData() {
      this.isLoading = true;
      const res = await axios.get<BafileModel.BatfileRespons>(
        `/api/api/search-files/`,
        {
          params: {
            ...this.filter_data_userid.filter_user,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );if(res.status ===200){
        this.respons_data_batefile = res.data
      }
    },
  },
});
