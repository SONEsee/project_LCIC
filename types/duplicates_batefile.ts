// To parse this data:
//
//   import { Convert } from "./file";
//
//   const userDataRespons = Convert.toUserDataRespons(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface UserDataRespons {
    id:               number;
    user_id:          string;
    duplicates:       string;
    count_duplicates: number;
    duplicates_false: DuplicatesFalse;
    UID:              string;
    file_id:          string;
    fileName:         FileName;
    fileUpload:       string;
    fileSize:         FileSize;
    path:             Path;
    insertDate:       Date;
    updateDate:       Date;
    period:           string;
    status:           Status;
    statussubmit:     string;
    searchtrue:       string;
    searchfals:       string;
    status_upload:    string;
    FileType:         FileType;
    percentage:       number;
    MID:              null;
    GID:              null;
    SType:            null;
    UType:            null;
}

export enum FileType {
    JSON = "json",
}

export enum DuplicatesFalse {
    Empty = "",
    The2303701B020000729542551600003469 = "[\"23037-01B020000729\", \"54255-1600003469\"]",
}

export enum FileName {
    SJSON = "s.json",
}

export enum FileSize {
    The3912Bytes = "3912 bytes",
    The3915Bytes = "3915 bytes",
    The4123Bytes = "4123 bytes",
}

export enum Path {
    SearchfileSJSON = "searchfile/s.json",
}

export enum Status {
    Uploaded = "Uploaded",
}


export class Convert {
    public static toUserDataRespons(json: string): UserDataRespons[] {
        return cast(JSON.parse(json), a(r("UserDataRespons")));
    }

    public static userDataResponsToJson(value: UserDataRespons[]): string {
        return JSON.stringify(uncast(value, a(r("UserDataRespons"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "UserDataRespons": o([
        { json: "id", js: "id", typ: 0 },
        { json: "user_id", js: "user_id", typ: "" },
        { json: "duplicates", js: "duplicates", typ: "" },
        { json: "count_duplicates", js: "count_duplicates", typ: 0 },
        { json: "duplicates_false", js: "duplicates_false", typ: r("DuplicatesFalse") },
        { json: "UID", js: "UID", typ: "" },
        { json: "file_id", js: "file_id", typ: "" },
        { json: "fileName", js: "fileName", typ: r("FileName") },
        { json: "fileUpload", js: "fileUpload", typ: "" },
        { json: "fileSize", js: "fileSize", typ: r("FileSize") },
        { json: "path", js: "path", typ: r("Path") },
        { json: "insertDate", js: "insertDate", typ: Date },
        { json: "updateDate", js: "updateDate", typ: Date },
        { json: "period", js: "period", typ: "" },
        { json: "status", js: "status", typ: r("Status") },
        { json: "statussubmit", js: "statussubmit", typ: "" },
        { json: "searchtrue", js: "searchtrue", typ: "" },
        { json: "searchfals", js: "searchfals", typ: "" },
        { json: "status_upload", js: "status_upload", typ: "" },
        { json: "FileType", js: "FileType", typ: r("FileType") },
        { json: "percentage", js: "percentage", typ: 0 },
        { json: "MID", js: "MID", typ: null },
        { json: "GID", js: "GID", typ: null },
        { json: "SType", js: "SType", typ: null },
        { json: "UType", js: "UType", typ: null },
    ], false),
    "FileType": [
        "json",
    ],
    "DuplicatesFalse": [
        "",
        "[\"23037-01B020000729\", \"54255-1600003469\"]",
    ],
    "FileName": [
        "s.json",
    ],
    "FileSize": [
        "3912 bytes",
        "3915 bytes",
        "4123 bytes",
    ],
    "Path": [
        "searchfile/s.json",
    ],
    "Status": [
        "Uploaded",
    ],
};
