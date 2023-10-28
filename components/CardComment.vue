<template lang="pug">
v-card.mt-3(elevation="0")
    v-card-text
        v-row(align="center" no-gutters)
            v-col(cols="2" sm="1" md="1")
                v-icon mdi-account
            v-col
                p.mb-0 {{ item.fullname }}
                p.mb-0 {{ $moment(item.created_at) }}
            v-col.mt-2(cols="12")
                p {{ item.description }}
            v-col.text-end
                template(v-if="canEditComment(item)")
                    v-btn.me-2.primary--text(@click="getComment(item)" icon)
                        v-icon mdi-pencil
                    v-btn.error--text(@click="showDelete(item)" icon)
                        v-icon mdi-trash-can

    dialog-delete-comment(v-model="showDeleteComment" :comment="item"
    :getData="getData")
</template>

<script>
import { commentUrl } from '~/mixins/routes'

export default {
  props: {
    item: {
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

  methods: {
    async showDelete (item) {
      try {
        this.form = (await this.$axios.$get(`${commentUrl}${item._id}`))
        this.showDeleteComment = true
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
