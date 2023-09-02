<template>
    <v-container class="fill-height">
        <v-row h-100>
            <v-col cols="12" md="6">
                <div>
                    <img src="~/assets/fun-rafael.png" id='icon' alt="user icon">
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div>
                    <div>
                        <form @submit.prevent="login">
                            <div>
                                <v-text-field v-model="user" autocomplete="current-password" filled dense label="Usuario"></v-text-field>
                            </div>
                            <div>
                                <v-text-field v-model="password" autocomplete="current-password" filled dense label="Contraseña" type="password"></v-text-field>
                            </div>
                            <v-btn type="submit">Ingresar</v-btn>
                            <v-btn type="submit">Registrarse</v-btn>
                        </form>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
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
