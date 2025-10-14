
import swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";






export const goPath = (path: string | null) => {
  if (path !== null) {
    window.location.href = path;
  }
};

export const openPath = (path: string | null) => {
  if (path !== null) {
    window.open(path, "_blank");
  }
};

export const goPreviousPath = () => {
  const router = useRouter();
  return router.go(-1);
};






export const onLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("profile_image_url");
  localStorage.removeItem("profile_enable");

  setTimeout(() => {
    goPath("/login");
  }, 1200);
};

export const GetAgencyType = () => {
  return [
    {
      title: "ຕົວແທນແບບແຂວງ (Province Agency)",
      value: "PROVINCE",
    },
    {
      title: "ຕົວແທນແບບເມືອງ (District Agency)",
      value: "DISTRICT",
    },
    {
      title: "ຕົວແທນແບບບຸກຄົນ (Unit Agency)",
      value: "UNIT",
    },
  ];
};

export const GetDefaultGenders = () => {
  return [
    {
      title: "ຜູ້ຍິງ / Female",
      value: 1,
    },
    {
      title: "ຜູ້ຊາຍ / Male",
      value: 2,
    },
  ];
};

export const GetAgencyTypeLabel = (type: string): string => {
  const list_of_agency_label = {
    PROVINCE: "ຕົວແທນແບບແຂວງ (Province Agency)",
    DISTRICT: "ຕົວແທນແບບເມືອງ (District Agency)",
    UNIT: "ຕົວແທນແບບບຸກຄົນ (Unit Agency)",
  } as { [key: string]: string };

  return list_of_agency_label?.[type] ?? "N/A";
};

export const GetDefaultStatus = () => {
  return [
    { title: "ເປີດໃຊ້ງານ", value: 1 },
    {
      title: "ປິດໃຊ້ງານ",
      value: 0,
    },
  ];
};

export const CallSwal = (options: SweetAlertOptions) => {
  return swal.fire({
    ...options,
    customClass: {
      confirmButton: "custom-confirm-button",
    },
  });
};

export const GetImageUrl = (file: File | string | null) => {
  if (file) {
    if (typeof file === "object") {
      return URL.createObjectURL(file);
    } else {
      return file;
    }
  }

  return "";
};

export const GetIdentitiesList = () => {
  return [
    {
      title: "ບັດປະຈຳຕົວ",
      value: 1,
    },
    {
      title: "ພາສປອດ / Passport",
      value: 2,
    },
    {
      title: "ສຳມະໂນຄົວ",
      value: 3,
    },
  ];
};


export const GetIdentitiesLabel = (type: number): string => {
  const list_indetities_label = {
    1: "ບັດປະຈຳຕົວ",
    2: "ພາສປອດ / Passport",
    3: "ສຳມະໂນຄົວ",
  } as { [key: number]: string };
  return list_indetities_label?.[type] ?? "N/A";
};

export const GetCommissionLabel = (type: string): string => {
  const list_commission_label = {
    STANDARD: "ເປີເຊັນພຶ້ນຖານ",
    STRAIGHT: "ເປີເຊັນຖອກຕົງ",
    GOAL_AVERAGE: "ເປີເຊັນເປົ້າ ແບບຄ່າສະເລ່ຍ",
    GOAL_DEVICE: "ເປີເຊັນເປົ້າ ແບບຕ່ໍເຄື່ອງ",
  } as { [key: string]: string };
  return list_commission_label?.[type] ?? "N/A";
};

export const formatnumber = (value: number | string) => {
  if (value) {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "0";
  }
};

export const formatnumberV2 = (value: number | string) => {
  if (value) {
    const [integerPart, decimalPart] = value.toString().split("."); // Split into integer and decimal parts
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  } else {
    return "0";
  }
};

export const GetItemPerPageOptions = () => {
  return [
    {
      title: "2",
      value: 2,
    },
    {
      title: "5",
      value: 5,
    },
    {
      title: "10",
      value: 10,
    },
    {
      title: "20",
      value: 20,
    },
    {
      title: "30",
      value: 30,
    },
    {
      title: "50",
      value: 50,
    },
    {
      title: "100",
      value: 100,
    },
    {
      title: "200",
      value: 200,
    },
    {
      title: "300",
      value: 300,
    },
    {
      title: "500",
      value: 500,
    },
    {
      title: "1000",
      value: 1000,
    },
  ];
};



export const pushPath = (path: string) => {
  const router = useRouter();
  if (!path) {
    return;
  }

  return router.push({
    path: path,
  });
};



export const GetCommissionOrExpenseTypeLabel = (label: string) => {
  let listOfLabel = {
    STANDARD: "ເປີເຊັນພຶ້ນຖານ",
    STRAIGHT: "ເປີເຊັນຖອກຕົງ",
    GOAL_AVERAGE: "ເປີເຊັນເປົ້າ ແບບຄ່າສະເລ່ຍ",
    GOAL_DEVICE: "ເປີເຊັນເປົ້າ ແບບຕ່ໍເຄື່ອງ",
    GOAL_COMMISSION: "ເປີເຊັນເປົ້າ",
    WINNER_SALE_COMMISSION: "ເປີເຊັນບິນລາງວັນ",
    WINNER_EXPENSE_SALE: "ບິນລາງວັນ",
    BORROW_EXPENSE_SALE: "ຕົວແທນຢືມ",
    COMMITTEE_EXPENSE_SALE: "ຄ່າກຳມະການ",
    // COMMITTEE_EXPENSE_SALE: "Hello world",
    VAT_EXPENSE_SALE: "ອາກອນ",
    OTHER_EXPENSE_SALE: "ອື່ນໆ",
    TOPUP_CARD: "ບັດເຕີມ",
    WINNER_EXPENSE_LAST_DIGIT_SALE: "ບິນລາງວັນເລກທ້າຍ",
  } as { [key: string]: string };

  return listOfLabel[label] ?? "N/A";
};







export const GetUserRoleList = () => {
  return [
    {
      title: "ແອັດມິນ / Admin",
      value: "ADMIN",
    },
  ];
};

export const GetPaymentTypeSelections = () => {
  return [
    {
      title: "ໄດ້ຮັບ",
      value: 1,
    },
    {
      title: "ຈ່າຍອອກ",
      value: 2,
    },
  ];
};