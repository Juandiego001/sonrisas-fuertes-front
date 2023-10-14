<template lang="pug">
v-container(fluid)
  v-data-table(:headers="headers" :items="items" :server-items-length="total"
  :options.sync="options")
    template(#item.options="{ item }")
      v-btn.mr-2(color="success" depressed icon @click="getGroup(item)")
        v-icon mdi-pencil
      v-btn(color="primary" depressed icon @click="getStudents(item)")
        v-icon mdi-account-school
  v-dialog(v-model="dialogEdit" max-width="600px"
  :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-form(ref="form" @submit.prevent="saveGroup")
      v-card(flat :tile="$vuetify.breakpoint.smAndDown")
        v-card-title.primary.white--text
          | {{ form._id ? 'Formulario editar grupo' : 'Formulario crear grupo' }}
          v-spacer
          v-btn.white--text(icon @click="dialogEdit=false")
            v-icon mdi-close
        v-card-text.my-3
          v-row(dense)
            v-col.primary--text(cols="12" md="12") Información del grupo
            v-col cols="12" md="12"
              text-field(v-model="form.name" label="Nombre"
              :rules="generalRules")
          v-row(v-if="form._id" dense)
            v-col(cols="12")
              v-checkbox(v-model="form.status" label="Activo")
            v-col.text-caption(cols="12" md="6") ID: {{ form._id }}
            v-col.text-caption.text-md-right(cols="12" md="6")
              | Modificado por: {{ form.updated_by }}
              | {{ $moment(form.updated_at) }}
        v-card-actions
          v-spacer
          v-btn(color="primary" depressed type="submit") Guardar

  dialog-students-group(v-model="dialogStudents" :groupid="groupid"
  :items="students")
</template>

<script>
import generalRules from '~/mixins/form-rules/general-rules'
import { groupUrl, studentUrl } from '~/mixins/routes'

export default {
  mixins: [generalRules],

  data () {
    return {
      options: {},
      total: -1,
      items: [],
      dialogStudents: false,
      students: [],
      form: {
        _id: '',
        name: '',
        status: ''
      },
      groupid: ''
    }
  },

  head () {
    return { title: 'Groups' }
  },

  computed: {
    headers () {
      return [
        { text: 'Grupo', value: 'name' },
        { text: 'Estado', value: 'status' },
        { text: 'Opciones', value: 'options' }
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
  },

  methods: {
    async getData () {
      try {
        const data = await this.$axios.$get(groupUrl)
        this.items = data.items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveGroup () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
              `${groupUrl}${this.form._id}`, this.form))
        } else {
          ({ message } = await this.$axios.$post(groupUrl, this.form))
        }

        this.getData()
        this.dialogEdit = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getGroup (item) {
      try {
        const group = await this.$axios.$get(`${groupUrl}${item._id}`)
        this.form = group
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getStudents (item) {
      try {
        this.students = (await this.$axios.$get(
          `${studentUrl}group?groupid=${item._id}`)).items
        this.groupid = item._id
        this.dialogStudents = true
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>
