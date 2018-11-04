import Vue from 'vue'
import Router from 'vue-router'
import Hanzi from '@/components/Hanzi'
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hanzi',
      component: Hanzi
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
