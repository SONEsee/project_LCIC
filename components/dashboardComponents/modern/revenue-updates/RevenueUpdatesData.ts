import axios from 'axios';

export interface ChartData {
  bnk_code: string;
  "10-2024": number;
}

export const fetchChartData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:35729/api/charge_chart/month/');
    let chartData: ChartData[] = response.data.chart_data;

    // Sort data by "10-2024" in descending order
    chartData.sort((a: ChartData, b: ChartData) => b["10-2024"] - a["10-2024"]);

    // Take the top 10 highest values
    const top10Data = chartData.slice(0, 10);

    // Prepare categories and data for the chart
    const categories = top10Data.map((item) => item.bnk_code);
    const data = top10Data.map((item) => item["10-2024"]);

    return { categories, data };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return { categories: [], data: [] };
  }
};
