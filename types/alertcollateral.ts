export interface AllertDispustCallateralRepues {
    status:          string;
    data:            Data;
    filters_applied: FiltersApplied;
}

export interface Data {
    items:      Item;
    pagination: Pagination;
}

export interface Item {
    id_disput_loan: number;
    bnk_code:       string;
    image_url:      string;
    user_insert:    string;
    user_update:    null;
    insertdate:     string;
    updatedate:     null;
    status:         string;
    total:          number;
}

export interface Pagination {
    page:         number;
    page_size:    number;
    total_items:  number;
    total_pages:  number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface FiltersApplied {
    user_bnk_code:   string;
    filter_bnk_code: string;
    status:          string;
    id_disput_loan:  string;
}
export interface ConfirmCallateralRepues {
    status:          string;
    data:            Data;
    filters_applied: FiltersApplied;
}

export interface Data {
    confirm_loan_info: ConfirmLoanInfo;
    disputes:          Dispute[];
    pagination:        Pagination;
    statistics:        Statistics;
}

export interface ConfirmLoanInfo {
    id_disput_loan: number;
    bnk_code:       string;
    status:         string;
    total:          number;
    insertdate:     string;
    image_url:      string;
}

export interface Dispute {
    id:                  number;
    id_file:             string;
    period:              string;
    bnk_code:            string;
    segmentType:         string;
    branch_id_code:      string;
    bank_customer_ID:    string;
    loan_id:             string;
    col_id:              string;
    col_type:            string;
    collateral_status:   string;
    lcicID:              string;
    user_id:             string;
    com_enterprise_code: string;
    LCIC_code:           string;
    data_status:         string;
    is_disputed:         number;
    status:              string;
    action_dispust:      string;
}

export interface Pagination {
    page:         number;
    page_size:    number;
    total_items:  number;
    total_pages:  number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface Statistics {
    total_disputes: number;
    by_status:      ByStatus;
    by_bank:        ByBank;
    by_period:      ByPeriod;
}

export interface ByBank {
    "02": number;
}

export interface ByPeriod {
    "202506": number;
}

export interface ByStatus {
    "1": number;
}

export interface FiltersApplied {
    confirm_dispust_id: string;
    bnk_code:           string;
    period:             string;
    status:             string;
}
