<template lang="pug">
v-container(fluid)
  v-data-table(:headers="headers" :items="items" :server-items-length="total"
  :options.sync="options" :search="search")
    template(#item.options="{ item }")
      v-btn.mr-2(color="success" depressed icon @click="getAdmin(item)")
        v-icon mdi-pencil
      v-btn.mr-2(v-if="item.status === 'PENDING'" depressed icon
        @click="resendLink(item)")
        v-icon mdi-email-fast

  v-dialog(v-model="dialogEdit" max-width="600px"
    :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-form(ref="form" @submit.prevent="saveAdmin")
      v-card(flat :tile="$vuetify.breakpoint.smAndDown")
        v-card-title.primary.white--text
          | {{ form._id ? 'Formulario editar administrador' : 'Formulario crear administrador' }}
          v-spacer
          v-btn.white--text(icon @click="dialogEdit=false")
            v-icon mdi-close
        v-card-text.my-3
          v-row(dense)
            v-col.primary--text(cols="12" md="12") Información del administrador
            v-col(cols="12" md="6")
              text-field(
                v-model="form.name"
                label="Nombre"
                :rules="generalRules")
            v-col(cols="12" md="6")
              text-field(v-model="form.lastname" label="Apellido"
              :rules="generalRules")
            v-col(cols="12" md="6")
              text-field(v-model="form.document" label="Cédula"
              :rules="documentRules")
            v-col(cols="12" md="6")
              text-field(v-model="form.username" label="Usuario"
              :rules="usernameRules")
            v-col(cols="12" md="12")
              text-field(v-model="form.email" label="Correo"
              :rules="emailRules")
            v-col(cols="12" md="12")
              text-field-password(v-model="form.password" label="Contraseña"
              :rules="passwordEmptyRules")
            v-col(cols="12" md="12")
              v-file-input(v-model="photo" filled dense
              prepend-inner-icon="mdi-paperclip" :prepend-icon="null"
              label="Foto" hide-details="auto")
          v-row(v-if="form._id" dense)
            v-col(cols="12")
              v-select(v-model="form.status" label="Estado" filled dense
              hide-details="auto" :items="userStatus" item-value="value"
              item-text="text")
            v-col.text-caption(cols="12" md="6") ID: {{ form._id }}
            v-col.text-caption.text-md-right(cols="12" md="6")
              | Modificado por: {{ form.updated_by }}
              | {{ $moment(form.updated_at) }}
        v-card-actions
          v-spacer
          v-btn(color="primary" depressed type="submit") Guardar
  dialog-search(v-model="dialogSearch" :doSearch="doSearch")
</template>

<script>
import passwordEmptyRules from '../../mixins/form-rules/passwordsEmpty'
import generalRules from '~/mixins/form-rules/general-rules'
import emailRules from '~/mixins/form-rules/emails'
import documentRules from '~/mixins/form-rules/documents'
import usernameRules from '~/mixins/form-rules/usernames'
import { resetPasswordUrl, adminUrl } from '~/mixins/routes'

export default {
  mixins: [generalRules, passwordEmptyRules, emailRules, documentRules,
    usernameRules],

  data () {
    return {
      options: {},
      total: -1,
      items: [],
      form: {
        _id: '',
        name: '',
        lastname: '',
        document: '',
        username: '',
        email: '',
        password: '',
        status: ''
      },
      photo: null,
      search: ''
    }
  },

  head () {
    return { title: 'Admins' }
  },

  computed: {
    headers () {
      return [
        { text: 'Administrador', value: 'fullname' },
        { text: 'Usuario', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Estado', value: 'status' },
        { text: 'Opciones', value: 'options' }
      ]
    },
    userStatus () {
      return [
        {
          text: 'Activo',
          value: 'ACTIVE'
        },
        {
          text: 'Pendiente de activación',
          value: 'PENDING',
          disabled: true
        },
        {
          text: 'Inactivo',
          value: 'INACTIVE'
        }
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

  beforeMount () {
    this.moduleSlug = 'Administradores'
  },

  methods: {
    async getData () {
      try {
        const data = await this.$axios.$get(adminUrl)
        this.items = data.items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveAdmin () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
              `${adminUrl}${this.form._id}`, this.form))
        } else {
          ({ message } = await this.$axios.$post(adminUrl, this.form))
        }

        this.getData()
        this.dialogEdit = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getAdmin (item) {
      try {
        const admin = await this.$axios.$get(`${adminUrl}${item._id}`)
        this.form = admin
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async resendLink (item) {
      try {
        const { message } = await this.$axios.$post(resetPasswordUrl,
          { email: item.email })
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    doSearch (value) {
      this.search = value
      this.dialogSearch = false
    }
  }
}
</script>
