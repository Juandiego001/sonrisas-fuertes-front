<template>
  <v-dialog
    :value="dialog"
    max-width="600px"
    scrollable
    :fullscreen="$vuetify.breakpoint.smAndDown"
    @input="ev => $emit('input', ev)"
  >
    <v-card flat :tile="$vuetify.breakpoint.smAndDown" scrollable>
      <v-card-title class="primary white--text">
        Mi perfil
        <v-spacer />
        <v-btn
          fab
          small
          depressed
          color="primary"
          @click="$emit('input', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-3">
        <v-expansion-panels v-model="panel" flat>
          <v-expansion-panel>
            <v-expansion-panel-header class="primary--text px-0">
              Perfil
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="profile.name"
                      label="Nombre"
                      filled
                      readonly
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="profile.lastname"
                      label="Apellido"
                      filled
                      readonly
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="profile.username"
                      label="Usuario"
                      filled
                      readonly
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="profile.document"
                      label="Documento"
                      filled
                      readonly
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :value="profile.email"
                      label="Correo"
                      filled
                      readonly
                      hide-details
                      dense
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="primary--text px-0">
              Cambiar contraseña
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form ref="form" @submit.prevent="changePassword">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.current_password"
                      label="Contraseña actual"
                      filled
                      hide-details
                      type="password"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.new_password"
                      label="Nueva contraseña"
                      filled
                      hide-details="auto"
                      type="password"
                      :rules="passwordRules"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="confirmPassword"
                      label="Confirmar contraseña"
                      filled
                      type="password"
                      :rules="passwordRules"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-card flat>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" depressed type="submit">
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { changePasswordUrl } from '~/mixins/routes'
import passwordRules from '~/mixins/form-rules/passwords'

export default {
  name: 'ProfilePage',
  mixins: [passwordRules],

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
      confirmPassword: ''
    }
  },

  methods: {
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
    }
  }
}

</script>
