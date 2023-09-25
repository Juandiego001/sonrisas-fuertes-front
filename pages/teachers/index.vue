<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="teachers"
      :server-items-length="total"
      :options.sync="options"
    >
      <!-- Bug v-slot https://stackoverflow.com/questions/61344980/v-slot-directive-doesnt-support-any-modifier -->
      <template #[`item.options`]="{ item }">
        <v-btn
          class="mr-2"
          color="success"
          depressed
          icon
          @click="getUser(item)"
        >
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          v-if="item.status === 'PENDING'"
          class="mr-2"
          depressed
          icon
          @click="resendLink(item)"
        >
          <v-icon>mdi-email-fast</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teachers: [{
        fullname: 'Juan Diego Cobo Cabal',
        username: 'juan_diego',
        email: 'juandiego14012003@gmail.com',
        status: 'ACTIVE'
      }],
      options: {},
      total: -1
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Profesor', align: 'center', value: 'fullname' },
        { text: 'Usuario', align: 'center', value: 'username' },
        { text: 'Email', align: 'center', value: 'email' },
        { text: 'Estado', align: 'center', value: 'status' },
        { text: 'Opciones', align: 'center', value: 'options' }
      ]
    }
  },

  watch: {
    options: { handler () { this.getData() } }
  },

  beforeMount () {
  },

  methods: {
    async getData () {
      // eslint-disable-next-line no-console
      await console.log('GET DATA')
    }
  }
}
</script>
