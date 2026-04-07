import { createRouter, createWebHashHistory } from '@ionic/vue-router';  // เปลี่ยนตรงนี้
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/add'
  },
  {
    path: '/add',
    component: () => import('@/views/AddExpense.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  },
  {
    path: "/list",
    component: () => import("@/views/ListPage.vue")
  },
  {
    path: "/edit/:id",
    component: () => import("@/views/EditExpense.vue")
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),  // เปลี่ยนตรงนี้
  routes
})

export default router