export default async function ({ redirect, $axios, app }) {
  try {
    const me = await $axios.$get('/api/account/profile')
    if (me.username) {
      // eslint-disable-next-line no-console
      console.log('LLEGO AQUI')
      app.router.push('/')
    }
  } catch (err) {
  }
}
