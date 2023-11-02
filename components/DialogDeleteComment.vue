<template lang="pug">
v-dialog(:value="dialog" max-width="500px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
    v-card(flat :tile="$vuetify.breakpoint.smAndDown")
        v-card-title.error.white--text
            | Confirmar eliminación
            v-spacer
            v-btn.white--text(icon @click="$emit('input', false)")
                v-icon mdi-close
        v-card-text.mt-3 ¿Seguro que desea eliminar el comentario?
        v-card-actions
            v-spacer
            v-btn.error(@click="deleteComment") Confirmar
</template>

<script>
import { commentUrl } from '~/mixins/routes'

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
    getData: {
      default: () => {},
      type: Function
    },
    comment: {
      default: () => ({
        _id: '',
        publicationid: '',
        description: '',
        created_at: '',
        updated_at: '',
        updated_by: ''
      }),
      type: Object
    },
    deleteAll: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      text: '',
      form: {
        _id: '',
        publicationid: '',
        description: '',
        created_at: '',
        updated_at: '',
        updated_by: ''
      }
    }
  },

  methods: {
    async deleteComment () {
      try {
        this.form = this.comment
        let message
        if (this.deleteAll) {
          ({ message } = await this.$axios.$delete(
              `${commentUrl}${this.form._id}`))
        } else {
          this.form.status = false;
          ({ message } = await this.$axios.$patch(
              `${commentUrl}${this.form._id}`, this.form))
        }
        this.getData()
        this.$emit('input', false)
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}

</script>
