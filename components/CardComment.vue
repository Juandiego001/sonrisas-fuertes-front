<template lang="pug">
v-card.mt-4(rounded max-width="800px")
  v-card-text
    v-row(align="center" no-gutters)
      v-col(cols="2" sm="1" md="1")
        v-icon mdi-account
      v-col
        p.mb-0 {{ comment.fullname }}
        p.mb-0 {{ $moment(comment.created_at) }}
      v-col.mt-2(cols="12")
        p.subtitle.black--text {{ comment.description }}
      template(v-if="comment.files")
        v-col(cols="12" v-for="file, index in comment.files"
        :key="`act.file${index}`")
          v-icon.primary--text.me-1 mdi-upload
          a(:href="`${downloadUrl}/${file._id}`"
          target="_blank")
            | {{ file.real_name }}
      template(v-if="comment.links")
        v-col(cols="12" v-for="link, index in comment.links"
        :key="`act.link${index}`")
          v-icon.primary--text.me-1 mdi-attachment
          a(:href="link.url" target="_blank")
            | {{ link.shortcut }}

  v-card-actions
    v-row
      v-col.text-end
        template(v-if="canEdit(comment)")
          v-btn.primary--text(@click="getComment(comment)" icon)
            v-icon mdi-pencil
          v-btn.error--text(@click="showDelete(comment)" icon)
            v-icon mdi-trash-can

  dialog-delete(v-model="showDeleteComment" text="comentario"
  :doDelete="deleteComment")
</template>

<script>
import { commentUrl, fileUrl } from '~/mixins/routes'

export default {
  props: {
    comment: {
      default: () => ({
        fullname: '',
        created_at: '',
        description: ''
      }),
      type: Object
    },
    getData: {
      default: () => {},
      type: Function
    },
    getComment: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      showDeleteComment: false
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
        this.form = (await this.$axios.$get(`${commentUrl}${item._id}`))
        this.showDeleteComment = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deleteComment () {
      try {
        const { message } = await this.$axios.$delete(
          `${commentUrl}${this.form._id}`)
        this.getData()
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    canEdit (item) {
      return this.$ability.can('update', 'Comentarios') ||
        item.username === this.$store.state.session.username
    }
  }
}
</script>
