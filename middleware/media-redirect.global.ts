
export default defineNuxtRouteMiddleware((to) => {
 
  if (to.path.startsWith('/media/')) {
  
    return abortNavigation();
  }
});