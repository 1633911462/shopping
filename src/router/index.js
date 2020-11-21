import Vue from 'vue'
import VueRouter from 'vue-router'
// 用户
import user from '@/views/consumer/user.vue'
import me from '@/components/consumer/me.vue'
import car from '@/components/consumer/car.vue'
import msg from '@/components/consumer/msg.vue'
import userIndex from '@/components/consumer/userIndex.vue'
import sp from '@/components/consumer/sp.vue'
import search from '@/components/consumer/searchView.vue'
import payment from '@/views/consumer/payment.vue'
import dpIndex from '@/views/consumer/dp.vue'
import history from '@/views/consumer/history.vue'
import address from '@/views/consumer/address.vue'
import addAddress from '@/views/consumer/addAddress.vue'
import userOrder from '@/views/consumer/userOrder.vue'
// 商家
import business from '@/views/business/index.vue'
import mySp from '@/components/business/mySp.vue'
import follow from '@/views/business/follow.vue'
import shopOrder from '@/views/business/shopOrder.vue'
// 申请成为商家
import apply from '@/views/business/apply.vue'
// 管理员
import adminIndex from '@/views/administrators/admin_index.vue'
// 管理员子页面集合
import dp from '@/views/administrators/dp.vue'
import rootOrder from '@/views/administrators/rootOrder.vue'
import userList from '@/views/administrators/user.vue'
// 登录注册
import login from '@/views/login.vue'
// 重置密码
import password from '@/views/password.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '用户首页',
    component: user,
    children: [
      {
        path: 'car',
        name: '购物车',
        component: car
      },
      {
        path: 'me',
        name: '我的',
        component: me
      },
      {
        path: '/',
        name: '首页',
        component: userIndex
      },
      {
        path: 'msg',
        name: '消息',
        component: msg
      }
    ]
  },
  {
    path: '/sp/:id',
    name: '商品',
    component: sp
  },
  {
    path: '/payment',
    name: '支付页面',
    component: payment
  },
  {
    path: '/userOrder',
    name: '我的订单',
    component: userOrder
  },
  {
    path: '/shopOrder',
    name: '商家订单',
    component: shopOrder
  },
  {
    path: '/dpIndex/:id',
    name: '商家首页',
    component: dpIndex
  },
  {
    path: '/follow/:id',
    name: '关注',
    component: follow
  },
  {
    path: '/history/:id',
    name: '足迹',
    component: history
  },
  {
    path: '/address',
    name: '收货地址',
    component: address
  },
  {
    path: '/addAddress',
    name: '添加收货地址',
    component: addAddress
  },
  {
    path: '/search/:name',
    name: '搜索结果',
    component: search
  },
  {
    path: '/business',
    name: '商家首页',
    component: business
  },
  {
    path: '/mySp',
    name: '商家首页',
    component: mySp
  },
  {
    path: '/apply',
    name: '申请成功商家',
    component: apply
  },
  {
    path: '/adminIndex',
    name: '后台管理首页',
    component: adminIndex
  },
  {
    path: '/rootOrder',
    name: '订单管理',
    component: rootOrder
  },
  {
    path: '/dpMsg',
    name: '店铺审核',
    component: dp
  },
  {
    path: '/userList',
    name: '用户列表',
    component: userList
  },
  {
    path: '/login',
    name: '登录',
    component: login
  },
  {
    path: '/password',
    name: '重置密码',
    component: password
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 返回到登录页面时
  if (to.path === '/login') {
    localStorage.removeItem('userName')
    next()
    return ''
  }
  // 从登录页面跳转到首页时
  if (from.path === '/login') {
    if (localStorage.userName || to.path === '/password') {
      next()
      return ''
    } else {
      next('/login')
      return ''
    }
  }
  next()
})
export default router
