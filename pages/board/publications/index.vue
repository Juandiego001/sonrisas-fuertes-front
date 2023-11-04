<template lang="pug">
v-container.pt-0.align-center
  v-card.mx-auto(max-width="800px")
    v-img.align-end(src="/classroom.jpg" height="100px"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
      v-card-title.white--text.text-h5 Publicaciones

  v-card.mx-auto(flat max-width="800px")
    v-card-text.mx-0.px-0
      v-data-iterator(:items="items" :search="search"
      :itemsPerPage.sync="itemsPerPage"
      :footer-props="{itemsPerPageOptions: [3, 5, 7]}")
        template(#item="{ item }")
          card-publication(:item="item" :getData="getData"
          :getPublication="getPublication" :key="`publication.${item._id}`")

  dialog-publication(v-model="dialogEdit" :publication="form"
  :getData="getData")
  dialog-search(v-model="dialogSearch" :doSearch="doSearch")
</template>

<script>
import { publicationUrl } from '~/mixins/routes'
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
    return { title: 'Publications' }
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
    this.moduleSlug = 'Publicaciones'
    // eslint-disable-next-line no-console
    console.log(this.moduleSlug)
    // eslint-disable-next-line no-console
    console.log('can read publicaciones', this.$ability.can('read', 'Publicaciones'))
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
    async getPublication (item) {
      try {
        this.form = await this.$axios.$get(`${publicationUrl}${item._id}`)
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
