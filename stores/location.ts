import { LochalUserData } from "@/types";
import { defineStore } from "pinia";
import axios from "@/helpers/axios";
import Swal from "sweetalert2";
export const LoCationStore = defineStore("location", {
  state() {
    return {
      respons_data_location: null as LochalUserData.LocationRespons | null,
      isLoading: false,
      config: useRuntimeConfig(),
    };
  },
  actions: {
    async GetLocation() {
      this.isLoading = true;
      try {
        const res = await axios.get<LochalUserData.LocationRespons>(
          `/api/filter_villages/`
        );
        if (res.status == 200) {
          this.respons_data_location = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນທີ່ຢູ່ໄດ້",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
