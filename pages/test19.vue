<template>
  <div class="sidebar-manager">
    <!-- Header -->
    <div class="header">
      <h2>ຈັດການສິດເຂົ້ານໍາໃຊ້</h2>
      <div class="header-actions">
        <button @click="openCreateModal('sidebar_item')" class="btn-primary">
          <v-icon icon="mdi-plus" size="18"></v-icon>
          <span>ເພີ່ມເມນູຫຼັກ</span>
        </button>
        <button @click="openCreateModal('sidebar_sub_item')" class="btn-primary btn-success">
          <v-icon icon="mdi-plus" size="18"></v-icon>
          <span>ເພີ່ມເມນູຍ່ອຍ</span>
        </button>
      </div>
    </div>

    <!-- Role Filter -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <v-icon icon="mdi-filter" size="20" color="#6366f1"></v-icon>
          <span>ກັ່ນຕອງຕາມບົດບາດ</span>
        </div>
        <select v-model="selectedRole" class="role-select">
          <option value="">ທັງໝົດ</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Hierarchical Menu View -->
    <div class="content">
      <div class="menu-tree">
        <div 
          v-for="(item, index) in filteredMainItems" 
          :key="item.id"
          class="menu-item-wrapper"
        >
          <!-- Main Menu Item -->
          <div class="menu-item main-item">
            <div class="item-left">
              <div class="drag-handle">
                <v-icon icon="mdi-drag-vertical" size="18" color="#94a3b8"></v-icon>
              </div>
              <div class="item-icon" :style="{ background: getIconColor(index) }">
                <v-icon :icon="item.icon || 'mdi-menu'" size="22" color="#ffffff"></v-icon>
              </div>
              <div class="item-info">
                <span class="item-title">{{ item.title || item.name }}</span>
                <span class="item-route">{{ item.route || item.url }}</span>
              </div>
            </div>
            
            <div class="item-right">
              <span class="item-badge">{{ item.order }}</span>
              <div :class="['status-badge', item.is_active ? 'active' : 'inactive']">
                <div class="status-dot"></div>
                {{ item.is_active ? 'ເປີດ' : 'ປິດ' }}
              </div>
              <div class="item-roles">
                <v-icon icon="mdi-account-group" size="16" color="#64748b"></v-icon>
                <span>{{ getRoleNames(item.roles) }}</span>
              </div>
              <div class="item-actions">
                <button 
                  @click="moveItem(index, 'up', 'sidebar_item')" 
                  :disabled="index === 0"
                  class="action-btn"
                  title="ຍ້າຍຂື້ນ"
                >
                  <v-icon icon="mdi-chevron-up" size="18"></v-icon>
                </button>
                <button 
                  @click="moveItem(index, 'down', 'sidebar_item')" 
                  :disabled="index === filteredMainItems.length - 1"
                  class="action-btn"
                  title="ຍ້າຍລົງ"
                >
                  <v-icon icon="mdi-chevron-down" size="18"></v-icon>
                </button>
                <button @click="editItem(item, 'sidebar_item')" class="action-btn edit" title="ແກ້ໄຂ">
                  <v-icon icon="mdi-pencil-outline" size="18"></v-icon>
                </button>
                <button @click="deleteItem(item.id, 'sidebar_item')" class="action-btn delete" title="ລຶບ">
                  <v-icon icon="mdi-delete-outline" size="18"></v-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Sub Menu Items -->
          <div v-if="getFilteredSubItems(item.id).length > 0" class="sub-items-container">
            <div 
              v-for="(subItem, subIndex) in getFilteredSubItems(item.id)" 
              :key="subItem.id"
              class="menu-item sub-item"
            >
              <div class="item-left">
                <div class="sub-connector"></div>
                <div class="item-icon sub-icon" :style="{ background: getIconColor(index, true) }">
                  <v-icon :icon="subItem.icon || 'mdi-circle-small'" size="18" color="#ffffff"></v-icon>
                </div>
                <div class="item-info">
                  <span class="item-title">{{ subItem.title || subItem.name }}</span>
                  <span class="item-route">{{ subItem.route || subItem.url }}</span>
                </div>
              </div>
              
              <div class="item-right">
                <span class="item-badge sub-badge">{{ subItem.order }}</span>
                <div :class="['status-badge', subItem.is_active ? 'active' : 'inactive']">
                  <div class="status-dot"></div>
                  {{ subItem.is_active ? 'ເປີດ' : 'ປິດ' }}
                </div>
                <div class="item-roles">
                  <v-icon icon="mdi-account-group" size="14" color="#64748b"></v-icon>
                  <span>{{ getRoleNames(subItem.roles) }}</span>
                </div>
                <div class="item-actions">
                  <button 
                    @click="moveSubItem(item.id, subIndex, 'up')" 
                    :disabled="subIndex === 0"
                    class="action-btn"
                    title="ຍ້າຍຂື້ນ"
                  >
                    <v-icon icon="mdi-chevron-up" size="16"></v-icon>
                  </button>
                  <button 
                    @click="moveSubItem(item.id, subIndex, 'down')" 
                    :disabled="subIndex === getFilteredSubItems(item.id).length - 1"
                    class="action-btn"
                    title="ຍ້າຍລົງ"
                  >
                    <v-icon icon="mdi-chevron-down" size="16"></v-icon>
                  </button>
                  <button @click="editItem(subItem, 'sidebar_sub_item')" class="action-btn edit" title="ແກ້ໄຂ">
                    <v-icon icon="mdi-pencil-outline" size="16"></v-icon>
                  </button>
                  <button @click="deleteItem(subItem.id, 'sidebar_sub_item')" class="action-btn delete" title="ລຶບ">
                    <v-icon icon="mdi-delete-outline" size="16"></v-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredMainItems.length === 0" class="empty-state">
          <v-icon icon="mdi-file-tree-outline" size="64" color="#cbd5e1"></v-icon>
          <p>ບໍ່ມີຂໍ້ມູນສະແດງ</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal enhanced-modal">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <v-icon :icon="editingItem ? 'mdi-pencil' : 'mdi-plus-circle'" size="24" color="#6366f1"></v-icon>
            </div>
            <div>
              <h3>{{ editingItem ? 'ແກ້ໄຂ' : 'ສ້າງ' }} {{ modalType === 'sidebar_item' ? 'ເມນູຫຼັກ' : 'ເມນູຍ່ອຍ' }}</h3>
              <p class="modal-subtitle">{{ editingItem ? 'ອັບເດດຂໍ້ມູນເມນູ' : 'ເພີ່ມເມນູໃໝ່ເຂົ້າລະບົບ' }}</p>
            </div>
          </div>
          <button @click="closeModal" class="btn-close">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>ປະເພດ <span class="required">*</span></label>
              <select v-model="modalType" class="form-control" :disabled="editingItem">
                <option value="sidebar_item">ເມນູຫຼັກ</option>
                <option value="sidebar_sub_item">ເມນູຍ່ອຍ</option>
              </select>
            </div>

            <div v-if="modalType === 'sidebar_sub_item'" class="form-group">
              <label>ແມ່ເມນູ <span class="required">*</span></label>
              <select v-model="formData.parent" class="form-control" required>
                <option value="">-- ເລືອກແມ່ເມນູ --</option>
                <option v-for="item in sidebarItems" :key="item.id" :value="item.id">
                  {{ item.title || item.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>ຊື່ເມນູ <span class="required">*</span></label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="form-control" 
              placeholder="ປ້ອນຊື່ເມນູ"
              required 
              @input="validateName"
            />
            <span v-if="formErrors.name" class="error-message">{{ formErrors.name }}</span>
          </div>

          <div class="form-group">
            <label>ໄອຄອນ (MDI Icon) <span class="required">*</span></label>
            <div class="icon-input-group">
              <div class="icon-preview" :class="{ 'icon-preview-error': formErrors.icon }">
                <v-icon 
                  :icon="formData.icon || 'mdi-help-circle'" 
                  size="28" 
                  :color="formData.icon ? '#6366f1' : '#cbd5e1'"
                ></v-icon>
              </div>
              <input 
                v-model="formData.icon" 
                type="text" 
                class="form-control icon-input" 
                placeholder="mdi-home"
                required
                @input="validateIcon"
              />
              <a 
                href="https://pictogrammers.com/library/mdi/" 
                target="_blank" 
                class="icon-search-btn"
                title="ຄົ້ນຫາໄອຄອນ"
              >
                <v-icon icon="mdi-magnify" size="18"></v-icon>
                <span>ຄົ້ນຫາ</span>
              </a>
            </div>
            <span v-if="formErrors.icon" class="error-message">{{ formErrors.icon }}</span>
            <span class="helper-text">
              <v-icon icon="mdi-information-outline" size="14"></v-icon>
              ຄລິກປຸ່ມຄົ້ນຫາເພື່ອເບິ່ງໄອຄອນທັງໝົດ
            </span>
          </div>

          <div class="form-group">
            <label>ເສັ້ນທາງ/URL <span class="required">*</span></label>
            <input 
              v-model="formData.url" 
              type="text" 
              class="form-control" 
              placeholder="/dashboard"
              required
              @input="validateUrl"
            />
            <span v-if="formErrors.url" class="error-message">{{ formErrors.url }}</span>
            <span class="helper-text">
              <v-icon icon="mdi-information-outline" size="14"></v-icon>
              ເສັ້ນທາງຕ້ອງເລີ່ມດ້ວຍ /
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>ລຳດັບ <span class="required">*</span></label>
              <input 
                v-model.number="formData.order" 
                type="number" 
                class="form-control" 
                min="0"
                placeholder="0"
                required 
              />
            </div>

            <div class="form-group">
              <label>ສະຖານະ</label>
              <label class="switch-label">
                <input v-model="formData.is_active" type="checkbox" class="switch-input" />
                <span class="switch-slider"></span>
                <span class="switch-text">{{ formData.is_active ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ' }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>ມອບສິດໃຫ້ບົດບາດ</label>
            <div class="role-checkboxes">
              <label v-for="role in roles" :key="role.id" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="role.id" 
                  v-model="formData.selectedRoles"
                />
                <span>{{ role.name }}</span>
              </label>
            </div>
            <span class="helper-text">
              <v-icon icon="mdi-information-outline" size="14"></v-icon>
              ເລືອກບົດບາດທີ່ສາມາດເຂົ້າເຖິງເມນູນີ້ໄດ້
            </span>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">
            <v-icon icon="mdi-close" size="18"></v-icon>
            <span>ຍົກເລີກ</span>
          </button>
          <button @click="saveItem" class="btn-primary" :disabled="!isFormValid || saving">
            <v-icon v-if="!saving" :icon="editingItem ? 'mdi-content-save' : 'mdi-plus'" size="18"></v-icon>
            <div v-else class="btn-spinner"></div>
            <span>{{ saving ? 'ກຳລັງບັນທຶກ...' : (editingItem ? 'ອັບເດດ' : 'ສ້າງ') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      <v-icon :icon="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" size="20"></v-icon>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { refreshSidebar } from '~/components/backendComponents/sidebar/sidebarItems'

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface SubItem {
  id: number;
  name?: string;
  title?: string;
  url?: string;
  route?: string;
  parent: number;
  icon?: string;
  order: number;
  roles: Role[] | number[];
  is_active: boolean;
}

interface SidebarItem {
  id: number;
  name?: string;
  title?: string;
  url?: string;
  route?: string;
  icon: string;
  order: number;
  roles: Role[] | number[];
  sub_items?: SubItem[];
  is_active: boolean;
}

const config = useRuntimeConfig();
const sidebarItems = ref<SidebarItem[]>([]);
const sidebarSubItems = ref<SubItem[]>([]);
const roles = ref<Role[]>([]);
const selectedRole = ref('');
const showCreateModal = ref(false);
const modalType = ref<'sidebar_item' | 'sidebar_sub_item'>('sidebar_item');
const editingItem = ref<any>(null);
const formData = ref({
  name: '',
  icon: '',
  url: '',
  order: 0,
  parent: '',
  is_active: true,
  selectedRoles: [] as number[]
});
const formErrors = ref({
  name: '',
  icon: '',
  url: ''
});
const loading = ref(false);
const saving = ref(false);
const toast = ref({
  show: false,
  message: '',
  type: 'success'
});

// Color palette for icons
const iconColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#10b981', '#3b82f6', '#06b6d4', '#f43f5e',
];

const getIconColor = (index: number, isSub: boolean = false) => {
  const color = iconColors[index % iconColors.length];
  return isSub ? `${color}dd` : color;
};

const filteredMainItems = computed(() => {
  if (!selectedRole.value) return sidebarItems.value;
  const roleId = parseInt(selectedRole.value as string);
  return sidebarItems.value.filter(item => hasRole(item.roles, roleId));
});

const getFilteredSubItems = (parentId: number) => {
  const subItems = sidebarSubItems.value.filter(item => item.parent === parentId);
  if (!selectedRole.value) return subItems;
  const roleId = parseInt(selectedRole.value as string);
  return subItems.filter(item => hasRole(item.roles, roleId));
};

const getRoleNames = (roles: Role[] | number[]): string => {
  if (!roles || roles.length === 0) return '-';
  if (typeof roles[0] === 'object') {
    return roles.slice(0, 2).map((r: any) => r.name).join(', ') + 
           (roles.length > 2 ? ` +${roles.length - 2}` : '');
  }
  return '-';
};

const hasRole = (itemRoles: Role[] | number[], roleId: number): boolean => {
  if (!itemRoles || itemRoles.length === 0) return false;
  if (typeof itemRoles[0] === 'object') {
    return itemRoles.some((r: any) => r.id === roleId);
  }
  return itemRoles.includes(roleId);
};

// Form validation
const validateName = () => {
  if (!formData.value.name.trim()) {
    formErrors.value.name = 'ກະລຸນາປ້ອນຊື່ເມນູ';
  } else if (formData.value.name.length < 2) {
    formErrors.value.name = 'ຊື່ເມນູຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ';
  } else {
    formErrors.value.name = '';
  }
};

const validateIcon = () => {
  if (!formData.value.icon.trim()) {
    formErrors.value.icon = 'ກະລຸນາປ້ອນໄອຄອນ';
  } else if (!formData.value.icon.startsWith('mdi-')) {
    formErrors.value.icon = 'ໄອຄອນຕ້ອງເລີ່ມດ້ວຍ mdi-';
  } else {
    formErrors.value.icon = '';
  }
};

const validateUrl = () => {
  if (!formData.value.url.trim()) {
    formErrors.value.url = 'ກະລຸນາປ້ອນເສັ້ນທາງ';
  } else if (!formData.value.url.startsWith('/')) {
    formErrors.value.url = 'ເສັ້ນທາງຕ້ອງເລີ່ມດ້ວຍ /';
  } else {
    formErrors.value.url = '';
  }
};

const isFormValid = computed(() => {
  return formData.value.name.trim() && 
         formData.value.icon.trim() && 
         formData.value.icon.startsWith('mdi-') &&
         formData.value.url.trim() && 
         formData.value.url.startsWith('/') &&
         !formErrors.value.name &&
         !formErrors.value.icon &&
         !formErrors.value.url;
});

onMounted(() => {
  loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const [itemsRes, subItemsRes, rolesRes] = await Promise.all([
      fetch(`${config.public.strapi.url}api/sidebar-items/`),
      fetch(`${config.public.strapi.url}api/sidebar-sub-items/`),
      fetch(`${config.public.strapi.url}api/roles/`)
    ]);
    
    sidebarItems.value = await itemsRes.json();
    sidebarSubItems.value = await subItemsRes.json();
    roles.value = await rolesRes.json();
    
    if (roles.value.length > 0 && !selectedRole.value) {
      selectedRole.value = roles.value[0].id.toString();
    }
  } catch (error) {
    showToast('ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ', 'error');
  } finally {
    loading.value = false;
  }
};

const moveItem = async (index: number, direction: 'up' | 'down', itemType: 'sidebar_item' | 'sidebar_sub_item') => {
  const items = itemType === 'sidebar_item' ? sidebarItems.value : sidebarSubItems.value;
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  
  if (newIndex < 0 || newIndex >= items.length) return;

  const temp = items[index];
  items[index] = items[newIndex];
  items[newIndex] = temp;

  const itemsOrder = items.map((item, idx) => ({
    id: item.id,
    order: idx
  }));

  try {
    const response = await fetch(`${config.public.strapi.url}api/reorder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_type: itemType,
        items_order: itemsOrder
      })
    });

    if (!response.ok) throw new Error('Failed to reorder');
    
    showToast('ອັບເດດລຳດັບສຳເລັດ', 'success');
    await loadData();
    await triggerSidebarRefresh();
  } catch (error) {
    showToast('ອັບເດດລຳດັບບໍ່ສຳເລັດ', 'error');
    const tempRevert = items[index];
    items[index] = items[newIndex];
    items[newIndex] = tempRevert;
  }
};

const moveSubItem = async (parentId: number, subIndex: number, direction: 'up' | 'down') => {
  const subItems = getFilteredSubItems(parentId);
  const newIndex = direction === 'up' ? subIndex - 1 : subIndex + 1;
  
  if (newIndex < 0 || newIndex >= subItems.length) return;

  const allSubItems = sidebarSubItems.value.filter(item => item.parent === parentId);
  const currentItem = subItems[subIndex];
  const targetItem = subItems[newIndex];
  
  const currentGlobalIndex = allSubItems.findIndex(item => item.id === currentItem.id);
  const targetGlobalIndex = allSubItems.findIndex(item => item.id === targetItem.id);
  
  const temp = allSubItems[currentGlobalIndex];
  allSubItems[currentGlobalIndex] = allSubItems[targetGlobalIndex];
  allSubItems[targetGlobalIndex] = temp;

  const itemsOrder = allSubItems.map((item, idx) => ({
    id: item.id,
    order: idx
  }));

  try {
    const response = await fetch(`${config.public.strapi.url}api/reorder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_type: 'sidebar_sub_item',
        items_order: itemsOrder
      })
    });

    if (!response.ok) throw new Error('Failed to reorder');
    
    showToast('ອັບເດດລຳດັບສຳເລັດ', 'success');
    await loadData();
    await triggerSidebarRefresh();
  } catch (error) {
    showToast('ອັບເດດລຳດັບບໍ່ສຳເລັດ', 'error');
  }
};

const openCreateModal = (type: 'sidebar_item' | 'sidebar_sub_item') => {
  modalType.value = type;
  formData.value.selectedRoles = [];
  formErrors.value = { name: '', icon: '', url: '' };
  showCreateModal.value = true;
};

const editItem = (item: any, type: 'sidebar_item' | 'sidebar_sub_item') => {
  editingItem.value = item;
  modalType.value = type;
  
  const roleIds = typeof item.roles[0] === 'object' 
    ? item.roles.map((r: any) => r.id)
    : item.roles;
  
  formData.value = {
    name: item.title || item.name,
    icon: item.icon || '',
    url: item.route || item.url || '',
    order: item.order,
    parent: item.parent || '',
    is_active: item.is_active,
    selectedRoles: roleIds
  };
  formErrors.value = { name: '', icon: '', url: '' };
  showCreateModal.value = true;
};

const saveItem = async () => {
  // Validate form
  validateName();
  validateIcon();
  validateUrl();
  
  if (!isFormValid.value) {
    showToast('ກະລຸນາກວດສອບຂໍ້ມູນໃຫ້ຖືກຕ້ອງ', 'error');
    return;
  }

  const data = {
    item_type: modalType.value,
    title: formData.value.name,
    icon: formData.value.icon,
    route: formData.value.url,
    order: formData.value.order,
    parent: formData.value.parent,
    is_active: formData.value.is_active,
    roles: formData.value.selectedRoles
  };

  saving.value = true;
  try {
    let response;
    if (editingItem.value) {
      response = await fetch(`${config.public.strapi.url}api/create_sidebar/${editingItem.value.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      response = await fetch(`${config.public.strapi.url}api/create_sidebar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (!response.ok) throw new Error('Failed to save');
    
    showToast(editingItem.value ? 'ອັບເດດສຳເລັດ' : 'ສ້າງສຳເລັດ', 'success');
    await loadData();
    await triggerSidebarRefresh();
    closeModal();
  } catch (error) {
    showToast('ບັນທຶກບໍ່ສຳເລັດ', 'error');
  } finally {
    saving.value = false;
  }
};

const deleteItem = async (id: number, itemType: 'sidebar_item' | 'sidebar_sub_item') => {
  if (!confirm('ທ່ານຕ້ອງການລຶບລາຍການນີ້ບໍ່?')) return;

  try {
    const response = await fetch(
      `${config.public.strapi.url}api/create_sidebar/${id}/?item_type=${itemType}`,
      { method: 'DELETE' }
    );

    if (!response.ok) throw new Error('Failed to delete');
    
    showToast('ລຶບສຳເລັດ', 'success');
    await loadData();
    await triggerSidebarRefresh();
  } catch (error) {
    showToast('ລຶບບໍ່ສຳເລັດ', 'error');
  }
};

// Trigger sidebar refresh in other components
const triggerSidebarRefresh = async () => {
  try {
    await refreshSidebar();
    console.log('🔄 Sidebar refreshed in all components');
  } catch (error) {
    console.error('Failed to refresh sidebar:', error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingItem.value = null;
  formData.value = {
    name: '',
    icon: '',
    url: '',
    order: 0,
    parent: '',
    is_active: true,
    selectedRoles: []
  };
  formErrors.value = { name: '', icon: '', url: '' };
};

const showToast = (message: string, type: 'success' | 'error') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};
</script>

<style scoped>
/* Previous styles remain the same... */
.sidebar-manager {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 10px 18px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary.btn-success {
  background: #10b981;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
}

.btn-primary.btn-success:hover {
  background: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.filter-section {
  margin-bottom: 24px;
}

.filter-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.role-select {
  width: 100%;
  max-width: 300px;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.role-select:hover {
  border-color: #94a3b8;
}

.role-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.content {
  min-height: 400px;
}

.menu-tree {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.menu-item-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  transition: all 0.2s;
}

.main-item {
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.sub-items-container {
  background: #f8fafc;
}

.sub-item {
  background: #f8fafc;
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
}

.sub-item:hover {
  background: #f1f5f9;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.drag-handle {
  cursor: grab;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.menu-item:hover .drag-handle {
  opacity: 1;
}

.item-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sub-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.sub-connector {
  width: 24px;
  height: 2px;
  background: linear-gradient(to right, #cbd5e1 0%, transparent 100%);
  flex-shrink: 0;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.item-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-item .item-title {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.item-route {
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Monaco', 'Menlo', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.item-badge {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
  min-width: 32px;
  text-align: center;
}

.sub-badge {
  font-size: 11px;
  padding: 3px 8px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 20px;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.item-roles {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 5px 10px;
  border-radius: 6px;
  max-width: 150px;
}

.item-roles span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.action-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.action-btn.edit:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.delete:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}

.empty-state p {
  margin-top: 16px;
  color: #94a3b8;
  font-size: 14px;
}

/* Enhanced Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.enhanced-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.modal-title-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
}

.btn-close {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-control:hover {
  border-color: #94a3b8;
}

.form-control:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.icon-input-group {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.icon-preview {
  width: 52px;
  height: 44px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  transition: all 0.2s;
  flex-shrink: 0;
}

.icon-preview-error {
  border-color: #fca5a5;
  background: #fef2f2;
}

.icon-input {
  flex: 1;
}

.icon-search-btn {
  padding: 10px 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.icon-search-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
}

.helper-text {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.role-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.checkbox-label:hover {
  background: white;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6366f1;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 0;
}

.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: relative;
  width: 48px;
  height: 26px;
  background: #cbd5e1;
  border-radius: 13px;
  transition: all 0.3s;
}

.switch-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 3px;
  left: 3px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-input:checked + .switch-slider {
  background: #10b981;
}

.switch-input:checked + .switch-slider::before {
  transform: translateX(22px);
}

.switch-text {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn-secondary {
  padding: 10px 20px;
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 3000;
  animation: slideIn 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>