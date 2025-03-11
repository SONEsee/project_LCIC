export interface UtilityRespons {
    reference_data: ReferenceDatumClass[];
    customer: CustomerIems[] | null;
    bill: BillIems[];
  }
  
  export interface BillIems {
    BillID: number;
    Customer_ID: string;
    InvoiceNo: string;
    TypeOfPro: string;
    Outstanding: string;
    Basic_Tax: string;
    Bill_Amount: string;
    Debt_Amount: string;
    Payment_ID: string;
    PaymentType: string;
    Payment_Date: string;
    InvoiceMonth: string;
    InvoiceDate: string;
    DisID: string;
    ProID: string;
    InsertDate: Date;
    UpdateDate: Date;
    UserID: null;
  }
  
  export interface CustomerIems {
    Customer_ID: string;
    Company_name: string;
    Name: string;
    Surname: string;
    National_ID: string;
    Passport: string;
    Address: string;
    Dustrict_ID: string;
    Province_ID: string;
    Tel: string;
    Email: string;
    Cus_type: string;
    Regis_date: Date;
  }
  
  export interface ReferenceDatumClass {
    search_id: number;
    bnk_code: string;
    sys_usr: string;
    wt_cusid: string;
    edl_cusid: string;
    tel_cusid: string;
    proID_edl: string;
    proID_wt: string;
    proID_tel: string;
    credittype: string;
    inquiry_date: Date;
    inquiry_time: Date;
  }