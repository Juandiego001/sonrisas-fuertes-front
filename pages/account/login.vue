<template lang="pug">
v-row.fill-height.my-0.mx-0.white
  v-col(cols="12" md="6" class="px-0 py-0")
    v-img.fill-height(cover src="/banner.jpg" alt="Logo de fundación")
  v-col
    v-row.fill-height(align="center")
      v-col(cols="12" md="12")
        h1.primary--text.text-center.mb-3 Sonrisas Fuertes
        p.headline.text-center Iniciar sesión
        v-form.text-center(ref="form" @submit.prevent="login")
          v-row(justify="center" align="center")
            v-col.pb-0(cols="12" md="8" sm="8")
              text-field(v-model="form.username" label="Usuario"
              :rules="generalRules")
            v-col(cols="12" md="8" sm="8")
              text-field-password(v-model="form.password" label="Contraseña"
              :rules="generalRules")
            v-col.text-end.pe-0(cols="12" md="8" sm="8")
              v-btn(class="primary--text" elevation="0"
              @click="forgotPassword")
                | ¿Olvidó su contraseña?
            v-col(cols="12" md="8" sm="8")
              v-btn.primary(type="submit") Iniciar sesión
</template>

<script>
import generalRules from '../../mixins/form-rules/general-rules'
import passwordRules from '../../mixins/form-rules/passwords'
import { loginUrl, accountProfileUrl } from '../../mixins/routes'

export default {
  name: 'IndexPage',
  mixins: [generalRules, passwordRules],
  layout: 'auth',
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },

  head () {
    return { title: 'Login' }
  },

  methods: {
    async login () {
      try {
        if (!this.$refs.form.validate()) { return }
        const epoch = Math.floor(Date.now() / 1000)
        const { message } = await this.$axios.$post(loginUrl, this.form)
        const user = await this.$axios.$get(accountProfileUrl)
        this.$store.commit('session/updateSession', { epoch, ...user })
        this.$ability.update(user.abilities)
        this.showSnackbar(message)
        this.$router.push('/')
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    forgotPassword () {
      this.$router.push('/account/forgot-password')
    }
  }
}

</script>
