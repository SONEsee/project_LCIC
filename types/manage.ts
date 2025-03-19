export interface UserDataRespons {
  error: null;
  items: UserResponsItems[];
}
export interface UserResponsItems {
  bnk_code: null | string;
  user_count: number;
  member_code: null | string;
  member_nameL: null | string;
}
