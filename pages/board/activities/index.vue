<template lang="pug">
v-container.pt-0.align-center
  v-card.mx-auto(max-width="800px")
    v-img.align-end(src="/classroom.jpg" height="100px"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
      v-card-title.white--text.text-h5 Actividades

  v-card.mx-auto(flat max-width="800px")
    v-card-text.mx-0.px-0
      v-data-iterator(:items="items" :search="search"
      :itemsPerPage.sync="itemsPerPage"
      :footer-props="{itemsPerPageOptions: [3, 5, 7]}")
        template(#item="{ item }")
          card-activity(:item="item" :getData="getData"
          :getActivity="getActivity" :key="`activity.${item._id}`")

  v-dialog(v-model="dialogEdit" max-width="700px" scrollable
  :fullscreen="$vuetify.breakpoint.smAndDown")
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
      v-card-title.primary.white--text
        | {{ formTitle }}
        v-spacer
        v-btn.white--text(icon @click="dialogEdit=false")
          v-icon mdi-close
      v-card-text.mt-3
        v-form(ref="form" @submit.prevent="saveActivity")
          v-row(dense)
            v-col.primary--text(cols="12")
              | Información de la actividad
            v-col(cols="12" md="12")
              text-field(v-model="form.title" label="Título"
              :rules="generalRules")
            v-col(cols="12" md="12")
              v-textarea(v-model="form.description" rows="2"
              label="Descripción" auto-grow hide-details="auto")
            v-col.d-flex.mt-3(cols="12" md="12")
              v-badge.me-2(:content="files.length" color="primary"
              :value="files.length" overlap)
                v-btn(icon @click="showFiles=true")
                  v-icon.primary--text mdi-upload
              v-badge(:content="links.length" color="primary"
              :value="links.length" overlap)
                v-btn(icon @click="showLinks=true")
                  v-icon.primary--text mdi-attachment
            v-row.mt-2(dense v-if="form.files || form.links")
              template(v-if="form.files")
                v-col.py-0(cols="12" v-for="file, index in form.files"
                :key="`act.file${index}`")
                  v-icon.primary--text.me-1 mdi-upload
                  a(:href="`${downloadUrl}/${file._id}`" target="_blank")
                    | {{ file.real_name }}
              template(v-if="form.links")
                v-col.py-0(cols="12" v-for="link, index in form.links"
                :key="`act.link${index}`")
                  v-icon.primary--text.me-1 mdi-attachment
                  a(:href="link.url") {{ link.shortcut }}
          v-card-actions
              v-spacer
              v-btn(color="primary" type="submit") Guardar

  dialog-files(v-model="showFiles" :addFiles="addFiles")
  dialog-links(v-model="showLinks" :addLinks="addLinks")
  dialog-search(v-model="dialogSearch" :doSearch="doSearch")
</template>

<script>
import { activityUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
  data () {
    return {
      showDeletePublication: false,
      showFiles: false,
      showLinks: false,
      items: [],
      search: '',
      itemsPerPage: 3,
      files: [],
      links: [],
      form: {
        _id: '',
        title: '',
        description: '',
        created_at: '',
        updated_by: '',
        updated_at: ''
      }
    }
  },

  head () {
    return { title: 'Activities' }
  },

  computed: {
    formTitle () {
      return this.form._id
        ? 'Editar actividad'
        : 'Crear actividad'
    }
  },

  watch: {
    dialogEdit (value) {
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
      } else {
        this.$refs.form && this.$refs.form.resetValidation()
      }
    }
  },

  beforeMount () {
    this.getData()
  },

  methods: {
    async getData () {
      try {
        this.items = (await this.$axios.$get(activityUrl)).items
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
    async saveActivity () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
              `${activityUrl}${this.form._id}`, this.getFormData()))
        } else {
          ({ message } = await this.$axios.$post(
            activityUrl, this.getFormData()))
        }
        this.getData()
        this.dialogEdit = false
        this.links = this.files = []
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getActivity (item) {
      try {
        this.form = await this.$axios.$get(`${activityUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    addFiles (files) { this.files = files },
    addLinks (links) { this.links = links },
    doSearch (search) {
      this.search = search
      this.dialogSearch = false
    }
  }
}

</script>
