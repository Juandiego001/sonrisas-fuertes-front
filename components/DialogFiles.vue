<template lang="pug">
v-dialog(:value="dialog" max-width="600px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown"
@input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown")
    v-card-title.primary.white--text
      | Mis archivos
      v-spacer
      v-btn(color="white" icon @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text
      v-form(ref="form" @submit.prevent="saveFiles")
        v-row.mt-4(dense)
          v-col.primary--text(cols="12") Mis archivos
          v-col(cols="12")
            v-file-input(v-model="files" label="Agregar archivos"
            chips small-chips multiple)
        v-card-actions.pe-0
          v-spacer
          v-btn(color="primary" type="submit") Guardar
</template>

<script>
import { attachmentUrl } from '~/mixins/routes'

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
    addFiles: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      files: null
    }
  },

  methods: {
    async getFiles () {
      try {
        await this.$axios.$get(attachmentUrl)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    saveFiles () {
      // eslint-disable-next-line no-console
      console.log(this.files)
      this.addFiles(this.files)
      this.$emit('input', false)
    }
  }
}

</script>
