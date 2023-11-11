<template lang="pug">
v-row(no-gutters)
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt :href="studentsReport")
      v-img(src="../bg-reports.jpg" height="150px")
      v-card-title.primary.white--text
        .subtitle-1 Generar reporte de estudiantes
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt :href="patientsReport")
      v-img(src="../bg-reports.jpg" height="150px")
      v-card-title.primary.white--text
        .subtitle-1 Generar reporte de pacientes
</template>

<script>
import { reportUrl } from '~/mixins/routes'

export default {
  name: 'ReportsPage',
  layout: 'default',
  data () {
    return {
    }
  },

  head () {
    return { title: 'Reports' }
  },

  computed: {
    studentsReport () {
      return `${reportUrl}students`
    },
    patientsReport () {
      return `${reportUrl}patients`
    }
  },

  beforeMount () {
    this.moduleSlug = 'Reportes'
    this.canViewPage()
  }
}
</script>
