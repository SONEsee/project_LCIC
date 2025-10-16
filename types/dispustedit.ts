export interface DispustEditRepues {
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
}

export interface Dispute {
    id:                         number;
    lon_open_date_formatted:    string;
    lon_exp_date_formatted:     string;
    lon_ext_date_formatted:     null;
    lon_insert_date_formatted:  string;
    lon_update_date_formatted:  null;
    lon_applied_date_formatted: null;
    confirm_loan_status:        string;
    id_file:                    string;
    lcicID:                     string;
    period:                     string;
    product_type:               string;
    com_enterprise_code:        string;
    segmentType:                string;
    bnk_code:                   string;
    customer_id:                string;
    branch_id:                  string;
    lon_sys_id:                 string;
    loan_id:                    string;
    lon_open_date:              string;
    lon_exp_date:               string;
    lon_ext_date:               null;
    lon_int_rate:               number;
    lon_purpose_code:           string;
    lon_credit_line:            number;
    lon_currency_code:          string;
    lon_outstanding_balance:    number;
    lon_account_no:             string;
    lon_no_days_slow:           number;
    lon_class:                  string;
    lon_type:                   string;
    lon_term:                   string;
    lon_status:                 string;
    lon_insert_date:            string;
    lon_update_date:            null;
    lon_applied_date:           null;
    user_id:                    string;
    status:                     null;
    is_disputed:                null;
    deception:                  null;
    LCIC_code:                  string;
    confirm_dispust_id:         number;
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
    total_disputes:    number;
    total_outstanding: number;
    avg_credit_line:   number;
    by_status:         ByStatus;
    by_bank:           ByBank;
    by_product_type:   ByProductType;
    by_period:         ByPeriod;
}

export interface ByBank {
    "02": number;
}

export interface ByPeriod {
    "202507": number;
}

export interface ByProductType {
    "": number;
}

export interface ByStatus {
    unknown: number;
}

export interface FiltersApplied {
    confirm_dispust_id: string;
    bnk_code:           string;
    period:             string;
    status:             string;
    product_type:       string;
}
