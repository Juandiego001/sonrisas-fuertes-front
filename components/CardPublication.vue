<template lang="pug">
v-card.mx-auto.mt-4(rounded max-width="800px")
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
      template(v-if="item.files")
        v-col(cols="12" v-for="file, index in item.files"
        :key="`act.file${index}`")
          v-icon.primary--text.me-1 mdi-upload
          a(:href="`${downloadUrl}/${file._id}`" target="_blank")
            | {{ file.real_name }}
      template(v-if="item.links")
        v-col(cols="12" v-for="link, index in item.links"
        :key="`act.link${index}`")
          v-icon.primary--text.me-1 mdi-attachment
          a(:href="link.url" target="_blank") {{ link.shortcut }}

  v-card-actions
    v-row
      v-col.text-end
        v-btn(nuxt :to="`/board/publications/${item._id}`" icon)
          v-icon mdi-eye
        template(v-if="canEdit(item)")
          v-btn.primary--text(@click="getPublication(item)" icon)
            v-icon mdi-pencil
          v-btn.error--text(@click="showDelete(item)" icon)
            v-icon mdi-trash-can

  dialog-delete(v-model="showDeletePublication" text="publicacion"
  :doDelete="deletePublication")
</template>

<script>
import { publicationUrl, fileUrl } from '~/mixins/routes'
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

  computed: {
    downloadUrl () {
      return `${fileUrl}download`
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
        const formData = new FormData()
        formData.append('status', false)
        const { message } = (await this.$axios.$patch(
          `${publicationUrl}${this.form._id}`, formData))
        this.getData()
        this.showDeletePublication = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    canEdit (item) {
      return this.$ability.can('update', 'Publicaciones') ||
        item.username === this.$store.state.session.username
    }
  }
}
</script>
