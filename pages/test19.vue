<template>
  <div class="sidebar-manager">
    <!-- Header -->
    <div class="header">
      <h2>Sidebar Management</h2>
      <button @click="showCreateModal = true" class="btn-primary">
        <i class="icon-plus"></i> Add Item
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'items' }]" 
        @click="activeTab = 'items'"
      >
        Main Items
      </button>
      <button 
        :class="['tab', { active: activeTab === 'subitems' }]" 
        @click="activeTab = 'subitems'"
      >
        Sub Items
      </button>
      <button 
        :class="['tab', { active: activeTab === 'roles' }]" 
        @click="activeTab = 'roles'"
      >
        Assign Roles
      </button>
    </div>

    <!-- Main Items Tab -->
    <div v-if="activeTab === 'items'" class="content">
      <div class="list-container">
        <draggable 
          v-model="sidebarItems" 
          @end="onDragEnd('sidebar_item')"
          handle=".drag-handle"
          class="item-list"
        >
          <div 
            v-for="item in sidebarItems" 
            :key="item.id"
            class="item-card"
          >
            <div class="drag-handle">
              <i class="icon-menu"></i>
            </div>
            <div class="item-content">
              <div class="item-info">
                <i :class="item.icon" class="item-icon"></i>
                <span class="item-title">{{ item.title }}</span>
                <span class="item-order">Order: {{ item.order }}</span>
                <span :class="['status', item.is_active ? 'active' : 'inactive']">
                  {{ item.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="item-actions">
                <button @click="editItem(item, 'sidebar_item')" class="btn-icon" title="Edit">
                  <i class="icon-edit"></i>
                </button>
                <button @click="deleteItem(item.id, 'sidebar_item')" class="btn-icon danger" title="Delete">
                  <i class="icon-delete"></i>
                </button>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <!-- Sub Items Tab -->
    <div v-if="activeTab === 'subitems'" class="content">
      <div class="list-container">
        <draggable 
          v-model="sidebarSubItems" 
          @end="onDragEnd('sidebar_sub_item')"
          handle=".drag-handle"
          class="item-list"
        >
          <div 
            v-for="item in sidebarSubItems" 
            :key="item.id"
            class="item-card"
          >
            <div class="drag-handle">
              <i class="icon-menu"></i>
            </div>
            <div class="item-content">
              <div class="item-info">
                <i :class="item.icon" class="item-icon"></i>
                <div class="item-details">
                  <span class="item-title">{{ item.title }}</span>
                  <span class="parent-info">Parent: {{ item.parent_title }}</span>
                </div>
                <span class="item-order">Order: {{ item.order }}</span>
                <span :class="['status', item.is_active ? 'active' : 'inactive']">
                  {{ item.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="item-actions">
                <button @click="editItem(item, 'sidebar_sub_item')" class="btn-icon" title="Edit">
                  <i class="icon-edit"></i>
                </button>
                <button @click="deleteItem(item.id, 'sidebar_sub_item')" class="btn-icon danger" title="Delete">
                  <i class="icon-delete"></i>
                </button>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <!-- Role Assignment Tab -->
    <div v-if="activeTab === 'roles'" class="content">
      <div class="role-assignment">
        <div class="form-group">
          <label>Select Role</label>
          <select v-model="selectedRole" class="form-control">
            <option value="">-- Select Role --</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Main Items</label>
          <div class="checkbox-list">
            <label v-for="item in sidebarItems" :key="item.id" class="checkbox-item">
              <input 
                type="checkbox" 
                :value="item.id" 
                v-model="selectedMainItems"
              />
              <span>{{ item.title }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Sub Items</label>
          <div class="checkbox-list">
            <label v-for="item in sidebarSubItems" :key="item.id" class="checkbox-item">
              <input 
                type="checkbox" 
                :value="item.id" 
                v-model="selectedSubItems"
              />
              <span>{{ item.parent_title }} > {{ item.title }}</span>
            </label>
          </div>
        </div>

        <button @click="assignRole" class="btn-primary" :disabled="!selectedRole">
          Assign Role
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingItem ? 'Edit' : 'Create' }} {{ modalType === 'sidebar_item' ? 'Main Item' : 'Sub Item' }}</h3>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Type</label>
            <select v-model="modalType" class="form-control" :disabled="editingItem">
              <option value="sidebar_item">Main Item</option>
              <option value="sidebar_sub_item">Sub Item</option>
            </select>
          </div>

          <div v-if="modalType === 'sidebar_sub_item'" class="form-group">
            <label>Parent Item *</label>
            <select v-model="formData.parent" class="form-control" required>
              <option value="">-- Select Parent --</option>
              <option v-for="item in sidebarItems" :key="item.id" :value="item.id">
                {{ item.title }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Title *</label>
            <input v-model="formData.title" type="text" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Icon (CSS class)</label>
            <input v-model="formData.icon" type="text" class="form-control" placeholder="icon-home" />
          </div>

          <div class="form-group">
            <label>Route</label>
            <input v-model="formData.route" type="text" class="form-control" placeholder="/dashboard" />
          </div>

          <div class="form-group">
            <label>Order *</label>
            <input v-model.number="formData.order" type="number" class="form-control" min="0" required />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.is_active" type="checkbox" />
              <span>Active</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancel</button>
          <button @click="saveItem" class="btn-primary">
            {{ editingItem ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import axios from 'axios';

export default {
  name: 'SidebarManager',
  components: {
    draggable
  },
  data() {
    return {
      activeTab: 'items',
      sidebarItems: [],
      sidebarSubItems: [],
      roles: [],
      selectedRole: '',
      selectedMainItems: [],
      selectedSubItems: [],
      showCreateModal: false,
      modalType: 'sidebar_item',
      editingItem: null,
      formData: {
        title: '',
        icon: '',
        route: '',
        order: 0,
        parent: '',
        is_active: true
      },
      loading: false
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const [items, subItems, roles] = await Promise.all([
          axios.get('/api/sidebar-items/'),
          axios.get('/api/sidebar-sub-items/'),
          axios.get('/api/roles/')
        ]);
        
        this.sidebarItems = items.data;
        this.sidebarSubItems = subItems.data;
        this.roles = roles.data;
      } catch (error) {
        this.showError('Failed to load data');
      } finally {
        this.loading = false;
      }
    },

    async onDragEnd(itemType) {
      const items = itemType === 'sidebar_item' ? this.sidebarItems : this.sidebarSubItems;
      const itemsOrder = items.map((item, index) => ({
        id: item.id,
        order: index
      }));

      try {
        await axios.post('/api/reorder/', {
          item_type: itemType,
          items_order: itemsOrder
        });
        this.showSuccess('Order updated successfully');
        await this.loadData();
      } catch (error) {
        this.showError('Failed to update order');
      }
    },

    editItem(item, type) {
      this.editingItem = item;
      this.modalType = type;
      this.formData = {
        title: item.title,
        icon: item.icon || '',
        route: item.route || '',
        order: item.order,
        parent: item.parent || '',
        is_active: item.is_active
      };
      this.showCreateModal = true;
    },

    async saveItem() {
      const data = {
        ...this.formData,
        item_type: this.modalType
      };

      try {
        if (this.editingItem) {
          await axios.put(`/api/create_sidebar/${this.editingItem.id}/`, data);
          this.showSuccess('Item updated successfully');
        } else {
          await axios.post('/api/create_sidebar/', data);
          this.showSuccess('Item created successfully');
        }
        await this.loadData();
        this.closeModal();
      } catch (error) {
        this.showError('Failed to save item');
      }
    },

    async deleteItem(id, itemType) {
      if (!confirm('Are you sure you want to delete this item?')) return;

      try {
        await axios.delete(`/api/create_sidebar/${id}/?item_type=${itemType}`);
        this.showSuccess('Item deleted successfully');
        await this.loadData();
      } catch (error) {
        this.showError('Failed to delete item');
      }
    },

    async assignRole() {
      try {
        await axios.post('/api/assign-role/', {
          role_id: this.selectedRole,
          sidebar_items: this.selectedMainItems,
          sidebar_sub_items: this.selectedSubItems
        });
        this.showSuccess('Role assigned successfully');
        this.selectedMainItems = [];
        this.selectedSubItems = [];
      } catch (error) {
        this.showError('Failed to assign role');
      }
    },

    closeModal() {
      this.showCreateModal = false;
      this.editingItem = null;
      this.formData = {
        title: '',
        icon: '',
        route: '',
        order: 0,
        parent: '',
        is_active: true
      };
    },

    showSuccess(message) {
      alert(message); // Replace with your toast/notification system
    },

    showError(message) {
      alert(message); // Replace with your toast/notification system
    }
  }
};
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
  display: flex;
  gap: 12px;
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

.drag-handle {
  display: flex;
  align-items: center;
  cursor: grab;
  color: #9ca3af;
  padding: 4px;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-content {
  flex: 1;
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
  font-size: 18px;
  color: #6b7280;
}

.item-title {
  font-weight: 500;
  color: #1a1a1a;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.parent-info {
  font-size: 12px;
  color: #6b7280;
}

.item-order {
  font-size: 13px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
}

.status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
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
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f3f4f6;
  border-color: #2563eb;
  color: #2563eb;
}

.btn-icon.danger:hover {
  background: #fee2e2;
  border-color: #dc2626;
  color: #dc2626;
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
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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

.role-assignment {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
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
</style>