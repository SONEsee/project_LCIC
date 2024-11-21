import axios from 'axios';

export interface MemberData {
  memberType_id: number;
  count: number;
}

export const fetchTotalSalesData = async (): Promise<MemberData[]> => {
  try {
    const config = useRuntimeConfig();
    const response = await axios.get(`${config.public.strapi.url}api/member-count/`);
    return response.data.member_count;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
