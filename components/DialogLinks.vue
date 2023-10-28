<template lang="pug">
v-dialog(:value="dialog" max-width="600px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown"
@input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown")
    v-card-title.primary.white--text
      | Enlaces
      v-spacer
      v-btn(color="white" icon @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text
      v-form(ref="form" @submit.prevent="saveLinks")
        v-row.mt-4(dense)
          v-col.primary--text(cols="12") Enlaces
          v-col(cols="12")
            v-text-field(v-model="url" filled dense label="Enlace"
            append-outer-icon="mdi-plus" @click:append-outer="addLink")
          v-col.primary--text(v-if="urls.length" cols="12")
            | Enlaces a agregar
          v-col.d-flex(v-for="item, index in urls" :key="`${url}.${index}`"
          cols="12")
            a(:href="item" target="_blank").subtitle {{ item }}
            v-spacer
            v-btn(icon @click="removeUrl(index)")
              v-icon mdi-close
        v-card-actions.pe-0
          v-spacer
          v-btn(color="primary" type="submit") Guardar
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
    addLinks: {
      default: () => {},
      type: Function
    }
  },

  data () {
    return {
      url: '',
      urls: []
    }
  },

  methods: {
    addLink () {
      this.urls.push(this.url)
      this.url = ''
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
