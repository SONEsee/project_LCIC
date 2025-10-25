<script lang="ts" setup>
import { useRequesDispustStore } from "~/stores/requesdispust";
import { useDipustCallateralStore } from "~/stores/colleteraluploaddata";
import { useUserData } from "~/composables/useUserData";
const { user, userId, isAdmin, isLoggedIn } = useUserData();
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import { useUserInfo } from "@/composables/useUserInfo";

const {
  mapUserInfo,
  getUserFullName,
  getUsername,
  getUserBankName,
  getUserPermission,
  isUserActive,
  getUserDetails,
  getUserInitials,
  loadUsers,
} = useUserInfo();
import { useImagePath } from "@/composables/useImagePath";
import { useUserManageStore } from "~/stores/usermanage";
const useStore = useUserManageStore();
const userData = computed(() => {
  const data = useStore.respons_user_list;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
import Swal from "sweetalert2";
import dayjs from "dayjs";
const selectMember = ref("");
const memberStore = MemberStore();
const DispustStore = useDipustCallateralStore();
const memberData = computed(() => {
  const data = memberStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const header = [
  { title: "ລຳດັບ", value: "id_disput_loan" },
  { title: "ສະມາຊິກ", value: "bnk_code" },
  { title: "ເອກະສານ", value: "image_url" },
  { title: "ຜູ້ນຳສົ່ງ", value: "user_insert" },
  { title: "ມື້ສ້າງ", value: "insertdate" },
  { title: "ສະຖານະ", value: "status" },
  { title: "ລາຍລະອຽດ", value: "action" },
];
const reques = DispustStore.data_filter_dispust.query;
async function onChangPage(value: number) {
  reques.page = value;
  await DispustStore.getDataDispust();
}
async function onSelectPage(value: number) {
  reques.page_size = value;
  await DispustStore.getDataDispust();
}

watch(selectMember, async (newValue) => {
  DispustStore.isLoading = true;
  try {
    DispustStore.data_filter_dispust.query.filter_bnk_code = newValue;
    await DispustStore.getDataDispust();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດືງຂໍ້ມູນຕາມສະມາຊິກໄດ້",
    });
  } finally {
    DispustStore.isLoading = false;
  }
});

const dispustData = computed(() => {
  const data = DispustStore.respons_data_dispust_allert;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const dispustCount = computed(() => {
  const data = DispustStore.pagination?.total_items;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
onMounted(() => {
  DispustStore.data_filter_dispust.query.bnk_code = userId.value;
  DispustStore.getDataDispust();
  memberStore.getMemberInfo();
  useStore.getUserList();
  loadUsers();
});
</script>
<template>
  <!-- <pre>{{ dispustData }}</pre> -->
  <v-card style="background-color: aliceblue">
    <v-card-title>
      <h3>ກວດສອບການຢັ້ງຢືນແກ້ໄຂຂໍ້ມູນ Dispust ຈາກສະມາຊິກ</h3>
    </v-card-title>
  </v-card>
  <div class="justify-md-space-between d-flex pa-4">
    <div>
      <h4>
        ຈຳນວນຂໍ້ມູນທັງໝົດ: <v-chip>{{ DispustStore.respons_data_dispust_allert_count?.pagination.total_items }}</v-chip
        >ລາຍການ
      </h4>
    </div>
    <div class="justify-md-space-between d-flex pa-4" v-if="userId === '01'">
      <div>
        <v-autocomplete
       
          v-model="selectMember"
          label="ຄົ້ນຫາຕາມສະມາຊິກ"
          width="300"
          prepend-inner-icon="mdi-format-list-bulleted"
          :items="memberData"
          item-title="nameL"
          item-value="bnk_code"
          variant="outlined"
          density="compact"
          clearable
        >
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
            >
              <template v-slot:prepend>
                <v-avatar size="small" color="primary">
                  <v-icon size="small">mdi-format-list-bulleted</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </div>
    </div>
  </div>
  <!-- <pre>{{ 
  dispustData }}</pre> -->
  <v-data-table
    :items="dispustData"
    :headers="header"
    density="compact"
    :items-per-page="reques.page_size"
  >
    <template v-slot:header.id_disput_loan="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:header.bnk_code="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:header.image_url="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:header.user_insert="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:header.insertdate="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:header.status="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:header.action="{ column }">
      <b style="color: blue">{{ column.title }}</b>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip color="primary" variant="flat" v-if="item.status === '1'"
        >ລຳຖ້າກວດສອບ</v-chip
      >
      <v-chip color="success" variant="flat" v-else>ກວດສອບແລ້ວ</v-chip>
    </template>
    <template v-slot:item.bnk_code="{ item }">
      <v-chip color="primary">{{ mapMemberInfo(item.bnk_code) }}</v-chip>
    </template>
    <template v-slot:item.user_insert="{ item }">
      <v-chip color="info">{{ getUsername(item.user_insert) }}</v-chip>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn
        color="blue-lighten-1"
        flat
        prepend-icon="mdi-eye"
        @click="
          goPath(
            `/requesdispust/confirm_collateral/?dispust_confirm=${item.id_disput_loan}`
          )
        "
        >ລາຍລະອຽດ</v-btn
      >
    </template>
    <template v-slot:item.insertdate="{ item }">
      {{ dayjs(item.insertdate).format("DD/MM/YYYY") }}
    </template>
    <template v-slot:item.image_url="{ item }">
      <GloBalGlobalFilePreview
        :src="item.image_url"
        size="medium"
        show-preview
        show-file-name
      />
    </template>
    <template v-slot:bottom>
      <GloBalTablePaginations
        :page="DispustStore.data_filter_dispust.query.page"
        :limit="DispustStore.data_filter_dispust.query.page_size"
        :totalpage="DispustStore.pagination?.total_pages"
        @onSelectionChange="onSelectPage"
        @onPagechange="onChangPage"
      />
    </template>
  </v-data-table>
</template>
