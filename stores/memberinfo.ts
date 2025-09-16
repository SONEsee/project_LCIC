import axios from "axios";
import { defineStore } from "pinia";
import { MemberinfoModel } from "~/types";

export const MemberStore = defineStore("Member", {
  state() {
    return {
      create_data_form: {
        code: "",
        slug: "",
        nameL: "",
        nameE: "",
        descL: "",
        descE: "",
        mImage: null as File | null,
        streetInfoL: "",
        streetInfoE: "",
        published: false,
        villageinfo_id: "",
        districtinfo_id: "",
        provinceinfo_id: "",
        bnk_code: "",
        bnk_type: "",
        memberType: "",
        dateRegis: "",
      },
      loading: false,
      respons_data_query: null as MemberinfoModel.Items | null,
      respone_data_detail:
        null as MemberinfoModel.MemberInfoDetailRespose | null,
      error: null as string | null,
      config: useRuntimeConfig(),
    };
  },
  
  actions: {
    async getMemberInfo() {
      this.loading = true;
      this.error = null;
      try {
        this.respons_data_query = null;
        const config = useRuntimeConfig();
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await axios.get<MemberinfoModel.Items>(
          `${config.public.strapi.url}api/members/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          this.respons_data_query = res.data;
          console.log("Member data:", this.respons_data_query);
        }
      } catch (error) {
        this.error = error as string;
      } finally {
        this.loading = false;
      }
    },
    async createMember() {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();

        formData.append("code", this.create_data_form.code);
        formData.append("bnk_code", this.create_data_form.bnk_code);
        formData.append("bnk_type", this.create_data_form.bnk_type);
        formData.append("slug", this.create_data_form.slug);
        formData.append("nameL", this.create_data_form.nameL);
        formData.append("nameE", this.create_data_form.nameE);
        formData.append("descL", this.create_data_form.descL);
        formData.append("descE", this.create_data_form.descE);
        formData.append("streetInfoL", this.create_data_form.streetInfoL);
        formData.append("streetInfoE", this.create_data_form.streetInfoE);
        formData.append("published", String(this.create_data_form.published));
        formData.append("villageInfo", this.create_data_form.villageinfo_id);
        formData.append("districtInfo", this.create_data_form.districtinfo_id);
        formData.append("provInfo", this.create_data_form.provinceinfo_id);
        formData.append("memberType", this.create_data_form.memberType);
        formData.append("dateRegis", this.create_data_form.dateRegis);

        if (this.create_data_form.mImage) {
          formData.append("mImage", this.create_data_form.mImage);
        }

        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        await axios.post(
          `${this.config.public.strapi.url}api/members/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.create_data_form = {
          code: "",
          bnk_code: "",
          bnk_type: "",
          slug: "",
          nameL: "",
          nameE: "",
          descL: "",
          descE: "",
          streetInfoL: "",
          streetInfoE: "",
          mImage: null,
          published: false,
          villageinfo_id: "",
          districtinfo_id: "",
          provinceinfo_id: "",
          memberType: "",
          dateRegis: "",
        };
      } catch (error) {
        console.error("Error creating member:", error);
        this.error = error as string;
      } finally {
        this.loading = false;
      }
    },
    async getMemberInfoDetail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await axios.get<MemberinfoModel.MemberInfoDetailRespose>(
          `${config.public.strapi.url}api/members/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          this.respone_data_detail = res.data;
          console.log("Member detail data:", this.respone_data_detail);
        }
      } catch (error) {
        this.error = error as string;
      } finally {
        this.loading = false;
      }
    },
  },
});
