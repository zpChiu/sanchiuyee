import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: r => require.ensure([], () => r(require('./pages/Home.vue')), 'Home')
  }
]

const router = new VueRouter({
  routes
})

export default router
