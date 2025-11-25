<template>
  <div class="matrix-manager">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="header-icon">
          <v-icon icon="mdi-security" size="28" color="#6366f1"></v-icon>
        </div>
        <div>
          <h2>ຈັດການສິດເຂົ້າເຖິງເມນູ</h2>
          <p class="subtitle">ກຳນົດສິດການເຂົ້າເຖິງເມນູສຳລັບແຕ່ລະບົດບາດ</p>
        </div>
      </div>
      <div class="header-actions">
        <button @click="openCreateModal('role')" class="btn-add-role">
          <v-icon icon="mdi-account-plus" size="18"></v-icon>
          <span>ບົດບາດ</span>
        </button>
        <button @click="openCreateModal('main')" class="btn-add">
          <v-icon icon="mdi-plus" size="18"></v-icon>
          <span>ເມນູຫຼັກ</span>
        </button>
        <button @click="openCreateModal('sub')" class="btn-add">
          <v-icon icon="mdi-plus" size="18"></v-icon>
          <span>ເມນູຍ່ອຍ</span>
        </button>
        <button @click="saveAllChanges" class="btn-save" :disabled="!hasChanges || saving">
          <v-icon v-if="!saving" icon="mdi-content-save" size="18"></v-icon>
          <div v-else class="btn-spinner"></div>
          <span>{{ saving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການປ່ຽນແປງ' }}</span>
        </button>
        <button @click="refreshData" class="btn-refresh" :disabled="loading">
          <v-icon icon="mdi-refresh" size="18"></v-icon>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);">
          <v-icon icon="mdi-menu" size="24" color="#6366f1"></v-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ sidebarItems.length }}</span>
          <span class="stat-label">ເມນູຫຼັກ</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
          <v-icon icon="mdi-file-tree" size="24" color="#f59e0b"></v-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ sidebarSubItems.length }}</span>
          <span class="stat-label">ເມນູຍ່ອຍ</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);">
          <v-icon icon="mdi-account-group" size="24" color="#10b981"></v-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ roles.length }}</span>
          <span class="stat-label">ບົດບາດ</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);">
          <v-icon icon="mdi-pencil" size="24" color="#f97316"></v-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ changeCount }}</span>
          <span class="stat-label">ການປ່ຽນແປງ</span>
        </div>
      </div>
    </div>

    <!-- Matrix Table -->
    <div class="matrix-container" v-if="!loading">
      <div class="matrix-scroll">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="menu-column sticky-col">
                <div class="th-content">
                  <v-icon icon="mdi-menu" size="20" color="#64748b"></v-icon>
                  <span>ເມນູ</span>
                </div>
              </th>
              <th class="action-column">
                <div class="th-content">
                  <v-icon icon="mdi-cog" size="18" color="#64748b"></v-icon>
                </div>
              </th>
              <th v-for="role in roles" :key="role.id" class="role-column">
                <div class="th-content">
                  <div class="role-icon" :style="{ background: getRoleColor(role.id) }">
                    <v-icon icon="mdi-account" size="18" color="#ffffff"></v-icon>
                  </div>
                  <div class="role-info">
                    <span class="role-name">{{ role.name }}</span>
                    <span class="role-count">{{ getRoleAccessCount(role.id) }} items</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Loop through Main Items -->
            <template v-for="item in sidebarItems" :key="`main-${item.id}`">
              <!-- Main Menu Item -->
              <tr class="main-row">
                <td class="menu-cell sticky-col">
                  <div class="menu-item-info">
                    <div class="menu-icon" :style="{ background: getMenuColor(item.id) }">
                      <v-icon :icon="item.icon || 'mdi-menu'" size="22" color="#ffffff"></v-icon>
                    </div>
                    <div class="menu-details">
                      <span class="menu-title">{{ item.title || item.name }}</span>
                      <span class="menu-route">{{ item.route || item.url }}</span>
                    </div>
                    <div v-if="!item.is_active" class="inactive-badge">
                      <v-icon icon="mdi-eye-off" size="14"></v-icon>
                    </div>
                  </div>
                </td>
                <td class="action-cell">
                  <div class="action-buttons">
                    <button @click="editItem(item, 'sidebar_item')" class="action-btn edit-btn" title="ແກ້ໄຂ">
                      <v-icon icon="mdi-pencil-outline" size="16"></v-icon>
                    </button>
                    <button @click="deleteItem(item.id, 'sidebar_item')" class="action-btn delete-btn" title="ລຶບ">
                      <v-icon icon="mdi-delete-outline" size="16"></v-icon>
                    </button>
                  </div>
                </td>
                <td v-for="role in roles" :key="`${item.id}-${role.id}`" class="checkbox-cell">
                  <label class="checkbox-wrapper" :class="{ 'has-change': hasItemChange(item.id, role.id, 'main') }">
                    <input 
                      type="checkbox"
                      :checked="isItemAssigned(item.id, role.id, 'main')"
                      @change="togglePermission(item.id, role.id, 'main', $event)"
                      class="checkbox-input"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                </td>
              </tr>

              <!-- Sub Items for this Main Item -->
              <tr v-for="subItem in getSubItemsForParent(item.id)" :key="`sub-${subItem.id}`" class="sub-row">
                <td class="menu-cell sticky-col">
                  <div class="menu-item-info sub-menu">
                    <div class="sub-connector"></div>
                    <div class="menu-icon sub-icon" :style="{ background: getMenuColor(item.id, true) }">
                      <v-icon :icon="subItem.icon || 'mdi-circle-small'" size="18" color="#ffffff"></v-icon>
                    </div>
                    <div class="menu-details">
                      <span class="menu-title">{{ subItem.title || subItem.name }}</span>
                      <span class="menu-route">{{ subItem.route || subItem.url }}</span>
                    </div>
                    <div v-if="!subItem.is_active" class="inactive-badge">
                      <v-icon icon="mdi-eye-off" size="12"></v-icon>
                    </div>
                  </div>
                </td>
                <td class="action-cell">
                  <div class="action-buttons">
                    <button @click="editItem(subItem, 'sidebar_sub_item')" class="action-btn edit-btn" title="ແກ້ໄຂ">
                      <v-icon icon="mdi-pencil-outline" size="14"></v-icon>
                    </button>
                    <button @click="deleteItem(subItem.id, 'sidebar_sub_item')" class="action-btn delete-btn" title="ລຶບ">
                      <v-icon icon="mdi-delete-outline" size="14"></v-icon>
                    </button>
                  </div>
                </td>
                <td v-for="role in roles" :key="`${subItem.id}-${role.id}`" class="checkbox-cell">
                  <label class="checkbox-wrapper" :class="{ 'has-change': hasItemChange(subItem.id, role.id, 'sub') }">
                    <input 
                      type="checkbox"
                      :checked="isItemAssigned(subItem.id, role.id, 'sub')"
                      @change="togglePermission(subItem.id, role.id, 'sub', $event)"
                      class="checkbox-input"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && sidebarItems.length === 0" class="empty-state">
      <v-icon icon="mdi-file-tree-outline" size="64" color="#cbd5e1"></v-icon>
      <p>ບໍ່ມີຂໍ້ມູນເມນູ</p>
    </div>

    <!-- Edit/Create Modal for Menu Items -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal enhanced-modal">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <v-icon :icon="editingItemId ? 'mdi-pencil' : 'mdi-plus'" size="24" color="#6366f1"></v-icon>
            </div>
            <div>
              <h3>{{ editingItemId ? 'ແກ້ໄຂ' : 'ເພີ່ມ' }} {{ editModalType === 'sidebar_item' ? 'ເມນູຫຼັກ' : 'ເມນູຍ່ອຍ' }}</h3>
              <p class="modal-subtitle">{{ editingItemId ? 'ອັບເດດຂໍ້ມູນເມນູ' : 'ສ້າງເມນູໃໝ່' }}</p>
            </div>
          </div>
          <button @click="closeEditModal" class="btn-close">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>ຊື່ເມນູ <span class="required">*</span></label>
            <input 
              v-model="editFormData.name" 
              type="text" 
              class="form-control" 
              placeholder="ປ້ອນຊື່ເມນູ"
              required 
            />
          </div>

          <div class="form-group">
            <label>ໄອຄອນ (MDI Icon)</label>
            <div class="icon-input-group">
              <div class="icon-preview">
                <v-icon 
                  :icon="editFormData.icon || 'mdi-help-circle'" 
                  size="28" 
                  :color="editFormData.icon && editFormData.icon.startsWith('mdi-') ? '#6366f1' : '#cbd5e1'"
                ></v-icon>
              </div>
              <input 
                v-model="editFormData.icon" 
                type="text" 
                class="form-control icon-input" 
                placeholder="mdi-home (ປ່ອຍຫວ່າງໄດ້)"
              />
              <a 
                href="https://pictogrammers.com/library/mdi/" 
                target="_blank" 
                class="icon-search-btn"
                title="ຄົ້ນຫາໄອຄອນ"
              >
                <v-icon icon="mdi-magnify" size="18"></v-icon>
              </a>
            </div>
          </div>

          <div class="form-group">
            <label>ເສັ້ນທາງ/URL</label>
            <input 
              v-model="editFormData.url" 
              type="text" 
              class="form-control" 
              placeholder="/dashboard (ປ່ອຍຫວ່າງໄດ້)"
            />
          </div>

          <!-- Parent selection for sub-items -->
          <div v-if="editModalType === 'sidebar_sub_item'" class="form-group">
            <label>ເມນູຫຼັກ <span class="required">*</span></label>
            <select v-model="editFormData.parent" class="form-control" required>
              <option value="">-- ເລືອກເມນູຫຼັກ --</option>
              <option v-for="item in sidebarItems" :key="item.id" :value="item.id">
                {{ item.title || item.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>ລຳດັບ</label>
            <input 
              v-model.number="editFormData.order" 
              type="number" 
              min="0"
              class="form-control" 
              placeholder="0"
            />
          </div>

          <div class="form-group">
            <label>ສະຖານະ</label>
            <div class="switch-container">
              <label class="switch-label">
                <input v-model="editFormData.is_active" type="checkbox" class="switch-input" />
                <span class="switch-slider"></span>
              </label>
              <span class="switch-text">{{ editFormData.is_active ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ' }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeEditModal" class="btn-secondary">
            <v-icon icon="mdi-close" size="18"></v-icon>
            <span>ຍົກເລີກ</span>
          </button>
          <button @click="saveEditItem" class="btn-primary" :disabled="!isFormValid || editSaving">
            <v-icon v-if="!editSaving" icon="mdi-content-save" size="18"></v-icon>
            <div v-else class="btn-spinner"></div>
            <span>{{ editSaving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Role Creation Modal -->
    <div v-if="showRoleModal" class="modal-overlay" @click.self="closeRoleModal">
      <div class="modal enhanced-modal">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <v-icon icon="mdi-account-plus" size="24" color="#6366f1"></v-icon>
            </div>
            <div>
              <h3>ເພີ່ມບົດບາດໃໝ່</h3>
              <p class="modal-subtitle">ສ້າງບົດບາດສຳລັບຜູ້ໃຊ້</p>
            </div>
          </div>
          <button @click="closeRoleModal" class="btn-close">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>ຊື່ບົດບາດ <span class="required">*</span></label>
            <input 
              v-model="roleFormData.name" 
              type="text" 
              class="form-control" 
              placeholder="ເຊັ່ນ: Admin, User, Manager"
              required 
            />
          </div>

          <div class="form-group">
            <label>ລາຍລະອຽດ</label>
            <textarea 
              v-model="roleFormData.description" 
              class="form-control" 
              rows="3"
              placeholder="ອະທິບາຍບົດບາດ (ປ່ອຍຫວ່າງໄດ້)"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeRoleModal" class="btn-secondary">
            <v-icon icon="mdi-close" size="18"></v-icon>
            <span>ຍົກເລີກ</span>
          </button>
          <button @click="saveRole" class="btn-primary" :disabled="!roleFormData.name || roleSaving">
            <v-icon v-if="!roleSaving" icon="mdi-content-save" size="18"></v-icon>
            <div v-else class="btn-spinner"></div>
            <span>{{ roleSaving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <v-icon :icon="getToastIcon(toast.type)" size="20"></v-icon>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Changes Panel -->
    <Transition name="slide-up">
      <div v-if="hasChanges" class="changes-panel">
        <div class="changes-header">
          <div class="changes-info">
            <v-icon icon="mdi-alert-circle" size="20" color="#f59e0b"></v-icon>
            <span>ມີການປ່ຽນແປງ {{ changeCount }} ລາຍການທີ່ຍັງບໍ່ທັນບັນທຶກ</span>
          </div>
          <div class="changes-actions">
            <button @click="discardChanges" class="btn-discard">
              <v-icon icon="mdi-close" size="16"></v-icon>
              <span>ຍົກເລີກ</span>
            </button>
            <button @click="saveAllChanges" class="btn-save-changes" :disabled="saving">
              <v-icon v-if="!saving" icon="mdi-content-save" size="16"></v-icon>
              <div v-else class="btn-spinner small"></div>
              <span>{{ saving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກທັງໝົດ' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { refreshSidebar } from '~/components/backendComponents/sidebar/sidebarItems';

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

interface Role {
  id: number;
  name: string;
  description?: string;
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
  is_active: boolean;
}

interface SidebarSubItem {
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

interface PermissionChange {
  itemId: number;
  roleId: number;
  type: 'main' | 'sub';
  checked: boolean;
}

const config = useRuntimeConfig();
const sidebarItems = ref<SidebarItem[]>([]);
const sidebarSubItems = ref<SidebarSubItem[]>([]);
const roles = ref<Role[]>([]);
const loading = ref(false);
const saving = ref(false);
const pendingChanges = ref<Map<string, PermissionChange>>(new Map());

// Edit modal states
const showEditModal = ref(false);
const editModalType = ref<'sidebar_item' | 'sidebar_sub_item'>('sidebar_item');
const editingItemId = ref<number | null>(null);
const editSaving = ref(false);
const editFormData = ref({
  name: '',
  icon: '',
  url: '',
  parent: '',
  order: 0,
  is_active: true
});

// Role modal states
const showRoleModal = ref(false);
const roleSaving = ref(false);
const roleFormData = ref({
  name: '',
  description: ''
});

const toast = ref({
  show: false,
  message: '',
  type: 'success'
});

const roleColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4'];
const menuColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#f43f5e'];

const getRoleColor = (roleId: number) => {
  return roleColors[roleId % roleColors.length];
};

const getMenuColor = (itemId: number, isSub: boolean = false) => {
  const color = menuColors[itemId % menuColors.length];
  return isSub ? `${color}dd` : color;
};

const hasChanges = computed(() => pendingChanges.value.size > 0);
const changeCount = computed(() => pendingChanges.value.size);

const isFormValid = computed(() => {
  if (!editFormData.value.name) return false;
  if (editModalType.value === 'sidebar_sub_item' && !editFormData.value.parent) return false;
  return true;
});

// Get sub items for a specific parent
const getSubItemsForParent = (parentId: number) => {
  return sidebarSubItems.value
    .filter(item => item.parent === parentId)
    .sort((a, b) => a.order - b.order);
};

const getRoleAccessCount = (roleId: number) => {
  let count = 0;
  sidebarItems.value.forEach(item => {
    if (isItemAssigned(item.id, roleId, 'main')) count++;
  });
  sidebarSubItems.value.forEach(item => {
    if (isItemAssigned(item.id, roleId, 'sub')) count++;
  });
  return count;
};

const isItemAssigned = (itemId: number, roleId: number, type: 'main' | 'sub'): boolean => {
  const changeKey = `${itemId}-${roleId}-${type}`;
  if (pendingChanges.value.has(changeKey)) {
    return pendingChanges.value.get(changeKey)!.checked;
  }

  const items = type === 'main' ? sidebarItems.value : sidebarSubItems.value;
  const item = items.find(i => i.id === itemId);
  
  if (!item || !item.roles) return false;
  
  if (typeof item.roles[0] === 'object') {
    return item.roles.some((r: any) => r.id === roleId);
  }
  return item.roles.includes(roleId);
};

const hasItemChange = (itemId: number, roleId: number, type: 'main' | 'sub'): boolean => {
  return pendingChanges.value.has(`${itemId}-${roleId}-${type}`);
};

const togglePermission = (itemId: number, roleId: number, type: 'main' | 'sub', event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  const changeKey = `${itemId}-${roleId}-${type}`;
  
  const items = type === 'main' ? sidebarItems.value : sidebarSubItems.value;
  const item = items.find(i => i.id === itemId);
  
  if (!item) return;
  
  const currentlyAssigned = typeof item.roles[0] === 'object' 
    ? item.roles.some((r: any) => r.id === roleId)
    : item.roles.includes(roleId);
  
  if (checked === currentlyAssigned) {
    pendingChanges.value.delete(changeKey);
  } else {
    pendingChanges.value.set(changeKey, { itemId, roleId, type, checked });
  }
};

const openCreateModal = (type: 'main' | 'sub' | 'role') => {
  if (type === 'role') {
    roleFormData.value = { name: '', description: '' };
    showRoleModal.value = true;
  } else {
    editingItemId.value = null;
    editModalType.value = type === 'main' ? 'sidebar_item' : 'sidebar_sub_item';
    editFormData.value = {
      name: '',
      icon: '',
      url: '',
      parent: '',
      order: 0,
      is_active: true
    };
    showEditModal.value = true;
  }
};

const editItem = (item: any, type: 'sidebar_item' | 'sidebar_sub_item') => {
  editingItemId.value = item.id;
  editModalType.value = type;
  editFormData.value = {
    name: item.title || item.name || '',
    icon: item.icon || '',
    url: item.route || item.url || '',
    parent: type === 'sidebar_sub_item' ? String(item.parent || '') : '',
    order: item.order || 0,
    is_active: item.is_active ?? true
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingItemId.value = null;
  editFormData.value = {
    name: '',
    icon: '',
    url: '',
    parent: '',
    order: 0,
    is_active: true
  };
};

const closeRoleModal = () => {
  showRoleModal.value = false;
  roleFormData.value = {
    name: '',
    description: ''
  };
};

const saveEditItem = async () => {
  if (!isFormValid.value) return;
  
  editSaving.value = true;
  
  try {
    const data: any = {
      item_type: editModalType.value,
      title: editFormData.value.name,
      icon: editFormData.value.icon || null,
      route: editFormData.value.url || null,
      order: editFormData.value.order,
      is_active: editFormData.value.is_active
    };

    // Add parent for sub-items
    if (editModalType.value === 'sidebar_sub_item') {
      data.parent = parseInt(editFormData.value.parent);
    }

    // For update, preserve existing roles
    if (editingItemId.value) {
      const items = editModalType.value === 'sidebar_item' ? sidebarItems.value : sidebarSubItems.value;
      const currentItem = items.find(i => i.id === editingItemId.value);
      
      if (currentItem) {
        const existingRoleIds = typeof currentItem.roles[0] === 'object'
          ? currentItem.roles.map((r: any) => r.id)
          : currentItem.roles;
        data.roles = existingRoleIds;
      }
    }

    const url = editingItemId.value
      ? `${config.public.strapi.url}api/create_sidebar/${editingItemId.value}/`
      : `${config.public.strapi.url}api/create_sidebar/`;

    const response = await fetch(url, {
      method: editingItemId.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to save');
    
    showToast(editingItemId.value ? 'ອັບເດດສຳເລັດ' : 'ສ້າງສຳເລັດ', 'success');
    await loadData();
    await triggerSidebarRefresh();
    closeEditModal();
  } catch (error) {
    console.error('Save error:', error);
    showToast('ບັນທຶກບໍ່ສຳເລັດ', 'error');
  } finally {
    editSaving.value = false;
  }
};

const saveRole = async () => {
  if (!roleFormData.value.name) return;
  
  roleSaving.value = true;
  
  try {
    const response = await fetch(`${config.public.strapi.url}api/roles/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: roleFormData.value.name,
        description: roleFormData.value.description || null
      })
    });

    if (!response.ok) throw new Error('Failed to create role');
    
    showToast('ສ້າງບົດບາດສຳເລັດ', 'success');
    await loadData();
    closeRoleModal();
  } catch (error) {
    console.error('Role creation error:', error);
    showToast('ສ້າງບົດບາດບໍ່ສຳເລັດ', 'error');
  } finally {
    roleSaving.value = false;
  }
};

const deleteItem = async (id: number, itemType: 'sidebar_item' | 'sidebar_sub_item') => {
  const itemName = itemType === 'sidebar_item' ? 'ເມນູຫຼັກ' : 'ເມນູຍ່ອຍ';
  
  if (!confirm(`ທ່ານຕ້ອງການລຶບ${itemName}ນີ້ບໍ່?`)) return;

  try {
    const response = await fetch(
      `${config.public.strapi.url}api/create_sidebar/${id}/?item_type=${itemType}`,
      { method: 'DELETE' }
    );

    if (!response.ok) throw new Error('Failed to delete');
    
    showToast('ລຶບສຳເລັດ', 'success');
    
    // Clear pending changes for deleted item
    const keysToDelete: string[] = [];
    pendingChanges.value.forEach((change, key) => {
      if (change.itemId === id && (
        (itemType === 'sidebar_item' && change.type === 'main') ||
        (itemType === 'sidebar_sub_item' && change.type === 'sub')
      )) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => pendingChanges.value.delete(key));
    
    await loadData();
    await triggerSidebarRefresh();
  } catch (error) {
    console.error('Delete error:', error);
    showToast('ລຶບບໍ່ສຳເລັດ', 'error');
  }
};

const saveAllChanges = async () => {
  if (!hasChanges.value || saving.value) return;
  
  saving.value = true;
  
  try {
    // Group changes by role
    const roleChanges = new Map<number, { 
      addItems: number[], 
      removeItems: number[],
      addSubItems: number[],
      removeSubItems: number[]
    }>();
    
    // Initialize with current state for each role
    roles.value.forEach(role => {
      const currentItems: number[] = [];
      const currentSubItems: number[] = [];
      
      // Get current assignments
      sidebarItems.value.forEach(item => {
        if (typeof item.roles[0] === 'object') {
          if (item.roles.some((r: any) => r.id === role.id)) {
            currentItems.push(item.id);
          }
        } else if (item.roles.includes(role.id)) {
          currentItems.push(item.id);
        }
      });
      
      sidebarSubItems.value.forEach(item => {
        if (typeof item.roles[0] === 'object') {
          if (item.roles.some((r: any) => r.id === role.id)) {
            currentSubItems.push(item.id);
          }
        } else if (item.roles.includes(role.id)) {
          currentSubItems.push(item.id);
        }
      });
      
      roleChanges.set(role.id, {
        addItems: [...currentItems],
        removeItems: [],
        addSubItems: [...currentSubItems],
        removeSubItems: []
      });
    });
    
    // Apply pending changes
    pendingChanges.value.forEach(change => {
      const roleData = roleChanges.get(change.roleId);
      if (!roleData) return;
      
      if (change.type === 'main') {
        if (change.checked) {
          if (!roleData.addItems.includes(change.itemId)) {
            roleData.addItems.push(change.itemId);
          }
        } else {
          roleData.addItems = roleData.addItems.filter(id => id !== change.itemId);
        }
      } else {
        if (change.checked) {
          if (!roleData.addSubItems.includes(change.itemId)) {
            roleData.addSubItems.push(change.itemId);
          }
        } else {
          roleData.addSubItems = roleData.addSubItems.filter(id => id !== change.itemId);
        }
      }
    });
    
    // Send updates to backend
    const updatePromises = Array.from(roleChanges.entries()).map(([roleId, data]) => {
      return fetch(`${config.public.strapi.url}api/assign-role/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: roleId,
          sidebar_items: data.addItems,
          sidebar_sub_items: data.addSubItems
        })
      });
    });
    
    const results = await Promise.all(updatePromises);
    const allSuccess = results.every(r => r.ok);
    
    if (allSuccess) {
      showToast('ບັນທຶກການປ່ຽນແປງສຳເລັດ', 'success');
      pendingChanges.value.clear();
      await loadData();
      await triggerSidebarRefresh();
    } else {
      showToast('ບາງການປ່ຽນແປງບັນທຶກບໍ່ສຳເລັດ', 'error');
    }
  } catch (error) {
    console.error('Save error:', error);
    showToast('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
  } finally {
    saving.value = false;
  }
};

const discardChanges = () => {
  if (confirm('ທ່ານຕ້ອງການຍົກເລີກການປ່ຽນແປງທັງໝົດບໍ່?')) {
    pendingChanges.value.clear();
    showToast('ຍົກເລີກການປ່ຽນແປງແລ້ວ', 'info');
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [itemsRes, subItemsRes, rolesRes] = await Promise.all([
      fetch(`${config.public.strapi.url}api/sidebar-items/`),
      fetch(`${config.public.strapi.url}api/sidebar-sub-items/`),
      fetch(`${config.public.strapi.url}api/roles/`)
    ]);
    
    const items = await itemsRes.json();
    const subItems = await subItemsRes.json();
    
    // Sort by order
    sidebarItems.value = items.sort((a: SidebarItem, b: SidebarItem) => a.order - b.order);
    sidebarSubItems.value = subItems.sort((a: SidebarSubItem, b: SidebarSubItem) => a.order - b.order);
    roles.value = await rolesRes.json();
  } catch (error) {
    console.error('Load error:', error);
    showToast('ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ', 'error');
  } finally {
    loading.value = false;
  }
};

const refreshData = async () => {
  if (hasChanges.value) {
    if (!confirm('ມີການປ່ຽນແປງທີ່ຍັງບໍ່ທັນບັນທຶກ. ທ່ານຕ້ອງການໂຫຼດຂໍ້ມູນໃໝ່ບໍ່?')) {
      return;
    }
    pendingChanges.value.clear();
  }
  await loadData();
  showToast('ໂຫຼດຂໍ້ມູນໃໝ່ສຳເລັດ', 'success');
};

const triggerSidebarRefresh = async () => {
  try {
    await refreshSidebar();
    console.log('🔄 Sidebar refreshed');
  } catch (error) {
    console.error('Failed to refresh sidebar:', error);
  }
};

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success': return 'mdi-check-circle';
    case 'error': return 'mdi-alert-circle';
    case 'info': return 'mdi-information';
    default: return 'mdi-information';
  }
};

const showToast = (message: string, type: 'success' | 'error' | 'info') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.matrix-manager {
  max-width: 1600px;
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
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-save, .btn-refresh, .btn-add, .btn-add-role {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-add {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-add-role {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.btn-add-role:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.btn-save {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.btn-save:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-refresh {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
}

.btn-refresh:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.matrix-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.matrix-scroll {
  overflow-x: auto;
  overflow-y: visible;
}

.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.matrix-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

.matrix-table th {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #334155;
  font-size: 13px;
}

.sticky-col {
  position: sticky;
  left: 0;
  z-index: 11;
  background: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.menu-column {
  min-width: 350px;
  max-width: 350px;
}

.action-column {
  min-width: 100px;
  width: 100px;
  text-align: center;
}

.role-column {
  min-width: 160px;
  text-align: center;
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.menu-column .th-content {
  justify-content: flex-start;
}

.role-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.role-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.role-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.role-count {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.main-row {
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

.main-row:hover {
  background: #fafbfc;
}

.sub-row {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.sub-row:hover {
  background: #f1f5f9;
}

.menu-cell {
  padding: 12px 16px;
}

.action-cell {
  padding: 12px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.action-btn.edit-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.delete-btn:hover {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.menu-item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sub-menu {
  padding-left: 12px;
}

.sub-connector {
  width: 24px;
  height: 2px;
  background: linear-gradient(to right, #cbd5e1 0%, transparent 100%);
  flex-shrink: 0;
}

.menu-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.sub-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.menu-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.menu-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-row .menu-title {
  font-weight: 500;
  font-size: 13px;
  color: #475569;
}

.menu-route {
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Monaco', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inactive-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #ef4444;
  background: #fee2e2;
  padding: 4px 8px;
  border-radius: 6px;
}

.checkbox-cell {
  text-align: center;
  padding: 12px;
}

.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  position: relative;
}

.checkbox-wrapper:hover {
  background: #f1f5f9;
}

.checkbox-wrapper.has-change::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: white;
}

.checkbox-input:checked + .checkbox-custom {
  background: #10b981;
  border-color: #10b981;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  width: 10px;
  height: 6px;
  border: 2px solid white;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg) translateY(-1px);
}

.checkbox-wrapper:hover .checkbox-custom {
  border-color: #94a3b8;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
}

.empty-state p {
  margin-top: 16px;
  color: #94a3b8;
  font-size: 14px;
}

/* Modal Styles */
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
  max-width: 600px;
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

select.form-control {
  cursor: pointer;
}

textarea.form-control {
  resize: vertical;
  font-family: inherit;
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

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
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
  cursor: pointer;
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

.btn-secondary, .btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-primary {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
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

.changes-panel {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
  z-index: 100;
  max-width: 600px;
  width: calc(100% - 48px);
}

.changes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.changes-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.changes-actions {
  display: flex;
  gap: 10px;
}

.btn-discard, .btn-save-changes {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-discard {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-discard:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-save-changes {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-save-changes:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-save-changes:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.btn-spinner.small {
  width: 14px;
  height: 14px;
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

.toast.info {
  background: #3b82f6;
  color: white;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translate(-50%, 100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translate(-50%, 100px);
  opacity: 0;
}

@media (max-width: 768px) {
  .matrix-manager {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .btn-save, .btn-refresh, .btn-add, .btn-add-role {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  .btn-save span, .btn-add span, .btn-add-role span {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .menu-column {
    min-width: 280px;
  }

  .changes-panel {
    bottom: 16px;
    width: calc(100% - 32px);
  }

  .changes-header {
    flex-direction: column;
    align-items: stretch;
  }

  .changes-actions {
    width: 100%;
  }

  .btn-discard, .btn-save-changes {
    flex: 1;
    justify-content: center;
  }
}
</style>