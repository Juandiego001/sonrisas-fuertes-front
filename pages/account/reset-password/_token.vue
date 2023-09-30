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
    <v-col cols="12" md="6" class="text-center">
      <v-row class="fill-height" align="center">
        <v-col cols="12" md="12">
          <h1 class="primary--text text-center mb-3">
            Sonrisas Fuertes
          </h1>
          <p class="headline text-center">
            Reestablecer contraseña
          </p>
          <v-form ref="form" class="text-center" @submit.prevent="resetPassword">
            <v-row justify="center" align="center">
              <v-col class="pb-0" cols="12" md="8" sm="8">
                <v-text-field
                  v-model="new_password"
                  label="Contraseña"
                  filled
                  dense
                  type="password"
                  hide-details="auto"
                  :rules="passwordRules"
                />
              </v-col>
              <v-col cols="12" md="8" sm="8">
                <v-text-field
                  v-model="confirm_password"
                  label="Confirmar contraseña"
                  filled
                  dense
                  hide-details="auto"
                  type="password"
                  :rules="passwordRules"
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-btn color="primary" type="submit" depressed>
                  Guardar
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
import { resetPasswordUrl } from '~/mixins/routes'
import passwordRules from '~/mixins/form-rules/passwords'

export default {
  name: 'ResetPage',
  mixins: [passwordRules],
  layout: 'auth',

  data () {
    return {
      new_password: '',
      confirm_password: ''
    }
  },

  async fetch () {
  },

  head () {
    return { title: 'Reestablecer contraseña' }
  },

  methods: {
    async resetPassword () {
      try {
        this.$refs.form.validate()
        if (!this.$refs.form.validate()) { return }
        const { message } = await this.$axios.$patch(
          `${resetPasswordUrl}/${this.$route.params.token}`,
          { password: this.new_password })
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>
