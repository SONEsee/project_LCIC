export interface FeeRespons {
  chg_sys_id: number;
  chg_code: string;
  chg_type: string;
  chg_lao_type: string;
  chg_desc: string;
  chg_lao_desc: string;
  chg_amount: number;
  chg_unit: ChgUnit;
}

export enum ChgUnit {
  Lak = "LAK",
}
// export interface FeeDetail {
//   Items: Items[];
// }
export interface FeeDetail {
  chg_sys_id: number;
  chg_code: string;
  chg_type: string;
  chg_lao_type: string;
  chg_desc: string;
  chg_lao_desc: string;
  chg_amount: number;
  chg_unit: string;
}
