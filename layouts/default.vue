<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      dark
      class="primary"
    >
      <v-row class="py-4">
        <v-col class="text-center pb-0" cols="12" md="12">
          <v-avatar>
            <template v-if="session.photo">
              <v-img
                :src="photoUrl"
                alt="Avatar"
              />
            </template>
            <template v-else>
              <v-icon large>
                mdi-account-circle-outline
              </v-icon>
            </template>
          </v-avatar>
        </v-col>
        <v-col class="white--text text-center pb-0" cols="12" md="12">
          <p class="mb-0">
            Juan Diego Cobo Cabal
          </p>
        </v-col>
        <v-col class="text-center pb-0" cols="6">
          <v-btn class="primary white--text" @click="showProfile">
            Perfil
          </v-btn>
        </v-col>
        <v-col class="text-center" cols="6">
          <v-btn class="error white--text" @click="logout">
            <v-icon class="white--text">
              mdi-logout
            </v-icon>
            Salir
          </v-btn>
        </v-col>
      </v-row>
      <v-list>
        <v-list-item link to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-for="(item, i) in multipleOptions"
          :key="item.text + '' + i"
          active-class="accent--text"
        >
          <template #activator>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(option, j) in item.items"
            :key="option.title + '' + j"
            :to="option.to"
          >
            <v-list-item-icon>
              <v-icon class="white--text">
                {{ option.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text">
              {{ option.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-for="(item, i) in singleOptions"
          :key="item.title + '' + i"
          link
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon class="white--text">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      class="primary"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <NuxtLink class="white--text text-decoration-none" to="/">
          Sonrisas Fuertes
        </NuxtLink>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
      >
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn
        icon
      >
        <v-icon>
          mdi-message-text-outline
        </v-icon>
      </v-btn>
      <v-btn
        icon
      >
        <v-icon>
          mdi-bell-outline
        </v-icon>
      </v-btn>
      <v-btn
        icon
        @click="dialogEdit=true"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-snackbar v-model="snackbar" multi-line :color="$store.state.snackbar.type">
      {{ $store.state.snackbar.text }}
      <template #action>
        <v-btn icon @click="snackbar=false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <dialog-profile v-model="dialogProfile" :profile="profile" />
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import menu from './menu'
import { photoUrl, profileUrl, logoutUrl } from '~/mixins/routes'

export default {
  name: 'DefaultLayout',
  middleware: 'private',
  data () {
    return {
      dialogProfile: false,
      profile: {},
      drawer: false
    }
  },

  computed: {
    multipleOptions: { get () { return menu.multipleOptions } },
    singleOptions: { get () { return menu.singleOptions } },
    session () { return { ...this.$store.state.session } },
    snackbar: {
      get () { return this.$store.state.snackbar.snackbar },
      ...mapMutations({ set: 'snackbar/snackbar' })
    },
    photoUrl () { return `${photoUrl}/${this.session.photoUrl}` }
  },

  methods: {
    async showProfile () {
      try {
        const data = await this.$axios.$get(profileUrl)
        this.profile = data
        this.dialogProfile = true
      } catch (err) {
        this.showSnackbar(err)
      }
    },
    async logout () {
      try {
        const { message } = await this.$axios.$get(logoutUrl)
        this.showSnackbar(message)
        this.$router.push('/account/login')
      } catch (err) {
        this.showSnackbar(err)
      }
    }
  }
}
</script>

<style>
html { overflow-y: auto !important }
</style>
