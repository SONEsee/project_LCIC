import axios from "~/helpers/axios";
import { MergMactModel } from "~/types";

import { defineStore } from "pinia";
import Swal from "sweetalert2";
export const useMergMactEnterpris = defineStore("mact_merg", {
  state() {
    return {
      isLoading: false,
      query_group: {
        query: {
          page: 1,
          limit: 20,
          code: "ce",
          group_type: "similar",
        },
        isLoading: false,
      },
      response_data_group:
        null as MergMactModel.MactMergEnterpriseRespons | null,
    };
  },
  actions: {
    async GetDataGroup() {
      this.isLoading = true;
      try {
        const res = await axios.get<MergMactModel.MactMergEnterpriseRespons>(
          `/api/api/group-by-code/`,
          {
            params: {
              ...this.query_group.query,
            },
          }
        );
        if (res.status === 200) {
          this.response_data_group = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້ ",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
