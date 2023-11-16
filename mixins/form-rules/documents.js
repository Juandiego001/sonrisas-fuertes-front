export default {
  computed: {
    documentRules () {
      return [
        v => !v || /[0-9]/.test(v) || 'Cédula inválida',
        v => !v || !(/([a-z])|-|\.|,/.test(v)) || 'Cédula inválida'
      ]
    }
  }
}
