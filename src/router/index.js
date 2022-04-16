import Vue from 'vue'
import VueRouter from 'vue-router'
//导入Login组件
import Login from '@/views/Login.vue'
//导入Home组件
import Home from '@/views/Home.vue'
//
import Welcome from '@/views/Welcome.vue'
//
import Users from '@/views/Users/Users.vue'
//
import Rights from '@/views/Rights/Rights.vue'
//
import Roles from '@/views/Roles/Roles.vue'
//
import GoodsCate from '@/views/goods_cate/GoodsCate.vue'
//
import Params from '@/views/Params/Params.vue'
//
import List from '@/views/List/List.vue'
//
import Add from '@/views/List/Add/Add.vue'
//
import Order from '@/views/order/Order.vue'
//
import Report from '@/views/Report/Report.vue'
Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },//重定向到login
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, children: [
      { path: '', component: Welcome },//开启默认子路由
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: GoodsCate },
      { path: '/params', component: Params },
      { path: '/goods', component: List, },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
