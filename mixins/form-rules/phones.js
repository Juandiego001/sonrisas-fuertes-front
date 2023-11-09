export default {
  computed: {
    phoneRules () {
      return [
        v => /[0-9]/.test(v) || 'Teléfono inválido',
        v => !(/([a-z])|-|\.|,/.test(v)) || 'Teléfono inválido'
      ]
    }
  }
}
