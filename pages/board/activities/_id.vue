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

    v-col(v-if="!canSearch" cols="12" md="6")
      v-card(max-width="400px")
        v-card-title.primary--text {{ formTitle }}

        //- Para mostrar la edición de la entrega
        v-card-text(v-if="activity.delivery")
          v-row
            v-col(cols="12")
              .black--text {{ activity.delivery.description }}
            v-col.d-flex.align-center(cols="12"
              v-for="file, index in activity.delivery.files"
              :key="`attachment.${index}`")
                v-icon.primary--text.me-1 mdi-upload
                a(:href="`${downloadUrl}/${file._id}`" target="_blank")
                  | {{ file.real_name }}
            v-col(cols="12"
            v-for="link, index in activity.delivery.links")
              v-icon.primary--text.me-1 mdi-attachment
              a(:href="link.url" target="_blank") {{ link.url }}
            v-col.d-flex(cols="12")
              v-spacer
              v-btn(icon color="primary"
              @click="getDelivery(activity.delivery)")
                v-icon mdi-pencil
              v-btn(icon color="error"
              @click="showDelete(activity.delivery)")
                v-icon mdi-trash-can

        //- Para mostrar la creación de la entrega
        v-card-text(v-else)
          v-form(ref="form" @submit.prevent="saveDelivery")
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
                  v-btn(v-if="isVisible" color="primary" type="submit") Guardar

    dialog-files(v-model="showFiles" :addFiles="addFiles")
    dialog-links(v-model="showLinks" :addLinks="addLinks")
    dialog-delivery(v-model="dialogEdit" :activityid="activity.id"
    :getData="getData" :comment="form")
    dialog-delete(v-model="showDeleteDelivery" text="entrega"
    :doDelete="deleteDelivery")
</template>

<script>
import { activityUrl, deliveryUrl, fileUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
  data () {
    return {
      showDeleteDelivery: false,
      showFiles: false,
      showLinks: false,
      activity: {
        title: '',
        description: '',
        created_at: '',
        updated_at: '',
        updated_by: ''
      },
      files: [],
      links: [],
      form: {
        _id: '',
        activityid: '',
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
      return this.activity.delivery
        ? 'Editar entrega'
        : 'Crear entrega'
    },
    isVisible () {
      if (this.files.length === 0 && this.links.length === 0 &&
      this.form.description === '') { return false } else { return true }
    },
    downloadUrl () {
      return `${fileUrl}download`
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
    this.moduleSlug = 'Entregas'
    this.getData()
  },

  methods: {
    getData () {
      if (this.$ability.can('read', 'Entregas')) {
        this.getActivityDeliveries()
      } else {
        this.getActivityDelivery()
      }
    },
    async getActivityDeliveries () {
      try {
        this.activity = await this.$axios.$get(
          `${activityUrl}deliveries/${this.$route.params.id}`)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getActivityDelivery () {
      try {
        this.activity = await this.$axios.$get(
          `${activityUrl}delivery/${this.$route.params.id}`)
        this.form.activityid = this.$route.params.id
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
    async saveDelivery () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
                `${deliveryUrl}${this.form._id}`, this.getFormData()))
        } else {
          ({ message } = await this.$axios.$post(deliveryUrl,
            this.getFormData()))
        }
        this.getData()
        this.$refs.form.reset()
        this.dialogEdit = false
        this.links = this.files = []
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getDelivery (item) {
      try {
        this.form = await this.$axios.$get(`${deliveryUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async showDelete (item) {
      try {
        this.form = (await this.$axios.$get(`${deliveryUrl}${item._id}`))
        this.showDeleteDelivery = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deleteDelivery () {
      try {
        this.form.status = false
        const { message } = (await this.$axios.$patch(
          `${deliveryUrl}${this.form._id}`, this.form))
        this.getData()
        this.showDeleteDelivery = false
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
    addLinks (links) { this.links = links }
  }
}
</script>
