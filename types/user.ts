export interface UserResponse {
 Bank: BankRespose[];
 User: User[];
}
interface User {
  username: string;
  MID: string;
  code:string;
}

export interface BankRespose {
  bnk_sys_id:      number;
  bnk_code:        string;
  bnk_short_form:  string;
  bnk_images:      null;
  bnk_images_url:  null;
  bnk_name:        string;
  bnk_lao_name:    string;
  bnk_insert_date: Date;
  bnk_type:        number;
}