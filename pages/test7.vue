<template>
  <div class="border py-2 my-2 rounded-lg">
    <table class="styled-table">
      <thead>
        <tr class="head-th">
          <th> ທະນາຄານ</th>
          <th>ສາຂາ</th>
          <th>ຈໍານວນຜູ້ໃຊ້ງານ</th>
          <th>ເຫດການ</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(bank, index) in userCounts"
          :key="index"
          class="body-row"
        >
          <td>{{ bank.member_code }} - {{ bank.member_nameL }} - ({{ bank.bnk_code }})</td>
          <td>{{ bank.branch_name }} - ({{ bank.branch_id }})</td>
          <td>{{ bank.user_count || 'N/A' }}</td>
          <td>
            <v-btn
              @click="viewDetail(bank.bnk_code, bank.branch_id)"
              class="custom-button pa-1"
              color="white"
              small
            >
              <v-icon left>mdi-eye</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Users",
});

const userCounts = ref([]);
const router = useRouter();
const route = useRoute();

const fetchUserCounts = async () => {
  try {
    const bnk_code = route.query.bnk_code || "";
    const branch_id = route.query.branch_id || "";

    let apiUrl = `http://192.168.45.56:8000/api/distinct-bnk-codes/?bnk_code=${bnk_code}`;
    if (branch_id) {
      apiUrl += `&branch_id=${branch_id}`;
    }

    const response = await $fetch(apiUrl);
    if (response) {
      userCounts.value = response;
    } else {
      console.error("Failed to fetch user counts.");
    }
  } catch (error) {
    console.error("Error fetching user count data:", error);
  }
};

const viewDetail = (bnk_code, branch_id) => {
  const detailUrl = `/test8/?bnk_code=${bnk_code}&branch_id=${branch_id}`;
  router.push(detailUrl);
};

onMounted(fetchUserCounts);
</script>

<style>
.styled-table {
  border-collapse: collapse;
  border-radius: 10px;
  width: 100%;
  margin: 20px 0;
  font-size: 14px;
  text-align: left;
}

.styled-table th,
.styled-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.head-th {
  font-style: normal !important;
  font-size: 15px !important;
  color: gray;
  background-color: #f5f5f5;
}
.body-row {
  border: none;
  color: black;
}
.head-td {
  font-style: normal !important;
  color: black;
}

.styled-table th {
  background-color: #e0e0e0;
}

.custom-button {
  background-color: rgb(248, 248, 248);
  color: #333; /* Adjust text color */
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-button:hover {
  background-color: #e0e0e0;
}

.custom-button i {
  margin-right: 5px;
  font-size: 16px;
}
</style>
