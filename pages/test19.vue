<template>
  <div class="sidebar-manager">
    <!-- Header -->
    <div class="header">
      <h2>ຈັດການເມນູໄຊດ໌ບາ</h2>
      <div class="header-actions">
        <button @click="openCreateModal('sidebar_item')" class="btn-primary">
          <span class="icon">+</span> ເພີ່ມເມນູຫຼັກ
        </button>
        <button @click="openCreateModal('sidebar_sub_item')" class="btn-primary btn-secondary">
          <span class="icon">+</span> ເພີ່ມເມນູຍ່ອຍ
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'items' }]" 
        @click="activeTab = 'items'"
      >
        ເມນູຫຼັກ
      </button>
      <button 
        :class="['tab', { active: activeTab === 'subitems' }]" 
        @click="activeTab = 'subitems'"
      >
        ເມນູຍ່ອຍ
      </button>
      <button 
        :class="['tab', { active: activeTab === 'roles' }]" 
        @click="activeTab = 'roles'"
      >
        ມອບສິດເຂົ້າເມນູ
      </button>
    </div>

    <!-- Main Items Tab -->
    <div v-if="activeTab === 'items'" class="content">
      <div class="list-container">
        <div class="item-list">
          <div 
            v-for="(item, index) in sidebarItems" 
            :key="item.id"
            class="item-card"
          >
            <div class="item-content">
              <div class="item-info">
                <div class="item-icon">
                  <v-icon :icon="item.icon || 'mdi-file-outline'" size="24"></v-icon>
                </div>
                <div class="item-details">
                  <span class="item-title">{{ item.title || item.name }}</span>
                  <span class="item-route">{{ item.route || item.url }}</span>
                </div>
                <span class="item-order">ລຳດັບ: {{ item.order }}</span>
                <span :class="['status', item.is_active ? 'active' : 'inactive']">
                  {{ item.is_active ? 'ຫ້ຳໃຊ້ງານ' : 'ປິດ' }}
                </span>
              </div>
              <div class="item-actions">
                <button 
                  @click="moveItem(index, 'up', 'sidebar_item')" 
                  :disabled="index === 0"
                  class="btn-icon"
                  title="ຍ້າຍຂື້ນ"
                >
                  <v-icon icon="mdi-arrow-up" size="18"></v-icon>
                </button>
                <button 
                  @click="moveItem(index, 'down', 'sidebar_item')" 
                  :disabled="index === sidebarItems.length - 1"
                  class="btn-icon"
                  title="ຍ້າຍລົງ"
                >
                  <v-icon icon="mdi-arrow-down" size="18"></v-icon>
                </button>
                <button @click="editItem(item, 'sidebar_item')" class="btn-icon" title="ແກ້ໄຂ">
                  <v-icon icon="mdi-pencil" size="18"></v-icon>
                </button>
                <button @click="deleteItem(item.id, 'sidebar_item')" class="btn-icon danger" title="ລຶບ">
                  <v-icon icon="mdi-delete" size="18"></v-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub Items Tab -->
    <div v-if="activeTab === 'subitems'" class="content">
      <div class="list-container">
        <div class="item-list">
          <div 
            v-for="(item, index) in sidebarSubItems" 
            :key="item.id"
            class="item-card"
          >
            <div class="item-content">
              <div class="item-info">
                <div class="item-icon">
                  <v-icon :icon="item.icon || 'mdi-file-outline'" size="24"></v-icon>
                </div>
                <div class="item-details">
                  <span class="item-title">{{ item.title || item.name }}</span>
                  <span class="parent-info">ແມ່ເມນູ: {{ getParentName(item.parent) }}</span>
                  <span class="item-route">{{ item.route || item.url }}</span>
                </div>
                <span class="item-order">ລຳດັບ: {{ item.order }}</span>
                <span :class="['status', item.is_active ? 'active' : 'inactive']">
                  {{ item.is_active ? 'ຫ້ຳໃຊ້ງານ' : 'ປິດ' }}
                </span>
              </div>
              <div class="item-actions">
                <button 
                  @click="moveItem(index, 'up', 'sidebar_sub_item')" 
                  :disabled="index === 0"
                  class="btn-icon"
                  title="ຍ້າຍຂື້ນ"
                >
                  <v-icon icon="mdi-arrow-up" size="18"></v-icon>
                </button>
                <button 
                  @click="moveItem(index, 'down', 'sidebar_sub_item')" 
                  :disabled="index === sidebarSubItems.length - 1"
                  class="btn-icon"
                  title="ຍ້າຍລົງ"
                >
                  <v-icon icon="mdi-arrow-down" size="18"></v-icon>
                </button>
                <button @click="editItem(item, 'sidebar_sub_item')" class="btn-icon" title="ແກ້ໄຂ">
                  <v-icon icon="mdi-pencil" size="18"></v-icon>
                </button>
                <button @click="deleteItem(item.id, 'sidebar_sub_item')" class="btn-icon danger" title="ລຶບ">
                  <v-icon icon="mdi-delete" size="18"></v-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Assignment Tab -->
    <div v-if="activeTab === 'roles'" class="content">
      <div class="role-assignment">
        <div class="form-group">
          <label>ເລືອກບົດບາດ</label>
          <select v-model="selectedRole" class="form-control">
            <option value="">-- ເລືອກບົດບາດ --</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <div v-if="selectedRole" class="matrix-table">
          <div class="table-header">
            <div class="header-cell">ເມນູ</div>
            <div class="header-cell center">ເລືອກ</div>
          </div>

          <!-- Main Items with Sub-items -->
          <div v-for="item in sidebarItems" :key="'main-' + item.id" class="table-section">
            <!-- Main Item Row -->
            <div class="table-row main-row">
              <div class="cell-content">
                <v-icon :icon="item.icon || 'mdi-file-outline'" size="20"></v-icon>
                <span class="item-name">{{ item.title || item.name }}</span>
              </div>
              <div class="cell-checkbox">
                <input 
                  type="checkbox" 
                  :value="item.id" 
                  v-model="selectedMainItems"
                  @change="onMainItemToggle(item)"
                />
              </div>
            </div>

            <!-- Sub Items -->
            <div v-if="item.sub_items && item.sub_items.length > 0" class="sub-items-group">
              <div 
                v-for="subItem in item.sub_items" 
                :key="'sub-' + subItem.id"
                class="table-row sub-row"
              >
                <div class="cell-content">
                  <span class="sub-connector">└─</span>
                  <v-icon :icon="subItem.icon || 'mdi-circle-small'" size="18"></v-icon>
                  <span class="item-name">{{ subItem.title || subItem.name }}</span>
                </div>
                <div class="cell-checkbox">
                  <input 
                    type="checkbox" 
                    :value="subItem.id" 
                    v-model="selectedSubItems"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedRole" class="action-buttons">
          <button @click="clearSelection" class="btn-secondary">
            ລ້າງການເລືອກ
          </button>
          <button @click="assignRole" class="btn-primary">
            ບັນທຶກສິດ
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingItem ? 'ແກ້ໄຂ' : 'ສ້າງ' }} {{ modalType === 'sidebar_item' ? 'ເມນູຫຼັກ' : 'ເມນູຍ່ອຍ' }}</h3>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>ປະເພດ</label>
            <select v-model="modalType" class="form-control" :disabled="editingItem">
              <option value="sidebar_item">ເມນູຫຼັກ</option>
              <option value="sidebar_sub_item">ເມນູຍ່ອຍ</option>
            </select>
          </div>

          <div v-if="modalType === 'sidebar_sub_item'" class="form-group">
            <label>ແມ່ເມນູ *</label>
            <select v-model="formData.parent" class="form-control" required>
              <option value="">-- ເລືອກແມ່ເມນູ --</option>
              <option v-for="item in sidebarItems" :key="item.id" :value="item.id">
                {{ item.title || item.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>ຊື່ເມນູ *</label>
            <input v-model="formData.name" type="text" class="form-control" required />
          </div>

          <div class="form-group">
            <label>ໄອຄອນ (mdi-icon)</label>
            <input v-model="formData.icon" type="text" class="form-control" placeholder="mdi-home" />
          </div>

          <div class="form-group">
            <label>ເສັ້ນທາງ/URL *</label>
            <input v-model="formData.url" type="text" class="form-control" placeholder="/dashboard" required />
          </div>

          <div class="form-group">
            <label>ລຳດັບ *</label>
            <input v-model.number="formData.order" type="number" class="form-control" min="0" required />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.is_active" type="checkbox" />
              <span>ເປີດໃຊ້ງານ</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">ຍົກເລີກ</button>
          <button @click="saveItem" class="btn-primary">
            {{ editingItem ? 'ອັບເດດ' : 'ສ້າງ' }}
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
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

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

interface Role {
  id: number;
  name: string;
  description?: string;
}

const config = useRuntimeConfig();
const activeTab = ref('items');
const sidebarItems = ref<SidebarItem[]>([]);
const sidebarSubItems = ref<SubItem[]>([]);
const roles = ref<Role[]>([]);
const selectedRole = ref('');
const selectedMainItems = ref<number[]>([]);
const selectedSubItems = ref<number[]>([]);
const showCreateModal = ref(false);
const modalType = ref<'sidebar_item' | 'sidebar_sub_item'>('sidebar_item');
const editingItem = ref<any>(null);
const formData = ref({
  name: '',
  icon: '',
  url: '',
  order: 0,
  parent: '',
  is_active: true
});
const loading = ref(false);
const toast = ref({
  show: false,
  message: '',
  type: 'success'
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

  // Swap items
  const temp = items[index];
  items[index] = items[newIndex];
  items[newIndex] = temp;

  // Update order values
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
  } catch (error) {
    showToast('ອັບເດດລຳດັບບໍ່ສຳເລັດ', 'error');
    // Revert on error
    const tempRevert = items[index];
    items[index] = items[newIndex];
    items[newIndex] = tempRevert;
  }
};

const openCreateModal = (type: 'sidebar_item' | 'sidebar_sub_item') => {
  modalType.value = type;
  showCreateModal.value = true;
};

const editItem = (item: any, type: 'sidebar_item' | 'sidebar_sub_item') => {
  editingItem.value = item;
  modalType.value = type;
  formData.value = {
    name: item.title || item.name,
    icon: item.icon || '',
    url: item.route || item.url || '',
    order: item.order,
    parent: item.parent || '',
    is_active: item.is_active
  };
  showCreateModal.value = true;
};

const saveItem = async () => {
  const data = {
    item_type: modalType.value,
    title: formData.value.name,
    icon: formData.value.icon,
    route: formData.value.url,
    order: formData.value.order,
    parent: formData.value.parent,
    is_active: formData.value.is_active
  };

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
    closeModal();
  } catch (error) {
    showToast('ບັນທຶກບໍ່ສຳເລັດ', 'error');
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
  } catch (error) {
    showToast('ລຶບບໍ່ສຳເລັດ', 'error');
  }
};

const assignRole = async () => {
  try {
    const response = await fetch(`${config.public.strapi.url}api/assign-role/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role_id: selectedRole.value,
        sidebar_items: selectedMainItems.value,
        sidebar_sub_items: selectedSubItems.value
      })
    });

    if (!response.ok) throw new Error('Failed to assign role');
    
    showToast('ມອບສິດສຳເລັດ', 'success');
    selectedMainItems.value = [];
    selectedSubItems.value = [];
  } catch (error) {
    showToast('ມອບສິດບໍ່ສຳເລັດ', 'error');
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
    is_active: true
  };
};

const getParentName = (parentId: number) => {
  const parent = sidebarItems.value.find(item => item.id === parentId);
  return parent ? (parent.title || parent.name) : 'Unknown';
};

const showToast = (message: string, type: 'success' | 'error') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const onMainItemToggle = (item: SidebarItem) => {
  // Auto-select/deselect all sub-items when main item is toggled
  if (item.sub_items && item.sub_items.length > 0) {
    const isMainSelected = selectedMainItems.value.includes(item.id);
    if (isMainSelected) {
      // Select all sub-items
      item.sub_items.forEach(subItem => {
        if (!selectedSubItems.value.includes(subItem.id)) {
          selectedSubItems.value.push(subItem.id);
        }
      });
    } else {
      // Deselect all sub-items
      item.sub_items.forEach(subItem => {
        const index = selectedSubItems.value.indexOf(subItem.id);
        if (index > -1) {
          selectedSubItems.value.splice(index, 1);
        }
      });
    }
  }
};

const clearSelection = () => {
  selectedMainItems.value = [];
  selectedSubItems.value = [];
};

// Helper function to check if item has specific role
const hasRole = (roles: Role[] | number[], roleId: number): boolean => {
  if (!roles || roles.length === 0) return false;
  if (typeof roles[0] === 'object') {
    return roles.some((r: any) => r.id === roleId);
  }
  return roles.includes(roleId);
};

// Watch selectedRole and auto-check items that already have this role
watch(selectedRole, (newRoleId) => {
  if (!newRoleId) {
    selectedMainItems.value = [];
    selectedSubItems.value = [];
    return;
  }

  const roleId = parseInt(newRoleId as string);

  // Auto-check main items that have this role
  selectedMainItems.value = sidebarItems.value
    .filter(item => hasRole(item.roles, roleId))
    .map(item => item.id);

  // Auto-check sub items that have this role
  const allSubItems: SubItem[] = [];
  sidebarItems.value.forEach(item => {
    if (item.sub_items) {
      allSubItems.push(...item.sub_items);
    }
  });

  selectedSubItems.value = allSubItems
    .filter(item => hasRole(item.roles, roleId))
    .map(item => item.id);
});
</script>

<style scoped>
.sidebar-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab:hover {
  color: #2563eb;
}

.tab.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.content {
  min-height: 400px;
}

.list-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 16px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
}

.item-card:hover {
  border-color: #2563eb;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.item-title {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.item-route {
  font-size: 13px;
  color: #6b7280;
}

.parent-info {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.item-order {
  font-size: 13px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

.status.active {
  background: #d1fae5;
  color: #065f46;
}

.status.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.item-actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #2563eb;
  transform: translateY(-2px);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-icon.danger:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #dc2626;
}

.btn-primary {
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-primary.btn-secondary {
  background: #10b981;
}

.btn-primary.btn-secondary:hover {
  background: #059669;
}

.btn-secondary {
  padding: 10px 20px;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.icon {
  font-size: 18px;
}

.role-assignment {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.matrix-table {
  margin-top: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 80px;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.header-cell {
  padding: 12px 16px;
  display: flex;
  align-items: center;
}

.header-cell.center {
  justify-content: center;
}

.table-section {
  border-bottom: 1px solid #f3f4f6;
}

.table-section:last-child {
  border-bottom: none;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 80px;
  align-items: center;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.main-row {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.sub-row {
  background: #fafbfc;
  border-bottom: 1px solid #f3f4f6;
}

.sub-row:last-child {
  border-bottom: none;
}

.cell-content {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-row .cell-content {
  font-weight: 600;
  color: #1a1a1a;
}

.sub-row .cell-content {
  padding-left: 32px;
  color: #6b7280;
}

.sub-connector {
  color: #d1d5db;
  font-size: 14px;
  margin-right: 4px;
}

.item-name {
  flex: 1;
}

.cell-checkbox {
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.checkbox-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.checkbox-item:hover {
  background: #f3f4f6;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 3000;
  animation: slideIn 0.3s ease;
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
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>