<template lang="pug">
v-row(no-gutters)
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/administration/profiles"
    rounded)
      v-img(src="classroom.jpg" height="150px")
      v-card-title.primary.white--text Perfiles
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/administration/reports"
    rounded)
      v-img(src="classroom.jpg" height="150px")
      v-card-title.primary.white--text Reportes
</template>

<script>
export default {
  data () {
    return {

    }
  },

  head () {
    return { title: 'Administration' }
  },

  beforeMount () {
    this.moduleSlug = 'Administración'
  }
}
</script>
