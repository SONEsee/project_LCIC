
export interface ReportRespose {
    enterprise_info: EnterpriseInfo[];
    loan_info:       LoanInfo[];
    inves_info:      InvesInfo[];
    active_loans:    ActiveLoan[];
    search_history:  SearchHistory[];
}

export interface ActiveLoan {
    id:                      string;
    lon_update_date:         null;
    bank:                    string;
    lon_insert_date:         Date;
    lon_credit_line:         number;
    lon_outstanding_balance: number;
    lon_currency_code:       string;
    lon_no_days_slow:        number;
    lon_class:               string;
    period:                  string;
    lon_open_date:           Date;
    lon_exp_date:            Date;
    lon_ext_date:            null;
    lon_int_rate:            number;
    lon_purpose_code:        string;
    lon_account_no:          string;
    lon_status:              string;
    lon_type:                string;
    lon_term:                string;
    is_disputed:             number;
    lon_applied_date:        null;
    lon_class_history:       LonClassHistory[];
    collateral_history:      any[];
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
    lon_open_date:           Date;
    lon_exp_date:            Date;
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
    lon_insert_date:         Date;
    lon_update_date:         null;
    lon_applied_date:        null;
    user_id:                 string;
    is_disputed:             number;
    LCIC_code:               string;
}

export interface EnterpriseInfo {
    LCICID:                    number;
    EnterpriseID:              string;
    enterpriseNameLao:         string;
    eneterpriseNameEnglish:    string;
    regisCertificateNumber:    string;
    regisDate:                 string;
    enLocation:                string;
    regisStrationOfficeType:   string;
    regisStationOfficeCode:    string;
    enLegalStrature:           string;
    foreigninvestorFlag:       string;
    investmentAmount:          number;
    status:                    number;
    investmentCurrency:        string;
    representativeNationality: string;
    LastUpdate:                Date;
    CancellationDate:          string;
    InsertDate:                string;
    UpdateDate:                string;
    LCIC_code:                 string;
    id_file:                   null;
}

export interface InvesInfo {
    ID:                      number;
    EnterpriseID:            string;
    investorName:            string;
    investorOwnerPercentage: string;
    investorNationality:     string;
    investorcardNumber:      string;
    investorMobile:          string;
    InsertDate:              Date;
    UpdateDate:              null;
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
    lon_open_date:           Date;
    lon_exp_date:            Date;
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
    lon_insert_date:         Date;
    lon_update_date:         null;
    lon_applied_date:        null;
    is_disputed:             number;
    user_id:                 string;
    status_customer:         string;
    LCIC_code:               string;
}

export interface SearchHistory {
    id:          Date;
    bnk_code:    string;
    lon_purpose: string;
}
