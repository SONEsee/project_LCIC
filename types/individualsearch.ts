export interface SearchIndividualRespons {
    count:   number;
    results: Result;
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
