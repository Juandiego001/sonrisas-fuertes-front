<template lang="pug">
v-container.pt-0.align-center
  v-card.mx-auto(max-width="800px")
    v-img.align-end(src="/classroom.jpg" height="100px"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
      v-card-title.white--text.text-h5 Publicaciones

  card-publication(v-for="item in items" :item="item" :getData="getData"
  :getPublication="getPublication" :key="`publication.${item._id}`"
  :routeDetail="'/board/publications'")

  v-dialog(v-model="dialogEdit" max-width="700px" scrollable
  :fullscreen="$vuetify.breakpoint.smAndDown")
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
      v-card-title.primary.white--text
        | {{ formTitle }}
        v-spacer
        v-btn.white--text(icon @click="dialogEdit=false")
          v-icon mdi-close
      v-card-text.mt-3
        v-form(ref="form" @submit.prevent="savePublication")
          v-row(dense)
            v-col.primary--text(cols="12")
              | Información de la publicación
            v-col(cols="12" md="12")
              text-field(v-model="form.title" label="Título"
              :rules="generalRules")
            v-col(cols="12" md="12")
              v-textarea(v-model="form.description" rows="2"
              label="Descripción" auto-grow hide-details="auto")
            v-col.d-flex(cols="12" md="12")
              v-btn.me-2(icon)
                v-icon.primary--text mdi-upload
              v-btn(icon)
                v-icon.primary--text mdi-attachment
          v-card-actions
              v-spacer
              v-btn(color="primary" type="submit") Guardar
</template>

<script>
import { publicationUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
  data () {
    return {
      showDeletePublication: false,
      items: [],
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
    return { title: 'Publications' }
  },

  computed: {
    formTitle () {
      return this.form._id
        ? 'Editar publicación'
        : 'Crear publicación'
    }
  },

  watch: {
    dialogEdit (value) {
      if (!value) {
        this.$refs.form.reset()
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
        this.items = (await this.$axios.$get(publicationUrl)).items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async savePublication () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
            `${publicationUrl}${this.form._id}`, this.form))
        } else {
          ({ message } = await this.$axios.$post(publicationUrl, this.form))
        }
        this.getData()
        this.dialogEdit = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getPublication (item) {
      try {
        this.form = await this.$axios.$get(`${publicationUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}

</script>
