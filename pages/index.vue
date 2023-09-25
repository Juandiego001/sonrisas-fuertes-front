<template>
  <div>
    Home
  </div>
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

  methods: {
    login () {
      const json = {
        usuario: this.user,
        password: this.password
      }
      // eslint-disable-next-line no-console
      console.log(json)
    }
  }
}

</script>

<style scoped>
</style>
