<template>
  <div class="image-background" :style="{}">
    <v-container>
      <v-card
        class="text-start"
        color="rgba(255, 255, 255, 0.9)"
        :style="{
          border: '3px #00B0FF solid',
        }"
      >
        <div class="text-center">
          <p class="main-title">ຄົ້ນຫານິຕິບຸກຄົນ</p>
        </div>

        <div class="d-flex justify-center mt-10">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="3"></v-col>
              <v-col cols="12" md="6">
                <v-card
                  class="mb-13"
                  color="rgba(255, 255, 255, 0.8)"
                  :style="{
                    border: '2px #B3E5FC solid',
                  }"
                >
                  <v-form @submit.prevent="submit" class="mt-7">
                    <v-container>
                      <div class="mt-1">
                        <label class="field-label" for="idLCIC">
                          ລະຫັດ ຂສລ*
                        </label>
                        <v-text-field
                          v-model="id1"
                          prepend-inner-icon="fluent:password-20-regular"
                          id="idLCIC"
                          name="idLCIC"
                          type="text"
                          placeholder="ປອ້ນລະຫັດ ຂສລ....."
                          class="input-field"
                          @input="onLCICChange"
                          :loading="fetchingEnterprise"
                        />
                        <div v-if="fetchingEnterprise" class="text-caption text-blue">
                          ກຳລັງຄົ້ນຫາລະຫັດວິສາຫະກິດ...
                        </div>
                        <div v-if="enterpriseNameFromLCIC" class="text-caption text-green mt-1">
                          ວິສາຫະກິດ: {{ enterpriseNameFromLCIC }}
                        </div>
                      </div>
                      <div class="mt-1">
                        <label class="field-label" for="idcompany">
                          ລະຫັດວິສາຫະກິດ*
                        </label>
                        <v-text-field
                          v-model="id2"
                          prepend-inner-icon="fluent:password-20-regular"
                          id="idcompany"
                          name="idcompany"
                          type="text"
                          placeholder="ປອ້ນລະຫັດວິສາຫະກິດ....."
                          class="input-field"
                          @input="onEnterpriseChange"
                          :loading="fetchingLCIC"
                        />
                        <div v-if="fetchingLCIC" class="text-caption text-blue">
                          ກຳລັງຄົ້ນຫາລະຫັດ ຂສລ...
                        </div>
                        <div v-if="enterpriseNameFromID" class="text-caption text-green mt-1">
                          ວິສາຫະກິດ: {{ enterpriseNameFromID }}
                        </div>
                      </div>
                      
                      <div class="mt-5">
                        <v-combobox
                          v-model="selectedCat"
                          :items="categories"
                          item-value="cat_sys_id"
                          item-title="cat_lao_name"
                          :return-object="true"
                          label="ເລືອກປະເພດ"
                          variant="outlined"
                          :rules="[ruleRequired]"
                          required
                          class="combobox-field"
                        ></v-combobox>
                        <v-btn
                          type="submit"
                          block
                          min-height="44"
                          class="gradient primary search-btn"
                        >
                          ຄົ້ນຫາ
                        </v-btn>
                      </div>
                    </v-container>
                  </v-form>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </div>
        <div v-if="loading" class="loading-text">
          <p>ກຳລັງໂຫຼດ.........</p>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Search",
  meta: [
    {
      name: "keywords",
      content: "Report, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Report Nuxt 3, IT Genius Engineering",
    },
  ],
});

const selectedCat = ref<Category | null>(null);
const id1 = ref<string>(""); 
const id2 = ref<string>(""); 
const loading = ref<boolean>(false);
const fetchingEnterprise = ref<boolean>(false);
const fetchingLCIC = ref<boolean>(false);
const enterpriseNameFromLCIC = ref<string>(""); 
const enterpriseNameFromID = ref<string>(""); 
const ruleRequired = (v: any) => !!v || "ຈຳເປັນຕ້ອງໃສ່";


let lcicTimeout: NodeJS.Timeout | null = null;
let enterpriseTimeout: NodeJS.Timeout | null = null;

const categories = ref<any[]>([]);
interface Category {
  cat_sys_id: string;
  cat_name: string;
}

onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${config.public.strapi.url}api/catalog-cats/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      categories.value = data;
    } else {
      console.error("Failed to fetch categories:", response.statusText);
    }
  } catch (error) {
    console.error("Error occurred while fetching categories:", error);
  }
});


const fetchEnterpriseByLCIC = async (lcicCode: string) => {
  if (!lcicCode.trim() || lcicCode.length < 3) return;
  
  fetchingEnterprise.value = true;
  enterpriseNameFromLCIC.value = ""; 
  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${config.public.strapi.url}api/api/v1/enterprise-info/by-lcic/${lcicCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.enterprise_id) {
        id2.value = data.enterprise_id;
        enterpriseNameFromLCIC.value = data.enterprise_name || "";
      }
    }
  } catch (error) {
    console.error("Error fetching enterprise by LCIC:", error);
  } finally {
    fetchingEnterprise.value = false;
  }
};


const fetchLCICByEnterprise = async (enterpriseId: string) => {
  if (!enterpriseId.trim() || enterpriseId.length < 3) return;
  
  fetchingLCIC.value = true;
  enterpriseNameFromID.value = "";
  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${config.public.strapi.url}api/api/v1/enterprise-info/by-enterprise/${enterpriseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.lcic_code) {
        id1.value = data.lcic_code;
        enterpriseNameFromID.value = data.enterprise_name || "";
      }
    }
  } catch (error) {
    console.error("Error fetching LCIC by enterprise:", error);
  } finally {
    fetchingLCIC.value = false;
  }
};


const onLCICChange = (event: any) => {
  const value = event.target.value;
  
  // ລຶບ timeout ເກົ່າ
  if (lcicTimeout) {
    clearTimeout(lcicTimeout);
  }
  
  
  if (!value.trim()) {
    id2.value = "";
    enterpriseNameFromLCIC.value = "";
    return;
  }
  

  lcicTimeout = setTimeout(() => {
    fetchEnterpriseByLCIC(value);
  }, 800);
};


const onEnterpriseChange = (event: any) => {
  const value = event.target.value;
  
  // ລຶບ timeout ເກົ່າ
  if (enterpriseTimeout) {
    clearTimeout(enterpriseTimeout);
  }
  
 
  if (!value.trim()) {
    id1.value = "";
    enterpriseNameFromID.value = "";
    return;
  }
  
  
  enterpriseTimeout = setTimeout(() => {
    fetchLCICByEnterprise(value);
  }, 800);
};

const submit = async () => {
 
  if (!id1.value?.trim() && !id2.value?.trim()) {
    Swal.fire({
      icon: "warning", 
      title: "ແຈ້ງເຕືອນ",
      text: "ກະລຸນາໃສ່ລະຫັດ ຂສລ ຫຼື ລະຫັດວິສາຫະກິດ ຢ່າງໜ້ອຍໜຶ່ງອັນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  if (!selectedCat.value) {
    Swal.fire({
      icon: "warning",
      title: "ແຈ້ງເຕືອນ", 
      text: "ກະລຸນາເລືອກປະເພດກ່ອນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  loading.value = true;
  Swal.fire({
    title: "ກະລຸນາລໍຖ້າ",
    text: "ກຳລັງດາວໂຫຼດຂໍ້ມູນ...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${config.public.strapi.url}api/api/v1/enterprise-info/search/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          LCIC_code: id1.value?.trim() || "",
          EnterpriseID: id2.value?.trim() || "",
          CatalogID: selectedCat.value.cat_sys_id,
        }),
      }
    );

    const data = await res.json();
    console.log("Response data:", data);

    if (res.ok && data.enterprise_info && data.enterprise_info.length > 0) {
      Swal.close();

      const params = new URLSearchParams();
      if (id1.value?.trim()) params.append('LCIC_code', id1.value.trim());
      if (id2.value?.trim()) params.append('EnterpriseID', id2.value.trim());
      if (selectedCat.value?.cat_sys_id) params.append('CatalogID', selectedCat.value.cat_sys_id);

      await navigateTo(`/backend/datasearch?${params.toString()}`);
      
    } else if (res.ok && (!data.enterprise_info || data.enterprise_info.length === 0)) {
      Swal.fire({
        icon: "warning",
        title: "ບໍ່ພົບຂໍ້ມູນ",
        text: "ຂໍອະໄພ, ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ ກະລຸນາກວດສອບລະຫັດທີ່ໃສ່ເຂົ້າມາ",
        confirmButtonText: "ຕົກລົງ",
      });
    } else {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ການດືງຂໍ້ມູນຜິດພາດ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      confirmButtonText: "ຕົກລົງ",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Import Lao fonts */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700&display=swap');

/* Global font setting */
* {
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

.image-background {
  background-image: url("@/assets/images/feed/logo.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Title styling */
.main-title {
  font-size: 24px;
  font-weight: 600;
  color: #1A237E;
  margin-top: 40px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

/* Label styling */
.field-label {
  font-size: 16px;
  font-weight: 500;
  color: #424242;
  margin-bottom: 8px;
  display: block;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

/* Input field styling */
.input-field :deep(.v-field__input) {
  font-size: 16px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
  color: #1A237E;
}

.input-field :deep(.v-field__input::placeholder) {
  font-size: 14px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
  opacity: 0.7;
}

/* Combobox styling */
.combobox-field :deep(.v-field__input) {
  font-size: 16px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
  color: #1A237E;
}

.combobox-field :deep(.v-label) {
  font-size: 16px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

/* Button styling */
.search-btn {
  font-size: 16px;
  font-weight: 500;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
  margin-top: 20px;
}

/* Loading text */
.loading-text {
  text-align: center;
  margin-top: 20px;
}

.loading-text p {
  font-size: 16px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
  color: #666;
}

/* Vuetify overrides for consistent fonts */
:deep(.v-btn__content) {
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

:deep(.v-field-label) {
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

:deep(.v-list-item-title) {
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

input {
  margin: 5px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

button {
  margin: 10px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

h2 {
  margin-top: 20px;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

.text-blue {
  color: #1976d2 !important;
}

.text-green {
  color: #4caf50 !important;
  font-weight: 500;
}
</style>