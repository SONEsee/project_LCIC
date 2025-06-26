import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { UserDataResponse, MemberinfoModel } from "~/types";
import Swal from "sweetalert2";
export const useUserManageStore = defineStore("userManage", {
  state() {
    return {
      form_create_data: {
        username: "",
        password: "",
        MID: "",
        GID: "",
        nameL: "",
        nameE: "",
        bnk_code: "",
        surnameL: "",
        surnameE: "",
        profile_image: null,
      },
      form_update_data: {
        username: "",
        password: "",
        MID: "",
        GID: "",
        nameL: "",
        nameE: "",
        bnk_code: "",
        surnameL: "",
        surnameE: "",
        profile_image: null,
      },
      respons_role_data: null as MemberinfoModel.RoleDetailRespose | null,
      respons_data_bnk: [] as UserDataResponse.BankRespose[],
      respons_detail_data:
        null as MemberinfoModel.MemberInfoDetailRespose | null,
      respons_user_data: null as UserDataResponse.DetailMenmberRespons[] | null,
      respons_user_data_detail:
        null as UserDataResponse.DetailMenmberRespons | null,
      loading: false,
      config: useRuntimeConfig(),
    };
  },
  actions: {
    async Getrole() {
      try {
        const res = await axios.get<MemberinfoModel.RoleDetailRespose>(
          `${this.config.public.strapi.url}api/roles`
        );
        if (res.status === 200) {
          this.respons_role_data = res.data;
          console.log("Role data fetched successfully", this.respons_role_data);
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    },
    async Getbak() {
      const res = await axios.get<UserDataResponse.BankRespose[]>(
        `${this.config.public.strapi.url}api/bank`
      );
      if (res.status === 200) {
        this.respons_data_bnk = res.data;
        console.log("Bank data fetched successfully", this.respons_data_bnk);
      }
    },
    async createUser() {
      this.loading = true;
      try {
        const formData = new FormData();

        formData.append("username", this.form_create_data.username);
        formData.append("password", this.form_create_data.password);
        formData.append("MID", this.form_create_data.MID);
        formData.append("GID", this.form_create_data.GID.toString());
        formData.append("nameL", this.form_create_data.nameL);
        formData.append("nameE", this.form_create_data.nameE);
        formData.append("surnameL", this.form_create_data.surnameL);
        formData.append("surnameE", this.form_create_data.surnameE);
        formData.append("bnk_code", this.form_create_data.bnk_code);

        if (this.form_create_data.profile_image) {
          formData.append("profile_image", this.form_create_data.profile_image);
        }

        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        console.log("Sending form data with file upload");

        const response = await axios.post(
          `${this.config.public.strapi.url}api/create_user/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User created successfully:", response.data);

        this.form_create_data = {
          username: "",
          password: "",
          MID: "",
          GID: "",
          nameL: "",
          nameE: "",
          surnameL: "",
          surnameE: "",
          bnk_code: "",
          
          profile_image: null,
        };

        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ສຳເລັດການເພີ່ມຂໍ້ມູນຜູ້ໃຊ້!",
        });
        window.location.pathname = "/backend/manageuser/userlist";
      } catch (error: any) {
        console.error("Error creating user:", error);

        let errorMessage = "Failed to create user.";

        if (error.response) {
          console.log("Error response data:", error.response.data);

          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error.message || errorMessage;
          }
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      } finally {
        this.loading = false;
      }
    },
    async Getdetail(id: number) {
      this.loading = true;
      try {
        const res = await axios.get<MemberinfoModel.MemberInfoDetailRespose>(
          `${this.config.public.strapi.url}api/members/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.respons_detail_data = res.data;
      } catch (error) {
        console.error("Error fetching user detail data:", error);
      } finally {
        this.loading = false;
      }
    },
    async Getdata() {
      this.loading = true;
      try {
        const res = await axios.get<UserDataResponse.DetailMenmberRespons[]>(
          `${this.config.public.strapi.url}api/create_user/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (res.status === 200) {
          this.respons_user_data = res.data;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async getDetailUser(id: number) {
      this.loading = true;
      try {
        const res = await axios.get<UserDataResponse.DetailMenmberRespons>(
          `${this.config.public.strapi.url}api/get_user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (res.status === 200) {
          this.respons_user_data_detail = res.data;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.loading = false;
      }
    },
    async upDateUser(id: number, formData: FormData) {
      const router = useRouter()
  this.loading = true;
  try {
    const result = await Swal.fire({
      title: "ຄຳເຕືອນ",
      text: "ທ່ານຕ້ອງການອັບເດດຂໍ້ມູນ ຫຼື ບໍ່?",
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      const res = await axios.put(
        `${this.config.public.strapi.url}api/update_user/${id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          title: "ສຳເລັດ",
          text: "ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ",
          icon: "success",
        });
         setTimeout(() => {
            router.push('/backend/manageuser/userlist');
          }, 1500);
      }
    }
  } catch (error) {
    Swal.fire({
      title: "ຂໍ້ມູນບໍ່ຖືກອັບເດດ",
      text: "ຂໍໍອະໄພສໍາລັບບັນຫາ",
      icon: "error",
    });
    console.error("Error updating user:", error);
  } finally {
    this.loading = false;
  }
},
async deleteUser(id: number) {
  const router = useRouter()
  this.loading = true;
  try {
    const result = await Swal.fire({
      title: "ຄຳເຕືອນ",
      text: "ທ່ານຕ້ອງການລົບ ຫຼື ບໍ່?",
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      const res = await axios.delete(
        `${this.config.public.strapi.url}api/delete_user/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          title: "ສຳເລັດ",
          text: "ລົບ ສໍາເລັດ",
          icon: "success",
          
        });
       setTimeout(() => {
             
          }, 1500);
       
      }
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    this.loading = false;
  }
}
  },
});
