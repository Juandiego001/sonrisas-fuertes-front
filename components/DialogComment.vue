<template lang="pug">
v-dialog(:value="dialog" max-width="600px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown")
    v-card-title.primary.white--text
      | {{ formTitle }}
      v-spacer
      v-btn(color="primary" fab small depressed @click="dialogEdit=false")
        v-icon mdi-close
    v-card-text.mt-3
      v-form(ref="form" @submit.prevent="saveComment")
        v-row(dense)
          v-col.primary--text(cols="12")
            | Información del comentario
          v-col(cols="12")
            v-textarea(v-model="form.description" rows="2" auto-grow
            label="Comentario" :rules="generalRules")
          v-col.d-flex.mt-3(cols="12" md="12")
            v-badge.me-2(:content="files.length" color="primary"
            :value="files.length" overlap)
              v-btn(icon @click="showFiles=true")
                v-icon.primary--text mdi-upload
            v-badge(:content="links.length" color="primary"
            :value="links.length" overlap)
              v-btn(icon @click="showLinks=true")
                v-icon.primary--text mdi-attachment
          v-row.my-2(dense v-if="form.files || form.links")
            template(v-if="form.files")
              v-col(cols="12" v-for="file, index in form.files"
              :key="`act.file${index}`")
                v-icon.primary--text.me-1 mdi-upload
                a.me-2(:href="`${downloadUrl}/${file._id}`"
                target="_blank")
                  | {{ file.real_name }}
                v-btn(icon color="error" @click="showDelete(file, 'file')")
                  v-icon mdi-trash-can
            template(v-if="form.links")
              v-col(cols="12" v-for="link, index in form.links"
              :key="`act.link${index}`")
                v-icon.primary--text.me-1 mdi-attachment
                a.me-2(:href="link.url")
                  | {{ link.shortcut }}
                v-btn(icon color="error" @click="showDelete(link, 'link')")
                  v-icon() mdi-trash-can
        v-card-actions
          v-spacer
          v-btn(color="primary" type="submit") Guardar

  dialog-files(v-model="showFiles" :addFiles="addFiles")
  dialog-links(v-model="showLinks" :addLinks="addLinks")
  dialog-delete(v-model="showDeleteAttachments" text="archivo/enlace"
  :doDelete="deleteAttachments")
</template>

<script>
import { commentUrl, fileUrl, linkUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],

  model: {
    prop: 'dialog',
    event: 'input'
  },

  props: {
    dialog: {
      default: false,
      type: Boolean
    },
    getData: {
      default: () => {},
      type: Function
    },
    publicationid: {
      default: '',
      type: String
    },
    comment: {
      default: () => ({
        _id: '',
        publicationid: '',
        description: '',
        created_at: '',
        updated_at: '',
        updated_by: ''
      }),
      type: Object
    }
  },

  data () {
    return {
      showDeleteAttachments: false,
      showFiles: false,
      showLinks: false,
      text: '',
      attachmentid: '',
      attachmentType: 'file',
      files: [],
      links: [],
      form: {
        _id: '',
        publicationid: '',
        description: '',
        created_at: '',
        updated_at: '',
        updated_by: ''
      }
    }
  },

  computed: {
    formTitle () {
      return this.comment._id
        ? 'Editar comentario'
        : 'Crear comentario'
    },
    downloadUrl () {
      return `${fileUrl}download`
    }
  },

  watch: {
    dialog (value) {
      if (!value) {
        this.form = {
          _id: '',
          title: '',
          description: '',
          created_at: '',
          updated_by: '',
          updated_at: ''
        }
        this.$refs.form.resetValidation()
        this.files = []
        this.links = []
      } else {
        this.form = this.$clone(this.comment)
        this.$refs.form && this.$refs.form.resetValidation()
      }
    }
  },

  methods: {
    async getComment () {
      try {
        this.form = (await this.$axios.$get(`${commentUrl}${this.form._id}`))
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    getFormData () {
      delete this.form.links
      delete this.form.files
      const formData = new FormData()
      for (const key of Object.keys(this.form)) {
        formData.append(key, this.form[key])
      }
      if (this.files.length) {
        for (const file of this.files) {
          formData.append('files', file)
        }
      }
      if (this.links.length) {
        for (const link of this.links) {
          formData.append('links', JSON.stringify(link))
        }
      }
      return formData
    },
    async saveComment () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
            `${commentUrl}${this.form._id}`, this.getFormData()))
        } else {
          this.form.publicationid = this.publicationid;
          ({ message } = await this.$axios.$post(commentUrl,
            this.getFormData()))
        }
        this.getData()
        this.dialogEdit = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    addFiles (files) { this.files = files },
    addLinks (links) { this.links = links },
    showDelete (item, attachmentType) {
      this.attachmentid = item._id
      this.attachmentType = attachmentType
      this.showDeleteAttachments = true
    },
    async deleteAttachments () {
      try {
        let message
        if (this.attachmentType === 'file') {
          ({ message } = await this.$axios.$delete(
            `${fileUrl}${this.attachmentid}`))
        } else {
          ({ message } = await this.$axios.$delete(
            `${linkUrl}${this.attachmentid}`))
        }
        this.getComment()
        this.getData()
        this.showDeleteAttachments = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>
