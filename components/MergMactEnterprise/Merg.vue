<script setup lang="ts">
import { useMergMactEnterpris } from "~/stores/merg_mact";

const MergMactStore = useMergMactEnterpris();
const selectType = ref("ci");
const DataGroup = computed(() => {
  const data = MergMactStore.response_data_group?.groups;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const groupHeaders = [
  { title: "ລຳດັບ", key: "group_order", width: "70px", align: "center" },
  { title: "ຈຳນວນ", key: "count", width: "90px", align: "center" },
  { title: "ຄ່າທີ່ກົງກັນ", key: "matched_value", width: "180px" },
  { title: "MM ID", key: "sample_mm_id", width: "100px", align: "center" },
  {
    title: "ຄວາມຄ້າຍ",
    key: "similarity_score",
    width: "100px",
    align: "center",
  },
  {
    title: "",
    key: "actions",
    width: "60px",
    align: "center",
    sortable: false,
  },
] as any;
const reques = MergMactStore.query_group.query;
const detailHeaders = [
  { title: "ລຳດັບ", key: "com_sys_id", width: "80px", align: "center" },
  { title: "ລະຫັດ ຂສລ ", key: "LCIC_code", width: "90px", align: "center" },
  //   { title: "ທະນາຄານ", key: "bnk_code", width: "70px", align: "center" },
  //   { title: "Customer ID", key: "customerid", width: "130px" },
  { title: "ລະຫັດວິສາຫະກິດ", key: "com_enterprise_code", width: "120px" },
  { title: "ເລກພາສີ", key: "com_tax_no", width: "100px" },
  { title: "ຊື່ວິສາຫະກິດ", key: "com_name", width: "220px" },
  { title: "ຊື່ລາວ", key: "com_lao_name", width: "220px" },
  {
    title: "ວັນທີ",
    key: "com_registration_date",
    width: "90px",
    align: "center",
  },
  { title: "ສະຖານະ", key: "status", width: "70px", align: "center" },
] as any;
const groupData = [
  { title: "ລະຫັດ ຂສລ", value: "cc" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "ci" },
  { title: "ລະຫັດຜູ້ເສຍອາກອນ", value: "ct" },
  { title: "ຊື່ວິສາຫະກິດ(ອັງກິດ)", value: "ce" },
  { title: "ຊື່ວິສາຫະກິດ(ລາວ)", value: "cl" },
  { title: "ລະຫັດພາສາລາວ", value: "clc" },
  { title: "ຂໍ້ມູນທີ່ມີຄວາມຄ້າຍກັນເກີນ 50% ", value: "ctt" },
];

const mapTitle = (nameCode: string) => {
  if (!nameCode || !Array.isArray(groupData)) {
    return "-";
  }
  const nameTitle = groupData.find((item) => item.value === nameCode);
  return nameTitle ? nameTitle.title : nameTitle;
};
const expandedGroups = ref<Set<number>>(new Set());
async function onSelectionChange(value: number) {
  reques.limit = value;
  MergMactStore.GetDataGroup();
}
async function onPagechange(value: number) {
  reques.page = value;
  MergMactStore.GetDataGroup();
}
const toggleExpand = (groupOrder: number) => {
  if (expandedGroups.value.has(groupOrder)) {
    expandedGroups.value.delete(groupOrder);
  } else {
    expandedGroups.value.add(groupOrder);
  }
};
const formatNumber = (num: number | undefined) => {
  if (!num) return "0";
  return num.toLocaleString("en-US");
};
const isExpanded = (groupOrder: number) => {
  return expandedGroups.value.has(groupOrder);
};
watch(selectType, async (newValue) => {
  MergMactStore.query_group.query.code = newValue;
  await MergMactStore.GetDataGroup();
});
const expandedItems = ref<any[]>([]);
onMounted(() => {
  MergMactStore.GetDataGroup();
});
</script>

<template>
  <v-card rounded="lg" elevation="1">
    <v-card-title
      class="pa-4 d-flex align-center justify-space-between bg-grey-lighten-4"
    >
      <div class="d-flex align-center gap-2">
        <v-icon size="20">mdi-file-tree</v-icon>
        <span class="text-subtitle-1 font-weight-medium"
          >ຈັບກຸ່ມຂໍ້ມູນທີ່ຄ້າຍກັນຕາມ:
          <v-chip size="small" color="primary" variant="tonal">{{
            mapTitle(selectType)
          }}</v-chip>
        </span>
      </div>
      <v-chip size="small" color="primary" variant="tonal">
        ຂໍ້ມູນທັງໝົດ
        {{
          formatNumber(MergMactStore.response_data_group?.summary.total_records)
        }}
        ລາຍການ
      </v-chip>

      <v-chip size="small" color="primary" variant="tonal">
        ກຸມທັງໝົດ
        {{
          formatNumber(MergMactStore.response_data_group?.summary.total_groups)
        }}
        ກຸ່ມ
      </v-chip>

      <div>
        <v-autocomplete
          v-model="selectType"
          :items="groupData"
          density="compact"
          variant="outlined"
          hide-details
          width="300"
        ></v-autocomplete>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :headers="groupHeaders"
      :items="DataGroup"
      item-value="group_order"
      v-model:expanded="expandedItems"
      show-expand
      density="compact"
      class="simple-data-table"
      :items-per-page="reques.limit"
      hide-default-footer
    >
      <template v-slot:headers="{ columns }">
        <tr class="bg-blue-grey-lighten-5">
          <th
            v-for="column in columns"
            class="text-body-2 font-weight-bold text-blue-grey-darken-2 pa-4"
            :class="column.align === 'center' ? 'text-center' : ''"
          >
            <b style="color: blue">{{ column.title }}</b>
          </th>
        </tr>
      </template>
      <template #item.group_order="{ item }">
        <span class="text-body-2 font-weight-medium text-grey-darken-2">
          {{ item.group_order }}
        </span>
      </template>

      <template #item.count="{ item }">
        <v-chip
          size="x-small"
          :color="
            item.count >= 10 ? 'error' : item.count >= 5 ? 'warning' : 'success'
          "
          variant="tonal"
        >
          {{ item.count }}
        </v-chip>
      </template>

      <template #item.matched_value="{ item }">
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <span
              v-bind="props"
              class="text-body-2 text-primary font-weight-medium text-truncate d-inline-block"
              style="max-width: 180px"
            >
              {{ mapTitle(selectType) }}: {{ item.matched_value }}
            </span>
          </template>
          {{ mapTitle(selectType) }}: {{ item.matched_value }}
        </v-tooltip>
      </template>

      <template #item.sample_mm_id="{ item }">
        <span class="text-caption text-grey-darken-1">
          {{ item.sample_mm_id }}
        </span>
      </template>

      <!-- Slot: ຄວາມຄ້າຍ -->
      <!-- <template #item.similarity_score="{ item }">
                    <span v-if="item.similarity_score" class="text-caption text-info font-weight-medium">
                        {{ (item.similarity_score * 100).toFixed(0) }}%
                    </span>
                    <span v-else class="text-caption text-grey-lighten-1">—</span>
                </template> -->

      <template #expanded-row="{ item, columns }">
        <tr>
          <td :colspan="columns.length" class="pa-0">
            <div class="detail-container">
              <v-data-table
                :headers="detailHeaders"
                :items="item.items"
                item-value="com_sys_id"
                density="compact"
                class="detail-data-table text-no-wrap"
                :items-per-page="-1"
                hide-default-footer
              >
                <template #item.com_sys_id="{ item: detailItem }">
                  <span class="text-caption text-primary">{{
                    detailItem.com_sys_id
                  }}</span>
                </template>

                <template #item.mm_com_sys_id="{ item: detailItem }">
                  <span class="text-caption">{{
                    detailItem.mm_com_sys_id
                  }}</span>
                </template>

                <template #item.bnk_code="{ item: detailItem }">
                  <v-chip size="x-small" color="secondary" variant="tonal">
                    {{ detailItem.bnk_code }}
                  </v-chip>
                </template>

                <template #item.customerid="{ item: detailItem }">
                  <span class="text-caption">{{ detailItem.customerid }}</span>
                </template>

                <template #item.com_enterprise_code="{ item: detailItem }">
                  <span class="text-caption">{{
                    detailItem.com_enterprise_code
                  }}</span>
                </template>

                <template #item.com_tax_no="{ item: detailItem }">
                  <span class="text-caption text-grey-darken-1">{{
                    detailItem.com_tax_no || "—"
                  }}</span>
                </template>

                <template #item.com_name="{ item: detailItem }">
                  <v-tooltip max-width="300">
                    <template #activator="{ props }">
                      <span
                        v-bind="props"
                        class="text-caption text-truncate d-inline-block"
                        style="max-width: 220px"
                      >
                        {{ detailItem.com_name }}
                      </span>
                    </template>
                    {{ detailItem.com_name }}
                  </v-tooltip>
                </template>

                <template #item.com_lao_name="{ item: detailItem }">
                  <v-tooltip max-width="300">
                    <template #activator="{ props }">
                      <span
                        v-bind="props"
                        class="text-caption text-truncate d-inline-block"
                        style="max-width: 220px"
                      >
                        {{ detailItem.com_lao_name }}
                      </span>
                    </template>
                    {{ detailItem.com_lao_name }}
                  </v-tooltip>
                </template>

                <template #item.com_registration_date="{ item: detailItem }">
                  <span class="text-caption">{{
                    detailItem.com_registration_date
                  }}</span>
                </template>

                <template #item.status="{ item: detailItem }">
                  <v-chip
                    size="x-small"
                    :color="detailItem.status === 'f' ? 'success' : 'error'"
                    variant="tonal"
                  >
                    {{ detailItem.status?.toUpperCase() }}
                  </v-chip>
                </template>
              </v-data-table>

              <div class="detail-footer pa-2 bg-grey-lighten-5">
                <span class="text-caption text-grey-darken-1">
                  <v-icon size="12">mdi-information</v-icon>
                  ທັງໝົດ {{ item.items?.length || 0 }} ລາຍການ
                </span>
              </div>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:bottom>
        <GloBalTablePaginations
          :page="reques.page"
          :limit="reques.limit"
          :totalpage="MergMactStore.response_data_group?.pagination.total_pages"
          @onPagechange="onPagechange"
          @onSelectionChange="onSelectionChange"
        />
      </template>
    </v-data-table>

    <v-overlay :model-value="MergMactStore.isLoading">
      <v-progress-circular
        indeterminate
        size="48"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<style scoped>
.simple-table thead tr {
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.simple-table thead th {
  padding: 10px 8px !important;
  color: #616161 !important;
}

.simple-table tbody tr {
  border-bottom: 1px solid #f5f5f5;
}

.simple-table tbody tr:hover {
  background-color: #fafafa;
}

.simple-table tbody tr.expanded {
  background-color: #e3f2fd;
}

.simple-table tbody td {
  padding: 8px !important;
}

.detail-row {
  background-color: transparent !important;
}

.detail-container {
  margin: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.detail-table {
  background-color: white;
}

.detail-table thead tr {
  background-color: #f5f5f5;
}

.detail-table thead th {
  padding: 8px 6px !important;
  color: #757575 !important;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
}

.detail-table tbody tr {
  border-bottom: 1px solid #f5f5f5;
}

.detail-table tbody tr:hover {
  background-color: #fafafa;
}

.detail-table tbody td {
  padding: 6px !important;
}

.detail-footer {
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 3px;
}
</style>
