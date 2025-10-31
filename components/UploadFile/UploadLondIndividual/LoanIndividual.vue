<script setup lang="ts">
import { MemberStore } from "@/stores/memberinfo";
import { IndividualStore } from "~/stores/searchindividual";
const inDividualStore = IndividualStore();
import { useMemberInfo } from "@/composables/memberInfo";
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
import { useUserData } from "~/composables/useUserData";
import TablePaginations from "~/components/GloBal/TablePaginations.vue";
import Swal from "sweetalert2";
import dayjs from "dayjs";
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const reques = inDividualStore.loan_query.query;

async function onChangPage(value: number) {
  reques.page = value;
  await inDividualStore.getListIndividualLoan();
}

const headers = computed(() => {
  const baseHeaders = [
    { title: "ໄອດີ", value: "FID" },
    { title: "ຊື່ໄຟລ໌", value: "fileName" },
    { title: "ຂະໜາດຟາຍ", value: "file_size" },
    { title: "ໄລຍະເວລາ", value: "period" },
    { title: "ຂໍ້ມູນ dispute", value: "dispuste" },
    { title: "ສະຖານະ", value: "statussubmit" },
    { title: "ອັດຕາສ່ວນ", value: "percentage" },
    { title: "ການດຳເນີນການ", value: "actions", sortable: false },
  ];

  if (user.value && user.value.MID.id === "01") {
    baseHeaders.splice(1, 0, { title: "ລະຫັດທະນາຄານ", value: "user_id" });
  }

  return baseHeaders;
});

async function onSelectPage(value: number) {
  reques.limit = value;
  await inDividualStore.getListIndividualLoan();
}

const indData = computed(() => {
  const data = inDividualStore.respons_list_file_insdividual_loan?.results;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data) {
    return [data];
  }
  return [];
});

const memberStore = MemberStore();
const memberData = computed(() => {
  const data = memberStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data) {
    return [data];
  }
  return [];
});

const displayMember = (item: any) => {
  if (!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
  return `${item.bnk_code}-${item.code}-${item.nameL}`;
};

const UploadFile = async ()=>{
  const notification = await Swal.fire({
    icon:"question",
    title:"ຄຳເຕືອນ",
    text:"ທ່ານຕອ້ງການອັບໂຫຼດຂໍ້ມູນນີ້ແທ້ບໍ...?",
    showCancelButton:true,
    confirmButtonText:"ຕົກລົງ",
    cancelButtonText:"ຍົກເລີກ",
    confirmButtonColor:"#0D47A1",
    cancelButtonColor:"#D50000"
  });if(notification.isConfirmed){
    inDividualStore.from_upload_file.user_id = userId.value
    await inDividualStore.UploadFile();
  }
}
const statistics = computed(() => {
  const total = inDividualStore.respons_list_file_insdividual_loan?.count || 0;
  return [
    {
      label: "ທັງໝົດ",
      value: total.toLocaleString(),
      color: "#E3F2FD",
      icon: "mdi-file-document-multiple",
      iconColor: "#1976D2",
    },
    {
      label: "ສຳເລັດ",
      value: "0",
      color: "#E8F5E9",
      icon: "mdi-check-circle",
      iconColor: "#388E3C",
    },
    {
      label: "ກຳລັງດຳເນີນການ",
      value: "0",
      color: "#FFF3E0",
      icon: "mdi-clock-outline",
      iconColor: "#F57C00",
    },
    {
      label: "ປະຕິເສດ",
      value: "0",
      color: "#FFEBEE",
      icon: "mdi-close-circle",
      iconColor: "#D32F2F",
    },
    {
      label: "ອັດຕາສຳເລັດ",
      value: "0%",
      color: "#F3E5F5",
      icon: "mdi-chart-line",
      iconColor: "#7B1FA2",
    },
    {
      label: "JSON/XML",
      value: "0/0",
      color: "#E0F2F1",
      icon: "mdi-code-json",
      iconColor: "#00796B",
    },
  ];
});

onMounted(() => {
  inDividualStore.loan_query.query.user_id = userId.value;
  inDividualStore.getListIndividualLoan();
  memberStore.getMemberInfo();
});
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Header Section -->
    <v-card class="mb-4" elevation="0" color="#FAFAFA">
      <v-card-text>
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">
            mdi-account-tie-outline
          </v-icon>
          <div>
            <h2 class="text-h5 font-weight-medium text-primary">
              ການອັບໂຫຼດຂໍ້ມູນເງິນກູ້ (ບຸກຄົນ)
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              ຈັດການແລະຕິດຕາມຂໍ້ມູນການອັບໂຫຼດ
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>

    
    <v-card class="mb-4" elevation="1" v-if="userId !=='01'">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="5">
            <v-file-input
            v-model="inDividualStore.from_upload_file.file"
              clearable
              label="ອັບໂຫຼດຟາຍ JSON/XML"
              variant="outlined"
              density="compact"
              hide-details
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
            ></v-file-input>
            <v-autocomplete
              v-if="userId === '01'"
              :items="memberData"
              :item-title="displayMember"
              item-value="bnk_code"
              label="ເລືອກສະມາຊິກ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-bank"
              clearable
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="1">
            <v-btn color="primary" block @click="UploadFile">ອັບໂຫຼດ</v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              label="ງວດທີ່ສົ່ງ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              label="ປະເພດໄຟລ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-file-outline"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              label="ສະຖານະ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle-outline"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-4" elevation="1" v-if="userId ==='01'">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="3">
            
            <v-autocomplete
              v-if="userId === '01'"
              :items="memberData"
              :item-title="displayMember"
              item-value="bnk_code"
              label="ເລືອກສະມາຊິກ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-bank"
              clearable
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-autocomplete
              label="ງວດທີ່ສົ່ງ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              label="ປະເພດໄຟລ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-file-outline"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              label="ສະຖານະ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle-outline"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

   
    <v-row class="mb-4">
      <v-col
        v-for="(stat, index) in statistics"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <v-card :color="stat.color" elevation="2" hover class="stat-card">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <v-icon :color="stat.iconColor" size="28">
                {{ stat.icon }}
              </v-icon>
            </div>
            <h3
              class="text-h5 font-weight-bold mb-1"
              :style="{ color: stat.iconColor }"
            >
              {{ stat.value }}
            </h3>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ stat.label }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  
    <v-card elevation="2">
      <v-card-title
        class="d-flex align-center justify-space-between pa-4 bg-grey-lighten-4"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-table</v-icon>
          <span class="text-h6">ລາຍການຟາຍທີ່ອັບໂຫຼດ</span>
        </div>
        <v-text-field
          style="max-width: 350px"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          placeholder="ຄົ້ນຫາຟາຍ..."
          clearable
          hide-details
          bg-color="white"
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :items="indData"
        :items-per-page="reques.limit"
        :headers="headers"
        class="elevation-0 text-no-wrap"
        hover
      >
        <template v-slot:item.user_id="{ item }">
          <v-chip size="small" color="primary" variant="tonal">
            {{ mapMemberInfo(item.user_id) }}
          </v-chip>
        </template>

        <template v-slot:item.statussubmit="{ item }">
          <v-chip
            size="small"
            :color="
              item.statussubmit === 'ສຳເລັດ'
                ? 'success'
                : item.statussubmit === 'ກຳລັງດຳເນີນການ'
                ? 'warning'
                : 'error'
            "
            variant="tonal"
          >
            {{ item.statussubmit }}
          </v-chip>
        </template>
        <template v-slot:item.file_size="{item}">
          {{ (item.file_size) }}
        </template>
        <template v-slot:item.period="{item}">
          {{ dayjs(item.period).format('MM-YYYY') }}
        </template>

        <template v-slot:item.percentage="{ item }">
          <div class="d-flex align-center">
            <v-progress-linear
              :model-value="item.percentage || 0"
              height="8"
              rounded
              color="primary"
              class="mr-2"
              style="min-width: 60px"
            ></v-progress-linear>
            <span class="text-caption">{{ item.percentage || 0 }}%</span>
          </div>
        </template>

        <template v-slot:bottom>
          <TablePaginations
            :limit="inDividualStore.loan_query.query.limit"
            :page="inDividualStore.loan_query.query.page"
            :totalpage="
              inDividualStore.respons_list_file_insdividual_loan?.total_pages
            "
            @onSelectionChange="onSelectPage"
            @onPagechange="onChangPage"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-data-table) {
  border-radius: 0 !important;
}

:deep(.v-data-table-header) {
  background-color: #fafafa;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: #f5f5f5 !important;
}
</style>
