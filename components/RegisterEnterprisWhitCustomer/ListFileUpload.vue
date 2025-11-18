<script setup lang="ts">
import { useEnterprisInfo } from "~/stores/enterpris_member";
import { useUserData } from "~/composables/useUserData";
import { useMemberInfo } from "@/composables/memberInfo";
import { MemberStore } from "@/stores/memberinfo";

import dayjs from "dayjs";
import Swal from "sweetalert2";

const selecMember = ref("");
const search = ref("");
const memberinfoStore = MemberStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const enterprisStore = useEnterprisInfo();

const memberData = computed(() => {
  const data = memberinfoStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const datareturn = computed(() => {
  const data = enterprisStore.respon_data_check_enterprise?.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const header = [
  { title: "ລຳດັບ", value: "index" },
  { title: "ສະມາຊິກ", value: "bank_id" },
  { title: "ສາຂາ", value: "branch_id" },
  { title: "ຮູບພາບ", value: "image" },
  { title: "ຜູ້ບັນທືກ", value: "user" },
  { title: "ວັນທີສ້າງ", value: "insertdate" },
  { title: "ສະຖານະ", value: "status" },
  { title: "ລະຫັດຂສລ", value: "LCIC_reques" },
  { title: "ລາຍລະອຽກ", value: "action" },
];

const reques = enterprisStore.query;

async function onSelectonChange(value: number) {
  reques.limit = value;
  await enterprisStore.GetdataListFileEnterpris();
}

async function onPagechange(value: number) {
  reques.page = value;
  await enterprisStore.GetdataListFileEnterpris();
}

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

const filteredEnterpriseData = computed(() => {
  if (!search.value) return enterprisData.value;

  const searchLower = search.value.toLowerCase();
  return enterprisData.value.filter((item: any) => {
    return (
      item.LCIC_reques?.toLowerCase().includes(searchLower) ||
      item.user?.toLowerCase().includes(searchLower) ||
      item.branch_id?.toLowerCase().includes(searchLower) ||
      item.filename?.toLowerCase().includes(searchLower)
    );
  });
});

watch(selecMember, async (newValue) => {
  enterprisStore.query.bank_id_filter = newValue;
  await enterprisStore.GetdataListFileEnterpris();
});

const copyCode = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);

    Swal.fire({
      icon: "success",
      title: "ກ໊ອບປີ້ສຳເລັດ!",
      html: `<code style="color: #4caf50; font-weight: bold;">${text}</code>`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Copy failed:", error);

    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫຼວ",
      text: "ບໍ່ສາມາດກ໊ອບປີ້ໄດ້",
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

const display = (item: any) => {
  if (!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
  return `${item.bnk_code} - ${item.code} - ${item.nameL}`;
};
const submitCheckEnterprise = async () => {
  await enterprisStore.CheckEnterpriseID();
};
onMounted(async () => {
  enterprisStore.query.bank_id = userId.value;
  await Promise.all([
    enterprisStore.GetdataListFileEnterpris(),
    memberinfoStore.getMemberInfo(),
  ]);
});
</script>

<template>
 
    
 <v-sheet :elevation="3" rounded class="pa-4 mb-4">
<h4 style="color: blue;">  ກວດສອບ ແລະ ລົງທະບຽນລະຫັດ ຂສລ</h4>

   <v-progress-linear
      buffer-value="50"
      color="cyan"
      stream
    ></v-progress-linear>

    <br>
    <v-row>
      <v-col cols="12" lg="12">
        <div class="mb-3">
          <h4>
            ກວດສອບລະຫັດ ຂສລ ຈາກລະຫັດວິສາຫະກິດ
            <strong style="color: orange" class="text-caption"
              >*ກະລຸນາກວດລະຫັດວິສາຫະກິດກອ່ນລົງທະບຽນ*</strong
            >
          </h4>
        </div>
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              
              v-model="enterprisStore.check_enterprise.EnterpriseID"
              density="compact"
              label="ກະລຸນາປ້ອນລະຫັດວິສາຫະກິດ"
              variant="solo"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn
              color="primary"
              @click="submitCheckEnterprise"
              :disabled="
                enterprisStore.check_enterprise.EnterpriseID === '' ||
                enterprisStore.check_enterprise.EnterpriseID === null
              "
            >
              ກວດສອບ
            </v-btn>
            <!-- {{ datareturn }} -->
          </v-col>
          <v-col cols="12" sm="7" class="text-end">
            <v-btn
              color="primary"
              :disabled="
                enterprisStore.respon_data_check_enterprise?.exists !== false
              "
              @click="goPath(`/backend/register_lcic/?enterpris=${enterprisStore.check_enterprise.EnterpriseID}`)"
            >
              ລົງທະບຽນອອກລະຫັດ ຂສລ
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-alert
        type="warning"
        density="compact"
        class="text-caption"
        v-if="enterprisStore.respon_data_check_enterprise?.exists === false"
      >
        ບໍ່ພົບລະຫັດວິສາຫະກິດນີ້:
        {{ enterprisStore.check_enterprise.EnterpriseID }} ໃນລະບົບຂອງ ຂສລ
      </v-alert>

      <v-alert
        type="success"
        density="compact"
        class="text-caption"
        v-if="enterprisStore.respon_data_check_enterprise?.exists === true"
      >
        <div
          class="d-flex justify-lg-space-between justify-center align-center"
        >
          <p>
            ລະຫັດວິສາຫະກິດ: <strong>{{ datareturn[0]?.EnterpriseID }}</strong>
          </p>
          <p>
            ລະຫັດ ຂສລ: <strong>{{ datareturn[0]?.EnterpriseID }}</strong>
          </p>
          <p>
            ຊື່ວິສາຫະກິດ(ລາວ):
            <strong>{{ datareturn[0]?.enterpriseNameLao }}</strong>
          </p>
          <p>
            ຊື່ວິສາຫະກິດ(ອັງກິດ):
            <strong>{{ datareturn[0]?.eneterpriseNameEnglish }}</strong>
          </p>
          <p>
            ມື້ລົງທະບຽນ:
            <strong>{{
              dayjs(datareturn[0]?.regisDate).format("DD-MM-YYYY")
            }}</strong>
          </p>
          <p>
            ທືນຈົດທະບຽນ:
            <strong
              >{{
                datareturn[0]?.investmentAmount?.toLocaleString("en-US") ?? "0"
              }}
              {{ datareturn[0]?.investmentCurrency ?? "-" }}</strong
            >
          </p>
        </div>
      </v-alert>
    </v-row>
  </v-sheet>

  <v-sheet :elevation="3" rounded class="pa-4 mb-4">
    <div
      class="d-flex justify-lg-space-between justify-center align-center mb-4"
    >
      <h4 style="color: #01579b">
        ລາຍການທັງໝົດ:
        {{ enterprisStore.respons_data_list_file?.count || 0 }} ລາຍການ
      </h4>

      <div class="d-flex gap-2">
        <v-text-field
          v-if="userId !== '01'"
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="ຄົ້ນຫາຕາມ ຜູ້ບັນທືກ, ສາຂາ, ຊື່ຟາຍ"
          variant="solo"
          hide-details
          single-line
          style="width: 300px"
        />

        <v-autocomplete
          v-if="userId === '01'"
          v-model="selecMember"
          width="400"
          density="compact"
          variant="outlined"
          hide-details
          :items="memberData"
          :item-title="display"
          item-value="bnk_code"
          clearable
          single-line
          label="ເລືອກສະມາຊິກ"
        >
          <template #item="{ item, props }">
            <v-list-item
              v-bind="props"
              :title="`${item.raw.bnk_code} - ${item.raw.code} - ${item.raw.nameL}`"
            >
              <template #prepend>
                <v-avatar size="small" color="primary">
                  <v-icon>mdi-bank-circle-outline</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </div>
    </div>

    <v-data-table
      :items="filteredEnterpriseData"
      :headers="header"
      :loading="!enterprisStore.respons_data_list_file"
    >
      <template v-slot:header.index="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.bank_id="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.branch_id="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.image="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.user="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.insertdate="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.status="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.LCIC_reques="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>
      <template v-slot:header.action="{ column }">
        <strong style="color: blue">{{ column.title }}</strong>
      </template>

      <template v-slot:item.index="{ index }">
        {{ (reques.page - 1) * reques.limit + index + 1 }}
      </template>

      <template v-slot:item.bank_id="{ item }">
        <v-chip size="small" color="primary">
          {{ mapMemberInfo(item.bank_id) }}
        </v-chip>
      </template>

      <template v-slot:item.image="{ item }">
        <div class="text-center">
          <div class="image-preview-container">
            <v-avatar>
              <img
                :src="item.image"
                :alt="item.filename"
                width="40"
                class="thumbnail"
              />
            </v-avatar>
            <div class="image-popup">
              <img :src="item.image" :alt="item.filename" />
            </div>
          </div>
          <p>
            <v-chip variant="flat" size="small" color="green-lighten-4">
              {{ item.filename?.slice(0, 10)
              }}{{ item.filename?.length > 10 ? "..." : "" }}
            </v-chip>
          </p>
        </div>
      </template>

      <template v-slot:item.user="{ item }">
        <v-chip color="primary" size="small">
          {{ item.user }}
        </v-chip>
      </template>

      <template v-slot:item.insertdate="{ item }">
        <v-chip color="primary" size="small">
          {{ dayjs(item.insertdate).format("DD/MM/YYYY HH:mm") }}
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          color="primary"
          @click="
            goPath(`/backend/register_lcic/detail/?enterprisfile=${item.id}`)
          "
          >ລາຍລະອຽດ</v-btn
        >
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip color="warning" size="small" v-if="item.status === '1'">
          <strong>ລໍຖ້າກວດສອບ</strong>
        </v-chip>
        <v-chip color="success" size="small" v-else-if="item.status === '0'">
          <strong>ສຳເລັດການກວດສອບ</strong>
        </v-chip>
        <v-chip v-if="item.status === '3'" color="error">
            ຖືກ Reject
          </v-chip>
      </template>

      <template v-slot:item.LCIC_reques="{ item }">
        <div class="lcic-code-container">
          
          <v-chip
            v-if="item.LCIC_reques"
            color="success"
            variant="elevated"
            size="small"
          >
            <v-icon size="16" class="mr-1">mdi-shield-check</v-icon>
            <strong>{{ item.LCIC_reques }}</strong>
            <v-tooltip text="ກົດເພື່ອກ໊ອບປີ້" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  class="ml-1"
                  @click.stop="copyCode(item.LCIC_reques)"
                >
                  <v-icon size="16">mdi-content-copy</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </v-chip>
          <v-chip  v-else-if="item.status === '3'" color="error" variant="tonal"
            size="small">
            {{ item.decaption }}
          </v-chip>
          <v-chip
            v-else
            color="warning"
            variant="tonal"
            size="small"
            prepend-icon="mdi-clock-alert-outline"
          >
            ລໍຖ້າການອອກລະຫັດ ຂສລ
          </v-chip>
        </div>
      </template>

      <template v-slot:bottom>
        <GloBalTablePaginations
          :limit="reques.limit"
          :page="reques.page"
          :totalpage="enterprisStore.respons_data_list_file?.total_pages"
          @onSelectionChange="onSelectonChange"
          @onPagechange="onPagechange"
        />
      </template>
    </v-data-table>
  </v-sheet>
</template>

<style scoped>
.image-preview-container {
  position: relative;
  display: inline-block;
}

.thumbnail {
  cursor: pointer;
  transition: transform 0.2s;
}

.thumbnail:hover {
  transform: scale(1.1);
}

.image-popup {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.image-preview-container:hover .image-popup {
  display: block;
  animation: fadeIn 0.2s ease-in-out;
}

.image-popup img {
  width: 300px;
  height: auto;
  border-radius: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.gap-2 {
  gap: 8px;
}
</style>
