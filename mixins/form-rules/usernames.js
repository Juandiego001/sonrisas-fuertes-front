export default {
  computed: {
    usernameRules () {
      return [
        v => (v && v.length >= 5) ||
          'Nombre de usuario muy corto',
        v => (v && v.length <= 20) ||
          'Nombre de usuario muy largo'
      ]
    }
  }
}
