<template>
  <v-row class="fill-height my-0 mx-0 white">
    <v-col cols="12" md="6" class="px-0 py-0">
      <v-img cover class="fill-height" :src="require('~/assets/banner.jpg')" alt="Logo de fundación" />
    </v-col>
    <v-col cols="12" md="6">
      <v-row class="fill-height" align="center">
        <v-col>
          <h1 class="primary--text text-center mb-3">
            Sonrisas Fuertes
          </h1>
          <p class="headline text-center">
            Iniciar sesión
          </p>
          <form class="text-center" @submit.prevent="login">
            <v-text-field
              v-model="user"
              autocomplete="current-password"
              filled
              dense
              label="Usuario"
            />
            <v-text-field
              v-model="password"
              autocomplete="current-password"
              filled
              dense
              label="Contraseña"
              type="password"
            />
            <v-container class="text-end mb-3">
              <a href="#" class="text-decoration-none caption font-weight-medium">¿Olvidó su contraseña?</a>
            </v-container>
            <v-btn class="primary" type="submit">
              INICIAR SESIÓN
            </v-btn>
          </form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'auth',
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
