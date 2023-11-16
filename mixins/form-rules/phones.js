export default {
  computed: {
    phoneRules () {
      return [
        v => !v || /[0-9]/.test(v) || 'Teléfono inválido',
        v => !v || !(/([a-z])|-|\.|,/.test(v)) || 'Teléfono inválido'
      ]
    }
  }
}
