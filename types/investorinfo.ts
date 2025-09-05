export interface InvestorInfoRespons {
    success:     boolean;
    data:        Datum;
    total_items: number;
    search_term: string;
}

export interface Datum {
    id:                   number;
    enterprise_id:        string;
    name:                 string;
    ownership_percentage: string;
    nationality:          string;
    card_number:          string;
    mobile:               string;
    insert_date:          string;
    update_date:          null;
}
