
interface C1 {
    id: number;
    id_file: string;
    bnk_code: string;
    branch_id_code: string;
    bank_customer_ID: string;
    loan_id: string;
    collateral_id: string;
    collateral_type: string;
    collateral_status: string;
    insert_date: Date;
    update_date: Date;
    lcicID: string;
    com_enterprise_code: string;
  }
  
  
  interface CError {
    id: number;
    id_file: string;
    branch_id_code: string;
    bnk_code: string;
    bank_customer_ID: string;
    loan_id: string;
    collateral_id: string;
    collateral_type: string;
    datamatch: string;
    collateral_status: string;
    collateral_insert_date: Date;
    collateral_update_date: Date;
    lcicID: string;
    com_enterprise_code: string;
  }
  
  
  interface ColRealEstate {
    id: number;
    id_file: string;
    lcicID: string;
    bnk_code: string;
    collateral_type: string;
    com_enterprise_code: string;
    col_provin: string; // ແຂວງ
    col_district: string; // ເມືອງ
    col_village: string; // ບ້ານ
    col_unit: string; // ໜວ່ຍ
    col_no: string; // ເລກທີ
    col_out_time: string; // ອອກຄັ້ງທີ
    col_type: string; // ປະເພດດິນ
    col_area: string; // ເຂດ
    col_land_registry_book_no: string; // ປື້ມທະບຽນທີ່ດີນເຫຼັ້ມທີ່
    col_document_no: string; // ໃບທີ
    col_land_map_no: string; // ແຜນທີ່ຕາດິນເລກທີ່
    col_land_plot_no: string; // ຕອນດີນເລກທີ່
    col_land_area: number; // ເນື້ອທີ
    col_land_unit: string; // ມາດຕາສວນ
    owner_name: string; // ອອກໃຫ້ແກ່
    owner_birth_date: Date; // ວັນ.ເດືອນ.ປີເກີດ
    owner_nationality: string; // ສັນຊາດ
    owner_occupation: string; // ອາຊີບ
    current_unit: string; // ໜວ່ຍ ປະຈຸບັນ
    current_village: string; // ບ້ານ ປະຈຸບັນ
    current_district: string; // ເມືອງ ປະຈຸບັນ
    current_provin: string; // ແຂວງ ປະຈຸບັນ
    spouse_name?: string; // ຊື່ຜົວ ຫຼື ເມຍ
    spouse_birth_date?: Date; // ວັນ.ເດືອນ.ປີເກີດ (ຊື່ຜົວ ຫຼື ເມຍ)
    spouse_nationality?: string; // ສັນຊາດ (ຊື່ຜົວ ຫຼື ເມຍ)
    spouse_occupation?: string; // ອາຊີບ (ຊື່ຜົວ ຫຼື ເມຍ)
    land_acquisition: string; // ການໄດ້ມາຂອງສິດນຳໃຊ້ດິນ
    ownership_status: string; // ສະຖານະເປັນເຈົ້າຂອງ
    insert_date: Date;
    update_date: Date;
  }
  

  interface ColMoneyMia {
    id: number;
    id_file: string;
    lcicID: string;
    bnk_code: string;
    com_enterprise_code: string;
    collateral_type: string;
    bank_customer_ID: string;
    branch_id_code: string;
    loan_id: string;
    collateral_id: string;
    account_no: string;
    account_type: string;
    value: string;
    insert_date: Date;
    update_date: Date;
  }
  
 
  interface ColEquipmentEqi {
    id: number;
    id_file: string;
    bank_customer_id: string;
    bnk_code: string;
    lcicID: string;
    com_enterprise_code: string;
    collateral_type: string;
    branch_id_code: string;
    loan_id: string;
    collateral_id: string;
    machine_type: string;
    machine_no: string;
    value: string;
    insert_date: Date;
    update_date: Date;
  }
  

  interface ColProjectPrj {
    id: number;
    id_file: string;
    bank_customer_id: string;
    bnk_code: string;
    lcicID: string;
    com_enterprise_code: string;
    collateral_type: string;
    branch_id_code: string;
    loan_id: string;
    project_type: string;
    collateral_id: string;
    project_name_en: string;
    ministry: string;
    project_namber: string;
    project_name_la: string;
    value: string;
    insert_date: Date;
    update_date: Date;
  }
  

  interface ColVechicleVeh {
    id: number;
    id_file: string;
    lcicID: string;
    bnk_code: string;
    com_enterprise_code: string;
    collateral_type: string;
    bank_customer_ID: string;
    branch_id_code: string;
    loan_id: string;
    collateral_id: string;
    name_owner: string;
    plate_number: string;
    engine_number: string;
    body_numbe: string;
    model: string;
    value: string;
    insert_date: Date;
    update_date: Date;
  }
  
  
  interface ColGuarantorGua {
    id: number;
    id_file: string;
    lcicID: string;
    bnk_code: string;
    com_enterprise_code: string;
    collateral_type: string;
    bank_customer_ID: string;
    branch_id_code: string;
    loan_id: string;
    collateral_id: string;
    guarantor_type: string;
    guarantor_nationality: string;
    national_id: string;
    national_expiry_date: string;
    passport: string;
    passport_expiry_date: string;
    familybook: string;
    familybook_province_code_of_issue: string;
    familybook_issue_date: string;
    birthdate: string;
    gender: string;
    ist_name_english: string;
    ist_name_lao: string;
    nickname_english: string;
    nickname_lao: string;
    surname_english: string;
    surname_lao: string;
    address_number_street_english: string;
    address_number_street_lao: string;
    address_village_english: string;
    address_village_lao: string;
    address_sub_district_english: string;
    address_sub_district_lao: string;
    address_district_english: string;
    address_district_lao: string;
    address_province_code: string;
    enterprise_code: string;
    registration_date_of_issue: string;
    registration_place_issue: string;
    company_name_english: string;
    company_name_lao: string;
    category: string;
    insert_date: Date;
    update_date: Date;
  }
  

  interface ColGoldSilverGold {
    id: number;
    id_file: string;
    lcicID: string;
    bnk_code: string;
    com_enterprise_code: string;
    collateral_type: string;
    bank_customer_ID: string;
    branch_id_code: string;
    loan_id: string;
    collateral_id: string;
    weight: string;
    unit: string;
    value: string;
    insert_date: Date;
    update_date: Date;
  }
  export {
    ColGoldSilverGold,
    ColVechicleVeh,
    ColProjectPrj,
    ColEquipmentEqi,
    ColMoneyMia,
    ColGuarantorGua,
    C1,
    CError,
    
  }