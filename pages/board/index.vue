<template lang="pug">
v-row(no-gutters)
    v-col
        v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/board/publications"
        rounded)
          v-img(src="classroom.jpg" height="150px")
          v-card-title.primary.white--text Publicaciones
    v-col
        v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/board/activities"
        rounded)
          v-img(src="classroom.jpg" height="150px")
          v-card-title.primary.white--text Actividades
    v-col
        v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/board/materials"
        rounded)
          v-img(src="classroom.jpg" height="150px")
          v-card-title.primary.white--text Materiales
</template>

<script>
export default {
  data () {
    return {

    }
  },

  head () {
    return { title: 'Board' }
  }
}
</script>
