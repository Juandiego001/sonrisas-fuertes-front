<template lang="pug">
v-row(no-gutters)
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt
    to="/users/admins" rounded)
      v-img(src="classroom.jpg" height="150px")
      v-card-title.primary.white--text Administradores
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/users/teachers"
    rounded)
      v-img(src="classroom.jpg" height="150px")
      v-card-title.primary.white--text Profesores
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/users/tutors"
    rounded)
      v-img(src="classroom.jpg" height="150px")
      v-card-title.primary.white--text Acudientes
  v-col
    v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/users/students"
    rounded)
      v-img(src="classroom.jpg" height="150px")
      v-card-title.primary.white--text Estudiantes
</template>

<script>
export default {
  data () {
    return {

    }
  },

  head () {
    return { title: 'Users' }
  },

  beforeMount () {
    this.moduleSlug = 'Usuarios'
  }
}
</script>
