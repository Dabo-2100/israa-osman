import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import('../views/VerfiyView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('../views/PaymentView.vue')
  },
  {
    path: '/reset',
    name: 'reset',
    component: () => import('../views/ResetView.vue')
  },
  {
    path: '/consulting',
    name: 'consulting',
    component: () => import('../views/ConsultingView.vue')
  },
  {
    path: '/article/:article_id',
    name: 'article',
    component: () => import('../views/AnArticleView.vue')
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticlesView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/drchat',
    name: 'drchat',
    component: () => import('../views/DrChat.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'view404',
    component: () => import('../views/View404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router