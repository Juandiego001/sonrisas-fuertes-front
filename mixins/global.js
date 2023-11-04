import { mapMutations } from 'vuex'

export default {
  computed: {
    dialogEdit: {
      get () { return this.$store.state.app.dialogEdit },
      ...mapMutations({ set: 'app/setDialogEdit' })
    },
    dialogSearch: {
      get () { return this.$store.state.app.dialogSearch },
      ...mapMutations({ set: 'app/setDialogSearch' })
    },
    moduleSlug: {
      get () { return this.$store.state.app.moduleSlug },
      ...mapMutations({ set: 'app/moduleSlug' })
    },
    canSearch () {
      return this.$ability.can('read', this.moduleSlug)
    },
    canCreate () {
      return this.moduleSlug !== 'Entregas' &&
        this.$ability.can('create', this.moduleSlug)
    }
  },

  methods: {
    ...mapMutations({
      showSnackbar: 'snackbar/show'
    })
  }
}
