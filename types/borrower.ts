export interface BorroworRespons {
    count:           number;
    page:            number;
    limit:           number;
    total_pages:     number;
    results:         Result[];
    filters_applied: FiltersApplied;
}

export interface FiltersApplied {
    user_id:        string;
    user_id_filter: null;
    period:         null;
    statussubmit:   null;
    FileType:       null;
}

export interface Result {
    BID:                 number;
    SType:               null;
    UType:               null;
    user_id:             string;
    file_id:             string;
    fileName:            string;
    fileUpload:          string;
    progress_percentage: number;
    fileSize:            string;
    path:                string;
    insertDate:          Date;
    updateDate:          Date;
    period:              string;
    status:              string;
    statussubmit:        string;
    status_upload:       string;
    FileType:            string;
    percentage:          number;
    dispuste:            null;
}
export interface PerliodIndividualFileListRespons {
    status:   string;
    user_id:  string;
    is_admin: boolean;
    count:    number;
    periods:  string[];
}