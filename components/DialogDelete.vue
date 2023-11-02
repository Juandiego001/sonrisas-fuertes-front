<template lang="pug">
v-dialog(:value="dialog" max-width="500px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown")
    v-card-title.error.white--text
      | Confirmar eliminación
      v-spacer
      v-btn.white--text(icon @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text.mt-3 ¿Seguro que desea eliminar el {{ text }}?
    v-card-actions
      v-spacer
      v-btn.error(@click="doDelete") Confirmar
</template>

<script>
export default {
  model: {
    prop: 'dialog',
    event: 'input'
  },
  props: {
    dialog: {
      default: false,
      type: Boolean
    },
    text: {
      default: '',
      type: String
    },
    doDelete: {
      default: () => {},
      type: Function
    }
  },
  data () {
    return {
    }
  }
}

</script>
