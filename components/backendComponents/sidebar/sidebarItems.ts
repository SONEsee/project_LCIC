export const getSidebarItems = (t: (key: string) => string) => [
  {
    title: t("dashboard"),
    icon: "mdi-view-dashboard-outline",
    to: "/backend/dashboard",
  },
  {
    title: t("search"),
    icon: "mdi-magnify",
    to: "/backend/search",
  },
  {
    title: t("searchreport"),
    icon: "mdi-note-search-outline",
    to: "/backend/order",
  },
  {
    title: t("reportfees"),
    icon: "mdi-cash-multiple",
    to: "/backend/charge",
  },
  {
    title: t("report"),
    icon: "mdi-file-document-multiple-outline",
    to: "/backend/report",
  },
  {
    title: t("datdsubmition"),
    icon: "mdi-upload-box-outline",
    to: "/backend/upload",
  },
  {
    title: t("manageuser"),
    icon: "mdi-cog-outline",
    to: "/backend/manageuser/userlist",
  },
  {
    title: t("datavadlidate"),
    icon: "mdi-history",
    to: "/backend/upload/lcictest",
  },
  {
    title: t("uploadenterprise"),
    icon: "mdi-image-area",
    to: "/backend/upload/upload_image",
  },
  {
    title: t("isuscodelcic"),
    icon: "mdi-form-select",
    to: "/insertcollaterals",
  },
];
