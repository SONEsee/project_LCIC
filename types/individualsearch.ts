export interface SearchIndividualRespons {
    count:   number;
    results: Result[];
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
