export interface ByBankRespons {
    error: null;
    items: Items;
    
}

export interface Items {
    bnk_code:     string;
    user_count:   number;
    member_code:  string;
    member_nameL: string;
}
