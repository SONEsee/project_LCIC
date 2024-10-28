import axios from 'axios';

export interface MemberData {
  memberType_id: number;
  count: number;
}

export const fetchTotalSalesData = async (): Promise<MemberData[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:35729/api/member-count/');
    return response.data.member_count;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
