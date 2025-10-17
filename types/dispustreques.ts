export interface DispustRepues {
    status:          string;
    data:            Data;
    filters_applied: FiltersApplied;
}

export interface Data {
    items:      Item[];
    pagination: Pagination;
}

export interface Item {
    id_disput_loan:       number;
    bnk_code:             string;
    image:                string;
    image_url:            string;
    user_insert:          string;
    user_update:          null;
    insertdate:           string;
    insertdate_formatted: string;
    updatedate:           null;
    updatedate_formatted: null;
    status:               string;
    total:                number;
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
}
