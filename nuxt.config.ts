import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // enable ssr for rendering
  ssr: false,
  devtools: {
    enabled: false,
  },
  routeRules: {
    "/backend/**": { ssr: false },
  },
  compatibilityDate: "2024-04-03",
  
  // import vuetify css
  css: ["@/assets/scss/style.scss", "@/assets/backend/style.scss"],

  // build vuetify
  build: {
    transpile: ["vuetify"],
  },

  // config vite with vuetify
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  // modules
  modules: [
    "@pinia/nuxt",
    "nuxt-icon",
    (options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        //@ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      );
    },
    "@nuxtjs/i18n",
  ],

  i18n: {
    lazy: false,
    langDir: "./lang",
    strategy: "no_prefix",
    locales: [
      { code: "en", iso: "en-US", file: "en.json" },
      { code: "lo", iso: "lo-LA", file: "lo.json" },
    ],
    defaultLocale: "en",
  },

  
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: "demo",
      },
      charset: "utf-8",
      titleTemplate: "%s - LCIC",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@200;300;400;500;600;700&family=Inter:wght@200;300;400;500;600;700;800;900&display=swap",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
      ],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=5",
        },
        {
          name: "sone",
          content: "computer Engineering , Laos",
        },
      ],
    },
  },

 

  runtimeConfig: {
    public: {
      strapi: {
        url: process.env.STRAPI_URL || "http://192.168.45.54:3729/",
      },
    },
  },
});
