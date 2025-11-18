// types/customer.ts

export interface CustomerRecord {
  Custype: string;
  segment: string;
  bnk_code: string;
  customer_ID: string;
  branch_id_code: string;
  ind_national_id?: string | null;
  ind_national_id_date?: string | null;
  ind_passport?: string | null;
  ind_passport_date?: string | null;
  ind_familybook?: string | null;
  ind_familybook_prov_code?: string | null;
  ind_familybook_date?: string | null;
  ind_birth_date?: string | null;
  ind_name?: string | null;
  ind_surname?: string | null;
  ind_lao_name?: string | null;
  ind_lao_surname?: string | null;
  verify_document?: string;
}



export interface RegisterResponse {
  success: boolean;
  total_processed: number;
  matched: number;
  new_records: number;
  duplicates_skipped: number;
  details: CustomerDetail[];
}

export interface CustomerDetail {
  customer_id: string;
  bnk_code: string;
  lcic_id: string;
  status: 'MATCHED' | 'MATCHED (BATCH)' | 'NEW RECORD';
  match_percent: number;
  field_scores?: Record<string, number>;
  action: 'INSERTED' | 'SKIPPED (DUPLICATE)' | 'FAILED';
  error?: string;
}

export interface UploadedCustomer extends CustomerDetail {
  ind_sys_id?: number;
  document_file?: File | string;
  uploaded_by?: string;
  uploaded_at?: string;
  confirmed?: boolean;
  confirmed_by?: string;
  confirmed_at?: string;
}

export interface FilterOptions {
  bnk_code?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  confirmed?: boolean;
  search?: string;
}

export interface UserRole {
  gid: number;
  is_admin: boolean;
  username: string;
}