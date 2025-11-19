<script setup lang="ts">
import { useUserData } from "~/composables/useUserData";
import { useEnterprisInfo } from "~/stores/enterpris_member";
import { MemberStore } from "@/stores/memberinfo";
const memberinfoStore = MemberStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const selecMember = ref("");
const EnterprisStore = useEnterprisInfo();
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const requet = EnterprisStore.filter_customer_register.query;

const dataCustomerList = computed(() => {
  const data = EnterprisStore.respons_data_list_customer?.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
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
const headers = computed(() => {
  const baseHeaders = [
    {
      title: "ລຳດັບ",
      key: "id",
      align: "center",
      sortable: false,
      width: "80px",
    },
    { title: "ລະຫັດ ຂສລ", key: "LCIC_code", align: "start" },
    { title: "ລະຫັດວິສາຫະກິດ", key: "EnterpriseID", align: "start" },
    { title: "ລະຫັດລູກຄ້າ", key: "customerID", align: "start" },
  ] as any;

  if (userId.value === "01") {
    baseHeaders.push({ title: "ສະມາຊິກ", key: "bnk_code", align: "center" });
  }

  baseHeaders.push(
    { title: "ສາຂາ", key: "branch", align: "center" },
    { title: "ສະຖານະ", key: "status", align: "center" },
    { title: "ວັນທີບັນທຶກ", key: "InsertDate", align: "center" },
    {
      title: "ຈັດການ",
      key: "actions",
      align: "center",
      sortable: false,
      width: "150px",
    }
  );

  return baseHeaders;
});

const getStatusConfig = (status: number) => {
  const statusMap: any = {
    0: { text: "ລໍຖ້າອະນຸມັດ", color: "warning", icon: "mdi-clock-outline" },
    1: { text: "ອະນຸມັດແລ້ວ", color: "success", icon: "mdi-check-circle" },
    2: { text: "ປະຕິເສດ", color: "error", icon: "mdi-close-circle" },
  };
  return (
    statusMap[status] || {
      text: "ບໍ່ຮູ້ຈັກ",
      color: "grey",
      icon: "mdi-help-circle",
    }
  );
};
const display = (item: any) => {
  if (!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
  return `${item.bnk_code} - ${item.code} - ${item.nameL}`;
};
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("lo-LA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

async function onSelectionChange(item: number) {
  requet.page_size = item;
  EnterprisStore.GetdataListRegisCustomer();
}

async function onPagechange(item: number) {
  requet.page = item;
  EnterprisStore.GetdataListRegisCustomer();
}
watch(selecMember, async (newValue) => {
  try {
    EnterprisStore.filter_customer_register.query.bnk_code_filter = newValue;
    EnterprisStore.GetdataListRegisCustomer();
  } catch (error) {
    console.log("error filter", error);
  }
});

onMounted(() => {
  EnterprisStore.filter_customer_register.query.bnk_code = userId.value;
  EnterprisStore.GetdataListRegisCustomer();
  memberinfoStore.getMemberInfo();
});
</script>

<template>
  <div class="pa-6">
    <v-card elevation="0" class="rounded-lg" color="grey-lighten-5">
      <v-card-title class="d-flex align-center justify-space-between pa-6">
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-account-group"
            color="primary"
            size="32"
            class="mr-3"
          ></v-icon>
          <div>
            <h2 class="text-h5 font-weight-bold text-primary">
              ຂໍ້ມູນທີ່ຜູກກັບລະຫັດລູກຄ້າ
            </h2>
            <p class="text-caption text-grey-darken-1 mt-1">
              ລາຍການທັງໝົດ
              {{
                EnterprisStore.respons_data_list_customer?.pagination
                  .total_items || 0
              }}
              ລາຍການ
            </p>
          </div>
        </div>
        <div>
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
          <v-btn color="primary" v-if="userId !== '01'" @click="goPath(`/backend/register_lcic/customerjoinlcic`)">ພູກລະຫັດລູກຄ້າ</v-btn>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="dataCustomerList"
          :items-per-page="requet.page_size"
          hide-default-footer
          class="elevation-0"
        >
          <template v-slot:headers="{ columns }">
            <tr class="bg-blue-grey-lighten-5">
              <th
                v-for="column in columns"
                class="text-body-2 font-weight-bold text-blue-grey-darken-2 pa-4"
                :class="column.align === 'center' ? 'text-center' : ''"
              >
                {{ column.title }}
              </th>
            </tr>
          </template>

          <template v-slot:item.id="{ index }">
            <v-chip size="small" color="blue-grey-lighten-3" variant="flat">
              {{ (requet.page - 1) * requet.page_size + index + 1 }}
            </v-chip>
          </template>

          <template v-slot:item.EnterpriseID="{ item }">
            <div class="d-flex align-center">
              <v-avatar color="indigo-lighten-4" size="32" class="mr-2">
                <v-icon size="18" color="indigo-darken-2">mdi-domain</v-icon>
              </v-avatar>
              <span class="font-weight-medium text-grey-darken-3">
                {{ item.EnterpriseID }}
              </span>
            </div>
          </template>

          <template v-slot:item.customerID="{ item }">
            <v-chip color="cyan-lighten-4" variant="flat" size="small">
              <v-icon start size="small">mdi-account</v-icon>
              {{ item.customerID }}
            </v-chip>
          </template>

          <template v-slot:item.LCIC_code="{ item }">
            <v-chip color="teal-lighten-4" variant="flat" size="small">
              <v-icon start size="small">mdi-shield-account</v-icon>
              {{ item.LCIC_code }}
            </v-chip>
          </template>

          <template v-slot:item.bnk_code="{ item }" class="text-start">
            <div class="d-flex align-center">
              <v-chip color="primary" variant="flat" size="small">
                {{ mapMemberInfo(item.bnk_code) }}
              </v-chip>
            </div>
          </template>

          <template v-slot:item.branch="{ item }">
            <v-chip color="orange-lighten-4" variant="flat" size="small">
              {{ item.branch }}
            </v-chip>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusConfig(item.status).color"
              variant="tonal"
              size="small"
              class="pa-4"
            >
              <v-icon size="small">
                {{ getStatusConfig(item.status).icon }}
              </v-icon>
              {{ getStatusConfig(item.status).text }}
            </v-chip>
          </template>

          <template v-slot:item.InsertDate="{ item }">
            <div class="text-body-2 text-grey-darken-2">
              <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
              {{ formatDate(item.InsertDate) }}
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="justify-center">
              <v-btn variant="tonal" color="primary"
              @click="
                    goPath(
                      `/backend/register_lcic/detailcustomer/?id_file=${item.id}`
                    )
                  "
                ><v-icon
                  size="small"
                  
                  >mdi-eye</v-icon
                >ລາຍລະອຽດ</v-btn
              >
            </div>
          </template>

          <template v-slot:no-data>
            <div class="text-center py-12">
              <v-icon size="80" color="grey-lighten-2"
                >mdi-folder-open-outline</v-icon
              >
              <p class="text-h6 text-grey-darken-1 mt-4 mb-2">ບໍ່ມີຂໍ້ມູນ</p>
              <p class="text-body-2 text-grey">ກະລຸນາລົງທະບຽນລູກຄ້າໃໝ່</p>
            </div>
          </template>

          <template v-slot:bottom>
            <v-divider></v-divider>
            <div class="pa-4 bg-white">
              <GloBalTablePaginations
                :limit="requet.page_size"
                :page="requet.page"
                :totalpage="
                  EnterprisStore.respons_data_list_customer?.pagination
                    .total_pages
                "
                @onSelectionChange="onSelectionChange"
                @onPagechange="onPagechange"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.v-data-table :deep(tbody tr) {
  transition: all 0.2s ease;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(33, 150, 243, 0.05) !important;
}

.v-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.v-chip {
  transition: transform 0.2s ease;
}

.v-chip:hover {
  transform: scale(1.02);
}
</style>
