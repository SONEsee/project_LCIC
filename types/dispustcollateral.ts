export interface DispustCollateralRepues {
    id_file:       string;
    pagination:    Pagination;
    counts:        Counts;
    total_records: number;
    data:          Data;
}

export interface Counts {
    all_disputes:      number;
    active_disputes:   number;
    pending_disputes:  number;
    resolved_disputes: number;
    by_action:         number;
}

export interface Data {
    all_disputes:      ActiveDisputes;
    active_disputes:   ActiveDisputes;
    pending_disputes:  Disputes;
    resolved_disputes: Disputes;
    by_action:         ActiveDisputes;
}

export interface ActiveDisputes {
    items:        Item;
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface Item {
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
    insert_date:         string;
    update_date:         string;
    lcicID:              string;
    user_id:             string;
    com_enterprise_code: string;
    LCIC_code:           string;
    data_status:         string;
    is_disputed:         number;
    status:              string;
    action_dispust:      string;
}

export interface Disputes {
    items:        any[];
    total_pages:  number;
    current_page: number;
    has_next:     boolean;
    has_previous: boolean;
    total_items:  number;
}

export interface Pagination {
    page:      number;
    page_size: number;
}
