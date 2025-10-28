import { useState } from "#app";

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
  sub_items: SubItem[];
  is_active: boolean;
}

/**
 * Main composable to fetch sidebar items
 * Caches results in state to avoid unnecessary API calls
 */
export const useSidebar = async () => {
  const config = useRuntimeConfig();
  const sidebarItems = useState<SidebarItem[]>("sidebarItems", () => []);

  // Only fetch if not already loaded
  if (!sidebarItems.value.length) {
    try {
      const response = await fetch(`${config.public.strapi.url}api/sidebar-items/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // API already returns correct structure, just ensure sub_items exists
      sidebarItems.value = (data || []).map((item: any) => ({
        ...item,
        sub_items: item.sub_items || []
      }));

      console.log("✅ Sidebar items loaded:", sidebarItems.value.length, "items");
      
      // Debug log structure
      sidebarItems.value.forEach(item => {
        if (item.sub_items && item.sub_items.length > 0) {
          console.log(`📁 ${item.title || item.name} → ${item.sub_items.length} sub-items`);
        }
      });

    } catch (error) {
      console.error("❌ Failed to fetch sidebar items:", error);
      sidebarItems.value = [];
    }
  }

  return sidebarItems;
};

/**
 * Fetch sidebar items for a specific user role
 * This queries the backend with the user's GID
 */
export const useSidebarForRole = async (userGID: number) => {
  const config = useRuntimeConfig();
  
  try {
    const response = await fetch(`${config.public.strapi.url}api/sidebar_items/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Roles': userGID.toString()
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // API already returns correct structure
    return (data || []).map((item: any) => ({
      ...item,
      sub_items: item.sub_items || []
    }));

  } catch (error) {
    console.error("❌ Failed to fetch sidebar for role:", error);
    return [];
  }
};

/**
 * Refresh sidebar items - forces a new fetch from the API
 * Call this after updating sidebar items in admin panel
 */
export const refreshSidebar = async () => {
  const config = useRuntimeConfig();
  const sidebarItems = useState<SidebarItem[]>("sidebarItems", () => []);

  try {
    const response = await fetch(`${config.public.strapi.url}api/sidebar-items/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache busting
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // API already returns correct structure
    sidebarItems.value = (data || []).map((item: any) => ({
      ...item,
      sub_items: item.sub_items || []
    }));

    console.log("🔄 Sidebar refreshed:", sidebarItems.value.length, "items");
    return sidebarItems.value;
    
  } catch (error) {
    console.error("❌ Failed to refresh sidebar items:", error);
    return [];
  }
};

/**
 * Clear sidebar cache - removes all cached items
 * Useful when logging out or switching users
 */
export const clearSidebarCache = () => {
  const sidebarItems = useState<SidebarItem[]>("sidebarItems", () => []);
  sidebarItems.value = [];
  console.log("🗑️ Sidebar cache cleared");
};

/**
 * Get a specific sidebar item by ID
 */
export const getSidebarItem = (id: number) => {
  const sidebarItems = useState<SidebarItem[]>("sidebarItems", () => []);
  return sidebarItems.value.find(item => item.id === id);
};

/**
 * Get all sub-items for a specific parent
 */
export const getSubItems = (parentId: number) => {
  const sidebarItems = useState<SidebarItem[]>("sidebarItems", () => []);
  const parent = sidebarItems.value.find(item => item.id === parentId);
  return parent?.sub_items || [];
};