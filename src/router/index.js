import Vue from 'vue'
import VueRouter from 'vue-router'
//导入Login组件
import Login from '@/views/Login.vue'
//导入Home组件
import Home from '@/views/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },//重定向到login
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
