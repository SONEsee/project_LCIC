
export interface MemberInfoRespose{
 items: Items[];
 total:  number;
 detail: MemberInfoDetailRespose;
 
}
export interface Items {
    id:           number;
    code:         string;
    bnk_code:     null | string;
    bnk_type:     number | null;
    slug:         string;
    nameL:        string;
    nameE:        string;
    descL:        string;
    descE:        string;
    streetInfoL:  null | string;
    streetInfoE:  null | string;
    mImage:       null | string;
    published:    boolean;
    dateRegis:    Date | null;
    insertDate:   Date;
    updateDate:   Date;
    villageInfo:  number | null;
    districtInfo: number | null;
    provInfo:     number | null;
    memberType:   number;
}
export interface MemberInfoDetailRespose {
    id:           number | null;
    code:         string;
    bnk_code:     null | string;
    bnk_type:     number | null;
    slug:         string;
    nameL:        string;
    nameE:        string;
    descL:        string;
    descE:        string;
    streetInfoL:  null | string;
    streetInfoE:  null | string;
    mImage:       null | string;
    published:    boolean;
    dateRegis:    Date | null;
    insertDate:   Date | null;
    updateDate:   Date | null;
    villageInfo:  number | null;
    districtInfo: number | null;
    provInfo:     number | null;
    memberType:   number;
}
export interface RoleDetailRespose {
    id:       number;
    name:     string;
    name_lao: null;
}