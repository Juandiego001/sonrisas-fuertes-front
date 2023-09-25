<template>
  <v-app>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'AuthLayout',
  middleware: 'public',

  data () {
    return {
    }
  },

  computed: {
    snackbar: {
      get () { return this.$store.state.snackbar.snackbar },
      ...mapMutations({ set: 'snackbar/snackbar' })
    }
  }
}
</script>
