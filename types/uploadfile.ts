
export interface UploadFileRespons {
    FID:           number;
    user_id:       string;
    file_id:       string;
    fileName:      string;
    fileUpload:    null;
    fileSize:      string;
    path:          string;
    insertDate:    string;
    updateDate:    string;
    period:        string;
    status:        string;
    statussubmit:  string;
    status_upload: string;
    FileType:      string;
    percentage:    number;
    MID:           null;
    GID:           null;
    SType:         null;
    UType:         null;
    UploadFile:    UploadFileBRespons;
}
export interface UploadFileBRespons {
    count:           number;
    results:         Result;
    summary:         Summary;
    filters_applied: FiltersApplied;
}

export interface FiltersApplied {
    user_id:         string;
    period:          string;
    request_user_id: string;
    file_type:       null;
    status:          null;
}

export interface Result {
    FID:           number;
    user_id:       string;
    file_id:       string;
    fileName:      string;
    fileUpload:    null;
    fileSize:      string;
    path:          string;
    insertDate:    string;
    updateDate:    string;
    period:        string;
    status:        string;
    statussubmit:  string;
    status_upload: string;
    FileType:      string;
    percentage:    number;
    MID:           null;
    GID:           null;
    SType:         null;
    UType:         null;
}

export interface Summary {
    total_files:      number;
    json_files:       number;
    xml_files:        number;
    status_breakdown: StatusBreakdown;
}

export interface StatusBreakdown {
    "0":     number;
    "1":     number;
    "2":     number;
    "3":     number;
    "4":     number;
    "5":     number;
    Pending: number;
}


export interface UploadFileCRespons {
    count:           number;
    results:         ResultC;
    summary:         Summary;
    filters_applied: FiltersAppliedC;
}

export interface FiltersAppliedC {
    user_id:         string;
    period:          string;
    request_user_id: string;
    file_type:       string;
    status:          string;
}

export interface ResultC {
    CID:           number;
    fileName:      string;
    fileUpload:    string;
    fileSize:      string;
    path:          string;
    insertDate:    string;
    updateDate:    string;
    period:        string;
    status:        string;
    user_id:       string;
    statussubmit:  string;
    status_upload: string;
    FileType:      string;
    percentage:    number;
    MID:           null;
    GID:           null;
    SType:         null;
    UType:         null;
}

export interface Summary {
    total_files:      number;
    json_files:       number;
    xml_files:        number;
    status_breakdown: StatusBreakdown;
}

export interface StatusBreakdown {
    "0":     number;
    "1":     number;
    "2":     number;
    "3":     number;
    "4":     number;
    "5":     number;
    Pending: number;
}
