
export interface LocationRespons {
    ID:            number;
    Prov_ID:       string;
    Province_Name: string;
    Dstr_ID:       string;
    District_Name: string;
    Vill_ID:       string;
    Village_Name:  string;
}
export interface Province {
    id:   string;
    name: string;
  }
  
  export interface District {
    id: string;
    name: string;
  }
  
  export interface Village {
    id: string;
    name: string;
  }
  
  export interface Location {
    provinces: Province[];
    districts: District[];
    villages: Village[];
  }
  
  // If you need namespaces, you can define them like this:
  export namespace LochalUserData {
    export interface Province {
      id: string;
      name: string;
    }
  
    export interface District {
      id: string;
      name: string;
    }
  
    export interface Village {
      id: string;
      name: string;
    }
  
    export interface Location {
      provinces: Province[];
      districts: District[];
      villages: Village[];
    }
  }