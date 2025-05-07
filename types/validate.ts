export interface ValidateResponse{
items : items[]
} 
export interface items{
    CID:           number;
    fileName:      string;
    fileUpload:    string;
    fileSize:      string;
    path:          string;
    insertDate:    Date;
    updateDate:    Date;
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