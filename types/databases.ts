export interface DataModel {
    LCICID:                    number;
    EnterpriseID:              string;
    enterpriseNameLao:         string;
    eneterpriseNameEnglish:    null | string;
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
    id_file_id:                number;
    LastUpdate:                null;
    CancellationDate:          null;
    InsertDate:                Date;
    UpdateDate:                null;
}
