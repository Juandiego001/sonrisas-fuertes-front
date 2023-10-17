<template lang="pug">
v-card.ms-5.mt-5(max-width="300px" hover nuxt to="/board" rounded)
  v-img(src="classroom.jpg" height="150px")
  v-card-title.primary.white--text Tablero general
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      user: '',
      password: '',
      count: 0
    }
  },

  beforeMount () {},

  methods: {
    login () {
    }
  }
}

</script>

<style scoped>
</style>
