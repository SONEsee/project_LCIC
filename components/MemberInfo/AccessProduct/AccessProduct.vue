<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const config = useRuntimeConfig();
const apiMembers = `${config.public.strapi.url}api/members-with-count/`;
const apiProductsByBankType = `${config.public.strapi.url}api/products-by-bank-type/`;
const apiToggleAccess = `${config.public.strapi.url}api/toggle-product-access/`;

// State
const members = ref<any[]>([]);
const products = ref<any[]>([]);
const loading = ref(false);
const loadingProducts = ref(false);
const searchQuery = ref("");
const selectedMember = ref<any>(null);
const processingProducts = ref<Record<string, boolean>>({});
const imageErrors = ref<Record<string, boolean>>({});

onMounted(() => {
  fetchMembers();
});

// เพิ่ม function จัดการ error
const handleImageError = (bnkCode: string) => {
  imageErrors.value[bnkCode] = true;
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    const response = await axios.get(apiMembers);
    members.value = response.data;
    
    // Debug logs
    console.log('✅ Members loaded:', members.value.length);
    if (members.value.length > 0) {
      console.log('✅ First member:', members.value[0]);
      console.log('✅ Has active_products_count?', 'active_products_count' in members.value[0]);
      console.log('✅ Value:', members.value[0].active_products_count);
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ',
      text: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສະມາຊິກ'
    });
  } finally {
    loading.value = false;
  }
};

const fetchProductsByBankType = async (bnkCode: string) => {
  loadingProducts.value = true;
  try {
    const response = await axios.get(apiProductsByBankType, {
      params: { bnk_code: bnkCode }
    });
    
    // Debug logs
    console.log('API Response:', response.data);
    console.log('Products:', response.data.products);
    console.log('Total Products:', response.data.products?.length);
    console.log('Member mImage:', response.data.member?.mImage);
    
    products.value = response.data.products || [];
    
    // Update selected member with mImage from API response
    if (response.data.member && response.data.member.mImage) {
      selectedMember.value = {
        ...selectedMember.value,
        mImage: response.data.member.mImage
      };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ',
      text: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຜະລິດຕະພັນ'
    });
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
};

// Filter members by search
// Filter members by search
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  
  return members.value.filter(member => 
    member.nameL?.toLowerCase().includes(query) ||  // ชื่อลาว - contains
    member.nameE?.toLowerCase().includes(query) ||  // ชื่ออังกฤษ - contains
    member.bnk_code?.toLowerCase() === query        // รหัสธนาคาร - exact match ✅
  );
});

// ✅ Get member's active products count (FIXED)
const getActiveProductCount = (bnkCode: string) => {
  // ວິທີທີ່ 1: ໃຊ້ຂໍ້ມູນຈາກ API (active_products_count ທີ່ Backend ນັບໃຫ້ແລ້ວ)
  const member = members.value.find(m => m.bnk_code === bnkCode);
  if (member && typeof member.active_products_count === 'number') {
    return member.active_products_count;  // ← ສະແດງທັນທີ!
  }
  
  // ວິທີທີ່ 2: ຖ້າເປັນ member ທີ່ຖືກເລືອກ ໃຫ້ນັບຈາກ products array
  if (selectedMember.value && selectedMember.value.bnk_code === bnkCode) {
    return products.value.filter(p => p.has_access && p.is_active).length;
  }
  
  // Default: return 0
  return 0;
};

// เคลียร์ error เมื่อเลือก member ใหม่
const selectMember = async (member: any) => {
  selectedMember.value = member;
  imageErrors.value[member.bnk_code] = false; // reset error state
  await fetchProductsByBankType(member.bnk_code);
};

// Clear/Exit member selection
const clearSelection = () => {
  selectedMember.value = null;
  products.value = [];
  processingProducts.value = {};
};

// ✅ Get member image URL (FIXED - no double slashes)
const getMemberImageUrl = (member: any) => {
  if (!member || !member.mImage) return null;
  
  // ຖ້າເປັນ full URL ແລ້ວ ໃຊ້ຕົງໆ
  if (member.mImage.startsWith('http://') || member.mImage.startsWith('https://')) {
    return member.mImage;
  }
  
  // ລຶບ / ທ້າຍສຸດອອກຈາກ base URL
  const baseUrl = config.public.strapi.url.replace(/\/$/, '');
  
  // ຖ້າ mImage ເລີ່ມດ້ວຍ / ແລ້ວ ໃຫ້ເຊື່ອມຕົງໆ
  if (member.mImage.startsWith('/')) {
    return `${baseUrl}${member.mImage}`;
  }
  
  // ຖ້າບໍ່ເລີ່ມດ້ວຍ / ໃຫ້ເພີ່ມ / ເຂົ້າໄປ
  return `${baseUrl}/${member.mImage}`;
};

// Toggle product access with optimistic UI
const toggleProduct = async (product: any) => {
  if (!selectedMember.value) return;
  
  const chgSysId = product.chg_sys_id.toString();
  const bnkCode = selectedMember.value.bnk_code;
  
  // Set loading state for this specific product
  processingProducts.value[chgSysId] = true;
  
  // Store old state for rollback
  const oldState = {
    has_access: product.has_access,
    is_active: product.is_active,
    access_id: product.access_id
  };
  
  try {
    // Optimistic UI update
    if (!product.has_access || !product.is_active) {
      // Will add or activate
      product.has_access = true;
      product.is_active = true;
    } else {
      // Will delete
      product.has_access = false;
      product.is_active = false;
      product.access_id = null;
    }
    
    // Call API
    const response = await axios.post(apiToggleAccess, {
      bnk_code: bnkCode,
      chg_sys_id: chgSysId
    });
    
    // Update with real data from server
    if (response.data.action === 'deleted') {
      product.has_access = false;
      product.is_active = false;
      product.access_id = null;
    } else {
      product.has_access = true;
      product.is_active = true;
      if (response.data.data) {
        product.access_id = response.data.data.access_id;
      }
    }
    
    // ✅ Update member's active_products_count in members list
    const memberIndex = members.value.findIndex(m => m.bnk_code === bnkCode);
    if (memberIndex !== -1) {
      if (response.data.action === 'deleted') {
        members.value[memberIndex].active_products_count = Math.max(0, (members.value[memberIndex].active_products_count || 0) - 1);
      } else {
        members.value[memberIndex].active_products_count = (members.value[memberIndex].active_products_count || 0) + 1;
      }
    }
    
    // Show success toast
    const messages = {
      'created': 'ເພີ່ມສິດສຳເລັດ ✓',
      'activated': 'ເປີດໃຊ້ງານສຳເລັດ ✓',
      'deleted': 'ລົບສຳເລັດ ✓'
    };
    
    Swal.fire({
      icon: 'success',
      title: messages[response.data.action as keyof typeof messages] || 'ສຳເລັດ',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    
  } catch (error: any) {
    // Rollback on error
    product.has_access = oldState.has_access;
    product.is_active = oldState.is_active;
    product.access_id = oldState.access_id;
    
    console.error('Error toggling access:', error);
    
    const errorMessage = error.response?.data?.error || 'ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນແປງສິດ';
    
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ',
      text: errorMessage,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } finally {
    processingProducts.value[chgSysId] = false;
  }
};

// Get product status info
const getProductStatus = (product: any) => {
  if (!product.has_access) {
    return {
      label: 'ເພີ່ມສິດ',
      color: 'primary',
      icon: 'mdi-plus-circle',
      chipColor: 'grey',
      chipLabel: 'ຍັງບໍ່ມີສິດ',
      iconColor: '#94a3b8'
    };
  } else if (product.is_active) {
    return {
      label: 'ລົບສິດ',
      color: 'error',
      icon: 'mdi-delete',
      chipColor: 'success',
      chipLabel: 'ເປີດໃຊ້ງານ',
      iconColor: '#10b981'
    };
  } else {
    return {
      label: 'ເປີດໃຊ້ງານ',
      color: 'success',
      icon: 'mdi-check-circle',
      chipColor: 'warning',
      chipLabel: 'ປິດໃຊ້ງານ',
      iconColor: '#f59e0b'
    };
  }
};

// Stats
const stats = computed(() => {
  const activeProducts = products.value.filter(p => p.has_access && p.is_active).length;
  const inactiveProducts = products.value.filter(p => p.has_access && !p.is_active).length;
  
  return {
    total: members.value.length,
    totalProducts: products.value.length,
    activeProducts: activeProducts,
    inactiveProducts: inactiveProducts
  };
});
</script>

<template>
  <div>
    <!-- Top Header -->
    <div class="top-header">
      <div class="header-left">
        <div class="app-icon">
          <v-icon size="32" color="white">mdi-shield-account</v-icon>
        </div>
        <div>
          <h1 class="app-title">ການຈັດການສິດການໃຊ້ງານຜະລິດຕະພັນ</h1>
          <p class="app-subtitle">Product Access Management System</p>
        </div>
      </div>
      
      <div class="header-right">
        <v-btn
          prepend-icon="mdi-refresh"
          variant="outlined"
          color="white"
          @click="fetchMembers"
          :loading="loading"
        >
          ໂຫຼດຂໍ້ມູນ
        </v-btn>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="quick-stats">
      <div class="stat-item">
        <v-icon color="#2563eb">mdi-account-group</v-icon>
        <div class="stat-content">
          <span class="stat-number">{{ stats.total }}</span>
          <span class="stat-text">ສະມາຊິກທັງໝົດ</span>
        </div>
      </div>
      <div class="stat-item" v-if="selectedMember">
        <v-icon color="#3b82f6">mdi-package-variant</v-icon>
        <div class="stat-content">
          <span class="stat-number">{{ stats.totalProducts }}</span>
          <span class="stat-text">ຜະລິດຕະພັນທີ່ມີ</span>
        </div>
      </div>
      <div class="stat-item" v-if="selectedMember">
        <v-icon color="#10b981">mdi-package-check</v-icon>
        <div class="stat-content">
          <span class="stat-number">{{ stats.activeProducts }}</span>
          <span class="stat-text">ກຳລັງໃຊ້ງານ</span>
        </div>
      </div>
    </div>

    <!-- Split View Layout -->
    <div class="split-layout">
      <!-- Left Panel - Members List -->
      <div class="left-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <v-icon class="mr-2">mdi-account-multiple</v-icon>
            ລາຍຊື່ສະມາຊິກ
          </h2>
          <v-chip size="small" color="primary">
            {{ filteredMembers.length }}
          </v-chip>
        </div>

        <div class="panel-search">
          <v-text-field
            v-model="searchQuery"
            density="compact"
            variant="outlined"
            placeholder="ຄົ້ນຫາສະມາຊິກ..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            clearable
          ></v-text-field>
        </div>

        <div class="members-list">
          <!-- Loading members -->
          <div v-if="loading" class="members-loading">
            <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
            <p class="mt-3">ກຳລັງໂຫຼດສະມາຊິກ...</p>
          </div>

          <template v-else>
            <div
              v-for="member in filteredMembers"
              :key="member.bnk_code"
              class="member-item"
              :class="{ 'member-selected': selectedMember?.bnk_code === member.bnk_code }"
              @click="selectMember(member)"
            >
                <div class="member-item-avatar">
                    <img 
                    v-if="getMemberImageUrl(member) && !imageErrors[member.bnk_code]" 
                    :src="getMemberImageUrl(member)" 
                    :alt="member.nameL || member.nameE"
                    class="member-avatar-image"
                    @error="handleImageError(member.bnk_code)"
                    />
                    <v-icon v-else size="32" color="#2563eb">mdi-account-circle</v-icon>
                </div>
              
              <div class="member-item-info">
                <div class="member-item-name">{{ member.nameL || member.nameE }}</div>
                <div class="member-item-code">{{ member.bnk_code }}</div>
                <div class="member-item-type" v-if="member.bnk_type">
                  <v-chip size="x-small" :color="member.bnk_type === 1 ? 'blue' : 'purple'" variant="tonal">
                    {{ member.bnk_type === 1 ? 'ທະນາຄານ' : 'ສະຖາບັນການເງິນ' }}
                  </v-chip>
                </div>
              </div>

              <div class="member-item-badge">
                <v-chip
                  :color="getActiveProductCount(member.bnk_code) > 0 ? 'success' : 'grey'"
                  size="small"
                  variant="flat"
                >
                  <strong>{{ getActiveProductCount(member.bnk_code) }}</strong>
                </v-chip>
              </div>

              <v-icon
                v-if="selectedMember?.bnk_code === member.bnk_code"
                color="primary"
                size="20"
              >
                mdi-chevron-right
              </v-icon>
            </div>

            <div v-if="filteredMembers.length === 0" class="empty-members">
              <v-icon size="48" color="#cbd5e0">mdi-account-search</v-icon>
              <p>ບໍ່ພົບສະມາຊິກ</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Right Panel - Product Management -->
      <div class="right-panel">
        <div v-if="!selectedMember" class="empty-selection">
          <div class="empty-selection-icon">
            <v-icon size="80" color="#cbd5e0">mdi-cursor-default-click</v-icon>
          </div>
          <h3 class="empty-selection-title">ເລືອກສະມາຊິກເພື່ອຈັດການສິດ</h3>
          <p class="empty-selection-text">ກົດເລືອກສະມາຊິກທາງຊ້າຍເພື່ອເລີ່ມຕົ້ນ</p>
        </div>

        <template v-else>
          <div class="panel-header">
            <div class="selected-member-header">
             <div class="selected-avatar">
                    <img 
                    v-if="getMemberImageUrl(selectedMember) && !imageErrors[selectedMember.bnk_code]" 
                    :src="getMemberImageUrl(selectedMember)" 
                    :alt="selectedMember.nameL || selectedMember.nameE"
                    class="selected-avatar-image"
                    @error="handleImageError(selectedMember.bnk_code)"
                    />
                    <v-icon v-else size="48" color="#2563eb">mdi-account-circle</v-icon>
                </div>
              <div class="selected-info">
                <h2 class="selected-name">{{ selectedMember.nameL || selectedMember.nameE }}</h2>
                <p class="selected-code">
                  ລະຫັດທະນາຄານ: {{ selectedMember.bnk_code }}
                  <v-chip size="x-small" class="ml-2" :color="selectedMember.bnk_type === 1 ? 'blue' : 'purple'" v-if="selectedMember.bnk_type">
                    {{ selectedMember.bnk_type === 1 ? 'ທະນາຄານ' : 'ສະຖາບັນການເງິນ' }}
                  </v-chip>
                </p>
              </div>
            </div>

            <div class="header-actions">
              <v-chip color="primary" variant="flat" size="large" class="mr-2">
                <v-icon size="20" class="mr-2">mdi-package-check</v-icon>
                <strong>{{ stats.activeProducts }}</strong>
                <span class="ml-1">/ {{ stats.totalProducts }}</span>
              </v-chip>

              <v-btn
                icon
                variant="text"
                color="error"
                @click="clearSelection"
                size="small"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="bottom">ປິດ</v-tooltip>
              </v-btn>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="panel-body">
            <!-- Loading overlay for products -->
            <div v-if="loadingProducts" class="products-loading">
              <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
              <p class="mt-4">ກຳລັງໂຫຼດຜະລິດຕະພັນ...</p>
            </div>

            <template v-else>
              <div class="products-section-header">
                <h3 class="section-title">
                  <v-icon class="mr-2">mdi-package-variant</v-icon>
                  ຈັດການສິດເຂົ້າເຖິງຜະລິດຕະພັນ
                </h3>
                <p class="section-subtitle">
                  ກົດປຸ່ມເພື່ອເພີ່ມ/ລົບສິດການໃຊ້ງານ
                  <v-chip size="x-small" color="info" variant="tonal" class="ml-2">
                    ຟິລເຕີຕາມປະເພດສະມາຊິກແລ້ວ
                  </v-chip>
                </p>
              </div>

              <div v-if="products.length === 0" class="empty-products">
                <v-icon size="64" color="#cbd5e0">mdi-package-variant-closed</v-icon>
                <p class="mt-4">ບໍ່ມີຜະລິດຕະພັນທີ່ເໝາະສົມສຳລັບສະມາຊິກນີ້</p>
              </div>

              <div v-else class="products-grid">
                <div
                  v-for="product in products"
                  :key="product.chg_sys_id"
                  class="product-card"
                  :class="{
                    'product-active': product.has_access && product.is_active,
                    'product-inactive': product.has_access && !product.is_active,
                    'product-loading': processingProducts[product.chg_sys_id.toString()]
                  }"
                >
                  <!-- Loading overlay for individual product -->
                  <div v-if="processingProducts[product.chg_sys_id.toString()]" class="product-loading-overlay">
                    <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                  </div>

                  <div class="product-card-header">
                    <div class="product-icon-wrapper">
                      <v-icon 
                        size="32" 
                        :color="getProductStatus(product).iconColor"
                      >
                        {{ 
                          product.has_access && product.is_active ? 'mdi-check-circle' : 
                          product.has_access ? 'mdi-clock-alert' : 
                          'mdi-circle-outline' 
                        }}
                      </v-icon>
                    </div>
                    
                    <v-chip
                      :color="getProductStatus(product).chipColor"
                      size="small"
                      variant="flat"
                    >
                      {{ getProductStatus(product).chipLabel }}
                    </v-chip>
                  </div>

                  <div class="product-card-body">
                    <h4 class="product-name">
                      {{ product.chg_lao_desc || product.chg_desc }}
                    </h4>
                    <div class="product-meta">
                      <v-chip size="x-small" color="blue-grey" variant="tonal">
                        {{ product.chg_code }}
                      </v-chip>
                      <span class="meta-divider">•</span>
                      <span class="product-type">{{ product.chg_type }}</span>
                    </div>
                  </div>

                  <v-divider class="my-3"></v-divider>

                  <div class="product-card-actions">
                    <v-btn
                      :color="getProductStatus(product).color"
                      :prepend-icon="getProductStatus(product).icon"
                      block
                      variant="flat"
                      @click="toggleProduct(product)"
                      :loading="processingProducts[product.chg_sys_id.toString()]"
                      :disabled="processingProducts[product.chg_sys_id.toString()]"
                    >
                      {{ getProductStatus(product).label }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: 'Noto Sans Lao', 'Segoe UI', sans-serif;
}

/* Loading */
.members-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
  text-align: center;
}

.members-loading p {
  font-size: 14px;
  color: #64748b;
  margin-top: 12px;
}

.products-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #64748b;
}

.product-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
  backdrop-filter: blur(2px);
}

/* Top Header */
.top-header {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  border-radius: 20px;
  padding: 18px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 40px rgba(37, 99, 235, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-right {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.app-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.app-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 10px;
}

.stat-item {
  background: white;
  padding: 10px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-text {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

/* Split Layout */
.split-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  height: calc(100vh - 300px);
}

/* Left Panel */
.left-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 15px 24px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #fafbfc, #ffffff);
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.panel-search {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.members-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  margin-bottom: 4px;
}

.member-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.member-item.member-selected {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.member-item-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.member-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.member-item-info {
  flex: 1;
  min-width: 0;
}

.member-item-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-item-code {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.member-item-type {
  margin-top: 4px;
}

.member-item-badge {
  flex-shrink: 0;
}

.empty-members {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-members p {
  font-size: 14px;
  color: #94a3b8;
  margin: 12px 0 0 0;
}

/* Right Panel */
.right-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 60px;
  text-align: center;
}

.empty-selection-icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-selection-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-selection-text {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.selected-member-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selected-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.selected-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.selected-info {
  flex: 1;
}

.selected-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.selected-code {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  position: relative;
}

.products-section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.section-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
}

.empty-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #94a3b8;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.product-card {
  background: #fafbfc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  border-color: #2563eb;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card.product-active {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #10b981;
}

.product-card.product-inactive {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.product-card.product-loading {
  pointer-events: none;
  opacity: 0.7;
}

.product-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-icon-wrapper {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-card-body {
  margin-bottom: 12px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.meta-divider {
  color: #cbd5e0;
}

.product-type {
  color: #64748b;
  font-weight: 500;
}

.product-card-actions {
  margin-top: 12px;
}

/* Scrollbar */
.members-list::-webkit-scrollbar,
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.members-list::-webkit-scrollbar-track,
.panel-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.members-list::-webkit-scrollbar-thumb,
.panel-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.members-list::-webkit-scrollbar-thumb:hover,
.panel-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 1200px) {
  .split-layout {
    grid-template-columns: 350px 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .split-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .left-panel {
    max-height: 400px;
  }

  .right-panel {
    min-height: 600px;
  }
}

@media (max-width: 768px) {
  .top-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .split-layout {
    gap: 12px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-body {
  animation: fadeIn 0.3s ease;
}
</style>