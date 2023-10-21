<template lang="pug">
v-container.pt-0.align-center
  v-card.mx-auto(max-width="800px")
    v-img.align-end(src="/classroom.jpg" height="100px"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
      v-card-title.white--text.text-h5 Publicaciones

  v-card.mx-auto.mt-4.py-3(v-for="item in items" rounded max-width="800px"
  :key="`publication.${item._id}`")
    v-card-text.px-0
      v-row.mx-3
        v-col.d-flex.align-center.justify-center(cols="12" md="1")
          v-icon mdi-account
        v-col.text-start(cols="12" md="11")
          span {{ item.fullname }}
          p {{ $moment(item.created_at) }}
        v-col(cols="12")
          p.subtitle.black--text {{ item.title }}
          p.subtitle.black--text {{ item.description }}
    v-card-actions
      v-row
        v-spacer
        v-btn.me-2(nuxt :to="`/board/publications/${item._id}`" icon)
          v-icon mdi-eye
        template(v-if="canEditComment(item)")
        v-btn.me-2.primary--text(@click="getPublication(item)" icon)
          v-icon mdi-pencil
        v-btn.error--text(@click="showDelete(item)" icon)
          v-icon mdi-trash-can

  v-dialog(v-model="dialogEdit" max-width="700px"
  :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
      v-card-title.primary.white--text
        | {{ form._id ? 'Formulario editar publicación' : 'Formulario crear publicación' }}
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

  v-dialog(v-model="showDeletePublication" max-width="500px"
  :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
      v-card-title.error.white--text
        | Confirmar eliminación
        v-spacer
        v-btn.white--text(icon @click="showDeletePublication=false")
          v-icon mdi-close
      v-card-text.mt-3 ¿Seguro que desea eliminar la publicación?
      v-card-actions
        v-spacer
        v-btn.error(@click="deletePublication") Confirmar
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
    },
    async showDelete (item) {
      try {
        this.form = (await this.$axios.$get(`${publicationUrl}${item._id}`))
        this.showDeletePublication = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deletePublication () {
      try {
        this.form.status = false
        const { message } = (await this.$axios.$patch(
          `${publicationUrl}${this.form._id}`, this.form))
        this.getData()
        this.showDeletePublication = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    canEditComment (item) {
      return this.$store.state.session.profiles.includes('Administrador') ||
      item.username === this.$store.state.session.username
    }
  }
}

</script>
