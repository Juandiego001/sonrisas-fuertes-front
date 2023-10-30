<template lang="pug">
v-dialog(:value="dialog" max-width="600px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown")
    v-card-title.primary.white--text
      | Adjuntar archivos
      v-spacer
      v-btn(color="white" icon @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text
      v-form(ref="form" @submit.prevent="saveFiles")
        v-row.mt-4(dense)
          v-col.primary--text(cols="12") Adjuntar archivos
          v-col(cols="12")
            v-file-input(v-model="files" label="Archivos"
            chips small-chips multiple :rules="generalRules")
        v-card-actions.pe-0
          v-spacer
          v-btn(color="primary" type="submit") Guardar
</template>

<script>
import generalRules from '~/mixins/form-rules/general-rules'

export default {
  mixins: [generalRules],
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

  watch: {
    dialog (value) {
      if (!value) {
        this.$refs.form && this.$refs.form.reset()
        this.$refs.form && this.$refs.form.resetValidation()
      }
    }
  },

  methods: {
    saveFiles () {
      if (!this.$refs.form.validate()) { return }
      this.addFiles(this.files)
      this.$emit('input', false)
    }
  }
}

</script>
