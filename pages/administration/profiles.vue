<template lang="pug">
v-container(fluid)
  v-data-table(:headers="headers" :items="items" :server-items-length="total"
    :options.sync="options")
    template(#item.options="{ item }")
      v-btn(icon @click="getProfile(item)")
        v-icon.primary--text mdi-shield-account-variant-outline
    template(#item.status="{ item }")
      | {{ item.status ? 'Activo' : 'Inactivo' }}

  v-dialog(v-model="dialogEdit" max-width="600px"
  :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-form(ref="form" @submit.prevent="saveStudent")
      v-card(flat :tile="$vuetify.breakpoint.smAndDown")
        v-card-title.primary.white--text Permisos
          v-spacer
          v-btn.white--text( icon @click="dialogEdit=false")
            v-icon mdi-close
        v-card-text.my-3
          v-row(dense)
            v-col.primary--text(cols="12" md="12") Información del perfil
            v-col(cols="12" md="6")
              v-text-field(v-model="form.name" label="Nombre" filled dense
              required :rules="[generalRules]" hide-details="auto"
              maxlength="100")
          v-row(v-if="form._id" dense)
            v-col.text-caption(cols="12" md="6") ID: {{ form._id }}
            v-col.text-caption text-md-right(cols="12" md="6")
              | Modificado por: {{ form.updated_by }}
              | {{ $moment(form.updated_at) }}
        v-card-actions
          v-spacer
          v-btn(color="primary" depressed type="submit") Guardar

  dialog-permissions(v-model="dialogPermissions" :profile="form"
  :getProfile="getProfile")
</template>

<script>
import { profileUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  name: 'PermissionsPage',
  mixins: [generalRules],
  layout: 'default',

  data () {
    return {
      options: {},
      total: -1,
      items: [],
      form: {
        name: '',
        permissions: []
      },
      dialogPermissions: false
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Perfil', align: 'center', value: 'name' },
        { text: 'Estado', align: 'center', value: 'status' },
        { text: 'Opciones', align: 'center', value: 'options' }
      ]
    }
  },

  watch: {
    options: { handler () { this.getData() } },
    dialogEdit (value) {
      if (!value) {
        this.$refs.form.reset()
        this.form._id = ''
      } else {
        this.$refs.form && this.$refs.form.resetValidation()
      }
    }
  },

  methods: {
    async getData () {
      try {
        const data = await this.$axios.$get(profileUrl)
        this.items = data.items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getProfile (item) {
      try {
        this.form = await this.$axios.$get(`${profileUrl}${item._id}`)
        // eslint-disable-next-line no-console
        console.log('form**************', this.form)
        this.dialogPermissions = true
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>
