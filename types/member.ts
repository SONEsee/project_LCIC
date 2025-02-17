export interface MemberRespons {
    id:                  number;
    id_file:             string;
    bnk_code:            string;
    period:              string;
    segmentType:         SegmentType;
    branch_id_code:      string;
    bank_customer_ID:    string;
    loan_id:             string;
    col_id:              string;
    col_type:            ColType;
    collateral_status:   string;
    insert_date:         Date;
    update_date:         null;
    lcicID:              string;
    user_id:             string;
    com_enterprise_code: string;
}

export enum ColType {
    C21 = "C2.1",
    C23 = "C2.3",
}

export enum SegmentType {
    A2 = "A2",
}
