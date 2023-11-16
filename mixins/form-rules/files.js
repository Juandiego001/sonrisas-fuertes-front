export default {
  computed: {
    fileRules () {
      return [
        (files) => {
          if (files) {
            for (const file of files) {
              if (file.size > 20000000) {
                return 'El tamaño máximo de los archivos es 20 MB'
              }
            }
            return true
          } else { return 'Se debe agregar un archivo válido' }
        }
      ]
    }
  }
}
