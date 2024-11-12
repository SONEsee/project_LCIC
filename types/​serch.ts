interface ReportFilter {
    bnk_code: string;
    Bank_short_form: string;
    searchlog_count: number;
    request_log: number;
    bank:any
}
export default {
    data() {
      return {
        charge_report: [] as ReportFilter[], 
        
      };
    },
    
  };