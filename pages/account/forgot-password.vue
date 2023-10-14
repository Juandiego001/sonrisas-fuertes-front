<template lang="pug">
v-row.fill-height.my-0.mx-0.white
  v-col.px-0.py-0(cols="12" md="6")
    v-img.fill-height(cover src="/banner.jpg" alt="Logo de fundación")
  v-col(cols="12" md="6")
    v-row.fill-height(align="center")
      v-col
        h1.primary--text.text-center.mb-3 Sonrisas Fuertes
        p.headline.text-center Recuperación de contraseña
        v-form.text-center(ref="form" @submit.prevent="recoverPassword")
          v-row(justify="center" align="center")
            v-col(cols="12" md="8" sm="8")
              text-field(v-model="email" label="Correo"
              :rules="[generalRules]")
          v-row(justify="center" align="center")
            v-col.text-center(cols="12")
              v-btn.white.primary--text(@click="login") Regresar
              v-btn.primary(type="submit") Recuperar contraseña
</template>

<script>
import generalRules from '../../mixins/form-rules/general-rules'
import { resetPasswordUrl } from '../../mixins/routes'

export default {
  name: 'IndexPage',
  mixins: [generalRules],
  layout: 'auth',

  data () {
    return {
      email: ''
    }
  },

  methods: {
    login () {
      this.$router.push('/account/login')
    },
    async recoverPassword () {
      try {
        if (!this.$refs.form.validate()) { return }
        const { message } = await this.$axios.$post(resetPasswordUrl,
          { email: this.email })
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}

</script>

<style scoped>
</style>
