<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSidebar } from "./sidebarItems"; 

interface SubItem {
  id: number;
  name: string;
  url: string;
  roles: number[];
}

interface SidebarItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  roles: number[];
  sub_items?: SubItem[];
}

interface User {
  username: string;
  GID: { GID: number }; 
}

const user = ref<User | null>(null);
const sidebarItems = ref<SidebarItem[]>([]); 
const expandedItems = ref<Set<number>>(new Set());

// Load user data
onMounted(() => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

// Fetch sidebar items
onMounted(async () => {
  const fetchedItems = await useSidebar(); 
  sidebarItems.value = fetchedItems.value || [];
  
  // Auto-expand items that have accessible sub-items
  if (user.value?.GID) {
    const userGID = user.value.GID.GID;
    sidebarItems.value.forEach(item => {
      if (item.sub_items && hasAccessibleSubItems(item, userGID)) {
        expandedItems.value.add(item.id);
      }
    });
  }
});

// Check if user has access to any sub-items
const hasAccessibleSubItems = (item: SidebarItem, userGID: number): boolean => {
  if (!item.sub_items || item.sub_items.length === 0) return false;
  return item.sub_items.some(subItem => subItem.roles.includes(userGID));
};

// Filter items based on user role
const filteredSidebarItems = computed(() => {
  if (!user.value || !user.value.GID) return [];
  const userGID = user.value.GID.GID;
  
  return sidebarItems.value
    .filter(item => item.roles.includes(userGID))
    .map(item => ({
      ...item,
      sub_items: item.sub_items?.filter(subItem => subItem.roles.includes(userGID)) || []
    }));
});

// Toggle expand/collapse for items with sub-items
const toggleExpand = (itemId: number) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};

// Check if item is expanded
const isExpanded = (itemId: number) => {
  return expandedItems.value.has(itemId);
};

// Check if route is active (for parent or sub-items)
const isRouteActive = (item: SidebarItem) => {
  const currentPath = useRoute().path;
  if (currentPath === item.url) return true;
  if (item.sub_items) {
    return item.sub_items.some(subItem => currentPath === subItem.url);
  }
  return false;
};

// Check if current route matches
const isCurrentRoute = (url: string) => {
  return useRoute().path === url;
};
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-content">
      <div class="profile-section">
        <!-- Profile content here -->
      </div>
      
      <nav class="sidebar-nav">
        <template v-if="filteredSidebarItems.length > 0">
          <div 
            v-for="item in filteredSidebarItems" 
            :key="item.id"
            class="nav-group"
          >
            
            <!-- Parent Item WITHOUT Sub-items -->
            <template v-if="!item.sub_items || item.sub_items.length === 0">
              <NuxtLink
                :to="item.url"
                class="nav-item"
                :class="{ 'nav-item-active': isCurrentRoute(item.url) }"
              >
                <div class="nav-item-content">
                  <v-icon :icon="item.icon" class="nav-icon"></v-icon>
                  <span class="nav-label">{{ $t(item.name) }}</span>
                </div>
              </NuxtLink>
            </template>

            <!-- Parent Item WITH Sub-items -->
            <template v-else>
              <div class="nav-group-wrapper">
                <!-- Parent Header -->
                <div
                  class="nav-item nav-item-parent"
                  :class="{ 
                    'nav-item-expanded': isExpanded(item.id),
                    'nav-item-has-active': isRouteActive(item) 
                  }"
                  @click="toggleExpand(item.id)"
                >
                  <div class="nav-item-content">
                    <v-icon :icon="item.icon" class="nav-icon"></v-icon>
                    <span class="nav-label">{{ $t(item.name) }}</span>
                  </div>
                  <v-icon 
                    :icon="isExpanded(item.id) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                    class="nav-expand-icon"
                  ></v-icon>
                </div>

                <!-- Sub-items -->
                <transition name="expand">
                  <div v-show="isExpanded(item.id)" class="nav-subitems">
                    <NuxtLink
                      v-for="subItem in item.sub_items"
                      :key="subItem.id"
                      :to="subItem.url"
                      class="nav-subitem"
                      :class="{ 'nav-subitem-active': isCurrentRoute(subItem.url) }"
                    >
                      <div class="nav-subitem-content">
                        <div class="nav-subitem-indicator"></div>
                        <span class="nav-sublabel">{{ $t(subItem.name) }}</span>
                      </div>
                    </NuxtLink>
                  </div>
                </transition>
              </div>
            </template>

          </div>
        </template>

        <!-- No items available -->
        <div v-else class="no-items">
          <v-icon icon="mdi-information-outline" class="no-items-icon"></v-icon>
          <span>No items available</span>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.sidebar-container {
  height: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e5e7eb;
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.profile-section {
  flex-shrink: 0;
  padding: 16px;
  border-bottom: 1px solid #f1f3f5;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 8px;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-group-wrapper {
  position: relative;
}

/* Nav Item (Parent) */
.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  margin-bottom: 2px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-decoration: none;
  color: #64748b;
  font-size: 15px; /* increased from 13px */
  font-weight: 500;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, #003ab6 0%, #337afd 100%);
  border-radius: 0 4px 4px 0;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: #f1f5f9;
  color: #475569;
  transform: translateX(2px);
}

.nav-item:hover::before {
  height: 60%;
}

.nav-item-parent {
  color: #475569;
}

.nav-item-expanded {
  background: #f8fafc;
  color: #334155;
}

.nav-item-has-active {
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
  color: #0026ce;
  font-weight: 600;
}

.nav-item-active {
  background: linear-gradient(135deg, #1e7efc 0%, #00259e 100%);
  color: white !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.nav-item-active::before {
  height: 0;
}

.nav-item-active:hover {
  transform: translateX(0);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

/* Icons */
.nav-icon {
  font-size: 18px !important;
  color: inherit;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.nav-item-active .nav-icon {
  color: white;
  transform: scale(1.05);
}

.nav-expand-icon {
  font-size: 16px !important;
  color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.nav-item-expanded .nav-expand-icon {
  transform: rotate(0deg);
  color: #0022b8;
}

.nav-item:not(.nav-item-expanded) .nav-expand-icon {
  transform: rotate(0deg);
}

/* Labels */
.nav-label {
  font-size: 15px; /* increased from 13px */
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.25s ease;
}

.nav-item-active .nav-label {
  color: white;
  font-weight: 600;
}

.nav-sublabel {
  font-size: 14px; /* increased from 12px */
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.25s ease;
}

/* Sub-items Container */
.nav-subitems {
  margin-top: 2px;
  margin-left: 8px;
  padding-left: 20px;
  border-left: 2px solid #e5e7eb;
  overflow: hidden;
}

/* Sub-item */
.nav-subitem {
  display: block;
  padding: 7px 12px;
  margin-bottom: 1px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: #64748b;
  position: relative;
}

.nav-subitem:hover {
  background: #f8fafc;
  color: #475569;
  transform: translateX(4px);
}

.nav-subitem-active {
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
  color: #667eea !important;
  font-weight: 600;
}

.nav-subitem-active .nav-subitem-indicator {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  transform: scale(1.2);
}

.nav-subitem-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-subitem-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.nav-subitem:hover .nav-subitem-indicator {
  background: #94a3b8;
  transform: scale(1.3);
}

.nav-sublabel {
  font-size: 14px; /* increased from 12px */
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.25s ease;
}

.nav-subitem-active .nav-sublabel {
  font-weight: 600;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.expand-enter-from {
  opacity: 0;
  transform: scaleY(0.9);
  max-height: 0;
}

.expand-enter-to {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}

.expand-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}

.expand-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
  max-height: 0;
}

/* No Items */
.no-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
  gap: 8px;
}

.no-items-icon {
  font-size: 32px !important;
  color: #cbd5e1;
  margin-bottom: 4px;
}

/* Custom Scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 5px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Smooth scroll behavior */
.sidebar-nav {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
.nav-item:focus-visible,
.nav-subitem:focus-visible {
  outline: 2px solid #2f88fd;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-label,
  .nav-sublabel {
    font-size: 13px; /* scaled down slightly for smaller screens */
  }
  
  .nav-icon {
    font-size: 16px !important;
  }
  
  .nav-item {
    padding: 8px 10px;
  }
  
  .nav-subitem {
    padding: 6px 10px;
  }
}

/* Animations for better UX */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-group {
  animation: slideIn 0.3s ease-out;
  animation-fill-mode: both;
}

.nav-group:nth-child(1) { animation-delay: 0.05s; }
.nav-group:nth-child(2) { animation-delay: 0.1s; }
.nav-group:nth-child(3) { animation-delay: 0.15s; }
.nav-group:nth-child(4) { animation-delay: 0.2s; }
.nav-group:nth-child(5) { animation-delay: 0.25s; }
.nav-group:nth-child(6) { animation-delay: 0.3s; }
</style>