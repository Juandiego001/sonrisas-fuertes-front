<template lang="pug">
v-app
  v-main
    Nuxt
  v-snackbar(v-model="snackbar" multi-line
  :color="$store.state.snackbar.type") {{ $store.state.snackbar.text }}
    template(#action)
      v-btn(icon @click="snackbar=false")
        v-icon mdi-close
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
