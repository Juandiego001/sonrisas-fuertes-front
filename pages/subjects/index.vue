<template>
  <div>
    Cursos
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  beforeMount () {
    // eslint-disable-next-line no-console
    console.log('puede', this.$ability.can('read', 'Materias'))
  }
}
</script>
