import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.STRAPI_URL || import.meta.env.STRAPI_URL || 'http://192.168.45.54:35729/',
  timeout: 12000000,
});

axios.interceptors.request.use(
  function (config) {
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error?.response) {
      const errorStatusCode = error.response.status;
      if (errorStatusCode === 401 || errorStatusCode === 403) {
        // ລຶບ token ອອກ
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          // ໃຊ້ window.location ແທນ router
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;