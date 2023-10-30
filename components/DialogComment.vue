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
          v-col.d-flex(cols="12" md="12")
            v-btn.me-2(icon)
              v-icon.primary--text mdi-upload
            v-btn(icon)
              v-icon.primary--text mdi-attachment
        v-card-actions
          v-spacer
          v-btn(color="primary" type="submit") Guardar

  dialog-files(v-model="showFiles" :addFiles="addFiles")
  dialog-links(v-model="showLinks" :addLinks="addLinks")
</template>

<script>
import { commentUrl } from '~/mixins/routes'
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
      showFiles: false,
      showLinks: false,
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
    }
  },

  watch: {
    dialog (value) {
      if (!value) {
        this.form._id = ''
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
      } else {
        this.$refs.form && this.$refs.form.resetValidation()
      }
    },
    comment (value) {
      this.form = value
    }
  },

  methods: {
    getFormData () {
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
        formData.append('links', this.links)
      }
      return formData
    },
    async saveComment () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
            `${commentUrl}${this.form._id}`, this.form))
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
    addLinks (links) { this.links = links }
  }
}
</script>
