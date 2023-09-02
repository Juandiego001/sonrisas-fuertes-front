// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  modules: [
    '@invictus.codes/nuxt-vuetify'
  ],
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // @TODO: list all vuetify options
    },

    moduleOptions: {
      /* nuxt-vuetify module options */
      treeshaking: false,
      useIconCDN: false,

      /* vite-plugin-vuetify options */
      styles: true
    }
  }
})
