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
    FID:                 number;
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
