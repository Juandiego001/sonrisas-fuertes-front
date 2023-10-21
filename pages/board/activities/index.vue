<template lang="pug">
v-container.pt-0.align-center
  v-card.mx-auto(max-width="800px")
    v-img.align-end(src="/classroom.jpg" height="100px"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
      v-card-title.white--text.text-h5 Actividades
</template>

<script>
export default {
  data () {
    return {

    }
  },

  head () {
    return { title: 'Activities' }
  }
}
</script>
