import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'muse-ui/lib/styles/base.less'
import {
  Picker,
  Icon,
  Form,
  DateInput,
  TextField,
  Button,
  Tooltip
} from 'muse-ui'
import 'muse-ui/lib/styles/theme.less'
import 'material-design-icons/iconfont/material-icons.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import indexDB from './js/indexDB'

Vue.config.productionTip = false

Vue.prototype.$db = indexDB

// Muse-UI
Vue.use(Picker)
Vue.use(Icon)
Vue.use(Form)
Vue.use(DateInput)
Vue.use(TextField)
Vue.use(Button)
Vue.use(Tooltip)
// Element-UI
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
