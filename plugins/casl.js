import { abilitiesPlugin } from '@casl/vue'

// Setup casl https://casl.js.org/v6/en/package/casl-vue
export default (_, inject) => {
  inject('ability', abilitiesPlugin)
}
