<template lang="pug">
v-card.mx-auto.mt-4(rounded max-width="800px")
  v-card-text.px-0
    v-row.mx-3
      v-col.d-flex.align-center.justify-center(cols="12" md="1")
        v-icon mdi-account
      v-col.text-start(cols="12" md="11")
        span {{ activity.fullname }}
        p {{ $moment(activity.created_at) }}
      v-col(cols="12")
        p.subtitle.black--text {{ activity.title }}
        p.subtitle.black--text {{ activity.description }}
      template(v-if="activity.files")
        v-col(cols="12" v-for="file, index in activity.files"
        :key="`act.file${index}`")
          v-icon.primary--text.me-1 mdi-upload
          a(:href="`${downloadUrl}/${file._id}`" target="_blank")
            | {{ file.real_name }}
      template(v-if="activity.links")
        v-col(cols="12" v-for="link, index in activity.links"
        :key="`act.link${index}`")
          v-icon.primary--text.me-1 mdi-attachment
          a(:href="link.url" target="_blank") {{ link.shortcut }}

  v-card-actions
    v-row
      v-col.text-end
        v-btn(nuxt :to="`/board/activities/${activity._id}`" icon)
          v-icon mdi-eye
        template(v-if="canEdit(activity)")
          v-btn.primary--text(@click="getActivity(activity)" icon)
            v-icon mdi-pencil
          v-btn.error--text(@click="showDelete(activity)" icon)
            v-icon mdi-trash-can

  dialog-delete(v-model="showDeleteActivity" text="actividad"
  :doDelete="deleteActivity")
</template>

<script>
import { activityUrl, fileUrl } from '~/mixins/routes'
export default {
  props: {
    activity: {
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
    getActivity: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      showDeleteActivity: false
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
        this.form = (await this.$axios.$get(`${activityUrl}${item._id}`))
        this.showDeleteActivity = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deleteActivity () {
      try {
        const formData = new FormData()
        formData.append('status', false)
        const { message } = (await this.$axios.$patch(
            `${activityUrl}${this.form._id}`, formData))
        this.getData()
        this.showDeleteActivity = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    canEdit (item) {
      return this.$ability.can('update', 'Actividades') ||
        item.username === this.$store.state.session.username
    }
  }
}
</script>
