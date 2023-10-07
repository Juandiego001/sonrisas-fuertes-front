export default function ({ $axios, app }) {
  $axios.onRequest((config) => {
    const csrf = app.$cookies.get('csrf_access_token')
    if (['post', 'patch', 'put', 'delete'].includes(config.method) &&
    !process.server && csrf) {
      config.headers.common['X-CSRF-TOKEN'] = csrf
    }
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    const message = error.response.data
    if (code === 401 && message === 'Token has expired') {
      app.router.push('/account/login')
    }
  })
}
