export const state = () => ({
  snackbar: false,
  text: '',
  type: 'success'
})

export const mutations = {
  snackbar (state, value) {
    state.snackbar = value
  },
  show (state, value) {
    state.type = 'success'

    if (typeof value === 'string') {
      state.text = value
    } else {
      state.text = value.response ? value.response.data.message : 'Error'
      if (value.response && value.response.status !== 200) {
        state.type = 'error'
      }
    }
    state.snackbar = true
  }
}
