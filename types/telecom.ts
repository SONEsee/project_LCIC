export interface UploadTelecomRespons {
    count:        number;
    total_pages:  number;
    current_page: number;
    next:         string;
    previous:     null;
    results:      Result;
}

export interface Result {
    TID:                 number;
    file_id:             string;
    fileName:            FileName;
    fileSize:            FileSize;
    path:                string;
    user_id:             string;
    telecomType:         TelecomType;
    period:              Period;
    status:              Status;
    status_upload:       Status;
    FileType:            FileType;
    progress_percentage: number;
    percentage:          number;
    insertDate:          Date;
    fileUpload:          string;
}

export enum FileType {
    JSON = ".json",
}

export enum FileName {
    ETLBillInfoJSON = "etl_BillInfo.json",
    ETLCustomersInfoJSON = "etl_CustomersInfo.json",
}

export enum FileSize {
    The11GB = "1.1 GB",
    The45KB = "4.5 KB",
}

export enum Period {
    The202501 = "2025-01",
}

export enum Status {
    Completed = "completed",
    Processing = "processing",
    Uploaded = "uploaded",
}

export enum TelecomType {
    Bill = "Bill",
}


export interface BillTelecomRespons {
    count:    number;
    next:     string;
    previous: string;
    results:  Result[];
}

export interface Result {
    TB_ID:        number;
    BillID:       string;
    Customer_ID:  string;
    InvoiceNo:    string;
    TypeOfPro:    string;
    Outstanding:  string;
    Basic_Tax:    string;
    Bill_Amount:  string;
    Debt_Amount:  string;
    Payment_ID:   DisID;
    PaymentType:  DisID;
    Payment_Date: InvoiceDateEnum;
    InvoiceMonth: string;
    InvoiceDate:  InvoiceDateEnum;
    DisID:        DisID;
    ProID:        string;
    InsertDate:   Date;
    UpdateDate:   Date;
    UserID:       string;
}

export enum DisID {
    Null = "null",
}

export enum InvoiceDateEnum {
    The000000000 = "0/0/0 00:00:00",
}