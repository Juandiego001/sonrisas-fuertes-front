<template lang="pug">
v-container.pt-0.align-center
    v-card.mx-auto(max-width="800px")
        v-img.align-end(src="classroom.jpg" height="100px"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)")
            v-card-title.white--text.text-h5 Tablero general

    v-card.mx-auto.mt-4.py-3(max-width="800px" rounded)
        v-card-text.px-0
            v-form(ref="form" @submit.prevent="savePublication")
                v-row(v-if="!showOptions")
                    v-col(cols="12")
                        v-icon.px-5 mdi-account
                        v-btn.primary--text(plain @click="showOptions=true")
                            |  Realizar una publicación
                v-row.mx-3.align-center(v-if="showOptions")
                    v-col(cols="12" md="12")
                        v-textarea(v-model="form.description" rows="2"
                        label="Descripción" auto-grow hide-details="auto")
                    v-col.d-flex(cols="12" md="12")
                        v-btn.me-2(icon)
                            v-icon.primary--text mdi-upload
                        v-btn(icon)
                            v-icon.primary--text mdi-attachment
                    v-col.d-flex(cols="12" md="12")
                        v-spacer
                        v-btn(type="submit").primary.me-3 Publicar
                        v-btn.primary--text(@click="showOptions=false") Cancelar

    v-card.mx-auto.mt-4.py-3(v-for="item in items"
    :key="`publication.${item._id}`" max-width="800px" rounded)
        v-card-text.px-0
            v-row.mx-3
                v-col.d-flex.align-center.justify-center(cols="12" md="1")
                    v-icon mdi-account
                v-col.text-start(cols="12" md="11")
                    span {{ item.fullname }}
                    p {{  $moment(item.created_at)  }}
                v-col(cols="12")
                    p.subtitle.black--text {{  item.description  }}
        v-card-actions(v-if="item.username == $store.state.session.username")
            v-row
                v-spacer
                v-btn.me-2.primary--text(@click="showUpdate(item)" icon)
                  v-icon mdi-pencil
                v-btn.error--text(@click="deletePublication(item)" icon)
                  v-icon mdi-trash-can

    v-dialog(v-model="showUpdatePublication" max-width="700px"
    :fullscreen="$vuetify.breakpoint.smAndDown" scrollable)
        v-card.pt-3(flat :tile="$vuetify.breakpoint.smAndDown")
            v-card-text.px-0
                v-form(ref="formUpdate" @submit.prevent="updatePublication")
                    v-row.mx-3.align-center
                        v-col.primary--text(cols="12") Editar publicación
                        v-col(cols="12" md="12")
                            v-textarea(v-model="form.description" rows="2"
                            label="Descripción" auto-grow hide-details="auto")
                        v-col.d-flex(cols="12" md="12")
                            v-btn.me-2(icon)
                                v-icon.primary--text mdi-upload
                            v-btn(icon)
                                v-icon.primary--text mdi-attachment
                        v-col.d-flex(cols="12" md="12")
                            v-spacer
                            v-btn(type="submit").primary.me-3 Publicar
                            v-btn.primary--text(
                            @click="showUpdatePublication=false") Cancelar

</template>

<script>
import { publicationUrl } from '~/mixins/routes'

export default {
  data () {
    return {
      showOptions: false,
      showUpdatePublication: false,
      items: [],
      form: {
        _id: '',
        description: '',
        updated_by: '',
        updated_at: ''
      }
    }
  },

  watch: {
    showUpdatePublication (value) {
      if (!value) {
        this.form = {
          _id: '',
          description: '',
          updated_by: '',
          updated_at: ''
        }
      }
    },
    showOptions (value) {
      if (!value) {
        this.form = {
          _id: '',
          description: '',
          updated_by: '',
          updated_at: ''
        }
      }
    }
  },

  beforeMount () {
    this.getData()
  },

  methods: {
    async getData () {
      try {
        this.items = (await this.$axios.$get(publicationUrl)).items
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async savePublication () {
      try {
        if (!this.$refs.form.validate()) { return }
        let message
        if (this.form._id) {
          ({ message } = await this.$axios.$patch(
            `${publicationUrl}${this.form._id}`, this.form))
        } else {
          ({ message } = await this.$axios.$post(publicationUrl, this.form))
        }
        this.getData()
        this.$refs.form.reset()
        this.showOptions = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async showUpdate (item) {
      try {
        this.form = (await this.$axios.$get(`${publicationUrl}${item._id}`))
        this.showUpdatePublication = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async updatePublication () {
      try {
        if (!this.$refs.formUpdate.validate()) { return }
        const { message } = await this.$axios.$patch(
                `${publicationUrl}${this.form._id}`, this.form)
        this.getData()
        this.$refs.formUpdate.reset()
        this.showUpdatePublication = false
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async deletePublication (item) {
      try {
        this.form = (await this.$axios.$get(`${publicationUrl}${item._id}`))
        this.form.status = false
        const { message } = (await this.$axios.$patch(
          `${publicationUrl}${item._id}`, this.form))
        this.getData()
        this.$refs.form.reset()
        this.showSnackbar(message)
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}

</script>
