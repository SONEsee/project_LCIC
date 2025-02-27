// export default defineNuxtRouteMiddleware((to, from) => {
//   const localStorageToken = localStorage.getItem("access_token");

//   const cookieToken = useCookie("access_token");

//   if (!localStorageToken && !cookieToken.value) {
//     return navigateTo("/");
//   }
// });
export default defineNuxtRouteMiddleware((to, from) => {
    const localStorageToken = localStorage.getItem("access_token");
    const cookieToken = useCookie("access_token");
  
    if (!localStorageToken && !cookieToken.value) {
      return navigateTo("/"); 
    }
  });
  
// export default defineNuxtRouteMiddleware((to, from) => {
//     const token = localStorage.getItem('access_token');

//     if (!token && to.path.startsWith('/backend/dashboard')) {
//       // If the token is missing and the user is trying to access a protected path,
//       // redirect them to the login page.
//       return navigateTo('/');
//     }
//     if (!token && to.path.startsWith('/backend/order')) {
//         // If the token is missing and the user is trying to access a protected path,
//         // redirect them to the login page.
//         return navigateTo('/');
//     }
//     if (!token && to.path.startsWith('/backend/search')) {
//       // If the token is missing and the user is trying to access a protected path,
//       // redirect them to the login page.
//       return navigateTo('/');
//     }
//     if (!token && to.path.startsWith('/backend/report')) {
//       // If the token is missing and the user is trying to access a protected path,
//       // redirect them to the login page.
//       return navigateTo('/');
//     }
//     if (!token && to.path.startsWith('/user/manageuser')) {
//       // If the token is missing and the user is trying to access a protected path,
//       // redirect them to the login page.
//       return navigateTo('/');
//     }
//     // if (!token && to.path.startsWith('/backend/dashboard')) {
//     //   // If the token is missing and the user is trying to access a protected path,
//     //   // redirect them to the login page.
//     //   return navigateTo('/');
//     // }
//   });
