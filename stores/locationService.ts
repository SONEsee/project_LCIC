import axios from "axios";
import { defineStore } from "pinia";
import { LochalUserData } from "~/types";

export const LocationStore = defineStore("location", {
  state() {
    return {
      province: [] as LochalUserData.Province[],
      district: [] as LochalUserData.District[],
      village: [] as LochalUserData.Village[],
      loading: false,
      config: useRuntimeConfig(),
      error: null as string | null,
    };
  },
  actions: {
    async getProvinces() {
      this.loading = true;
      try {
        
        const url = `${this.config.public.strapi.url}api/api/provinces`;
        console.log("Fetching from URL:", url);
        
        const res = await axios.get(url);
        
        if (res.status === 200) {
         
          if (Array.isArray(res.data)) {
            this.province = res.data;
          } 
         
          else if (res.data.data && Array.isArray(res.data.data)) {
            this.province = res.data.data;
          }
          else if (res.data.provinces && Array.isArray(res.data.provinces)) {
            this.province = res.data.provinces;
          }
          else {
            console.error("Unexpected API response structure:", res.data);
            this.error = "Unexpected API response structure";
          }
          
          console.log("Provinces data after processing:", this.province);
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching provinces:", error);
        this.error = "Failed to fetch provinces";
        this.loading = false;
      }
    },
    
    /**
     
     * @param provinceId
     */
    async getDistrictsByProvince(provinceId: string) {
      if (!provinceId) return;
      
      this.loading = true;
      try {
       
        const url = `${this.config.public.strapi.url}api/api/districts?province_id=${provinceId}`;
        console.log("Fetching districts from URL:", url);
        
        const res = await axios.get(url);
        
        if (res.status === 200) {
         
          if (Array.isArray(res.data)) {
            this.district = res.data;
          } 
          else if (res.data.data && Array.isArray(res.data.data)) {
            this.district = res.data.data;
          }
          else if (res.data.districts && Array.isArray(res.data.districts)) {
            this.district = res.data.districts;
          }
          else {
            console.error("Unexpected API response structure:", res.data);
            this.error = "Unexpected API response structure";
          }
          
          console.log("Districts data after processing:", this.district);
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching districts:", error);
        this.error = "Failed to fetch districts";
        this.loading = false;
      }
    },
    
    /**
    
     * @param provinceId - ລະຫັດແຂວງ
     * @param districtId - ລະຫັດເມືອງ
     */
    async getVillagesByDistrict(provinceId: string, districtId: string) {
      if (!provinceId || !districtId) return;
      
      this.loading = true;
      try {
        const url = `${this.config.public.strapi.url}api/api/villages?province_id=${provinceId}&district_id=${districtId}`;
        console.log("Fetching villages from URL:", url);
        
        const res = await axios.get(url);
        
        if (res.status === 200) {
          if (Array.isArray(res.data)) {
            this.village = res.data;
          } 
          else if (res.data.data && Array.isArray(res.data.data)) {
            this.village = res.data.data;
          }
          else if (res.data.villages && Array.isArray(res.data.villages)) {
            this.village = res.data.villages;
          }
          else {
            console.error("Unexpected API response structure:", res.data);
            this.error = "Unexpected API response structure";
          }
          
          console.log("Villages data after processing:", this.village);
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching villages:", error);
        this.error = "Failed to fetch villages";
        this.loading = false;
      }
    },
    
    
    getProvinceById(id: string) {
      return this.province.find(p => p.id === id) || null;
    },
    
    getDistrictById(id: string) {
      return this.district.find(d => d.id === id) || null;
    },
    
    getVillageById(id: string) {
      return this.village.find(v => v.id === id) || null;
    }
  }
});