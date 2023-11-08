<template lang="pug">
v-container(fluid)
  v-data-table(:headers="headers" :items="items" :server-items-length="total"
  :options.sync="options" :search="search")
    template(#item.options="{ item }")
      v-btn.mr-2(color="success" depressed icon @click="getStudent(item)")
        v-icon mdi-pencil
      v-btn.mr-2(v-if="item.status === 'PENDING'" depressed icon
        @click="resendLink(item)")
        v-icon mdi-email-fast

  v-dialog(v-model="dialogEdit" max-width="600px"
    :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-form(ref="form" @submit.prevent="saveStudent")
      v-card(flat :tile="$vuetify.breakpoint.smAndDown")
        v-card-title.primary.white--text
          .me-2 {{ formTitle }}
          v-item-group(v-model="onboarding" class="text-center" mandatory)
            v-item(v-for="n in 3" :key="`btn-${n}`"
            v-slot="{ active, toggle }")
              v-btn.white--text(:input-value="active" icon @click="toggle")
                v-icon mdi-record
          v-spacer
          v-btn.white--text(icon @click="dialogEdit=false")
            v-icon mdi-close
        v-window(v-model="onboarding")
          v-window-item
            v-card(flat)
              v-card-text
                v-row(dense)
                  v-col(cols="12" md="6")
                    v-select(v-model="create" label="Registrar como"
                    :items="createOptions")
                  v-col.primary--text(cols="12" md="12")
                    | Información del {{ create.toLowerCase() }}
                  v-col(cols="12" md="6")
                    text-field(v-model="form.name" label="Nombre"
                    :rules="generalRules")
                  v-col(cols="12" md="6")
                    text-field(v-model="form.lastname" label="Apellido"
                    :rules="generalRules")
                  v-col(cols="12" :md="create == 'Estudiante' ? 6 : 12")
                    text-field(v-model="form.document" label="Cédula"
                    :rules="generalRules")
                  v-col(v-if="create == 'Estudiante'" cols="12" md="6")
                    text-field(v-model="form.username" label="Usuario"
                    :rules="generalRules")
                  v-col(v-if="create == 'Estudiante'" cols="12" md="12")
                    text-field(v-model="form.email" label="Correo"
                    :rules="generalRules")
                  v-col(v-if="create == 'Estudiante'" cols="12" md="12")
                    text-field-password(v-model="form.password" label="Contraseña"
                    :rules="passwordEmptyRules")
                  v-col(cols="12" md="12")
                    v-file-input(v-model="photo" filled dense
                    prepend-inner-icon="mdi-paperclip" :prepend-icon="null"
                    label="Foto" hide-details="auto")
          v-window-item
            v-card(flat)
              v-card-text.my-3
                v-row(dense)
                  v-col.primary--text(cols="12" md="12")
                    | Información del {{ create.toLowerCase() }}
                  v-col(cols="12" md="6")
                    text-field(v-model="form.hospital"
                    label="Clínica de atención" :rules="[]")
                  v-col(cols="12" md="6")
                    text-field(v-model="form.diagnosis"
                    label="Diagnóstico" :rules="[]")
                  v-col(cols="12" md="6")
                    text-field(v-model="form.eps"
                    label="EPS" :rules="[]")
                  v-col(cols="12" md="6")
                    text-field(v-model="form.born_at"
                    label="Fecha de nacimiento" :rules="[]")
                  v-col(cols="12" md="6")
                    v-select(v-model="form.gender" filled dense :items="genders"
                    label="Género" hide-details="auto")
                  v-col(cols="12" md="6")
                    v-checkbox(v-model="form.godfather" label="¿Tiene padrino?"
                    hide-details="auto")
          v-window-item
            v-card(flat)
              v-card-text.my-3
                v-row(dense)
                  v-col.primary--text(cols="12" md="12")
                    | Información del {{ create.toLowerCase() }}
                  v-col(cols="12" md="12")
                    v-select(v-model="form.tutorsid" filled dense multiple
                    small-chips :items="tutors" label="Acudientes"
                    hide-details="auto" item-text="full_relationship"
                    item-value="_id")
                  v-col(cols="12" md="6")
                    text-field(v-model="form.city" label="Ciudad" :rules="[]")
                  v-col(cols="12" md="6")
                    text-field(v-model="form.neighborhood"
                    label="Barrio" :rules="[]")
                  v-col(cols="12" md="12")
                    text-field(v-model="form.address"
                    label="Dirección" :rules="[]")
                  v-col(cols="12" md="12")
                    v-textarea(filled dense v-model="form.observations"
                    label="Observaciones" hide-details="auto")
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
import passwordsEmptyRules from '../../mixins/form-rules/passwordsEmpty'
import generalRules from '~/mixins/form-rules/general-rules'
import { studentUrl, tutorUrl } from '~/mixins/routes'

export default {
  mixins: [generalRules, passwordsEmptyRules],

  data () {
    return {
      options: {},
      total: -1,
      items: [],
      tutors: [],
      onboarding: 0,
      create: 'Estudiante',
      form: {
        _id: '',
        name: '',
        lastname: '',
        document: '',
        username: '',
        email: '',
        password: ''
      },
      photo: null,
      search: ''
    }
  },

  head () {
    return { title: 'Students' }
  },

  computed: {
    headers () {
      return [
        { text: 'Estudiante', value: 'fullname' },
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
    },
    formTitle () {
      return this.form._id
        ? `Editar ${this.create.toLocaleLowerCase()}`
        : `Crear ${this.create.toLocaleLowerCase()}`
    },
    genders () {
      return ['Niño', 'Niña']
    },
    createOptions () {
      return ['Estudiante', 'Paciente']
    }
  },

  watch: {
    options: { handler () { this.getData() } },
    dialogEdit (value) {
      if (!value) {
        this.$refs.form.reset()
        this.form._id = ''
        this.onboarding = 0
        this.create = 'Estudiante'
      } else {
        this.getTutors()
        this.$refs.form && this.$refs.form.resetValidation()
      }
    }
  },

  beforeMount () {
    this.moduleSlug = 'Estudiantes'
  },

  methods: {
    async getData () {
      try {
        const data = await this.$axios.$get(studentUrl)
        this.items = data.items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveStudent () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
            `${studentUrl}${this.form._id}`, this.form))
        } else {
          ({ message } = await this.$axios.$post(studentUrl, this.form))
        }

        this.getData()
        this.dialogEdit = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getStudent (item) {
      try {
        this.form = (await this.$axios.$get(`${studentUrl}${item._id}`))
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getTutors () {
      try {
        this.tutors = (await this.$axios.$get(tutorUrl)).items
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
