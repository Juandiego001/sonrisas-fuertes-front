<template lang="pug">
v-container
  v-row.mt-3
    v-col(cols="12" md="6")
      v-card(elevation="0" max-width="700px")
        v-card-title
          v-row(align="center" no-gutters)
            v-col(cols="2" sm="1" md="1")
              v-icon mdi-account
            v-col
              p.subtitle-1.mb-0 {{ activity.fullname }}
              p.subtitle-1.mb-0 {{ $moment(activity.created_at) }}
        v-card-text
          v-row
            v-col(cols="12")
              .display-1 {{ activity.title }}
            v-col(cols="12")
              pre.body-2 {{ activity.description }}

    v-col(cols="12" md="6")
      v-card(max-width="400px")
        v-card-title.primary--text {{ formTitleDelivery() }}

        //- Para mostrar la edición de la entrega
        v-card-text(v-if="activity.comments && activity.comments.length")
          v-row
            v-col(cols="12")
              .black--text {{ activity.comments[0].description }}
            template(v-if="activity.comments[0].attachments.length")
              v-col.py-0.d-flex.align-center(cols="12"
              v-for="attachment, index in activity.comments[0].attachments"
              :key="`attachment.${index}`")
                  template(v-if="!attachment.isLink")
                      v-icon.primary--text.me-1 mdi-upload
                      a(:href="attachment.url") {{ attachment.real_name }}
                  template(v-else)
                      v-icon.primary--text.me-1 mdi-attachment
                      a(:href="attachment.url") {{ attachment.url }}
            v-col.d-flex(cols="12")
              v-spacer
              v-btn(icon color="primary"
              @click="getComment(activity.comments[0])")
                v-icon mdi-pencil
              v-btn(icon color="error"
              @click="showDelete(activity.comments[0])")
                v-icon mdi-trash-can

        //- Para mostrar la creación de la entrega
        v-card-text(v-else)
          v-form(ref="form" @submit.prevent="saveComment")
            v-row
              v-col(cols="12")
                v-textarea(v-model="form.description"  filled dense
                label="Descripción" hide-details="auto" auto-grow)
              v-col.py-0.d-flex.align-center(v-if="files.length" cols="12")
                v-icon.me-1 mdi-upload
                | {{ files.length + ' archivo(s)' }}
                v-spacer
                v-btn(icon @click="files=[]")
                  v-icon mdi-close
              v-col.py-0.d-flex.align-center(v-if="links.length" cols="12")
                v-icon.me-1 mdi-attachment
                | {{ links.length + ' enlace(s)' }}
                v-spacer
                v-btn(icon @click="links=[]")
                  v-icon mdi-close
              v-col(cols="12")
                v-card-actions
                  v-btn(icon @click="showFiles=true")
                    v-icon.primary--text mdi-upload
                  v-btn(icon @click="showLinks=true")
                    v-icon.primary--text mdi-attachment
                  v-spacer
                  v-btn(color="primary" type="submit"
                  :disabled="isDisabled") Guardar

    dialog-files(v-model="showFiles" :addFiles="addFiles")
    dialog-links(v-model="showLinks" :addLinks="addLinks")
    dialog-comment(v-model="dialogEdit" :publicationid="activity.id"
    :getData="getData" :comment="form")
    dialog-delete-comment(v-model="showDeleteComment" :getData="getData"
    :comment="form")
</template>

<script>
import { activityUrl, commentUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
  data () {
    return {
      showDeleteComment: false,
      showFiles: false,
      showLinks: false,
      activity: {},
      files: [],
      links: [],
      form: {
        _id: '',
        publicationid: '',
        description: '',
        isDelivery: true,
        created_at: '',
        updated_at: '',
        updated_by: ''
      }
    }
  },

  head () {
    return { title: `Activities | ${this.activity.title}` }
  },

  computed: {
    formTitle () {
      return this.form._id
        ? 'Editar entrega'
        : 'Crear entrega'
    },
    isDisabled () {
      if (this.files.length === 0 && this.links.length === 0 &&
      this.form.description === '') { return true } else { return false }
    }
  },

  watch: {
    dialogEdit (value) {
      if (!value) {
        this.form._id = ''
        this.$refs.form && this.$refs.form.resetValidation()
        this.$refs.form && this.$refs.form.reset()
      }
    }
  },

  beforeMount () {
    this.getData()
  },

  methods: {
    async getData () {
      try {
        this.activity = await this.$axios.$get(
          `${activityUrl}${this.$route.params.id}`)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
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
          this.form.publicationid = this.activity._id;
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
    async getComment (item) {
      try {
        this.form = await this.$axios.$get(`${commentUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async showDelete (item) {
      try {
        this.form = (await this.$axios.$get(`${commentUrl}${item._id}`))
        this.showDeleteComment = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deleteComment () {
      try {
        this.form.status = false
        const { message } = (await this.$axios.$patch(
          `${commentUrl}${this.form._id}`, this.form))
        this.getData()
        this.showDeleteComment = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    canEditComment (item) {
      return this.$store.state.session.profiles.includes('Administrador') ||
        item.username === this.$store.state.session.username
    },
    addFiles (files) { this.files = files },
    addLinks (links) { this.links = links },
    formTitleDelivery () {
      if (this.activity.comments && this.activity.comments.length) {
        return 'Editar entrega'
      } else {
        return 'Crear entrega'
      }
    }
  }
}
</script>
