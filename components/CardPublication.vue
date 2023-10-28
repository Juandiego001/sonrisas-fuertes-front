<template lang="pug">
v-card.mx-auto.mt-4.py-3(rounded max-width="800px")
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
      v-col.text-end
        v-btn(nuxt :to="`${routeDetail}/${item._id}`" icon)
          v-icon mdi-eye
        template(v-if="canEditComment(item)")
          v-btn.primary--text(@click="getPublication(item)" icon)
            v-icon mdi-pencil
          v-btn.error--text(@click="showDelete(item)" icon)
            v-icon mdi-trash-can

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
export default {

  props: {
    item: {
      default: () => ({
        _id: '',
        fullname: '',
        created_at: '',
        title: '',
        description: ''
      }),
      type: Object
    },
    routeDetail: {
      default: '',
      type: String
    },
    getData: {
      default: () => {},
      type: Function
    },
    getPublication: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      showDeletePublication: false
    }
  },

  methods: {
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
