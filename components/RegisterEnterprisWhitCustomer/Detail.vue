<script setup lang="ts">
import { useEnterprisInfo } from "~/stores/enterpris_member";
import { useUserData } from "~/composables/useUserData";
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const enterprisStore = useEnterprisInfo();
const rout = useRoute();
const enterprisfile = rout.query.enterprisfile as string;
const dataEnterpris = computed(() => {
  const data = enterprisStore.respon_data_detail_enterprise;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const enterprisData = computed(() => {
  const data = enterprisStore.respons_data_list_file?.results;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
onMounted(() => {
  enterprisStore.query.bank_id = userId.value;
  enterprisStore.query_enterprise_id.id_file = enterprisfile;
  enterprisStore.query.id = enterprisfile;
  enterprisStore.GetdataListFileEnterpris();
  enterprisStore.GetdataDetailEnterprisID();
});
</script>
<template>
  sone dev your deitails here
  <v-row>
    <v-col cols="6">
      <!-- <pre>{{ dataEnterpris }}</pre> -->
      <v-form>
         <v-text-field
            v-model="dataEnterpris[0].EnterpriseID"
            label="ເລກທະບຽນວິສາຫະກິດ"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>
         <v-text-field
            v-model="dataEnterpris[0].enterpriseNameLao"
            label="ຊື່ວິສາຫະກິດ (ລາວ) "
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>
         <v-text-field
            v-model="dataEnterpris[0].eneterpriseNameEnglish"
            label="ຊື່ວິສາຫະກິດ (ອັງກິດ) "
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>
         <v-text-field
            v-model="dataEnterpris[0].regisCertificateNumber"
            label="ເລກທີ"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>
         <v-text-field
            v-model="dataEnterpris[0].regisDate"
            label="ມື້ຈົດທະບຽນ"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>
      </v-form>
    </v-col>
    <v-col cols="6">
      <div class="text-center rounded-lg pa-4" style="border: blue 1px solid; " >
        ເອກະານອ້າງອີງ

        <v-img :src="enterprisData[0]?.image"></v-img>
      </div>
    </v-col>
  </v-row>
</template>
