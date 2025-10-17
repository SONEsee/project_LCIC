export interface LoanDataRespons {
    id_file:       string;
    pagination:    Pagination;
    counts:        Counts;
    total_records: number;
    data:          Data;
}

export interface Counts {
    b1:             number;
    data_edit:      number;
    disputes:       number;
    b_data_damaged: number;
    b1_monthly:     number;
}

export interface Data {
    b1:             B1;
    data_edit:      DataEdit;
    disputes:       Disputes;
    b_data_damaged: BDataDamaged;
    b1_monthly:     B1Monthly;
}

export interface B1 {
    items:        B1Item[];
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface B1Item {
    id:                      number;
    id_file:                 string;
    lcicID:                  string;
    com_enterprise_code:     string;
    period:                  string;
    product_type:            string;
    segmentType:             string;
    bnk_code:                string;
    customer_id:             string;
    branch_id:               string;
    lon_sys_id:              string;
    loan_id:                 string;
    lon_open_date:           string;
    lon_exp_date:            string;
    lon_ext_date:            null | string;
    lon_int_rate:            string;
    lon_purpose_code:        string;
    lon_credit_line:         string;
    lon_currency_code:       string;
    lon_outstanding_balance: string;
    lon_account_no:          string;
    lon_no_days_slow:        number;
    lon_class:               string;
    lon_type:                string;
    lon_term:                string;
    lon_status:              string;
    lon_insert_date:         string;
    lon_update_date:         null;
    lon_applied_date:        null;
    progress_percentage:     number;
    is_disputed:             number;
    user_id:                 string;
    status_customer:         string;
    LCIC_code:               string;
    status_data:             string;
}

export interface B1Monthly {
    items:        B1MonthlyItem[];
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface B1MonthlyItem {
    id:                      number;
    id_file:                 string;
    lcicID:                  string;
    period:                  string;
    product_type:            string;
    com_enterprise_code:     string;
    segmentType:             string;
    bnk_code:                string;
    customer_id:             string;
    branch_id:               string;
    lon_sys_id:              string;
    loan_id:                 string;
    lon_open_date:           string;
    lon_exp_date:            string;
    lon_ext_date:            null | string;
    lon_int_rate:            number;
    lon_purpose_code:        string;
    lon_credit_line:         number;
    lon_currency_code:       string;
    lon_outstanding_balance: number;
    lon_account_no:          string;
    lon_no_days_slow:        number;
    lon_class:               string;
    lon_type:                string;
    lon_term:                string;
    lon_status:              string;
    lon_insert_date:         string;
    lon_update_date:         null;
    lon_applied_date:        null;
    user_id:                 string;
    is_disputed:             number;
    LCIC_code:               string;
    status_data:             string;
}

export interface BDataDamaged {
    items:        BDataDamagedItem[];
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface BDataDamagedItem {
    id:                        number;
    id_file:                   string;
    lcicID:                    string;
    com_enterprise_code_get:   string;
    lcicID_get:                null | string;
    period:                    string;
    product_type:              string;
    lcicID_error:              string;
    com_enterprise_code_error: string;
    com_enterprise_code:       string;
    segmentType:               string;
    bnk_code:                  string;
    customer_id:               string;
    branch_id:                 string;
    lon_sys_id:                string;
    loan_id:                   string;
    lon_open_date:             string;
    lon_exp_date:              string;
    lon_ext_date:              null;
    lon_int_rate:              number;
    lon_purpose_code:          string;
    lon_credit_line:           number;
    lon_currency_code:         string;
    lon_outstanding_balance:   number;
    lon_account_no:            string;
    lon_no_days_slow:          number;
    lon_class:                 string;
    lon_type:                  string;
    lon_term:                  string;
    lon_status:                string;
    lon_insert_date:           string;
    lon_update_date:           null;
    lon_applied_date:          null;
    user_id:                   string;
    is_disputed:               null;
    LCIC_code:                 string;
}

export interface DataEdit {
    items:        DataEditItem[];
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface DataEditItem {
    id:                      number;
    id_file:                 string;
    lcicID:                  string;
    period:                  string;
    product_type:            string;
    com_enterprise_code:     string;
    segmentType:             string;
    bnk_code:                string;
    customer_id:             string;
    branch_id:               string;
    lon_sys_id:              string;
    loan_id:                 string;
    lon_open_date:           string;
    lon_exp_date:            string;
    lon_ext_date:            null | string;
    lon_int_rate:            number;
    lon_purpose_code:        string;
    lon_credit_line:         number;
    lon_currency_code:       string;
    lon_outstanding_balance: number;
    lon_account_no:          string;
    lon_no_days_slow:        number;
    lon_class:               string;
    lon_type:                string;
    lon_term:                string;
    lon_status:              string;
    lon_insert_date:         string;
    lon_update_date:         null;
    lon_applied_date:        null;
    user_id:                 string;
    is_disputed:             null;
    LCIC_code:               string;
}

export interface Disputes {
    items:        DisputesItem[];
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface DisputesItem {
    id:                      number;
    id_file:                 string;
    lcicID:                  string;
    period:                  string;
    product_type:            string;
    com_enterprise_code:     string;
    segmentType:             string;
    bnk_code:                string;
    customer_id:             string;
    branch_id:               string;
    lon_sys_id:              string;
    loan_id:                 string;
    lon_open_date:           string;
    lon_exp_date:            string;
    lon_ext_date:            null;
    lon_int_rate:            number;
    lon_purpose_code:        string;
    lon_credit_line:         number;
    lon_currency_code:       string;
    lon_outstanding_balance: number;
    lon_account_no:          string;
    lon_no_days_slow:        number;
    lon_class:               string;
    lon_type:                string;
    lon_term:                string;
    lon_status:              string;
    lon_insert_date:         string;
    lon_update_date:         null;
    lon_applied_date:        null;
    user_id:                 string;
    is_disputed:             null;
    LCIC_code:               string;
    status:                 string;
}

export interface Pagination {
    page:      number;
    page_size: number;
}
