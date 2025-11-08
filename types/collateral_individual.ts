export interface SearchIndividualRespons {
    count:   number;
    results: Result;
    typeserch: TypeSearchRespons[];
}
export interface TypeSearchRespons {
    cat_sys_id:     number;
    ct_type:        string;
    cat_name:       string;
    cat_lao_name:   string;
    cat_value:      string;
    cat_is_default: number;
    cat_sort_order: number;
    cat_group:      number;
    cat_status:     number;
}
export interface Result {
    customerid:      string;
    lcic_id:         string;
    bnk_code:        string;
    ind_name:        string;
    ind_surname:     string;
    ind_lao_name:    string;
    ind_lao_surname: string;
}


export interface MapsearchRespons {
    count:   number;
    results: ResultMapsearch;
}

export interface ResultMapsearch {
    lcic_id:                  string;
    ind_name:                 string;
    ind_surname:              string;
    ind_lao_name:             string;
    ind_lao_surname:          string;
    ind_national_id:          string;
    ind_birth_date:           string;
    ind_passport:             string;
    ind_familybook:           string;
    ind_familybook_prov_code: string;
    ind_familybook_date:      string;
    mm_ind_sys_id:            string;
}

export interface IndividualFileListRespons {
    count:           number;
    page:            number;
    limit:           number;
    total_pages:     number;
    results:         ResultIndividualFile;
    filters_applied: FiltersApplied;
}

export interface FiltersApplied {
    user_id:        string;
    user_id_filter: string;
    period:         null;
    statussubmit:   null;
    FileType:       null;
}

export interface ResultIndividualFile {
    CID:                 number;
    user_id:             string;
    file_id:             string;
    fileName:            string;
    file_url:            string;
    file_size:           string;
    period:              string;
    status:              string;
    statussubmit:        string;
    status_upload:       string;
    FileType:            string;
    percentage:          number;
    progress_percentage: number;
    insertDate:          string;
    updateDate:          string;
}
export interface PerliodIndividualFileListRespons {
    status:   string;
    user_id:  string;
    is_admin: boolean;
    count:    number;
    periods:  string[];
}


export interface ReportIndividualRespons {
    enterprise_info: EnterpriseInfo;
    loan_info:       LoanInfo[];
    active_loans:    ActiveLoan;
    search_history:  SearchHistory[];
}

export interface ActiveLoan {
    id:                      string;
    lon_update_date:         null;
    bank:                    string;
    lon_insert_date:         string;
    lon_credit_line:         number;
    lon_outstanding_balance: number;
    lon_currency_code:       string;
    lon_no_days_slow:        number;
    lon_class:               string;
    period:                  string;
    lon_open_date:           string;
    lon_exp_date:            string;
    lon_ext_date:            null;
    lon_int_rate:            number;
    lon_purpose_code:        string;
    lon_account_no:          string;
    lon_status:              string;
    lon_type:                string;
    lon_term:                string;
    is_disputed:             null;
    lon_applied_date:        null;
    lon_class_history:       LonClassHistory[];
    collateral_history:      CollateralHistory[];
}

export interface CollateralHistory {
    col_id:          string;
    col_type:        string;
    collateral_info: CollateralInfo;
    related_record:  RelatedRecord;
}

export interface CollateralInfo {
    id:                  number;
    id_file:             string;
    bnk_code:            string;
    period:              string;
    segmentType:         string;
    branch_id_code:      string;
    bank_customer_ID:    string;
    loan_id:             string;
    col_id:              string;
    col_type:            string;
    collateral_status:   string;
    insert_date:         string;
    update_date:         string;
    lcicID:              string;
    LCIC_code:           string;
    user_id:             string;
    com_enterprise_code: string;
    data_status:         null;
}

export interface RelatedRecord {
    id:                    number;
    id_file:               string;
    period:                string;
    lcicID:                string;
    LCIC_code:             string;
    bnk_code:              string;
    bank_customer_ID:      string;
    segmentType:           string;
    branch_id_code:        string;
    loan_id:               string;
    col_type:              string;
    value:                 null;
    value_unit:            string;
    com_enterprise_code:   string;
    plot_vilid:            string;
    plot_unit:             string;
    col_id:                string;
    col_value:             string;
    land_no:               string;
    place_regist_land:     string;
    land_map_no:           string;
    col_area:              string;
    land_registry_book_no: string;
    land_plot_no:          string;
    land_document_no:      string;
    land_out_time:         string;
    land_area:             string;
    land_regis_date:       string;
    land_type:             string;
    land_unit:             string;
    land_insert_date:      string;
    place_regist_no:       string;
    owner_name:            string;
    owner_birth_date:      string;
    owner_gender:          string;
    owner_nationality:     string;
    owner_occupation:      string;
    current_unit:          string;
    current_vilid:         string;
    spouse_name:           string;
    spouse_birth_date:     string;
    spouse_nationality:    string;
    spouse_occupation:     string;
    land_acquisition:      string;
    ownership_status:      string;
    user_id:               string;
    rel_status:            string;
    owner_name_lao:        string;
    owner_surname_lao:     string;
    data_status:           null;
    insert_date:           string;
    update_date:           string;
}

export interface LonClassHistory {
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
    status_data:             string;
}

export interface EnterpriseInfo {
    lcic_id:         string;
    ind_name:        string;
    ind_surname:     string;
    ind_lao_name:    string;
    ind_lao_surname: string;
    ind_national_id: string;
    ind_birth_date:  string;
    ind_passport:    null;
    ind_familybook:  string;
}

export interface LoanInfo {
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
    lon_ext_date:            null;
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
    is_disputed:             null;
    user_id:                 string;
    status_customer:         string;
    LCIC_code:               string;
    status_data:             string;
}

export interface SearchHistory {
    id:          string;
    bnk_code:    string;
    lon_purpose: string;
}
