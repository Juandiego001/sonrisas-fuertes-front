export default async function ({ redirect, $axios, app }) {
  try {
    const me = await $axios.$get('/api/account/profile')
    if (me.username) {
      redirect(app.localePath('/'))
    }
  } catch (err) {
  }
}
