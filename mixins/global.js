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
    }
  },

  methods: {
    ...mapMutations({
      showSnackbar: 'snackbar/show'
    })
  }
}
