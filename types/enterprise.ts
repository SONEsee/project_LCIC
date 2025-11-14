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
    LCIC_reques: null;
}
