<script setup lang="ts">
import dayjs from "dayjs";
import { ref, onMounted, computed, toRaw } from "vue";
import { useRoute } from "vue-router";
import axios from "~/helpers/axios";


interface User {
  username: string;
  id: string;
  GID: { GID: number };
  MID: { MID: string; id: string };
  UID: string;
}

interface Result {
  id: number;
  LCIC_code: string | null;
  com_enterprise_code: string | null;
  status: string | null;
  enterpriseNameLao: string | null;
  investmentCurrency: string | null;
  created_at: string | null;
}


const user = ref<User | null>(null);
const user_id = ref<string | null>(null);
const route = useRoute();
const id = ref(route.query.id as string);
const results = ref<Result[]>([]);
const isProcessing = ref(false);
const processingItems = ref<Record<number, boolean>>({});
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});


const initializeUser = () => {
  try {
    const userData = localStorage.getItem("user_data");
    console.log("data user ", userData);

    if (userData) {
      const parsedUser = JSON.parse(userData) as User;
      user.value = parsedUser;
      user_id.value = parsedUser?.MID?.id || null;
      
      const user_mid = parsedUser?.UID;
      const user_gid = parsedUser?.GID?.GID;

      console.log("GID", user_gid);
      console.log("UID", user_mid);
      console.log("user_id", user_id.value);

      return user_id.value;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    user.value = null;
    user_id.value = null;
  }
  return null;
};


initializeUser();

// ເພີ່ມຟັງຊັນກວດສອບວ່າເປັນວັນດຽວກັນບໍ່
const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const today = dayjs().format('YYYY-MM-DD');
  const itemDate = dayjs(dateString).format('YYYY-MM-DD');
  return today === itemDate;
};


definePageMeta({
  layout: "backend",
});

useHead({
  title: "ລາຍງານ",
  meta: [
    {
      name: "keywords",
      content: "ລາຍງານ, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "ລາຍງານ Nuxt 3, IT Genius Engineering",
    },
  ],
});

const header = computed(() => {
  const headers = [
    { title: "ID", value: "id" },
    { title: "LCIC ID", value: "LCIC_code" },
    { title: "ລະຫັດບໍລິສັດ", value: "com_enterprise_code" },
    { title: "ຊື່ບໍລິສັດ (ພາສາລາວ)", value: "enterpriseNameLao" },
    { title: "ສະກຸນເງິນລົງທຶນ", value: "investmentCurrency" },
    { title: "ວັນທີສ້າງ", value: "created_at" },
    { title: "ສະຖານະ", value: "status" },
  ];

  if (user_id.value !== '01') {
    headers.push({ title: "ການກະທຳ", value: "action" });
  }
  
  return headers;
});

const processedResults = computed(() =>
  results.value.filter(
    (item) => item.status === "Found" || item.status === "3"
  )
);

const showNotification = (message: string, color: string = 'success') => {
  snackbar.value.text = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const fetchResults = async () => {
  try {
    console.log("Route query ID:", id.value);
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.strapi.url}api/api/get-search-results/${id.value}/`
    );

    const data = await response.json();

    if (data.results && Array.isArray(data.results)) {
      results.value = data.results;
      console.log("Processed results:", toRaw(results.value));
    } else {
      console.warn("Unexpected response format:", data);
      results.value = [];
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    showNotification('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ', 'error');
  }
};

const processReport = async (item: Result) => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem("access_token");

  try {
    await fetch(`${config.public.strapi.url}api/update_searchlog_status/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: item.id,
        status: 3,
      }),
    });

  
    const printUrl = `../backend/reportprint1/?EnterpriseID=${item.com_enterprise_code}&LCIC_code=${item.LCIC_code}&CatalogID=${item.id}`;
    window.open(printUrl, '_blank');
    
    
    item.status = '3';
    
    return true;
  } catch (error) {
    console.error("Error processing report:", error);
    showNotification('ເກີດຂໍ້ຜິດພາດໃນການດຳເນີນການ', 'error');
    return false;
  }
};

const processBatchReports = async (items: Result[]) => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem("access_token");

  try {
    const updatePromises = items.map(item => 
      fetch(`${config.public.strapi.url}api/update_searchlog_status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: item.id,
          status: 3,
        }),
      })
    );
    
    await Promise.all(updatePromises);
    const params = items.map(item => 
      `items[]=${encodeURIComponent(JSON.stringify({
        enterpriseId: item.com_enterprise_code,
        lcicCode: item.LCIC_code,
        catalogId: item.id
      }))}`
    ).join('&');
    
    const batchUrl = `../backend/reportprint1/?${params}`;
    window.open(batchUrl, '_blank');
    
    items.forEach(item => {
      item.status = '3';
    });
    
    return items.length;
  } catch (error) {
    console.error("Error processing batch reports:", error);
    showNotification('ເກີດຂໍ້ຜິດພາດໃນການດຳເນີນການແບບກຸ່ມ', 'error');
    return 0;
  }
};

const openReport = async (item: Result) => {
  processingItems.value[item.id] = true;
  try {
    await processReport(item);
  } finally {
    processingItems.value[item.id] = false;
  }
};

const openAllReports = async () => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  let successCount = 0;
  const eligibleItems = processedResults.value.filter(item => item.status === 'Found');
  const totalReports = eligibleItems.length;

  try {
    if (totalReports > 1) {
      successCount = await processBatchReports(eligibleItems);
    } else {
      for (const item of eligibleItems) {
        const success = await processReport(item);
        if (success) successCount++;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    showNotification(
      `ດຳເນີນການສຳເລັດ ${successCount} ຈາກ ${totalReports} ລາຍການ`,
      successCount === totalReports ? 'success' : 'warning'
    );
  } catch (error) {
    console.error("Error processing all reports:", error);
    showNotification('ເກີດຂໍ້ຜິດພາດໃນການດຳເນີນການ', 'error');
  } finally {
    isProcessing.value = false;
  }
};


onMounted(() => {
  fetchResults();
  initializeUser();
});


console.log("user_id", user_id.value);
</script>

<template>
  <v-data-table
    v-if="processedResults.length > 0"
    :items="processedResults"
    :headers="header"
    item-key="id"
    items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>
          <p>ການຄົ້ນຫາທີ່ພົບຂໍ້ມູນໃນຖານຂໍ້ມູນຂອງ ຂສລ</p>
        </v-toolbar-title>
        <v-btn 
          v-if="user?.MID.id !== '01'"
          class="bg-primary" 
          @click="openAllReports"
          :loading="isProcessing"
          :disabled="isProcessing"
        >
          {{ isProcessing ? 'ກຳລັງດຳເນີນການ...' : 'ເປີດທັງໝົດ' }}
        </v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.action="{ item }">
      <div>
      
        <v-btn 
          v-if="item.status === 'Found' && user?.MID.id !== '01'"
          class="bg-primary" 
          @click="openReport(item)"
          :loading="processingItems[item.id]"
          :disabled="processingItems[item.id]"
        >
          ເປີດ
        </v-btn>
        
        
        <v-btn 
          v-else-if="item.status === '3' && isToday(item.created_at) && user?.MID.id !== '01'"
          class="bg-primary" 
          @click="openReport(item)"
          :loading="processingItems[item.id]"
          :disabled="processingItems[item.id]"
        >
          ເປີດ
        </v-btn>
        
       
        <v-chip 
          v-else-if="item.status === '3'"
          color="success"
        >
          <p>ເປີດແລ້ວ</p>
        </v-chip>
      </div>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip color="primary" v-if="item.status === 'Found'">
        <p>ຍັງບໍ່ທັນເປີດ</p>
      </v-chip>
      <v-chip color="primary" v-if="item.status === 'Not Found'">
        <p>ຍັງບໍ່ທັນເປີດ</p>
      </v-chip>
      <v-chip color="success" v-if="item.status === '3'">
        <v-icon icon="mdi-check-circle"></v-icon>
      </v-chip>
    </template>

    <template v-slot:item.created_at="{item}">
      {{ dayjs(item.created_at).format("DD/MM/YYYY") }}
    </template>
  </v-data-table>

  <div v-else>ບໍ່ມີລາຍການທີ່ມີສະຖານະ "Found" ທີ່ມີຢູ່.</div>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
  >
    {{ snackbar.text }}
  </v-snackbar>
</template>