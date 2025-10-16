export interface UserListRepues {
    all_user: AllUser;
}

export interface AllUser {
    UID:        number;
    bnk_code:   string;
    bnk_name:   string;
    Permission: string;
    username:   string;
    nameL:      string;
    nameE:      string;
    surnameL:   string;
    surnameE:   string;
    last_login: null | string;
    is_active:  boolean;
}
