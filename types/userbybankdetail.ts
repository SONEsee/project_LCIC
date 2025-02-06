
export interface ByBankDetailResponse {
    error: null;
    items: Items;
    
}
export interface Items {
    bnk_code:     string;
    branch_id:    string;
    user_count:   number;
    member_code:  string;
    member_name:  string;
    branch_name:  string;
}