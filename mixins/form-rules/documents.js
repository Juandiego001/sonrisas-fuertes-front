export default {
  computed: {
    documentRules () {
      return [
        v => /[0-9]/.test(v) || 'Cédula inválida',
        v => !(/([a-z])|-|\.|,/.test(v)) || 'Cédula inválida'
      ]
    }
  }
}
