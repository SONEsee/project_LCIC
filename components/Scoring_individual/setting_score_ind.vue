<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const config = useRuntimeConfig();
const apiAttTypes = `${config.public.strapi.url}api/att-types/`;
const apiAttributes = `${config.public.strapi.url}api/attributes/`;

// State
const attTypes = ref<any[]>([]);
const attributes = ref<any[]>([]);
const expandedTypes = ref<Record<string, boolean>>({});
const loading = ref(false);

// Modal states
const showTypeModal = ref(false);
const showAttrModal = ref(false);
const editingType = ref<any>(null);
const editingAttr = ref<any>(null);

// Form data
const typeForm = ref({
  att_type: '',
  att_type_desc: '',
  att_type_lao_desc: '',
  att_weight: 0
});

const attrForm = ref({
  att_type: '',
  att_name: '',
  att_code: '',
  att_value: 0,
  att_group_id: '',
  att_desc: ''
});

onMounted(() => {
  fetchAllData();
});

const fetchAllData = async () => {
  loading.value = true;
  try {
    const [typesRes, attrsRes] = await Promise.all([
      axios.get(apiAttTypes),
      axios.get(apiAttributes)
    ]);
    
    attTypes.value = typesRes.data;
    attributes.value = attrsRes.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ',
      text: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ'
    });
  } finally {
    loading.value = false;
  }
};

// ⭐ ฟังก์ชันคำนวณคะແนนรวมของ att_weight
const getTotalAttWeight = (excludeId?: number) => {
  return attTypes.value
    .filter(type => excludeId ? type.id_desc !== excludeId : true)
    .reduce((sum, type) => sum + (type.att_weight || 0), 0);
};

// ⭐ ฟังก์ชันคำนวณคะแนนรวมของ group 5 โดยจัดกลุ่มตาม att_type
const getTotalAttValueGroup5ByType = (excludeId?: number) => {
  // กรองเฉพาะ group_id = "5" และไม่รวม item ที่กำลังแก้ไข
  const group5Items = attributes.value.filter(attr => 
    attr.att_group_id === "5" &&
    (excludeId ? attr.att_id !== excludeId : true)
  );
  
  // จัดกลุ่มตาม att_type (แต่ละ att_type เอาค่าเดียว)
  const groupedByType: Record<string, number> = {};
  
  group5Items.forEach(attr => {
    const type = attr.att_type;
    // เก็บค่าเดียวต่อ att_type (ถ้ามีหลายตัวจะเอาตัวแรก)
    if (!groupedByType[type]) {
      groupedByType[type] = attr.att_value || 0;
    }
  });
  
  // รวมคะแนนทั้งหมด
  const total = Object.values(groupedByType).reduce((sum, value) => sum + value, 0);
  
  return total;
};

// ============ Attribute Type CRUD ============
const handleSaveType = async () => {
  try {
    const currentWeight = typeForm.value.att_weight;
    const excludeId = editingType.value ? editingType.value.id_desc : undefined;
    const totalWeight = getTotalAttWeight(excludeId);
    const newTotal = totalWeight + currentWeight;

    // ⭐ ตรวจสอบว่าคะแนนรวมเกิน 100 หรือไม่
    if (newTotal > 100) {
      // ⭐ ปิด modal ก่อน
      showTypeModal.value = false;
      
      // ⭐ แสดง Alert ตรงกลางหน้าจอ
      await Swal.fire({
        icon: 'warning',
        title: 'ຄະແນນເກີນກຳນົດ!',
        html: `
          <p>ຄະແນນນ້ຳໜັກລວມຂອງປະເພດຫຼັກຕ້ອງບໍ່ເກີນ 100</p>
          <br>
          <div style="text-align: left; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <p><strong>ຄະແນນລວມປະຈຸບັນ:</strong> ${totalWeight.toFixed(2)}</p>
            <p><strong>ຄະແນນທີ່ຕ້ອງການເພີ່ມ:</strong> ${currentWeight.toFixed(2)}</p>
            <p style="color: #dc2626;"><strong>ຄະແນນລວມໃໝ່:</strong> ${newTotal.toFixed(2)}</p>
            <p style="color: #059669;"><strong>ຄະແນນທີ່ເຫຼືອ:</strong> ${(100 - totalWeight).toFixed(2)}</p>
          </div>
          <br>
          <p style="color: #dc2626; font-weight: bold;">ກະລຸນາຫຼຸດຄະແນນບາງປະເພດກ່ອນເພີ່ມ ຫຼື ລຶບປະເພດອອກ</p>
        `,
        confirmButtonText: 'ເຂົ້າໃຈແລ້ວ',
        confirmButtonColor: '#2931a5'
      });
      
      return;
    }

    if (editingType.value) {
      await axios.put(`${apiAttTypes}${editingType.value.id_desc}/`, typeForm.value);
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: 'ອັບເດດຂໍ້ມູນສຳເລັດ',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await axios.post(apiAttTypes, typeForm.value);
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: 'ເພີ່ມຂໍ້ມູນສຳເລັດ',
        timer: 2000,
        showConfirmButton: false
      });
    }
    
    await fetchAllData();
    closeTypeModal();
  } catch (error) {
    console.error('Error saving type:', error);
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ',
      text: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ'
    });
  }
};

const handleDeleteType = async (id: number) => {
  const result = await Swal.fire({
    title: 'ຢືນຢັນການລຶບ',
    text: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນນີ້?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ລຶບ',
    cancelButtonText: 'ຍົກເລີກ'
  });
  
  if (result.isConfirmed) {
    try {
      await axios.delete(`${apiAttTypes}${id}/`);
      
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: 'ລຶບຂໍ້ມູນສຳເລັດ',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting type:', error);
      Swal.fire({
        icon: 'error',
        title: 'ຜິດພາດ',
        text: 'ບໍ່ສາມາດລຶບຂໍ້ມູນໄດ້'
      });
    }
  }
};

// ============ Attribute CRUD ============
const handleSaveAttr = async () => {
  try {
    const currentValue = attrForm.value.att_value;
    const attType = attrForm.value.att_type;
    const groupId = attrForm.value.att_group_id || '';
    const excludeId = editingAttr.value ? editingAttr.value.att_id : undefined;
    
    // ⭐ คำนวณคะแนนรวมของ group 5 โดยจัดกลุ่มตาม att_type
    const totalValueGroup5 = getTotalAttValueGroup5ByType(excludeId);
    const newTotal = totalValueGroup5 + currentValue;

    // ⭐ ตรวจสอบว่าคะแนนรวมเกิน 1000 หรือไม่
    if (newTotal > 1000) {
      // ⭐ ปิด modal ก่อน
      showAttrModal.value = false;
      
      // ⭐ แสดง Alert ตรงกลางหน้าจอ (ไม่มีรายละเอียด)
      await Swal.fire({
        icon: 'warning',
        title: 'ຄະແນນເກີນກຳນົດ!',
        html: `
          <p>ຄະແນນລວມຂອງລາຍການຍ່ອຍ ຈາກທຸກປະເພດຕ້ອງບໍ່ເກີນ 1000</p>
          <br>
          <div style="text-align: left; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <p><strong>ປະເພດທີ່ກຳລັງເພີ່ມ:</strong> ${attType}</p>
            <p><strong>ຄະແນນລວມປະຈຸບັນ (ກຸ່ມ 5 ທຸກປະເພດ):</strong> ${totalValueGroup5.toFixed(2)}</p>
            <p><strong>ຄະແນນທີ່ຕ້ອງການເພີ່ມ:</strong> ${currentValue.toFixed(2)}</p>
            <p style="color: #dc2626;"><strong>ຄະແນນລວມໃໝ່:</strong> ${newTotal.toFixed(2)}</p>
            <p style="color: #059669;"><strong>ຄະແນນທີ່ເຫຼືອ:</strong> ${(1000 - totalValueGroup5).toFixed(2)}</p>
          </div>
          <br>
          <p style="color: #dc2626; font-weight: bold;">ກະລຸນາຫຼຸດຄະແນນບາງລາຍການກ່ອນເພີ່ມ ຫຼື ລຶບລາຍການອອກ</p>
          <p style="color: #f59e0b; font-size: 14px; margin-top: 10px;">* ບໍ່ສາມາດເພີ່ມລາຍການໃດໆໄດ້ເມື່ອຄະແນນກຸ່ມ 5 ເຕັມ 1000 ແລ້ວ</p>
        `,
        confirmButtonText: 'ເຂົ້າໃຈແລ້ວ',
        confirmButtonColor: '#2931a5'
      });
      
      return;
    }

    if (editingAttr.value) {
      await axios.put(`${apiAttributes}${editingAttr.value.att_id}/`, attrForm.value);
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: 'ອັບເດດຂໍ້ມູນສຳເລັດ',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await axios.post(apiAttributes, attrForm.value);
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: 'ເພີ່ມຂໍ້ມູນສຳເລັດ',
        timer: 2000,
        showConfirmButton: false
      });
    }
    
    await fetchAllData();
    closeAttrModal();
  } catch (error) {
    console.error('Error saving attribute:', error);
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ',
      text: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ'
    });
  }
};

const handleDeleteAttr = async (id: number) => {
  const result = await Swal.fire({
    title: 'ຢືນຢັນການລຶບ',
    text: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການນີ້?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ລຶບ',
    cancelButtonText: 'ຍົກເລີກ'
  });
  
  if (result.isConfirmed) {
    try {
      await axios.delete(`${apiAttributes}${id}/`);
      
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: 'ລຶບລາຍການສຳເລັດ',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting attribute:', error);
      Swal.fire({
        icon: 'error',
        title: 'ຜິດພາດ',
        text: 'ບໍ່ສາມາດລຶບລາຍການໄດ້'
      });
    }
  }
};

// ============ Modal Handlers ============
const openTypeModal = (type: any = null) => {
  if (type) {
    editingType.value = type;
    typeForm.value = {
      att_type: type.att_type,
      att_type_desc: type.att_type_desc,
      att_type_lao_desc: type.att_type_lao_desc,
      att_weight: type.att_weight
    };
  } else {
    editingType.value = null;
    typeForm.value = {
      att_type: '',
      att_type_desc: '',
      att_type_lao_desc: '',
      att_weight: 0
    };
  }
  showTypeModal.value = true;
};

const openAttrModal = (attr: any = null, defaultType: string = '') => {
  if (attr) {
    editingAttr.value = attr;
    attrForm.value = {
      att_type: attr.att_type,
      att_name: attr.att_name,
      att_code: attr.att_code,
      att_value: attr.att_value,
      att_group_id: attr.att_group_id || '',
      att_desc: attr.att_desc || ''
    };
  } else {
    editingAttr.value = null;
    attrForm.value = {
      att_type: defaultType,
      att_name: '',
      att_code: '',
      att_value: 0,
      att_group_id: '',
      att_desc: ''
    };
  }
  showAttrModal.value = true;
};

const closeTypeModal = () => {
  showTypeModal.value = false;
  editingType.value = null;
};

const closeAttrModal = () => {
  showAttrModal.value = false;
  editingAttr.value = null;
};

const toggleExpand = (attType: string) => {
  expandedTypes.value[attType] = !expandedTypes.value[attType];
};

const getAttributesByType = (attType: string) => {
  return attributes.value.filter(attr => attr.att_type === attType);
};
</script>

<template>
  <div class="modern-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <v-progress-circular indeterminate color="#2931a5" size="64"></v-progress-circular>
      <p class="loading-text">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <template v-else>
      <!-- Modern Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="icon-container">
            <v-icon size="28" color="white">mdi-file-document-multiple</v-icon>
          </div>
          <div>
            <h1 class="header-title">ຈັດການຂໍ້ມູນການຄິດໄລ່ຄະແນນສິນເຊື່ອ (ບຸກຄົນ)</h1>
            <p class="header-subtitle">ຈັດການຄະແນນປະເພດຫຼັກ ແລະ ລາຍການຍ່ອຍ</p>
          </div>
        </div>
        
        <!-- ⭐ เพิ่มส่วนแสดงคะแนนรวม -->
        <div class="header-right">
          <div class="score-display-container">
            <v-chip class="score-chip main-type-score" size="large">
              <div class="score-content">
                <span class="score-label">ນ້ຳໜັກປະເພດຫຼັກ:</span>
                <span class="score-value">{{ getTotalAttWeight().toFixed(0) }}%/100%</span>
              </div>
            </v-chip>
            
            <v-chip class="score-chip attribute-score" size="large">
              <div class="score-content">
                <span class="score-label">ຄະແນນປະເພດຍ່ອຍ:</span>
                <span class="score-value">{{ getTotalAttValueGroup5ByType().toFixed(0) }}/1000</span>
              </div>
            </v-chip>
          </div>

          <v-tooltip text="ເພີ່ມປະເພດຫຼັກໃໝ່" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="add-main-btn"
                prepend-icon="mdi-plus-circle"
                size="large"
                @click="openTypeModal()"
              >
                ເພີ່ມປະເພດຫຼັກ
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-wrapper">
        <!-- Empty State -->
        <div v-if="attTypes.length === 0" class="empty-state">
          <v-icon size="80" color="#cbd5e0">mdi-database-off</v-icon>
          <h3 class="empty-title">ບໍ່ມີຂໍ້ມູນ</h3>
          <p class="empty-subtitle">ກະລຸນາເພີ່ມປະເພດຫຼັກເພື່ອເລີ່ມຕົ້ນ</p>
          <v-btn class="add-main-btn mt-4" prepend-icon="mdi-plus" @click="openTypeModal()">
            ເພີ່ມປະເພດຫຼັກ
          </v-btn>
        </div>

        <!-- Main Data Cards -->
        <div v-else class="main-cards-grid">
          <div v-for="type in attTypes" :key="type.id_desc" class="main-card">
            <!-- Card Header -->
            <div class="card-header">
              <div class="header-content" @click="toggleExpand(type.att_type)">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  class="expand-btn"
                >
                  <v-icon size="20">
                    {{ expandedTypes[type.att_type] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                </v-btn>

                <div class="main-info">
                  <h3 class="main-title">{{ type.att_type_lao_desc }}</h3>
                  <div class="main-details">
                    <span class="detail-divider">•</span>
                    <span class="detail-chip type-chip">
                      <span >ປະເພດ:</span>
                      <strong class="mr-1 ml-1">{{ type.att_type }}</strong>
                    </span>
                    <span class="detail-divider">•</span>
                    <span class="detail-chip weight-chip">
                      <span >ນ້ຳໜັກ:</span>
                      <v-icon size="14" class="mr-1 ml-1">mdi-weight</v-icon>
                      <strong class="weight-value">{{ type.att_weight }} %</strong>
                    </span>
                    <span class="detail-chip desc-chip">
                    <span >ລາຍລະອຽດ:</span>
                       <strong class="mr-1 ml-1">{{ type.att_type_desc }}</strong>
                    </span>
                  </div>
                </div>

                <v-chip class="count-chip" size="small">
                  <strong>{{ getAttributesByType(type.att_type).length }} ລາຍການຍ່ອຍ</strong>
                </v-chip>
              </div>

              <div class="header-actions">
                <v-tooltip text="ເພີ່ມລາຍການຍ່ອຍ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-plus"
                      size="small"
                      class="action-btn add-btn"
                      variant="text"
                      @click.stop="openAttrModal(null, type.att_type)"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="ແກ້ໄຂປະເພດຫຼັກ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil"
                      size="small"
                      class="action-btn edit-btn"
                      variant="text"
                      @click.stop="openTypeModal(type)"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="ລຶບປະເພດຫຼັກ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-delete"
                      size="small"
                      class="action-btn delete-btn"
                      variant="text"
                      @click.stop="handleDeleteType(type.id_desc)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>

            <!-- Expanded Content - Small Data -->
            <v-expand-transition>
              <div v-if="expandedTypes[type.att_type]" class="card-body">
                <div v-if="getAttributesByType(type.att_type).length > 0" class="small-data-list">
                  <div
                    v-for="(attr, index) in getAttributesByType(type.att_type)"
                    :key="attr.att_id"
                    class="small-data-item"
                  >
                    <div class="item-left">
                      <div class="item-number">{{ index + 1 }}</div>
                      <div class="item-content">
                        <div class="item-title"><v-icon class="meta-label">mdi-text </v-icon> {{ attr.att_name }}</div>
                        <div class="item-meta">
                          <span class="meta-label">ລະຫັດ:</span>
                          <span class="meta-value code-value">{{ attr.att_code }}</span>
                          <span class="meta-separator">|</span>
                          <span class="meta-label">ຄ່າ:</span>
                          <span class="meta-value value-badge">{{ attr.att_value }}</span>
                          <span class="meta-separator">|</span>
                          <span class="meta-label">ກຸ່ມ:</span>
                          <span class="meta-value group-badge">{{ attr.att_group_id || '-' }}</span>
                          <span class="meta-separator">|</span>
                          <span class="meta-label">ຄຳອະທິບາຍ:</span>
                          <span class="meta-value desc-value">{{ attr.att_desc || '-' }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="item-actions">
                      <v-tooltip text="ແກ້ໄຂ" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-pencil-outline"
                            size="x-small"
                            class="item-action-btn edit-btn"
                            variant="text"
                            @click="openAttrModal(attr)"
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="ລຶບ" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-delete-outline"
                            size="x-small"
                            class="item-action-btn delete-btn"
                            variant="text"
                            @click="handleDeleteAttr(attr.att_id)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-small-data">
                  <v-icon size="40" color="#cbd5e0">mdi-inbox</v-icon>
                  <p class="empty-small-text">ບໍ່ມີລາຍການຍ່ອຍ</p>
                  <v-btn
                    size="small"
                    class="add-small-btn"
                    prepend-icon="mdi-plus"
                    @click="openAttrModal(null, type.att_type)"
                  >
                    ເພີ່ມລາຍການຍ່ອຍ
                  </v-btn>
                </div>
              </div>
            </v-expand-transition>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal สำหรับ Attribute Type -->
    <v-dialog v-model="showTypeModal" max-width="600px" persistent>
      <v-card class="modern-modal">
        <div class="modal-header primary-header">
          <h2 class="modal-title">
            <v-icon class="mr-2">mdi-format-list-bulleted-type</v-icon>
            {{ editingType ? 'ແກ້ໄຂປະເພດຫຼັກ' : 'ເພີ່ມປະເພດຫຼັກ' }}
          </h2>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeTypeModal"></v-btn>
        </div>

        <div class="modal-body">
          <v-text-field
            v-model="typeForm.att_type"
            label="Type Code"
            placeholder="ເຊັ່ນ: INCOME"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-code-tags"
            class="modern-input"
          ></v-text-field>

          <v-text-field
            v-model="typeForm.att_type_desc"
            label="ຊື່ພາສາອັງກິດ"
            placeholder="Income Type"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-text"
            class="modern-input"
          ></v-text-field>

          <v-text-field
            v-model="typeForm.att_type_lao_desc"
            label="ຊື່ພາສາລາວ"
            placeholder="ປະເພດລາຍໄດ້"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-text"
            class="modern-input"
          ></v-text-field>

          <v-text-field
            v-model.number="typeForm.att_weight"
            label="ນ້ຳໜັກ (Weight)"
            type="number"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-weight"
            class="modern-input"
          ></v-text-field>
        </div>

        <div class="modal-footer">
          <v-btn variant="text" @click="closeTypeModal">ຍົກເລີກ</v-btn>
          <v-btn class="save-btn" prepend-icon="mdi-content-save" @click="handleSaveType">
            ບັນທຶກ
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Modal สำหรับ Attribute -->
    <v-dialog v-model="showAttrModal" max-width="600px" persistent>
      <v-card class="modern-modal">
        <div class="modal-header success-header">
          <h2 class="modal-title">
            <v-icon class="mr-2">mdi-list-box-outline</v-icon>
            {{ editingAttr ? 'ແກ້ໄຂລາຍການຍ່ອຍ' : 'ເພີ່ມລາຍການຍ່ອຍ' }}
          </h2>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeAttrModal"></v-btn>
        </div>

        <div class="modal-body">
          <v-select
            v-model="attrForm.att_type"
            :items="attTypes"
            item-title="att_type_lao_desc"
            item-value="att_type"
            label="ປະເພດຫຼັກ (Type)"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-format-list-bulleted-type"
            class="modern-input"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="`${item.raw.att_type_lao_desc} (${item.raw.att_type})`"></v-list-item>
            </template>
          </v-select>

          <v-text-field
            v-model="attrForm.att_name"
            label="ຊື່"
            placeholder="ເຊັ່ນ: ລາຍໄດ້ປະຈຳ"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-text"
            class="modern-input"
          ></v-text-field>

          <v-text-field
            v-model="attrForm.att_code"
            label="ລະຫັດ"
            placeholder="ເຊັ່ນ: INCOME_REGULAR"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-code-tags"
            class="modern-input"
          ></v-text-field>

          <v-text-field
            v-model.number="attrForm.att_value"
            label="ຄ່າ (Value)"
            type="number"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-numeric"
            class="modern-input"
          ></v-text-field>

          <v-text-field
            v-model="attrForm.att_group_id"
            label="ລະຫັດກຸ່ມ (Group ID)"
            placeholder="ເຊັ່ນ: G01"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-group"
            class="modern-input"
            hint="ສູງສຸດ 5 ຕົວອັກສອນ (ບໍ່ບັງຄັບ)"
            persistent-hint
          ></v-text-field>

          <v-textarea
            v-model="attrForm.att_desc"
            label="ຄຳອະທິບາຍ (Description)"
            placeholder="ເຊັ່ນ: ລາຍໄດ້ປະຈຳຈາກເງິນເດືອນ"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-text-box-outline"
            class="modern-input"
            rows="3"
            hint="ບໍ່ບັງຄັບ"
            persistent-hint
          ></v-textarea>
        </div>

        <div class="modal-footer">
          <v-btn variant="text" @click="closeAttrModal">ຍົກເລີກ</v-btn>
          <v-btn class="save-btn success-btn" prepend-icon="mdi-content-save" @click="handleSaveAttr">
            ບັນທຶກ
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
* {
  font-family: 'Noto Sans Lao', 'Segoe UI', sans-serif;
}
.detail-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.type-chip {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #5b21b6;
  border: 1px solid #c4b5fd;
}

.weight-chip {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.desc-chip {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.group-badge {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #fcd34d;
}

.modern-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 18px 24px;
  background: #f7fafc;
  min-height: 100vh;
}

/* Loading */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 20px;
}

.loading-text {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
}

/* Modern Header */
.page-header {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  padding: 18px 28px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 40px rgba(41, 49, 165, 0.25);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-container {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.3px;
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 4px 0 0 0;
  font-weight: 400;
}

.add-main-btn {
  background: white !important;
  color: #2931a5 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.add-main-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Content Area */
.content-wrapper {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-title {
  font-size: 18px;
  color: #1a202c;
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.empty-subtitle {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

/* Main Cards Grid */
.main-cards-grid {
  display: grid;
  gap: 10px;
}

.main-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.main-card:hover {
  border-color: #2931a5;
  box-shadow: 0 8px 28px rgba(41, 49, 165, 0.15);
  transform: translateY(-2px);
}

/* Card Header */
.card-header {
  padding: 8px 20px;
  background: linear-gradient(to right, #fafbfc, #ffffff);
  border-bottom: 2px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  cursor: pointer;
}

.expand-btn {
  transition: transform 0.3s ease;
}

.main-info {
  flex: 1;
}

.main-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 6px 0;
}

.main-details {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-divider {
  color: #cbd5e0;
  font-size: 14px;
}

.weight-value {
  color: #2931a5;
  font-weight: 700;
}

.count-chip {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%) !important;
  color: white !important;
  padding: 0 12px;
  font-size: 14px;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 16px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn.add-btn {
  color: #4850bb !important;
}

.action-btn.add-btn:hover {
  background: rgba(72, 187, 120, 0.1) !important;
}

.action-btn.edit-btn {
  color: #2931a5 !important;
}

.action-btn.edit-btn:hover {
  background: rgba(41, 49, 165, 0.1) !important;
}

.action-btn.delete-btn {
  color: #f56565 !important;
}

.action-btn.delete-btn:hover {
  background: rgba(245, 101, 101, 0.1) !important;
}

/* Card Body */
.card-body {
  padding: 10px 24px;
  background: #fafbfc;
}

/* Small Data List */
.small-data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.small-data-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.small-data-item:hover {
  border-color: #2931a5;
  box-shadow: 0 4px 12px rgba(41, 49, 165, 0.1);
  transform: translateX(4px);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.item-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 6px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
}

.code-value {
  color: #2931a5;
  background: rgba(41, 49, 165, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.value-badge {
  color: #2931a5;
  background: rgba(72, 99, 187, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.desc-value {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-separator {
  color: #cbd5e0;
  font-size: 14px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-action-btn {
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;
}

.item-action-btn.edit-btn {
  color: #2931a5 !important;
}

.item-action-btn.edit-btn:hover {
  background: rgba(41, 49, 165, 0.1) !important;
}

.item-action-btn.delete-btn {
  color: #f56565 !important;
}

.item-action-btn.delete-btn:hover {
  background: rgba(245, 101, 101, 0.1) !important;
}

/* Empty Small Data */
.empty-small-data {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}

.empty-small-text {
  font-size: 14px;
  color: #718096;
  margin: 12px 0 16px 0;
}

.add-small-btn {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%) !important;
  color: white !important;
  font-size: 14px;
}

/* Modern Modal */
.modern-modal {
  border-radius: 16px !important;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header.primary-header {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
}

.modal-header.success-header {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modern-input {
  font-size: 14px;
}

.modern-input :deep(.v-field) {
  font-size: 14px;
}

.modern-input :deep(.v-field__input) {
  font-size: 14px;
}

.modern-input :deep(.v-label) {
  font-size: 14px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.save-btn {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%) !important;
  color: white !important;
  font-size: 14px;
}

.save-btn.success-btn {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .modern-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .header-left {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-content {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }

  .main-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .detail-divider {
    display: none;
  }

  .item-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .item-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .meta-separator {
    display: none;
  }

  .small-data-item {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }
    .page-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .score-display-container {
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .score-chip {
    width: 100%;
  }

  .score-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .score-label {
    font-size: 12px;
  }

  .score-value {
    font-size: 14px;
  }
}

/* Tooltips */
:deep(.v-tooltip > .v-overlay__content) {
  background: rgba(0, 0, 0, 0.9) !important;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 6px;
}

/* Focus States */
:deep(.v-field--focused) {
  border-color: #2931a5 !important;
}

:deep(.v-field--focused .v-field__outline) {
  color: #2931a5 !important;
}

/* Animations */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
/* ⭐ เพิ่ม styles ใหม่ */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-display-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-chip {
  padding: 4px 12px !important;
  height: auto !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.score-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.main-type-score {
  border-left: 4px solid #3b82f6 !important;
}

.attribute-score {
  border-left: 4px solid #10b981 !important;
}

.score-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.score-label {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-value {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Courier New', monospace;
}

</style>