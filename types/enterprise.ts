export interface ListFileRegisterEnterpriseRespons {
    status:          string;
    count:           number;
    page:            number;
    limit:           number;
    total_pages:     number;
    results:         Result[];
    filters_applied: FiltersApplied;
}

export interface FiltersApplied {
    bank_id:        string;
    bank_id_filter: null;
    branch_id:      null;
    status:         null;
    LCIC_reques:    null;
}

export interface Result {
    id:          number;
    bank_id:     string;
    branch_id:   string;
    filename:    string;
    image:       string;
    user:        string;
    insertdate:  Date;
    updatedate:  null;
    pathfile:    null;
    status:      string;
    decaption:   string;
    LCIC_reques: null;
}



export interface CheckEnterpriseRespons {
    success: boolean;
    message: string;
    exists:  boolean;
    data:    Data;
}

export interface Data {
    LCICID:                    number;
    EnterpriseID:              string;
    enterpriseNameLao:         string;
    eneterpriseNameEnglish:    string;
    regisCertificateNumber:    string;
    regisDate:                 string;
    enLocation:                number;
    regisStrationOfficeType:   string;
    regisStationOfficeCode:    string;
    enLegalStrature:           string;
    foreigninvestorFlag:       string;
    investmentAmount:          number;
    status:                    number;
    investmentCurrency:        string;
    representativeNationality: string;
    LastUpdate:                string;
    CancellationDate:          string;
    InsertDate:                string;
    UpdateDate:                string;
    LCIC_code:                 string;
    id_file:                   null;
}


export interface DetailEnterpiseWhitIDRespons {
    LCICID:                    number;
    id_file_name:              null;
    EnterpriseID:              string;
    enterpriseNameLao:         string;
    eneterpriseNameEnglish:    string;
    regisCertificateNumber:    string;
    regisDate:                 null;
    enLocation:                string;
    regisStrationOfficeType:   string;
    regisStationOfficeCode:    string;
    enLegalStrature:           string;
    foreigninvestorFlag:       string;
    investmentAmount:          number;
    status:                    number;
    investmentCurrency:        string;
    representativeNationality: string;
    LastUpdate:                null;
    user_insert:               null;
    user_update:               null;
    CancellationDate:          null;
    InsertDate:                Date;
    UpdateDate:                null;
    LCIC_code:                 null;
    id_file:                   number;
    status_text:               string;
}


export interface ListEnterprisRespons {
    success:    boolean;
    message:    string;
    data:       DataEnterprise;
    pagination: Pagination;
}

export interface DataEnterprise {
    LCICID:                    number;
    EnterpriseID:              string;
    enterpriseNameLao:         string;
    eneterpriseNameEnglish:    string;
    regisCertificateNumber:    string;
    regisDate:                 null;
    enLocation:                string;
    regisStrationOfficeType:   string;
    regisStationOfficeCode:    string;
    enLegalStrature:           string;
    foreigninvestorFlag:       string;
    investmentAmount:          number;
    status:                    number;
    investmentCurrency:        string;
    representativeNationality: string;
    LastUpdate:                null;
    CancellationDate:          null;
    InsertDate:                Date;
    UpdateDate:                null;
    LCIC_code:                 null;
}

export interface Pagination {
    current_page: number;
    total_pages:  number;
    total_items:  number;
    per_page:     number;
    has_next:     boolean;
    has_previous: boolean;
}



export interface ListRegisterCustomerRespons {
    success:     boolean;
    data:        ListRegisterCustomer;
    pagination:  Pagination;
    permissions: Permissions;
}

export interface ListRegisterCustomer {
    id:           number;
    InsertDate:   Date;
    UpdateDate:   null;
    EnterpriseID: string;
    customerID:   string;
    LCIC_code:    string;
    bnk_code:     string;
    branch:       string;
    status:       number;
    user_insert:  null;
    user_update:  null;
}

export interface Pagination {
    current_page: number;
    total_pages:  number;
    total_items:  number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface Permissions {
    is_admin:      boolean;
    user_bnk_code: string;
    filtered_by:   string;
}

export interface ListRegisterCustomerDetailRespons {
    success: boolean;
    data:    DataDetail;
}

export interface DataDetail {
    com_sys_id:                   number;
    segment:                      string;
    mm_com_sys_id:                null;
    bnk_code:                     string;
    branchcode:                   string;
    customerid:                   string;
    com_enterprise_code:          null;
    com_registration_date:        string;
    com_registration_place_issue: string;
    com_name:                     string;
    com_lao_name:                 string;
    com_tax_no:                   string;
    com_category:                 string;
    com_regulatory_capital:       string;
    com_regulatory_capital_unit:  string;
    com_insert_date:              null;
    com_update_date:              null;
    mm_action_date:               null;
    mm_log:                       null;
    mm_comment:                   string;
    mm_by:                        string;
    blk_sys_id:                   null;
    mm_status:                    string;
    is_manual:                    null;
    com_lao_name_code:            string;
    LCIC_code:                    string;
    enterprise_code:              string;
    status:                       string;
    id_file:                      string;
}
