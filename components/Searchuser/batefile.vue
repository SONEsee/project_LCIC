<script lang="ts" setup>
import axios from "axios";

import { ref, computed, onMounted } from "vue";
import { MemberStore } from "@/stores/memberinfo";
import { useBastFileStore } from "~/stores/batfile";
import { useMemberInfo } from "@/composables/memberInfo";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useFeesStore } from "~/stores/fee";

const feestore = useFeesStore();
const dataFee = computed(() => {
  const data = feestore.response_data_fee;
  let processedData = [];

  if (Array.isArray(data)) {
    processedData = data;
  } else if (data && typeof data === "object") {
    processedData = [data];
  } else {
    return [];
  }

  return processedData.filter((item) => item.chg_code === "FCR");
});

// Helper functions for safe fee calculation
const calculateFee = (itemCount: number) => {
  if (dataFee.value.length > 0 && dataFee.value[0]?.chg_amount) {
    return (
      new Intl.NumberFormat("lo-LA").format(
        dataFee.value[0].chg_amount * itemCount
      ) + " ກີບ"
    );
  }
  return "0 ກີບ";
};

const getSingleFeeAmount = () => {
  if (dataFee.value.length > 0 && dataFee.value[0]?.chg_amount) {
    return (
      new Intl.NumberFormat("lo-LA").format(dataFee.value[0].chg_amount) +
      " ກີບ"
    );
  }
  return "ກຳລັງໂຫຼດຂໍ້ມູນຄ່າທຳນຽມ...";
};

const foundItems = ref<any[]>([]);
const selectedItems = ref<any[]>([]);
const showSelectionDialog = ref(false);
const selectTypedate = ref("");
const selectYear = ref("");
const selectMonth = ref("");
const selectDays = ref("");
const selectStart = ref("");
const selectEnd = ref("");
const typedate = ref([
  { title: "ເລືອກຕາມວັນທີ", value: "insertDate" },
  { title: "ເລືອກຕາມຊວງເວລາ", value: "Ministry_of_Time" },
]);

const batefileStore = useBastFileStore();

watch([selectStart, selectEnd], async ([newStart, newEnd]) => {
  if (newStart || newEnd) {
    batefileStore.isLoading = true;
    try {
      batefileStore.filter_data_userid.filter_user.start_date = newStart;
      batefileStore.filter_data_userid.filter_user.end_date = newEnd;
      await batefileStore.getData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ຜິດພາດ",
        text: "ການຟີວເຕີ້ຊ່ວງເວລາຜິດພາດ",
      });
    } finally {
      batefileStore.isLoading = false;
    }
  }
});

watch(selectDays, async (newValue) => {
  batefileStore.isLoading = true;
  try {
    batefileStore.filter_data_userid.filter_user.day = newValue;
    await batefileStore.getData();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ການຟີວເຕີ້ປີຜິດພາດ",
    });
  } finally {
    batefileStore.isLoading = false;
  }
});

watch(selectYear, async (newValue) => {
  batefileStore.isLoading = true;
  try {
    batefileStore.filter_data_userid.filter_user.year = newValue;
    await batefileStore.getData();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ການຟີວເຕີ້ປີຜິດພາດ",
    });
  } finally {
    batefileStore.isLoading = false;
  }
});

watch(selectMonth, async (newValue) => {
  batefileStore.isLoading = true;
  try {
    batefileStore.filter_data_userid.filter_user.month = newValue;
    await batefileStore.getData();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ການຟີວເຕີ້ເດືອນຜິດພາດ",
    });
  } finally {
    batefileStore.isLoading = false;
  }
});

const batefileData = computed(() => {
  const data = batefileStore.respons_data_batefile;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const yearFilter = computed(() => {
  const data = batefileStore.respons_data_batefile;
  let mapData = [];
  if (Array.isArray(data)) {
    mapData = data;
  } else if (data && typeof data === "object") {
    mapData = [data];
  } else {
    return [];
  }
  const uniqueYears = new Set();
  mapData.forEach((item) => {
    if (item.insertDate) {
      uniqueYears.add(dayjs(item.insertDate).format("YYYY"));
    }
  });
  return Array.from(uniqueYears.values());
});

const monhtFilter = computed(() => {
  const data = batefileStore.respons_data_batefile;
  let mapData = [];
  if (Array.isArray(data)) {
    mapData = data;
  } else if (data && typeof data === "object") {
    mapData = [data];
  } else {
    return [];
  }
  const uniqueMonth = new Set();
  mapData.forEach((item) => {
    if (item.insertDate) {
      uniqueMonth.add(dayjs(item.insertDate).format("MM"));
    }
  });
  return Array.from(uniqueMonth.values());
});

const daysFilter = computed(() => {
  const data = batefileStore.respons_data_batefile;
  let mapData = [];
  if (Array.isArray(data)) {
    mapData = data;
  } else if (data && typeof data === "object") {
    mapData = [data];
  } else {
    return [];
  }
  const uniqueDays = new Set();
  mapData.forEach((item) => {
    if (item.insertDate) {
      uniqueDays.add(dayjs(item.insertDate).format("DD"));
    }
  });
  return Array.from(uniqueDays.values());
});

const memberinfoStore = MemberStore();
const dataMemberInfon = computed(() => {
  const data = memberinfoStore.respons_data_query;
  let result = [] as any[];

  if (Array.isArray(data)) {
    result = data;
  } else if (data && typeof data === "object") {
    result = [data];
  }
  return result.sort((a, b) => {
    if (a.bnk_code && b.bnk_code) {
      return parseInt(a.bnk_code) - parseInt(b.bnk_code);
    }
    return 0;
  });
});

const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();

interface User {
  username: string;
  id: string;
  GID: { GID: number };
  MID: { MID: string; id: string };
  UID: string;
}

const user = ref<User | null>(null);
const dataget = ref<any[]>([]);
const isloading = ref<boolean>(false);
const error = ref<string | null>(null);
const searchQuery = ref<string>("");
const selectedUserId = ref<string | null>(null);
const userIds = ref<string[]>([]);

const initializeUser = () => {
  try {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      user.value = JSON.parse(userData);
      const user_id = user.value?.MID?.id;
      const user_mid = user.value?.UID;
      const user_gid = user.value?.GID?.GID;
      return user_id;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  return null;
};

const filteredData = computed(() => {
  if (user.value?.MID.id === "01" && selectedUserId.value) {
    return batefileData.value.filter((item) =>
      item.user_id.includes(selectedUserId.value)
    );
  }
  return batefileData.value;
});

const datafetch = async () => {
  isloading.value = true;
  error.value = null;
  try {
    const config = useRuntimeConfig();
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const user_id = String(parsedUser?.MID?.id);

      let url = `${config.public.strapi.url}api/api/search-files/`;

      if (user_id === "01") {
        if (selectedUserId.value) {
          url += `?user_id=01&filter_user_id=${selectedUserId.value}`;
        } else {
          url += `?user_id=01`;
        }
      } else {
        url += `?user_id=${user_id}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      dataget.value = await response.json();
      userIds.value = [...new Set(dataget.value.map((item) => item.user_id))];
      console.log(dataget.value);
    } else {
      throw new Error("User data not found in localStorage");
    }
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
    isloading.value = false;
  }
};

onMounted(() => {
  const userId = initializeUser();
  feestore.Getdata();

  if (userId) {
    batefileStore.filter_data_userid.filter_user.user_id = String(userId);
  }
  datafetch();
  memberinfoStore.getMemberInfo();
  batefileStore.getData();
});

watch(selectedUserId, () => {
  if (user.value?.MID.id === "01") {
    datafetch();
  }
});

const file = ref<File | null>(null);
const results = ref<any[]>([]);
const header = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດສະມາຊິກ", value: "user_id" },
  { title: "ຊື່ຟາຍ", value: "fileName" },
  { title: "ຈໍານວນສອບຖາມ", value: "total" },
  { title: "ມີບົດລາຍງານ", value: "totalsearch" },

  { title: "ພິມບົດລາຍງານ", value: "searchtrue" },
  { title: "ບໍ່ເອົາບົດລາຍງານ", value: "not_report" },
  { title: "ຄົ້ນຫາບໍ່ພົບ", value: "searchfals" },
  { title: "ຂໍ້ມູນສໍ້າກັນ", value: "count_duplicates" },
  { title: "ມື້ສົ່ງ", value: "insertDate" },
]);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

const uploadFile = async () => {
  if (!file.value) {
    Swal.fire({
      icon: "warning",
      title: "ກະລຸນາເລືອກໄຟລ໌ກ່ອນ",
    });
    return;
  }

  if (!user.value?.MID.id) {
    Swal.fire({
      icon: "error",
      title: "ບໍ່ພົບ User ID",
    });
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("user_id", user.value.MID.id);
  formData.append("UID", user.value.UID);

  try {
    const config = useRuntimeConfig();

    const response = await fetch(
      `${config.public.strapi.url}api/api/upload-json/`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Upload failed.");
    }
    const data = await response.json();
    results.value = data.results || [];

    foundItems.value = results.value.filter((item) => item.status === "Found");

    if (foundItems.value.length > 0) {
      showSelectionDialog.value = true;
    } else {
      Swal.fire({
        icon: "info",
        title: "ບໍ່ມີຂໍ້ມູນທີ່ພົບ",
        text: "ບໍ່ມີລາຍການໃດທີ່ຈະປະມວນຜົນ",
      });
    }

    Swal.fire({
      icon: "success",
      title: "ອັບໂຫຼດສຳເລັດ!",
      confirmButtonText: "ຕົກລົງ",
      timer: 1000,
    }).then(() => {
      memberinfoStore.getMemberInfo();
      batefileStore.getData();
      datafetch();
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    Swal.fire({
      icon: "error",
      title: "ມີຂໍ້ຜິດພາດ",
      text: "ກະລຸນາລອງໃໝ່.",
    });
  }
};

const processSelectedItems = async () => {
  if (selectedItems.value.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "ກະລຸນາເລືອກລາຍການ",
      text: "ເລືອກຢ່າງນ້ອຍ 1 ລາຍການເພື່ອດຳເນີນການ",
    });
    return;
  }

  try {
    const confirmResult = await Swal.fire({
      title: "ຢືນຢັນການດຳເນີນການ",
      html: `
        <div style="text-align: left;">
          <p><strong>ລາຍການທີ່ເລືອກເອົາບົດລາຍງານ:</strong> ${
            selectedItems.value.length
          } ລາຍການ</p>
          <p><strong>ລາຍກາທີ່ບໍ່ເອົາບົດລາຍງານ:</strong> ${
            foundItems.value.length - selectedItems.value.length
          } ລາຍການ</p>
          <p><strong>ຄ່າທຳນຽມທັງໝົດ:</strong> ${calculateFee(
            selectedItems.value.length
          )}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ຢືນຢັນ",
      cancelButtonText: "ຍົກເລີກ",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    Swal.fire({
      title: "ກຳລັງປະມວນຜົນ...",
      text: `ກຳລັງດຳເນີນການ ${selectedItems.value.length} ລາຍການ`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const selectedItemIds = selectedItems.value.map((item) => item.id);
    const unselectedItemIds = foundItems.value
      .filter((item) => !selectedItemIds.includes(item.id))
      .map((item) => item.id);

    console.log("Selected items:", selectedItemIds);
    console.log("Unselected items to update:", unselectedItemIds);

    if (unselectedItemIds.length > 0) {
      await bulkUpdateSearchResults(unselectedItemIds);
    }

    for (const item of selectedItems.value) {
      await insertSearchLog(item);
    }

    Swal.fire({
      icon: "success",
      title: "ດຳເນີນການສຳເລັດ!",
      html: `
        <div style="text-align: left;">
          <p>✅ ເອົາບົດລາຍງານ: ${selectedItems.value.length} ລາຍການ</p>
          <p>🔄 ລາຍກາທີ່ບໍ່ເອົາບົດລາຍງານ: ${unselectedItemIds.length} ລາຍການ</p>
        </div>
      `,
      timer: 2000,
      showConfirmButton: false,
    });

    // ປິດ dialog ແລະລ້າງຂໍ້ມູນ
    showSelectionDialog.value = false;
    selectedItems.value = [];
    foundItems.value = [];
  } catch (error) {
    console.error("Error processing items:", error);
    Swal.fire({
      icon: "error",
      title: "ມີຂໍ້ຜິດພາດ",
      text: "ການດຳເນີນການຜິດພາດ",
    });
  }
};

const unselectedItems = computed(() => {
  if (selectedItems.value.length === 0) return [];
  const selectedIds = selectedItems.value.map((item) => item.id);
  return foundItems.value.filter((item) => !selectedIds.includes(item.id));
});

const bulkUpdateSearchResults = async (ids: any) => {
  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${config.public.strapi.url}api/api/search-results/bulk-update-status/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: ids,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Bulk update failed: ${response.statusText}`);
    }

    const data = await response.json();
    memberinfoStore.getMemberInfo();
    batefileStore.getData();
    console.log("Bulk update result:", data);
    return data;
  } catch (error) {
    console.error("Error in bulk update:", error);
    throw error;
  }
};

const selectAll = () => {
  selectedItems.value = [...foundItems.value];
};

const clearAll = () => {
  selectedItems.value = [];
};

const insertSearchLog = async (item: any) => {
  try {
    const token = localStorage.getItem("access_token");
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.strapi.url}api/insert_searchlog/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          EnterpriseID: item.com_enterprise_code,
          LCIC_code: item.LCIC_code,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to insert search log");
    }

    const data = await response.json();
    console.log("Search log inserted:", data);
  } catch (error) {
    console.error("Error inserting search log:", error);
  }
};

const clearStartDate = (value: any) => {
  selectStart.value = value || "";
  batefileStore.filter_data_userid.filter_user.start_date = value || "";
};

const clearEndDate = () => {
  selectEnd.value = "";
  batefileStore.filter_data_userid.filter_user.end_date = "";
};

const getDisplayText = (item: any) => {
  if (!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
  return `${item.bnk_code}-${item.code}-${item.nameL}`;
};
</script>

<template>
  <div>
    <v-col>
      <v-row>
        <v-col cols="12" md="3" v-if="user?.MID.id !== '01'">
          <v-file-input
          label="ອັບໂຫຼດ Json File"
            type="file"
            accept=".json"
            @change="handleFileUpload"
            variant="outlined"
            density="compact"
            width="100%"
          />
        </v-col>
        <v-col cols="12" md="1" v-if="user?.MID.id !== '01'">
          <v-btn @click="uploadFile" class="bg-primary">ອັບໂຫຼດ</v-btn>
        </v-col>

        <v-col cols="12" md="4" v-if="user?.MID.id === '01'">
          <div v-if="user?.MID.id === '01'" class="mb-4">
            <v-autocomplete
              v-model="selectedUserId"
              :items="dataMemberInfon"
              label="ຄົ້ນຫາຕາມສະມາຊິກດວ້ຍລະຫັດ"
              variant="outlined"
              density="compact"
              width="100%"
              :item-title="getDisplayText"
              item-value="bnk_code"
              clearable
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </div>
        </v-col>

        <v-col cols="12" md="2">
          <div class="mb-4">
            <v-autocomplete
              v-model="selectTypedate"
              :items="typedate"
              label="ປະເພດຂອງການຄົ້ນຫາ"
              clearable
              density="compact"
              variant="outlined"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.title}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </div>
        </v-col>

        <v-col cols="12" md="6" v-if="selectTypedate === 'Ministry_of_Time'">
          <div class="mb-4">
            <v-row>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="selectStart"
                  label="ມື້ເລີ່ມ"
                  type="date"
                  density="compact"
                  variant="outlined"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="d-flex"><p class="mt-4">ຫາ</p></v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="ມື້ສິ້ນສຸດ"
                  v-model="selectEnd"
                  type="date"
                  density="compact"
                  variant="outlined"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" md="6" v-else>
          <div class="mb-4">
            <v-row>
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="selectYear"
                  :items="yearFilter"
                  label="ເລືອກປີ"
                  item-title="yearFilter"
                  item-value="yearFilter"
                  density="compact"
                  variant="outlined"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  :disabled="!selectYear"
                  v-model="selectMonth"
                  :items="monhtFilter"
                  label="ເລືອກເດືອນ"
                  item-title="monhtFilter"
                  item-value="monhtFilter"
                  density="compact"
                  variant="outlined"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  :items="daysFilter"
                  :disabled="!selectMonth"
                  clearable
                  v-model="selectDays"
                  label="ເລືອກວັນ"
                  item-title="daysFilter"
                  item-value="daysFilter"
                  density="compact"
                  variant="outlined"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-dialog
      v-model="showSelectionDialog"
      max-width="950px"
      persistent
      :retain-focus="false"
      :aria-modal="true"
      role="dialog"
      :aria-labelledby="dialogTitleId"
      :aria-describedby="dialogDescId"
      attach
      content-class="selection-dialog"
    >
      <v-card>
        <v-card-title
          class="bg-primary white--text mt-12"
          tabindex="0"
          ref="dialogTitle"
        >
          <v-icon class="mr-2 white--text" aria-hidden="true"
            >mdi-checkbox-marked-circle</v-icon
          >
          ເລືອກລາຍການທີ່ຕ້ອງການດຳເນີນການຕໍ່ເພື່ອຄົ້ນຫາບົດລາຍງານ
        </v-card-title>

        <v-card-subtitle class="pa-3" :id="dialogDescId">
          <v-row align="center">
            <v-col cols="4">
              <v-chip color="info" size="small">
                <v-icon start size="small" aria-hidden="true"
                  >mdi-database-search</v-icon
                >
                ພົບທັງໝົດ: {{ foundItems.length }} ລາຍການ
              </v-chip>
            </v-col>
            <v-col cols="4">
              <v-chip color="success" size="small">
                <v-icon start size="small" aria-hidden="true"
                  >mdi-checkbox-marked</v-icon
                >
                ເລືອກໄປ: {{ selectedItems.length }} ລາຍການ
              </v-chip>
            </v-col>
            <v-col cols="4">
              <v-chip color="orange" size="small">
                <v-icon start size="small" aria-hidden="true"
                  >mdi-update</v-icon
                >
                ລາຍການທີ່ບໍ່ເອົາບົດລາຍງານ:
                {{ foundItems.length - selectedItems.length }} ລາຍການ
              </v-chip>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col>
              <v-chip color="primary" variant="tonal">
                ຄ່າທຳນຽມທັງໝົດ: {{ calculateFee(selectedItems.length) }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-subtitle>

        <v-card-text class="pa-4">
          <v-row class="mb-4">
            <v-col cols="6">
              <v-btn
                @click="selectAll"
                color="primary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-checkbox-multiple-marked"
                block
                :aria-label="`ເລືອກທັງໝົດ ${foundItems.length} ລາຍການ`"
              >
                ເລືອກທັງໝົດ
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="clearAll"
                color="warning"
                variant="outlined"
                size="small"
                prepend-icon="mdi-checkbox-multiple-blank"
                block
                :aria-label="`ຍົກເລີກການເລືອກທັງໝົດ`"
              >
                ຍົກເລີກທັງໝົດ
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mb-4"></v-divider>

          <div
            class="selection-container"
            style="max-height: 500px; overflow-y: auto"
            role="region"
            aria-label="ລາຍການທີ່ສາມາດເລືອກໄດ້"
            tabindex="0"
          >
            <v-row>
              <v-col
                v-for="(item, index) in foundItems"
                :key="`item-${item.id || index}`"
                cols="12"
              >
                <v-card
                  class="mb-3"
                  :class="{ 'selected-item': selectedItems.includes(item) }"
                  elevation="2"
                  :ripple="false"
                  role="option"
                  :aria-selected="selectedItems.includes(item)"
                  :aria-label="`ລາຍການ ${index + 1}: Enterprise ID ${
                    item.com_enterprise_code
                  }, LCIC Code ${item.LCIC_code}`"
                >
                  <v-card-text class="pa-3">
                    <v-row align="center" no-gutters>
                      <v-col cols="5">
                        <div class="ml-2">
                          <div class="mb-2 d-flex align-center">
                            <v-icon
                              size="small"
                              class="mr-2 text-primary"
                              aria-hidden="true"
                              >mdi-office-building</v-icon
                            >
                            <span class="text-body-2 font-weight-medium"
                              >Enterprise ID:</span
                            >
                            <v-chip
                              size="small"
                              color="primary"
                              class="ml-2"
                              variant="flat"
                            >
                              {{ item.com_enterprise_code || "N/A" }}
                            </v-chip>
                          </div>

                          <div class="mb-2 d-flex align-center">
                            <v-icon
                              size="small"
                              class="mr-2 text-secondary"
                              aria-hidden="true"
                              >mdi-barcode</v-icon
                            >
                            <span class="text-body-2 font-weight-medium"
                              >LCIC Code:</span
                            >
                            <v-chip
                              size="small"
                              color="secondary"
                              class="ml-2"
                              variant="flat"
                            >
                              {{ item.LCIC_code || "N/A" }}
                            </v-chip>
                          </div>

                          <div
                            v-if="item.enterpriseNameLao"
                            class="d-flex align-center"
                          >
                            <v-icon
                              size="small"
                              class="mr-2 text-grey"
                              aria-hidden="true"
                              >mdi-domain</v-icon
                            >
                            <span class="text-body-2 text-grey-darken-1">
                              <strong>ບໍລິສັດ:</strong>
                              {{ item.enterpriseNameLao }}
                            </span>
                          </div>

                          <div class="mt-2">
                            <v-chip
                              size="x-small"
                              color="success"
                              prepend-icon="mdi-check-circle"
                            >
                              ພົບຂໍ້ມູນ
                            </v-chip>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="6">
                        <div class="ml-2">
                          <p style="color: orange">
                            ຢືນຢັນການໄດ້ຮັບອານຸຍາດແລະຢີນຍອມຈາກເຈົ້າຂອງຂໍ້ມູນ
                          </p>
                          <p style="color: green">
                            ຂ້າພະເຈົ້າຢືນຢັນວ່າໄດ້ຮັບການຍິນຍອມເປີດເຜີຍຂໍ້ມູນຈາກເຈົ້າຂອງຂໍ້ມູນແລ້ວ
                            ແລະຮັບຮູ້ວ່າການນໍາໃຊ້ຂໍ້ມູນນີ້ຈະເປັນໄປຕາມກົດໝາຍທີ່ກ່ຽວຂ້ອງ
                          </p>
                          <p style="color: #1976d2">
                            ຖ້າຢືນຢັນເອົາບົດລາຍງານນີ້ແມ່ນຈະໄດ້ເສຍຄ່າທຳນຽມ:
                            <b class="fee-amount">{{ getSingleFeeAmount() }}</b>
                          </p>
                        </div>
                      </v-col>
                      <v-col cols="1">
                        <v-checkbox
                          v-model="selectedItems"
                          :value="item"
                          density="compact"
                          hide-details
                          color="primary"
                          :aria-label="`ເລືອກລາຍການ Enterprise ID ${item.com_enterprise_code}`"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-alert
            v-if="foundItems.length > 0"
            type="info"
            variant="tonal"
            class="mt-4"
            role="status"
            aria-live="polite"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-2" aria-hidden="true">mdi-information</v-icon>
              <div>
                <strong>ສະຫຼຸບການດຳເນີນການ:</strong><br />
                📋 ທັງໝົດ: {{ foundItems.length }} ລາຍການ | 📄 ເອົາບົດລາຍງານ:
                {{ selectedItems.length }} ລາຍການ | 🔄 ບໍ່ເອົາບົດລາຍງານ:
                {{ foundItems.length - selectedItems.length }} ລາຍການ<br />
                💰 ຄ່າທຳນຽມ: {{ calculateFee(selectedItems.length) }}
              </div>
            </div>
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="closeDialog"
            color="grey"
            variant="outlined"
            prepend-icon="mdi-close"
            :aria-label="`ຍົກເລີກແລະປິດໜ້າຕ່າງ`"
          >
            ຍົກເລີກ
          </v-btn>
          <v-btn
            @click="processSelectedItems"
            color="success"
            :disabled="selectedItems.length === 0"
            prepend-icon="mdi-document"
            class="ml-2"
            :aria-label="`ດຳເນີນການກັບ ${selectedItems.length} ລາຍການທີ່ເລືອກ`"
          >
            ດຳເນີນການ ({{ selectedItems.length }} ລາຍການ)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <pre>{{ filteredData }}</pre> -->

    <div
      v-if="isloading"
      class="d-flex justify-center align-center"
      role="status"
      aria-live="polite"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <span class="ml-2">ກຳລັງໂຫຼດ....</span>
    </div>
    <div v-if="error" role="alert" class="error-message">
      ເກິດຂໍ້ຜິດພາດບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້
    </div>

    <div v-else>
      <v-table>
        <thead>
          <tr>
            <th rowspan="2">
              <b style="color: blue">ລຳດັບ</b>
            </th>
            <th rowspan="2"><b style="color: blue">ລະຫັດສະມາຊິກ</b></th>
            <th rowspan="2"><b style="color: blue">ຊື່ຟາຍ</b></th>
            <th colspan="7" class="text-center">
              <b style="color: blue">ລາຍລະອຽດການຄົ້ນຫາ</b>
            </th>
          </tr>
          <tr>
            <th>
              <b style="color: blue">ຈຳນວນສອບຖາມ</b>
            </th>
            <th>
              <b style="color: #33691e"> ມີບົດລາຍງານ </b>
            </th>
            <th><b style="color: green"> ພິມບົດລາຍງານ </b></th>
            <th>
              <b style="color: #1976d2"> ບໍ່ເອົາບົດລາຍງານ </b>
            </th>
            <th><b style="color: red"> ຄົ້ນຫາບໍ່ພົບ </b></th>
            <th><b style="color: orange"> ຂໍ້ມູນສໍ້າກັນ </b></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredData">
            <td>{{ item.id }}</td>
            <td>{{ mapMemberInfo(item.user_id) }}</td>
            <td>{{ item.fileName }}</td>
            <td>
              <v-chip color="primary">
                {{
                  Number(item.searchtrue) +
                  Number(item.searchfals) +
                  Number(item.count_duplicates)
                }}
              </v-chip>
            </td>
            <td>
              <v-chip color="light-green-darken-4">
                {{ item.searchtrue || 0 }}</v-chip
              >
            </td>

            <td>
              <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການທີ່ຄົ້ນຫາພົບ">
                <template v-slot:activator="{ props }">
                  <a
                    :href="`../saerchtrue?id=${item.id}`"
                    :aria-label="`ເບິ່ງລາຍການທີ່ຄົ້ນຫາພົບ ${item.searchtrue} ລາຍການ`"
                  >
                    <v-btn
                      color="success"
                      text-color="white"
                      v-bind="props"
                      flat
                      size="small"
                      small
                    >
                      {{ Number(item.searchtrue) - Number(item.not_report) }}
                    </v-btn>
                  </a>
                </template>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip
                :text="`ລາຍການທີ່ຄົນຫາພົບແຕ່ບໍ່ເອົາບົດລາຍງານ ${
                  item.not_report ?? 0
                }`"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    color="info"
                    flat
                    @click="
                      navigateTo(`../saerchtrue/not_report?id=${item.id}`)
                    "
                  >
                    {{ item.not_report ?? "0" }}</v-btn
                  >
                </template>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການທີ່ຄົ້ນບໍ່ພົບ">
                <template v-slot:activator="{ props }">
                  <a
                    :href="`../fals?id=${item.id}`"
                    :aria-label="`ເບິ່ງລາຍການທີ່ຄົ້ນບໍ່ພົບ ${
                      item.searchfals ?? '0'
                    } ລາຍການ`"
                  >
                    <v-btn color="error" text-color="white" v-bind="props">
                      {{ item.searchfals }}
                    </v-btn>
                  </a>
                </template>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການຄົ້ນຫາທີ່ຂໍ້ມູນສໍ້າກັນ">
                <template v-slot:activator="{ props }">
                  <a
                    :href="`../duplicates_batefile/?id=${item.id}`"
                    :aria-label="`ເບິ່ງລາຍການຂໍ້ມູນສໍ້າກັນ ${item.count_duplicates} ລາຍການ`"
                  >
                    <v-btn
                      color="warning"
                      text-color="white"
                      v-bind="props"
                      flat
                    >
                      {{ item.count_duplicates }}
                    </v-btn>
                  </a>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <!-- <v-data-table
        class="text-no-wrap"
        :items="filteredData"
        item-key="name"
        items-per-page="10"
        :headers="header"
        role="table"
        aria-label="ຕາຕະລາງຂໍ້ມູນການຄົ້ນຫາ"
      >
        <template v-slot:header.id="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.user_id="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.fileName="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.total="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.searchtrue="{ column }">
          <b style="color: green">{{ column.title }}</b>
        </template>
        <template v-slot:header.searchfals="{ column }">
          <b style="color: red">{{ column.title }}</b>
        </template>
        <template v-slot:header.count_duplicates="{ column }">
          <b style="color: orange">{{ column.title }}</b>
        </template>
        <template v-slot:header.totalsearch="{ column }">
          <b style="color: #33691e">{{ column.title }}</b>
        </template>
        <template v-slot:header.insertDate="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.not_report="{ column }">
          <b style="color: #1976d2">{{ column.title }}</b>
        </template>

        <template v-slot:item.user_id="{ item }">
          {{ mapMemberInfo(item.user_id) }}
        </template>

        <template v-slot:item.total="{ item }">
          <v-chip color="primary">
            {{
              Number(item.searchtrue) +
              Number(item.searchfals) +
              Number(item.count_duplicates)
            }}
          </v-chip>
        </template>

        <template v-slot:item.count_duplicates="{ item }">
          <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການຄົ້ນຫາທີ່ຂໍ້ມູນສໍ້າກັນ">
            <template v-slot:activator="{ props }">
              <a
                :href="`../duplicates_batefile/?id=${item.id}`"
                :aria-label="`ເບິ່ງລາຍການຂໍ້ມູນສໍ້າກັນ ${item.count_duplicates} ລາຍການ`"
              >
                <v-btn color="warning" text-color="white" v-bind="props" flat>
                  {{ item.count_duplicates }}
                </v-btn>
              </a>
            </template>
          </v-tooltip>
        </template>

        <template v-slot:item.insertDate="{ item }">
          {{ new Date(item.insertDate).toLocaleDateString() }}
        </template>

        <template v-slot:item.index="{ index, item }">
          <p>{{ item.index }}</p>
        </template>
        <template v-slot:item.totalsearch="{ item }">
          <v-chip color="light-green-darken-4">
            {{ item.searchtrue || 0 }}</v-chip
          >
        </template>

        <template v-slot:item.searchtrue="{ item }">
          <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການທີ່ຄົ້ນຫາພົບ">
            <template v-slot:activator="{ props }">
              <a
                :href="`../saerchtrue?id=${item.id}`"
                :aria-label="`ເບິ່ງລາຍການທີ່ຄົ້ນຫາພົບ ${item.searchtrue} ລາຍການ`"
              >
                <v-btn
                  color="success"
                  text-color="white"
                  v-bind="props"
                  flat
                  size="small"
                  small
                >
                  {{ Number(item.searchtrue) - Number(item.not_report) }}
                </v-btn>
              </a>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:item.not_report="{ item }">
          <v-tooltip
            :text="`ລາຍການທີ່ຄົນຫາພົບແຕ່ບໍ່ເອົາບົດລາຍງານ ${
              item.not_report ?? 0
            }`"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="info"
                flat
                @click="navigateTo(`../saerchtrue/not_report?id=${item.id}`)"
              >
                {{ item.not_report ?? "0" }}</v-btn
              >
            </template>
          </v-tooltip>
        </template>

        <template v-slot:item.searchfals="{ item }">
          <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການທີ່ຄົ້ນບໍ່ພົບ">
            <template v-slot:activator="{ props }">
              <a
                :href="`../fals?id=${item.id}`"
                :aria-label="`ເບິ່ງລາຍການທີ່ຄົ້ນບໍ່ພົບ ${
                  item.searchfals ?? '0'
                } ລາຍການ`"
              >
                <v-btn color="error" text-color="white" v-bind="props">
                  {{ item.searchfals }}
                </v-btn>
              </a>
            </template>
          </v-tooltip>
        </template>
      </v-data-table> -->
    </div>
  </div>
</template>

<style scoped>
.selected-item {
  border: 2px solid #1976d2 !important;
  background-color: #f3f9ff !important;
  transform: scale(1.02);
  transition: all 0.2s ease;
}

.selection-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background-color: #fafafa;
}

.selection-container::-webkit-scrollbar {
  width: 6px;
}

.selection-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.selection-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.selection-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
