<template lang="pug">
v-container(fluid)
  v-data-table(:headers="headers" :items="items"
  :options.sync="options" :search="search")
    template(#item.options="{ item }")
      v-btn.success--text(v-if="canUpdate" icon @click="getFolder(item)")
        v-icon mdi-pencil
      v-btn.primary--text(icon @click="getFiles(item)")
        v-icon mdi-file-multiple
    template(#item.status="{ item }")
      | {{ item.status ? 'Activo' : 'Inactivo' }}

  v-dialog(v-model="dialogEdit" max-width="600px")
    v-card
      v-card-title.primary.white--text
        | {{ formTitle }}
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
      v-card-text.mt-3
        v-form(v-if="canCreateFiles"
        ref="formFile" @submit.prevent="saveFile")
          v-row(align="center")
            v-col(cols="12" md="10")
              v-file-input(v-model="filesInput" label="Archivos"
              chips small-chips multiple :rules="fileRules")
            v-col(cols="12" md="2")
              v-btn.primary(type="submit" :disabled="!filesInput") Subir

        v-data-table(:headers="fileHeaders" :items="filesFolder")
          template(#item.options="{ item }")
            v-btn.primary--text(icon
            :href="`${downloadUrl}/${item._id}`")
              v-icon mdi-download
            v-btn.error--text(v-if="canDeleteFiles"
            icon @click="showDelete(item)")
              v-icon mdi-trash-can

  dialog-search(v-model="dialogSearch" :doSearch="doSearch")
  dialog-delete(v-model="showDeleteFiles" text="archivo"
  :doDelete="deleteFile")
</template>

<script>
import { folderUrl, fileUrl } from '~/mixins/routes'
import fileRules from '~/mixins/form-rules/files'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules, fileRules],

  data () {
    return {
      options: {},
      items: [],
      search: '',
      dialogFiles: false,
      filesInput: null,
      filesFolder: [],
      folderid: '',
      showDeleteFiles: false,
      fileToDelete: {
        _id: '',
        folderid: ''
      },
      form: {
        _id: '',
        name: '',
        updated_by: '',
        updated_at: ''
      }
    }
  },

  head () {
    return { title: 'Folders' }
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
    },
    formTitle () {
      return this.form._id ? 'Editar carpeta' : 'Crear carpeta'
    },
    canUpdate () {
      return this.$ability.can('update', 'Carpetas')
    },
    canCreateFiles () {
      return this.$ability.can('create', 'Archivos de carpetas')
    },
    canDeleteFiles () {
      return this.$ability.can('delete', 'Archivos de carpetas')
    },
    downloadUrl () {
      return `${fileUrl}download`
    }
  },

  watch: {
    options: {
      handler () {
        this.getData()
      }
    },
    filesInput (value) {
      if (!value) {
        this.$refs.formFile.resetValidation()
      }
    },
    dialogEdit (value) {
      if (!value) {
        this.$refs.form.resetValidation()
        this.$refs.form.reset()
        this.form = { _id: '', name: '', updated_by: '', updated_at: '' }
      } else {
        this.$refs.form && this.$refs.form.resetValidation()
      }
    },
    dialogFiles (value) {
      if (!value) {
        this.$refs.formFile.resetValidation()
        this.$refs.formFile.reset()
      } else {
        this.$refs.formFile && this.$refs.formFile.resetValidation()
      }
    }
  },

  beforeMount () {
    this.moduleSlug = 'Carpetas'
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
        this.filesFolder = (await this.$axios.$get(
          `${folderUrl}folder/files/${item._id}`)).items
        this.dialogFiles = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveFile () {
      try {
        if (!this.$refs.formFile.validate()) { return }
        const formData = new FormData()
        formData.append('folderid', this.folderid)
        for (const file of this.filesInput) {
          formData.append('files', file)
        }
        const { message } = await this.$axios.$put(`${fileUrl}multiple-files`, formData)
        this.getFiles({ _id: this.folderid })
        this.filesInput = null
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async showDelete (item) {
      try {
        this.fileToDelete = await this.$axios.$get(`${fileUrl}${item._id}`)
        this.showDeleteFiles = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deleteFile () {
      try {
        const { message } = await this.$axios.$delete(
          `${fileUrl}${this.fileToDelete._id}`)
        this.getFiles({ _id: this.folderid })
        this.showDeleteFiles = false
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
