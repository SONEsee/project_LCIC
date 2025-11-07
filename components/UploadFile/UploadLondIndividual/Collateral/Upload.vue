<script setup lang="ts">
import { MemberStore } from "@/stores/memberinfo";
import { IndividualCollateralStore } from "~/stores/collateral_individual";
const inDividualStore = IndividualCollateralStore();
import { useMemberInfo } from "@/composables/memberInfo";
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
import { useUserData } from "~/composables/useUserData";
import TablePaginations from "~/components/GloBal/TablePaginations.vue";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { color } from "chart.js/helpers";
const SelectBank = ref("");
const SelectPeroid = ref("");
const SelectSatus = ref("");
const SelectFile = ref("");
const categories = ref<any[]>([]);
interface Category {
  cat_sys_id: string;
  cat_name: string;
}
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const reques = inDividualStore.loan_query.query;
const period = computed(() => {
  const data = inDividualStore.respons_data_reques_period?.periods;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const periodItems = computed(() => {
  return period.value.map((p) => ({
    title: dayjs(p, "YYYYMM").format("MM-YYYY"),
    value: p,
  }));
});

async function onChangPage(value: number) {
  reques.page = value;
  await inDividualStore.getListIndividualcollateral();
}

const headers = computed(() => {
  const baseHeaders = [
    { title: "ໄອດີ", value: "CID" },
    { title: "ຊື່ໄຟລ໌", value: "fileName" },
    { title: "ຂະໜາດຟາຍ", value: "fileSize" },
    { title: "ໄລຍະເວລາ", value: "period" },
    { title: "ຂໍ້ມູນ dispute", value: "dispuste" },
    { title: "ສະຖານະ", value: "statussubmit" },
    { title: "ອັດຕາສ່ວນ(ຜິດພາດ)", value: "percentage" },
    { title: "ການດຳເນີນການ", value: "actions", sortable: false },
  ];

  if (user.value && user.value.MID.id === "01") {
    baseHeaders.splice(1, 0, { title: "ລະຫັດທະນາຄານ", value: "user_id" });
  }
  if (user.value && user.value.MID.id === "01") {
    baseHeaders.splice(9, 0, { title: "ກວດສອບ", value: "editor" });
  }

  return baseHeaders;
});

async function onSelectPage(value: number) {
  reques.limit = value;
  await inDividualStore.getListIndividualcollateral();
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
const DateName = (item: any) => {
  if (!item || !item || !item.value || !item.title) return "ທັງໝົດ";
  return `${item.title}`;
};
const FileName = (item: any) => {
  if (!item || !item || !item.value || !item.title) return "ທັງໝົດ";
  return `${item.title}`;
};
const StatuName = (item: any) => {
  if (!item || !item || !item.value || !item.title) return "ທັງໝົດ";
  return `${item.title}`;
};

const UploadFile = async () => {
  const notification = await Swal.fire({
    icon: "question",
    title: "ຄຳເຕືອນ",
    text: "ທ່ານຕອ້ງການອັບໂຫຼດຂໍ້ມູນນີ້ແທ້ບໍ...?",
    showCancelButton: true,
    confirmButtonText: "ຕົກລົງ",
    cancelButtonText: "ຍົກເລີກ",
    confirmButtonColor: "#0D47A1",
    cancelButtonColor: "#D50000",
  });
  if (notification.isConfirmed) {
    inDividualStore.from_upload_file.user_id = userId.value;
    await inDividualStore.UploadFile();
  }
};

const FileType = [
  { title: "ຟາຍ Json", value: "json", icon: "mdi-code-json", color: "error" },
  { title: "ຟາຍ Xml", value: "xml", icon: "mdi-cloud-tags", color: "success" },
];
const Status = [
  {
    title: "ສຳເລັດ",
    value: "0",
    icon: "mdi-check-circle-outline",
    color: "success",
  },
  {
    title: "ໂຫຼດສຳເລັດ",
    value: "1",
    icon: " mdi-monitor-arrow-down-variant",
    color: "light-blue-darken-4",
  },
  {
    title: "ກຳລັງໂຫຼດ",
    value: "pending",
    icon: "mdi-compost",
    color: "warning",
  },
  {
    title: "ປະຕິເສດ",
    value: "2",
    icon: "mdi-comment-remove-outline",
    color: "error",
  },
  {
    title: "ຖືກ Reject",
    value: "7",
    icon: "mdi-axis-y-rotate-counterclockwise",
    color: "error",
  },
  {
    title: "ຖືກ Unload",
    value: "5",
    icon: "mdi-progress-upload",
    color: "lime-accent-4",
  },
];
watch(SelectBank, async (newvalue) => {
  try {
    inDividualStore.loan_query.query.user_id_filter = newvalue;
    await inDividualStore.getListIndividualcollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດືງຂໍ້ມູນຕາມສະມາຊິກໄດ້",
    });
  }
});
watch(SelectSatus, async (newvalue) => {
  try {
    inDividualStore.loan_query.query.statussubmit = newvalue;
    await inDividualStore.getListIndividualcollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດືງຂໍ້ມູນຕາມສະມາຊິກໄດ້",
    });
  }
});
watch(SelectPeroid, async (newvalue) => {
  try {
    inDividualStore.loan_query.query.period = newvalue;
    await inDividualStore.getListIndividualcollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດືງຂໍ້ມູນຕາມສະມາຊິກໄດ້",
    });
  }
});
watch(SelectFile, async (newvalue) => {
  try {
    inDividualStore.loan_query.query.FileType = newvalue;
    await inDividualStore.getListIndividualcollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດືງຂໍ້ມູນຕາມສະມາຊິກໄດ້",
    });
  }
});
const hasProcessingStatus = computed(() => {
  const data = inDividualStore.respons_list_file_insdividual_loan?.results;
  if (!Array.isArray(data)) return {};

  const statusMap: Record<string, boolean> = {};

  data.forEach((item) => {
    if (item.statussubmit === "3" || item.statussubmit === "4") {
      statusMap[item.user_id] = true;
    }
  });

  return statusMap;
});
const latestPeriodByUser = computed(() => {
  const data = inDividualStore.respons_list_file_insdividual_loan?.results;
  if (!Array.isArray(data)) return {};

  const periodMap: Record<
    string,
    { period: string; fid: string; statussubmit: string }
  > = {};

  data.forEach((item) => {
    const currentPeriod = item.period;
    const userId = item.user_id;

    if (!periodMap[userId] || currentPeriod > periodMap[userId].period) {
      periodMap[userId] = {
        period: currentPeriod,
        fid: item.CID,
        statussubmit: item.statussubmit,
      };
    }
  });

  return periodMap;
});
const latestPeriodWithStatus0ByUser = computed(() => {
  const data = inDividualStore.respons_list_file_insdividual_loan?.results;
  if (!Array.isArray(data)) return {};

  const periodMap: Record<string, { period: string; fid: string }> = {};

  data.forEach((item) => {
    if (item.statussubmit !== "0") return;

    const currentPeriod = item.period;
    const userId = item.user_id;

    if (!periodMap[userId] || currentPeriod > periodMap[userId].period) {
      periodMap[userId] = {
        period: currentPeriod,
        fid: item.CID,
      };
    }
  });

  return periodMap;
});
const shouldShowUploadButton = (item: any) => {
  if (item.statussubmit !== "0") return false;

  const latestForUser = latestPeriodWithStatus0ByUser.value[item.user_id];
  if (!latestForUser) return false;

  if (item.CID !== latestForUser.fid) return false;

  return true;
};
const isConfirmButtonDisabled = (item: any) => {
  if (item.statussubmit !== "1") return true;

  if (hasProcessingStatus.value[item.user_id]) return true;

  return false;
};
const statistics = computed(() => {
  const data = inDividualStore.respons_list_file_insdividual_loan;
  const results = Array.isArray(data?.results) ? data.results : [];
  const total = data?.count || 0;

  const success = results.filter((item) => item.statussubmit === "0").length;
  const processing = results.filter((item) => item.statussubmit === "1").length;
  const rejected = results.filter(
    (item) =>
      item.status === "2" ||
      item.statussubmit === "2" ||
      item.statussubmit === "7"
  ).length;

  const jsonFiles = results.filter((item) => item.FileType === "json").length;
  const xmlFiles = results.filter((item) => item.FileType === "xml").length;

  const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : "0.0";

  return [
    {
      label: "ທັງໝົດ",
      value: total.toLocaleString(),
      color: "#E3F2FD",
      icon: "mdi-file-document-multiple",
      iconColor: "#1976D2",
    },
    {
      label: "ນຳສົ່ງສຳເລັດ",
      value: success.toLocaleString(),
      color: "#E8F5E9",
      icon: "mdi-check-circle",
      iconColor: "#388E3C",
    },
    {
      label: "ອັບໂຫຼດສຳເລັດ",
      value: processing.toLocaleString(),
      color: "#FFF3E0",
      icon: "mdi-clock-outline",
      iconColor: "#F57C00",
    },
    {
      label: "ປະຕິເສດ",
      value: rejected.toLocaleString(),
      color: "#FFEBEE",
      icon: "mdi-close-circle",
      iconColor: "#D32F2F",
    },
    {
      label: "ອັດຕາສຳເລັດ",
      value: `${successRate}%`,
      color: "#F3E5F5",
      icon: "mdi-chart-line",
      iconColor: "#7B1FA2",
    },
    {
      label: "JSON/XML",
      value: `${jsonFiles}/${xmlFiles}`,
      color: "#E0F2F1",
      icon: "mdi-code-json",
      iconColor: "#00796B",
    },
  ];
});
const confirmInsertData = async (cid: string) => {
  const notification = await Swal.fire({
    icon: "warning",
    title: "ຄຳເຕືອນ",
    text: "ທ່ານຕ້ອງການຢືນຢັນເພື່ອດຳເນີນການຕໍ່ບໍ?",
    confirmButtonText: "ຕົກລົງ",
    showCancelButton: true,
    cancelButtonText: "ຍົກເລີກ",
  });

  if (notification.isConfirmed) {
    
    await inDividualStore.confirmUploadLoan(cid);
    await inDividualStore.getListIndividualcollateral();
  }
};
const UnloadData = async (fid: string) => {
  const notification = await Swal.fire({
    icon: "warning",
    title: "ຄຳເຕືອນ",
    text: "ທ່ານຕ້ອງການຢືນຢັນເພື່ອດຳເນີນການຕໍ່ບໍ?",
    confirmButtonText: "ຕົກລົງ",
    showCancelButton: true,
    cancelButtonText: "ຍົກເລີກ",
  });
  await inDividualStore.getListIndividualcollateral();
  if (notification.isConfirmed) {
    await inDividualStore.UnloadLoan(fid);
    await inDividualStore.getListIndividualcollateral();
  }
};
const RejectInsertData = async (id: string) => {
  const notification = await Swal.fire({
    icon: "warning",
    title: "ຄຳເຕືອນ",
    text: "ທ່ານຕ້ອງການຢືນຢັນເພື່ອດຳເນີນການຕໍ່ບໍ?",
    confirmButtonText: "ຕົກລົງ",
    showCancelButton: true,
    cancelButtonText: "ຍົກເລີກ",
  });

  if (notification.isConfirmed) {
    await inDividualStore.RejectUploadLoan(id);
    await inDividualStore.getListIndividualcollateral();
  }
};
onMounted(async () => {
  inDividualStore.loan_query.query.user_id = userId.value;
  inDividualStore.period.query.user_id = userId.value;
  inDividualStore.getListIndividualcollateral();
  memberStore.getMemberInfo();
  inDividualStore.getPeriod();
});
</script>

<template>
  <v-container fluid class="pa-4">
    <v-card class="mb-4" elevation="0" color="#FAFAFA">
      <v-card-text>
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">
            mdi-account-tie-outline
          </v-icon>
          <div>
            <h2 class="text-h5 font-weight-medium text-primary">
              ການອັບໂຫຼດຂໍ້ມູນຫຼັກຊັບ (ບຸກຄົນ)
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              ຈັດການແລະຕິດຕາມຂໍ້ມູນການອັບໂຫຼດ
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="1" v-if="userId !== '01'">
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
              class="custom-file-input"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="1">
            <v-btn color="primary" block @click="UploadFile">ອັບໂຫຼດ</v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              class="custom-file-input"
              label="ງວດທີ່ສົ່ງ"
              :items="periodItems"
              :item-title="DateName"
              v-model="SelectPeroid"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              class="custom-file-input"
              :items="FileType"
              :item-title="FileName"
              item-value="value"
              v-model="SelectFile"
              label="ປະເພດໄຟລ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-file-outline"
              clearable
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="item.raw?.title">
                  <template v-slot:prepend>
                    <v-avatar size="small" variant="flat">
                      <v-icon size="small" :color="item.raw.color">{{
                        item.raw.icon
                      }}</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              class="custom-file-input"
              :items="Status"
              v-model="SelectSatus"
              label="ສະຖານະ"
              :item-title="StatuName"
              item-value="value"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle-outline"
              clearable
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="item.raw?.title">
                  <template v-slot:prepend>
                    <v-avatar size="small" variant="flat">
                      <v-icon size="small" :color="item.raw.color">{{
                        item.raw.icon
                      }}</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-4" elevation="1" v-if="userId === '01'">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              class="custom-file-input"
              v-if="userId === '01'"
              v-model="SelectBank"
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
              class="custom-file-input"
              label="ງວດທີ່ສົ່ງ"
              :items="periodItems"
              :item-title="DateName"
              v-model="SelectPeroid"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              clearable
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              class="custom-file-input"
              :items="FileType"
              :item-title="FileName"
              item-value="value"
              v-model="SelectFile"
              label="ປະເພດໄຟລ"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-file-outline"
              clearable
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="item.raw?.title">
                  <template v-slot:prepend>
                    <v-avatar size="small" variant="flat">
                      <v-icon size="small" :color="item.raw.color">{{
                        item.raw.icon
                      }}</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              class="custom-file-input"
              :items="Status"
              v-model="SelectSatus"
              label="ສະຖານະ"
              :item-title="StatuName"
              item-value="value"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle-outline"
              clearable
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="item.raw?.title">
                  <template v-slot:prepend>
                    <v-avatar size="small" variant="flat">
                      <v-icon size="small" :color="item.raw.color">{{
                        item.raw.icon
                      }}</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
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
        style="font-size: 80%"
        :items="indData"
        :items-per-page="reques.limit"
        :headers="headers"
        class="elevation-0 text-no-wrap"
        hover
      >
        <template v-slot:header.CID="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.fileName="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.fileSize="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.period="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.dispuste="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.statussubmit="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.percentage="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.actions="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.user_id="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.editor="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:item.user_id="{ item }">
          <v-chip
            size="small"
            color="primary"
            variant="tonal"
            style="font-size: small"
          >
            {{ mapMemberInfo(item.user_id) }}
          </v-chip>
        </template>

        <template v-slot:item.statussubmit="{ item }">
          <v-chip
            color="success"
            v-if="item.statussubmit === '0'"
            style="font-size: small"
            size="small"
          >
            <strong>ສຳເລັດ</strong>
          </v-chip>
          <v-chip
            color="error"
            v-if="item.statussubmit === '2'"
            style="font-size: small"
            size="small"
          >
            <strong>ປະຕິເສດ</strong>
          </v-chip>
          <v-chip color="error" size="small" v-if="item.statussubmit === '7'"
            ><strong>ຖືກ Reject</strong></v-chip
          >
          <v-chip
            color="orange-darken-4"
            size="small"
            v-if="item.statussubmit === '5'"
            ><strong>ຖືກ Unload</strong></v-chip
          >
          <v-chip
            color="warning"
            v-if="item.statussubmit === '3' || item.statussubmit === '4'"
            style="font-size: small"
            size="small"
          >
            <v-progress-circular
              style="font-size: small"
              color="blue-lighten-3"
              indeterminate
            ></v-progress-circular>
          </v-chip>

          <v-chip
            color="primary"
            v-if="item.statussubmit === '1'"
            style="font-size: small"
            size="small"
            ><strong>ສຳເລັດການໂຫຼດ</strong></v-chip
          >
        </template>
        <template v-slot:item.fileSize="{ item }">
          {{ item.fileSize }}
        </template>
        <template v-slot:item.fileName="{ item }" style="font-size: small">
          {{ item.fileName.slice(0, 20)
          }}{{ item.fileName.length > 20 ? "..." : "" }}
        </template>
        <template v-slot:item.period="{ item }">
          <v-chip color="primary" style="font-size: small" size="small">{{
            dayjs(item.period).format("MM-YYYY")
          }}</v-chip>
        </template>
        <template v-slot:item.dispuste="{ item }">
          <v-chip
            color="info"
            v-if="item.dispuste === '0'"
            style="font-size: small"
            size="small"
          >
            ບໍ່ມີ
          </v-chip>
          <v-chip
            style="font-size: small"
            size="small"
            color="info"
            v-else
            @click="goPath(`/disuste/?id_dispust=n-${item.CID}`)"
            density="compact"
            variant="flat"
          >
            {{ item.dispuste }}
          </v-chip>
        </template>
        <template v-slot:item.editor="{ item }">
          <v-btn
            color="success"
            flat
            @click="confirmInsertData(`c-${item.CID}`)"
            v-if="item.statussubmit === '1'"
            :disabled="isConfirmButtonDisabled(item)"
          >
            ຢືນຢັນ
          </v-btn>
          <v-btn
            class="ml-2"
            color="red-lighten-4"
            flat
            @click="RejectInsertData(`c-${item.CID}`)"
            v-if="item.statussubmit === '1'"
            :disabled="isConfirmButtonDisabled(item)"
          >
            reject
          </v-btn>

          <v-btn
            color="warning"
            v-if="shouldShowUploadButton(item)"
            flat
            @click="UnloadData(`n-${item.CID}`)"
          >
            ອັນໂຫຼດ
          </v-btn>
          <v-chip color="error" size="small" v-if="item.statussubmit === '7'"
            >ຖືກ Reject</v-chip
          >
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
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            prepend-icon="mdi-eye"
            flat
            @click="goPath(`/detailupload_c?CID=c-${item.CID}`)"
            >ລາຍລະອຽດ</v-btn
          >
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
.custom-file-input :deep(.v-icon) {
  font-size: 20px;
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
