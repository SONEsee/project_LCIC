<template>
  <div class="sidebar-management">
    <div class="header">
      <h1 class="title">ຈັດການໜ້າຕ່າງລະບົບ</h1>
      <div class="action-buttons">
        <button @click="addParentItem" class="btn btn-primary">
          <i class="mdi mdi-plus-circle"></i>
          <span>ເພີ່ມໜ້າຕ່າງຫຼັກ</span>
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
                  <i v-if="item.icon" :class="`mdi ${item.icon}`" class="menu-icon"></i>
                  <i v-else class="mdi mdi-folder menu-icon"></i>
                  <span class="name">{{ item.name }}</span>
                  <button 
                    v-if="item.sub_items && item.sub_items.length > 0"
                    @click="toggleExpand(item.id)"
                    class="expand-btn"
                  >
                    <i :class="expandedItems.has(item.id) ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-right'"></i>
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
                <button @click="addSubItem(item)" class="btn-icon btn-add" title="ເພີ່ມໜ້າຕ່າງຍ່ອຍ">
                  <i class="mdi mdi-plus"></i>
                </button>
                <button @click="editItem(item, 'sidebar_item')" class="btn-icon btn-edit" title="ແກ້ໄຂ">
                  <i class="mdi mdi-pencil"></i>
                </button>
                <button @click="deleteItem(item.id, 'sidebar_item')" class="btn-icon btn-delete" title="ລຶບ">
                  <i class="mdi mdi-delete"></i>
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
                    <i class="mdi mdi-subdirectory-arrow-right indent-icon"></i>
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
                  <button @click="editItem(subItem, 'sidebar_sub_item', item.id)" class="btn-icon btn-edit" title="ແກ້ໄຂ">
                    <i class="mdi mdi-pencil"></i>
                  </button>
                  <button @click="deleteItem(subItem.id, 'sidebar_sub_item')" class="btn-icon btn-delete" title="ລຶບ">
                    <i class="mdi mdi-delete"></i>
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

// const apiUrl = "http://192.168.45.56:8000/"; 
const config = useRuntimeConfig();
const apiUrl = config.public.strapi.url;


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
      axios.get(`${apiUrl}api/roles/`),
      axios.get(`${apiUrl}api/sidebar-items/`)
    ]);
    console.log("API Endpoint for roles:", `${apiUrl}api/roles/`);
    console.log("API Endpoint for sidebar items:", `${apiUrl}api/sidebar-items/`);
    roles.value = rolesRes.data;
    sidebarItems.value = itemsRes.data;
    
    sidebarItems.value.forEach(item => {
      if (item.sub_items && item.sub_items.length > 0) {
        expandedItems.value.add(item.id);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້"
    });
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
    await axios.put(`${apiUrl}api/create_sidebar/${item.id}/`, payload);
    item.roles = updatedRoles;
  } catch (error) {
    console.error("Error updating roles:", error);
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດອັບເດດສິດທິໄດ້"
    });
  }
};

const addParentItem = async () => {
  const { value: formValues } = await Swal.fire({
    title: '<div class="dialog-header"><i class="mdi mdi-folder-plus"></i><span>ເພີ່ມໜ້າຕ່າງຫຼັກ</span></div>',
    html: `
      <div class="modern-form">
        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-format-title"></i>
            <span>ຊື່ໜ້າຕ່າງ</span>
          </label>
          <input id="name" type="text" class="form-input" placeholder="ກະລຸນາປ້ອນຊື່ໜ້າຕ່າງ">
        </div>
        
        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-image-area"></i>
            <span>Icon</span>
          </label>
          <div class="input-with-hint">
            <input id="icon" type="text" class="form-input" placeholder="mdi-home, mdi-view-dashboard">
            <small class="form-hint">
              <i class="mdi mdi-information-outline"></i>
              ຊອກຫາ Icon: <a href="https://materialdesignicons.com/" target="_blank">Material Design Icons</a>
            </small>
          </div>
        </div>
        
        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-link-variant"></i>
            <span>URL Path</span>
          </label>
          <input id="url" type="text" class="form-input" placeholder="/dashboard">
        </div>
        
        <div class="form-row roles-row">
          <label class="form-label">
            <i class="mdi mdi-shield-account"></i>
            <span>ສິດທິການເຂົ້າເຖິງ</span>
          </label>
          <div class="roles-checkboxes">
            ${roles.value.map(role => `
              <label class="role-checkbox">
                <input type="checkbox" value="${role.id}" class="role-check">
                <span>${role.name}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    width: '700px',
    showCancelButton: true,
    confirmButtonText: '<i class="mdi mdi-check-circle"></i> ບັນທຶກ',
    cancelButtonText: '<i class="mdi mdi-close-circle"></i> ຍົກເລີກ',
    customClass: {
      popup: 'modern-popup',
      confirmButton: 'modern-confirm-btn',
      cancelButton: 'modern-cancel-btn'
    },
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value.trim();
      const icon = (document.getElementById("icon") as HTMLInputElement).value.trim();
      const url = (document.getElementById("url") as HTMLInputElement).value.trim();
      const roleChecks = document.querySelectorAll('.role-check:checked');
      const rolesList = Array.from(roleChecks).map(check => parseInt((check as HTMLInputElement).value));
      
      if (!name || !url) {
        Swal.showValidationMessage('<i class="mdi mdi-alert-circle"></i> ກະລຸນາປ້ອນຊື່ໜ້າຕ່າງ ແລະ URL ໃຫ້ຄົບຖ້ວນ');
        return null;
      }
      
      if (rolesList.length === 0) {
        Swal.showValidationMessage('<i class="mdi mdi-alert-circle"></i> ກະລຸນາເລືອກສິດທິຢ່າງໜ້ອຍ 1 ສິດທິ');
        return null;
      }
      
      return { name, icon, url, roles: rolesList };
    }
  });
  
  if (formValues) {
    try {
      const response = await axios.post(`${apiUrl}api/create_sidebar/`, {
        item_type: "sidebar_item",
        ...formValues
      });
      sidebarItems.value.push(response.data);
      Swal.fire({
        icon: "success",
        title: "ສຳເລັດ!",
        text: "ເພີ່ມໜ້າຕ່າງສຳເລັດແລ້ວ",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ເກີດຂໍ້ຜິດພາດ",
        text: "ບໍ່ສາມາດເພີ່ມໜ້າຕ່າງໄດ້"
      });
    }
  }
};

const addSubItem = async (parent: SidebarItem) => {
  const { value: formValues } = await Swal.fire({
    title: '<div class="dialog-header"><i class="mdi mdi-file-tree"></i><span>ເພີ່ມໜ້າຕ່າງຍ່ອຍ</span></div>',
    html: `
      <div class="modern-form">
        <div class="parent-info">
          <i class="mdi ${parent.icon || 'mdi-folder'}"></i>
          <div class="parent-details">
            <span class="parent-label">ໜ້າຕ່າງຫຼັກ</span>
            <strong>${parent.name}</strong>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-format-title"></i>
            <span>ຊື່ໜ້າຕ່າງຍ່ອຍ</span>
          </label>
          <input id="name" type="text" class="form-input" placeholder="ກະລຸນາປ້ອນຊື່ໜ້າຕ່າງຍ່ອຍ">
        </div>

        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-link-variant"></i>
            <span>URL Path</span>
          </label>
          <input id="url" type="text" class="form-input" placeholder="${parent.url}/sub-page">
        </div>

        <div class="form-row roles-row">
          <label class="form-label">
            <i class="mdi mdi-shield-account"></i>
            <span>ສິດທິການເຂົ້າເຖິງ</span>
          </label>
          <div class="roles-checkboxes">
            ${roles.value.map(role => `
              <label class="role-checkbox">
                <input type="checkbox" value="${role.id}" class="role-check" ${parent.roles.includes(role.id) ? 'checked' : ''}>
                <span>${role.name}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    width: '700px',
    showCancelButton: true,
    confirmButtonText: '<i class="mdi mdi-check-circle"></i> ບັນທຶກ',
    cancelButtonText: '<i class="mdi mdi-close-circle"></i> ຍົກເລີກ',
    customClass: {
      popup: 'modern-popup',
      confirmButton: 'modern-confirm-btn',
      cancelButton: 'modern-cancel-btn'
    },
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value.trim();
      const url = (document.getElementById("url") as HTMLInputElement).value.trim();
      const roleChecks = document.querySelectorAll('.role-check:checked');
      const rolesList = Array.from(roleChecks).map(check => parseInt((check as HTMLInputElement).value));
      
      if (!name || !url) {
        Swal.showValidationMessage('<i class="mdi mdi-alert-circle"></i> ກະລຸນາປ້ອນຊື່ ແລະ URL ໃຫ້ຄົບຖ້ວນ');
        return null;
      }
      
      if (rolesList.length === 0) {
        Swal.showValidationMessage('<i class="mdi mdi-alert-circle"></i> ກະລຸນາເລືອກສິດທິຢ່າງໜ້ອຍ 1 ສິດທິ');
        return null;
      }
      
      return { name, url, roles: rolesList };
    }
  });
  
  if (formValues) {
    try {
      const response = await axios.post(`${apiUrl}api/create_sidebar/`, {
        item_type: "sidebar_sub_item",
        parent: parent.id,
        ...formValues
      });
      
      if (!parent.sub_items) parent.sub_items = [];
      parent.sub_items.push(response.data);
      expandedItems.value.add(parent.id);
      
      Swal.fire({
        icon: "success",
        title: "ສຳເລັດ!",
        text: "ເພີ່ມໜ້າຕ່າງຍ່ອຍສຳເລັດແລ້ວ",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ເກີດຂໍ້ຜິດພາດ",
        text: "ບໍ່ສາມາດເພີ່ມໜ້າຕ່າງຍ່ອຍໄດ້"
      });
    }
  }
};

const editItem = async (item: any, itemType: string, parentId?: number) => {
  const isSubItem = itemType === 'sidebar_sub_item';
  
  const { value: formValues } = await Swal.fire({
    title: '<div class="dialog-header"><i class="mdi mdi-pencil-box"></i><span>ແກ້ໄຂໜ້າຕ່າງ</span></div>',
    html: `
      <div class="modern-form">
        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-format-title"></i>
            <span>ຊື່ໜ້າຕ່າງ</span>
          </label>
          <input id="name" type="text" class="form-input" value="${item.name}">
        </div>
        
        ${!isSubItem ? `
        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-image-area"></i>
            <span>Icon</span>
          </label>
          <div class="input-with-hint">
            <input id="icon" type="text" class="form-input" value="${item.icon || ''}" placeholder="mdi-home, mdi-cog">
            <small class="form-hint">
              <i class="mdi mdi-information-outline"></i>
              ຊອກຫາ Icon: <a href="https://materialdesignicons.com/" target="_blank">Material Design Icons</a>
            </small>
          </div>
        </div>
        ` : ''}
        
        <div class="form-row">
          <label class="form-label">
            <i class="mdi mdi-link-variant"></i>
            <span>URL Path</span>
          </label>
          <input id="url" type="text" class="form-input" value="${item.url}">
        </div>
      </div>
    `,
    width: '700px',
    showCancelButton: true,
    confirmButtonText: '<i class="mdi mdi-check-circle"></i> ບັນທຶກການປ່ຽນແປງ',
    cancelButtonText: '<i class="mdi mdi-close-circle"></i> ຍົກເລີກ',
    customClass: {
      popup: 'modern-popup',
      confirmButton: 'modern-confirm-btn',
      cancelButton: 'modern-cancel-btn'
    },
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value.trim();
      const url = (document.getElementById("url") as HTMLInputElement).value.trim();
      const icon = !isSubItem ? (document.getElementById("icon") as HTMLInputElement)?.value.trim() : null;
      
      if (!name || !url) {
        Swal.showValidationMessage('<i class="mdi mdi-alert-circle"></i> ກະລຸນາປ້ອນຊື່ ແລະ URL ໃຫ້ຄົບຖ້ວນ');
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
      
      await axios.put(`${apiUrl}api/create_sidebar/${item.id}/`, payload);
      Object.assign(item, formValues);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສຳເລັດ!",
        text: "ປ່ຽນແປງຖືກບັນທຶກແລ້ວ",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ເກີດຂໍ້ຜິດພາດ",
        text: "ບໍ່ສາມາດອັບເດດໄດ້"
      });
    }
  }
};

const deleteItem = async (id: number, itemType: string) => {
  const result = await Swal.fire({
    title: '<div class="dialog-header delete-header"><i class="mdi mdi-alert-circle-outline"></i><span>ຢືນຢັນການລຶບ</span></div>',
    html: '<p style="color: #6b7280; font-size: 15px; margin: 0; line-height: 1.6;">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການນີ້?<br><strong style="color: #ef4444;">ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້!</strong></p>',
    width: '500px',
    showCancelButton: true,
    confirmButtonText: '<i class="mdi mdi-delete-forever"></i> ລຶບຖາວອນ',
    cancelButtonText: '<i class="mdi mdi-close-circle"></i> ຍົກເລີກ',
    customClass: {
      popup: 'modern-popup',
      confirmButton: 'modern-delete-btn',
      cancelButton: 'modern-cancel-btn'
    }
  });
  
  if (result.isConfirmed) {
    try {
      await axios.delete(`${apiUrl}api/create_sidebar/${id}/?item_type=${itemType}`);
      
      if (itemType === 'sidebar_item') {
        sidebarItems.value = sidebarItems.value.filter(item => item.id !== id);
      } else {
        sidebarItems.value.forEach(item => {
          if (item.sub_items) {
            item.sub_items = item.sub_items.filter(sub => sub.id !== id);
          }
        });
      }
      
      Swal.fire({
        icon: "success",
        title: "ລຶບສຳເລັດ!",
        text: "ລາຍການຖືກລຶບອອກແລ້ວ",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ເກີດຂໍ້ຜິດພາດ",
        text: "ບໍ່ສາມາດລຶບລາຍການໄດ້"
      });
    }
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Import Material Design Icons */
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css');

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
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #0068ca 0%, #002ca3 100%);
  color: white;
  font-size: 15px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary i {
  font-size: 18px;
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
  background: linear-gradient(135deg, #001d9c 0%, #0050b9 100%);
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
  min-width: 180px;
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
  gap: 10px;
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

.menu-icon {
  font-size: 20px;
  color: #667eea;
}

.indent-icon {
  color: #9ca3af;
  font-size: 18px;
}

.expand-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  font-size: 16px;
  transition: color 0.2s;
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
  align-items: center;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-add {
  background: #10b981;
  color: white;
}

.btn-add:hover {
  background: #059669;
  transform: scale(1.1);
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Modern Dialog Styles - Using global styles for SweetAlert2 */
:global(.modern-popup) {
  border-radius: 20px !important;
  padding: 36px !important;
  box-shadow: 0 25px 80px rgba(0,0,0,0.25) !important;
}

/* Modern Dialog Styles - Using global styles for SweetAlert2 */
:global(.modern-popup) {
  border-radius: 20px !important;
  padding: 36px !important;
  box-shadow: 0 25px 80px rgba(0,0,0,0.25) !important;
}

:global(.modern-popup .swal2-title) {
  padding: 0 !important;
  margin: 0 0 32px 0 !important;
}

:global(.dialog-header) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

:global(.dialog-header i) {
  font-size: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:global(.dialog-header.delete-header i) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:global(.dialog-header span) {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
}

:global(.modern-form) {
  text-align: left;
  margin-top: 8px;
}

:global(.parent-info) {
  background: linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%);
  padding: 20px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

:global(.parent-info i) {
  font-size: 32px;
  color: #667eea;
  background: white;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

:global(.parent-details) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:global(.parent-label) {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

:global(.parent-details strong) {
  font-size: 16px;
  color: #1f2937;
}

:global(.form-row) {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

:global(.form-row.roles-row) {
  align-items: flex-start;
}

:global(.form-label) {
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #374151;
  font-size: 15px;
  padding-top: 12px;
  flex-shrink: 0;
}

:global(.form-label i) {
  color: #667eea;
  font-size: 20px;
}

:global(.input-with-hint) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:global(.form-input) {
  flex: 1;
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

:global(.form-input:focus) {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: #fafbff;
}

:global(.form-input::placeholder) {
  color: #9ca3af;
}

:global(.form-hint) {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  padding-left: 2px;
}

:global(.form-hint i) {
  font-size: 16px;
  color: #9ca3af;
}

:global(.form-hint a) {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

:global(.form-hint a:hover) {
  text-decoration: underline;
}

:global(.roles-checkboxes) {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  padding: 18px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

:global(.role-checkbox) {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all 0.2s;
  background: white;
  border: 2px solid transparent;
}

:global(.role-checkbox:hover) {
  background: #f0f9ff;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

:global(.role-check) {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

:global(.role-checkbox span) {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

:global(.modern-confirm-btn) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border: none !important;
  padding: 14px 32px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

:global(.modern-confirm-btn:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4) !important;
}

:global(.modern-cancel-btn) {
  background: #f3f4f6 !important;
  color: #374151 !important;
  border: 2px solid #e5e7eb !important;
  padding: 14px 32px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

:global(.modern-cancel-btn:hover) {
  background: #e5e7eb !important;
  border-color: #d1d5db !important;
}

:global(.modern-delete-btn) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: white !important;
  border: none !important;
  padding: 14px 32px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
}

:global(.modern-delete-btn:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
}

:global(.swal2-validation-message) {
  background: #fef2f2 !important;
  color: #991b1b !important;
  border: 2px solid #fecaca !important;
  border-radius: 10px !important;
  padding: 12px 16px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

:global(.swal2-validation-message i) {
  margin-right: 8px;
}
</style>