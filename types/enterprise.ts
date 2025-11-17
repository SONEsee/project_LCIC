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
