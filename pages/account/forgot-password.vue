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
    <v-col cols="12" md="6">
      <v-row class="fill-height" align="center">
        <v-col>
          <h1 class="primary--text text-center mb-3">
            Sonrisas Fuertes
          </h1>
          <p class="headline text-center">
            Recuperación de contraseña
          </p>
          <v-form
            ref="form"
            class="text-center"
            @submit.prevent="recoverPassword"
          >
            <v-row justify="center" align="center">
              <v-col cols="12" md="8" sm="8">
                <v-text-field
                  v-model="email"
                  filled
                  dense
                  label="Correo"
                  type="email"
                  hide-details="auto"
                  :rules="[generalRules]"
                />
              </v-col>
            </v-row>
            <v-row justify="center" align="center">
              <v-col class="text-center" cols="12">
                <v-btn class="white primary--text" @click="login">
                  Regresar
                </v-btn>
                <v-btn class="primary" type="submit">
                  Recuperar contraseña
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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
