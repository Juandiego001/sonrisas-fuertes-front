<template lang="pug">
v-container.pt-0.align-center
  v-card.mx-auto(max-width="800px")
    v-img.align-end(src="/classroom.jpg" height="100px"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
      v-card-title.white--text.text-h5 Actividades

  v-card.mx-auto(flat max-width="800px")
    v-card-text.mx-0.px-0
      v-data-iterator(:items="items" :search="search"
      :itemsPerPage.sync="itemsPerPage"
      :footer-props="{itemsPerPageOptions: [3, 5, 7]}")
        template(#item="{ item }")
          card-activity(:item="item" :getData="getData"
          :getActivity="getActivity" :key="`activity.${item._id}`")

  dialog-activity(v-model="dialogEdit" :activity="form" :getData="getData")
  dialog-search(v-model="dialogSearch" :doSearch="doSearch")
</template>

<script>
import { activityUrl } from '~/mixins/routes'
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
  data () {
    return {
      items: [],
      search: '',
      itemsPerPage: 3,
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
    return { title: 'Activities' }
  },

  watch: {
    dialogEdit (value) {
      if (!value) {
        this.form = {
          _id: '',
          title: '',
          description: '',
          created_at: '',
          updated_by: '',
          updated_at: ''
        }
      }
    }
  },

  beforeMount () {
    this.moduleSlug = 'Actividades'
    this.getData()
  },

  methods: {
    async getData () {
      try {
        this.items = (await this.$axios.$get(activityUrl)).items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async getActivity (item) {
      try {
        this.form = await this.$axios.$get(`${activityUrl}${item._id}`)
        this.dialogEdit = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    doSearch (search) {
      this.search = search
      this.dialogSearch = false
    }
  }
}

</script>
