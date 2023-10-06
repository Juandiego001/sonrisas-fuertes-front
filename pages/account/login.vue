<template>
  <v-row class="fill-height my-0 mx-0 white">
    <v-col cols="12" md="6" class="px-0 py-0">
      <v-img
        cover
        class="fill-height"
        src="/banner.jpg"
        alt="Logo de fundación"
      />
    </v-col>
    <v-col>
      <v-row class="fill-height" align="center">
        <v-col cols="12" md="12">
          <h1 class="primary--text text-center mb-3">
            Sonrisas Fuertes
          </h1>
          <p class="headline text-center">
            Iniciar sesión
          </p>
          <v-form ref="form" class="text-center" @submit.prevent="login">
            <v-row justify="center" align="center">
              <v-col class="pb-0" cols="12" md="8" sm="8">
                <v-text-field
                  v-model="username"
                  label="Usuario"
                  autocomplete="current-password"
                  filled
                  dense
                  hide-details="auto"
                  :rules="[generalRules]"
                />
              </v-col>
              <v-col cols="12" md="8" sm="8">
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  autocomplete="current-password"
                  filled
                  dense
                  type="password"
                  hide-details="auto"
                  :rules="[generalRules]"
                />
              </v-col>
            </v-row>
            <v-container class="text-end mb-3">
              <v-btn class="primary--text" elevation="0" @click="forgotPassword">
                ¿Olvidó su contraseña?
              </v-btn>
            </v-container>
            <v-btn class="primary" type="submit">
              Iniciar sesión
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import generalRules from '../../mixins/form-rules/general-rules'
import { loginUrl, accountProfileUrl } from '../../mixins/routes'

export default {
  name: 'IndexPage',
  mixins: [generalRules],
  layout: 'auth',
  data () {
    return {
      username: '',
      password: ''
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
        const { message } = await this.$axios.$post(loginUrl, {
          username: this.username,
          password: this.password
        })
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
