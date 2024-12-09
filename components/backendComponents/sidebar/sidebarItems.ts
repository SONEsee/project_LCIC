// export const getSidebarItems = (t: (key: string) => string) => [
//   {
//     title: t("dashboard"),
//     icon: "mdi-view-dashboard-outline",
//     to: "/backend/dashboard",
//   },
//   {
//     title: t("search"),
//     icon: "mdi-magnify",
//     to: "/backend/search",
//   },
//   // {
//   //   title: t("searchreport"),
//   //   icon: "mdi-note-search-outline",
//   //   to: "/backend/order",
//   // },
//   // {
//   //   title: t("reportfees"),
//   //   icon: "mdi-cash-multiple",
//   //   to: "/backend/charge",
//   // },
//   {
//     title: t("report"),
//     icon: "mdi-file-document-multiple-outline",
//     to: "/backend/report",
//   },
//   {
//     title: t("datdsubmition"),
//     icon: "mdi-upload-box-outline",
//     to: "/backend/upload",
//   },
//   {
//     title: t("manageuser"),
//     icon: "mdi-cog-outline",
//     to: "/backend/manageuser/userlist",
//   },
//   {
//     title: t("datavadlidate"),
//     icon: "mdi-history",
//     to: "/backend/upload/lcictest",
//   },
//   {
//     title: t("uploadenterprise"),
//     icon: "mdi-image-area",
//     to: "/backend/upload/upload_image",
//   },
//   // {
//   //   title: t("isuscodelcic"),
//   //   icon: "mdi-form-select",
//   //   to: "/insertcollaterals",
//   // },
// ];


// // import { useFetch } from "#app";

// // export const useSidebarItems = async () => {
// //   const { data, error } = await useFetch("http://192.168.45.56:8000/api/sidebar-items/");

// //   if (error.value) {
// //     console.error("Failed to fetch sidebar items:", error.value);
// //     return [];
// //   }

// //   return data.value || [];
// // };


import { useState } from "#app";

export const useSidebar = async () => {
  const config = useRuntimeConfig();
  const sidebarItems = useState("sidebarItems", () => []);

  if (!sidebarItems.value.length) {

    try {
      const response = await fetch(`${config.public.strapi.url}api/sidebar-items/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      sidebarItems.value = data || [];
      console.log("------> ",sidebarItems.value);


    } catch (error) {
      console.error("Failed to fetch sidebar items:", error);
    }
  }

  return sidebarItems;
};