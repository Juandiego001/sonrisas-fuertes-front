<template lang="pug">
v-dialog(:value="dialog" max-width="600px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown"
@input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown")
    v-card-title.primary.white--text
      | Adjuntar enlaces
      v-spacer
      v-btn(color="white" icon @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text
      v-form(ref="form" @submit.prevent="saveLinks")
        v-row.mt-4(dense)
          v-col.primary--text(cols="12") Adjuntar enlaces
          v-col(cols="12")
            text-field(v-model="form.url" filled dense label="Enlace"
            :rules="generalRules")
          v-col(cols="12")
            v-text-field(v-model="form.shortcut" filled dense label="Acortado"
            :rules="generalRules" :append-outer-icon="'mdi-plus'"
            @click:append-outer="addLink")
          v-col.primary--text(v-if="urls.length" cols="12")
            | Enlaces a agregar
          v-col.d-flex(v-for="item, index in urls" :key="`url.${index}`"
          cols="12")
            a.text-decoration-none.subtitle(:href="item.url" target="_blank")
              | {{ item.shortcut }}
            v-spacer
            v-btn(color="error" icon @click="removeUrl(index)")
              v-icon mdi-trash-can
          v-col.mt-4.d-flex(cols="12")
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
    addLinks: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      urls: [],
      form: {
        shortcut: '',
        url: ''
      }
    }
  },

  watch: {
    dialog (value) {
      if (!value) {
        this.urls = []
        this.$refs.form && this.$refs.form.resetValidation()
        this.$refs.form && this.$refs.form.reset()
      }
    }
  },

  methods: {
    addLink () {
      if (!this.$refs.form.validate()) { return }
      this.urls.push(this.$clone(this.form))
      this.$refs.form.reset()
    },
    saveLinks () {
      this.addLinks(this.urls)
      this.$emit('input', false)
    },
    removeUrl (index) {
      this.urls.splice(index, 1)
    }
  }
}
</script>
