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
      v-divider.mt-5
      card-comment(v-for="item in publication.comments" :item="item"
      :getData="getData" :getComment="getComment" :key="`comment.${item._id}`")

  dialog-comment(v-model="dialogEdit" :getData="getData"
  :publicationid="publication._id" :comment="form")
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

  computed: {
    formTitle () {
      return this.form._id
        ? 'Editar comentario'
        : 'Crear comentario'
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
    async getComment (item) {
      try {
        this.form = await this.$axios.$get(`${commentUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>
