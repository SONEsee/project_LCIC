export interface MactMergEnterpriseRespons {
    code:             string;
    code_description: string;
    group_type:       string;
    summary:          Summary;
    pagination:       Pagination;
    display_fields:   string[];
    groups:           Group[];
}

export interface Group {
    group_order:   number;
    count:         number;
    matched_value: string;
    sample_mm_id:  number;
    items:         Item[];
}

export interface Item {
    com_sys_id:                   number;
    mm_com_sys_id:                number;
    bnk_code:                     string;
    customerid:                   string;
    com_enterprise_code:          string;
    com_tax_no:                   string;
    com_name:                     string;
    com_lao_name:                 string;
    com_registration_date:        string;
    com_registration_place_issue: COMRegistrationPlaceIssue;
    com_lao_name_code:            null | string;
    LCIC_code:                    LCICCode;
    enterprise_code:              string;
    status:                       Status;
    com_regulatory_capital:       string;
    com_regulatory_capital_unit:  COMRegulatoryCapitalUnit;
}

export enum LCICCode {
    Lc49136 = "lc-49136",
    Lc86233 = "lc-86233",
}

export enum COMRegistrationPlaceIssue {
    Empty = "",
    Nkl = "NKL",
    Sv = "SV",
    Vte = "VTE",
    
}

export enum COMRegulatoryCapitalUnit {
    Empty = "",
    Lak = "LAK",
    Usd = "USD",
}

export enum Status {
    F = "f",
}

export interface Pagination {
    page:         number;
    limit:        number;
    total_pages:  number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface Summary {
    total_groups:      number;
    total_records:     number;
    grouped_records:   number;
    ungrouped_records: number;
}
