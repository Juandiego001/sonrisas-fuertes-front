<template lang="pug">
v-container
  v-card.ms-2.mt-2(elevation="0" max-width="700px")
    v-card-title
      v-row(align="center" no-gutters)
        v-col(cols="2" sm="1" md="1")
          v-icon mdi-account
        v-col
          p.subtitle-1.mb-0 {{ publication.fullname }}
          p.subtitle-1.mb-0 {{ $moment(publication.created_at) }}
    v-card-text
      v-row
        v-col(cols="12")
          .display-1 {{ publication.title }}
        v-col(cols="12")
          pre.body-2 {{ publication.description }}
      v-divider
      v-card.mt-3(v-for="comment in publication.comments" elevation="0"
      :key="`comment.${comment_id}`")
        v-card-text
          v-row(align="center" no-gutters)
            v-col(cols="2" sm="1" md="1")
              v-icon mdi-account
            v-col
              p.mb-0 {{ comment.fullname }}
              p.mb-0 {{ $moment(comment.created_at) }}
            v-col.mt-2(cols="12")
              p {{ comment.description }}
        v-card-actions
          v-row
            v-spacer
            template(v-if="canEditComment(comment)")
            v-btn.me-2.primary--text(@click="getComment(comment)" icon)
              v-icon mdi-pencil
            v-btn.error--text(@click="showDelete(comment)" icon)
              v-icon mdi-trash-can

  v-dialog(v-model="dialogEdit" max-width="600px" scrollable
  :fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
      v-card-title.primary.white--text
        | {{ form._id ? 'Formulario editar comentario' : 'Formulario crear comentario' }}
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

  v-dialog(v-model="showDeleteComment" max-width="500px"
  :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
      v-card-title.error.white--text
        | Confirmar eliminación
        v-spacer
        v-btn.white--text(icon @click="showDeleteComment=false")
          v-icon mdi-close
      v-card-text.mt-3 ¿Seguro que desea eliminar el comentario?
      v-card-actions
        v-spacer
        v-btn.error(@click="deleteComment") Confirmar
</template>

<script>
import { publicationUrl, commentUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
  data () {
    return {
      showDeleteComment: false,
      publication: {},
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

  head () {
    return { title: `Publications | ${this.publication.title}` }
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
        this.publication = await this.$axios.$get(
          `${publicationUrl}${this.$route.params.id}`)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async saveComment () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
                `${commentUrl}${this.form._id}`, this.form))
        } else {
          this.form.publicationid = this.publication._id;
          ({ message } = await this.$axios.$post(commentUrl, this.form))
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
    }
  }
}
</script>
