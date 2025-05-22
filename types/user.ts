export interface UserResponse {
 Bank: BankRespose[];
 User: User[];
 Items: DetailMenmberRespons[];
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
export interface DetailMenmberRespons {
  
  UID:           number;
    username:      string;
    nameL:         string;
    surnameL:      string;
    nameE:         string;
    surnameE:      string;
    MID:           Mid;
    GID:           Gid;
    branch_id:     null;
    bnk_code:      null;
    password:      string;
    profile_image: string;
}

export interface Gid {
    GID:   number;
    nameL: string;
    nameE: string;
}

export interface Mid {
    code:  string;
    nameL: string;
    nameE: string;
}
export interface UserDataRespons {
  UID:           number;
  username:      string;
  nameL:         string;
  surnameL:      string;
  nameE:         string;
  surnameE:      string;
  MID:           number;
  GID:           number;
  branch_id:     null;
  bnk_code:      string;
  profile_image: string;
}