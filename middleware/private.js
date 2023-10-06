// import { AbilityBuilder, Ability } from '@casl/ability'

export default async function ({ redirect, $axios, $ability, app, store }) {
  try {
    const epoch = Math.floor(Date.now() / 1000)
    const oldEpoch = store.state.session.epoch

    if (epoch - oldEpoch > 10) {
      const user = await $axios.$get('/api/account/profile')
      if (!user.username) {
        redirect('/account/login/')
      }
      store.commit('session/updateSession', { epoch, ...user })
      // eslint-disable-next-line no-console
      console.log(user.abilities)
      $ability.update(user.abilities)
      // eslint-disable-next-line no-console
      console.log($ability)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    redirect('/account/login/')
  }
}
