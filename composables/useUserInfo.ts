// composables/useUserInfo.ts
import { computed } from "vue";
import { useUserManageStore } from "~/stores/usermanage";

export interface UserInfo {
  UID: number;
  bnk_code: string;
  bnk_name: string;
  Permission: string;
  username: string;
  nameL: string;
  nameE?: string;
  surnameL: string;
  surnameE?: string;
  last_login?: string;
  is_active: boolean;
  [key: string]: any;
}

export function useUserInfo() {
  const userStore = useUserManageStore();
  
  const userData = computed(() => {
    const data = userStore.respons_user_list;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object") {
      return [data];
    }
    return [];
  });

  /**
 
   * @param UID 
   * @returns 
   */
  const mapUserInfo = (UID: number | string): string => {
    if (!UID || !Array.isArray(userData.value)) {
      return "-";
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    if (foundUser) {
      return `${foundUser.UID} - ${foundUser.username} - ${foundUser.nameL} ${foundUser.surnameL}`;
    }
    
    return UID.toString();
  };

  /**
   * ດຶງຊື່ເຕັມຜູ້ໃຊ້
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns "nameL surnameL"
   */
  const getUserFullName = (UID: number | string): string => {
    if (!UID || !Array.isArray(userData.value)) {
      return "-";
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    return foundUser ? `${foundUser.nameL} ${foundUser.surnameL}` : UID.toString();
  };

  /**
   * ດຶງຊື່ຜູ້ໃຊ້ງານ (username)
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns username
   */
  const getUsername = (UID: number | string): string => {
    if (!UID || !Array.isArray(userData.value)) {
      return "-";
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    return foundUser ? foundUser.username : UID.toString();
  };

  /**
   * ດຶງຊື່ທະນາຄານ
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns bnk_name
   */
  const getUserBankName = (UID: number | string): string => {
    if (!UID || !Array.isArray(userData.value)) {
      return "-";
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    return foundUser ? foundUser.bnk_name : "-";
  };

  /**
   * ດຶງສິດທິຜູ້ໃຊ້
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns Permission
   */
  const getUserPermission = (UID: number | string): string => {
    if (!UID || !Array.isArray(userData.value)) {
      return "-";
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    return foundUser ? foundUser.Permission : "-";
  };

  /**
   * ກວດສອບສະຖານະ active
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns boolean
   */
  const isUserActive = (UID: number | string): boolean => {
    if (!UID || !Array.isArray(userData.value)) {
      return false;
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    return foundUser ? foundUser.is_active : false;
  };

  /**
   * ດຶງຂໍ້ມູນຜູ້ໃຊ້ທັງໝົດ
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns UserInfo object ຫຼື null
   */
  const getUserDetails = (UID: number | string): UserInfo | null => {
    if (!UID || !Array.isArray(userData.value)) {
      return null;
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    return userData.value.find((user) => user.UID === uid) || null;
  };

  /**
   * ດຶງ Avatar initials (ຕົວອັກສອນທຳອິດຂອງຊື່)
   * @param UID - ລະຫັດຜູ້ໃຊ້
   * @returns initials (ເຊັ່ນ: "ດກ")
   */
  const getUserInitials = (UID: number | string): string => {
    if (!UID || !Array.isArray(userData.value)) {
      return "?";
    }
    
    const uid = typeof UID === 'string' ? parseInt(UID) : UID;
    const foundUser = userData.value.find((user) => user.UID === uid);
    
    if (foundUser) {
      const firstInitial = foundUser.nameL?.charAt(0) || "";
      const lastInitial = foundUser.surnameL?.charAt(0) || "";
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    
    return "?";
  };

  /**
   * ໂຫຼດຂໍ້ມູນຜູ້ໃຊ້
   */
  const loadUsers = async () => {
    await userStore.getUserList();
  };

  return {
    userData,
    mapUserInfo,
    getUserFullName,
    getUsername,
    getUserBankName,
    getUserPermission,
    isUserActive,
    getUserDetails,
    getUserInitials,
    loadUsers
  };
}

// Standalone Functions (ສຳລັບໃຊ້ນອກ component)
export const mapUserInfo = (UID: number | string, userList: UserInfo[]): string => {
  if (!UID || !Array.isArray(userList)) {
    return "-";
  }
  
  const uid = typeof UID === 'string' ? parseInt(UID) : UID;
  const foundUser = userList.find((user) => user.UID === uid);
  
  if (foundUser) {
    return `${foundUser.UID} - ${foundUser.username} - ${foundUser.nameL} ${foundUser.surnameL}`;
  }
  
  return UID.toString();
};

export const getUserFullName = (UID: number | string, userList: UserInfo[]): string => {
  if (!UID || !Array.isArray(userList)) {
    return "-";
  }
  
  const uid = typeof UID === 'string' ? parseInt(UID) : UID;
  const foundUser = userList.find((user) => user.UID === uid);
  
  return foundUser ? `${foundUser.nameL} ${foundUser.surnameL}` : UID.toString();
};

export const getUsername = (UID: number | string, userList: UserInfo[]): string => {
  if (!UID || !Array.isArray(userList)) {
    return "-";
  }
  
  const uid = typeof UID === 'string' ? parseInt(UID) : UID;
  const foundUser = userList.find((user) => user.UID === uid);
  
  return foundUser ? foundUser.username : UID.toString();
};