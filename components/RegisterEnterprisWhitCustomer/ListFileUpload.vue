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
  // { title: "ຜູ້ບັນທືກ", value: "user" },

  { title: "ສະຖານະ", value: "status" },
  { title: "ລະຫັດຂສລ", value: "LCIC_reques" },
  { title: "ວັນທີສ້າງ", value: "insertdate" },
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
  <v-card :elevation="1" rounded="lg" class="pa-6 mb-6 bg-white">
    <div class="d-flex align-center mb-4">
      <v-icon color="blue-darken-2" size="26" class="mr-2"
        >mdi-shield-search</v-icon
      >
      <h4 class="text-h6 font-weight-regular text-blue-darken-2">
        ກວດສອບ ແລະ ລົງທະບຽນລະຫັດ ຂສລ
      </h4>
    </div>
    <v-divider class="mb-5"></v-divider>

    <v-row align="center" class="mb-4">
      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center">
          <p class="text-subtitle-1 text-medium-emphasis mr-3">
            ກວດສອບລະຫັດວິສາຫະກິດ:
          </p>
          <v-chip color="orange-darken-1" size="small" variant="tonal">
            *ກວດສອບກ່ອນລົງທະບຽນ*
          </v-chip>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right py-0">
        <v-btn
          color="green-darken-1"
          variant="tonal"
          class="font-weight-bold"
          @click="
            goPath(
              `/backend/register_lcic/?enterpris=${enterprisStore.check_enterprise.EnterpriseID}`
            )
          "
        >
          <v-icon left>mdi-file-edit-outline</v-icon>
          ລົງທະບຽນອອກລະຫັດ ຂສລ
        </v-btn>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12" sm="4" md="3" class="py-0">
        <v-text-field
          v-model="enterprisStore.check_enterprise.EnterpriseID"
          density="compact"
          label="ປ້ອນລະຫັດວິສາຫະກິດ"
          variant="outlined"
          hide-details
          clearable
          prepend-inner-icon="mdi-domain"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="auto" class="py-0">
        <v-btn
          color="blue-darken-2"
          variant="flat"
          :loading="enterprisStore.isLoading"
          @click="submitCheckEnterprise"
          :disabled="!enterprisStore.check_enterprise.EnterpriseID"
        >
          <v-icon left>mdi-magnify</v-icon>
          ກວດສອບ
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4" v-if="enterprisStore.respon_data_check_enterprise">
      <v-col cols="12">
        <v-alert
          :type="
            enterprisStore.respon_data_check_enterprise?.exists
              ? 'success'
              : 'warning'
          "
          :icon="
            enterprisStore.respon_data_check_enterprise?.exists
              ? 'mdi-check-circle-outline'
              : 'mdi-alert-circle-outline'
          "
          variant="tonal"
          density="compact"
        >
          <template
            v-if="enterprisStore.respon_data_check_enterprise?.exists === false"
          >
            <strong>ບໍ່ພົບ!</strong> ລະຫັດວິສາຫະກິດນີ້:
            {{ enterprisStore.check_enterprise.EnterpriseID }} ໃນລະບົບ ຂສລ.
          </template>
          <template v-else>
            <div class="font-weight-bold mb-1">
              ພົບລະຫັດວິສາຫະກິດໃນລະບົບ ຂສລ ແລ້ວ:
            </div>
            <v-row dense class="text-caption text-medium-emphasis">
              <v-col cols="6" sm="3" class="py-0">
                <p>
                  <strong>ລະຫັດວິສາຫະກິດ:</strong>
                  {{ datareturn[0]?.EnterpriseID }}
                </p>
              </v-col>
              <v-col cols="6" sm="3" class="py-0">
                <p>
                  <strong>ລະຫັດ ຂສລ:</strong> {{ datareturn[0]?.EnterpriseID }}
                </p>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="py-0">
                <p>
                  <strong>ຊື່ (ລາວ):</strong>
                  {{ datareturn[0]?.enterpriseNameLao }}
                </p>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="py-0">
                <p>
                  <strong>ທຶນຈົດທະບຽນ:</strong>
                  <span class="font-weight-bold">
                    {{
                      datareturn[0]?.investmentAmount?.toLocaleString(
                        "en-US"
                      ) ?? "0"
                    }}
                    {{ datareturn[0]?.investmentCurrency ?? "-" }}
                  </span>
                </p>
              </v-col>
            </v-row>
          </template>
        </v-alert>
      </v-col>
    </v-row>
  </v-card>

  <v-card :elevation="1" rounded="lg" class="pa-4">
    <v-card-title class="pa-2 pb-3">
      <div class="d-flex align-center justify-space-between w-100">
        <h5 class="text-h6 font-weight-regular text-blue-darken-2">
          <v-icon class="mr-1" color="blue-darken-2">mdi-view-list</v-icon>
          ລາຍການລົງທະບຽນທັງໝົດ
          <span class="text-body-2 font-weight-light text-medium-emphasis ml-2">
            ({{ enterprisStore.respons_data_list_file?.count || 0 }} ລາຍການ)
          </span>
        </h5>

        <div class="d-flex align-center gap-2">
          <v-text-field
            v-model="search"
            v-if="userId !== '01'"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="ຄົ້ນຫາ (LCIC, ຜູ້ບັນທຶກ...)"
            variant="outlined"
            hide-details
            single-line
            style="width: 250px"
          />

          <v-autocomplete
            v-if="userId === '01'"
            v-model="selecMember"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            single-line
            label="ເລືອກສະມາຊິກ"
            :items="memberData"
            :item-title="display"
            item-value="bnk_code"
            style="width: 300px"
          >
            <template #item="{ item, props }">
              <v-list-item
                v-bind="props"
                :title="`${item.raw.bnk_code} - ${item.raw.code} - ${item.raw.nameL}`"
                prepend-icon="mdi-bank-circle-outline"
              ></v-list-item>
            </template>
          </v-autocomplete>
        </div>
      </div>
    </v-card-title>

    <v-divider class="mt-2 mb-4"></v-divider>

    <v-data-table
    :items-per-page="reques.limit"
      density="compact"
      :items="filteredEnterpriseData"
      :headers="header"
      :loading="!enterprisStore.respons_data_list_file"
    >

      <template
      
        v-for="h in header"
        #[`header.${(h).value}`]="{ column }"
        :key="h.value"
      >
        <strong class="text-blue-darken-4 text-blue-darken-4">{{
          column.title
        }}</strong>
      </template>

      <template v-slot:item.bank_id="{ item }">
        <v-chip
          size="small"
          color="blue-grey-darken-1"
          variant="text"
          class="font-weight-medium"
        >
          {{ mapMemberInfo(item.bank_id) }}
        </v-chip>
      </template>
      <template v-slot:item.branch_id="{ item }">
        <v-chip size="small" color="grey-darken-1" variant="text">
          {{ item.branch_id ?? 'ບໍ່ໄດ້ລະບຸ' }}
        </v-chip>
      </template>
      <template v-slot:item.index="{ item, index }">
        {{ (reques.page-1) * reques.limit + index + 1 }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            item.status === '1'
              ? 'orange'
              : item.status === '0'
              ? 'green'
              : item.status === '3'
              ? 'red'
              : 'blue-grey'
          "
          size="small"
          variant="tonal"
          class="font-weight-medium"
        >
          <v-icon left size="16" class="mr-1">
            {{
              item.status === "1"
                ? "mdi-timer-sand-full"
                : item.status === "0"
                ? "mdi-check-bold"
                : item.status === "3"
                ? "mdi-alert-octagon-outline"
                : "mdi-information-outline"
            }}
          </v-icon>
          {{
            item.status === "1"
              ? "ລໍຖ້າກວດສອບ"
              : item.status === "0"
              ? "ສຳເລັດ"
              : item.status === "3"
              ? "ຖືກ Reject"
              : item.decaption
          }}
        </v-chip>
      </template>

      <template v-slot:item.LCIC_reques="{ item }">
        <div class="d-flex align-center">
          <v-chip
            v-if="item.LCIC_reques"
            color="indigo"
            variant="tonal"
            size="small"
            class="font-weight-bold"
          >
            <v-icon size="16" class="mr-1">mdi-lock-check</v-icon>
            {{ item.LCIC_reques }}
            <v-btn
              icon
              size="x-small"
              variant="text"
              class="ml-1"
              color="indigo"
              @click.stop="copyCode(item.LCIC_reques)"
            >
              <v-icon size="16">mdi-content-copy</v-icon>
            </v-btn>
          </v-chip>
          <v-chip
            v-else
            color="grey"
            variant="text"
            size="small"
            prepend-icon="mdi-dots-horizontal-circle-outline"
            class="text-medium-emphasis"
          >
            ລໍຖ້າການອອກລະຫັດ
          </v-chip>
        </div>
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn
          color="blue-darken-2"
          variant="outlined"
          size="small"
          @click="
            goPath(`/backend/register_lcic/detail/?enterprisfile=${item.id}`)
          "
        >
          <v-icon size="16" left>mdi-file-eye-outline</v-icon>
          ລາຍລະອຽດ
        </v-btn>
      </template>

      <template v-slot:item.image="{ item }">
        <div class="text-center py-2">
          <div class="image-preview-container" >
            <v-avatar size="small" color="grey-lighten-3" v-if="item.image">
              <img :src="item.image"  class="thumbnail " size="small"  width="20"  />
              
            </v-avatar>
            <p v-else>ບໍ່ໄດ້ແນບຟາຍ</p>
            <div class="image-popup">
              <img :src="item.image"  />
            </div>
          </div>
          
        </div>
      </template>

      <template v-slot:item.insertdate="{ item }">
        <span class="text-caption text-medium-emphasis">
          {{ dayjs(item.insertdate).format("DD/MM/YYYY") }}
        </span>
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
  </v-card>
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
