// utils/memberInfo.ts
import { computed } from "vue";
import { MemberStore } from "@/stores/memberinfo";


export interface MemberInfo {
  bnk_code: string;
  code: string;
  nameL: string;
  nameE?: string;
  [key: string]: any;
}

// Composable function ສຳລັບ member info
export function useMemberInfo() {
  const memberinfoStore = MemberStore();
  
  const dataMemberInfo = computed(() => {
    const data = memberinfoStore.respons_data_query;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object") {
      return [data];
    }
    return [];
  });

  const mapMemberInfo = (membercode: string): string => {
    if (!membercode || !Array.isArray(dataMemberInfo.value)) {
      return "-";
    }
    
    const foundItem = dataMemberInfo.value.find((item) => item.bnk_code === membercode);
    return foundItem ? `${foundItem.bnk_code}-${foundItem.code}-${foundItem.nameL}` : membercode;
  };


  const getMemberName = (membercode: string): string => {
    if (!membercode || !Array.isArray(dataMemberInfo.value)) {
      return "-";
    }
    
    const foundItem = dataMemberInfo.value.find((item) => item.bnk_code === membercode);
    return foundItem ? foundItem.nameL : membercode;
  };

  const getMemberDetails = (membercode: string): MemberInfo | null => {
    if (!membercode || !Array.isArray(dataMemberInfo.value)) {
      return null;
    }
    
    return dataMemberInfo.value.find((item) => item.bnk_code === membercode) || null;
  };

  return {
    dataMemberInfo,
    mapMemberInfo,
    getMemberName,
    getMemberDetails
  };
}

// ຖ້າຕ້ອງການໃຊ້ແບບ standalone function
export const mapMemberInfo = (membercode: string, memberData: MemberInfo[]): string => {
  if (!membercode || !Array.isArray(memberData)) {
    return "-";
  }
  
  const foundItem = memberData.find((item) => item.bnk_code === membercode);
  return foundItem ? `${foundItem.bnk_code}-${foundItem.code}-${foundItem.nameL}` : membercode;
};

export const getMemberName = (membercode: string, memberData: MemberInfo[]): string => {
  if (!membercode || !Array.isArray(memberData)) {
    return "-";
  }
  
  const foundItem = memberData.find((item) => item.bnk_code === membercode);
  return foundItem ? foundItem.nameL : membercode;
};