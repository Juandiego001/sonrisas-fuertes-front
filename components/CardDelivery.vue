<template lang="pug">
v-card.mt-4(rounded max-width="800px")
  v-card-text
    v-row(align="center" no-gutters)
      v-col(cols="2" sm="1" md="1")
        v-icon mdi-account
      v-col
        p.mb-0 {{ delivery.fullname }}
        p.mb-0 {{ $moment(delivery.created_at) }}
      v-col.mt-2(cols="12")
        p.subtitle.black--text {{ delivery.description }}
      template(v-if="delivery.files")
        v-col(cols="12" v-for="file, index in delivery.files"
        :key="`act.file${index}`")
          v-icon.primary--text.me-1 mdi-upload
          a(:href="`${downloadUrl}/${file._id}`"
          target="_blank")
            | {{ file.real_name }}
      template(v-if="delivery.links")
        v-col(cols="12" v-for="link, index in delivery.links"
        :key="`act.link${index}`")
          v-icon.primary--text.me-1 mdi-attachment
          a(:href="link.url" target="_blank")
            | {{ link.shortcut }}

  v-card-actions
    v-row
      v-col.text-end
        template(v-if="canEdit(delivery)")
          v-btn.primary--text(@click="getDelivery(delivery)" icon)
            v-icon mdi-pencil
          v-btn.error--text(@click="showDelete(delivery)" icon)
            v-icon mdi-trash-can

  dialog-delete(v-model="showDeleteDelivery" text="entrega"
  :doDelete="deleteDelivery")
</template>

<script>
import { deliveryUrl, fileUrl } from '~/mixins/routes'

export default {
  props: {
    delivery: {
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
    getDelivery: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      showDeleteDelivery: false
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
        this.form = (await this.$axios.$get(`${deliveryUrl}${item._id}`))
        this.showDeleteDelivery = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deleteDelivery () {
      try {
        const { message } = await this.$axios.$delete(
          `${deliveryUrl}${this.form._id}`)
        this.getData()
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    canEdit (item) {
      return this.$store.state.session.profiles.includes('Administrador') ||
        item.username === this.$store.state.session.username
    }
  }
}
</script>
