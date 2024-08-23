import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginPage from '@/components/index.vue';
import ProtectedPage from '@/components/ProtectedPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/protected',
    name: 'Protected',
    component: ProtectedPage,
    meta: { requiresAuth: true }, // Example for route that requires authentication
  },
  // Add more routes here as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token'); // Check if user is authenticated

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;