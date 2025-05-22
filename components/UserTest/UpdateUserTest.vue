<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useUserManageStore } from "~/stores/usermanage";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const useStore = useUserManageStore();

import { MemberStore } from "~/stores/memberinfo";
const memberinfoStore = MemberStore();


const ret = computed(() => {
  if (Array.isArray(memberinfoStore.respons_data_query)) {
    return memberinfoStore.respons_data_query;
  } else if (
    memberinfoStore.respons_data_query &&
    typeof memberinfoStore.respons_data_query === "object"
  ) {
    return [memberinfoStore.respons_data_query];
  } else {
    return [];
  }
});

const userStore = useUserManageStore();
const roles = computed<any[]>(() => {
  const rawData = userStore.respons_role_data;
  return rawData ? (Array.isArray(rawData) ? rawData : [rawData]) : [];
});


const req = computed(() => userStore.form_create_data);
const visible = ref(false);
const form = ref();
const toggleVisibility = () => {
  visible.value = !visible.value;
};


const res = computed(() => {
  return useStore.respons_user_data_detail;
});


const route = useRoute();
const id = Number(
  Array.isArray(route.query.id) ? route.query.id[0] : route.query.id
);


const currentImageUrl = ref('');
const newImageFile = ref<File | null>(null);
const previewImageUrl = ref('');


const getMIDValue = (midData: any) => {
  if (typeof midData === "object" && midData !== null) {
    return midData.code || "";
  }
  return String(midData || "");
};

const getGIDValue = (gidData: any) => {
  if (typeof gidData === "object" && gidData !== null && gidData.nameE) {
    return String(gidData.nameE);
  }
  return String(gidData || "");
};

onMounted(() => {
  userStore.Getrole();
  memberinfoStore.getMemberInfo();
});


onMounted(() => {
  if (id) {
    useStore.getDetailUser(id).then(() => {
      if (useStore.respons_user_data_detail) {
        
        useStore.form_update_data = {
          nameE: useStore.respons_user_data_detail.nameE || "",
          bnk_code: useStore.respons_user_data_detail.bnk_code || "",
          nameL: useStore.respons_user_data_detail.nameL || "",
          surnameE: useStore.respons_user_data_detail.surnameE || "",
          surnameL: useStore.respons_user_data_detail.surnameL || "",
          username: useStore.respons_user_data_detail.username || "",
          password: useStore.respons_user_data_detail.password || "",
          profile_image: null,
          MID: getMIDValue(useStore.respons_user_data_detail.MID),
          GID: getGIDValue(useStore.respons_user_data_detail.GID),
        };

      
        if (useStore.respons_user_data_detail.profile_image) {
          currentImageUrl.value = `${config.public.strapi.url}${useStore.respons_user_data_detail.profile_image}`;
        }
      }
    });
  }
});


const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    newImageFile.value = file;
    
    
    previewImageUrl.value = URL.createObjectURL(file);
  }
};


const cancelImageChange = () => {
  newImageFile.value = null;
  previewImageUrl.value = '';
  useStore.form_update_data.profile_image = null;
};


const submitForm = async () => {
  try {
 
    const formData = new FormData();
    
    
    formData.append('MID', useStore.form_update_data.MID);
    formData.append('GID', useStore.form_update_data.GID);
    formData.append('username', useStore.form_update_data.username);
    formData.append('nameL', useStore.form_update_data.nameL);
    formData.append('nameE', useStore.form_update_data.nameE);
    formData.append('surnameL', useStore.form_update_data.surnameL);
    formData.append('surnameE', useStore.form_update_data.surnameE);
    
   
    if (useStore.form_update_data.password) {
      formData.append('password', useStore.form_update_data.password);
    }
    
    
    if (newImageFile.value) {
      formData.append('profile_image', newImageFile.value);
    }

    
    await useStore.upDateUser(id, formData);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>

<template>
  <v-container>
    <v-form style="width: 100%" ref="form" class="text-center" @submit.prevent="submitForm">
   
      <v-row justify="center" class="mb-4">
        <v-col cols="12" md="6" class="text-center">
          <div class="user-image-container">
          
            <div v-if="previewImageUrl" class="image-preview-container">
              <img
                :src="previewImageUrl"
                alt="Preview"
                class="user-image"
              />
              <div class="image-actions mt-2">
                <v-btn
                  size="small"
                  color="error"
                  variant="outlined"
                  @click="cancelImageChange"
                >
                  ຍົກເລີກຮູບໃໝ່
                </v-btn>
              </div>
            </div>
            
            
            <div v-else>
              <img
                v-if="currentImageUrl"
                :src="currentImageUrl"
                alt="User Image"
                class="user-image"
              />
              <div v-else class="no-image-placeholder">
                ບໍ່ມີຮູບພາບ
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg"
              id="username"
              v-model="useStore.form_update_data.username"
              label="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="useStore.form_update_data.nameL"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ຊື່ພາສາລາວ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="useStore.form_update_data.nameE"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ຊື່ພາສາອັງກິດ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="useStore.form_update_data.surnameL"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ນາມສະກຸນພາສາລາວ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="useStore.form_update_data.surnameE"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ນາມສະກຸນພາສາອັງກິດ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="useStore.form_update_data.MID"
              density="compact"
              variant="outlined"
              label="ເລືອກ bnk_code"
              :items="ret"
              item-title="nameL"
              item-value="bnk_code"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="useStore.form_update_data.MID"
              density="compact"
              variant="outlined"
              label="ເລືອກ ອັກສອນຫຍໍ້"
              :items="ret"
              item-title="code"
              item-value="bnk_code"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="useStore.form_update_data.GID"
              density="compact"
              variant="outlined"
              label="ເລືອກ ສິດເຂົ້ານຳໃຊ້"
              :items="roles"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            
            <v-file-input
              density="compact"
              variant="outlined"
              label="ເລືອກຮູບພາບຜູ້ໃຊ້"
              prepend-icon="mdi-camera"
              @change="handleImageSelect"
              v-model="useStore.form_update_data.profile_image" 
              accept="image/*"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="useStore.form_update_data.password"
              @click:append-inner="toggleVisibility"
              label="ລະຫັດຜ່ານ"
              density="compact"
              variant="outlined"
              type="password"
              placeholder="ປ່ອຍຫວ່າງຖ້າບໍ່ຕ້ອງການປ່ຽນລະຫັດຜ່ານ"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-btn class="mt-4 rounded-lg" color="primary" type="submit" flat>
        ບັນທືກ
      </v-btn>
      <v-btn
        class="mt-4 ml-2 rounded-lg"
        color="error"
        @click="$router.push('/backend/manageuser/userlist')"
        flat
      >
        ຍົກເລີກ
      </v-btn>
    </v-form>
  </v-container>
</template>

<style scoped>
.user-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #f0f0f0;
}

.no-image-placeholder {
  width: 150px;
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #666;
}

.image-upload-container {
  margin-top: 10px;
}

.image-upload-input {
  display: none;
}

.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}
</style>