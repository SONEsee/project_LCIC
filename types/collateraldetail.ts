export interface ColltateralDataRespons {
    data:    Data;
    summary: Summary;
}

export interface Data {
    C1:                  C1;
    C_error:             CErrorItem;
    col_real_estates:    ColRealEstates;
    col_money_mia:       ColMoneyMia;
    col_equipment_eqi:   ColEquipmentEqi;
    col_project_prj:     ColProjectPrj;
    col_vechicle_veh:    ColVechicleVeh;
    col_guarantor_gua:   ColGuarantorGuaItem;
    col_goldsilver_gold: ColGoldsilverGold;
    C1_disptes:          C1DisputesItem;
    CDL:                 Cdl;
    uploadfile:          Uploadfile;
}
export interface Cdl {
    items:        CDLItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface CDLItem {
    id:       number;
    id_file:  string;
    user_id:  string;
    period:   string;
    col_type: string;
    c1:       string;
    c2:       string;
    c3:       string;
    c4:       string;
    c5:       string;
    c6:       string;
    c7:       string;
    c8:       string;
    c9:       string;
    c10:      string;
    c11:      string;
    c12:      string;
    c13:      string;
    c14:      string;
    c15:      string;
    c16:      string;
    c17:      string;
    c18:      string;
    c19:      string;
    c20:      string;
    c21:      string;
    c22:      string;
    c23:      string;
    c24:      string;
    c25:      string;
    c26:      string;
    c27:      string;
    c28:      string;
    c29:      string;
    c30:      string;
    c31:      string;
    c32:      string;
    c33:      string;
    c34:      string;
    c35:      string;
    c36:      string;
    c37:      string;
    c38:      string;
    c39:      string;
    c40:      string;
    c41:      string;
    c42:      string;
}
export interface C1DisputesItem {
    items:        C1DisputesItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}
export interface C1DisputesItem {
    id: number;
    id_file: string;
    period: string;
    bnk_code: string;
    segmentType: string;
    branch_id_code: string;
    bank_customer_ID: string;
    loan_id: string;
    col_id: string;
    col_type: string;
    collateral_status: string;
    insert_date: string;
    update_date: string;
    lcicID: string;
    user_id: string;
    com_enterprise_code: string;
    LCIC_code: string | null;
    data_status: string | null;
}
export interface CErrorItem {
    items:        CErrorItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}
export interface CErrorItem {
    id: number;
    id_file: string;
    period: string;
    branch_id_code: string;
    segmentType: string;
    bnk_code: string;
    bank_customer_ID: string;
    loan_id: string;
    col_id: string;
    col_type: string;
    datamatch: string;
    collateral_status: string;
    collateral_insert_date: string;  
    collateral_update_date: string; 
    lcicID: string;
    user_id: string;
    com_enterprise_code: string;
    LCIC_code: string | null;
}
export interface C1 {
    items:        C1Item[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}
export interface C1Item {
    id: number;
    id_file: string;
    bnk_code: string;
    period: string;
    segmentType: string;
    branch_id_code: string;
    bank_customer_ID: string;
    loan_id: string;
    col_id: string;
    col_type: string;
    collateral_status: string;
    insert_date: string;  
    update_date: string;  
    lcicID: string;
    LCIC_code: string;
    user_id: string;
    com_enterprise_code: string;
    data_status: string | null;
}
export interface ColEquipmentEqi {
    items:        ColEquipmentEqiItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface ColEquipmentEqiItem {
    id:                  number;
    id_file:             string;
    period:              string;
    bank_customer_ID:    string;
    bnk_code:            string;
    lcicID:              string;
    LCIC_code:           string;
    com_enterprise_code: string;
    segmentType:         string;
    col_type:            string;
    branch_id_code:      string;
    loan_id:             string;
    col_id:              string;
    machine_type:        string;
    machine_no:          string;
    value:               string;
    machine_status:      string;
    machine_insert_date: string;
    value_unit:          string;
    owner_gender:        string;
    owner_name:          string;
    owner_surname:       string;
    owner_lao_name:      string;
    owner_lao_surname:   string;
    user_id:             string;
    data_status:         null;
    insert_date:         string;
    update_date:         string;
}

export interface ColGoldsilverGold {
    items:        ColGoldsilverGoldItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface ColGoldsilverGoldItem {
    id:                  number;
    id_file:             string;
    period:              string;
    lcicID:              string;
    LCIC_code:           string;
    bnk_code:            string;
    segmentType:         string;
    com_enterprise_code: string;
    col_type:            string;
    bank_customer_ID:    string;
    branch_id_code:      string;
    loan_id:             string;
    col_id:              string;
    weight:              string;
    unit:                string;
    gld_status:          string;
    gld_insert_date:     string;
    owner_gender:        string;
    owner_name:          string;
    owner_surname:       string;
    value_unit:          string;
    owner_lao_name:      string;
    owner_lao_surname:   string;
    value:               string;
    user_id:             string;
    data_status:         null;
    insert_date:         string;
    update_date:         string;
}

export interface ColMoneyMia {
    items:        ColMoneyMiaItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface ColMoneyMiaItem {
    id:                  number;
    LCIC_code:           string;
    id_file:             string;
    period:              string;
    lcicID:              string;
    bnk_code:            string;
    com_enterprise_code: string;
    segmentType:         string;
    col_type:            string;
    bank_customer_ID:    string;
    branch_id_code:      string;
    loan_id:             string;
    col_id:              string;
    account_no:          string;
    account_type:        string;
    value_unit:          string;
    mia_status:          string;
    mia_insert_date:     string;
    owner_gender:        string;
    owner_name:          string;
    owner_surname:       string;
    owner_lao_name:      string;
    owner_lao_surname:   string;
    value:               string;
    user_id:             string;
    data_status:         null;
    insert_date:         string;
    update_date:         string;
}

export interface ColProjectPrj {
    items:        ColProjectPrjItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface ColProjectPrjItem {
    id:                  number;
    id_file:             string;
    period:              string;
    bank_customer_ID:    string;
    bnk_code:            string;
    lcicID:              string;
    LCIC_code:           string;
    com_enterprise_code: string;
    segmentType:         string;
    col_type:            string;
    branch_id_code:      string;
    loan_id:             string;
    project_type:        string;
    col_id:              string;
    project_name_en:     string;
    ministry:            string;
    project_number:      string;
    project_status:      string;
    project_insert_date: string;
    value_unit:          string;
    owner_gender:        string;
    project_name_la:     string;
    owner_name:          string;
    owner_surname:       string;
    owner_lao_name:      string;
    owner_lao_surname:   string;
    value:               string;
    user_id:             string;
    data_status:         null;
    insert_date:         string;
    update_date:         string;
}

export interface ColRealEstates {
    items:        ColRealEstatesItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface ColRealEstatesItem {
    id:                    number;
    id_file:               string;
    period:                string;
    lcicID:                string;
    LCIC_code:             string;
    bnk_code:              string;
    bank_customer_ID:      string;
    segmentType:           string;
    branch_id_code:        string;
    loan_id:               string;
    col_type:              string;
    value:                 null;
    value_unit:            string;
    com_enterprise_code:   string;
    plot_vilid:            string;
    plot_unit:             string;
    col_id:                string;
    col_value:             string;
    land_no:               string;
    place_regist_land:     string;
    land_map_no:           string;
    col_area:              string;
    land_registry_book_no: string;
    land_plot_no:          string;
    land_document_no:      string;
    land_out_time:         string;
    land_area:             string;
    land_regis_date:       string;
    land_type:             string;
    land_unit:             string;
    land_insert_date:      string;
    place_regist_no:       string;
    owner_name:            string;
    owner_birth_date:      string;
    owner_gender:          string;
    owner_nationality:     string;
    owner_occupation:      string;
    current_unit:          string;
    current_vilid:         string;
    spouse_name:           string;
    spouse_birth_date:     string;
    spouse_nationality:    string;
    spouse_occupation:     string;
    land_acquisition:      string;
    ownership_status:      string;
    user_id:               string;
    rel_status:            string;
    owner_name_lao:        string;
    owner_surname_lao:     string;
    data_status:           null;
    insert_date:           string;
    update_date:           string;
}

export interface ColVechicleVeh {
    items:        ColVechicleVehItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface ColVechicleVehItem {
    id:                  number;
    id_file:             string;
    period:              string;
    lcicID:              string;
    LCIC_code:           string;
    bnk_code:            string;
    com_enterprise_code: string;
    segmentType:         string;
    col_type:            string;
    bank_customer_ID:    string;
    branch_id_code:      string;
    loan_id:             string;
    col_id:              string;
    name_owner:          string;
    plate_number:        string;
    engine_number:       string;
    body_number:         string;
    value_unit:          string;
    vehicle_status:      string;
    vehicle_insert_date: string;
    owner_gender:        string;
    owner_name:          string;
    owner_surname:       string;
    owner_lao_name:      string;
    owner_lao_surname:   string;
    model:               string;
    value:               string;
    user_id:             string;
    data_status:         null;
    insert_date:         string;
    update_date:         string;
}
export interface ColGuarantorGuaItem {
    items:       ColGuarantorGuaItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}
export interface ColGuarantorGuaItem {
    id: number;
    id_file: string;
    user_id: string;
    period: string;
    lcicID: string;
    LCIC_code: string | null;
    bnk_code: string;
    com_enterprise_code: string;
    segmentType: string;
    col_type: string;
    bank_customer_ID: string;
    branch_id_code: string;
    loan_id: string;
    col_id: string;
    value: string;
    value_unit: string;
    gua_ind_status: string;
    gua_ind_insert_date: string;
    guarantor_nationality: string;
    gua_national_id: string;
    national_id_expiry_date: string;
    gua_passport: string;
    passport_expiry_date: string;
    gua_familybook_id: string;
    familybook_provision_code: string;
    familybook_issue_date: string;
    gua_birthday: string;
    gua_gender: string;
    gua_name: string;
    gua_surname: string;
    gua_lao_name: string;
    gua_lao_surname: string;
    address_number_street_eng: string;
    address_vill_eng: string;
    address_district_eng: string;
    address_number_street_la: string;
    address_vill_la: string;
    address_district_la: string;
    address_province_code: string;
    owner_name: string;
    owner_gender: string;
    insert_date: string | null;
    update_date: string | null;
    owner_surname: string;
    owner_lao_name: string;
    data_status: string | null;
    owner_lao_surname: string;
}
export interface Uploadfile {
    items:        UploadfileItem[];
    total_items:  number;
    total_pages:  number;
    current_page: number;
    page_size:    number;
    has_next:     boolean;
    has_previous: boolean;
}

export interface UploadfileItem {
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
    cid:                string;
    total_c1:           number;
    total_errors:       number;
    total_real_estates: number;
    total_money:        number;
    total_equipment:    number;
    total_projects:     number;
    total_vehicles:     number;
    total_guarantors:   number;
    total_gold:         number;
    total_disputes:     number;
    total_cdl:          number;
    total_files:        number;

}
