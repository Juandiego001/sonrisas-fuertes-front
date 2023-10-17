<template lang="pug">
v-dialog(:value="dialog" max-width="600px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown" scrollable)
    v-card-title.primary.white--text Mi perfil
      v-spacer
      v-btn(fab small depressed color="primary"
      @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text.py-3
      v-expansion-panels(v-model="panel" flat)
        v-expansion-panel
          v-expansion-panel-header.primary--text.px-0 Perfil
          v-expansion-panel-content
            v-row.mb-2
              v-col.text-center(cols="12" md="12")
                v-badge(bottom overlap offset-x="10" offset-y="10" avatar
                :color="form.photo ? 'error' : 'white'")
                  v-avatar(size="64" color="grey")
                    v-img(v-if="form.photo" :src="`${photoUrl}${form.photo}`")
                    v-icon.white--text(v-else large) mdi-account
                  template(#badge)
                    v-icon.mt-1(v-if="form.photo" @click="removePhoto")
                      | mdi-trash-can
            v-form
              v-row.mb-3(dense)
                v-col(cols="12" md="6")
                  v-text-field(:value="profile.name" label="Nombre" filled
                  readonly hide-details dense)
                v-col(cols="12" md="6")
                  v-text-field(:value="profile.lastname" label="Apellido"
                  filled readonly hide-details dense)
                v-col(cols="12" md="6")
                  v-text-field(:value="profile.username" label="Usuario"
                  filled readonly hide-details dense)
                v-col(cols="12" md="6")
                  v-text-field(:value="profile.document" label="Documento"
                  filled readonly hide-details dense)
                v-col(cols="12")
                  v-text-field(:value="profile.email" label="Correo" filled
                  readonly hide-details dense)
                v-col(cols="12")
                  v-file-input(v-model="photo" filled dense label="Foto"
                  prepend-inner-icon="mdi-camera" :prepend-icon="null"
                  hide-details="auto")
              v-row(dense)
                v-spacer
                v-btn(color="primary" depressed) Guardar

        v-expansion-panel
          v-expansion-panel-header.primary--text.px-0 Cambiar contraseña
          v-expansion-panel-content
            v-form(ref="form" @submit.prevent="changePassword")
              v-row(dense)
                v-col(cols="12")
                  text-field-password(v-model="form.current_password"
                  label="Contraseña actual" :rules="generalRules"
                  autocomplete="current_password")
                v-col(cols="12" md="6")
                  text-field-password(v-model="form.new_password"
                  label="Nueva contraseña" :rules="passwordRules"
                  autocomplete="new_password")
                v-col(cols="12" md="6")
                  text-field-password(v-model="confirmPassword"
                  label="Confirmar contraseña" :rules="passwordRules")
                v-col(cols="12")
                  v-card(flat)
                    v-card-actions
                      v-spacer
                      v-btn(color="primary" depressed type="submit") Guardar
</template>

<script>
import { photoUrl, accountProfileUrl, changePasswordUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'
import passwordRules from '~/mixins/form-rules/passwords'

export default {
  name: 'ProfilePage',
  mixins: [generalRules, passwordRules],

  model: {
    prop: 'dialog',
    event: 'input'
  },

  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      model: 0,
      panel: [0],
      form: {
        new_password: '',
        current_password: ''
      },
      confirmPassword: '',
      photo: null
    }
  },

  computed: {
    photoUrl () { return `${photoUrl}/${this.session.photoUrl}` }
  },

  methods: {
    async getData () {
      try {
        const epoch = Math.floor(Date.now() / 1000)
        const user = await this.$axios.$get(accountProfileUrl)
        this.$store.commit('session/updateSession', { epoch, ...user })
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async changePassword () {
      try {
        if (!this.$refs.form.validate()) { return }
        const { message } = await this.$axios.$patch(
          changePasswordUrl, this.form)
        this.$refs.form.reset()
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async removePhoto () {
      try {
        const { message } = (await this.$axios.$delete(`
          ${accountProfileUrl}photo/${this.profile.username}`))
        this.getData()
        this.panel = [0]
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveProfile () {
      try {
        let message
        if (this.photo) {
          const formData = new FormData()
          formData.append('photo', this.photo);
          ({ message } = await this.$axios.$put(
            `${accountProfileUrl}/photo/${this.profile.username}`, formData))
        }
        this.photo = null
        this.getData()
        this.panel = [0]
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}

</script>
