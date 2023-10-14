<template lang="pug">
v-dialog(:value="dialog" max-width="550px" scrollable
:fullscreen="$vuetify.breakpoint.smAndDown" @input="ev => $emit('input', ev)")
  v-card(flat :tile="$vuetify.breakpoint.smAndDown" scrollable)
    v-card-title.primary.white--text Agregar estudiantes
      v-spacer
      v-btn(fab small depressed color="primary"
      @click="$emit('input', false)")
        v-icon mdi-close
    v-card-text.py-3
      v-data-table(:headers="headers" :items="items" :items-per-page="15"
      :server-items-length="total" :options.sync="options"
      :footer-props="{itemsPerPageOptions:[5,10,15,20]}")
        template(#top)
          v-text-field.pb-2(v-model="search" placeholder="Buscar"
          append-icon="mdi-magnify" filled dense hide-details)
        template(#item.options="{ item }")
          v-btn.mr-2(color="primary" depressed icon
          @click="addStudentToGroup(item)")
            v-icon mdi-account-plus
</template>

<script>
import { studentUrl } from '~/mixins/routes'

export default {

  model: {
    prop: 'dialog',
    event: 'input'
  },

  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    groupid: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: new Array(0)
    }
  },

  data () {
    return {
      options: {},
      students: [],
      total: -1,
      search: '',
      dialogAddStudents: false
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Nombre', value: 'fullname' },
        { text: 'Usuario', value: 'username' },
        { text: 'Opciones', value: 'options' }
      ]
    }
  },

  methods: {
    async getData () {
      try {
        this.students = (await this.$axios.$get(`${studentUrl}group?`)).items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async addStudentToGroup (item) {
      try {
        // eslint-disable-next-line no-console
        console.log(this.groupid)
        item.groupid = this.groupid
        // eslint-disable-next-line no-console
        console.log(item)
        const { message } = await this.$axios.$patch(
          `${studentUrl}${item._id}`, item)
        this.getData()
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>
