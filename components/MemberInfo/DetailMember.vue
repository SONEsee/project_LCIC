<script setup lang="ts">
import type { LochalUserData } from "~/types";
import { LocationStore } from "~/stores/locationService";
import { onMounted, computed, ref, watch } from "vue";
import { MemberStore } from "~/stores/memberinfo";
import { useRoute, useRouter } from "vue-router";


const memberinfoStore = MemberStore();
const locationStore = LocationStore();
const route = useRoute();
const router = useRouter();


const getMemberId = (): number | undefined => {
  const queryId = route.query.id;
  
  if (typeof queryId === 'string') {
    const numericId = parseInt(queryId, 10);
    if (!isNaN(numericId)) {
      return numericId;
    }
  } 
  else if (Array.isArray(queryId) && queryId.length > 0) {
    const numericId = parseInt(queryId[0], 10);
    if (!isNaN(numericId)) {
      return numericId;
    }
  }
  
  return undefined;
};


const id = getMemberId();
const res = computed(() => {
  return memberinfoStore.respone_data_detail;
});


onMounted(async () => {
  if (id !== undefined) {
    await memberinfoStore.getMemberInfoDetail(id);
    
  } else {
    console.error("ບໍ່ພົບ ID ທີ່ຖືກຕ້ອງໃນ URL");

  }
});


const getMemberTypeText = (memberType: any) => {
  if (memberType === 1) return "ທະນາຄານ";
  if (memberType === 2) return "ສະຖາບັນ";
  return "-";
};

const getMemberStatus = (published: any) => {
  if (published === true) return "ເປີດໃຊ້ງານຢູ່";
  if (published === false) return "ປິດການໃຊ້ງານ"; 
  return "-";
};


const form = ref<any>(null);
const isEdit = ref(false);
const isLoading = computed(() => memberinfoStore.loading || locationStore.loading);


const selectedProvince = ref<LochalUserData.Province | null>(null);
const selectedDistrict = ref<LochalUserData.District | null>(null);
const selectedVillage = ref<LochalUserData.Village | null>(null);


const rules = {
  required: (v: string) => !!v || "ຈຳເປັນຕ້ອງປ້ອນຂໍ້ມູນນີ້",
  minLength: (v: string) => v.length >= 3 || "ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ",
  emailRules: (v: string) => /.+@.+\..+/.test(v) || "ອີເມວບໍ່ຖືກຕ້ອງ",
};








const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};





</script>

<template>
  <v-container fluid>
   
    <v-row>
      <v-col cols="12">
        <v-card elevation="1" class="mb-4 rounded-lg">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <h2 class="text-h5 font-weight-bold primary--text">ລາຍລະອຽດຂໍ້ມູນຂອງ: {{ res?.nameL || '' }}</h2>
              <div class="text-subtitle-2 text-grey">{{ res?.nameE || '' }}</div>
            </div>
          
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

  
    <v-form ref="form" v-model="isFormValid" lazy-validation>
      <v-row>
       
        <v-col cols="12">
          <v-card elevation="1" class="mb-4 rounded-lg">
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-card-account-details</v-icon>
              ຂໍ້ມູນທົ່ວໄປ
            </v-card-title>
            
            <v-card-text>
              <v-row>
              
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="res?.nameL"
                    label="ຊື່ວິສາຫະກິດພາສາລາວ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
             
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="res?.nameE"
                    label="ຊື່ວິສາຫະກິດພາສາອັງກິດ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
                
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="res?.slug"
                    label="ລະຫັດສະມາຊິກທີ່ເປັນອັກສອນ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
               
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="res?.code"
                    label="ອັກສອນຫຍໍ້"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
                
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="formatDate(res?.dateRegis)"
                    label="ມື້ລົງທະບຽນ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
           
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="getMemberTypeText(res?.memberType)"
                    label="ປະເພດສະມາຊິກ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
             
                <v-col cols="12" md="6">
                  <v-textarea
                    :model-value="res?.descL"
                    label="ລາຍລະອຽດສະມາຊິກພາສາລາວ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    auto-grow
                    rows="3"
                    class="mb-2"
                  ></v-textarea>
                </v-col>
                
              
                <v-col cols="12" md="6">
                  <v-textarea
                    :model-value="res?.descE"
                    label="ລາຍລະອຽດສະມາຊິກພາສາອັງກິດ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    auto-grow
                    rows="3"
                    class="mb-2"
                  ></v-textarea>
                </v-col>
                
           
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="getMemberStatus(res?.published)"
                    label="ສະຖານະສະມາຊິກ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                    :color="res?.published ? 'success' : 'error'"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        
       
        <v-col cols="12">
          <v-card elevation="1" class="rounded-lg">
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
              ຂໍ້ມູນທີ່ຕັ້ງ
            </v-card-title>
            
            <v-card-text>
              <v-row>
        
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="res?.streetInfoL"
                    label="ທີ່ຕັ້ງສະມາຊິກພາສາລາວ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
             
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="res?.streetInfoE"
                    label="ທີ່ຕັ້ງສະມາຊິກພາສາອັງກິດ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
                <v-divider class="mt-2 mb-4"></v-divider>
                
               
                <v-col cols="12">
                  <div class="text-body-1 font-weight-medium mb-3">ຂໍ້ມູນທີ່ຕັ້ງປັດຈຸບັນ</div>
                </v-col>
                
                
                <v-col cols="12" md="4" v-if="!isEdit">
                  <v-text-field
                    :model-value="selectedVillage?.name || '-'"
                    label="ບ້ານ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
              
                <v-col cols="12" md="4" v-if="!isEdit">
                  <v-text-field
                    :model-value="selectedDistrict?.name || '-'"
                    label="ເມືອງ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
                
                <v-col cols="12" md="4" v-if="!isEdit">
                  <v-text-field
                    :model-value="selectedProvince?.name || '-'"
                    label="ແຂວງ"
                    variant="outlined"
                    readonly
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                
              
                <!-- <template v-if="isEdit">
                  <v-col cols="12" md="4">
                    <v-text-field
                      :model-value="re"
                      label="ເລືອກແຂວງ"
                      :items="locationStore.province"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :loading="locationStore.loading"
                      return-object
                      required
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="selectedDistrict"
                      label="ເລືອກເມືອງ"
                      :items="locationStore.district"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :loading="locationStore.loading"
                      :rules="[rules.required]"
                      @update:model-value="onDistrictChange"
                      return-object
                      :disabled="!selectedProvince"
                      required
                      density="comfortable"
                      placeholder="ກະລຸນາເລືອກເມືອງ"
                      persistent-placeholder
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="selectedVillage"
                      label="ເລືອກບ້ານ"
                      :items="locationStore.village"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :loading="locationStore.loading"
                      :rules="[rules.required]"
                      return-object
                      :disabled="!selectedDistrict"
                      required
                      density="comfortable"
                      placeholder="ກະລຸນາເລືອກບ້ານ"
                      persistent-placeholder
                    ></v-autocomplete>
                  </v-col>
                </template> -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="1" class="rounded-lg">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
            ຂໍ້ມູນລະບົບ
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="formatDate(res?.insertDate)"
                  label="ວັນທີສ້າງ"
                  variant="outlined"
                  readonly
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="formatDate(res?.updateDate)"
                  label="ວັນທີແກ້ໄຂລ່າສຸດ"
                  variant="outlined"
                  readonly
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>