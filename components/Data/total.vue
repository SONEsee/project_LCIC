<template>
    <p>ກຳລັງພັດທະນາ</p>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { FileDataModel } from "~/types";
const data = ref([]);
const error = ref(false);
const loading = ref(false);
const Getdata = async ()=>{
    try {
        const config = useRuntimeConfig(); 
        const res = await axios.get<FileDataModel.DataRespons>(`${config.public.strapi.url}api/get-enterprise/`);
        if(res.status === 200){
            data.value = res.data;
        }
    } catch (error) {
        
    }
}
</script>