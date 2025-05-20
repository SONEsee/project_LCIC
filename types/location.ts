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