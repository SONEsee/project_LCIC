<template>
  <div class="sidebar-management">
    <div class="header">
      <h1 class="title">ຈັດການໜ້າຕ່າງລະບົບ</h1>
      <div class="action-buttons">
        <button @click="addParentItem" class="btn btn-primary">
          <span class="icon">+</span> ເພີ່ມໜ້າຕ່າງຫຼັກ
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="permission-table">
        <thead>
          <tr>
            <th class="menu-column">ໜ້າຕ່າງ / ໜ້າຕ່າງຍ່ອຍ</th>
            <th v-for="role in roles" :key="role.id" class="role-column">
              {{ role.name }}
            </th>
            <th class="action-column">ຈັດການ</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in sidebarTree" :key="item.id">
            <!-- Parent Item Row -->
            <tr class="parent-row">
              <td class="menu-cell">
                <div class="menu-item parent-item">
                  <span class="icon" v-if="item.icon">{{ item.icon }}</span>
                  <span class="name">{{ item.name }}</span>
                  <button 
                    v-if="item.sub_items && item.sub_items.length > 0"
                    @click="toggleExpand(item.id)"
                    class="expand-btn"
                  >
                    {{ expandedItems.has(item.id) ? '▼' : '▶' }}
                  </button>
                </div>
              </td>
              <td v-for="role in roles" :key="`parent-${item.id}-${role.id}`" class="checkbox-cell">
                <input
                  type="checkbox"
                  :checked="item.roles.includes(role.id)"
                  @change="updateItemRoles(item, role.id, 'sidebar_item')"
                  class="checkbox"
                />
              </td>
              <td class="action-cell">
                <button @click="addSubItem(item)" class="btn btn-sm btn-add" title="ເພີ່ມໜ້າຕ່າງຍ່ອຍ">
                  <span class="icon">+</span>
                </button>
                <button @click="editItem(item, 'sidebar_item')" class="btn btn-sm btn-edit">
                  ແກ້ໄຂ
                </button>
                <button @click="deleteItem(item.id, 'sidebar_item')" class="btn btn-sm btn-delete">
                  ລຶບ
                </button>
              </td>
            </tr>

            <!-- Sub Items Rows -->
            <template v-if="expandedItems.has(item.id) && item.sub_items">
              <tr 
                v-for="subItem in item.sub_items" 
                :key="`sub-${subItem.id}`" 
                class="sub-row"
              >
                <td class="menu-cell">
                  <div class="menu-item sub-item">
                    <span class="indent">└─</span>
                    <span class="name">{{ subItem.name }}</span>
                  </div>
                </td>
                <td v-for="role in roles" :key="`sub-${subItem.id}-${role.id}`" class="checkbox-cell">
                  <input
                    type="checkbox"
                    :checked="subItem.roles.includes(role.id)"
                    @change="updateItemRoles(subItem, role.id, 'sidebar_sub_item', item.id)"
                    class="checkbox"
                  />
                </td>
                <td class="action-cell">
                  <button @click="editItem(subItem, 'sidebar_sub_item', item.id)" class="btn btn-sm btn-edit">
                    ແກ້ໄຂ
                  </button>
                  <button @click="deleteItem(subItem.id, 'sidebar_sub_item')" class="btn btn-sm btn-delete">
                    ລຶບ
                  </button>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

const API_BASE = "http://192.168.45.56:8000/api";

interface Role {
  id: number;
  name: string;
  name_lao?: string;
}

interface SubItem {
  id: number;
  name: string;
  url: string;
  parent: number;
  roles: number[];
}

interface SidebarItem {
  id: number;
  name: string;
  url: string;
  icon?: string;
  roles: number[];
  sub_items: SubItem[];
}

const roles = ref<Role[]>([]);
const sidebarItems = ref<SidebarItem[]>([]);
const expandedItems = ref(new Set<number>());

const sidebarTree = computed(() => sidebarItems.value);

const fetchData = async () => {
  try {
    const [rolesRes, itemsRes] = await Promise.all([
      axios.get(`${API_BASE}/roles/`),
      axios.get(`${API_BASE}/sidebar-items/`)
    ]);
    
    roles.value = rolesRes.data;
    sidebarItems.value = itemsRes.data;
    
    // Auto-expand items with sub-items
    sidebarItems.value.forEach(item => {
      if (item.sub_items && item.sub_items.length > 0) {
        expandedItems.value.add(item.id);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire("Error", "Failed to load data", "error");
  }
};

const toggleExpand = (itemId: number) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};

const updateItemRoles = async (item: any, roleId: number, itemType: string, parentId?: number) => {
  const isChecked = item.roles.includes(roleId);
  const updatedRoles = isChecked 
    ? item.roles.filter((id: number) => id !== roleId)
    : [...item.roles, roleId];
  
  const payload: any = {
    item_type: itemType,
    name: item.name,
    url: item.url,
    roles: updatedRoles
  };
  
  if (itemType === 'sidebar_item') {
    payload.icon = item.icon || '';
  } else {
    payload.parent = parentId || item.parent;
  }
  
  try {
    await axios.put(`${API_BASE}/create_sidebar/${item.id}/`, payload);
    item.roles = updatedRoles;
  } catch (error) {
    console.error("Error updating roles:", error);
    Swal.fire("Error", "Failed to update permissions", "error");
  }
};

const addParentItem = async () => {
  const { value: formValues } = await Swal.fire({
    title: "ເພີ່ມໜ້າຕ່າງຫຼັກ",
    html: `
      <div class="form-group">
        <label>ຊື່ໜ້າຕ່າງ</label>
        <input id="name" type="text" class="swal2-input" placeholder="ຊື່ໜ້າຕ່າງ">
      </div>
      <div class="form-group">
        <label>Icon</label>
        <input id="icon" type="text" class="swal2-input" placeholder="mdi-home">
      </div>
      <div class="form-group">
        <label>URL</label>
        <input id="url" type="text" class="swal2-input" placeholder="/dashboard">
      </div>
      <div class="form-group">
        <label>ສິດທິ (ເລືອກ Role IDs)</label>
        <input id="roles" type="text" class="swal2-input" placeholder="1,2,3">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const icon = (document.getElementById("icon") as HTMLInputElement).value;
      const url = (document.getElementById("url") as HTMLInputElement).value;
      const rolesInput = (document.getElementById("roles") as HTMLInputElement).value;
      
      if (!name || !url) {
        Swal.showValidationMessage("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ");
        return null;
      }
      
      const rolesList = rolesInput.split(",").map(r => parseInt(r.trim())).filter(r => !isNaN(r));
      return { name, icon, url, roles: rolesList };
    }
  });
  
  if (formValues) {
    try {
      const response = await axios.post(`${API_BASE}/create_sidebar/`, {
        item_type: "sidebar_item",
        ...formValues
      });
      sidebarItems.value.push(response.data);
      Swal.fire("ສຳເລັດ", "ເພີ່ມໜ້າຕ່າງສຳເລັດແລ້ວ", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add item", "error");
    }
  }
};

const addSubItem = async (parent: SidebarItem) => {
  const { value: formValues } = await Swal.fire({
    title: `ເພີ່ມໜ້າຕ່າງຍ່ອຍໃຫ້: ${parent.name}`,
    html: `
      <div class="form-group">
        <label>ຊື່ໜ້າຕ່າງຍ່ອຍ</label>
        <input id="name" type="text" class="swal2-input" placeholder="ຊື່ໜ້າຕ່າງຍ່ອຍ">
      </div>
      <div class="form-group">
        <label>URL</label>
        <input id="url" type="text" class="swal2-input" placeholder="/dashboard/reports">
      </div>
      <div class="form-group">
        <label>ສິດທິ (ເລືອກ Role IDs)</label>
        <input id="roles" type="text" class="swal2-input" placeholder="1,2,3">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const url = (document.getElementById("url") as HTMLInputElement).value;
      const rolesInput = (document.getElementById("roles") as HTMLInputElement).value;
      
      if (!name || !url) {
        Swal.showValidationMessage("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ");
        return null;
      }
      
      const rolesList = rolesInput.split(",").map(r => parseInt(r.trim())).filter(r => !isNaN(r));
      return { name, url, roles: rolesList };
    }
  });
  
  if (formValues) {
    try {
      const response = await axios.post(`${API_BASE}/create_sidebar/`, {
        item_type: "sidebar_sub_item",
        parent: parent.id,
        ...formValues
      });
      
      if (!parent.sub_items) parent.sub_items = [];
      parent.sub_items.push(response.data);
      expandedItems.value.add(parent.id);
      
      Swal.fire("ສຳເລັດ", "ເພີ່ມໜ້າຕ່າງຍ່ອຍສຳເລັດແລ້ວ", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add sub-item", "error");
    }
  }
};

const editItem = async (item: any, itemType: string, parentId?: number) => {
  const isSubItem = itemType === 'sidebar_sub_item';
  
  const { value: formValues } = await Swal.fire({
    title: "ແກ້ໄຂໜ້າຕ່າງ",
    html: `
      <div class="form-group">
        <label>ຊື່</label>
        <input id="name" type="text" class="swal2-input" value="${item.name}">
      </div>
      ${!isSubItem ? `
      <div class="form-group">
        <label>Icon</label>
        <input id="icon" type="text" class="swal2-input" value="${item.icon || ''}">
      </div>
      ` : ''}
      <div class="form-group">
        <label>URL</label>
        <input id="url" type="text" class="swal2-input" value="${item.url}">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const url = (document.getElementById("url") as HTMLInputElement).value;
      const icon = !isSubItem ? (document.getElementById("icon") as HTMLInputElement)?.value : null;
      
      if (!name || !url) {
        Swal.showValidationMessage("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ");
        return null;
      }
      
      return { name, url, icon };
    }
  });
  
  if (formValues) {
    try {
      const payload: any = {
        item_type: itemType,
        name: formValues.name,
        url: formValues.url,
        roles: item.roles
      };
      
      if (!isSubItem) {
        payload.icon = formValues.icon || '';
      } else {
        payload.parent = parentId || item.parent;
      }
      
      await axios.put(`${API_BASE}/create_sidebar/${item.id}/`, payload);
      Object.assign(item, formValues);
      Swal.fire("ສຳເລັດ", "ອັບເດດສຳເລັດແລ້ວ", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update", "error");
    }
  }
};

const deleteItem = async (id: number, itemType: string) => {
  const result = await Swal.fire({
    title: "ຢືນຢັນການລຶບ?",
    text: "ທ່ານຈະບໍ່ສາມາດກູ້ຄືນໄດ້!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ລຶບ",
    cancelButtonText: "ຍົກເລີກ",
    confirmButtonColor: "#e74c3c"
  });
  
  if (result.isConfirmed) {
    try {
      await axios.delete(`${API_BASE}/create_sidebar/${id}/?item_type=${itemType}`);
      
      if (itemType === 'sidebar_item') {
        sidebarItems.value = sidebarItems.value.filter(item => item.id !== id);
      } else {
        sidebarItems.value.forEach(item => {
          if (item.sub_items) {
            item.sub_items = item.sub_items.filter(sub => sub.id !== id);
          }
        });
      }
      
      Swal.fire("ລຶບແລ້ວ!", "ລຶບຂໍ້ມູນສຳເລັດແລ້ວ", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  }
};

onMounted(fetchData);
</script>

<style scoped>
.sidebar-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-add {
  background: #10b981;
  color: white;
}

.btn-add:hover {
  background: #059669;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.permission-table {
  width: 100%;
  border-collapse: collapse;
}

.permission-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.permission-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-column {
  min-width: 300px;
}

.role-column {
  text-align: center;
  min-width: 120px;
}

.action-column {
  min-width: 200px;
  text-align: center;
}

.permission-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.parent-row:hover {
  background: #f0f9ff;
}

.sub-row {
  background: #f9fafb;
}

.sub-row:hover {
  background: #f3f4f6;
}

.permission-table td {
  padding: 12px 16px;
}

.menu-cell {
  font-weight: 500;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.parent-item {
  font-size: 15px;
  color: #1f2937;
}

.sub-item {
  font-size: 14px;
  color: #6b7280;
  padding-left: 12px;
}

.indent {
  color: #9ca3af;
  margin-right: 4px;
}

.expand-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  font-size: 12px;
}

.expand-btn:hover {
  color: #374151;
}

.checkbox-cell {
  text-align: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.action-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.icon {
  font-size: 16px;
}

/* SweetAlert2 Custom Styles */
:deep(.swal2-popup) {
  border-radius: 12px;
  padding: 24px;
}

:deep(.form-group) {
  margin-bottom: 16px;
  text-align: left;
}

:deep(.form-group label) {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

:deep(.swal2-input) {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

:deep(.swal2-input:focus) {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>