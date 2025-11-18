<script setup lang="ts">
import dayjs from "dayjs";
import { useEnterprisInfo } from "~/stores/enterpris_member";
import axios from "~/helpers/axios";
import Swal from "sweetalert2";
const config = useRuntimeConfig();
const enterpriseStore = useEnterprisInfo();
const reques = enterpriseStore.filter_enterprise.query;
interface Village {
  ID: number;
  Prov_ID: string;
  Province_Name: string;
  Dstr_ID: string;
  District_Name: string;
  Vill_ID: string;
  Village_Name: string;
  title: string;
  id: number;
}
const villages = ref<Village[]>([]);
const fetchVillages = async () => {
  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/filter_villages/`
    );
    villages.value = response.data.map((village: any) => ({
      ...village,
      title: `ແຂວງ:${village.Province_Name}-ເມືອງ:${village.District_Name}-ບ້ານ${village.Village_Name}`,
      id: village.ID,
    }));
  } catch (error) {
    console.error("Error fetching villages:", error);
    Swal.fire({
      title: "ຜິດພາດ!",
      text: "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນບ້ານໄດ້",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const header = [
  { title: "ລຳດັບ", value: "index" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "EnterpriseID" },
  { title: "ຊື່ວິສາຫະກິດ (ລາວ)", value: "enterpriseNameLao" },
  { title: "ຊື່ວິສາຫະກິດ (ອັງກິດ)", value: "eneterpriseNameEnglish" },
  { title: "ເລກທີ", value: "regisCertificateNumber" },
  { title: "ມື້ລົງທະບຽນ", value: "regisDate" },
  { title: "ສະຖານທີ່", value: "enLocation" },
  { title: "ຮູບແບບວິສາຫະກິດ", value: "enLegalStrature" },
];
const EnterpriseData = computed(() => {
  const data = enterpriseStore.list_data_enterprise?.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
async function onSelectionChange(value: number) {
  reques.limit = value;
  await enterpriseStore.GetEnterpriseList();
}

async function onPagechage(value: number) {
  (reques.page = value), await enterpriseStore.GetEnterpriseList();
}
// const displayLocatoin = computed(() => {
//   if (!EnterpriseData.value) {
//     return "ບໍ່ມີຂໍ້ມູນສະຖານທີ່";
//   }
//   const EnterprisIDLocation = EnterpriseData.value;
// });
onMounted(() => {
  enterpriseStore.GetEnterpriseList();
  fetchVillages();
});
</script>
<template>
  <v-sheet
    :elevation="4"
    rounded
    color="brown-lighten-5"
    class="pa-4 text-no-wrap"
  >
    <v-sheet
      :elevation="4"
      rounded
      color="brown-lighten-5"
      class="pa-4 text-no-wrap mb-2"
    >
      <strong
        >ລາຍການທັງໝົດ:{{
          enterpriseStore.list_data_enterprise?.pagination.total_items
        }}
        ລາຍການ</strong
      >
    </v-sheet>
    <v-sheet
      :elevation="4"
      rounded
      color="brown-lighten-5"
      class="pa-4 text-no-wrap mb-2"
    >
      <v-data-table
        :items="EnterpriseData"
        :items-per-page="reques.limit"
        :headers="header"
        class="bg-brown-lighten-5"
      >
        <template v-slot:header.index="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.LCIC_code="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.EnterpriseID="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.enterpriseNameLao="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.eneterpriseNameEnglish="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.regisCertificateNumber="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.regisDate="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.enLocation="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>
        <template v-slot:header.enLegalStrature="{ column }">
          <h4 style="color: blue">
            <strong>{{ column.title }}</strong>
          </h4>
        </template>

        <template v-slot:item.index="{ item, index }">
          {{ (reques.page - 1) * reques.limit + index + 1 }}
        </template>
        <template v-slot:item.LCIC_code="{ item }">
          <v-chip size="small" color="primary">
            {{ item?.LCIC_code ?? "ບໍ່ມີ" }}
          </v-chip>
        </template>
        <template v-slot:item.EnterpriseID="{ item }">
          <v-chip size="small" color="info">
            {{ item?.EnterpriseID ?? "ບໍ່ມີ" }}
          </v-chip>
        </template>
        <template v-slot:item.regisDate="{ item }">
          <v-chip size="small" color="info">
            {{
              item.regisDate
                ? dayjs(item.regisDate).format("DD-MM-YYYY")
                : "ບໍ່ມີ"
            }}
          </v-chip>
        </template>
        <template v-slot:bottom>
          <GloBalTablePaginations
            :limit="reques.limit"
            :page="reques.page"
            :totalpage="
              enterpriseStore.list_data_enterprise?.pagination.total_pages
            "
            @onSelectionChange="onSelectionChange"
            @onPagechange="onPagechage"
          />
        </template>
      </v-data-table>
    </v-sheet>
  </v-sheet>
</template>
