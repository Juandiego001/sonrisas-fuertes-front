<template lang="pug">
v-container(fluid)
  v-data-table(:headers="headers" :items="items"
  :options.sync="options" :search="search")
    template(#item.options="{ item }")
      v-btn.success--text(icon @click="getFolder(item)")
        v-icon mdi-pencil
      v-btn.primary--text(icon @click="getFiles(item)")
        v-icon mdi-file-multiple

  v-dialog(v-model="dialogEdit" max-width="600px")
    v-card
      v-card-title.primary.white--text
        | {{ form._id ? 'Editar carpeta' : 'Crear carpeta' }}
        v-spacer
        v-btn.primary.white--text(icon @click="dialogEdit=false")
          v-icon mdi-close
      v-card-text.mt-3
        v-form(ref="form" @submit.prevent="saveFolder")
          v-row(dense)
            v-col(cols="12")
              .primary--text Información de la capreta
            v-col(cols="12")
              text-field(v-model="form.name" label="Nombre"
              :rules="generalRules")
          v-row(v-if="form._id")
            v-col.py-0(cols="12" md="12")
              v-checkbox.my-0(v-model="form.status" label="Activo" hide-details)
            v-col.text-caption(cols="12" md="6") {{ `ID: ${form._id}` }}
            v-col.text-caption.text-md-right(cols="12" md="6")
              p.my-0 Modificado por: {{ form.updated_by }}
              p.my-0 {{ $moment(form.updated_at)  }}
          v-card-actions.px-0
            v-spacer
            v-btn.primary(type="submit") Guardar

  v-dialog(v-model="dialogFiles" max-width="600px")
    v-card
      v-card-title.primary.white--text
        | Archivos
        v-spacer
        v-btn.primary.white--text(icon @click="dialogFiles=false")
          v-icon mdi-close
      v-card-text
        v-form(ref="formFile" @submit.prevent="saveFile")
          v-row(align="center")
            v-col(cols="12" md="10")
              v-file-input(v-model="file" label="Archivo"
              :rules="generalRules")
            v-col(cols="12" md="2")
              v-btn.primary(type="submit") Subir

        v-data-table(:headers="fileHeaders" :items="files")
          template(#item.options="{ item }")
            v-btn.primary--text(icon
            :href="`/api/folder/files/${item.folderid}/${item.hash_name}`")
              v-icon mdi-download

  dialog-search(v-model="dialogSearch" :doSearch="doSearch")
</template>

<script>
import { folderUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],

  data () {
    return {
      options: {},
      items: [],
      search: '',
      dialogFiles: false,
      file: null,
      files: [],
      folderid: '',
      form: {
        _id: '',
        name: '',
        status: false,
        updated_by: '',
        updated_at: ''
      }
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Carpeta', value: 'name' },
        { text: 'Estado', value: 'status' },
        { text: 'Opciones', value: 'options' }
      ]
    },
    fileHeaders () {
      return [
        { text: 'Nombre', value: 'real_name' },
        { text: 'Opciones', value: 'options' }
      ]
    }
  },

  watch: {
    options: {
      handler () {
        this.getData()
      }
    },
    dialogEdit (value) {
      if (!value) {
        this.$refs.form.resetValidation()
        this.$refs.form.reset()
      } else {
        this.$refs.form && this.$refs.form.resetValidation()
      }
    }
  },

  methods: {
    async getData () {
      try {
        this.items = (await this.$axios.$get(folderUrl)).items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveFolder () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
            `${folderUrl}${this.form._id}`, this.form))
        } else {
          ({ message } = await this.$axios.$post(folderUrl, this.form))
        }
        this.getData()
        this.dialogEdit = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getFolder (item) {
      try {
        this.form = await this.$axios.$get(`${folderUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getFiles (item) {
      try {
        this.folderid = item._id
        this.files = (await this.$axios.$get(
          `${folderUrl}files/${item._id}`)).items
        this.dialogFiles = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveFile () {
      try {
        if (!this.$refs.formFile.validate()) { return }
        const formData = new FormData()
        formData.append('file', this.file)
        const { message } = await this.$axios.$put(
          `${folderUrl}files/${this.folderid}`, formData)
        this.getFiles({ _id: this.folderid })
        this.file = null
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
